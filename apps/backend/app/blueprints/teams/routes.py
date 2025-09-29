"""Team management routes."""
import logging
from flask import jsonify, request, redirect
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from sqlalchemy import or_
from datetime import datetime, timedelta
import uuid

# Configure logging
logger = logging.getLogger(__name__)

from . import teams_bp
from app.extensions import db
from app.models.team import Team, TeamMember
from app.models.user import User
from app.models.department import Department, UserDepartment
from app.models.invitation import TeamInvitation
from app.services.email_service import EmailService
from app.services.token_service import generate_token


def _user_can_manage_team(user_id, team_id):
    """Check if user can manage team (owner or admin)."""
    membership = TeamMember.query.filter_by(
        user_id=user_id,
        team_id=team_id
    ).first()
    
    if not membership:
        return False
    
    team = Team.query.get(team_id)
    return (team and team.created_by == user_id) or membership.role in ['owner', 'admin']


@teams_bp.route('/', methods=['GET'])
@jwt_required()
def list_teams():
    """List teams for the current user."""
    try:
        logger.info("=== TEAMS LIST START ===")
        user_id = get_jwt_identity()
        logger.info(f"JWT Identity: {user_id} (type: {type(user_id)})")
        
        # Check if user exists in database
        user = User.query.get(user_id)
        logger.info(f"User lookup result: {user}")
        if not user:
            logger.error(f"User with ID {user_id} not found in database!")
            return jsonify({"error": "User not found"}), 422
        
        # Get teams where user is a member
        logger.info("Fetching user teams")
        teams = Team.query.join(TeamMember).filter(
            TeamMember.user_id == user_id
        ).all()
        logger.info(f"Found {len(teams)} teams for user")
        
        return jsonify({'teams': [team.to_dict() for team in teams]})
        
    except Exception as e:
        logger.error(f"Teams list error: {e}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        return jsonify({"error": f"Teams error: {str(e)}"}), 422


@teams_bp.route('/', methods=['POST'])
@jwt_required()
def create_team():
    """Create a new team."""
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    
    name = data.get('name', '').strip()
    if not name:
        return jsonify({'error': 'Team name is required'}), 400
    
    # Create team
    team = Team(
        name=name,
        description=data.get('description', ''),
        created_by=user_id
    )
    db.session.add(team)
    db.session.flush()  # Get the team ID
    
    # Add creator as owner
    membership = TeamMember(
        team_id=team.id,
        user_id=user_id,
        role='owner'
    )
    db.session.add(membership)
    db.session.commit()
    
    return jsonify(team.to_dict()), 201


@teams_bp.route('/<int:team_id>', methods=['GET'])
@jwt_required()
def get_team(team_id):
    """Get team details."""
    user_id = get_jwt_identity()
    
    # Check if user is a member
    membership = TeamMember.query.filter_by(
        user_id=user_id,
        team_id=team_id
    ).first()
    
    if not membership:
        return jsonify({'error': 'Access denied'}), 403
    
    team = Team.query.get(team_id)
    if not team:
        return jsonify({'error': 'Team not found'}), 404
    
    # Include members and departments
    team_dict = team.to_dict()
    team_dict['members'] = [member.to_dict() for member in team.members]
    team_dict['departments'] = [dept.to_dict() for dept in team.departments]
    
    return jsonify(team_dict)


@teams_bp.route('/<int:team_id>', methods=['PUT'])
@jwt_required()
def update_team(team_id):
    """Update team details."""
    user_id = get_jwt_identity()
    
    if not _user_can_manage_team(user_id, team_id):
        return jsonify({'error': 'Access denied'}), 403
    
    team = Team.query.get(team_id)
    if not team:
        return jsonify({'error': 'Team not found'}), 404
    
    data = request.get_json() or {}
    
    if 'name' in data:
        name = data['name'].strip()
        if not name:
            return jsonify({'error': 'Team name is required'}), 400
        team.name = name
    
    if 'description' in data:
        team.description = data['description']
    
    db.session.commit()
    return jsonify(team.to_dict())


@teams_bp.route('/<int:team_id>/members', methods=['POST'])
@jwt_required()
def add_team_member(team_id):
    """
    Add a member to the team directly (for existing users only).
    For email invitations, use the /invite endpoint instead.
    """
    user_id = get_jwt_identity()
    
    if not _user_can_manage_team(user_id, team_id):
        return jsonify({'error': 'Access denied'}), 403
    
    team = Team.query.get(team_id)
    if not team:
        return jsonify({'error': 'Team not found'}), 404
    
    data = request.get_json() or {}
    member_email = data.get('email', '').strip().lower()
    role = data.get('role', 'member')
    
    if not member_email:
        return jsonify({'error': 'Email is required'}), 400
    
    # Find user by email
    user = User.query.filter_by(email=member_email).first()
    if not user:
        return jsonify({
            'error': 'User not found', 
            'suggestion': 'Use /invite endpoint to send email invitation'
        }), 404
    
    # Check if already a member
    existing = TeamMember.query.filter_by(
        team_id=team_id,
        user_id=user.id
    ).first()
    
    if existing:
        return jsonify({'error': 'User is already a team member'}), 400
    
    # Add member
    membership = TeamMember(
        team_id=team_id,
        user_id=user.id,
        role=role
    )
    db.session.add(membership)
    db.session.commit()
    
    return jsonify(membership.to_dict()), 201


@teams_bp.route('/<int:team_id>/members/<int:user_id>', methods=['DELETE'])
@jwt_required()
def remove_team_member(team_id, user_id):
    """Remove a member from the team."""
    current_user_id = get_jwt_identity()
    
    if not _user_can_manage_team(current_user_id, team_id):
        return jsonify({'error': 'Access denied'}), 403
    
    team = Team.query.get(team_id)
    if not team:
        return jsonify({'error': 'Team not found'}), 404
    
    # Prevent removing the team owner
    if team.created_by == user_id:
        return jsonify({'error': 'Cannot remove team owner'}), 400
    
    membership = TeamMember.query.filter_by(
        team_id=team_id,
        user_id=user_id
    ).first()
    
    if not membership:
        return jsonify({'error': 'User is not a team member'}), 404
    
    db.session.delete(membership)
    db.session.commit()
    
    return jsonify({'message': 'Member removed successfully'})


@teams_bp.route('/<int:team_id>/members/<int:user_id>/role', methods=['PATCH'])
@jwt_required()
def update_member_role(team_id, user_id):
    """Update a team member's role."""
    current_user_id = get_jwt_identity()
    
    if not _user_can_manage_team(current_user_id, team_id):
        return jsonify({'error': 'Access denied'}), 403
    
    team = Team.query.get(team_id)
    if not team:
        return jsonify({'error': 'Team not found'}), 404
    
    # Prevent changing owner role
    if team.created_by == user_id:
        return jsonify({'error': 'Cannot change team owner role'}), 400
    
    membership = TeamMember.query.filter_by(
        team_id=team_id,
        user_id=user_id
    ).first()
    
    if not membership:
        return jsonify({'error': 'User is not a team member'}), 404
    
    data = request.get_json() or {}
    new_role = data.get('role')
    
    if not new_role or new_role not in ['admin', 'member']:
        return jsonify({'error': 'Invalid role'}), 400
    
    membership.role = new_role
    db.session.commit()
    
    return jsonify(membership.to_dict())


@teams_bp.route('/<int:team_id>/members', methods=['GET'])
@jwt_required()
def list_team_members(team_id):
    """List team members."""
    user_id = get_jwt_identity()
    
    # Check if user is a member
    membership = TeamMember.query.filter_by(
        user_id=user_id,
        team_id=team_id
    ).first()
    
    if not membership:
        return jsonify({'error': 'Access denied'}), 403
    
    team = Team.query.get(team_id)
    if not team:
        return jsonify({'error': 'Team not found'}), 404
    
    members = TeamMember.query.filter_by(team_id=team_id).all()
    
    return jsonify({
        'members': [member.to_dict() for member in members]
    })


# Department Management Routes

@teams_bp.route('/<int:team_id>/departments', methods=['POST'])
@jwt_required()
def create_department(team_id):
    """Create a department within a team."""
    user_id = get_jwt_identity()
    
    if not _user_can_manage_team(user_id, team_id):
        return jsonify({'error': 'Access denied'}), 403
    
    team = Team.query.get(team_id)
    if not team:
        return jsonify({'error': 'Team not found'}), 404
    
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    
    if not name:
        return jsonify({'error': 'Department name is required'}), 400
    
    # Check if department name already exists in team
    existing = Department.query.filter_by(
        name=name,
        team_id=team_id
    ).first()
    
    if existing:
        return jsonify({'error': 'Department name already exists in this team'}), 400
    
    department = Department(
        name=name,
        description=data.get('description', ''),
        team_id=team_id
    )
    
    db.session.add(department)
    db.session.commit()
    
    return jsonify(department.to_dict()), 201


@teams_bp.route('/<int:team_id>/departments', methods=['GET'])
@jwt_required()
def list_departments(team_id):
    """List departments in a team."""
    user_id = get_jwt_identity()
    
    # Check if user is a member
    membership = TeamMember.query.filter_by(
        user_id=user_id,
        team_id=team_id
    ).first()
    
    if not membership:
        return jsonify({'error': 'Access denied'}), 403
    
    team = Team.query.get(team_id)
    if not team:
        return jsonify({'error': 'Team not found'}), 404
    
    departments = Department.query.filter_by(team_id=team_id).all()
    
    return jsonify({
        'departments': [dept.to_dict() for dept in departments]
    })


@teams_bp.route('/<int:team_id>/departments/<int:dept_id>', methods=['PUT'])
@jwt_required()
def update_department(team_id, dept_id):
    """Update a department."""
    user_id = get_jwt_identity()
    
    if not _user_can_manage_team(user_id, team_id):
        return jsonify({'error': 'Access denied'}), 403
    
    department = Department.query.filter_by(
        id=dept_id,
        team_id=team_id
    ).first()
    
    if not department:
        return jsonify({'error': 'Department not found'}), 404
    
    data = request.get_json() or {}
    
    if 'name' in data:
        name = data['name'].strip()
        if not name:
            return jsonify({'error': 'Department name is required'}), 400
        
        # Check if new name conflicts
        existing = Department.query.filter(
            Department.name == name,
            Department.team_id == team_id,
            Department.id != dept_id
        ).first()
        
        if existing:
            return jsonify({'error': 'Department name already exists in this team'}), 400
        
        department.name = name
    
    if 'description' in data:
        department.description = data['description']
    
    db.session.commit()
    return jsonify(department.to_dict())


@teams_bp.route('/<int:team_id>/departments/<int:dept_id>', methods=['DELETE'])
@jwt_required()
def delete_department(team_id, dept_id):
    """Delete a department."""
    user_id = get_jwt_identity()
    
    if not _user_can_manage_team(user_id, team_id):
        return jsonify({'error': 'Access denied'}), 403
    
    department = Department.query.filter_by(
        id=dept_id,
        team_id=team_id
    ).first()
    
    if not department:
        return jsonify({'error': 'Department not found'}), 404
    
    db.session.delete(department)
    db.session.commit()
    
    return jsonify({'message': 'Department deleted successfully'})


@teams_bp.route('/<int:team_id>/departments/<int:dept_id>/members', methods=['POST'])
@jwt_required()
def assign_user_to_department(team_id, dept_id):
    """Assign a user to a department."""
    user_id = get_jwt_identity()
    
    if not _user_can_manage_team(user_id, team_id):
        return jsonify({'error': 'Access denied'}), 403
    
    department = Department.query.filter_by(
        id=dept_id,
        team_id=team_id
    ).first()
    
    if not department:
        return jsonify({'error': 'Department not found'}), 404
    
    data = request.get_json() or {}
    target_user_id = data.get('user_id')
    
    if not target_user_id:
        return jsonify({'error': 'User ID is required'}), 400
    
    # Verify user is a team member
    team_membership = TeamMember.query.filter_by(
        team_id=team_id,
        user_id=target_user_id
    ).first()
    
    if not team_membership:
        return jsonify({'error': 'User is not a team member'}), 400
    
    # Check if already assigned
    existing = UserDepartment.query.filter_by(
        user_id=target_user_id,
        department_id=dept_id
    ).first()
    
    if existing:
        return jsonify({'error': 'User is already assigned to this department'}), 400
    
    # Create assignment
    assignment = UserDepartment(
        user_id=target_user_id,
        department_id=dept_id
    )
    
    db.session.add(assignment)
    db.session.commit()
    
    return jsonify(assignment.to_dict()), 201


@teams_bp.route('/<int:team_id>/departments/<int:dept_id>/members/<int:target_user_id>', methods=['DELETE'])
@jwt_required()
def remove_user_from_department(team_id, dept_id, target_user_id):
    """Remove a user from a department."""
    user_id = get_jwt_identity()
    
    if not _user_can_manage_team(user_id, team_id):
        return jsonify({'error': 'Access denied'}), 403
    
    department = Department.query.filter_by(
        id=dept_id,
        team_id=team_id
    ).first()
    
    if not department:
        return jsonify({'error': 'Department not found'}), 404
    
    assignment = UserDepartment.query.filter_by(
        user_id=target_user_id,
        department_id=dept_id
    ).first()
    
    if not assignment:
        return jsonify({'error': 'User is not assigned to this department'}), 404
    
    db.session.delete(assignment)
    db.session.commit()
    
    return jsonify({'message': 'User removed from department successfully'})


@teams_bp.route('/<int:team_id>/departments/<int:dept_id>/members', methods=['GET'])
@jwt_required()
def list_department_members(team_id, dept_id):
    """List members of a department."""
    user_id = get_jwt_identity()
    
    # Check if user is a team member
    membership = TeamMember.query.filter_by(
        user_id=user_id,
        team_id=team_id
    ).first()
    
    if not membership:
        return jsonify({'error': 'Access denied'}), 403
    
    department = Department.query.filter_by(
        id=dept_id,
        team_id=team_id
    ).first()
    
    if not department:
        return jsonify({'error': 'Department not found'}), 404
    
    assignments = UserDepartment.query.filter_by(department_id=dept_id).all()
    
    return jsonify({
        'members': [assignment.to_dict() for assignment in assignments]
    })


# Team Invitation Routes

@teams_bp.route('/<int:team_id>/invite', methods=['POST'])
@jwt_required()
def invite_to_team(team_id):
    """Send an email invitation to join a team."""
    user_id = get_jwt_identity()
    
    if not _user_can_manage_team(user_id, team_id):
        return jsonify({'error': 'Access denied'}), 403
    
    team = Team.query.get(team_id)
    if not team:
        return jsonify({'error': 'Team not found'}), 404
    
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    role = data.get('role', 'member')
    
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    
    # Check if user is already a member
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        existing_member = TeamMember.query.filter_by(
            team_id=team_id,
            user_id=existing_user.id
        ).first()
        if existing_member:
            return jsonify({'error': 'User is already a team member'}), 400
    
    # Check for existing pending invitation
    existing_invitation = TeamInvitation.query.filter_by(
        email=email,
        team_id=team_id,
        status='pending'
    ).first()
    
    if existing_invitation and not existing_invitation.is_expired:
        return jsonify({'error': 'Invitation already sent to this email'}), 400
    
    # Revoke expired invitation if exists
    if existing_invitation and existing_invitation.is_expired:
        existing_invitation.mark_expired()
    
    # Create new invitation
    invitation_token = str(uuid.uuid4())
    invitation = TeamInvitation(
        email=email,
        team_id=team_id,
        role=role,
        token=invitation_token,
        invited_by=user_id
    )
    
    db.session.add(invitation)
    db.session.commit()
    
    # Send invitation email
    inviter = User.query.get(user_id)
    accept_url = f"{request.host_url}api/teams/invitations/{invitation_token}/accept"
    
    email_sent = EmailService.send_team_invitation(
        email=email,
        team_name=team.name,
        team_description=team.description or '',
        role=role,
        inviter_email=inviter.email,
        accept_url=accept_url,
        expires_at=invitation.expires_at
    )
    
    if not email_sent:
        db.session.delete(invitation)
        db.session.commit()
        return jsonify({'error': 'Failed to send invitation email'}), 500
    
    return jsonify(invitation.to_dict()), 201


@teams_bp.route('/invitations/<string:token>/accept', methods=['GET'])
def accept_invitation(token):
    """Accept a team invitation via token."""
    invitation = TeamInvitation.query.filter_by(token=token).first()
    
    if not invitation:
        return jsonify({'error': 'Invalid invitation token'}), 404
    
    if invitation.status != 'pending':
        return jsonify({'error': f'Invitation is {invitation.status}'}), 400
    
    if invitation.is_expired:
        invitation.mark_expired()
        db.session.commit()
        return jsonify({'error': 'Invitation has expired'}), 400
    
    # Check if user exists
    user = User.query.filter_by(email=invitation.email).first()
    
    if not user:
        # Redirect to registration with invitation token
        frontend_url = request.args.get('redirect') or 'http://localhost:5173'
        return redirect(f"{frontend_url}/register?invitation={token}")
    
    # Check if already a member (edge case)
    existing_member = TeamMember.query.filter_by(
        team_id=invitation.team_id,
        user_id=user.id
    ).first()
    
    if existing_member:
        invitation.mark_accepted()
        db.session.commit()
        return jsonify({'message': 'You are already a member of this team'}), 200
    
    # Add user to team
    membership = TeamMember(
        team_id=invitation.team_id,
        user_id=user.id,
        role=invitation.role
    )
    
    invitation.mark_accepted()
    
    db.session.add(membership)
    db.session.commit()
    
    # Redirect to frontend with success
    frontend_url = request.args.get('redirect') or 'http://localhost:5173'
    return redirect(f"{frontend_url}/dashboard?joined={invitation.team.name}")


@teams_bp.route('/<int:team_id>/invitations', methods=['GET'])
@jwt_required()
def list_team_invitations(team_id):
    """List pending invitations for a team."""
    user_id = get_jwt_identity()
    
    if not _user_can_manage_team(user_id, team_id):
        return jsonify({'error': 'Access denied'}), 403
    
    team = Team.query.get(team_id)
    if not team:
        return jsonify({'error': 'Team not found'}), 404
    
    invitations = TeamInvitation.query.filter_by(
        team_id=team_id,
        status='pending'
    ).all()
    
    # Mark expired invitations
    for invitation in invitations:
        if invitation.is_expired:
            invitation.mark_expired()
    
    db.session.commit()
    
    # Re-query to get only non-expired pending invitations
    pending_invitations = TeamInvitation.query.filter_by(
        team_id=team_id,
        status='pending'
    ).all()
    
    return jsonify({
        'invitations': [inv.to_dict() for inv in pending_invitations]
    })


@teams_bp.route('/invitations/<int:invitation_id>/resend', methods=['POST'])
@jwt_required()
def resend_invitation(invitation_id):
    """Resend a team invitation."""
    user_id = get_jwt_identity()
    
    invitation = TeamInvitation.query.get(invitation_id)
    if not invitation:
        return jsonify({'error': 'Invitation not found'}), 404
    
    if not _user_can_manage_team(user_id, invitation.team_id):
        return jsonify({'error': 'Access denied'}), 403
    
    if invitation.status != 'pending':
        return jsonify({'error': f'Cannot resend {invitation.status} invitation'}), 400
    
    # Generate new token and extend expiration
    invitation.token = str(uuid.uuid4())
    invitation.expires_at = datetime.utcnow() + timedelta(days=7)
    invitation.created_at = datetime.utcnow()
    
    db.session.commit()
    
    # Send email
    inviter = User.query.get(user_id)
    accept_url = f"{request.host_url}api/teams/invitations/{invitation.token}/accept"
    
    email_sent = EmailService.send_team_invitation(
        email=invitation.email,
        team_name=invitation.team.name,
        team_description=invitation.team.description or '',
        role=invitation.role,
        inviter_email=inviter.email,
        accept_url=accept_url,
        expires_at=invitation.expires_at
    )
    
    if not email_sent:
        return jsonify({'error': 'Failed to resend invitation email'}), 500
    
    return jsonify(invitation.to_dict())


@teams_bp.route('/invitations/<int:invitation_id>/revoke', methods=['DELETE'])
@jwt_required()
def revoke_invitation(invitation_id):
    """Revoke a team invitation."""
    user_id = get_jwt_identity()
    
    invitation = TeamInvitation.query.get(invitation_id)
    if not invitation:
        return jsonify({'error': 'Invitation not found'}), 404
    
    if not _user_can_manage_team(user_id, invitation.team_id):
        return jsonify({'error': 'Access denied'}), 403
    
    if invitation.status != 'pending':
        return jsonify({'error': f'Cannot revoke {invitation.status} invitation'}), 400
    
    invitation.mark_revoked()
    db.session.commit()
    
    return jsonify({'message': 'Invitation revoked successfully'})

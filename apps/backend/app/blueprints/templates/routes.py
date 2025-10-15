"""Project template routes."""
from datetime import datetime, timedelta
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from . import templates_bp
from app.extensions import db
from app.models.project_template import ProjectTemplate, ProjectMilestone
from app.models.project import Project
from app.models.task import Task
from app.models.team import Team, TeamMember


@templates_bp.route('/', methods=['GET'])
@jwt_required()
def list_templates():
    """List available project templates."""
    user_id = int(get_jwt_identity())
    
    # Get user's teams
    user_teams = TeamMember.query.filter_by(user_id=user_id).all()
    team_ids = [tm.team_id for tm in user_teams]
    
    # Get public templates and team-specific templates
    templates = ProjectTemplate.query.filter(
        db.or_(
            ProjectTemplate.is_public == True,
            ProjectTemplate.team_id.in_(team_ids),
            ProjectTemplate.created_by == user_id
        )
    ).all()
    
    # Apply category filter if provided
    category = request.args.get('category')
    if category:
        templates = [t for t in templates if t.category == category]
    
    return jsonify({
        'templates': [template.to_dict() for template in templates]
    })


@templates_bp.route('/', methods=['POST'])
@jwt_required()
def create_template():
    """Create a new project template."""
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    
    name = data.get('name', '').strip()
    if not name:
        return jsonify({'error': 'Template name is required'}), 400
    
    # If team_id is provided, verify user has access
    team_id = data.get('team_id')
    if team_id:
        membership = TeamMember.query.filter_by(
            user_id=user_id,
            team_id=team_id
        ).first()
        
        if not membership or membership.role not in ['owner', 'admin']:
            return jsonify({'error': 'Only team managers can create team templates'}), 403
    
    # Create template
    template = ProjectTemplate(
        name=name,
        description=data.get('description', ''),
        category=data.get('category', 'General'),
        default_tasks=data.get('default_tasks', []),
        default_milestones=data.get('default_milestones', []),
        default_duration_days=data.get('default_duration_days'),
        is_public=data.get('is_public', False),
        team_id=team_id,
        created_by=user_id
    )
    
    db.session.add(template)
    db.session.commit()
    
    return jsonify(template.to_dict()), 201


@templates_bp.route('/<int:template_id>', methods=['GET'])
@jwt_required()
def get_template(template_id):
    """Get a specific project template."""
    user_id = int(get_jwt_identity())
    
    template = ProjectTemplate.query.get(template_id)
    if not template:
        return jsonify({'error': 'Template not found'}), 404
    
    # Check access
    if not template.is_public:
        if template.team_id:
            membership = TeamMember.query.filter_by(
                user_id=user_id,
                team_id=template.team_id
            ).first()
            if not membership and template.created_by != user_id:
                return jsonify({'error': 'Access denied'}), 403
        elif template.created_by != user_id:
            return jsonify({'error': 'Access denied'}), 403
    
    return jsonify(template.to_dict())


@templates_bp.route('/<int:template_id>', methods=['PUT'])
@jwt_required()
def update_template(template_id):
    """Update a project template."""
    user_id = int(get_jwt_identity())
    
    template = ProjectTemplate.query.get(template_id)
    if not template:
        return jsonify({'error': 'Template not found'}), 404
    
    # Check if user can edit
    can_edit = False
    if template.created_by == user_id:
        can_edit = True
    elif template.team_id:
        membership = TeamMember.query.filter_by(
            user_id=user_id,
            team_id=template.team_id
        ).first()
        if membership and membership.role in ['owner', 'admin']:
            can_edit = True
    
    if not can_edit:
        return jsonify({'error': 'Access denied'}), 403
    
    data = request.get_json() or {}
    
    if 'name' in data:
        template.name = data['name'].strip()
    if 'description' in data:
        template.description = data['description']
    if 'category' in data:
        template.category = data['category']
    if 'default_tasks' in data:
        template.default_tasks = data['default_tasks']
    if 'default_milestones' in data:
        template.default_milestones = data['default_milestones']
    if 'default_duration_days' in data:
        template.default_duration_days = data['default_duration_days']
    if 'is_public' in data:
        template.is_public = data['is_public']
    
    db.session.commit()
    return jsonify(template.to_dict())


@templates_bp.route('/<int:template_id>', methods=['DELETE'])
@jwt_required()
def delete_template(template_id):
    """Delete a project template."""
    user_id = int(get_jwt_identity())
    
    template = ProjectTemplate.query.get(template_id)
    if not template:
        return jsonify({'error': 'Template not found'}), 404
    
    # Check if user can delete
    can_delete = False
    if template.created_by == user_id:
        can_delete = True
    elif template.team_id:
        membership = TeamMember.query.filter_by(
            user_id=user_id,
            team_id=template.team_id
        ).first()
        if membership and membership.role in ['owner', 'admin']:
            can_delete = True
    
    if not can_delete:
        return jsonify({'error': 'Access denied'}), 403
    
    db.session.delete(template)
    db.session.commit()
    
    return jsonify({'message': 'Template deleted successfully'})


@templates_bp.route('/<int:template_id>/use', methods=['POST'])
@jwt_required()
def use_template(template_id):
    """Create a new project from a template."""
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    
    template = ProjectTemplate.query.get(template_id)
    if not template:
        return jsonify({'error': 'Template not found'}), 404
    
    # Check access to template
    if not template.is_public:
        if template.team_id:
            membership = TeamMember.query.filter_by(
                user_id=user_id,
                team_id=template.team_id
            ).first()
            if not membership and template.created_by != user_id:
                return jsonify({'error': 'Access denied to template'}), 403
    
    # Validate project details
    project_name = data.get('project_name', '').strip()
    if not project_name:
        return jsonify({'error': 'Project name is required'}), 400
    
    team_id = data.get('team_id')
    if not team_id:
        return jsonify({'error': 'Team ID is required'}), 400
    
    # Verify user can create project in the team
    membership = TeamMember.query.filter_by(
        user_id=user_id,
        team_id=team_id
    ).first()
    
    if not membership or membership.role not in ['owner', 'admin']:
        return jsonify({'error': 'Only team managers can create projects'}), 403
    
    # Create project from template
    start_date = datetime.utcnow()
    due_date = None
    if template.default_duration_days:
        due_date = start_date + timedelta(days=template.default_duration_days)
    
    project = Project(
        name=project_name,
        description=data.get('description', template.description),
        status='active',
        team_id=team_id,
        created_by=user_id,
        due_date=due_date
    )
    
    db.session.add(project)
    db.session.flush()  # Get project ID without committing
    
    # Create milestones from template
    if template.default_milestones:
        for milestone_data in template.default_milestones:
            days_offset = milestone_data.get('days_offset', 30)
            milestone = ProjectMilestone(
                name=milestone_data.get('name', 'Milestone'),
                description=milestone_data.get('description', ''),
                project_id=project.id,
                target_date=start_date + timedelta(days=days_offset),
                status='pending',
                progress_percentage=0
            )
            db.session.add(milestone)
    
    # Create tasks from template
    if template.default_tasks:
        for task_data in template.default_tasks:
            days_offset = task_data.get('days_offset', 7)
            task = Task(
                title=task_data.get('title', 'Task'),
                description=task_data.get('description', ''),
                priority=task_data.get('priority', 'medium'),
                status='pending',
                project_id=project.id,
                created_by=user_id,
                due_date=start_date + timedelta(days=days_offset) if days_offset else None,
                requires_approval=task_data.get('requires_approval', False)
            )
            db.session.add(task)
    
    # Update template usage statistics
    template.usage_count += 1
    template.last_used_at = datetime.utcnow()
    
    db.session.commit()
    
    return jsonify({
        'message': 'Project created from template successfully',
        'project': project.to_dict()
    }), 201


@templates_bp.route('/categories', methods=['GET'])
@jwt_required()
def list_template_categories():
    """List all available template categories."""
    categories = db.session.query(ProjectTemplate.category).distinct().all()
    
    return jsonify({
        'categories': [cat[0] for cat in categories if cat[0]]
    })


@templates_bp.route('/popular', methods=['GET'])
@jwt_required()
def list_popular_templates():
    """List most popular templates based on usage."""
    templates = ProjectTemplate.query.filter(
        ProjectTemplate.is_public == True
    ).order_by(ProjectTemplate.usage_count.desc()).limit(10).all()
    
    return jsonify({
        'templates': [template.to_dict() for template in templates]
    })
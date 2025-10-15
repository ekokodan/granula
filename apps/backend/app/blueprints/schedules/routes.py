"""Schedule management routes."""
from datetime import datetime, date, time
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.schedule import Schedule, ScheduleParticipant
from app.models.user import User
from app.models.project import Project
from app.models.team import Team

schedules_bp = Blueprint('schedules', __name__, url_prefix='/api/schedules')


@schedules_bp.route('', methods=['GET'])
@jwt_required()
def get_schedules():
    """Get user's schedules with optional filtering."""
    try:
        user_id = int(get_jwt_identity())
        
        # Query parameters
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        status = request.args.get('status')
        project_id = request.args.get('project_id')
        team_id = request.args.get('team_id')
        
        # Base query - get schedules where user is creator or participant
        query = db.session.query(Schedule).join(
            ScheduleParticipant, Schedule.id == ScheduleParticipant.schedule_id
        ).filter(
            db.or_(
                Schedule.created_by == user_id,
                ScheduleParticipant.user_id == user_id
            )
        ).distinct()
        
        # Apply filters
        if start_date:
            start_date_obj = datetime.strptime(start_date, '%Y-%m-%d').date()
            query = query.filter(Schedule.date >= start_date_obj)
            
        if end_date:
            end_date_obj = datetime.strptime(end_date, '%Y-%m-%d').date()
            query = query.filter(Schedule.date <= end_date_obj)
            
        if status:
            query = query.filter(Schedule.status == status)
            
        if project_id:
            query = query.filter(Schedule.project_id == project_id)
            
        if team_id:
            query = query.filter(Schedule.team_id == team_id)
        
        # Order by date and time
        schedules = query.order_by(Schedule.date, Schedule.start_time).all()
        
        return jsonify({
            'schedules': [schedule.to_dict() for schedule in schedules],
            'total': len(schedules)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@schedules_bp.route('', methods=['POST'])
@jwt_required()
def create_schedule():
    """Create a new schedule."""
    try:
        data = request.get_json()
        user_id = int(get_jwt_identity())
        
        # Validate required fields
        required_fields = ['title', 'date', 'start_time', 'end_time']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Parse date and time
        try:
            schedule_date = datetime.strptime(data['date'], '%Y-%m-%d').date()
            start_time = datetime.strptime(data['start_time'], '%H:%M').time()
            end_time = datetime.strptime(data['end_time'], '%H:%M').time()
        except ValueError as e:
            return jsonify({'error': f'Invalid date/time format: {str(e)}'}), 400
        
        # Validate end time is after start time
        if end_time <= start_time:
            return jsonify({'error': 'End time must be after start time'}), 400
        
        # Create schedule
        schedule = Schedule(
            title=data['title'],
            description=data.get('description'),
            date=schedule_date,
            start_time=start_time,
            end_time=end_time,
            timezone=data.get('timezone', 'UTC'),
            meeting_type=data.get('meeting_type', 'in_person'),
            meeting_link=data.get('meeting_link'),
            location=data.get('location'),
            is_recurring=data.get('is_recurring', False),
            recurring_pattern=data.get('recurring_pattern'),
            created_by=user_id,
            project_id=data.get('project_id'),
            team_id=data.get('team_id')
        )
        
        db.session.add(schedule)
        db.session.flush()  # Get the ID
        
        # Add creator as organizer participant
        organizer_participant = ScheduleParticipant(
            schedule_id=schedule.id,
            user_id=user_id,
            is_organizer=True,
            response_status='accepted'
        )
        db.session.add(organizer_participant)
        
        # Add other participants
        participants = data.get('participants', [])
        for participant_data in participants:
            if 'user_id' in participant_data:
                # Internal user
                participant = ScheduleParticipant(
                    schedule_id=schedule.id,
                    user_id=participant_data['user_id'],
                    response_status='pending'
                )
            else:
                # External participant
                participant = ScheduleParticipant(
                    schedule_id=schedule.id,
                    email=participant_data.get('email'),
                    name=participant_data.get('name'),
                    response_status='pending'
                )
            db.session.add(participant)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Schedule created successfully',
            'schedule': schedule.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@schedules_bp.route('/<int:schedule_id>', methods=['GET'])
@jwt_required()
def get_schedule(schedule_id):
    """Get a specific schedule."""
    try:
        user_id = int(get_jwt_identity())
        
        schedule = Schedule.query.get_or_404(schedule_id)
        
        # Check if user has access to this schedule
        participant = ScheduleParticipant.query.filter_by(
            schedule_id=schedule_id,
            user_id=user_id
        ).first()
        
        if schedule.created_by != user_id and not participant:
            return jsonify({'error': 'Access denied'}), 403
        
        return jsonify({'schedule': schedule.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@schedules_bp.route('/<int:schedule_id>', methods=['PUT'])
@jwt_required()
def update_schedule(schedule_id):
    """Update a schedule."""
    try:
        data = request.get_json()
        user_id = int(get_jwt_identity())
        
        schedule = Schedule.query.get_or_404(schedule_id)
        
        # Check if user can edit this schedule (creator only)
        if schedule.created_by != user_id:
            return jsonify({'error': 'Only the creator can edit this schedule'}), 403
        
        # Update fields
        if 'title' in data:
            schedule.title = data['title']
        if 'description' in data:
            schedule.description = data['description']
        if 'date' in data:
            schedule.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        if 'start_time' in data:
            schedule.start_time = datetime.strptime(data['start_time'], '%H:%M').time()
        if 'end_time' in data:
            schedule.end_time = datetime.strptime(data['end_time'], '%H:%M').time()
        if 'meeting_type' in data:
            schedule.meeting_type = data['meeting_type']
        if 'meeting_link' in data:
            schedule.meeting_link = data['meeting_link']
        if 'location' in data:
            schedule.location = data['location']
        if 'status' in data:
            schedule.status = data['status']
        
        schedule.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Schedule updated successfully',
            'schedule': schedule.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@schedules_bp.route('/<int:schedule_id>', methods=['DELETE'])
@jwt_required()
def delete_schedule(schedule_id):
    """Delete a schedule."""
    try:
        user_id = int(get_jwt_identity())
        
        schedule = Schedule.query.get_or_404(schedule_id)
        
        # Check if user can delete this schedule (creator only)
        if schedule.created_by != user_id:
            return jsonify({'error': 'Only the creator can delete this schedule'}), 403
        
        # Delete participants first
        ScheduleParticipant.query.filter_by(schedule_id=schedule_id).delete()
        
        # Delete schedule
        db.session.delete(schedule)
        db.session.commit()
        
        return jsonify({'message': 'Schedule deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@schedules_bp.route('/<int:schedule_id>/participants', methods=['POST'])
@jwt_required()
def add_participant(schedule_id):
    """Add a participant to a schedule."""
    try:
        data = request.get_json()
        user_id = int(get_jwt_identity())
        
        schedule = Schedule.query.get_or_404(schedule_id)
        
        # Check if user can add participants (creator only)
        if schedule.created_by != user_id:
            return jsonify({'error': 'Only the creator can add participants'}), 403
        
        # Check if participant already exists
        existing_participant = None
        if 'user_id' in data:
            existing_participant = ScheduleParticipant.query.filter_by(
                schedule_id=schedule_id,
                user_id=data['user_id']
            ).first()
        elif 'email' in data:
            existing_participant = ScheduleParticipant.query.filter_by(
                schedule_id=schedule_id,
                email=data['email']
            ).first()
        
        if existing_participant:
            return jsonify({'error': 'Participant already added'}), 400
        
        # Add participant
        if 'user_id' in data:
            participant = ScheduleParticipant(
                schedule_id=schedule_id,
                user_id=data['user_id'],
                response_status='pending'
            )
        else:
            participant = ScheduleParticipant(
                schedule_id=schedule_id,
                email=data.get('email'),
                name=data.get('name'),
                response_status='pending'
            )
        
        db.session.add(participant)
        db.session.commit()
        
        return jsonify({
            'message': 'Participant added successfully',
            'participant': participant.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@schedules_bp.route('/<int:schedule_id>/participants/<int:participant_id>/response', methods=['PUT'])
@jwt_required()
def respond_to_schedule(schedule_id, participant_id):
    """Respond to a schedule invitation."""
    try:
        data = request.get_json()
        user_id = int(get_jwt_identity())
        
        participant = ScheduleParticipant.query.get_or_404(participant_id)
        
        # Check if this is the correct user
        if participant.user_id != user_id:
            return jsonify({'error': 'Access denied'}), 403
        
        # Update response
        response_status = data.get('response_status')
        if response_status not in ['accepted', 'declined', 'tentative']:
            return jsonify({'error': 'Invalid response status'}), 400
        
        participant.response_status = response_status
        participant.responded_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Response updated successfully',
            'participant': participant.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
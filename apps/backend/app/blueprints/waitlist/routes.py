"""Waitlist routes."""
from flask import jsonify, request
from datetime import datetime, timedelta
import re
from sqlalchemy.exc import IntegrityError
from . import waitlist_bp
from app.extensions import limiter, db
from app.models.waitlist import WaitlistEntry
from app.services.email_service import EmailService


def is_valid_email(email):
    """Basic email validation."""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


@waitlist_bp.route('', methods=['POST'])
@limiter.limit("5 per hour")
def join_waitlist():
    """Add email to waitlist."""
    try:
        data = request.get_json()
        
        if not data or 'email' not in data:
            return jsonify({"error": "Email is required"}), 400
            
        email = data['email'].strip().lower()
        
        if not is_valid_email(email):
            return jsonify({"error": "Invalid email format"}), 400
        
        # Check if email already exists
        existing_entry = WaitlistEntry.query.filter_by(email=email).first()
        if existing_entry:
            return jsonify({
                "message": "You're already on the waitlist!",
                "email": email,
                "signed_up_at": existing_entry.signed_up_at.isoformat()
            }), 200
        
        # Create new waitlist entry
        new_entry = WaitlistEntry(
            email=email,
            ip_address=request.environ.get('HTTP_X_REAL_IP', request.remote_addr),
            user_agent=request.headers.get('User-Agent'),
            referrer=request.headers.get('Referer')
        )
        
        db.session.add(new_entry)
        db.session.commit()
        
        print(f"New waitlist signup: {email} at {datetime.utcnow()}")
        
        # Send welcome email to user (async in background)
        try:
            EmailService.send_waitlist_welcome(email, new_entry.signed_up_at)
            new_entry.confirmation_sent = True
            new_entry.confirmation_sent_at = datetime.utcnow()
        except Exception as e:
            print(f"Failed to send welcome email to {email}: {e}")
        
        # Send admin notification
        try:
            total_signups = WaitlistEntry.query.count()
            recent_date = datetime.utcnow() - timedelta(days=7)
            recent_signups = WaitlistEntry.query.filter(
                WaitlistEntry.signed_up_at >= recent_date
            ).count()
            
            EmailService.send_admin_signup_notification(
                user_email=email,
                signed_up_at=new_entry.signed_up_at,
                ip_address=new_entry.ip_address,
                user_agent=new_entry.user_agent,
                referrer=new_entry.referrer,
                total_signups=total_signups,
                recent_signups=recent_signups
            )
        except Exception as e:
            print(f"Failed to send admin notification for {email}: {e}")
        
        # Save confirmation status
        db.session.commit()
        
        return jsonify({
            "message": "Successfully joined waitlist!",
            "email": email,
            "signed_up_at": new_entry.signed_up_at.isoformat()
        }), 201
        
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Email already registered"}), 409
    except Exception as e:
        db.session.rollback()
        print(f"Error joining waitlist: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@waitlist_bp.route('/status', methods=['GET'])
def waitlist_status():
    """Get waitlist statistics (for admin)."""
    try:
        total_signups = WaitlistEntry.query.count()
        
        # Recent signups (last 7 days)
        recent_date = datetime.utcnow() - timedelta(days=7)
        recent_signups = WaitlistEntry.query.filter(
            WaitlistEntry.signed_up_at >= recent_date
        ).count()
        
        return jsonify({
            "total_signups": total_signups,
            "recent_signups": recent_signups,
            "message": "Waitlist endpoint active"
        }), 200
        
    except Exception as e:
        print(f"Error getting waitlist status: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@waitlist_bp.route('/entries', methods=['GET'])
def get_waitlist_entries():
    """Get all waitlist entries (for admin)."""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 50, type=int)
        
        # Limit per_page to prevent abuse
        per_page = min(per_page, 100)
        
        entries = WaitlistEntry.query.order_by(
            WaitlistEntry.signed_up_at.desc()
        ).paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        return jsonify({
            "entries": [entry.to_dict() for entry in entries.items],
            "total": entries.total,
            "pages": entries.pages,
            "current_page": page,
            "per_page": per_page,
            "has_next": entries.has_next,
            "has_prev": entries.has_prev
        }), 200
        
    except Exception as e:
        print(f"Error getting waitlist entries: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@waitlist_bp.route('/export', methods=['GET'])
def export_waitlist():
    """Export waitlist as CSV (for admin)."""
    try:
        entries = WaitlistEntry.query.order_by(WaitlistEntry.signed_up_at.desc()).all()
        
        # Create CSV content
        csv_content = "email,signed_up_at,status,ip_address\n"
        for entry in entries:
            csv_content += f"{entry.email},{entry.signed_up_at.isoformat()},{entry.status},{entry.ip_address or ''}\n"
        
        from flask import Response
        return Response(
            csv_content,
            mimetype="text/csv",
            headers={"Content-disposition": "attachment; filename=waitlist_export.csv"}
        )
        
    except Exception as e:
        print(f"Error exporting waitlist: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@waitlist_bp.route('/test-email', methods=['POST'])
def test_email():
    """Test email functionality (for admin/development)."""
    try:
        data = request.get_json()
        email = data.get('email', 'test@example.com')
        email_type = data.get('type', 'welcome')  # 'welcome' or 'admin'
        
        if email_type == 'welcome':
            success = EmailService.send_waitlist_welcome(
                email=email,
                signed_up_at=datetime.utcnow()
            )
            message = f"Welcome email sent to {email}"
        elif email_type == 'admin':
            success = EmailService.send_admin_signup_notification(
                user_email=email,
                signed_up_at=datetime.utcnow(),
                ip_address="127.0.0.1",
                user_agent="Test Browser",
                referrer="https://test.com",
                total_signups=42,
                recent_signups=7
            )
            message = f"Admin notification sent for {email}"
        else:
            return jsonify({"error": "Invalid email type. Use 'welcome' or 'admin'"}), 400
        
        return jsonify({
            "success": success,
            "message": message,
            "suppressed": request.app.config.get('MAIL_SUPPRESS_SEND', False)
        }), 200
        
    except Exception as e:
        print(f"Error testing email: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
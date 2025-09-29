"""Database models."""

# Ensure model modules are imported so Alembic autogenerate detects them
from .user import User  # noqa: F401
from .waitlist import WaitlistEntry  # noqa: F401
from .task import Task  # noqa: F401
from .team import Team, TeamMember  # noqa: F401
from .department import Department, UserDepartment  # noqa: F401
from .project import Project  # noqa: F401
from .invitation import TeamInvitation  # noqa: F401

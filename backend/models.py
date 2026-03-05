from typing import Optional, List
from datetime import datetime
from sqlmodel import Field, SQLModel
from sqlalchemy import Column, Index


class UserBase(SQLModel):
    name: str = Field(index=True)
    email: str = Field(unique=True, index=True)
    skills_offered: str = Field(default="[]", description="JSON list of skills user can teach")
    skills_wanted: str = Field(default="[]", description="JSON list of skills user wants to learn")
    verified_skills: str = Field(default="[]", description="JSON list of skills verified by quiz")
    badges: str = Field(default="{}", description="JSON dict of skill: level (Beginner/Intermediate/Expert)")
    feedback_summary: Optional[str] = Field(default=None, description="AI-generated summary of reviews")
    verification_scores: Optional[str] = Field(default=None, description="JSON dict of skill: {score, method, date}")
    credits_balance: int = Field(default=5)
    reputation_score: float = Field(default=0.0)

    # Profile Fields
    profile_photo_url: Optional[str] = Field(default=None)
    bio: Optional[str] = Field(default=None)
    github_url: Optional[str] = Field(default=None)
    linkedin_url: Optional[str] = Field(default=None)
    education: Optional[str] = Field(default=None)


class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    password_hash: str


class UserCreate(UserBase):
    password: str


class UserRead(UserBase):
    id: int


class UserUpdate(SQLModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    profile_photo_url: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    education: Optional[str] = None
    skills_offered: Optional[str] = None
    skills_wanted: Optional[str] = None


class SessionBase(SQLModel):
    learner_id: int = Field(foreign_key="user.id", index=True)
    teacher_id: int = Field(foreign_key="user.id", index=True)
    skill_name: str = Field(index=True)
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    status: str = Field(default="pending", index=True)  # pending, scheduled, completed, disputed
    meet_link: Optional[str] = None
    session_type: str = Field(default="standard")  # standard, coding


class Session(SessionBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)


class Review(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    session_id: int = Field(foreign_key="session.id", index=True)
    reviewer_id: int = Field(foreign_key="user.id", index=True)
    reviewee_id: int = Field(foreign_key="user.id", index=True)
    rating: int
    comment: Optional[str] = None
    skill_verified: bool = False


class ReviewCreate(SQLModel):
    session_id: int
    rating: int
    comment: Optional[str] = None


class Transaction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    amount: int
    type: str  # session_earn, session_spend, bonus
    timestamp: datetime = Field(default_factory=datetime.utcnow, index=True)


class AuditLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    action: str
    user_id: Optional[int] = Field(default=None, foreign_key="user.id", index=True)
    details: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class LearningPath(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    skill_name: str = Field(index=True)
    steps_json: str = Field(default="[]", description="JSON list of steps")


class ProjectVerification(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    skill_name: str = Field(index=True)
    project_title: str
    description: str
    technologies: str
    github_url: Optional[str] = None
    demo_link: Optional[str] = None
    certificate_url: Optional[str] = None
    ai_review_status: str = Field(default="pending")  # pending, approved, rejected
    ai_feedback: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class Certificate(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    course_name: str
    mentor_name: str = Field(default="")
    mentor_id: Optional[int] = Field(default=None, foreign_key="user.id")
    completion_date: datetime = Field(default_factory=datetime.utcnow)
    certificate_url: Optional[str] = Field(default=None)
    session_id: Optional[int] = Field(default=None, foreign_key="session.id", index=True)

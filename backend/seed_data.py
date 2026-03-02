from sqlmodel import Session, select
from database import engine, create_db_and_tables
from models import User, Session as DbSession, Review, Transaction, AuditLog
from auth import get_password_hash
import json
from datetime import datetime, timedelta


def seed_data():
    create_db_and_tables()

    with Session(engine) as session:

        # --- Demo User 1 ---
        email1 = "demo1@skillswap.com"
        user1 = session.exec(select(User).where(User.email == email1)).first()
        if not user1:
            user1 = User(
                name="Alex Rivera",
                email=email1,
                password_hash=get_password_hash("Demo@123"),
                skills_offered=json.dumps(["Python", "React", "Data Science"]),
                skills_wanted=json.dumps(["Machine Learning", "Java"]),
                verified_skills=json.dumps(["Python", "React"]),
                badges=json.dumps({"Python": "Expert", "React": "Intermediate"}),
                feedback_summary="Excellent mentor with deep Python knowledge and practical examples.",
                credits_balance=10,
                reputation_score=4.8,
                bio="Full-stack developer and data enthusiast. Love teaching Python and web tech.",
                education="B.Sc. Computer Science"
            )
            session.add(user1)
            session.commit()
            session.refresh(user1)
            session.add(AuditLog(action="REGISTER", details=f"Demo user created: {email1}", user_id=user1.id))
            session.commit()
        else:
            user1.password_hash = get_password_hash("Demo@123")
            user1.skills_offered = json.dumps(["Python", "React", "Data Science"])
            user1.skills_wanted = json.dumps(["Machine Learning", "Java"])
            user1.verified_skills = json.dumps(["Python", "React"])
            user1.badges = json.dumps({"Python": "Expert", "React": "Intermediate"})
            user1.credits_balance = 10
            user1.reputation_score = 4.8
            session.add(user1)
            session.commit()
            session.refresh(user1)

        # --- Demo User 2 ---
        email2 = "demo2@skillswap.com"
        user2 = session.exec(select(User).where(User.email == email2)).first()
        if not user2:
            user2 = User(
                name="Jordan Lee",
                email=email2,
                password_hash=get_password_hash("Demo@123"),
                skills_offered=json.dumps(["Java", "Machine Learning", "System Design"]),
                skills_wanted=json.dumps(["React", "Python"]),
                verified_skills=json.dumps(["Java", "Machine Learning"]),
                badges=json.dumps({"Java": "Expert", "Machine Learning": "Intermediate"}),
                feedback_summary="Patient and knowledgeable Java instructor. Great at breaking down complex algorithms.",
                credits_balance=10,
                reputation_score=4.6,
                bio="Backend engineer specialising in Java and ML systems. Happy to help learners grow.",
                education="M.Sc. Software Engineering"
            )
            session.add(user2)
            session.commit()
            session.refresh(user2)
            session.add(AuditLog(action="REGISTER", details=f"Demo user created: {email2}", user_id=user2.id))
            session.commit()
        else:
            user2.password_hash = get_password_hash("Demo@123")
            user2.skills_offered = json.dumps(["Java", "Machine Learning", "System Design"])
            user2.skills_wanted = json.dumps(["React", "Python"])
            user2.verified_skills = json.dumps(["Java", "Machine Learning"])
            user2.badges = json.dumps({"Java": "Expert", "Machine Learning": "Intermediate"})
            user2.credits_balance = 10
            user2.reputation_score = 4.6
            session.add(user2)
            session.commit()
            session.refresh(user2)

        # --- Supporting Mentors (for Find Tutor page richness) ---
        tutors_data = [
            {
                "name": "Sarah Martinez",
                "email": "sarah@skillswap.ai",
                "skills": ["Python", "Django", "Data Science"],
                "verified": ["Python", "Data Science"],
                "badges": {"Python": "Expert", "Data Science": "Intermediate"},
                "wanted": ["UI Design"],
                "rep": 4.9,
                "summary": "Patient and knowledgeable Python expert. Makes complex concepts accessible."
            },
            {
                "name": "Michael Kim",
                "email": "michael@skillswap.ai",
                "skills": ["React", "JavaScript", "TypeScript"],
                "verified": ["React", "JavaScript"],
                "badges": {"React": "Expert", "JavaScript": "Expert"},
                "wanted": ["Python"],
                "rep": 4.7,
                "summary": "Engaging instructor with real-world project experience. Clear and concise."
            },
            {
                "name": "Emma Watson",
                "email": "emma@skillswap.ai",
                "skills": ["UI/UX Design", "Figma", "User Research"],
                "verified": ["UI/UX Design", "Figma"],
                "badges": {"UI/UX Design": "Expert", "Figma": "Intermediate"},
                "wanted": ["React"],
                "rep": 4.95,
                "summary": "Creative designer with excellent communication skills. Portfolio-focused approach."
            },
            {
                "name": "David Chen",
                "email": "david@skillswap.ai",
                "skills": ["Machine Learning", "TensorFlow", "Data Analysis"],
                "verified": ["Machine Learning"],
                "badges": {"Machine Learning": "Intermediate"},
                "wanted": ["System Design"],
                "rep": 4.6,
                "summary": "Practical ML engineer who loves teaching fundamentals. Great with beginners."
            }
        ]

        tutor_objs = []
        for t in tutors_data:
            user = session.exec(select(User).where(User.email == t["email"])).first()
            if not user:
                user = User(
                    name=t["name"],
                    email=t["email"],
                    password_hash=get_password_hash("password123"),
                    skills_offered=json.dumps(t["skills"]),
                    skills_wanted=json.dumps(t["wanted"]),
                    verified_skills=json.dumps(t.get("verified", [])),
                    badges=json.dumps(t.get("badges", {})),
                    feedback_summary=t.get("summary", ""),
                    credits_balance=10,
                    reputation_score=t["rep"]
                )
                session.add(user)
                session.commit()
                session.refresh(user)
            tutor_objs.append(user)

        # Refresh demo users
        session.refresh(user1)
        session.refresh(user2)

        # --- Sessions between Demo User 1 and Demo User 2 ---
        # Completed session: user1 taught user2 Python
        s_mutual = session.exec(select(DbSession).where(
            (DbSession.learner_id == user2.id) &
            (DbSession.teacher_id == user1.id) &
            (DbSession.status == "completed")
        )).first()

        if not s_mutual:
            s_mutual = DbSession(
                learner_id=user2.id,
                teacher_id=user1.id,
                skill_name="Python",
                status="completed",
                start_time=datetime.utcnow() - timedelta(days=3),
                end_time=datetime.utcnow() - timedelta(days=3, minutes=60),
                meet_link="https://meet.jit.si/SkillSwap-Demo-Mutual"
            )
            session.add(s_mutual)
            session.commit()
            session.refresh(s_mutual)

            rev = Review(
                session_id=s_mutual.id,
                reviewer_id=user2.id,
                reviewee_id=user1.id,
                rating=5,
                comment="Alex explained Python fundamentals brilliantly."
            )
            session.add(rev)
            session.add(AuditLog(action="SESSION_COMPLETE", details=f"Session {s_mutual.id} completed", user_id=user2.id))
            session.commit()

        # Pending session: user2 requested to learn React from user1
        s_pending = session.exec(select(DbSession).where(
            (DbSession.learner_id == user2.id) &
            (DbSession.teacher_id == user1.id) &
            (DbSession.status == "pending")
        )).first()

        if not s_pending:
            s_pending = DbSession(
                learner_id=user2.id,
                teacher_id=user1.id,
                skill_name="React",
                status="pending"
            )
            session.add(s_pending)
            session.commit()

        # Scheduled session: user1 learning Java from user2
        sarah = next((t for t in tutor_objs if "Sarah" in t.name), None)
        if sarah:
            s1 = session.exec(select(DbSession).where(
                (DbSession.learner_id == user1.id) &
                (DbSession.teacher_id == sarah.id) &
                (DbSession.status == "completed")
            )).first()
            if not s1:
                s1 = DbSession(
                    learner_id=user1.id,
                    teacher_id=sarah.id,
                    skill_name="Data Science",
                    status="completed",
                    start_time=datetime.utcnow() - timedelta(days=2),
                    end_time=datetime.utcnow() - timedelta(days=2, minutes=45),
                    meet_link="https://meet.jit.si/SkillSwap-Demo-1"
                )
                session.add(s1)
                session.commit()
                session.refresh(s1)
                session.add(Review(
                    session_id=s1.id,
                    reviewer_id=user1.id,
                    reviewee_id=sarah.id,
                    rating=5,
                    comment="Sarah is an amazing teacher! Explained Data Science concepts clearly."
                ))
                session.commit()

        session.commit()


if __name__ == "__main__":
    seed_data()

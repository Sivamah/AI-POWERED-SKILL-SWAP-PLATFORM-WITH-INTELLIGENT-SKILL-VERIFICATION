from sqlmodel import Session, select
from database import engine, create_db_and_tables
from models import User, Session as DbSession, Review, Transaction, AuditLog
from auth import get_password_hash
import json
import random
from datetime import datetime, timedelta

def seed_data():
    # Ensure tables exist
    create_db_and_tables()

    with Session(engine) as session:
        print("[SEED] Starting Database Seed for Demo Mode...")

        # --- 1. Create Demo User (The protagonist) ---
        demo_email = "demo@skillswap.ai"
        demo_user = session.exec(select(User).where(User.email == demo_email)).first()
        
        if not demo_user:
            demo_user = User(
                name="Alex Chen (Demo)",
                email=demo_email,
                password_hash=get_password_hash("Demo@123"),
                skills_offered=json.dumps(["React", "UI Design", "Product Management"]),
                skills_wanted=json.dumps(["Python", "Data Science", "Machine Learning"]),
                verified_skills=json.dumps(["React", "Python", "UI Design"]),
                badges=json.dumps({"React": "Expert", "Python": "Intermediate", "UI Design": "Beginner"}),
                feedback_summary="Exceptional mentor with clear explanations and engaging teaching style. Students appreciate patience and real-world examples.",
                credits_balance=15,
                reputation_score=4.8
            )
            session.add(demo_user)
            session.commit() # Commit to get ID
            session.refresh(demo_user)
            print(f"Created Demo User: {demo_email}")
            
            # Audit Log for creation
            session.add(AuditLog(action="REGISTER", details=f"Demo user created: {demo_email}", user_id=demo_user.id))
        else:
            print(f"Demo User already exists: {demo_email}. Updating Request Data...")
            # Enforce Demo Specs
            demo_user.skills_offered = json.dumps(["React", "Python", "UI Design"])
            demo_user.skills_wanted = json.dumps(["Data Science", "Machine Learning"])
            demo_user.verified_skills = json.dumps(["React", "Python"])
            demo_user.badges = json.dumps({"React": "Intermediate", "Python": "Expert"})
            demo_user.credits_balance = 5
            demo_user.reputation_score = 4.5
            demo_user.password_hash = get_password_hash("Demo@123") # Reset password to ensure access
            session.add(demo_user)
            session.commit()
            session.refresh(demo_user)
            print(f"Updated Demo User: {demo_email}")
            
        # --- 2. Create Diverse Tutors ---
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
                    credits_balance=random.randint(8, 18),
                    reputation_score=t["rep"]
                )
                session.add(user)
                session.commit()
                session.refresh(user)
                tutor_objs.append(user)
                print(f"Created Tutor: {t['name']}")
            else:
                tutor_objs.append(user)

        # Recapture objects to be safe
        session.refresh(demo_user)
        for t in tutor_objs:
            session.refresh(t)

        # --- 3. Create Sessions (Scenarios) ---
        
        # Scenario A: Completed Session (Demo User learned from Sarah)
        sarah = next(t for t in tutor_objs if "Sarah" in t.name)
        
        s1 = session.exec(select(DbSession).where(
            (DbSession.learner_id == demo_user.id) & 
            (DbSession.teacher_id == sarah.id) & 
            (DbSession.status == "completed")
        )).first()

        if not s1:
            s1 = DbSession(
                learner_id=demo_user.id,
                teacher_id=sarah.id,
                skill_name="Python Basics",
                status="completed",
                start_time=datetime.utcnow() - timedelta(days=2),
                end_time=datetime.utcnow() - timedelta(days=2, minutes=45),
                meet_link="https://meet.jit.si/SkillSwap-Demo-1"
            )
            session.add(s1)
            session.commit()
            session.refresh(s1)
            
            # Add Review
            rev1 = Review(
                session_id=s1.id,
                reviewer_id=demo_user.id,
                reviewee_id=sarah.id,
                rating=5,
                comment="Sarah is an amazing teacher! Explained lists and dicts clearly."
            )
            session.add(rev1)
            session.add(AuditLog(action="SESSION_COMPLETE", details=f"Session {s1.id} completed", user_id=demo_user.id))
            print("Created Completed Session & Review: Demo -> Sarah")

        # Scenario B: Scheduled Session (Upcoming with Michael)
        michael = next(t for t in tutor_objs if "Michael" in t.name)
        s2 = session.exec(select(DbSession).where(
            (DbSession.learner_id == demo_user.id) & 
            (DbSession.teacher_id == michael.id) & 
            (DbSession.status == "scheduled")
        )).first()

        if not s2:
            s2 = DbSession(
                learner_id=demo_user.id,
                teacher_id=michael.id,
                skill_name="React Hooks",
                status="scheduled",
                meet_link="https://meet.jit.si/SkillSwap-Demo-2"
            )
            session.add(s2)
            session.add(AuditLog(action="SESSION_CONFIRM", details=f"Session {s2.id} scheduled", user_id=michael.id))
            print("Created Scheduled Session: Demo -> Michael")

        # Scenario C: Pending Request (Demo User requested Emma)
        emma = next(t for t in tutor_objs if "Emma" in t.name)
        s3 = session.exec(select(DbSession).where(
            (DbSession.learner_id == demo_user.id) & 
            (DbSession.teacher_id == emma.id) & 
            (DbSession.status == "pending")
        )).first()

        if not s3:
            s3 = DbSession(
                learner_id=demo_user.id,
                teacher_id=emma.id,
                skill_name="UI/UX Principles",
                status="pending"
            )
            session.add(s3)
            session.add(AuditLog(action="SESSION_REQUEST", details=f"Session requested for UI/UX Principles", user_id=demo_user.id))
            print("Created Pending Session: Demo -> Emma")
            
        # Scenario D: Teaching Request (David requested Demo User)
        david = next(t for t in tutor_objs if "David" in t.name)
        s4 = session.exec(select(DbSession).where(
            (DbSession.learner_id == david.id) & 
            (DbSession.teacher_id == demo_user.id)
        )).first()
        
        if not s4:
            s4 = DbSession(
                learner_id=david.id,
                teacher_id=demo_user.id,
                skill_name="Product Management",
                status="pending"
            )
            session.add(s4)
            print("Created Incoming Request: David -> Demo User")

        session.commit()
        print("[SEED] Demo Data Seeding Complete!")

if __name__ == "__main__":
    seed_data()

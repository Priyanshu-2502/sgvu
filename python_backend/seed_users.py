import sys
import os

# Add the current directory to sys.path to make imports work
sys.path.append(os.getcwd())

from app.db.session import SessionLocal, engine
from app.db.base import Base
from app.models.user import User
from app.core.config import settings
from app.core import security

def init_db():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if admin exists
        user = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
        if not user:
            print(f"Creating admin user: {settings.ADMIN_EMAIL}")
            user = User(
                email=settings.ADMIN_EMAIL,
                hashed_password=security.get_password_hash(settings.ADMIN_PASSWORD),
                full_name="Admin User",
                phone="0000000000",
                is_active=True,
                is_superuser=True,
                latitude=0.0,
                longitude=0.0
            )
            db.add(user)
            db.commit()
            print("Admin user created.")
        else:
            print(f"Admin user already exists: {settings.ADMIN_EMAIL}")
            # Reset password to ensure we can login
            user.hashed_password = security.get_password_hash(settings.ADMIN_PASSWORD)
            db.commit()
            print("Admin password reset to default.")

        # List all users
        print("\nExisting Users:")
        users = db.query(User).all()
        for u in users:
            print(f"- {u.email} (Role: {'Admin' if u.is_superuser else 'User'})")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    print("Seeding database...")
    init_db()

from sqlalchemy import Column, Integer, String, Boolean, Float
from app.db.base_class import Base

class User(Base):
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    profile_picture = Column(String, nullable=True)
    
    # SQLite does not support Geometry types natively without extensions.
    # We will use simple Lat/Lon columns.
    
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

import shutil
import os
from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User
from app.models.analysis import ImageMetadata
from datetime import datetime

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
def upload_files(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_superuser),
    files: List[UploadFile] = File(...),
    capture_date: str = Form(...), # ISO format
    image_type: str = Form(...) # satellite, drone, dem
):
    """
    Admin upload for satellite/drone/dem files.
    """
    saved_files = []
    
    try:
        dt_capture = datetime.fromisoformat(capture_date)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format")

    for file in files:
        file_location = os.path.join(UPLOAD_DIR, f"{datetime.now().timestamp()}_{file.filename}")
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        db_image = ImageMetadata(
            filename=file.filename,
            file_path=file_location,
            capture_date=dt_capture,
            image_type=image_type
        )
        db.add(db_image)
        saved_files.append(file.filename)
    
    db.commit()
    
    return {"message": "Files uploaded successfully", "files": saved_files}

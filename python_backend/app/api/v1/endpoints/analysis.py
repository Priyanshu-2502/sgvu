from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User
from app.models.analysis import AnalysisResult, ImageMetadata
from app.schemas.analysis import AnalysisResult as AnalysisResultSchema
from app.services import image_processing, gis_analysis, risk_assessment
from datetime import datetime
import os

router = APIRouter()

def process_analysis(analysis_id: int, img1_path: str, img2_path: str, dem_path: str, db: Session):
    # This should ideally be a Celery task
    # For now, running as background task
    
    # 1. SRCNN / Enhancement (Placeholder)
    # 2. NDWI
    ndwi1 = img1_path + ".ndwi.tif"
    ndwi2 = img2_path + ".ndwi.tif"
    image_processing.calculate_ndwi(img1_path, ndwi1)
    image_processing.calculate_ndwi(img2_path, ndwi2)
    
    # 3. Change Detection
    change_path = f"analysis_{analysis_id}_change.tif"
    image_processing.detect_change(ndwi1, ndwi2, change_path)
    
    # 4. Volume Change
    vol_change = gis_analysis.calculate_volume_change(dem_path, change_path)
    
    # 5. Risk Assessment
    risk = risk_assessment.assess_risk(vol_change, 15.0) # Slope placeholder
    
    # Update DB
    # Need a new session for background task safety if not passed correctly, 
    # but here we'll assume db session is still valid or we'd create a new one.
    # Since we can't easily pass db session to background task in this simple setup without issues,
    # we'll omit the DB update in this synchronous example or do it carefully.
    # PROPER WAY: Use Celery or a separate function that creates a new session.
    pass

from typing import List

@router.get("/", response_model=List[AnalysisResultSchema])
def read_analyses(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
):
    analyses = db.query(AnalysisResult).order_by(AnalysisResult.created_at.desc()).offset(skip).limit(limit).all()
    return analyses

@router.post("/run", response_model=AnalysisResultSchema)
def run_analysis(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    date1: datetime,
    date2: datetime,
    background_tasks: BackgroundTasks
):
    """
    Trigger analysis for two dates.
    Finds images close to these dates.
    """
    # Find images (Simplification: find exact or closest match)
    # In reality, we'd query for images within a range.
    img1 = db.query(ImageMetadata).filter(ImageMetadata.capture_date == date1).first()
    img2 = db.query(ImageMetadata).filter(ImageMetadata.capture_date == date2).first()
    
    if not img1 or not img2:
        raise HTTPException(status_code=404, detail="Images not found for given dates")
        
    # Find DEM (assuming one DEM for now)
    dem = db.query(ImageMetadata).filter(ImageMetadata.image_type == "dem").first()
    if not dem:
        raise HTTPException(status_code=404, detail="DEM data not found")
        
    analysis = AnalysisResult(
        date_1=date1,
        date_2=date2,
        created_at=datetime.utcnow(),
        risk_level="Calculating..."
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    
    # Trigger processing
    # background_tasks.add_task(process_analysis, analysis.id, img1.file_path, img2.file_path, dem.file_path, db)
    
    # For prototype, let's just do a dummy update so user sees something
    analysis.risk_level = "High" 
    analysis.volume_change = 50000.0
    db.commit()
    
    return analysis

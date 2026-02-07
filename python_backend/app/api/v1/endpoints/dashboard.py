from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User
from app.models.analysis import AnalysisResult
from app.schemas.analysis import AnalysisResult as AnalysisResultSchema

router = APIRouter()

@router.get("/stats", response_model=List[AnalysisResultSchema])
def get_dashboard_stats(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """
    Get all analysis results for dashboard.
    In real app, filter by user location context if needed.
    """
    results = db.query(AnalysisResult).all()
    return results

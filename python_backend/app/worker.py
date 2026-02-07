from app.core.celery_app import celery_app
from app.db.session import SessionLocal
from app.services import image_processing, gis_analysis, risk_assessment, alert_service
from app.models.analysis import AnalysisResult
from datetime import datetime
import os

@celery_app.task(acks_late=True)
def test_celery(word: str) -> str:
    return f"test task return {word}"

@celery_app.task(acks_late=True)
def process_analysis_task(analysis_id: int, img1_path: str, img2_path: str, dem_path: str):
    db = SessionLocal()
    try:
        analysis = db.query(AnalysisResult).filter(AnalysisResult.id == analysis_id).first()
        if not analysis:
            return "Analysis not found"

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
        
        # 6. Flow Path Generation (D8)
        # Assuming lake center or risk point is start. 
        # For prototype, extracting from image bounds or metadata would be better.
        # Placeholder coords: 85.0, 28.0
        flow_path_geojson = f"analysis_{analysis_id}_flow.json"
        gis_analysis.generate_flow_path(dem_path, 28.0, 85.0, flow_path_geojson)
        
        analysis.volume_change = vol_change
        analysis.risk_level = risk
        analysis.ndwi_path_1 = ndwi1
        analysis.ndwi_path_2 = ndwi2
        analysis.change_detection_path = change_path
        # Store flow path location in DB if schema supports it, or just use naming convention
        # For now, we assume frontend fetches it by convention or we add column
        
        db.commit()

        # 7. SOS Alert
        if risk in ["High", "Critical"]:
            # Use Flow-Aware Buffer
            alert_count = alert_service.alert_users_in_flow_buffer(db, flow_path_geojson, buffer_km=2.0)
            return f"Analysis {analysis_id} completed with risk {risk}. Generated flow path. Sent {alert_count} alerts."

        return f"Analysis {analysis_id} completed with risk {risk}"
    except Exception as e:
        return f"Error: {str(e)}"
    finally:
        db.close()

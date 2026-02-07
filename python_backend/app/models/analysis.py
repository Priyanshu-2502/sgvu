from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from app.db.base_class import Base
from datetime import datetime

class ImageMetadata(Base):
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    upload_date = Column(DateTime, default=datetime.utcnow)
    capture_date = Column(DateTime, nullable=False)
    image_type = Column(String, nullable=False) # satellite, drone, dem
    resolution = Column(Float, nullable=True) # meters per pixel

class AnalysisResult(Base):
    id = Column(Integer, primary_key=True, index=True)
    date_1 = Column(DateTime, nullable=False)
    date_2 = Column(DateTime, nullable=False)
    
    # Paths to generated files
    ndwi_path_1 = Column(String, nullable=True)
    ndwi_path_2 = Column(String, nullable=True)
    change_detection_path = Column(String, nullable=True) # Difference map
    risk_map_path = Column(String, nullable=True) # GeoJSON or raster path
    
    # Calculated metrics
    lake_area_1 = Column(Float, nullable=True) # sq meters
    lake_area_2 = Column(Float, nullable=True) # sq meters
    volume_change = Column(Float, nullable=True) # cubic meters
    
    risk_level = Column(String, nullable=True) # Critical, High, Medium, Low
    
    created_at = Column(DateTime, default=datetime.utcnow)

class RiskZone(Base):
    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(Integer, ForeignKey('analysisresult.id'))
    risk_level = Column(String, nullable=False)
    # geometry = Column(Geometry(geometry_type='POLYGON', srid=4326), nullable=False)
    # Storing geometry as GeoJSON string for SQLite prototype
    geometry_geojson = Column(JSON, nullable=True) 
    description = Column(String, nullable=True)
    
    analysis = relationship("AnalysisResult")

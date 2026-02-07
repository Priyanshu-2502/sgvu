from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime

class ImageMetadataBase(BaseModel):
    filename: str
    capture_date: datetime
    image_type: str
    resolution: Optional[float] = None

class ImageMetadataCreate(ImageMetadataBase):
    pass

class ImageMetadata(ImageMetadataBase):
    id: int
    upload_date: datetime
    file_path: str

    class Config:
        from_attributes = True

class AnalysisResultBase(BaseModel):
    date_1: datetime
    date_2: datetime
    lake_area_1: Optional[float] = None
    lake_area_2: Optional[float] = None
    volume_change: Optional[float] = None
    risk_level: Optional[str] = None

class AnalysisResultCreate(AnalysisResultBase):
    pass

class AnalysisResult(AnalysisResultBase):
    id: int
    ndwi_path_1: Optional[str] = None
    ndwi_path_2: Optional[str] = None
    change_detection_path: Optional[str] = None
    risk_map_path: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

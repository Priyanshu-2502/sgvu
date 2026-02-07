from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.user import User
from app.core.config import settings
import smtplib
from email.mime.text import MIMEText
# from geoalchemy2.elements import WKTElement
import geopandas as gpd
import shapely.geometry
import json
import os
from geopy.distance import geodesic

def send_email(to_email: str, subject: str, body: str):
    """
    Send email using SMTP.
    """
    if not settings.SMTP_HOST:
        print(f"SMTP not configured. Mock sending email to {to_email}: {subject}")
        return

    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = settings.EMAILS_FROM_EMAIL
    msg['To'] = to_email

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            if settings.SMTP_TLS:
                server.starttls()
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)
    except Exception as e:
        print(f"Failed to send email: {e}")

def alert_users_in_flow_buffer(db: Session, flow_path_geojson: str, buffer_km: float = 2.0):
    """
    Load flow path GeoJSON, create a buffer, and find users within it.
    SQLite/Python implementation using Shapely/GeoPandas.
    """
    try:
        # Load Flow Path
        with open(flow_path_geojson, 'r') as f:
            data = json.load(f)
            
        # Extract geometry (LineString)
        geom = shapely.geometry.shape(data['geometry'])
        
        # Create Buffer
        # NOTE: Buffer in degrees (WGS84) is tricky. 1 deg ~= 111km.
        # 2km ~= 0.018 degrees. This is a rough approximation.
        buffer_degrees = buffer_km / 111.0 
        buffered_geom = geom.buffer(buffer_degrees)
        
        # Query ALL Users (Inefficient for large DB, fine for prototype)
        all_users = db.query(User).all()
        
        count = 0
        for user in all_users:
            user_point = shapely.geometry.Point(user.longitude, user.latitude)
            
            if buffered_geom.contains(user_point):
                subject = "GLACIERWATCH SOS: FLOOD RISK ALERT"
                body = f"""
                URGENT: You are located within the predicted flow path of a glacial lake outburst.
                The danger zone is approximately {buffer_km}km wide along the flow channel.
                
                Please evacuate to higher ground immediately.
                
                Detected at: {settings.PROJECT_NAME}
                """
                send_email(user.email, subject, body)
                count += 1
            
        return count
    except Exception as e:
        print(f"Error in alert system: {e}")
        return 0

def alert_users_in_danger_zone(db: Session, risk_location_wkt: str, radius_km: float = 10.0):
    """
    Find users within radius_km of the risk_location and send SOS.
    risk_location_wkt: WKT representation of the risk center/polygon.
    SQLite/Python implementation.
    """
    try:
        risk_point = shapely.wkt.loads(risk_location_wkt)
        risk_coords = (risk_point.y, risk_point.x) # Lat, Lon
        
        all_users = db.query(User).all()
        count = 0
        
        for user in all_users:
            user_coords = (user.latitude, user.longitude)
            # Calculate distance
            dist = geodesic(risk_coords, user_coords).km
            
            if dist <= radius_km:
                subject = "GLACIERWATCH SOS: HIGH RISK DETECTED"
                body = f"""
                URGENT: A high risk of glacial lake outburst has been detected in your vicinity.
                Please follow local evacuation protocols and move to higher ground immediately.
                
                Risk Level: Critical
                Detected at: {settings.PROJECT_NAME}
                """
                send_email(user.email, subject, body)
                count += 1
        
        return count
    except Exception as e:
        print(f"Error in radius alert: {e}")
        return 0

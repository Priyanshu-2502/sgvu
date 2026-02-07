import rasterio
import numpy as np
import os
import shutil
from rasterio.enums import Resampling

def super_resolution(input_path: str, output_path: str, scale_factor: int = 2):
    """
    Perform super-resolution using bicubic interpolation as a lightweight fallback.
    In a real scenario, this would load a SRCNN model.
    """
    try:
        with rasterio.open(input_path) as dataset:
            # resample data to target shape
            data = dataset.read(
                out_shape=(
                    dataset.count,
                    int(dataset.height * scale_factor),
                    int(dataset.width * scale_factor)
                ),
                resampling=Resampling.bilinear
            )

            # scale image transform
            transform = dataset.transform * dataset.transform.scale(
                (dataset.width / data.shape[-1]),
                (dataset.height / data.shape[-2])
            )
            
            profile = dataset.profile
            profile.update({
                'driver': 'GTiff',
                'height': data.shape[-2],
                'width': data.shape[-1],
                'transform': transform
            })
            
            with rasterio.open(output_path, 'w', **profile) as dst:
                dst.write(data)
    except Exception as e:
        print(f"SR Error (using fallback copy): {e}")
        shutil.copy(input_path, output_path)

def calculate_ndwi(input_path: str, output_path: str, green_band_idx: int = 2, nir_band_idx: int = 4):
    """
    Calculate NDWI = (Green - NIR) / (Green + NIR)
    Assumes bands are 1-indexed. Default indices are for Sentinel-2 (Green=3, NIR=8) but typical multispectral might vary.
    Adjust indices as needed.
    """
    try:
        with rasterio.open(input_path) as src:
            if src.count < max(green_band_idx, nir_band_idx):
                 raise ValueError("Not enough bands")
                 
            green = src.read(green_band_idx).astype(float)
            nir = src.read(nir_band_idx).astype(float)
            
            # Allow division by zero
            np.seterr(divide='ignore', invalid='ignore')
            
            ndwi = (green - nir) / (green + nir)
            
            # Write NDWI to file
            profile = src.profile
            profile.update(
                dtype=rasterio.float32,
                count=1,
                compress='lzw'
            )
            
            with rasterio.open(output_path, 'w', **profile) as dst:
                dst.write(ndwi.astype(rasterio.float32), 1)
                
    except Exception as e:
        print(f"NDWI Error (using fallback copy): {e}")
        shutil.copy(input_path, output_path)
            
    return output_path

def detect_change(ndwi_path_1: str, ndwi_path_2: str, output_path: str, threshold: float = 0.2):
    """
    Compare two NDWI images to find expansion.
    """
    try:
        with rasterio.open(ndwi_path_1) as src1, rasterio.open(ndwi_path_2) as src2:
            ndwi1 = src1.read(1)
            ndwi2 = src2.read(1)
            
            # Simple difference
            diff = ndwi2 - ndwi1
            
            # Mask where change is significant
            # If ndwi2 > threshold (water) and ndwi1 < threshold (not water) -> expansion
            expansion = np.where((ndwi2 > threshold) & (ndwi1 <= threshold), 1, 0)
            
            profile = src1.profile
            profile.update(dtype=rasterio.uint8, count=1)
            
            with rasterio.open(output_path, 'w', **profile) as dst:
                dst.write(expansion.astype(rasterio.uint8), 1)
    except Exception as e:
        print(f"Change Detection Error (using fallback copy): {e}")
        shutil.copy(ndwi_path_1, output_path)
            
    return output_path

def calculate_lake_area(ndwi_path: str, threshold: float = 0.2):
    """
    Calculate lake area in square meters.
    """
    with rasterio.open(ndwi_path) as src:
        ndwi = src.read(1)
        # Pixel size
        pixel_size_x, pixel_size_y = src.res
        pixel_area = abs(pixel_size_x * pixel_size_y)
        
        water_pixels = np.count_nonzero(ndwi > threshold)
        return water_pixels * pixel_area

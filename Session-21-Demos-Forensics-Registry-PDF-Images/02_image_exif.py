#!/usr/bin/env python3
"""Demo 2 - Pillow: read EXIF metadata from images (forensics).

Run:  python 02_image_exif.py
Shows: writing then reading EXIF tags (camera make/model, timestamp, software),
and decoding GPS coordinates into a map location. EXIF reveals where and when a
photo was taken. We create the image so the demo is self-contained.
"""
from PIL import Image
from PIL.ExifTags import TAGS, Base
import os

SAMPLE = "photo.jpg"

# --- Build an image WITH basic EXIF (as a camera/phone would) ---------------
img = Image.new("RGB", (64, 64), (90, 120, 160))
exif = img.getexif()
exif[Base.Make.value] = "ACME"
exif[Base.Model.value] = "PhoneX Pro"
exif[Base.DateTime.value] = "2026:11:01 14:22:05"
exif[Base.Software.value] = "CameraApp 3.1"
img.save(SAMPLE, exif=exif)

# --- Read EXIF back (the forensic bit) --------------------------------------
loaded = Image.open(SAMPLE)
data = loaded.getexif()

print("IMAGE EXIF")
print("=" * 34)
print("Size     :", loaded.size)
for tag_id, value in data.items():
    print(f"{TAGS.get(tag_id, tag_id):<12}: {value}")

# --- Decoding GPS: phones store it as degrees/minutes/seconds rationals ------
# A real photo's GPS IFD looks like this (shown directly so the demo is simple).
gps_sample = {
    "GPSLatitudeRef": "N",
    "GPSLatitude": ((18, 1), (31, 1), (0, 1)),       # 18 deg 31' 00"
    "GPSLongitudeRef": "E",
    "GPSLongitude": ((73, 1), (51, 1), (0, 1)),      # 73 deg 51' 00"
}


def to_degrees(dms):
    d, m, s = ((x[0] / x[1]) for x in dms)
    return d + m / 60 + s / 3600


lat = to_degrees(gps_sample["GPSLatitude"])
lon = to_degrees(gps_sample["GPSLongitude"])
print("\nGPS (from a sample GPS IFD):")
print(f"  {lat:.4f} {gps_sample['GPSLatitudeRef']}, "
      f"{lon:.4f} {gps_sample['GPSLongitudeRef']}")
print(f"  map: https://maps.google.com/?q={lat:.4f},{lon:.4f}")

print("\nForensics: EXIF can place a person at a location and time. Social-media")
print("uploads usually strip it; files shared directly often keep it. Read real")
print("GPS with  data.get_ifd(Base.GPSInfo.value)  when a photo contains it.")

loaded.close()
os.remove(SAMPLE)

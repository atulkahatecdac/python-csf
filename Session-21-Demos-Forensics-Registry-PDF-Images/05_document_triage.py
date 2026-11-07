#!/usr/bin/env python3
"""Demo 5 - Mini project: document & image metadata triage report.

Run:  python 05_document_triage.py
Brings together pypdf + Pillow + hashlib: scan a folder of documents and images,
hash each, pull metadata, and write a triage report flagging anything notable
(e.g. a Producer that reveals software, or a mismatch). Self-contained samples.
"""
import os
import hashlib
from pypdf import PdfWriter, PdfReader
from PIL import Image
from PIL.ExifTags import Base

EVID = "evidence"
os.makedirs(EVID, exist_ok=True)

# --- Create a couple of sample artifacts ------------------------------------
w = PdfWriter()
w.add_blank_page(width=300, height=300)
w.add_metadata({"/Author": "a.patil", "/Producer": "LibreOffice 7.6",
                "/Title": "Statement"})
with open(os.path.join(EVID, "statement.pdf"), "wb") as f:
    w.write(f)

img = Image.new("RGB", (48, 48), (120, 90, 60))
ex = img.getexif()
ex[Base.Make.value] = "ACME"
ex[Base.Software.value] = "CameraApp 3.1"
img.save(os.path.join(EVID, "scene.jpg"), exif=ex)


def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for b in iter(lambda: f.read(65536), b""):
            h.update(b)
    return h.hexdigest()


def meta_for(path):
    if path.lower().endswith(".pdf"):
        r = PdfReader(path)
        m = r.metadata or {}
        return {"type": "PDF", "pages": len(r.pages),
                "author": m.get("/Author"), "producer": m.get("/Producer")}
    if path.lower().endswith((".jpg", ".jpeg", ".png")):
        im = Image.open(path)
        tags = {k: v for k, v in im.getexif().items()}
        im.close()
        return {"type": "image", "size": None,
                "make": tags.get(Base.Make.value),
                "software": tags.get(Base.Software.value)}
    return {"type": "other"}


# --- Walk the evidence folder and report ------------------------------------
print("DOCUMENT & IMAGE TRIAGE")
print("=" * 52)
for name in sorted(os.listdir(EVID)):
    path = os.path.join(EVID, name)
    info = meta_for(path)
    print(f"\n{name}  [{info['type']}]")
    print(f"  sha256: {sha256(path)[:32]}...")
    for k, v in info.items():
        if k != "type" and v is not None:
            print(f"  {k}: {v}")

print("\nEach file is hashed (chain of custody) and its metadata extracted.")
print("A real triage flags author/producer, timestamps and GPS for follow-up.")

# --- Clean up ---------------------------------------------------------------
import shutil
shutil.rmtree(EVID)

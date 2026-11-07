#!/usr/bin/env python3
"""Demo 1 - PyPDF: parse PDF metadata (forensics).

Run:  python 01_pdf_metadata.py
Shows: reading document metadata (author, dates, producer), page count and
text - the information that often survives in documents and aids attribution.
We create a sample PDF so the demo is self-contained.
"""
from pypdf import PdfWriter, PdfReader
import os

SAMPLE = "sample.pdf"

# --- Create a small PDF with metadata (as an author tool would) -------------
writer = PdfWriter()
writer.add_blank_page(width=300, height=300)
writer.add_blank_page(width=300, height=300)
writer.add_metadata({
    "/Author": "a.patil",
    "/Title": "Quarterly Security Report",
    "/Producer": "Microsoft Word 2019",
    "/CreationDate": "D:20261101091500",
})
with open(SAMPLE, "wb") as f:
    writer.write(f)

# --- Read the metadata back (the forensic bit) ------------------------------
reader = PdfReader(SAMPLE)
meta = reader.metadata
print("PDF METADATA")
print("=" * 34)
print("Pages    :", len(reader.pages))
print("Title    :", meta.title)
print("Author   :", meta.author)
print("Producer :", meta.producer)        # often reveals the software/OS
print("Created  :", meta.get("/CreationDate"))
print("Encrypted:", reader.is_encrypted)

# --- Why it matters ---------------------------------------------------------
print("\nForensics: /Author and /Producer can attribute a document to a person")
print("or tool; mismatched Creation/Mod dates can reveal tampering or forgery.")
print("Metadata survives copying and is often forgotten when 'anonymising' files.")

os.remove(SAMPLE)

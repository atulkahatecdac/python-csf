#!/usr/bin/env python3
"""Demo 4 - Portable paths and file-integrity hashing.

Run:  python 04_paths_integrity.py
Shows: pathlib for OS-independent paths, reading bytes, hashing a file in
       chunks (forensic integrity), and detecting tampering.
"""
import hashlib
from pathlib import Path

# --- pathlib: the modern, cross-platform way to handle paths ----------------
here = Path(__file__).parent                 # the folder this script is in
target = here / "sample_auth.log"            # '/' joins paths on any OS
print("Path     :", target)
print("Name     :", target.name)
print("Suffix   :", target.suffix)
print("Exists   :", target.exists())
print("Size     :", target.stat().st_size, "bytes")


def sha256_file(path, chunk=65536):
    """Hash a file in chunks so huge files don't fill memory."""
    h = hashlib.sha256()
    with open(path, "rb") as f:              # 'rb' = read binary
        while True:
            block = f.read(chunk)
            if not block:
                break
            h.update(block)
    return h.hexdigest()


digest = sha256_file(target)
print("\nSHA-256  :", digest)

# --- Integrity check: does a copy match the original? -----------------------
# Write a verbatim copy, then a tampered copy, and compare hashes.
copy_ok = here / "copy_ok.log"
copy_bad = here / "copy_bad.log"
copy_ok.write_bytes(target.read_bytes())                     # exact copy
copy_bad.write_bytes(target.read_bytes() + b"tampered\n")    # altered

print("\nIntegrity check:")
print("  exact copy matches  :", sha256_file(copy_ok) == digest)
print("  tampered copy matches:", sha256_file(copy_bad) == digest)
print("\nOne changed byte -> a completely different hash. This is how")
print("forensic tools prove evidence has not been altered.")

#!/usr/bin/env python3
"""Demo 3 - Recover deleted-item info from the Recycle Bin ($I files).

Run:  python 03_recycle_bin.py          (Windows concept; runs anywhere)
Shows: parsing the Windows $Recycle.Bin '$I' metadata format with struct -
original path, size and deletion time of a deleted file. We build a sample $I
record so the demo is reproducible and needs no access to the real bin.

Layout of a $I file (Windows 10/11, header version 2):
  8 bytes  header (version = 2)
  8 bytes  original file size (little-endian)
  8 bytes  deletion time (Windows FILETIME)
  4 bytes  length of the name (chars, incl NUL)
  N*2      original path (UTF-16LE)
"""
import struct
from datetime import datetime, timedelta, timezone


def build_sample_I(path, size, when):
    """Create the bytes of a $I metadata file (as Windows would write)."""
    # FILETIME = 100-ns ticks since 1601-01-01
    epoch_1601 = datetime(1601, 1, 1, tzinfo=timezone.utc)
    ticks = int((when - epoch_1601).total_seconds() * 10_000_000)
    name = path.encode("utf-16-le") + b"\x00\x00"
    char_count = len(name) // 2
    return (struct.pack("<q", 2) +            # header version
            struct.pack("<q", size) +          # original size
            struct.pack("<q", ticks) +         # deletion time
            struct.pack("<i", char_count) +    # name length
            name)                              # UTF-16LE path


def parse_I(blob):
    """Parse a $I file's bytes back into readable fields."""
    version, size, ticks, char_count = struct.unpack_from("<qqqi", blob, 0)
    raw_name = blob[28:28 + char_count * 2]
    original_path = raw_name.decode("utf-16-le").rstrip("\x00")
    # FILETIME -> datetime
    deleted = datetime(1601, 1, 1, tzinfo=timezone.utc) + timedelta(microseconds=ticks / 10)
    return {
        "version": version,
        "original_path": original_path,
        "size": size,
        "deleted_utc": deleted.strftime("%Y-%m-%d %H:%M:%S"),
    }


# --- Build a couple of sample deleted-item records --------------------------
samples = [
    build_sample_I(r"C:\Users\asha\Documents\secret_plan.docx",
                   48213, datetime(2026, 11, 5, 9, 15, tzinfo=timezone.utc)),
    build_sample_I(r"C:\Users\asha\Downloads\tool.exe",
                   1048576, datetime(2026, 11, 6, 22, 40, tzinfo=timezone.utc)),
]

print("RECYCLE BIN - DELETED ITEMS")
print("=" * 52)
for blob in samples:
    info = parse_I(blob)
    print(f"Original : {info['original_path']}")
    print(f"  size   : {info['size']:,} bytes")
    print(f"  deleted: {info['deleted_utc']} UTC")
    print()

print("On a real system, read C:\\$Recycle.Bin\\<SID>\\$I* files the same way.")
print("The matching $R* file holds the actual deleted content. Emptying the bin")
print("removes these, but carving tools can still recover unallocated data.")

#!/usr/bin/env python3
"""Demo 3 - A tour of 'batteries included': useful standard-library modules.

Run:  python 03_stdlib_tour.py
Shows: built-in functions, and the math, datetime, hashlib, base64,
       collections and json modules - all shipped with Python.
"""
import datetime as dt
import hashlib
import base64
import json
from collections import Counter

# --- Built-in functions (no import needed) ----------------------------------
nums = [42, 7, 128, 15]
print("len/min/max/sum:", len(nums), min(nums), max(nums), sum(nums))
print("sorted         :", sorted(nums))
print("any/all > 10   :", any(n > 10 for n in nums), all(n > 10 for n in nums))

# --- hashlib: file and password hashing -------------------------------------
data = b"evidence.bin contents"
print("\nsha256:", hashlib.sha256(data).hexdigest()[:24], "...")

# --- base64: the encoding you see in tokens, emails, and malware ------------
token = base64.b64encode(b"user:password").decode()
print("base64 encode:", token)
print("base64 decode:", base64.b64decode(token).decode())

# --- collections.Counter: the log-analysis workhorse ------------------------
ips = ["10.0.0.5", "45.1.1.1", "10.0.0.5", "45.1.1.1", "45.1.1.1"]
print("\ntop talkers:", Counter(ips).most_common(2))

# --- json: read and write structured data (APIs, config, threat feeds) ------
record = {"ip": "45.1.1.1", "hits": 3, "blocked": True}
text = json.dumps(record)
print("\njson string:", text)
back = json.loads(text)
print("parsed hits:", back["hits"], "| type:", type(back).__name__)

# --- datetime: timestamps for every report ----------------------------------
now = dt.datetime.now()
print("\nISO timestamp:", now.isoformat(timespec="seconds"))

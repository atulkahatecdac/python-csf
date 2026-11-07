#!/usr/bin/env python3
"""Demo 2 - Parse a Firefox-style SQLite database (browser forensics).

Run:  python 02_firefox_sqlite.py
Shows: querying an SQLite database with the standard-library sqlite3 module,
decoding Firefox's timestamp format, and finding the most-visited and most
recent sites - classic browser-history forensics. We build a sample places.sqlite.
"""
import sqlite3
import os
from datetime import datetime, timezone

DB = "places.sqlite"

# --- Build a sample that mirrors Firefox's moz_places table ------------------
con = sqlite3.connect(DB)
con.execute("""CREATE TABLE moz_places(
    id INTEGER PRIMARY KEY, url TEXT, title TEXT,
    visit_count INTEGER, last_visit_date INTEGER)""")

# Firefox stores last_visit_date as MICROSECONDS since the Unix epoch.
def ff_time(dt):
    return int(dt.replace(tzinfo=timezone.utc).timestamp() * 1_000_000)

rows = [
    ("https://docs.python.org", "Python docs", 42, ff_time(datetime(2026, 11, 7, 9, 0))),
    ("https://news.example.com", "News", 15, ff_time(datetime(2026, 11, 6, 20, 0))),
    ("http://45.155.205.233/panel", "login", 7, ff_time(datetime(2026, 11, 7, 2, 30))),
    ("https://mail.example.com", "Webmail", 90, ff_time(datetime(2026, 11, 7, 8, 45))),
]
con.executemany("INSERT INTO moz_places(url,title,visit_count,last_visit_date) "
                "VALUES (?,?,?,?)", rows)
con.commit()

# --- Query it like a forensic analyst would ---------------------------------
def to_dt(micros):
    return datetime.fromtimestamp(micros / 1_000_000, timezone.utc)

print("MOST VISITED SITES")
print("=" * 48)
for url, title, visits in con.execute(
        "SELECT url, title, visit_count FROM moz_places "
        "ORDER BY visit_count DESC LIMIT 3"):
    print(f"  {visits:>4}x  {title:<12} {url}")

print("\nMOST RECENT VISITS")
print("=" * 48)
for url, last in con.execute(
        "SELECT url, last_visit_date FROM moz_places "
        "ORDER BY last_visit_date DESC LIMIT 4"):
    print(f"  {to_dt(last):%Y-%m-%d %H:%M}  {url}")

# --- Flag anything suspicious (IP-literal URLs, odd hours) -------------------
print("\nFLAGGED")
print("=" * 48)
for url, last in con.execute("SELECT url, last_visit_date FROM moz_places"):
    when = to_dt(last)
    reasons = []
    if any(c.isdigit() for c in url.split("/")[2].split(".")[0]):
        reasons.append("IP-literal host")
    if 0 <= when.hour < 5:
        reasons.append("visited overnight")
    if reasons:
        print(f"  {url}  ({', '.join(reasons)})")

con.close()
os.remove(DB)

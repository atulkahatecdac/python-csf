#!/usr/bin/env python3
"""Demo 5 - Mini project: brute-force detector from a log, using dicts.

Run:  python 05_log_analysis.py
Brings together: dicts as counters and groupers, nested dicts, sorting by value.
The log is a sample embedded in the script - no files or network yet.
"""

# Sample auth events: (timestamp, ip, user, result)
events = [
    ("10:00", "45.155.205.233", "root",  "FAIL"),
    ("10:01", "45.155.205.233", "root",  "FAIL"),
    ("10:01", "10.0.0.21",      "alice", "OK"),
    ("10:02", "45.155.205.233", "admin", "FAIL"),
    ("10:02", "45.155.205.233", "root",  "FAIL"),
    ("10:03", "45.155.205.233", "root",  "OK"),      # breach after many fails
    ("10:04", "203.0.113.9",    "bob",   "FAIL"),
]

# --- Count failures per IP --------------------------------------------------
fails = {}
for _, ip, _, result in events:
    if result == "FAIL":
        fails[ip] = fails.get(ip, 0) + 1

print("Failed logins per IP:")
for ip, n in sorted(fails.items(), key=lambda kv: kv[1], reverse=True):
    flag = "  <-- brute force" if n >= 3 else ""
    print(f"  {ip:<16} {n}{flag}")

# --- Which usernames were targeted, per IP (nested dict of sets) -------------
targets = {}
for _, ip, user, result in events:
    if result == "FAIL":
        targets.setdefault(ip, set()).add(user)
print("\nUsernames targeted:")
for ip, users in targets.items():
    print(f"  {ip:<16} {', '.join(sorted(users))}")

# --- Correlate: a success from an IP that already failed a lot = compromise -
print("\nPossible compromises:")
for ts, ip, user, result in events:
    if result == "OK" and fails.get(ip, 0) >= 3:
        print(f"  {ts}  {user}@{ip} logged in AFTER {fails[ip]} failures")

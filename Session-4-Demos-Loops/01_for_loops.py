#!/usr/bin/env python3
"""Demo 1 - for loops.

Run:  python 01_for_loops.py
Shows: looping over a list, a range, a string and a dict; enumerate();
       accumulating a total. The 'scan' is simulated - no network traffic.
"""

# --- Over a list ------------------------------------------------------------
suspicious_ips = ["185.220.101.4", "45.155.205.233", "10.0.0.15"]
for ip in suspicious_ips:
    print("Checking", ip)

# --- Over a range: a simulated port check ---------------------------------
OPEN_PORTS = {22, 80, 443}            # pretend these answered
print("\nScanning ports 20-25 and 79-81 on 10.0.0.5 (simulated)")
for port in list(range(20, 26)) + list(range(79, 82)):
    state = "open" if port in OPEN_PORTS else "closed"
    print(f"  {port:>3}/tcp  {state}")

# --- Over a string: count digits in a hostname ------------------------------
hostname = "web01-dc2-prod7"
digits = 0
for ch in hostname:
    if ch.isdigit():
        digits += 1
print(f"\n{hostname!r} contains {digits} digits")

# --- enumerate(): index and value together ----------------------------------
log = ["login ok", "login FAILED", "login FAILED", "logout"]
for line_no, entry in enumerate(log, start=1):
    if "FAILED" in entry:
        print(f"Line {line_no}: {entry}")

# --- Over a dict: keys and values with .items() ------------------------------
services = {22: "ssh", 80: "http", 443: "https"}
total = 0
for port, name in services.items():
    print(f"{port:>4} -> {name}")
    total += port
print("Sum of ports (just to show accumulation):", total)

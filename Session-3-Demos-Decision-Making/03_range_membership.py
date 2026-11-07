#!/usr/bin/env python3
"""Demo 3 - range() and the in / not in operators.

Run:  python 03_range_membership.py
Shows: the three forms of range(), range objects are lazy,
       membership tests on ranges, lists, strings and dictionaries.
"""

# --- range(stop), range(start, stop), range(start, stop, step) ----------
print(list(range(5)))              # 0..4  (stop is excluded)
print(list(range(20, 26)))         # 20..25
print(list(range(0, 50, 10)))      # step 10
print(list(range(10, 0, -3)))      # counting down

# A range is lazy: it stores start/stop/step, not every number
all_ports = range(1, 65536)
print("Ports in range:", len(all_ports), "| first:", all_ports[0], "| last:", all_ports[-1])

# --- in / not in -----------------------------------------------------------
port = 8080
print("\nPrivileged port?  ", port in range(1, 1024))
print("Valid port?       ", port in all_ports)

blocklist = ["185.220.101.4", "45.155.205.233"]
src = "45.155.205.233"
if src in blocklist:
    print(f"BLOCK {src}: on threat-intel blocklist")

user_agent = "sqlmap/1.7.2#stable (https://sqlmap.org)"
if "sqlmap" in user_agent.lower():
    print("Scanner detected in User-Agent")

allowed_methods = ("GET", "POST", "HEAD")
method = "DELETE"
if method not in allowed_methods:
    print(f"405 Method Not Allowed: {method}")

# in on a dict checks the KEYS
services = {22: "ssh", 80: "http", 443: "https"}
print("\n443 in services?   ", 443 in services)
print("'ssh' in services? ", "ssh" in services, "(keys, not values)")

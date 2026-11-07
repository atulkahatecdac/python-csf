#!/usr/bin/env python3
"""Demo 3 - List methods.

Run:  python 03_methods.py
Shows: append, extend, insert, remove, pop, index, count, clear,
       and using a list as a stack and a queue.
"""

alerts = []

# --- Growing a list ---------------------------------------------------------
alerts.append("port scan")                     # add one item
alerts.extend(["malware hash", "bad login"])   # add several
alerts.insert(0, "CRITICAL: exfiltration")     # at a position
print("Alerts:", alerts)

# --- Finding and counting ---------------------------------------------------
print("\nindex of 'bad login':", alerts.index("bad login"))
log = ["GET", "POST", "GET", "GET", "DELETE"]
print("GET count:", log.count("GET"))

# --- Removing ---------------------------------------------------------------
alerts.remove("port scan")                     # by value (first match)
first = alerts.pop(0)                           # by index, returns it
print("\nhandled first:", first)
print("remaining:", alerts)

# --- As a stack (LIFO): append / pop ----------------------------------------
undo = []
undo.append("rule1"); undo.append("rule2")
print("\nundo last change:", undo.pop())        # 'rule2'

# --- As a queue (FIFO): append / pop(0) -------------------------------------
queue = ["job1", "job2", "job3"]
print("process next   :", queue.pop(0))         # 'job1'

# --- Membership-driven dedupe (order kept) ----------------------------------
seen_ips = ["1.1.1.1", "8.8.8.8", "1.1.1.1", "9.9.9.9", "8.8.8.8"]
unique = []
for ip in seen_ips:
    if ip not in unique:
        unique.append(ip)
print("\nunique IPs:", unique)

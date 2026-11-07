#!/usr/bin/env python3
"""Demo 5 - Mini project: summarise a connection table.

Run:  python 05_connection_table.py
Brings together: 2D data as a list of tuples, unpacking, sorting by a key,
and building a small per-state and per-port summary. Data is sample, not live.
"""

# Each row: (src_ip, dst_ip, dst_port, state)   - a netstat-like snapshot
conns = [
    ("10.0.0.5", "93.184.216.34", 443, "ESTABLISHED"),
    ("10.0.0.5", "10.0.0.9", 22, "ESTABLISHED"),
    ("10.0.0.7", "45.155.205.233", 4444, "ESTABLISHED"),  # 4444 = common C2 port
    ("10.0.0.5", "8.8.8.8", 53, "TIME_WAIT"),
    ("10.0.0.7", "45.155.205.233", 4444, "SYN_SENT"),
]

# --- Count connections per state -------------------------------------------
state_counts = {}
for *_, state in conns:                      # ignore the first fields
    state_counts[state] = state_counts.get(state, 0) + 1
print("Connections by state:")
for state, n in state_counts.items():
    print(f"  {state:<12} {n}")

# --- Flag connections to suspicious high ports -----------------------------
SUSPICIOUS = {4444, 1337, 31337}
print("\nSuspicious connections:")
for src, dst, port, state in conns:
    if port in SUSPICIOUS:
        print(f"  {src} -> {dst}:{port}  ({state})")

# --- Sort by destination port (a tuple field) via a key ---------------------
print("\nSorted by destination port:")
for src, dst, port, state in sorted(conns, key=lambda row: row[2]):
    print(f"  {port:>5}  {src:<10} -> {dst}")

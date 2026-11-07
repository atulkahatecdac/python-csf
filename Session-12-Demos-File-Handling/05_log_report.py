#!/usr/bin/env python3
"""Demo 5 - Mini project: read a log, analyse it, write a report file.

Run:  python 05_log_report.py
Brings together: reading a file line by line, counting with a dict,
and writing a formatted report - the shape of real log-analysis scripts.
"""
from collections import Counter
from datetime import datetime

SRC = "sample_auth.log"
OUT = "auth_report.txt"

fails_by_ip = Counter()
accepts = 0
total = 0

with open(SRC, encoding="utf-8") as f:
    for line in f:
        total += 1
        parts = line.split()
        ip = parts[parts.index("from") + 1] if "from" in parts else "?"
        if line.startswith("Failed"):
            fails_by_ip[ip] += 1
        elif line.startswith("Accepted"):
            accepts += 1

# Write the report to a file
with open(OUT, "w", encoding="utf-8") as r:
    r.write("AUTH LOG REPORT\n")
    r.write(f"Generated: {datetime.now():%Y-%m-%d %H:%M}\n")
    r.write(f"Source   : {SRC}\n")
    r.write("=" * 34 + "\n")
    r.write(f"Total events : {total}\n")
    r.write(f"Accepted     : {accepts}\n")
    r.write(f"Failed       : {sum(fails_by_ip.values())}\n\n")
    r.write("Failed logins by source IP:\n")
    for ip, n in fails_by_ip.most_common():
        flag = "  <-- brute force" if n >= 2 else ""
        r.write(f"  {ip:<18} {n}{flag}\n")

# Show what we wrote
print(f"Wrote {OUT}:\n")
with open(OUT, encoding="utf-8") as r:
    print(r.read())

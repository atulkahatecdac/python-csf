#!/usr/bin/env python3
"""Demo 3 - break, continue and the loop else clause.

Run:  python 03_break_continue_else.py
Shows: skipping lines with continue, stopping early with break,
       and for...else to report 'not found'.
"""

auth_log = """
# sample auth.log extract
Nov  7 10:14:01 srv sshd[811]: Accepted password for alice from 10.0.0.21
Nov  7 10:14:09 srv sshd[812]: Failed password for root from 45.155.205.233

Nov  7 10:14:11 srv sshd[812]: Failed password for root from 45.155.205.233
Nov  7 10:14:15 srv sshd[813]: Accepted password for root from 45.155.205.233
Nov  7 10:15:40 srv cron[900]: (root) CMD (backup.sh)
""".splitlines()

IOC_IP = "45.155.205.233"

# --- continue: skip blank lines and comments --------------------------------
print("Relevant lines:")
for line in auth_log:
    if not line.strip() or line.startswith("#"):
        continue
    print("  ", line[16:])            # drop the timestamp

# --- break + else: find the first SUCCESSFUL login from the IOC -------------
for line in auth_log:
    if "Accepted" in line and IOC_IP in line:
        print("\nALERT - attacker logged in:", line[:15])
        break
else:
    print("\nNo successful login from", IOC_IP)

# --- Same search for an IP that never appears ---------------------------------
for line in auth_log:
    if "Accepted" in line and "203.0.113.50" in line:
        print("Found 203.0.113.50")
        break
else:
    print("No successful login from 203.0.113.50 (else clause ran)")

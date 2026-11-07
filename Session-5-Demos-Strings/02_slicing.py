#!/usr/bin/env python3
"""Demo 2 - String slicing.

Run:  python 02_slicing.py
Shows: s[start:stop:step], negative indexes, default bounds,
       reversing with [::-1], and slicing fields out of a log line.
"""

ioc = "a94a8fe5ccb19ba61c4c0873d391e987982fbbd3"   # a SHA-1 hex digest

# --- s[start:stop]  (stop is excluded) -------------------------------------
print("First 8 :", ioc[:8])        # start defaults to 0
print("Last 8  :", ioc[-8:])       # negative start
print("Middle  :", ioc[8:16])

# --- Step --------------------------------------------------------------------
print("Every 4th char:", ioc[::4])
print("Reversed      :", ioc[::-1])      # the slicing idiom for reverse

# --- Slicing fields out of a fixed-format line -----------------------------
line = "2026-11-07 10:15:42 [WARN ] auth: failed login for root"
date = line[0:10]
time = line[11:19]
level = line[21:26].strip()
message = line[28:]
print(f"\ndate={date}  time={time}  level={level!r}")
print("message:", message)

# --- Redact all but the last 4 of a card-like number -----------------------
card = "4111111111111234"
masked = "*" * (len(card) - 4) + card[-4:]
print("\nMasked:", masked)

# A slice never raises IndexError, even out of range
print("\nSafe slice past the end:", repr(ioc[100:200]))   # ''

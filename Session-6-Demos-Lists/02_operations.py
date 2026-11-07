#!/usr/bin/env python3
"""Demo 2 - List operations: join, repeat, slice, sort.

Run:  python 02_operations.py
Shows: + and *, slicing copies, sorted() vs sort(), reverse,
       min/max/sum, and the aliasing-vs-copy trap again (now for lists).
"""

internal = ["10.0.0.5", "10.0.0.6"]
external = ["8.8.8.8", "1.1.1.1"]

# --- Joining and repeating --------------------------------------------------
all_hosts = internal + external               # concatenation -> new list
print("Joined:", all_hosts)
print("Repeat:", [0] * 5)                     # [0, 0, 0, 0, 0] - init a buffer

# --- Slicing makes a shallow copy -------------------------------------------
backup = all_hosts[:]                          # full-slice copy
backup.append("192.168.1.1")
print("\noriginal:", all_hosts)                # unchanged
print("backup  :", backup)

# --- Sorting ----------------------------------------------------------------
latencies = [42, 7, 128, 15, 3]
print("\nsorted() (new) :", sorted(latencies))
print("original intact:", latencies)
latencies.sort(reverse=True)                   # sort() changes in place
print("after .sort()  :", latencies)

ips = ["10.0.0.20", "10.0.0.3", "10.0.0.100"]
print("string sort    :", sorted(ips))         # NOT numeric order!

# --- Aggregates -------------------------------------------------------------
print("\nmin/max/sum:", min(latencies), max(latencies), sum(latencies))
print("average    :", sum(latencies) / len(latencies))

#!/usr/bin/env python3
"""Demo 5 - List comprehensions: filter and transform in one line.

Run:  python 05_comprehensions.py
Shows: map-style and filter-style comprehensions on security-flavoured data.
"""

log_lines = [
    "200 GET /index.html",
    "404 GET /secret",
    "200 POST /login",
    "500 GET /api/users",
    "403 GET /admin",
]

# --- Transform: pull out the status code (int) from each line ----------------
codes = [int(line.split()[0]) for line in log_lines]
print("Status codes:", codes)

# --- Filter: only the error responses (>= 400) ------------------------------
errors = [line for line in log_lines if int(line.split()[0]) >= 400]
print("\nError responses:")
for e in errors:
    print("  ", e)

# --- Transform + filter together --------------------------------------------
paths_with_errors = [line.split()[2] for line in log_lines
                     if int(line.split()[0]) >= 400]
print("\nPaths that errored:", paths_with_errors)

# --- Compare to the long form -----------------------------------------------
squares_loop = []
for n in range(1, 6):
    squares_loop.append(n * n)
squares_comp = [n * n for n in range(1, 6)]
print("\nSame result:", squares_loop, "==", squares_comp)

# --- A nested comprehension: all host IPs in two subnets --------------------
hosts = [f"10.0.{net}.{h}" for net in (1, 2) for h in range(1, 3)]
print("Generated hosts:", hosts)

#!/usr/bin/env python3
"""Demo 1 - Creating and accessing dictionaries.

Run:  python 01_create_access.py
Shows: dict literals, dict(), lookup, the KeyError trap, .get() with a default,
       membership (keys), and adding/updating/deleting entries.
"""

# --- Creating ---------------------------------------------------------------
ports = {22: "ssh", 80: "http", 443: "https"}      # key: value pairs
host = dict(ip="10.0.0.5", os="Linux", patched=False)
empty = {}
print("ports:", ports)
print("host :", host)

# --- Accessing by key -------------------------------------------------------
print("\nport 22 is", ports[22])

# Missing key with [] raises KeyError; .get() returns a default instead
try:
    print(ports[8080])
except KeyError as err:
    print("KeyError:", err)
print("get(8080):", ports.get(8080))                 # None
print("get(8080, 'unknown'):", ports.get(8080, "unknown"))

# --- Membership checks the KEYS ---------------------------------------------
print("\n443 in ports? ", 443 in ports)
print("'https' in ports?", "https" in ports, "(values are not checked)")

# --- Add, update, delete ----------------------------------------------------
ports[53] = "dns"                 # add
ports[80] = "HTTP"                # update (keys are unique)
del ports[22]                     # delete
removed = ports.pop(53, None)     # delete and return, safe if absent
print("\nafter edits:", ports, "| popped:", removed)
print("size:", len(ports))

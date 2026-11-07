#!/usr/bin/env python3
"""Demo 1 - String basics and operators.

Run:  python 01_string_operators.py
Shows: indexing, len(), immutability, concatenation (+), replication (*),
       membership (in), comparison (==, <) and why case matters.
"""

cmd = "powershell -enc SQBFAFgA"

# --- Indexing: positions start at 0; negative counts from the end ----------
print("First char :", cmd[0])
print("Last char  :", cmd[-1])
print("Length     :", len(cmd))

# --- Strings are immutable ------------------------------------------------
try:
    cmd[0] = "P"
except TypeError as err:
    print("TypeError  :", err)

# --- Concatenation and replication -----------------------------------------
user, host = "root", "10.0.0.5"
target = user + "@" + host
print("\nConcatenated:", target)
print("=" * 30)                       # replication builds separators and banners
print("ALERT".center(30, "*"))
print("=" * 30)

# Concatenating a number needs str() (or an f-string)
port = 22
print("ssh " + target + " -p " + str(port))

# --- Membership ---------------------------------------------------------------
print("\n'-enc' in cmd?      ", "-enc" in cmd)      # encoded PowerShell = suspicious
print("'bash' not in cmd?  ", "bash" not in cmd)

# --- Comparison: character by character, using Unicode code points -------------
print("\n'admin' == 'Admin'? ", "admin" == "Admin")
print("ord('A'), ord('a')  ", ord("A"), ord("a"))
print("'Zebra' < 'apple'?  ", "Zebra" < "apple")    # uppercase sorts first
print("Case-insensitive    ", "admin".lower() == "Admin".lower())

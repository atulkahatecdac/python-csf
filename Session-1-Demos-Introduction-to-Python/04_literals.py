#!/usr/bin/env python3
"""Demo 4 - Literals: values written directly in source code.

Run:  python 04_literals.py
Shows: string literal forms (quotes, escapes, raw, triple, f-strings),
       bytes literals, bool/None and collection literals.
"""

# Single vs double quotes - identical; pick the one that avoids escaping
msg1 = 'Login failed for user "root"'
msg2 = "It's a brute-force attempt"
print(msg1)
print(msg2)

# Escape sequences
print("Col1\tCol2\tCol3")              # \t tab
print("Line one\nLine two")            # \n newline
print("Path: C:\\Windows\\System32")  # \\ gives one backslash

# Raw strings: backslashes are kept as-is (Windows paths, regex patterns)
log_path = r"C:\Windows\System32\winevt\Logs\Security.evtx"
print("Raw path:", log_path)

# Triple-quoted strings span multiple lines
banner = """
  +---------------------------+
  |  AUTHORISED ACCESS ONLY   |
  +---------------------------+"""
print(banner)

# f-string literal: expressions inside { } are evaluated
user, attempts = "admin", 5
print(f"User {user} failed {attempts} times")

# Unicode literal: \u escapes or the characters themselves
print("Lock:", "\U0001F512", "| Check:", "\u2714", "| Rupee:", "\u20b9")

# Bytes literal: raw data as on the wire / on disk
magic = b"\x89PNG"
print("PNG magic bytes:", magic, "length:", len(magic))

# Boolean and None literals
is_admin = False
session_token = None
print("is_admin:", is_admin, "| token:", session_token)

# Collection literals (covered in detail in later sessions)
ports = [21, 22, 80, 443]               # list
endpoint = ("10.0.0.5", 443)            # tuple
service = {"port": 22, "name": "ssh"}   # dict
seen_ips = {"1.1.1.1", "8.8.8.8"}       # set
print(ports, endpoint, service, seen_ips, sep="\n")

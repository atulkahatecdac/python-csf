#!/usr/bin/env python3
"""Demo 3 - String methods.

Run:  python 03_methods.py
Shows: case, strip, split/join, find/replace, startswith/endswith,
       the is* tests, and why normalising input matters for security.
"""

raw = "   Administrator@CORP.LOCAL\n"

# --- Cleaning and case -----------------------------------------------------
clean = raw.strip()                      # remove surrounding whitespace/newline
print("stripped :", repr(clean))
print("lower    :", clean.lower())
print("upper    :", clean.upper())

# --- split() and join() ----------------------------------------------------
user, domain = clean.lower().split("@")
print("\nuser =", user, "| domain =", domain)

csv_row = "10.0.0.5,22,open,ssh"
fields = csv_row.split(",")
print("fields   :", fields)
print("re-joined:", " | ".join(fields))

# --- Searching and replacing -----------------------------------------------
log = "GET /admin/../../etc/passwd HTTP/1.1"
print("\nfind('../')      :", log.find("../"))     # index, or -1 if absent
print("count('../')     :", log.count("../"))
print("contains passwd? :", "passwd" in log)
print("replaced         :", log.replace("../", ""))

# --- Prefix / suffix tests -------------------------------------------------
url = "https://example.com/login"
print("\nhttps?           :", url.startswith("https://"))
for name in ("report.pdf", "invoice.exe", "photo.jpg"):
    if name.endswith((".exe", ".bat", ".scr")):
        print("  Blocked attachment:", name)

# --- The is* tests (handy for validation) ----------------------------------
for token in ("8080", "root", "ab12", "  "):
    print(f"  {token!r:8} isdigit={token.isdigit()} "
          f"isalpha={token.isalpha()} isalnum={token.isalnum()}")

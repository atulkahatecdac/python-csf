#!/usr/bin/env python3
"""Demo 1 - Importing modules: the four forms.

Run:  python 01_importing.py
Shows: import module, import ... as, from ... import, from ... import *,
       and inspecting a module with dir() and __name__.
"""

# 1. Import the whole module; use it with the module name as a prefix
import math
print("math.sqrt(2) =", round(math.sqrt(2), 4))
print("math.pi      =", round(math.pi, 4))

# 2. Import with an alias (common for long names)
import datetime as dt
print("now          :", dt.datetime.now().strftime("%Y-%m-%d %H:%M"))

# 3. Import selected names directly (no prefix needed)
from hashlib import sha256, md5
print("sha256('a')  :", sha256(b"a").hexdigest()[:16], "...")

# 4. from module import *  -- convenient but risky (see troubleshooting)
from os.path import *
print("join demo    :", join("logs", "2026", "auth.log"))

# --- Inspecting a module ----------------------------------------------------
import string
print("\nstring has  :", [n for n in dir(string) if not n.startswith("_")][:5], "...")
print("digits      :", string.digits)
print("punctuation :", string.punctuation)

# --- The __name__ guard: run only when executed directly --------------------
def main():
    print("\nRunning as a script (__name__ == '__main__')")

if __name__ == "__main__":
    main()

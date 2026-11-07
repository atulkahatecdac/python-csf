#!/usr/bin/env python3
"""Demo 1 - Your first Python program: a tiny 'system recon' banner.

Run:  python 01_hello_recon.py
Shows: print(), importing a module, and that Python can inspect the machine it runs on.
"""
import platform
import sys
import getpass

print("=" * 44)
print("  Python for Cyber Security - Host Recon")
print("=" * 44)

print("Python version :", platform.python_version())
print("Interpreter    :", sys.executable)
print("Operating sys  :", platform.system(), platform.release())
print("Machine / CPU  :", platform.machine())
print("Host name      :", platform.node())
print("Logged-in user :", getpass.getuser())

# The first thing an incident responder records is *where* evidence came from.

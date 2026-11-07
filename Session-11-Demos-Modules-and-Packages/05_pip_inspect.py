#!/usr/bin/env python3
"""Demo 5 - Inspecting the environment: installed packages and module paths.

Run:  python 05_pip_inspect.py
Covers the self-learning task 'use pip to list installed packages programmatically'.
Shows where Python looks for modules and how to list what's installed.
"""
import sys
from importlib import metadata

# --- Which Python, and where does it look for modules? ----------------------
print("Interpreter:", sys.executable)
print("Version    :", sys.version.split()[0])
print("\nModule search path (sys.path), first 3 entries:")
for p in sys.path[:3]:
    print("  ", p or "(current directory)")

# --- List installed third-party packages (like 'pip list', in code) ---------
print("\nInstalled packages (first 12):")
dists = sorted(((d.metadata["Name"], d.version) for d in metadata.distributions()),
               key=lambda t: t[0].lower())
for name, version in dists[:12]:
    print(f"  {name:<22} {version}")
print(f"  ... {len(dists)} packages in total")

# --- Is a specific package available, and which version? --------------------
for pkg in ("scapy", "requests", "definitely-not-installed"):
    try:
        print(f"\n{pkg}: {metadata.version(pkg)}")
    except metadata.PackageNotFoundError:
        print(f"\n{pkg}: not installed")

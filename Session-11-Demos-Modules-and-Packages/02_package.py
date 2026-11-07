#!/usr/bin/env python3
"""Demo 2 - Using a package you wrote (the netkit/ folder).

Run:  python 02_package.py
Shows: importing from a package, submodules, __init__ re-exports, __version__.
A package is a folder with an __init__.py that groups related modules.
"""

# Import names the package re-exports from its __init__.py
from netkit import is_private, name_for, __version__

# Import a submodule directly
import netkit.ip as ipmod

print("netkit version:", __version__)
print()

for ip in ["10.0.0.5", "8.8.8.8", "172.16.9.9"]:
    where = "internal" if is_private(ip) else "external"
    print(f"{ip:<14} {where:<9} as int = {ipmod.to_int(ip)}")

print()
for port in [22, 443, 9999]:
    print(f"port {port:<5} -> {name_for(port)}")

# Where did Python find the package?
import netkit
print("\nnetkit loaded from:", netkit.__file__)

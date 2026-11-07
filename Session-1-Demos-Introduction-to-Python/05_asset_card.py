#!/usr/bin/env python3
"""Demo 5 - Mini project: an asset inventory card.

Run:  python 05_asset_card.py
Brings together: variables, every basic data type, literals and type().
"""

# One asset described with variables of different types
hostname = "WEB-SRV-01"            # str
ip_address = "172.16.4.20"         # str
open_ports = 3                     # int
cpu_load = 37.5                    # float
is_patched = False                 # bool
owner = None                       # NoneType (not yet assigned)
mac_prefix = b"\x00\x1a\x2b"       # bytes

print("+------------------------------------------+")
print("|           ASSET INVENTORY CARD           |")
print("+------------------------------------------+")
print(f"| Hostname   : {hostname:<28}|")
print(f"| IP address : {ip_address:<28}|")
print(f"| Open ports : {open_ports:<28}|")
print(f"| CPU load % : {cpu_load:<28}|")
print(f"| Patched    : {str(is_patched):<28}|")
print(f"| Owner      : {str(owner):<28}|")
print(f"| MAC prefix : {mac_prefix.hex(':'):<28}|")
print("+------------------------------------------+")

print("\nVariable      Type")
print("-----------   ---------")
for name, value in [("hostname", hostname), ("open_ports", open_ports),
                    ("cpu_load", cpu_load), ("is_patched", is_patched),
                    ("owner", owner), ("mac_prefix", mac_prefix)]:
    print(f"{name:<13} {type(value).__name__}")

# Note: the for-loop above is a preview - loops are covered in Session 4.

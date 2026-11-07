#!/usr/bin/env python3
"""Demo 1 - The ipaddress module (standard library, no privileges needed).

Run:  python 01_ipaddress.py
Shows: validating IPs, classifying them, subnet maths, iterating hosts,
       checking membership - the right tool instead of hand-rolled parsing.
"""
import ipaddress

# --- Validate and classify an address ---------------------------------------
for text in ["10.0.0.5", "8.8.8.8", "127.0.0.1", "999.1.1.1"]:
    try:
        ip = ipaddress.ip_address(text)
        kind = ("loopback" if ip.is_loopback else
                "private" if ip.is_private else "global")
        print(f"{text:<12} v{ip.version}  {kind}")
    except ValueError as err:
        print(f"{text:<12} INVALID ({err})")

# --- Subnet maths (replaces the bitwise calculator from Session 2) ----------
net = ipaddress.ip_network("172.16.45.0/24")
print(f"\nNetwork     : {net}")
print(f"Netmask     : {net.netmask}")
print(f"Broadcast   : {net.broadcast_address}")
print(f"Usable hosts: {net.num_addresses - 2}")
print(f"First hosts : {[str(h) for h in list(net.hosts())[:3]]} ...")

# --- Is an address inside a subnet? -----------------------------------------
suspect = ipaddress.ip_address("172.16.45.130")
print(f"\n{suspect} in {net}? ", suspect in net)
print(f"{suspect} in 10.0.0.0/8? ",
      suspect in ipaddress.ip_network("10.0.0.0/8"))

# --- Split a block into smaller subnets -------------------------------------
print("\n/24 split into /26 subnets:")
for sub in ipaddress.ip_network("172.16.45.0/24").subnets(new_prefix=26):
    print("  ", sub)

# --- Sort IPs NUMERICALLY (the fix for Session 6's string-sort gotcha) ------
ips = ["10.0.0.20", "10.0.0.3", "10.0.0.100"]
print("\nnumeric sort:", [str(x) for x in sorted(ipaddress.ip_address(i) for i in ips)])

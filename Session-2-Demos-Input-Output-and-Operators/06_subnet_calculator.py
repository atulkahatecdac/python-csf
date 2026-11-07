#!/usr/bin/env python3
"""Demo 6 - Mini project: an interactive subnet calculator.

Run:  python 06_subnet_calculator.py
Brings together: input(), type casting, bitwise operators and f-strings.
(Session 16 does the same job with the ipaddress module.)
"""

ip_text = input("IPv4 address (e.g. 172.16.45.130): ")
prefix = int(input("Prefix length (e.g. 26)          : "))

# "172.16.45.130" -> four ints
a, b, c, d = ip_text.split(".")
a, b, c, d = int(a), int(b), int(c), int(d)

# Pack the four octets into one 32-bit integer
ip = (a << 24) | (b << 16) | (c << 8) | d

# Mask: prefix ones followed by (32 - prefix) zeros
mask = (0xFFFFFFFF << (32 - prefix)) & 0xFFFFFFFF
network = ip & mask
broadcast = network | (~mask & 0xFFFFFFFF)
hosts = 2 ** (32 - prefix) - 2


def dotted(n):
    """Turn a 32-bit int back into dotted-decimal text (functions: Session 9)."""
    return f"{n >> 24 & 255}.{n >> 16 & 255}.{n >> 8 & 255}.{n & 255}"


print()
print(f"{'Address':<12}: {dotted(ip):<16} {ip:032b}")
print(f"{'Netmask':<12}: {dotted(mask):<16} {mask:032b}")
print(f"{'Network':<12}: {dotted(network):<16} {network:032b}")
print(f"{'Broadcast':<12}: {dotted(broadcast):<16} {broadcast:032b}")
print(f"{'First host':<12}: {dotted(network + 1)}")
print(f"{'Last host':<12}: {dotted(broadcast - 1)}")
print(f"{'Usable hosts':<12}: {hosts:,}")

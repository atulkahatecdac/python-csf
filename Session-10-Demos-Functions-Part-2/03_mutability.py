#!/usr/bin/env python3
"""Demo 3 - Argument mutability: what a function can and cannot change.

Run:  python 03_mutability.py
Shows: immutable arguments are untouched; mutable arguments CAN be changed
       in place by the callee; how to protect the caller's data with a copy.
"""


def try_to_change(n, text):
    """n and text are immutable; rebinding here does NOT affect the caller."""
    n += 100
    text += " MODIFIED"
    return n, text


count = 1
label = "scan"
try_to_change(count, label)
print("Immutable args unchanged:", count, label)     # still 1, 'scan'


def add_port(port_list, port):
    """A list is mutable: this changes the CALLER's list in place."""
    port_list.append(port)


ports = [22, 80]
add_port(ports, 443)
print("Mutable arg changed:", ports)                 # [22, 80, 443]


def normalise(ips):
    """Mutating input is a trap. Work on a copy and return it."""
    cleaned = [ip.strip().lower() for ip in ips]      # new list
    return cleaned


raw = [" 10.0.0.5 ", "8.8.8.8\n"]
clean = normalise(raw)
print("\noriginal still raw:", raw)
print("returned cleaned  :", clean)


def wipe(secret_bytes):
    """bytearray is mutable - security tools overwrite secrets after use."""
    for i in range(len(secret_bytes)):
        secret_bytes[i] = 0


key = bytearray(b"s3cr3t")
wipe(key)
print("\nwiped key:", bytes(key))                     # b'\x00\x00...'

#!/usr/bin/env python3
"""Demo 5 - Type casting (type conversion).

Run:  python 05_type_casting.py
Shows: implicit vs explicit conversion, base conversion, chr/ord,
       and the conversions that surprise beginners.
"""

# --- Implicit conversion: Python widens int -> float automatically ------
packets = 10
avg_size = 512.5
print("int + float  :", packets + avg_size, type(packets + avg_size))
print("True + 1     :", True + 1)

# --- Explicit conversion: parse fields from a log line -----------------
log = "2026-11-07 10:15:42 SRC=192.168.1.10 DPORT=443 BYTES=1500 BLOCKED=1"
parts = log.split()                     # split on spaces (preview of strings)
dport = int(parts[3].split("=")[1])     # "443"  -> 443
size = float(parts[4].split("=")[1])    # "1500" -> 1500.0
blocked = bool(int(parts[5].split("=")[1]))   # "1" -> 1 -> True
print("\nDPORT  :", dport, type(dport).__name__)
print("BYTES  :", size, type(size).__name__)
print("BLOCKED:", blocked, type(blocked).__name__)

# --- Number bases --------------------------------------------------------
print("\nint('ff', 16)      =", int("ff", 16))
print("int('0x1bb', 16)   =", int("0x1bb", 16))
print("int('11000000', 2) =", int("11000000", 2))
print("hex(255), bin(5)   =", hex(255), bin(5))

# --- Characters <-> code points (encoding, obfuscation, ciphers) --------
print("\nord('A') =", ord("A"), "| chr(97) =", chr(97))
hidden = [112, 97, 115, 115]
print("Decoded :", "".join(chr(n) for n in hidden))

# --- str <-> bytes ------------------------------------------------------
data = "secret".encode("utf-8")
print("\nencode ->", data, "| hex ->", data.hex(), "| decode ->", data.decode())

# --- Surprises ------------------------------------------------------------
print("\nbool('False') =", bool("False"), " <- any non-empty string is True")
print("bool('')      =", bool(""))
print("int(9.99)     =", int(9.99), " <- truncates, does not round")
print("round(9.99)   =", round(9.99))
for text in ["42", "3.5", "abc"]:
    try:
        print(f"int({text!r}) =", int(text))
    except ValueError as err:
        print(f"int({text!r}) -> ValueError: {err}")

#!/usr/bin/env python3
"""Demo 3 - Numbers: int, float, complex and number bases.

Run:  python 03_numbers_and_bases.py
Shows: integer bases used everywhere in security (hex, binary, octal),
       Python's unlimited integers, and float precision.
"""

# Integers in different bases - all are the same type: int
port_dec = 443
port_hex = 0x1BB          # hexadecimal  (memory dumps, packet bytes)
port_bin = 0b110111011    # binary       (bit flags, subnet masks)
perm_oct = 0o755          # octal        (Linux file permissions rwxr-xr-x)
print("443 written 3 ways:", port_dec, port_hex, port_bin)
print("chmod 755 as decimal:", perm_oct)

# Convert an int to text in another base
print("hex(443) =", hex(443), "| bin(443) =", bin(443), "| oct(493) =", oct(493))

# Python ints never overflow: size of a 256-bit key space
key_space = 2 ** 256
print("AES-256 key space has", len(str(key_space)), "digits:")
print(key_space)

# Floats - decimal fractions are approximated in binary
print("0.1 + 0.2 =", 0.1 + 0.2)
print("Equal to 0.3?", 0.1 + 0.2 == 0.3)
print("Rounded:", round(0.1 + 0.2, 2))

# Scientific notation literal
packets_per_sec = 1.5e6
print("Packets/sec:", packets_per_sec)

# Complex numbers (used in signal processing; rare in security)
z = 3 + 4j
print("z =", z, "real:", z.real, "imag:", z.imag, "|z| =", abs(z))

# Booleans are a subclass of int
print("True + True =", True + True, "| isinstance(True, int):", isinstance(True, int))

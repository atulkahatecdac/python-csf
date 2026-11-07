#!/usr/bin/env python3
"""Demo 4 - Operators with security-flavoured examples.

Run:  python 04_operators.py
Shows: arithmetic, comparison, logical, assignment, bitwise,
       membership and identity operators.
"""

# --- Arithmetic ------------------------------------------------------------
total_bytes = 1_000_000
mtu = 1500
print("Full packets  :", total_bytes // mtu)      # floor division
print("Leftover bytes:", total_bytes % mtu)       # modulus
print("Exact ratio   :", total_bytes / mtu)       # true division -> float
print("4-digit PINs  :", 10 ** 4)                 # power

# Caesar shift uses % to wrap around the alphabet
letter_pos, shift = 23, 3                         # 'x' + 3
print("Wrapped pos   :", (letter_pos + shift) % 26)  # 0 -> 'a'

# --- Comparison and logical ----------------------------------------------
port = 8080
print("\nUnprivileged port?", 1024 <= port <= 65535)   # chained comparison
failed, minutes = 6, 2
print("Brute force?      ", failed > 5 and minutes < 5)
is_admin = False
print("Regular user?     ", not is_admin)

# Short-circuit: right side is skipped when the left side decides the result
token = ""                                  # empty -> falsy
result = token and token.startswith("Bearer")   # startswith() never runs
print("Token check gives ", repr(result))       # '' (the falsy left side)

# --- Assignment operators ------------------------------------------------
alerts = 0
alerts += 1
alerts *= 10
print("\nalerts after += 1 and *= 10:", alerts)

# --- Bitwise: subnet maths --------------------------------------------------
ip = (192 << 24) | (168 << 16) | (1 << 8) | 77   # 192.168.1.77 as one int
mask = 0xFFFFFF00                                  # /24 = 255.255.255.0
network = ip & mask
broadcast = network | (~mask & 0xFFFFFFFF)
print(f"\nIP        : {ip:032b}")
print(f"Mask      : {mask:032b}")
print(f"Network   : {network:032b}")
print(f"Network   : {network >> 24 & 255}.{network >> 16 & 255}."
      f"{network >> 8 & 255}.{network & 255}")
print(f"Broadcast : {broadcast >> 24 & 255}.{broadcast >> 16 & 255}."
      f"{broadcast >> 8 & 255}.{broadcast & 255}")

# --- Bitwise: XOR - the heart of many ciphers ------------------------------
key = 0x5A
plain = ord("A")                 # 65
cipher = plain ^ key
print(f"\n'A' ^ 0x5A = {cipher}  -> back again: {chr(cipher ^ key)}")

# --- Membership and identity -----------------------------------------------
risky_ports = [21, 23, 445, 3389]
print("\n23 in risky_ports?    ", 23 in risky_ports)
print("443 not in risky_ports?", 443 not in risky_ports)
print("'admin' in 'sysadmin'? ", "admin" in "sysadmin")
session = None
print("session is None?       ", session is None)

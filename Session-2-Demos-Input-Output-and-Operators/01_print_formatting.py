#!/usr/bin/env python3
"""Demo 1 - Output with print() and formatted strings.

Run:  python 01_print_formatting.py
Shows: print() parameters (sep, end, file), three formatting styles,
       and the format-spec mini-language used to build clean reports.
"""
import sys

# --- print() parameters -------------------------------------------------
print("10", "0", "0", "1", sep=".")             # sep  -> 10.0.0.1
print("Scanning", end="... ")                   # end  -> stay on same line
print("done")
print("[!] Write errors to stderr", file=sys.stderr)  # file -> another stream

# --- three ways to format the same line ---------------------------------
host, port, state = "10.0.0.5", 22, "open"
print("%s:%d is %s" % (host, port, state))             # old  % style
print("{}:{} is {}".format(host, port, state))         # str.format()
print(f"{host}:{port} is {state}")                     # f-string (use this)

# --- format spec: {value:[align][width][.precision][type]} -------------
print()
print(f"{'HOST':<12}{'PORT':>6}  {'STATE':<10}{'SERVICE'}")
print("-" * 35)
print(f"{'10.0.0.5':<12}{22:>6}  {'open':<10}ssh")
print(f"{'10.0.0.5':<12}{80:>6}  {'open':<10}http")
print(f"{'10.0.0.5':<12}{3389:>6}  {'filtered':<10}rdp")

# --- numbers in other bases and with separators -------------------------
flags = 18
print()
print(f"TCP flags {flags} -> binary {flags:08b}  hex 0x{flags:02X}")
print(f"Bytes transferred: {1234567890:,}")
print(f"Detection rate   : {0.98765:.2%}")
print(f"Debug view       : {host=}  {port=}")    # self-documenting (3.8+)

#!/usr/bin/env python3
"""Demo 2 - Reading input from the keyboard.

Run:  python 02_input_basics.py
Shows: input() always returns a str, converting it, and getpass for secrets.
"""
from getpass import getpass

target = input("Target host  : ")
port_text = input("Target port  : ")

print("\nYou typed port", port_text, "->", type(port_text))

port = int(port_text)                       # convert text -> int
print("After int()  :", port, "->", type(port))
print("Next port    :", port + 1)            # arithmetic now works

# getpass hides what is typed - never use input() for passwords
password = getpass("Password     : ")
print(f"\nConnecting to {target}:{port} with a {len(password)}-character password")

# Several values on one line, separated by spaces: "192.168.1.1 24"
ip, prefix = input("IP and prefix (e.g. 192.168.1.1 24): ").split()
print(f"IP = {ip}, prefix = /{int(prefix)}")

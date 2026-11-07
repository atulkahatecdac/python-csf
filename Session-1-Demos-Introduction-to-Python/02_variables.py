#!/usr/bin/env python3
"""Demo 2 - Variables are names that point to objects.

Run:  python 02_variables.py
Shows: assignment, multiple assignment, swapping, dynamic typing, id() and type().
"""

# 1. Simple assignment - the name on the left is bound to the object on the right
target_host = "10.0.0.5"
open_port = 22
is_alive = True
print("Target:", target_host, "| Port:", open_port, "| Alive:", is_alive)

# 2. Multiple assignment in one line
src_ip, dst_ip, proto = "192.168.1.10", "8.8.8.8", "UDP"
print("Flow:", src_ip, "->", dst_ip, "over", proto)

# 3. Same value to many names
failed_logins = blocked_ips = alerts = 0
print("Counters:", failed_logins, blocked_ips, alerts)

# 4. Swap without a temporary variable
primary_dns, backup_dns = "1.1.1.1", "8.8.8.8"
primary_dns, backup_dns = backup_dns, primary_dns
print("After swap -> primary:", primary_dns, "backup:", backup_dns)

# 5. Dynamic typing: the NAME has no type, the OBJECT does
evidence = 404
print("evidence =", evidence, "->", type(evidence))
evidence = "404 Not Found"
print("evidence =", evidence, "->", type(evidence))

# 6. id() gives the identity (memory address) of the object a name points to
a = "admin"
b = a                      # b now points to the SAME object
print("id(a) == id(b)?", id(a) == id(b))

# 7. Deleting a name
del evidence
# print(evidence)          # uncomment -> NameError: name 'evidence' is not defined

#!/usr/bin/env python3
"""Demo 2 - Traversing dictionaries and their methods.

Run:  python 02_traverse_methods.py
Shows: keys(), values(), items(); iterating; update(); setdefault();
       and the counter pattern that underlies most log analysis.
"""

inventory = {
    "web01": {"ip": "10.0.0.5", "os": "Linux"},
    "dc01":  {"ip": "10.0.0.6", "os": "Windows"},
}

# --- keys(), values(), items() ----------------------------------------------
print("hosts  :", list(inventory.keys()))
print("details:", list(inventory.values()))

# --- Iterating: by key, then by key+value -----------------------------------
for host in inventory:                     # looping a dict yields its keys
    print(" ", host)
print()
for host, info in inventory.items():       # key and value together
    print(f"  {host:<6} {info['ip']:<10} {info['os']}")

# --- update(): merge another dict -------------------------------------------
settings = {"timeout": 30, "retries": 3}
settings.update({"retries": 5, "verbose": True})
print("\nsettings:", settings)

# --- The counter pattern: tally events -------------------------------------
log_ips = ["10.0.0.5", "45.155.205.233", "10.0.0.5",
           "45.155.205.233", "45.155.205.233", "8.8.8.8"]
counts = {}
for ip in log_ips:
    counts[ip] = counts.get(ip, 0) + 1     # default 0 on first sight
print("\nhits per IP:", counts)

# Who hit us 3+ times? (possible brute force / scan)
for ip, n in counts.items():
    if n >= 3:
        print(f"  ALERT: {ip} seen {n} times")

# setdefault(): group values under a key
by_os = {}
for host, info in inventory.items():
    by_os.setdefault(info["os"], []).append(host)
print("\ngrouped by OS:", by_os)

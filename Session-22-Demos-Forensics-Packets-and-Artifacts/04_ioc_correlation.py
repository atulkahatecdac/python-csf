#!/usr/bin/env python3
"""Demo 4 - Correlate an IOC across multiple artifacts.

Run:  python 04_ioc_correlation.py
Shows: taking one indicator (a bad IP) and searching for it across packet data,
browser history and a log file at once - the heart of an investigation.
All data is sample data built in-script.
"""
import warnings
warnings.filterwarnings("ignore")
import socket
import os
import dpkt
import sqlite3
from scapy.all import Ether, IP, TCP, wrpcap

IOC = "45.155.205.233"          # the indicator we are hunting

hits = []       # (source, detail)

# --- 1) Packet capture ------------------------------------------------------
wrpcap("cap.pcap", [
    Ether() / IP(src="10.0.0.7", dst=IOC) / TCP(dport=4444),
    Ether() / IP(src="10.0.0.5", dst="8.8.8.8") / TCP(dport=443),
])
with open("cap.pcap", "rb") as f:
    for ts, buf in dpkt.pcap.Reader(f):
        ip = dpkt.ethernet.Ethernet(buf).data
        if isinstance(ip, dpkt.ip.IP) and socket.inet_ntoa(ip.dst) == IOC:
            hits.append(("pcap", f"{socket.inet_ntoa(ip.src)} -> {IOC}:"
                                 f"{ip.data.dport}"))
os.remove("cap.pcap")

# --- 2) Browser history (SQLite) --------------------------------------------
con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE moz_places(url TEXT, visit_count INT)")
con.executemany("INSERT INTO moz_places VALUES (?,?)",
                [(f"http://{IOC}/panel", 7), ("https://docs.python.org", 42)])
for (url,) in con.execute("SELECT url FROM moz_places WHERE url LIKE ?",
                          (f"%{IOC}%",)):
    hits.append(("browser", url))
con.close()

# --- 3) Auth log (text) -----------------------------------------------------
log = [
    f"Failed password for root from {IOC} port 40112",
    "Accepted password for alice from 10.0.0.21 port 51514",
    f"Accepted password for root from {IOC} port 40180",
]
for line in log:
    if IOC in line:
        hits.append(("auth.log", line.strip()))

# --- Correlated report ------------------------------------------------------
print(f"IOC INVESTIGATION: {IOC}")
print("=" * 52)
print(f"Found in {len({h[0] for h in hits})} data sources, {len(hits)} total hits:\n")
for source, detail in hits:
    print(f"  [{source:<8}] {detail}")

print("\nConclusion: the same IP brute-forced SSH (auth.log), the host was")
print("browsed to (history), and a C2-style connection followed (pcap).")
print("Correlating one IOC across artifacts is how investigations are built.")

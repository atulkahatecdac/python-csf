#!/usr/bin/env python3
"""Lab - familiarise with dpkt and sqlite3 (syllabus lab task).

Run:  python 03_lab_familiarise.py
Offline and cross-platform. dpkt parses packets; sqlite3 reads databases.
"""
import warnings
warnings.filterwarnings("ignore")
import socket
import os
import dpkt
import sqlite3
from scapy.all import Ether, IP, TCP, wrpcap

print("=== dpkt ===")
wrpcap("one.pcap", [Ether() / IP(src="10.0.0.5", dst="1.1.1.1") / TCP(dport=80)])
with open("one.pcap", "rb") as f:
    for ts, buf in dpkt.pcap.Reader(f):
        eth = dpkt.ethernet.Ethernet(buf)
        ip = eth.data
        print("  ts        :", round(ts, 2))
        print("  src -> dst :", socket.inet_ntoa(ip.src), "->", socket.inet_ntoa(ip.dst))
        print("  protocol  :", type(ip.data).__name__)
        print("  dport     :", ip.data.dport)
os.remove("one.pcap")

print("\n=== sqlite3 ===")
con = sqlite3.connect(":memory:")
con.execute("CREATE TABLE logs(ip TEXT, hits INT)")
con.executemany("INSERT INTO logs VALUES (?,?)",
                [("10.0.0.5", 3), ("45.1.1.1", 9), ("8.8.8.8", 1)])
print("  all rows   :", con.execute("SELECT * FROM logs").fetchall())
print("  top talker :", con.execute(
    "SELECT ip, MAX(hits) FROM logs").fetchone())
print("  filtered   :", con.execute(
    "SELECT ip FROM logs WHERE hits >= 3 ORDER BY hits DESC").fetchall())
con.close()

print("\nExplore: dpkt.ethernet/ip/tcp/udp/dns, and SQL via sqlite3.")

#!/usr/bin/env python3
"""Demo 1 - dpkt: parse packets from a PCAP (forensics).

Run:  python 01_dpkt_packets.py
Shows: reading a capture with dpkt, decoding Ethernet/IP/TCP/UDP layers, and
summarising a conversation. dpkt is a fast, pure-Python packet parser.
We build the sample PCAP with scapy so the demo is self-contained and offline.
"""
import warnings
warnings.filterwarnings("ignore")
import socket
import os
import dpkt
from collections import Counter
from scapy.all import Ether, IP, TCP, UDP, wrpcap

PCAP = "capture.pcap"

# --- Build a small sample capture -------------------------------------------
pkts = [
    Ether() / IP(src="10.0.0.5", dst="8.8.8.8") / UDP(sport=50000, dport=53),
    Ether() / IP(src="10.0.0.5", dst="93.184.216.34") / TCP(sport=50001, dport=443),
    Ether() / IP(src="10.0.0.7", dst="45.155.205.233") / TCP(sport=50002, dport=4444),
    Ether() / IP(src="10.0.0.5", dst="93.184.216.34") / TCP(sport=50001, dport=443),
    Ether() / IP(src="10.0.0.7", dst="45.155.205.233") / TCP(sport=50003, dport=4444),
]
wrpcap(PCAP, pkts)

# --- Parse it with dpkt -----------------------------------------------------
proto_count = Counter()
port_count = Counter()
conversations = Counter()

with open(PCAP, "rb") as f:
    for ts, buf in dpkt.pcap.Reader(f):
        eth = dpkt.ethernet.Ethernet(buf)
        if not isinstance(eth.data, dpkt.ip.IP):
            continue
        ip = eth.data
        src = socket.inet_ntoa(ip.src)
        dst = socket.inet_ntoa(ip.dst)
        if isinstance(ip.data, dpkt.tcp.TCP):
            proto_count["TCP"] += 1
            port_count[ip.data.dport] += 1
        elif isinstance(ip.data, dpkt.udp.UDP):
            proto_count["UDP"] += 1
            port_count[ip.data.dport] += 1
        conversations[(src, dst)] += 1

print("PCAP SUMMARY")
print("=" * 40)
print("Protocols    :", dict(proto_count))
print("\nTop conversations:")
for (src, dst), n in conversations.most_common():
    print(f"  {src:<10} -> {dst:<16} {n} pkts")

print("\nDestination ports:")
SUSPECT = {4444, 1337, 31337}
for port, n in port_count.most_common():
    flag = "  <-- suspicious" if port in SUSPECT else ""
    print(f"  {port:<6} {n}{flag}")

os.remove(PCAP)

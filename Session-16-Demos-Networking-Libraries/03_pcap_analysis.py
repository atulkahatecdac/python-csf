#!/usr/bin/env python3
"""Demo 3 - Scapy: write a sample PCAP, then read and analyse it.

Run:  python 03_pcap_analysis.py
Shows: building a capture file in memory, writing it with wrpcap, reading it
with rdpcap, and summarising traffic - the core of offline PCAP forensics.
No live capture: we create the sample ourselves so the demo is reproducible.
"""
import warnings
warnings.filterwarnings("ignore")
from collections import Counter
from scapy.all import IP, TCP, UDP, Ether, wrpcap, rdpcap

PCAP = "sample.pcap"

# --- Build a small, synthetic capture ---------------------------------------
packets = [
    Ether() / IP(src="10.0.0.5", dst="93.184.216.34") / TCP(dport=443),
    Ether() / IP(src="10.0.0.5", dst="8.8.8.8") / UDP(dport=53),
    Ether() / IP(src="10.0.0.7", dst="45.155.205.233") / TCP(dport=4444),  # odd
    Ether() / IP(src="10.0.0.5", dst="93.184.216.34") / TCP(dport=443),
    Ether() / IP(src="10.0.0.7", dst="45.155.205.233") / TCP(dport=4444),
    Ether() / IP(src="10.0.0.8", dst="10.0.0.1") / UDP(dport=53),
]
wrpcap(PCAP, packets)
print(f"Wrote {len(packets)} packets to {PCAP}\n")

# --- Read it back and analyse -----------------------------------------------
cap = rdpcap(PCAP)
print(f"Loaded {len(cap)} packets")

talkers = Counter()
dst_ports = Counter()
for pkt in cap:
    if pkt.haslayer(IP):
        talkers[pkt[IP].src] += 1
        if pkt.haslayer(TCP):
            dst_ports[pkt[TCP].dport] += 1
        elif pkt.haslayer(UDP):
            dst_ports[pkt[UDP].dport] += 1

print("\nTop source IPs:")
for ip, n in talkers.most_common():
    print(f"  {ip:<12} {n} packets")

print("\nDestination ports:")
SUSPICIOUS = {4444, 1337, 31337}
for port, n in dst_ports.most_common():
    flag = "  <-- suspicious" if port in SUSPICIOUS else ""
    print(f"  {port:<6} {n}{flag}")

import os
os.remove(PCAP)                                     # tidy up the sample

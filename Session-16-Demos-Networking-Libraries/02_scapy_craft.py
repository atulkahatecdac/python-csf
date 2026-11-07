#!/usr/bin/env python3
"""Demo 2 - Scapy: build and dissect packets IN MEMORY (no sending).

Run:  python 02_scapy_craft.py
Shows: layered packet construction with /, inspecting fields and layers,
       converting to/from raw bytes. Nothing is sent on the network.

NOTE: This demo only builds and reads packet objects. Sending or sniffing
real traffic needs Npcap (Windows) or root (Linux) and must only be done on
networks you are authorised to test. That is a lab exercise, not run here.
"""
import warnings
warnings.filterwarnings("ignore")                 # hide scapy's startup notes
from scapy.all import IP, TCP, UDP, ICMP, Raw, hexdump

# --- Layers stack with the '/' operator -------------------------------------
pkt = IP(src="10.0.0.5", dst="93.184.216.34") / TCP(dport=443, flags="S")
print("Summary:", pkt.summary())

# --- Inspect fields by layer ------------------------------------------------
print("\nIP  src  :", pkt[IP].src)
print("IP  dst  :", pkt[IP].dst)
print("TCP dport:", pkt[TCP].dport)
print("TCP flags:", pkt[TCP].flags, "(S = SYN, the start of a handshake)")
print("Has TCP layer?", pkt.haslayer(TCP))

# --- A UDP/DNS-style packet and an ICMP ping --------------------------------
dns_q = IP(dst="8.8.8.8") / UDP(dport=53) / Raw(load=b"...query...")
ping = IP(dst="10.0.0.1") / ICMP()
print("\nUDP packet:", dns_q.summary())
print("ICMP packet:", ping.summary())

# --- Packets are just bytes: serialise and parse back -----------------------
raw = bytes(pkt)
print(f"\nSerialised to {len(raw)} bytes. First 16:")
print(hexdump(raw[:16], dump=True))

reparsed = IP(raw)                                 # dissect raw bytes -> layers
print("Re-parsed dport:", reparsed[TCP].dport)

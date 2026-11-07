#!/usr/bin/env python3
"""Lab - familiarising with the module functions (the syllabus lab task).

Run:  python 05_familiarise.py
Walks through the headline functions of ipaddress, scapy and dnslib so students
can see what each library offers. Everything here is offline and safe.
"""
import warnings
warnings.filterwarnings("ignore")
import ipaddress
from scapy.all import IP, TCP
import dnslib

print("=== ipaddress ===")
addr = ipaddress.ip_address("10.0.0.5")
net = ipaddress.ip_network("10.0.0.0/29")
print("ip_address :", addr, "| is_private:", addr.is_private)
print("ip_network :", net, "| hosts:", [str(h) for h in net.hosts()])
print("overlaps   :", net.overlaps(ipaddress.ip_network("10.0.0.0/24")))

print("\n=== scapy (offline) ===")
pkt = IP(dst="8.8.8.8") / TCP(dport=80, flags="S")
print("build      :", pkt.summary())
print("layers     :", [layer.__name__ for layer in (IP, TCP) if pkt.haslayer(layer)])
print("field get  :", pkt[TCP].dport)
pkt[TCP].dport = 8080                       # fields are editable
print("field set  :", pkt[TCP].dport)

print("\n=== dnslib ===")
q = dnslib.DNSRecord.question("test.local", "AAAA")
print("question   :", q.q.qname, dnslib.QTYPE[q.q.qtype])
print("pack/parse :", len(q.pack()), "bytes ->",
      dnslib.DNSRecord.parse(q.pack()).q.qname)

print("\nTip: explore any object with dir(x), help(x), and type(x).")
print("Remember: craft and parse freely; only SEND/SNIFF on authorised labs.")

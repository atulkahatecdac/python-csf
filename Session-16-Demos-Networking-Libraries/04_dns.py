#!/usr/bin/env python3
"""Demo 4 - DNS: build/parse queries offline (dnslib), optional live lookup.

Run:  python 04_dns.py
Shows: constructing and parsing DNS messages with dnslib (no network), and
an OPTIONAL real lookup with dnspython that is skipped if offline.
"""
import dnslib

# --- Build a DNS query message (pure bytes, no network) ---------------------
query = dnslib.DNSRecord.question("example.com", "A")
packed = query.pack()
print("Built a DNS query:")
print(f"  {len(packed)} bytes, qname = {query.q.qname}, type = A")

# --- Parse raw DNS bytes back into a structured object ----------------------
parsed = dnslib.DNSRecord.parse(packed)
print("\nParsed it back:")
print(f"  question: {parsed.q.qname} ({dnslib.QTYPE[parsed.q.qtype]})")
print(f"  id      : {parsed.header.id}")

# --- Build a DNS RESPONSE (as a server would) -------------------------------
reply = query.reply()
reply.add_answer(*dnslib.RR.fromZone("example.com 300 A 93.184.216.34"))
print("\nConstructed a response:")
for rr in reply.rr:
    print(f"  {rr.rname} -> {rr.rdata}  (TTL {rr.ttl})")

# --- Optional: a real lookup with dnspython (skipped if no network) ---------
print("\nLive lookup (optional):")
try:
    import dns.resolver
    resolver = dns.resolver.Resolver()
    resolver.lifetime = 3.0
    answers = resolver.resolve("example.com", "A")
    for a in answers:
        print(f"  example.com -> {a.address}")
except Exception as err:
    print(f"  skipped (no network or resolver): {type(err).__name__}")

# Why this matters in security:
print("\nDNS is used to exfiltrate data and reach C2. Parsing DNS lets you")
print("spot odd query names, huge TXT records, and high query volumes.")

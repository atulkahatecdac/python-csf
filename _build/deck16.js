// Session 16: Networking - ipaddress, scapy (offline), dns, dnslib
const { Deck, C } = require("./lib");

module.exports = async function build(out) {
  const d = new Deck(16, "Networking Libraries");

  await d.titleSlide({
    title: "Networking: ipaddress, Scapy and DNS",
    subtitle: "Do subnet maths, craft and dissect packets, and build or parse DNS messages in Python.",
    flow: [
      ["FaNetworkWired", "ipaddress", "Subnets, validation", C.coral],
      ["FaLayerGroup", "Scapy", "Craft & dissect packets", C.navy],
      ["FaFilePdf", "PCAP", "Read captures offline", C.teal],
      ["FaGlobe", "DNS", "Build & parse messages", C.coral],
    ],
    notes: "First applied session: the networking toolkit. ipaddress for addresses and subnets; Scapy for packets; dnslib/dnspython for DNS. IMPORTANT lab rule up front: we craft and parse packets in memory and read capture files, but we do NOT send or sniff live traffic in class. Sending/sniffing is for authorised lab networks only, with Npcap (Windows) or root (Linux).",
  });

  await d.goalsAgenda({
    sub: "Theory with a live demo after every concept",
    goals: [
      ["FaNetworkWired", "Validate IPs and do subnet maths with `ipaddress`"],
      ["FaLayerGroup", "Build and dissect packets with Scapy (offline)"],
      ["FaFilePdf", "Read and analyse a PCAP file"],
      ["FaGlobe", "Construct and parse DNS messages"],
    ],
    agenda: [
      "ipaddress module",
      "D1  Subnets & validation",
      "Scapy: layers & fields",
      "D2  Craft & dissect (no send)",
      "D3  Analyse a PCAP",
      "DNS with dnslib / dnspython",
      "D4  Build & parse DNS",
      "D5  Lab: familiarise with each",
      "Authorisation & challenge",
    ],
    notes: "Setup note: scapy is installed via requirements.txt. Live capture needs Npcap on Windows; the course demos avoid it so they run anywhere.",
  });

  await d.iconRows({
    title: "The ipaddress Module",
    sub: "Standard library; no privileges, no network - just correct address maths",
    rows: [
      { icon: "FaCheckCircle", color: C.coral, head: "`ip_address(text)`", text: "Validates and classifies: `.version`, `.is_private`, `.is_loopback`." },
      { icon: "FaNetworkWired", color: C.navy, head: "`ip_network(cidr)`", text: "`.netmask`, `.broadcast_address`, `.num_addresses`, `.hosts()`." },
      { icon: "FaSearch", color: C.teal, head: "Membership & overlap", text: "`addr in net`, `net.overlaps(other)` - no bitwise maths needed." },
      { icon: "FaCut", color: C.purple, head: "`subnets()` / `supernet()`", text: "Split a block into smaller ones, or combine. Sort IPs numerically as a key." },
    ],
    panel: { caption: "Correct and readable", fontSize: 10.5, lines: [
      "import ipaddress as ipa",
      "net = ipa.ip_network(\"172.16.45.0/24\")",
      "net.num_addresses          # 256",
      "list(net.hosts())[0]       # .1",
      "",
      "ipa.ip_address(\"172.16.45.130\") in net",
      "# True",
      "",
      "sorted(ips, key=ipa.ip_address)",
      "# numeric, not string, order",
    ] },
    notes: "This replaces the hand-rolled bitwise subnet calculator from Session 2. Always prefer ipaddress: it handles IPv6, validation and edge cases correctly. The key= fix finally sorts IPs numerically.",
  });

  await d.demo({
    tag: "D1", name: "Subnets & Validation", file: "01_ipaddress.py", codeW: 4.9,
    code: [
      "import ipaddress",
      "",
      "ip = ipaddress.ip_address(\"10.0.0.5\")",
      "ip.version, ip.is_private       # 4, True",
      "ipaddress.ip_address(\"999.1.1.1\")  # ValueError",
      "",
      "net = ipaddress.ip_network(\"172.16.45.0/24\")",
      "net.netmask, net.broadcast_address",
      "net.num_addresses - 2           # usable hosts",
      "",
      "ipaddress.ip_address(\"172.16.45.130\") in net",
      "",
      "for sub in net.subnets(new_prefix=26):",
      "    print(sub)",
    ],
    output: [
      "10.0.0.5     v4  private",
      "8.8.8.8      v4  global",
      "127.0.0.1    v4  loopback",
      "999.1.1.1    INVALID",
      "",
      "Network: 172.16.45.0/24",
      "Usable hosts: 254",
      "172.16.45.130 in net?  True",
      "/26 subnets: .0 .64 .128 .192",
      "numeric sort: .3 .20 .100",
    ],
    watch: [
      "`ip_address` validates for you",
      "Subnet maths without bit twiddling",
      "`key=ip_address` sorts numerically",
    ],
    notes: "Contrast with Session 2's manual version: ipaddress is shorter, handles IPv6, and never has an off-by-one. The numeric sort fixes the string-sort gotcha from Session 6.",
  });

  // Scapy layers diagram
  {
    const s = d.slide("Scapy models a packet as a stack of layers joined with the / operator, mirroring the real protocol stack. Each layer is an object whose fields you can read and set. bytes(pkt) serialises it to wire format; IP(raw) dissects raw bytes back into layers. In this course we build and read packets; we do not send them.");
    d.heading(s, "Scapy: Packets Are Layered Objects", "Stack protocols with '/', read fields by layer");
    const { tb } = require("./lib");
    const layers = [
      ["Ether", "src/dst MAC", C.gray],
      ["IP", "src/dst IP, ttl", C.navy],
      ["TCP", "sport/dport, flags", C.coral],
      ["Raw", "payload bytes", C.teal],
    ];
    let y = 1.5;
    for (let i = 0; i < layers.length; i++) {
      const [name, fields, col] = layers[i];
      s.addShape("roundRect", { x: 0.7, y, w: 1.9, h: 0.62, fill: { color: col }, line: { color: col }, rectRadius: 0.06 });
      tb(s, name, { x: 0.7, y, w: 1.9, h: 0.62, fontFace: "Courier New", fontSize: 15, bold: true, color: C.white, align: "center", valign: "middle" });
      tb(s, fields, { x: 2.8, y, w: 2.2, h: 0.62, fontSize: 12, color: C.gray, valign: "middle" });
      if (i < layers.length - 1) tb(s, "/", { x: 0.7, y: y + 0.55, w: 1.9, h: 0.25, fontSize: 16, bold: true, color: C.coral, align: "center" });
      y += 0.82;
    }
    d.codePanel(s, { caption: "Build, inspect, serialise", fontSize: 10.5, lines: [
      "pkt = (IP(src=\"10.0.0.5\",",
      "           dst=\"93.184.216.34\")",
      "       / TCP(dport=443, flags=\"S\"))",
      "",
      "pkt[IP].dst        # '93.184.216.34'",
      "pkt[TCP].dport     # 443",
      "pkt.haslayer(TCP)  # True",
      "",
      "raw = bytes(pkt)   # to wire format",
      "IP(raw)            # dissect back",
    ] }, 5.3, 1.5, 4.2, 3.3);
    tb(s, "Lab-only: sending and sniffing need authorisation and Npcap/root. We craft and read here.",
      { x: 0.7, y: 4.95, w: 8.8, h: 0.3, fontSize: 11, italic: true, color: C.coral });
  }

  await d.demo({
    tag: "D2", name: "Craft & Dissect (no send)", file: "02_scapy_craft.py", codeW: 5.0,
    code: [
      "from scapy.all import IP, TCP, UDP, ICMP, Raw, hexdump",
      "",
      "pkt = IP(src=\"10.0.0.5\", dst=\"93.184.216.34\") \\",
      "      / TCP(dport=443, flags=\"S\")",
      "pkt.summary()",
      "",
      "pkt[IP].dst          # '93.184.216.34'",
      "pkt[TCP].dport       # 443",
      "pkt[TCP].flags       # S (SYN)",
      "",
      "raw = bytes(pkt)     # serialise",
      "reparsed = IP(raw)   # dissect back",
      "reparsed[TCP].dport  # 443",
    ],
    output: [
      "Summary: IP / TCP 10.0.0.5:ftp_data",
      "  > 93.184.216.34:https S",
      "",
      "IP  dst  : 93.184.216.34",
      "TCP dport: 443",
      "TCP flags: S (S = SYN)",
      "",
      "Serialised to 40 bytes. First 16:",
      "0000  45 00 00 28 00 01 ...",
      "  E..(....@.:.....",
      "Re-parsed dport: 443",
    ],
    watch: [
      "`/` stacks the layers",
      "`pkt[Layer].field` reads a field",
      "`bytes(pkt)` <-> `IP(raw)`",
    ],
    notes: "This is pure construction and parsing: no packet leaves the machine. Dissecting raw bytes back into layers is exactly what a sniffer or PCAP reader does internally.",
  });

  await d.demo({
    tag: "D3", name: "Analyse a PCAP", file: "03_pcap_analysis.py", codeW: 5.0,
    code: [
      "from scapy.all import IP, TCP, UDP, wrpcap, rdpcap",
      "from collections import Counter",
      "",
      "wrpcap(\"sample.pcap\", packets)   # write a sample",
      "cap = rdpcap(\"sample.pcap\")       # read it back",
      "",
      "talkers, dst_ports = Counter(), Counter()",
      "for pkt in cap:",
      "    if pkt.haslayer(IP):",
      "        talkers[pkt[IP].src] += 1",
      "        if pkt.haslayer(TCP):",
      "            dst_ports[pkt[TCP].dport] += 1",
      "",
      "talkers.most_common()",
    ],
    output: [
      "Wrote 6 packets to sample.pcap",
      "Loaded 6 packets",
      "",
      "Top source IPs:",
      "  10.0.0.5     3 packets",
      "  10.0.0.7     2 packets",
      "  10.0.0.8     1 packets",
      "",
      "Destination ports:",
      "  443    2",
      "  53     2",
      "  4444   2  <-- suspicious",
    ],
    watch: [
      "`rdpcap` reads a capture file",
      "Count talkers and ports with Counter",
      "Port 4444 stands out",
    ],
    notes: "Offline PCAP analysis is bread-and-butter forensics: load a capture (from Wireshark/tcpdump), summarise who talked to whom and on what ports. We generate the sample so the demo is reproducible; real captures come from an authorised tap.",
  });

  await d.demo({
    tag: "D4", name: "Build & Parse DNS", file: "04_dns.py", codeW: 5.0,
    code: [
      "import dnslib",
      "",
      "query = dnslib.DNSRecord.question(\"example.com\", \"A\")",
      "packed = query.pack()            # -> bytes (no network)",
      "",
      "parsed = dnslib.DNSRecord.parse(packed)",
      "parsed.q.qname                   # example.com.",
      "dnslib.QTYPE[parsed.q.qtype]     # 'A'",
      "",
      "reply = query.reply()",
      "reply.add_answer(*dnslib.RR.fromZone(",
      "    \"example.com 300 A 93.184.216.34\"))",
      "",
      "# optional live lookup:",
      "import dns.resolver",
      "dns.resolver.resolve(\"example.com\", \"A\")",
    ],
    output: [
      "Built a DNS query:",
      "  29 bytes, qname = example.com.",
      "",
      "Parsed it back:",
      "  question: example.com. (A)",
      "  id      : 49999",
      "",
      "Constructed a response:",
      "  example.com. -> 93.184.216.34",
      "    (TTL 300)",
      "Live lookup: example.com ->",
      "  172.66.147.243",
    ],
    watch: [
      "`DNSRecord.question` builds a query",
      "`.pack()` / `.parse()` = bytes <-> object",
      "dnspython does real lookups",
    ],
    notes: "DNS is a top exfiltration and C2 channel. Being able to build and parse DNS lets you detect tunnelling: oddly long query names, high-entropy subdomains, huge TXT answers. The live lookup is optional and skips cleanly offline.",
  });

  await d.demo({
    tag: "D5", name: "Familiarise with Each", part: "Lab", file: "05_familiarise.py", codeW: 5.0,
    code: [
      "import ipaddress",
      "from scapy.all import IP, TCP",
      "import dnslib",
      "",
      "# ipaddress",
      "net.overlaps(ipaddress.ip_network(\"10.0.0.0/24\"))",
      "",
      "# scapy (offline)",
      "pkt = IP(dst=\"8.8.8.8\") / TCP(dport=80, flags=\"S\")",
      "pkt[TCP].dport = 8080           # fields are editable",
      "",
      "# dnslib",
      "q = dnslib.DNSRecord.question(\"test.local\", \"AAAA\")",
      "",
      "# explore anything with dir(x), help(x), type(x)",
    ],
    output: [
      "=== ipaddress ===",
      "is_private: True",
      "hosts: ['10.0.0.1' ... '10.0.0.6']",
      "overlaps: True",
      "=== scapy (offline) ===",
      "build: IP / TCP ...:http S",
      "field set: 8080",
      "=== dnslib ===",
      "question: test.local. AAAA",
      "pack/parse: 28 bytes -> test.local.",
    ],
    watch: [
      "The syllabus 'familiarise' task",
      "`dir`, `help`, `type` to explore",
      "Craft/parse freely; send only on labs",
    ],
    notes: "The syllabus lab is to familiarise with each library's functions. Encourage exploration in the REPL with dir() and help(). Reinforce the authorisation boundary one more time.",
  });

  await d.troubleshoot({
    items: [
      ["Scapy import is slow / warns", "Normal on first import. The IPython/crypto warnings are harmless."],
      ["`PermissionError` sending packets", "Sending needs root/Administrator + Npcap. Not required for this course."],
      ["No packets when sniffing", "Wrong interface, or no Npcap. We analyse PCAP files instead."],
      ["`ValueError` from `ip_address`", "The text isn't a valid IP. Catch it; validate user input."],
      ["IPs sorted wrongly", "Sort with `key=ipaddress.ip_address`, not as strings."],
      ["DNS live lookup hangs", "Set a timeout (`resolver.lifetime`) and catch exceptions."],
    ],
    notes: "On Windows, install Npcap only if a lab genuinely needs live capture; the course is built to avoid it.",
  });

  await d.challenge({
    items: [
      { level: "EASY", head: "Subnet report", text: "Read a CIDR and print its network, broadcast, usable host count and first/last host.", hint: "`ip_network`, `.hosts()`, `.broadcast_address`." },
      { level: "MEDIUM", head: "PCAP talkers", text: "Extend D3 to also report the busiest (src, dst) pair and total bytes per source.", hint: "`Counter` keyed by a tuple; `len(bytes(pkt))`." },
      { level: "STRETCH", head: "DNS anomaly flag", text: "Given a list of query names, flag any with a subdomain longer than 30 chars or high digit ratio (possible tunnelling).", hint: "Split on '.', measure label length and digit fraction." },
    ],
    notes: "Stretch is a real DNS-tunnelling heuristic. All three stay offline and safe.",
  });

  await d.summary({
    built: [
      ["D1", "Subnets & Validation", "`ipaddress`: validate, subnet, membership"],
      ["D2", "Craft & Dissect", "Scapy layers, fields, bytes <-> packet"],
      ["D3", "Analyse a PCAP", "`rdpcap`, count talkers and ports"],
      ["D4", "Build & Parse DNS", "`dnslib` offline; `dnspython` live"],
      ["D5", "Familiarise", "Lab: explore each library"],
    ],
    takeaways: [
      "`ipaddress` does correct, readable subnet maths",
      "Scapy models packets as layered objects you can craft and dissect",
      "PCAP analysis is offline forensics with `rdpcap` + `Counter`",
      "Only send or sniff on networks you are authorised to test",
    ],
    next: "Session 17: Web scraping (Beautiful Soup), telnetlib and the os module",
  });

  await d.save(out);
};

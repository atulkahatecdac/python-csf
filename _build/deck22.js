// Session 22: Packet & database forensics (dpkt, SQLite) + capstone
const { Deck, C } = require("./lib");

module.exports = async function build(out) {
  const d = new Deck(22, "Packet & Database Forensics");

  await d.titleSlide({
    title: "Packet & Database Forensics, and Capstone",
    subtitle: "Parse PCAPs with dpkt, read browser databases with SQLite, and correlate indicators into an incident report.",
    flow: [
      ["FaStream", "dpkt", "Parse captured packets", C.coral],
      ["FaDatabase", "SQLite", "Browser & app history", C.navy],
      ["FaProjectDiagram", "Correlate", "One IOC, many sources", C.teal],
      ["FaFileSignature", "Capstone", "A full incident report", C.coral],
    ],
    notes: "The final session. dpkt for fast packet parsing, sqlite3 for the databases apps leave behind (browser history, chat, mail), then the capstone: correlating one indicator across all the artifacts and generating an incident report. This pulls together the entire module.",
  });

  await d.goalsAgenda({
    sub: "Theory with a live demo after every concept",
    goals: [
      ["FaStream", "Parse packets from a PCAP with dpkt"],
      ["FaDatabase", "Query app/browser SQLite databases"],
      ["FaProjectDiagram", "Correlate an IOC across artifacts"],
      ["FaFileSignature", "Generate a structured incident report"],
    ],
    agenda: [
      "dpkt: packet parsing",
      "D1  PCAP summary",
      "SQLite forensics",
      "D2  Firefox history",
      "D3  Lab: familiarise",
      "D4  IOC correlation",
      "D5  Capstone incident report",
      "Where to go next",
      "Course wrap-up",
    ],
    notes: "dpkt is in requirements.txt; sqlite3 is in the standard library. All demos are offline with generated samples.",
  });

  await d.cards3({
    title: "The Artifacts of an Investigation",
    sub: "Different sources, one timeline",
    cards: [
      { icon: "FaStream", color: C.coral, head: "Network (PCAP)", body: ["Who talked to whom, on what port", "C2 beacons, exfiltration, scans", "dpkt or Scapy to parse"] },
      { icon: "FaDatabase", color: C.navy, head: "Databases", body: ["Browser history, downloads, cookies", "Chat, email, app state", "All usually SQLite"] },
      { icon: "FaFileAlt", color: C.teal, head: "Logs & files", body: ["Auth logs, event logs", "Documents, images, deleted files", "Text, struct, metadata"] },
    ],
    below: [
      "**The skill is correlation:** one indicator (an IP, a hash, a username) tying these sources into a single story with a timeline.",
      "Everything in this module - strings, files, dicts, classes, hashing, these libraries - serves that goal.",
    ],
    notes: "No single artifact tells the whole story. An investigation joins them: the pcap shows the C2 connection, the log shows the initial access, the browser history shows how they got there. Python is the glue.",
  });

  await d.demo({
    tag: "D1", name: "PCAP Summary (dpkt)", file: "01_dpkt_packets.py", codeW: 5.0,
    code: [
      "import dpkt, socket",
      "from collections import Counter",
      "",
      "with open(\"capture.pcap\", \"rb\") as f:",
      "    for ts, buf in dpkt.pcap.Reader(f):",
      "        eth = dpkt.ethernet.Ethernet(buf)",
      "        if not isinstance(eth.data, dpkt.ip.IP):",
      "            continue",
      "        ip = eth.data",
      "        src = socket.inet_ntoa(ip.src)",
      "        dst = socket.inet_ntoa(ip.dst)",
      "        if isinstance(ip.data, dpkt.tcp.TCP):",
      "            port_count[ip.data.dport] += 1",
      "        conversations[(src, dst)] += 1",
    ],
    output: [
      "PCAP SUMMARY",
      "Protocols    : {'UDP': 1, 'TCP': 4}",
      "",
      "Top conversations:",
      "  10.0.0.5 -> 93.184.216.34  2 pkts",
      "  10.0.0.7 -> 45.155.205.233 2 pkts",
      "  10.0.0.5 -> 8.8.8.8        1 pkts",
      "",
      "Destination ports:",
      "  443  2",
      "  4444 2  <-- suspicious",
    ],
    watch: [
      "`dpkt.pcap.Reader` iterates packets",
      "`inet_ntoa` turns bytes -> dotted IP",
      "Count ports & conversations",
    ],
    notes: "dpkt is lower-level and faster than Scapy for bulk PCAP parsing; you decode each layer explicitly. The analysis is the same Counter pattern from Session 8: top talkers, suspicious ports (4444 again).",
  });

  await d.demo({
    tag: "D2", name: "Firefox History (SQLite)", file: "02_firefox_sqlite.py", codeW: 5.0,
    code: [
      "import sqlite3",
      "from datetime import datetime, timezone",
      "",
      "# Firefox: last_visit_date = microseconds since epoch",
      "def to_dt(micros):",
      "    return datetime.fromtimestamp(micros/1_000_000, timezone.utc)",
      "",
      "con = sqlite3.connect(\"places.sqlite\")",
      "con.execute(\"SELECT url, title, visit_count\"",
      "            \" FROM moz_places ORDER BY visit_count DESC\")",
      "",
      "# flag IP-literal hosts and overnight visits",
    ],
    output: [
      "MOST VISITED SITES",
      "  90x  Webmail     mail.example.com",
      "  42x  Python docs docs.python.org",
      "",
      "MOST RECENT VISITS",
      "  2026-11-07 09:00  docs.python.org",
      "  2026-11-07 02:30  45.155.205.233/panel",
      "",
      "FLAGGED",
      "  http://45.155.205.233/panel",
      "    (IP-literal host, overnight)",
    ],
    watch: [
      "Browser history is just SQLite",
      "Each app has its own timestamp epoch",
      "SQL does the filtering for you",
    ],
    notes: "places.sqlite holds Firefox history; Chrome's History is similar (different epoch). Knowing the timestamp format matters: Firefox uses microseconds since 1970, Chrome uses microseconds since 1601. sqlite3 reads them all.",
  });

  await d.demo({
    tag: "D3", name: "Familiarise", part: "Lab", file: "03_lab_familiarise.py", codeW: 5.0,
    code: [
      "import dpkt, socket, sqlite3",
      "",
      "with open(\"one.pcap\", \"rb\") as f:",
      "    for ts, buf in dpkt.pcap.Reader(f):",
      "        ip = dpkt.ethernet.Ethernet(buf).data",
      "        socket.inet_ntoa(ip.src), ip.data.dport",
      "",
      "con = sqlite3.connect(\":memory:\")",
      "con.execute(\"CREATE TABLE logs(ip TEXT, hits INT)\")",
      "con.execute(\"SELECT ip FROM logs WHERE hits >= 3\"",
      "            \" ORDER BY hits DESC\").fetchall()",
    ],
    output: [
      "=== dpkt ===",
      "  ts        : 1794042840.23",
      "  src -> dst : 10.0.0.5 -> 1.1.1.1",
      "  protocol  : TCP",
      "  dport     : 80",
      "=== sqlite3 ===",
      "  all rows  : [('10.0.0.5', 3), ...]",
      "  top talker: ('45.1.1.1', 9)",
      "  filtered  : [('45.1.1.1',), ...]",
    ],
    watch: [
      "dpkt layer access: `.data`",
      "`:memory:` db for quick tests",
      "`fetchall` / `fetchone` get results",
    ],
    notes: "The familiarise task. An in-memory SQLite database (:memory:) is perfect for testing queries. dpkt's .data walks down the layers: Ethernet.data is IP, IP.data is TCP/UDP.",
  });

  await d.demo({
    tag: "D4", name: "IOC Correlation", file: "04_ioc_correlation.py", codeW: 5.1,
    code: [
      "IOC = \"45.155.205.233\"",
      "hits = []",
      "",
      "# 1) packet capture",
      "if socket.inet_ntoa(ip.dst) == IOC:",
      "    hits.append((\"pcap\", f\"...{IOC}:{ip.data.dport}\"))",
      "",
      "# 2) browser history (SQLite LIKE)",
      "SELECT url FROM moz_places WHERE url LIKE '%IOC%'",
      "",
      "# 3) auth log (text search)",
      "if IOC in line: hits.append((\"auth.log\", line))",
    ],
    output: [
      "IOC INVESTIGATION: 45.155.205.233",
      "Found in 3 data sources, 4 hits:",
      "",
      "  [pcap    ] 10.0.0.7 ->",
      "             45.155.205.233:4444",
      "  [browser ] http://45.155.205.233/panel",
      "  [auth.log] Failed password for root...",
      "  [auth.log] Accepted password for root...",
      "",
      "Same IP: brute force -> login -> C2.",
    ],
    watch: [
      "One IOC, three data sources",
      "Each source, its own search method",
      "Correlation builds the story",
    ],
    notes: "This is the investigative core: take one indicator and sweep every artifact for it. The pcap, history and log each need a different search (byte compare, SQL LIKE, substring), but together they reconstruct the attack.",
  });

  await d.demo({
    tag: "D5", name: "Capstone Incident Report", part: "Capstone", file: "05_capstone_report.py", codeW: 5.1,
    code: [
      "class Incident:",
      "    def __init__(self, case_id, analyst): ...",
      "    def add_finding(self, severity, title, detail): ...",
      "    def add_evidence(self, name, data):",
      "        self.evidence.append({\"file\": name,",
      "            \"sha256\": hashlib.sha256(data).hexdigest()})",
      "    def risk_score(self):",
      "        return sum(weight[f[\"severity\"]] for f in self.findings)",
      "",
      "inc = Incident(\"CASE-2026-042\", \"a.patil\")",
      "inc.add_finding(\"critical\", \"SSH brute force then root login\", ...)",
      "json.dump(inc.to_dict(), open(\"incident.json\", \"w\"), indent=2)",
    ],
    output: [
      "INCIDENT REPORT  CASE-2026-042",
      "Analyst    : a.patil",
      "Risk score : 11",
      "",
      "Evidence (chain of custody):",
      "  auth.log     227 B  35f5b61a...",
      "  history.txt   52 B  d32c516b...",
      "Findings (most severe first):",
      "  [CRITICAL] SSH brute force then",
      "             root login",
      "  [MEDIUM  ] Browsing to IP-literal host",
    ],
    watch: [
      "A class models the incident",
      "Evidence is hashed for custody",
      "Output: JSON + readable report",
    ],
    notes: "The capstone uses everything: a class for the incident, functions, dicts, file I/O, hashing, json, sorting. This is a genuine (if small) IR tool. Encourage students to extend it with the real parsers from this module.",
  });

  // Course wrap-up custom slide
  {
    const s = d.slide("Course wrap-up. Over 22 sessions students went from zero Python to writing real security and forensic tools. The path from here: practice on CTFs and lab ranges (always authorised), read the source of tools like Scapy and Volatility, and keep building. Reinforce the ethics: these skills are powerful and must only be used with explicit authorisation.");
    d.heading(s, "Where to Go Next", "You can now read and write real security Python");
    const { tb, iconCircle } = require("./lib");
    const rows = [
      ["FaFlag", "Practice safely", "CTFs (picoCTF, HTB), lab VMs, and ranges you own or are authorised to use."],
      ["FaBookReader", "Read real code", "Scapy, Impacket, Volatility, sqlmap are all Python - study them."],
      ["FaTools", "Build & automate", "Turn your repetitive tasks into scripts; grow a personal toolkit."],
      ["FaBalanceScale", "Stay ethical & legal", "Only test systems you own or have written permission for. Handle data responsibly."],
    ];
    for (let i = 0; i < rows.length; i++) {
      const [icon, head, text] = rows[i];
      const y = 1.5 + i * 0.85;
      await iconCircle(s, icon, 0.6, y, 0.52, i === 3 ? C.coral : C.navy);
      tb(s, [
        { text: head + "   ", options: { bold: true, fontSize: 15 } },
        { text: text, options: { fontSize: 13, color: C.gray } },
      ], { x: 1.35, y, w: 8.1, h: 0.6, valign: "middle" });
    }
    s.addShape("roundRect", { x: 0.6, y: 5.0, w: 8.9, h: 0.0, fill: { color: C.light }, line: { color: C.light } });
    tb(s, "Thank you - now go build something, responsibly.",
      { x: 0.6, y: 4.95, w: 8.9, h: 0.3, fontSize: 12, italic: true, color: C.teal, align: "center" });
  }

  await d.troubleshoot({
    items: [
      ["`dpkt` KeyError / AttributeError", "The layer isn't what you expected. Check `isinstance(ip.data, dpkt.tcp.TCP)`."],
      ["IP bytes look wrong", "Use `socket.inet_ntoa(ip.src)` to format 4 bytes as dotted-quad."],
      ["SQLite `database is locked`", "Another connection is open (e.g. the browser). Copy the file first."],
      ["Timestamps are decades off", "Each app uses a different epoch/unit. Firefox: microseconds since 1970."],
      ["`no such table`", "Wrong database or schema. Inspect with `SELECT name FROM sqlite_master`."],
      ["Reading a live browser DB fails", "The browser locks it. Work on a copy, as forensics always does."],
    ],
    notes: "Copying the database before reading is both a practical fix (locks) and correct forensic practice (never work on the original).",
  });

  await d.challenge({
    items: [
      { level: "EASY", head: "DNS extractor", text: "From a PCAP, list every DNS query name using dpkt's DNS parser.", hint: "`dpkt.dns.DNS(udp.data)`, read `.qd[0].name`." },
      { level: "MEDIUM", head: "Downloads report", text: "Query a browser downloads SQLite table and list files downloaded, newest first.", hint: "`SELECT ... ORDER BY date DESC`; decode the timestamp." },
      { level: "STRETCH", head: "Mini SIEM", text: "Combine D4 + D5: scan several artifacts for a list of IOCs and emit one JSON incident report.", hint: "Loop IOCs over sources; reuse the Incident class." },
    ],
    notes: "The Stretch is a genuine capstone project: a small SIEM/triage tool. It's the natural mini-project the syllabus asks for.",
  });

  await d.summary({
    built: [
      ["D1", "PCAP Summary", "dpkt: parse packets, count traffic"],
      ["D2", "Firefox History", "sqlite3: query browser artifacts"],
      ["D3", "Familiarise", "Lab: dpkt + sqlite3"],
      ["D4", "IOC Correlation", "One indicator across sources"],
      ["D5", "Capstone Report", "A full incident-report tool"],
    ],
    takeaways: [
      "dpkt parses PCAPs fast; decode layers via `.data`",
      "App artifacts (history, downloads) are SQLite - learn the epochs",
      "Investigations correlate one IOC across many sources",
      "You can now build real security tools - use them only with authorisation",
    ],
    next: "Course complete - keep building, responsibly",
    nextLabel: "THAT'S A WRAP",
  });

  await d.save(out);
};

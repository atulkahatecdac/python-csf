// Session 17: Beautiful Soup, the os module, telnetlib (banner grabbing)
const { Deck, C } = require("./lib");

module.exports = async function build(out) {
  const d = new Deck(17, "Web Parsing & OS");

  await d.titleSlide({
    title: "Beautiful Soup, the os Module & Banner Grabbing",
    subtitle: "Parse web pages for recon, automate files and folders, and identify services from their banners.",
    flow: [
      ["FaCode", "BeautifulSoup", "Parse HTML for recon", C.coral],
      ["FaFolderOpen", "os", "Files, folders, env", C.navy],
      ["FaServer", "telnetlib", "Grab service banners", C.teal],
      ["FaClipboardCheck", "Report", "Turn findings into output", C.coral],
    ],
    notes: "Two everyday tools plus a classic recon technique. Beautiful Soup reads HTML (links, forms, leaky comments). The os module automates the filesystem. telnetlib grabs service banners. As always: parse saved data freely; touch live hosts only with authorisation.",
  });

  await d.goalsAgenda({
    sub: "Theory with a live demo after every concept",
    goals: [
      ["FaCode", "Parse HTML and extract links, forms, comments"],
      ["FaFolder", "Automate the filesystem with `os` and `os.path`"],
      ["FaServer", "Grab and fingerprint service banners"],
      ["FaClipboardCheck", "Combine them into a recon report"],
    ],
    agenda: [
      "Beautiful Soup",
      "D1  Links, forms, comments",
      "The os module",
      "D2  Paths, walk, metadata",
      "telnetlib & banners",
      "D3  Banner fingerprinting",
      "D4  Lab: familiarise",
      "D5  Web recon report",
      "Authorisation & challenge",
    ],
    notes: "beautifulsoup4 and requests are installed via requirements.txt. Demos parse saved HTML so they run offline.",
  });

  await d.iconRows({
    title: "Beautiful Soup: Parsing HTML",
    sub: "Turn messy HTML into a searchable tree",
    rows: [
      { icon: "FaSitemap", color: C.coral, head: "`BeautifulSoup(html, \"html.parser\")`", text: "Parses HTML into a navigable tree of tags." },
      { icon: "FaSearch", color: C.navy, head: "`find` / `find_all`", text: "`soup.find_all(\"a\")`, filter by attrs: `find_all(\"input\", {\"type\": \"hidden\"})`." },
      { icon: "FaTag", color: C.teal, head: "Read tags", text: "`tag.get_text()`, `tag[\"href\"]`, `tag.get(\"name\")`, `tag.name`." },
      { icon: "FaCommentSlash", color: C.purple, head: "Comments leak", text: "HTML comments often hold TODOs, creds, debug flags: a classic finding." },
    ],
    panel: { caption: "Recon on a page", fontSize: 10.5, lines: [
      "from bs4 import BeautifulSoup, Comment",
      "soup = BeautifulSoup(html, \"html.parser\")",
      "",
      "soup.title.string",
      "[a[\"href\"] for a in soup.find_all(\"a\")]",
      "soup.find_all(\"input\", {\"type\":\"hidden\"})",
      "",
      "# HTML comments:",
      "soup.find_all(string=lambda t:",
      "    isinstance(t, Comment))",
    ] },
    notes: "Web recon starts with reading the page: where do forms submit, what hidden tokens exist, which third-party scripts load, and what did a developer leave in a comment. Beautiful Soup makes all of that a few lines.",
  });

  await d.demo({
    tag: "D1", name: "Links, Forms, Comments", file: "01_beautifulsoup.py", codeW: 5.0,
    code: [
      "soup = BeautifulSoup(HTML, \"html.parser\")",
      "soup.title.string            # 'Admin Portal'",
      "",
      "for a in soup.find_all(\"a\"):",
      "    href = a.get(\"href\", \"\")",
      "    where = \"external\" if href.startswith(\"http\") else \"internal\"",
      "",
      "for form in soup.find_all(\"form\"):",
      "    form[\"action\"], form.get(\"method\")",
      "    form.find_all(\"input\")",
      "",
      "soup.find_all(\"input\", {\"type\": \"hidden\"})",
      "soup.find_all(string=lambda t: isinstance(t, Comment))",
    ],
    output: [
      "Title: Admin Portal",
      "Links:",
      "  /admin        [internal] Admin",
      "  http://old-intranet.local/legacy",
      "    [external] Legacy",
      "Forms:",
      "  action=/login method=post",
      "    input password / hidden csrf",
      "Hidden fields:  csrf = abc123",
      "Comments: TODO: remove debug",
      "  token before go-live: DEBUG=1",
    ],
    watch: [
      "External vs internal links",
      "Hidden inputs hold tokens (CSRF)",
      "A leaky comment: DEBUG=1",
    ],
    notes: "The comment is the finding: developers leave debug flags and sometimes credentials in HTML comments, invisible on the page but plain in the source. Hidden csrf tokens matter for understanding a form's protections.",
  });

  await d.demo({
    tag: "D2", name: "Paths, Walk, Metadata", file: "02_os_module.py", codeW: 5.0,
    code: [
      "import os",
      "os.getcwd(); os.name          # 'nt' or 'posix'",
      "os.environ.get(\"PATH\")",
      "",
      "os.path.join(\"logs\", \"a.log\")  # OS-correct",
      "os.path.basename(p); os.path.splitext(p)",
      "os.path.getsize(p); os.path.isfile(p)",
      "",
      "for root, dirs, files in os.walk(here):",
      "    for name in files:",
      "        if name.endswith(\".py\"):",
      "            os.path.getsize(os.path.join(root, name))",
      "",
      "os.path.getmtime(full)        # last-modified time",
    ],
    output: [
      "cwd      : ...\\Session-17-Demos",
      "platform : nt (nt=Windows, ...)",
      "user     : akaha",
      "PATH dirs: 69",
      "",
      "basename : 02_os_module.py",
      "size     : 1779 bytes",
      "",
      "Python files in this folder:",
      "  01_beautifulsoup.py  2278 bytes",
      "Files modified in the last hour:",
      "  ... 0 min ago",
    ],
    watch: [
      "`os.path.join` is OS-correct",
      "`os.walk` recurses a tree",
      "`getmtime` for recency triage",
    ],
    notes: "os.walk + getmtime/getsize is the core of triage: find large files, recently-changed files, files with suspicious extensions. os.path keeps paths portable between Windows and Linux. (pathlib from Session 12 does the same, object-style.)",
  });

  await d.twoPanels({
    title: "telnetlib: Banner Grabbing",
    sub: "Identify a service from the greeting it sends",
    left: { caption: "The idea", fontSize: 10.5, lines: [
      "# Connect to a port, read the",
      "# first line the service sends.",
      "",
      "220 mail... ESMTP Postfix   -> SMTP",
      "SSH-2.0-OpenSSH_8.9          -> SSH",
      "HTTP/1.1 200 OK              -> HTTP",
      "",
      "# The banner often reveals the",
      "# product AND version -> known CVEs",
    ] },
    right: { caption: "Live form (authorised only)", fontSize: 10.5, lines: [
      "import telnetlib   # <= 3.12",
      "with telnetlib.Telnet(host, 25,",
      "                 timeout=3) as tn:",
      "    banner = tn.read_until(b\"\\n\", 3)",
      "",
      "# Python 3.13 removed telnetlib.",
      "# New code: use sockets, e.g.",
      "# socket.create_connection(...)",
    ] },
    below: "A banner names the service and often its version, which maps to known vulnerabilities. **Only connect to hosts you are authorised to test.** The demo parses a saved banner offline.",
    notes: "Banner grabbing is reconnaissance: the service tells you what it is. telnetlib is deprecated (gone in 3.13); the modern equivalent is a raw socket. The teaching point is the technique, not the library.",
  });

  await d.demo({
    tag: "D3", name: "Banner Fingerprinting", file: "03_telnetlib.py", codeW: 5.1,
    code: [
      "saved_banner = b\"220 mail.example.com ESMTP Postfix (Ubuntu)\\r\\n\"",
      "",
      "def identify(banner_bytes):",
      "    text = banner_bytes.decode(errors=\"replace\").strip()",
      "    if text.startswith(\"220\") and \"SMTP\" in text.upper():",
      "        return \"SMTP mail server\", text",
      "    elif text.startswith(\"SSH-\"):",
      "        return \"SSH server\", text",
      "    elif text.startswith(\"HTTP/\"):",
      "        return \"HTTP server\", text",
      "    return \"unknown\", text",
      "",
      "# Live (authorised): telnetlib.Telnet(host, port)",
      "#                    .read_until(b\"\\n\")",
    ],
    output: [
      "Banner : 220 mail.example.com",
      "  ESMTP Postfix (Ubuntu)",
      "Service: SMTP mail server",
      "Version hint: (Ubuntu)",
      "",
      "Live banner-grab code",
      "  (authorised hosts only): ...",
      "",
      "telnetlib is available in this",
      "  Python (<= 3.12, deprecated).",
    ],
    watch: [
      "Banner -> service + version",
      "Version -> look up known CVEs",
      "Parse saved banners offline",
    ],
    notes: "The fingerprinting logic is just string checks on the greeting. Real tools (Nmap -sV) have huge banner databases. We parse a saved banner so nothing connects out; the live code is shown and guarded.",
  });

  await d.demo({
    tag: "D4", name: "Familiarise", part: "Lab", file: "04_lab_familiarise.py", codeW: 5.0,
    code: [
      "from bs4 import BeautifulSoup",
      "import os",
      "",
      "html = \"<ul><li class='ok'>a</li><li>b</li></ul>\"",
      "soup = BeautifulSoup(html, \"html.parser\")",
      "soup.find(\"li\").get_text()",
      "soup.find_all(\"li\")",
      "soup.find(\"li\", class_=\"ok\")",
      "",
      "os.sep; os.pathsep",
      "os.path.join(\"logs\", \"2026\", \"auth.log\")",
      "os.path.split(\"/var/log/auth.log\")",
      "os.path.splitext(\"report.final.pdf\")",
      "os.listdir(\".\")",
    ],
    output: [
      "=== Beautiful Soup ===",
      "find      : a",
      "find_all  : ['a', 'b']",
      "by class  : a",
      "tag name  : li",
      "=== os / os.path ===",
      "sep       : '\\\\' | pathsep: ';'",
      "join      : logs\\2026\\auth.log",
      "splitext  : ('report.final', '.pdf')",
      "Files by extension: {'.py': 5}",
    ],
    watch: [
      "`class_` (trailing _) avoids the keyword",
      "`splitext` splits name and extension",
      "`os.sep` differs by OS",
    ],
    notes: "The syllabus familiarise task. Note class_ with a trailing underscore, because class is a Python keyword. os.sep is \\ on Windows, / on Linux: another reason to use os.path.join.",
  });

  await d.demo({
    tag: "D5", name: "Web Recon Report", part: "Mini project", file: "05_page_recon.py", codeW: 5.1,
    code: [
      "RISKY_WORDS = (\"todo\", \"password\", \"creds\", \"debug\", \"key\")",
      "",
      "def recon(path):",
      "    soup = BeautifulSoup(open(path).read(), \"html.parser\")",
      "    ext_links = [a[\"href\"] for a in soup.find_all(\"a\", href=True)",
      "                 if a[\"href\"].startswith(\"http\")]",
      "    forms = [f.get(\"action\") for f in soup.find_all(\"form\")]",
      "    scripts = [s[\"src\"] for s in soup.find_all(\"script\", src=True)]",
      "    risky = [c for c in comments",
      "             if any(w in c.lower() for w in RISKY_WORDS)]",
      "    return title, ext_links, forms, scripts, risky",
    ],
    output: [
      "WEB RECON REPORT",
      "",
      "home.html  (Home)",
      "  external links  : tracker.ad/x",
      "  external scripts: cdn.x/a.js",
      "",
      "login.html  (Login)",
      "  forms           : ['/auth']",
      "  RISKY COMMENTS  : ['test creds",
      "    admin/admin removed?']",
    ],
    watch: [
      "Walk saved pages, parse each",
      "Flag external links & scripts",
      "Scan comments for risky words",
    ],
    notes: "This is offline web-assessment triage: given saved pages, surface the attack surface (forms, third-party scripts, off-site links) and leaked comments. Live fetching would add requests.get(url).text, on authorised targets.",
  });

  await d.troubleshoot({
    items: [
      ["`bs4` not found", "Install it: `pip install beautifulsoup4` (the import is `bs4`)."],
      ["`find` returned None", "The tag wasn't there; calling `.get_text()` on None errors. Check first."],
      ["`class` is a syntax error", "Use `class_=\"x\"` or `{\"class\": \"x\"}` in find/find_all."],
      ["Paths break across OS", "Use `os.path.join`, never hard-coded `\\` or `/`."],
      ["`telnetlib` ImportError", "Removed in Python 3.13. Use `socket`, or stay on 3.10-3.12."],
      ["Banner grab times out", "Set a timeout and catch the error; the host may filter the port."],
    ],
    notes: "find() returning None then .get_text() crashing is the most common bs4 beginner error; guard it or use a default.",
  });

  await d.challenge({
    items: [
      { level: "EASY", head: "Image inventory", text: "Parse a saved page and list every image `src` and its `alt` text.", hint: "`soup.find_all('img')`, read `src` and `alt`." },
      { level: "MEDIUM", head: "Old-file finder", text: "Walk a folder tree and list files not modified in over N days, with sizes.", hint: "`os.walk`, `os.path.getmtime`, compare to `time.time()`." },
      { level: "STRETCH", head: "Socket banner grab", text: "Rewrite the banner grab using `socket` (not telnetlib), with a timeout, against a lab host.", hint: "`socket.create_connection((h,p), 3)`, `recv(1024)`." },
    ],
    notes: "Stretch modernises the deprecated telnetlib approach with sockets, the forward-compatible way.",
  });

  await d.summary({
    built: [
      ["D1", "Links, Forms, Comments", "Beautiful Soup for web recon"],
      ["D2", "Paths, Walk, Metadata", "`os` / `os.path` filesystem automation"],
      ["D3", "Banner Fingerprinting", "Identify services from banners"],
      ["D4", "Familiarise", "Lab: bs4 and os tour"],
      ["D5", "Web Recon Report", "Parse saved pages, flag findings"],
    ],
    takeaways: [
      "Beautiful Soup turns HTML into a searchable tree",
      "HTML comments and hidden inputs are classic findings",
      "`os.walk` + metadata = filesystem triage",
      "Banners reveal service and version; grab only with authorisation",
    ],
    next: "Session 18: Windows internals: event logs, registry and WMI",
  });

  await d.save(out);
};

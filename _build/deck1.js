// Session 1: Introduction to Python, Installation, Fundamentals, Data Types, Variables, Literals
const { Deck, C, MONO, tb, runs, iconCircle } = require("./lib");

module.exports = async function build(out) {
  const d = new Deck(1, "Introduction to Python");

  await d.titleSlide({
    title: "Introduction to Python for Cyber Security",
    subtitle: "Install Python, run your first scripts, and learn how variables, data types and literals work.",
    flow: [
      ["FaDownload", "Install", "Python + a venv (Ubuntu or Windows)", C.coral],
      ["FaTerminal", "Run", "REPL and script mode", C.navy],
      ["FaTag", "Name", "Variables bound to objects", C.teal],
      ["FaCubes", "Type", "int, float, str, bytes, bool", C.coral],
    ],
    notes: "Welcome to Module 6. This module takes you from zero Python to writing forensic and network scripts. Today is the foundation: installing Python properly, running code two ways, and understanding what a variable really is. Every concept comes with a demo script in the Session-1-Demos folder; we run them live.",
  });

  await d.goalsAgenda({
    sub: "Theory with a live demo after every concept",
    goals: [
      ["FaShieldAlt", "Explain why Python is the language of security tooling"],
      ["FaDownload", "Set up Python and a **venv** on Ubuntu or Windows"],
      ["FaTag", "Use variables; inspect objects with `type()` and `id()`"],
      ["FaHashtag", "Recognise every basic data type and literal"],
    ],
    agenda: [
      "Why Python for cyber security",
      "Setup, venv & IDEs",
      "D1  Host recon banner",
      "Syntax, keywords, identifiers",
      "D2  Variables & objects",
      "D3  Numbers and bases",
      "D4  Literals",
      "D5  Asset inventory card",
      "Troubleshooting & challenge",
    ],
    notes: "Coral tags are live demos. Students should have the demo folder open in VS Code and run each script along with you.",
  });

  await d.cards3({
    title: "Why Python for Cyber Security",
    sub: "The most-used scripting language for defenders and attackers alike",
    cards: [
      { icon: "FaRobot", color: C.coral, head: "Automate", body: ["Parse thousands of log lines in seconds", "Look up IPs and hashes against threat feeds", "Generate incident reports automatically"] },
      { icon: "FaSearch", color: C.teal, head: "Analyse", body: ["Forensics: registry, PDFs, images, browser history", "Read packet captures (PCAP)", "Extract strings and indicators from malware"] },
      { icon: "FaTools", color: C.navy, head: "Build Tools", body: ["Port scanners and banner grabbers", "Fuzzers and proof-of-concept exploits", "Glue between security products via APIs"] },
    ],
    below: [
      "**Written in Python:** Scapy · Volatility · Impacket · sqlmap · theHarvester · many Burp and Autopsy plugins",
      "**Attackers use it too:** reading Python lets you understand malicious scripts found during an investigation.",
      "**This module:** language fundamentals in Sessions 1–15, security libraries in Sessions 16–22.",
    ],
    notes: "Ask: who has used Nmap, Wireshark or Burp? Many of their extensions are Python. The goal is not to become a software engineer but to automate what you would otherwise do by hand.",
  });

  await d.grid4({
    title: "Python at a Glance",
    sub: "Created by Guido van Rossum (1991) · Python 3 since 2008 · Python 2 retired in 2020",
    cells: [
      { icon: "FaBookOpen", color: C.navy, head: "Simple, readable syntax", text: "Reads close to English. **Indentation is part of the syntax**, so code looks the same everywhere." },
      { icon: "FaBolt", color: C.coral, head: "Interpreted & dynamically typed", text: "No separate compile step. A variable's type is decided at run time: `x = 5` then `x = \"five\"` is legal." },
      { icon: "FaBatteryFull", color: C.teal, head: "Batteries included", text: "Standard library ships `socket`, `hashlib`, `ssl`, `re`, `json`, `os`. 500,000+ more packages on **PyPI**." },
      { icon: "FaGlobe", color: C.navy, head: "Cross-platform & free", text: "Same script runs on Linux (Ubuntu, Kali), Windows and macOS. Open source (PSF licence)." },
    ],
    notes: "Python 2 code still appears in old exploits on the internet: print without brackets is the giveaway. We use Python 3.10 to 3.12: Ubuntu 22.04 ships 3.10, Ubuntu 24.04 ships 3.12, and on Windows install 3.12.",
  });

  await d.flowBlocks({
    title: "How Python Runs Your Code",
    sub: "CPython compiles to bytecode, then the Python Virtual Machine executes it",
    blocks: [
      { icon: "FaFileCode", name: "Source", what: "You write a .py file", k1: "EXAMPLE", v1: "hello.py", k2: "CONTAINS", v2: "`print('hi')`" },
      { icon: "FaCogs", name: "Compiler", what: "Checks and translates", k1: "DONE BY", v1: "CPython", k2: "ERRORS HERE", v2: "SyntaxError, IndentationError" },
      { icon: "FaFileArchive", name: "Bytecode", what: "Low-level instructions", k1: "STORED IN", v1: "__pycache__/*.pyc", k2: "SECURITY", v2: ".pyc decompiles easily: never hide secrets in code" },
      { icon: "FaMicrochip", name: "PVM", what: "Executes bytecode", k1: "RUNS", v1: "One instruction at a time", k2: "ERRORS HERE", v2: "NameError, TypeError" },
      { icon: "FaDesktop", name: "Output", what: "What you see", k1: "WHERE", v1: "Console, file, network", k2: "EXAMPLE", v2: "hi" },
    ],
    notes: "Two kinds of error: syntax errors stop the program before anything runs; runtime errors happen when a line executes. Malware authors sometimes ship .pyc or PyInstaller executables; tools like pycdc and uncompyle6 turn them back into readable source.",
  });

  await d.osSetup({
    title: "Setting Up Python",
    sub: "Use Ubuntu or Windows; only these setup commands differ",
    left: { os: "Ubuntu (bash)", icon: "FaLinux", color: C.navy, lines: [
      "# Python 3 is preinstalled",
      "python3 --version",
      "",
      "# Add venv + pip support (once)",
      "sudo apt install python3-venv python3-pip",
      "",
      "# Create and activate a venv",
      "cd ~/csf-python",
      "python3 -m venv .venv",
      "source .venv/bin/activate",
      "",
      "pip install -r requirements.txt",
    ] },
    right: { os: "Windows (PowerShell)", icon: "FaWindows", color: C.teal, lines: [
      "# Install 3.12 from python.org and",
      "# tick 'Add python.exe to PATH'",
      "python --version",
      "",
      "",
      "",
      "# Create and activate a venv",
      "cd C:\\csf-python",
      "py -3.12 -m venv .venv",
      ".\\.venv\\Scripts\\Activate.ps1",
      "",
      "pip install -r requirements.txt",
    ] },
    below: "Once the prompt shows **(.venv)**, everything is identical: `python`, `pip` and every course script. Use Python **3.10 to 3.12** (3.13 removed `telnetlib`, used in Session 17).",
    notes: "Or run the one-step scripts in the course folder: bash setup-ubuntu.sh, or powershell -ExecutionPolicy Bypass -File setup-windows.ps1. Ubuntu: its own tools depend on the system Python, so never run sudo pip install; on 24.04 pip outside a venv refuses with 'externally-managed-environment' (PEP 668). Windows: if Activate.ps1 is blocked, run Set-ExecutionPolicy -Scope CurrentUser RemoteSigned once. Kali works like Ubuntu.",
  });

  await d.tableSlide({
    title: "Ubuntu vs Windows: What Differs",
    sub: "Keep this slide handy; the Python code itself is the same on both",
    head: ["Topic", "Ubuntu", "Windows"],
    colW: [2.2, 3.4, 3.4],
    fontSize: 10.5,
    rows: [
      ["Python command", "`python3` (`python` inside a venv)", "`python` or `py`"],
      ["Activate the venv", "`source .venv/bin/activate`", "`.\\.venv\\Scripts\\Activate.ps1`"],
      ["Paths", "`/home/student/logs/auth.log`", "`r\"C:\\Users\\student\\logs\"`"],
      ["Run a script directly", "Shebang + `chmod +x`, then `./x.py`", "`py x.py` (the launcher reads the shebang)"],
      ["Admin rights", "`sudo`", "Terminal opened as Administrator"],
      ["Packet capture (S16)", "Run with `sudo`", "Install Npcap; run as Administrator"],
      ["Windows forensics (S17–22)", "Not available; use a Windows VM", "Native: `winreg`, `win32evtlog`, `wmi`"],
    ],
    belowY: 4.4,
    below: ["**Tip:** build paths with `os.path.join()` or `pathlib` (Session 11) and the same script runs on both."],
    notes: "Lab rule: write portable code wherever possible. The only sessions that genuinely need Windows are the Windows-forensics ones (17 to 22); students on Ubuntu use a lab Windows VM for those.",
  });

  await d.iconRows({
    title: "Why a Virtual Environment?",
    sub: "A private copy of Python and its packages for one project",
    rows: [
      { icon: "FaBoxOpen", color: C.navy, head: "Isolation", text: "Each project has its own packages and versions; no clashes between tools." },
      { icon: "FaRedo", color: C.teal, head: "Reproducible", text: "`pip install -r requirements.txt` rebuilds the same setup on any machine." },
      { icon: "FaUserShield", color: C.coral, head: "No sudo or admin rights", text: "Packages go into the project folder. Ubuntu 24.04 even blocks system-wide `pip install` to protect its own tools." },
      { icon: "FaBug", color: C.purple, head: "Supply-chain safety", text: "Test new security tools in isolation. Check names on PyPI: typosquatted packages carry malware." },
    ],
    panel: { caption: "Inside .venv", fontSize: 10, lines: [
      ".venv/",
      "  bin/  (Windows: Scripts\\)",
      "        python, pip, activate",
      "  lib/  (Windows: Lib\\)",
      "        site-packages/",
      "  pyvenv.cfg  base Python version",
      "",
      "# Which Python am I running?",
      "python -c \"import sys; print(sys.executable)\"",
    ] },
    notes: "Real incidents: packages named like popular ones (e.g. 'requessts') that steal credentials on install. Always copy package names from official docs.",
  });

  await d.grid4({
    title: "Choosing an IDE",
    sub: "Any editor works; this course uses VS Code",
    cells: [
      { icon: "FaPython", color: C.navy, head: "IDLE", text: "Bundled on Windows; `sudo apt install idle3` on Ubuntu. Shell plus a basic editor; fine for day one." },
      { icon: "FaCode", color: C.coral, head: "VS Code + Python extension", text: "Free on both. Debugger, venv picker, terminal. **Ctrl+Shift+P → Python: Select Interpreter** → `.venv`." },
      { icon: "FaLaptopCode", color: C.teal, head: "PyCharm Community", text: "Free on both. Full IDE with refactoring and a strong debugger; heavier." },
      { icon: "FaBook", color: C.purple, head: "Jupyter Notebook", text: "`pip install notebook` inside the venv. Code in cells with output underneath; great for exploring logs." },
    ],
    notes: "Show VS Code: open the folder (code . from the terminal), select the .venv interpreter, open a terminal (Ctrl+`) and confirm the (.venv) prompt. A plain terminal plus nano or vim is also fine, and is what you get over SSH on a server.",
  });

  await d.twoPanels({
    title: "Two Ways to Run Python",
    sub: "Interactive mode to explore, script mode to keep",
    left: { caption: "Interactive mode (REPL)", fontSize: 11, lines: [
      "$ python",
      ">>> 2 ** 10",
      "1024",
      ">>> port = 443",
      ">>> port + 1",
      "444",
      ">>> help(len)       # built-in help",
      ">>> exit()",
    ] },
    right: { caption: "Script mode", fontSize: 11, lines: [
      "#!/usr/bin/env python3",
      "# hello.py",
      "analyst = \"Asha\"",
      "print(\"Hello,\", analyst)",
      "",
      "$ python hello.py",
      "Hello, Asha",
      "# Ubuntu: run it like a command",
      "$ chmod +x hello.py && ./hello.py",
      "Hello, Asha",
    ] },
    below: "Use the **REPL** to try things and inspect objects (`help()`, `dir()`, `type()`); use **scripts** for anything you will run twice.",
    notes: "In the REPL the value of an expression is echoed automatically; in a script you must print it. The first line #!/usr/bin/env python3 (the shebang) tells Linux which interpreter to use, so after chmod +x the script runs like any other command. On Windows the line is harmless, and the py launcher reads it. Inside an active venv the command is python on both systems. Show import this for the Zen of Python if time permits.",
  });

  await d.demo({
    tag: "D1", name: "Host Recon Banner", file: "01_hello_recon.py", codeW: 4.6,
    code: [
      "import platform",
      "import sys",
      "import getpass",
      "",
      "print(\"=\" * 44)",
      "print(\"  Python for Cyber Security - Host Recon\")",
      "print(\"=\" * 44)",
      "",
      "print(\"Python version :\", platform.python_version())",
      "print(\"Interpreter    :\", sys.executable)",
      "print(\"Operating sys  :\", platform.system(),",
      "      platform.release())",
      "print(\"Host name      :\", platform.node())",
      "print(\"Logged-in user :\", getpass.getuser())",
    ],
    output: [
      "============================================",
      "  Python for Cyber Security - Host Recon",
      "============================================",
      "Python version : 3.12.3",
      "Interpreter    :",
      "  /home/student/csf-python/.venv/bin/python",
      "Operating sys  : Linux 6.8.0-45-generic",
      "Host name      : lab-vm-07",
      "Logged-in user : student",
    ],
    watch: [
      "`import` loads a standard-library module",
      "`\"=\" * 44` repeats a string",
      "Interpreter path proves the **venv** is active",
    ],
    notes: "Run it first from the activated venv, then run deactivate and run it again: the Interpreter line changes (Ubuntu: .venv/bin/python to /usr/bin/python3; Windows: .venv Scripts python.exe to the system install). Sample output shown is from Ubuntu. Interpreter output is wrapped to fit the slide. Recording host, OS and user is the first step of any live-response collection.",
  });

  await d.iconRows({
    title: "Python Syntax Essentials",
    sub: "The few rules that cause most beginner errors",
    rows: [
      { icon: "FaIndent", color: C.coral, head: "Indentation defines blocks", text: "No braces. Use **4 spaces** consistently; never mix tabs and spaces." },
      { icon: "FaCommentAlt", color: C.navy, head: "Comments and docstrings", text: "`#` to end of line. `\"\"\"...\"\"\"` at the top of a file or function documents it." },
      { icon: "FaFont", color: C.teal, head: "Case sensitive", text: "`Password`, `password` and `PASSWORD` are three different names." },
      { icon: "FaGripLines", color: C.purple, head: "One statement per line", text: "Long expressions continue inside `( )`, `[ ]` or `{ }`." },
    ],
    panel: { caption: "Blocks by indentation", fontSize: 10, lines: [
      "failed = 6",
      "if failed > 5:",
      "    print(\"Lock the account\")",
      "    print(\"Alert the SOC\")",
      "print(\"Check finished\")",
      "",
      "# Brackets continue a long line",
      "total = (ssh_fails + rdp_fails",
      "         + web_fails)",
    ] },
    notes: "The if statement is a preview of Session 3; here we only care that the two indented lines form one block. Ask what happens if the second print is not indented: it runs every time.",
  });

  await d.tableCode({
    title: "Keywords & Identifiers",
    sub: "Names you choose must follow these rules",
    head: ["Rule", "Valid", "Invalid"],
    colW: [1.75, 1.35, 1.5],
    fontSize: 11,
    rows: [
      ["Starts with a letter or `_`", "`_token`, `ip1`", "`1ip`"],
      ["Letters, digits, `_` only", "`src_port`", "`src-port`"],
      ["Not a keyword", "`klass`", "`class`, `pass`"],
      ["Case sensitive", "`IP` vs `ip`", "(two names)"],
      ["Convention: snake_case", "`max_retries`", "`MaxRetries` (classes only)"],
    ],
    panel: { caption: "Exploring keywords", fontSize: 10, lines: [
      "import keyword",
      "print(len(keyword.kwlist))   # 35",
      "print(keyword.iskeyword(\"pass\"))",
      "# True",
      "",
      "# Shadowing a built-in: legal",
      "# but it breaks things later",
      "input = \"10.0.0.5\"",
      "port = input(\"Port: \")",
      "# TypeError: 'str' object is",
      "# not callable",
    ] },
    notes: "Never name a variable list, str, input, id, type or hash: the code works until you need the original function. Descriptive names (failed_logins, not fl) make scripts reviewable during an incident.",
  });

  // Variables are names, not boxes (custom layout)
  {
    const s = d.slide("Python variables are labels attached to objects, not boxes holding values. Assignment never copies an object; it binds a name to it. Every object has an identity (id), a type and a value. Rebinding port to a string does not change the int object 22; it moves the label.");
    d.heading(s, "Variables Are Names, Not Boxes", "Assignment binds a name to an object; it never copies");
    s.addShape("roundRect", { x: 0.5, y: 1.45, w: 5.0, h: 3.6, fill: { color: C.light }, line: { color: C.light }, rectRadius: 0.1 });
    const names = [["target", 1.75], ["backup", 2.45], ["port", 3.7]];
    const objs = [{ y: 1.85, val: "'10.0.0.5'", type: "str", id: "id 2336870521504" }, { y: 3.45, val: "22", type: "int", id: "id 140711463813320" }];
    for (const [n, y] of names) {
      s.addShape("roundRect", { x: 0.8, y, w: 1.2, h: 0.45, fill: { color: C.white }, line: { color: C.navy, width: 1.25 }, rectRadius: 0.06 });
      tb(s, n, { x: 0.8, y, w: 1.2, h: 0.45, fontFace: MONO, fontSize: 13, bold: true, align: "center", valign: "middle" });
    }
    for (const o of objs) {
      s.addShape("roundRect", { x: 3.1, y: o.y, w: 2.1, h: 0.95, fill: { color: C.white }, line: { color: C.line, width: 1 }, rectRadius: 0.08 });
      tb(s, [
        { text: o.val, options: { fontFace: MONO, fontSize: 15, bold: true, color: C.coral, breakLine: true } },
        { text: `type ${o.type}`, options: { fontSize: 10.5, color: C.gray, breakLine: true } },
        { text: o.id, options: { fontSize: 10.5, color: C.gray } },
      ], { x: 3.25, y: o.y + 0.08, w: 1.9, h: 0.85 });
    }
    s.addShape("line", { x: 2.02, y: 1.975, w: 1.06, h: 0.2, line: { color: C.navy, width: 1.5, endArrowType: "triangle" } });
    s.addShape("line", { x: 2.02, y: 2.375, w: 1.06, h: 0.3, flipV: true, line: { color: C.navy, width: 1.5, endArrowType: "triangle" } });
    s.addShape("line", { x: 2.02, y: 3.925, w: 1.06, h: 0, line: { color: C.navy, width: 1.5, endArrowType: "triangle" } });
    tb(s, "Two names, one object", { x: 0.8, y: 2.95, w: 2.5, h: 0.3, fontSize: 11, italic: true, color: C.teal });
    tb(s, [{ text: "Every object has: ", options: { bold: true } }, { text: "identity · type · value" }], { x: 0.8, y: 4.55, w: 4.5, h: 0.3, fontSize: 12 });
    d.codePanel(s, { caption: "In code", fontSize: 11, lines: [
      "target = \"10.0.0.5\"",
      "backup = target",
      "port = 22",
      "",
      "print(type(target))",
      "# <class 'str'>",
      "print(id(target) == id(backup))",
      "# True: same object",
      "",
      "port = \"22/tcp\"   # label moves",
      "print(type(port))  # <class 'str'>",
    ] }, 5.85, 1.45, 3.65, 3.6);
  }

  await d.demo({
    tag: "D2", name: "Variables & Objects", file: "02_variables.py",
    code: [
      "target_host = \"10.0.0.5\"",
      "open_port = 22",
      "",
      "# Multiple assignment and swapping",
      "src_ip, dst_ip, proto = \"192.168.1.10\", \"8.8.8.8\", \"UDP\"",
      "primary, backup = \"1.1.1.1\", \"8.8.8.8\"",
      "primary, backup = backup, primary",
      "",
      "# Dynamic typing: the OBJECT has the type",
      "evidence = 404",
      "print(\"evidence =\", evidence, \"->\", type(evidence))",
      "evidence = \"404 Not Found\"",
      "print(\"evidence =\", evidence, \"->\", type(evidence))",
      "",
      "a = \"admin\"",
      "b = a",
      "print(\"id(a) == id(b)?\", id(a) == id(b))",
      "del evidence      # name removed",
    ],
    output: [
      "Target: 10.0.0.5 | Port: 22",
      "Flow: 192.168.1.10 -> 8.8.8.8",
      "  over UDP",
      "After swap -> primary: 8.8.8.8",
      "evidence = 404 -> <class 'int'>",
      "evidence = 404 Not Found",
      "  -> <class 'str'>",
      "id(a) == id(b)? True",
    ],
    watch: [
      "Swap with no temp variable",
      "Same name, different types",
      "`del` removes the name, not the object",
    ],
    notes: "Output is lightly wrapped to fit the slide. After the run, uncomment the print(evidence) line at the end to show NameError.",
  });

  await d.tableSlide({
    title: "Built-in Data Types",
    sub: "Every value in Python is an object of one of these types",
    head: ["Category", "Type", "Example literal", "Security example"],
    colW: [1.4, 1.5, 2.6, 3.5],
    fontSize: 10.5,
    rows: [
      ["Numeric", "`int`, `float`, `complex`", "`443`, `0.98`, `3+4j`", "Port numbers, PIDs, detection scores"],
      ["Boolean", "`bool`", "`True`, `False`", "is_malicious, is_patched flags"],
      ["Text", "`str`", "`\"admin\"`", "Usernames, URLs, log lines"],
      ["Binary", "`bytes`", "`b\"MZ\"`", "File headers, raw packet data"],
      ["Sequence", "`list`, `tuple`", "`[22, 80]`, `(\"10.0.0.5\", 443)`", "Port lists, (IP, port) endpoints"],
      ["Mapping", "`dict`", "`{\"port\": 22}`", "Parsed config, JSON from an API"],
      ["Set", "`set`", "`{\"1.1.1.1\", \"8.8.8.8\"}`", "Unique IPs seen in a log"],
      ["Nothing", "`NoneType`", "`None`", "Value not known yet (no owner)"],
    ],
    belowY: 4.6,
    below: ["Today: numbers, bool, str, bytes and None. Strings, lists, tuples and dictionaries get their own sessions (5–8)."],
    notes: "type(x) tells you the type of any object. MZ is the first two bytes of every Windows executable: a classic file-signature check in forensics.",
  });

  await d.grid4({
    title: "Numbers: int, float, complex, bool",
    sub: "Four numeric types, one of them hiding in plain sight",
    cells: [
      { icon: "FaInfinity", color: C.navy, head: "`int`: unlimited size", text: ["Never overflows: `2 ** 256` works.", "Write in decimal, `0x` hex, `0b` binary, `0o` octal. Use `_` for readability: `1_000_000`."] },
      { icon: "FaPercentage", color: C.coral, head: "`float`: approximate", text: ["64-bit IEEE 754, about 15–17 significant digits.", "`0.1 + 0.2 != 0.3`. Never use floats for money or crypto."] },
      { icon: "FaWaveSquare", color: C.teal, head: "`complex`", text: ["`3 + 4j` with `.real` and `.imag`.", "Used in signal processing; rare in security work."] },
      { icon: "FaToggleOn", color: C.purple, head: "`bool` is an `int`", text: ["`True == 1`, `False == 0`.", "`sum(flags)` counts how many checks were True."] },
    ],
    notes: "Hex and binary matter constantly in security: memory addresses, byte values in packets, permission bits, subnet masks.",
  });

  await d.demo({
    tag: "D3", name: "Numbers and Bases", file: "03_numbers_and_bases.py",
    code: [
      "port_dec = 443",
      "port_hex = 0x1BB        # hexadecimal",
      "port_bin = 0b110111011  # binary",
      "perm_oct = 0o755        # chmod 755",
      "print(\"443 written 3 ways:\", port_dec, port_hex, port_bin)",
      "print(\"chmod 755 as decimal:\", perm_oct)",
      "print(\"hex(443) =\", hex(443), \"| bin(443) =\", bin(443))",
      "",
      "# Python ints never overflow",
      "key_space = 2 ** 256",
      "print(\"AES-256 key space has\", len(str(key_space)), \"digits\")",
      "",
      "print(\"0.1 + 0.2 =\", 0.1 + 0.2)",
      "print(\"Equal to 0.3?\", 0.1 + 0.2 == 0.3)",
      "print(\"Rounded:\", round(0.1 + 0.2, 2))",
      "print(\"True + True =\", True + True)",
    ],
    output: [
      "443 written 3 ways: 443 443 443",
      "chmod 755 as decimal: 493",
      "hex(443) = 0x1bb | bin(443) =",
      "  0b110111011",
      "AES-256 key space has 78 digits",
      "1157920892373161954235709850...",
      "0.1 + 0.2 = 0.30000000000000004",
      "Equal to 0.3? False",
      "Rounded: 0.3",
      "True + True = 2",
    ],
    watch: [
      "Bases change notation, not the value",
      "`2 ** 256` just works",
      "Never compare floats with `==`",
    ],
    notes: "Ask how long brute-forcing 2**256 keys would take at a trillion guesses a second: far longer than the age of the universe. That is why attacks target passwords and implementations, not the key space.",
  });

  await d.tableSlide({
    title: "Literals: Values Written in Code",
    sub: "How you type each kind of value directly into a program",
    head: ["Kind", "Forms", "Examples"],
    colW: [1.6, 3.4, 4.0],
    fontSize: 11,
    rows: [
      ["Integer", "Decimal, hex, octal, binary", "`443`   `0x1BB`   `0o755`   `0b1010`"],
      ["Float", "Decimal point or exponent", "`0.5`   `1.5e6`"],
      ["String", "Single, double or triple quotes", "`'root'`   `\"It's\"`   `\"\"\"multi-line\"\"\"`"],
      ["Raw string", "`r` prefix: backslashes kept", "`r\"C:\\Windows\\Temp\"`"],
      ["f-string", "`f` prefix: `{expressions}` evaluated", "`f\"{user} failed {n} times\"`"],
      ["Bytes", "`b` prefix: raw byte values", "`b\"\\x89PNG\"`"],
      ["Boolean / None", "Keywords", "`True`   `False`   `None`"],
      ["Collections", "Brackets", "`[1, 2]`   `(1, 2)`   `{\"k\": 1}`   `{1, 2}`"],
    ],
    belowY: 4.6,
    below: ["A **literal** is a fixed value in source code; a **variable** is a name that can be bound to any value later."],
    notes: "Ask students to identify the literal and the variable in port = 443. Then show that 0x1BB == 443 in the REPL.",
  });

  await d.tableCode({
    title: "Escape Sequences & Raw Strings",
    sub: "A backslash in a normal string starts a special character",
    head: ["Escape", "Meaning"],
    colW: [1.2, 3.0],
    fontSize: 11,
    rows: [
      ["`\\n`", "New line"],
      ["`\\t`", "Tab"],
      ["`\\\\`", "One backslash"],
      ["`\\'`  `\\\"`", "Quote inside a string"],
      ["`\\xhh`", "Byte or character by hex value"],
      ["`\\uXXXX`", "Unicode character"],
      ["`\\0`", "Null character"],
    ],
    panel: { caption: "The Windows path trap", fontSize: 10.5, lines: [
      "path = \"C:\\temp\\new_logs\"",
      "print(path)",
      "# C:      emp",
      "# ew_logs",
      "",
      "# Fix 1: double every backslash",
      "path = \"C:\\\\temp\\\\new_logs\"",
      "",
      "# Fix 2: raw string (preferred)",
      "path = r\"C:\\temp\\new_logs\"",
    ] },
    notes: "\\t became a tab and \\n a new line, silently. Linux paths use forward slashes and need no escaping, but analysts working on Linux still handle Windows paths all the time: from disk images, registry hives and event logs. Raw strings are also the norm for regular expressions (Session 5 onward).",
  });

  await d.demo({
    tag: "D4", name: "Literals", file: "04_literals.py",
    code: [
      "msg1 = 'Login failed for user \"root\"'",
      "msg2 = \"It's a brute-force attempt\"",
      "print(\"Col1\\tCol2\\tCol3\")",
      "",
      "log_path = r\"C:\\Windows\\System32\\winevt\\Logs\"",
      "print(\"Raw path:\", log_path)",
      "",
      "banner = \"\"\"",
      "  +-------------------------+",
      "  |  AUTHORISED ACCESS ONLY |",
      "  +-------------------------+\"\"\"",
      "print(banner)",
      "",
      "user, attempts = \"admin\", 5",
      "print(f\"User {user} failed {attempts} times\")",
      "magic = b\"\\x89PNG\"",
      "print(\"PNG magic:\", magic, len(magic))",
    ],
    output: [
      "Login failed for user \"root\"",
      "It's a brute-force attempt",
      "Col1    Col2    Col3",
      "Raw path: C:\\Windows\\System32\\",
      "  winevt\\Logs",
      "",
      "  +-------------------------+",
      "  |  AUTHORISED ACCESS ONLY |",
      "  +-------------------------+",
      "User admin failed 5 times",
      "PNG magic: b'\\x89PNG' 4",
    ],
    watch: [
      "Pick the quote that avoids escaping",
      "`r\"...\"` keeps backslashes",
      "Bytes are not text: note the `b'...'`",
    ],
    notes: "The script also prints Unicode characters and collection literals; scroll through the full output. Every PNG file starts with the bytes 89 50 4E 47: file signatures like this are how forensic tools identify files whose extension has been changed.",
  });

  await d.demo({
    tag: "D5", name: "Asset Inventory Card", part: "Mini project", file: "05_asset_card.py", codeW: 4.5,
    code: [
      "hostname = \"WEB-SRV-01\"       # str",
      "ip_address = \"172.16.4.20\"    # str",
      "open_ports = 3                # int",
      "cpu_load = 37.5               # float",
      "is_patched = False            # bool",
      "owner = None                  # NoneType",
      "mac_prefix = b\"\\x00\\x1a\\x2b\"  # bytes",
      "",
      "print(f\"| Hostname   : {hostname:<28}|\")",
      "print(f\"| IP address : {ip_address:<28}|\")",
      "print(f\"| Open ports : {open_ports:<28}|\")",
      "print(f\"| Patched    : {str(is_patched):<28}|\")",
      "print(f\"| Owner      : {str(owner):<28}|\")",
      "print(f\"| MAC prefix : {mac_prefix.hex(':'):<28}|\")",
      "",
      "print(type(owner).__name__)   # NoneType",
    ],
    output: [
      "+------------------------------------------+",
      "|           ASSET INVENTORY CARD           |",
      "+------------------------------------------+",
      "| Hostname   : WEB-SRV-01                  |",
      "| IP address : 172.16.4.20                 |",
      "| Open ports : 3                           |",
      "| CPU load % : 37.5                        |",
      "| Patched    : False                       |",
      "| Owner      : None                        |",
      "| MAC prefix : 00:1a:2b                    |",
      "+------------------------------------------+",
    ],
    watch: [
      "Six types describe one asset",
      "`:<28` pads to width 28 (Session 2)",
    ],
    notes: "The script also prints a variable/type table using a for loop: tell students loops come in Session 4. Ask them to add a 'last_scan' variable and a new row to the card.",
  });

  await d.troubleshoot({
    items: [
      ["Ubuntu: `python` not found", "The command is `python3`. Inside an activated venv, `python` works too."],
      ["Windows: `python` not recognized", "Reinstall with **Add to PATH** ticked, or use `py`. Turn off the Store's App execution aliases."],
      ["Ubuntu: pip refuses to install", "`externally-managed-environment`: activate your venv first; never `sudo pip`."],
      ["Windows: `Activate.ps1` is blocked", "Run once: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`."],
      ["Ubuntu: `python3 -m venv` fails", "`ensurepip is not available`: `sudo apt install python3-venv`, delete `.venv`, retry."],
      ["`IndentationError: unexpected indent`", "Tabs mixed with spaces, or a stray space. Set the editor to insert 4 spaces."],
    ],
    notes: "Most first-day problems are PATH and venv problems. Check sys.executable whenever in doubt about which Python is running, and use python -m pip so pip always matches the interpreter. Also expect: NameError (typo, wrong case, used before assignment); 'invalid escape sequence' (backslash in a normal string: use a raw string); on Ubuntu './hello.py: Permission denied' (chmod +x and add the shebang).",
  });

  await d.challenge({
    items: [
      { level: "EASY", head: "Unicode explorer", text: "Print the characters for code points 65, 8377 and 128274, each with its number.", hint: "`chr(65)`, or the escape `\"\\u20b9\"`." },
      { level: "MEDIUM", head: "Show the PATH", text: "Print every folder in the PATH environment variable, one per line, and the Python module search path.", hint: "`import os, sys`; `os.environ[\"PATH\"]`, `os.pathsep`, `sys.path`." },
      { level: "STRETCH", head: "Hash a password", text: "Store a password in a variable and print its SHA-256 hash. Change one character and compare.", hint: "`import hashlib`; `hashlib.sha256(b\"secret\").hexdigest()`." },
    ],
    notes: "Easy and Medium are on the self-learning list (print Unicode characters, print system path variables). Stretch previews hashing used for file integrity later in the module.",
  });

  await d.summary({
    built: [
      ["D1", "Host Recon Banner", "`import`, `print()`, the active interpreter"],
      ["D2", "Variables & Objects", "Binding, swapping, `type()`, `id()`"],
      ["D3", "Numbers and Bases", "Hex, binary, octal, float limits"],
      ["D4", "Literals", "Quotes, escapes, raw, f-strings, bytes"],
      ["D5", "Asset Inventory Card", "Every basic type in one script"],
    ],
    takeaways: [
      "Python is the default language for security automation",
      "Always work inside a **virtual environment**",
      "A variable is a name bound to an object with identity, type and value",
      "Use **raw strings** for Windows paths and regex",
    ],
    next: "Session 2: Input and output, mutable vs immutable, operators, type casting",
  });

  await d.save(out);
};

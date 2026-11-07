// Session 9: Functions - defining, parameters, arguments (positional/default/keyword, *args/**kwargs)
const { Deck, C } = require("./lib");

module.exports = async function build(out) {
  const d = new Deck(9, "Functions");

  await d.titleSlide({
    title: "Functions: Package and Reuse Your Code",
    subtitle: "Turn repeated checks into named tools: is this IP private, is this password strong, scan these ports.",
    flow: [
      ["FaCube", "def", "Name a block of code", C.coral],
      ["FaSlidersH", "Parameters", "Positional, default, keyword", C.navy],
      ["FaAsterisk", "*args **kwargs", "Any number of arguments", C.teal],
      ["FaUndo", "return", "Hand a value back", C.coral],
    ],
    notes: "So far code has run top to bottom. Functions let us name a useful operation once and call it everywhere: the heart of reusable security tooling. Today: defining them and the many ways to pass arguments. Session 10 covers return values, scope and recursion in depth.",
  });

  await d.goalsAgenda({
    sub: "Theory with a live demo after every concept",
    goals: [
      ["FaCube", "Define functions with `def` and docstrings"],
      ["FaSlidersH", "Use positional, keyword and default arguments"],
      ["FaAsterisk", "Accept and unpack variable arguments"],
      ["FaUndo", "Return values and compose functions"],
    ],
    agenda: [
      "Defining & calling",
      "D1  Reusable checks",
      "Argument styles & defaults",
      "D2  Positional, keyword, default",
      "*args and **kwargs",
      "D3  Flexible arguments",
      "D4  Lab: length, box, cube",
      "D5  Password toolkit",
      "Troubleshooting & challenge",
    ],
    notes: "D4 is the syllabus lab set for functions.",
  });

  await d.iconRows({
    title: "Defining & Calling Functions",
    sub: "Name a block of code once; call it as many times as you like",
    rows: [
      { icon: "FaCube", color: C.coral, head: "`def name(params):`", text: "The header names the function and its parameters; the body is indented." },
      { icon: "FaCommentDots", color: C.navy, head: "Docstring", text: "A `\"\"\"...\"\"\"` first line documents it; readable via `help()` or `.__doc__`." },
      { icon: "FaUndo", color: C.teal, head: "`return`", text: "Hands a value back. No `return` means the function returns `None`." },
      { icon: "FaRecycle", color: C.purple, head: "Why bother", text: "Write once, fix once, test once. The same check everywhere stays consistent." },
    ],
    panel: { caption: "A reusable check", fontSize: 10.5, lines: [
      "def is_private_ip(ip):",
      "    \"\"\"True if ip is RFC 1918.\"\"\"",
      "    return (ip.startswith(\"10.\")",
      "        or ip.startswith(\"192.168.\")",
      "        or ip.startswith(\"172.16.\"))",
      "",
      "is_private_ip(\"10.0.0.5\")   # True",
      "is_private_ip(\"8.8.8.8\")    # False",
    ] },
    notes: "Parameters are the names in the def; arguments are the values you pass when calling. A function with no return gives back None, which is a common source of confusion.",
  });

  await d.demo({
    tag: "D1", name: "Reusable Checks", file: "01_defining.py",
    code: [
      "def is_private_ip(ip):",
      "    \"\"\"Return True if ip is in a private range.\"\"\"",
      "    return (ip.startswith(\"10.\")",
      "            or ip.startswith(\"192.168.\")",
      "            or ip.startswith(\"172.16.\"))",
      "",
      "def banner(text):",
      "    line = \"+\" + \"-\" * (len(text) + 2) + \"+\"",
      "    print(line); print(f\"| {text} |\"); print(line)",
      "",
      "banner(\"Scan Report\")",
      "for ip in hosts:",
      "    label = \"internal\" if is_private_ip(ip) else \"EXTERNAL\"",
      "    print(f\"{ip:<16} {label}\")",
      "",
      "print(is_private_ip.__doc__)",
    ],
    output: [
      "+-------------+",
      "| Scan Report |",
      "+-------------+",
      "10.0.0.5         internal",
      "8.8.8.8          EXTERNAL",
      "192.168.1.1      internal",
      "45.155.205.233   EXTERNAL",
      "Internal hosts: 2",
      "Help for is_private_ip:",
      "  Return True if ip is in a",
      "  private range.",
    ],
    watch: [
      "Define once, call in a loop",
      "`return` gives a value to use in `if`",
      "The docstring is readable at runtime",
    ],
    notes: "Two functions: one returns a bool used in a condition, one just prints. Reusing is_private_ip means the rule lives in one place; fix it once and every caller benefits.",
  });

  await d.tableSlide({
    title: "Argument Styles",
    sub: "How values get matched to parameters",
    head: ["Style", "Looks like", "Matched by"],
    colW: [2.2, 3.5, 3.3],
    fontSize: 11,
    rows: [
      ["Positional", "`connect(\"10.0.0.5\", 443)`", "Order"],
      ["Keyword", "`connect(host=\"x\", port=443)`", "Name (any order)"],
      ["Default", "`def connect(host, port=22):`", "Used when omitted"],
      ["Mixed", "`connect(\"x\", 443, use_tls=True)`", "Positional first, then keyword"],
      ["`*args`", "`def scan(host, *ports):`", "Extra positionals -> tuple"],
      ["`**kwargs`", "`def log(msg, **fields):`", "Extra keywords -> dict"],
    ],
    belowY: 4.35,
    below: ["**Rule:** in a call and in a `def`, positional comes before keyword. Defaults make parameters optional and self-documenting."],
    notes: "Keyword arguments make calls readable: connect('x', use_tls=True) is clearer than connect('x', 443, 5, True). Encourage keywords for boolean flags.",
  });

  await d.demo({
    tag: "D2", name: "Positional, Keyword, Default", file: "02_arguments.py", codeW: 5.0,
    code: [
      "def connect(host, port=22, timeout=5, use_tls=False):",
      "    proto = \"TLS\" if use_tls else \"plain\"",
      "    return f\"{host}:{port} ({proto}, timeout={timeout}s)\"",
      "",
      "connect(\"10.0.0.5\")                  # all defaults",
      "connect(\"10.0.0.5\", 443)             # positional",
      "connect(\"10.0.0.5\", use_tls=True, port=443)  # keyword",
      "",
      "# The mutable-default TRAP",
      "def add_BAD(finding, report=[]):     # shared list!",
      "    report.append(finding); return report",
      "",
      "def add(finding, report=None):       # the fix",
      "    if report is None: report = []",
      "    report.append(finding); return report",
    ],
    output: [
      "10.0.0.5:22 (plain, timeout=5s)",
      "10.0.0.5:443 (plain, timeout=5s)",
      "10.0.0.5:443 (TLS, timeout=5s)",
      "web01:22 (plain, timeout=10s)",
      "",
      "Mutable-default trap:",
      "['open port 23']",
      "['open port 23', 'weak cipher']",
      "",
      "Fixed:",
      "['open port 23']",
      "['weak cipher']",
    ],
    watch: [
      "Keywords are order-independent",
      "Defaults make parameters optional",
      "Never default to `[]` or `{}`",
    ],
    notes: "The mutable-default trap is a famous Python gotcha: the default list is created ONCE and shared across all calls. Use None and build a fresh list inside. This bug has shipped in real security tools.",
  });

  await d.demo({
    tag: "D3", name: "Flexible Arguments", file: "03_args_kwargs.py", codeW: 5.0,
    code: [
      "def scan_ports(host, *ports):     # extra positionals -> tuple",
      "    print(f\"Scanning {host}: {ports}\")",
      "",
      "scan_ports(\"10.0.0.5\", 22, 80, 443)",
      "",
      "def log_event(message, **fields): # extra keywords -> dict",
      "    extras = \" \".join(f\"{k}={v}\" for k, v in fields.items())",
      "    print(f\"[LOG] {message}  {extras}\")",
      "",
      "log_event(\"login failed\", user=\"root\", attempts=5)",
      "",
      "# Unpack INTO a call",
      "wanted = [22, 80, 443]",
      "scan_ports(\"web01\", *wanted)      # list -> arguments",
      "connect(**{\"host\": \"x\", \"port\": 443})  # dict -> kwargs",
    ],
    output: [
      "Scanning 10.0.0.5: (22,)",
      "Scanning 10.0.0.5: (22, 80, 443)",
      "[LOG] login failed  user=root",
      "  attempts=5",
      "[LOG] service started  name=sshd",
      "Scanning web01: (22, 80, 443)",
      "connect 10.0.0.5:443",
      "",
      "WARN: Findings",
      "  - open 23",
      "  - weak TLS",
      "  meta: {'scan_id': 7}",
    ],
    watch: [
      "`*args` collects extra positionals",
      "`**kwargs` collects extra keywords",
      "`*` / `**` also UNPACK into a call",
    ],
    notes: "*args and **kwargs appear all over security libraries (wrappers, decorators, plugin systems). The same * and ** both pack (in the def) and unpack (in a call).",
  });

  await d.demo({
    tag: "D4", name: "Length, Box, Cube", part: "Lab programs", file: "04_lab_functions.py",
    code: [
      "def same_length(a, b):",
      "    return len(a) == len(b)",
      "",
      "def box_volume(length=1, width=1, height=1):",
      "    return length * width * height",
      "",
      "def cube(n=2):",
      "    return n ** 3",
      "",
      "same_length(\"abc\", \"xyz\")     # True",
      "box_volume(2, 3, 4)          # 24",
      "box_volume(5)                # 5  (w,h = 1)",
      "box_volume(height=10)        # 10",
      "cube(5)                      # 125",
      "cube()                       # 8  (default 2)",
    ],
    output: [
      "same_length('abc', 'xyz') : True",
      "same_length('hi', 'hello'): False",
      "",
      "box_volume(2, 3, 4) : 24",
      "box_volume(5)       : 5",
      "box_volume(height=10): 10",
      "",
      "cube(5): 125",
      "cube() : 8",
    ],
    watch: [
      "Defaults make every box dimension optional",
      "`cube()` with no argument uses 2",
      "Keyword args skip the middle ones",
    ],
    notes: "The three syllabus lab programs. box_volume(height=10) shows why keywords matter: you set height without touching length and width.",
  });

  await d.demo({
    tag: "D5", name: "Password Toolkit", part: "Mini project", file: "05_password_toolkit.py", codeW: 5.0,
    code: [
      "def charset_size(pw):",
      "    size = 0",
      "    if any(c.islower() for c in pw): size += 26",
      "    if any(c.isupper() for c in pw): size += 26",
      "    if any(c.isdigit() for c in pw): size += 10",
      "    if any(not c.isalnum() for c in pw): size += 32",
      "    return size",
      "",
      "def entropy_bits(length, charset_size):",
      "    return round(length * math.log2(charset_size), 1)",
      "",
      "def strength(pw, min_bits=60):",
      "    bits = entropy_bits(len(pw), max(charset_size(pw), 1))",
      "    return (\"strong\" if bits >= min_bits else ...), bits",
    ],
    output: [
      "123456            weak    19.9 bits",
      "Summer2026        fair    59.5 bits",
      "Tr0ub4dor&3x!     strong  85.2 bits",
      "correct horse     strong 164.0 bits",
      "  battery staple",
      "",
      "(sha256 prefix shown per password",
      " in the full run)",
    ],
    watch: [
      "Small functions compose into a report",
      "`min_bits` is a tunable keyword",
      "Length beats complexity (last row)",
    ],
    notes: "Each function does one thing; strength() calls the others. The passphrase in the last row beats the complex short password on entropy, the modern guidance. entropy_bits = length * log2(charset).",
  });

  await d.troubleshoot({
    items: [
      ["Function printed but gave None back", "It has no `return`. Add one, or don't use its result."],
      ["`non-default argument follows default`", "Put parameters with defaults last in the `def`."],
      ["`missing required positional argument`", "A required parameter wasn't passed. Check the call."],
      ["Default list keeps old data", "Mutable default shared across calls. Default to `None`, build inside."],
      ["`got multiple values for argument`", "A value given both positionally and by keyword. Pick one."],
      ["`name 'x' is not defined` after the function", "A variable made inside stays inside. `return` it (Session 10)."],
    ],
    notes: "The None-return and mutable-default issues are the two most common function bugs for beginners.",
  });

  await d.challenge({
    items: [
      { level: "EASY", head: "is_valid_port", text: "Write a function that returns True if a port is an integer in 1-65535, and use it to filter a list.", hint: "`return 1 <= port <= 65535`." },
      { level: "MEDIUM", head: "retry wrapper", text: "Write `attempt(func, times=3)` that calls func up to `times` and returns the first truthy result.", hint: "Pass a function as an argument; loop and call it." },
      { level: "STRETCH", head: "flexible logger", text: "Write `log(msg, level=\"INFO\", **fields)` that prints a timestamped line with any extra key=value fields.", hint: "`datetime.now()`, join `fields.items()`." },
    ],
    notes: "Medium introduces passing functions as arguments, which leads to lambdas and higher-order functions in Session 10.",
  });

  await d.summary({
    built: [
      ["D1", "Reusable Checks", "`def`, docstrings, `return`, calling in a loop"],
      ["D2", "Positional, Keyword, Default", "Argument styles; the mutable-default trap"],
      ["D3", "Flexible Arguments", "`*args`, `**kwargs`, unpacking into calls"],
      ["D4", "Length, Box, Cube", "Lab programs"],
      ["D5", "Password Toolkit", "Composing small functions"],
    ],
    takeaways: [
      "Define once, call everywhere; keep each function to one job",
      "Keyword arguments make calls self-documenting",
      "Never use a mutable default (`[]`, `{}`); use `None`",
      "`*args`/`**kwargs` both pack and unpack",
    ],
    next: "Session 10: return values, variable scope, and argument mutability",
  });

  await d.save(out);
};

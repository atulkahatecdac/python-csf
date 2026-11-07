// Session 3: if, if-else, if-elif, nested if, range(), in / not in
const { Deck, C } = require("./lib");

module.exports = async function build(out) {
  const d = new Deck(3, "Decision Making");

  await d.titleSlide({
    title: "Decision Making: if, elif and Membership",
    subtitle: "Make scripts choose: lock accounts, classify ports, allow or deny traffic, and validate passwords.",
    flow: [
      ["FaQuestion", "Condition", "An expression that is True or False", C.coral],
      ["FaCodeBranch", "Branch", "if / elif / else picks one path", C.navy],
      ["FaLayerGroup", "Nest", "Decisions inside decisions", C.teal],
      ["FaListOl", "Membership", "range(), in, not in", C.coral],
    ],
    notes: "Completes the syllabus block 'Session 2 & 3'. Until now scripts ran top to bottom. Today they make decisions, which is what turns a script into a security control: block or allow, alert or ignore.",
  });

  await d.goalsAgenda({
    sub: "Theory with a live demo after every concept",
    goals: [
      ["FaCodeBranch", "Write `if`, `if-else` and `if-elif-else` statements"],
      ["FaLayerGroup", "Use nested `if` and flatten it with `and`"],
      ["FaListOl", "Generate number sequences with `range()`"],
      ["FaSearch", "Test membership with `in` and `not in`"],
    ],
    agenda: [
      "The if statement & blocks",
      "D1  Lockout and port classes",
      "Nested if",
      "D2  Firewall decision",
      "range(), in, not in",
      "D3  Ranges and blocklists",
      "D4  Lab: odd/even, largest of 3",
      "D5  Password policy checker",
      "Troubleshooting & challenge",
    ],
    notes: "D4 covers two of the syllabus lab programs that were waiting for if statements.",
  });

  await d.iconRows({
    title: "The if Statement",
    sub: "Run a block only when a condition is True",
    rows: [
      { icon: "FaQuestion", color: C.coral, head: "Condition", text: "Any expression. Python tests its **truthiness**: `0`, `\"\"`, `[]`, `None` count as False." },
      { icon: "FaColumns", color: C.navy, head: "Colon and indented block", text: "The `:` opens a block; every line indented 4 spaces belongs to it." },
      { icon: "FaRandom", color: C.teal, head: "else", text: "Runs when the condition is False. Optional; at most one." },
      { icon: "FaStream", color: C.purple, head: "elif ladder", text: "Checked top to bottom; the **first** True branch runs and the rest are skipped." },
    ],
    panel: { caption: "Syntax", fontSize: 11, lines: [
      "if failed > 5:",
      "    print(\"Lock account\")",
      "elif failed > 3:",
      "    print(\"Warn user\")",
      "else:",
      "    print(\"OK\")",
      "",
      "# One-line conditional expression",
      "label = \"HIGH\" if score > 7 else \"low\"",
    ] },
    notes: "There is no switch statement in classic Python; elif ladders do that job. Python 3.10 added match-case, shown in a moment.",
  });

  await d.flowBlocks({
    title: "How an elif Ladder Decides",
    sub: "Classifying a TCP/UDP port number: order matters",
    blocks: [
      { icon: "FaBan", name: "Invalid?", what: "port < 0 or > 65535", k1: "IF TRUE", v1: "\"invalid\"", k2: "ELSE", v2: "Check next condition" },
      { icon: "FaServer", name: "< 1024?", what: "System ports", k1: "IF TRUE", v1: "\"well-known\"", k2: "EXAMPLES", v2: "22 ssh, 80 http, 443 https" },
      { icon: "FaRegistered", name: "< 49152?", what: "Registered ports", k1: "IF TRUE", v1: "\"registered\"", k2: "EXAMPLES", v2: "3306 mysql, 3389 rdp, 8080" },
      { icon: "FaRandom", name: "else", what: "Everything left", k1: "RESULT", v1: "\"dynamic\"", k2: "USED FOR", v2: "Client-side ephemeral ports" },
    ],
    notes: "Ask: what happens if we test < 49152 before < 1024? Port 22 would be called 'registered'. Put the most specific conditions first.",
  });

  await d.demo({
    tag: "D1", name: "Lockout & Port Classes", file: "01_if_elif.py",
    code: [
      "failed_logins = 6",
      "MAX_ATTEMPTS = 5",
      "if failed_logins > MAX_ATTEMPTS:",
      "    print(f\"LOCK account: {failed_logins} failed logins\")",
      "else:",
      "    print(\"Account OK\")",
      "",
      "if port < 0 or port > 65535:",
      "    kind = \"invalid\"",
      "elif port < 1024:",
      "    kind = \"well-known (system)\"",
      "elif port < 49152:",
      "    kind = \"registered\"",
      "else:",
      "    kind = \"dynamic / ephemeral\"",
      "",
      "label = \"CRITICAL\" if severity >= 9 else \"normal\"",
    ],
    output: [
      "LOCK account: 6 failed logins",
      "Port    22: well-known (system)",
      "Port  8080: registered",
      "Port 51515: dynamic / ephemeral",
      "Port 70000: invalid",
      "No API key configured -",
      "  running in offline mode",
      "Alert level: CRITICAL",
    ],
    watch: [
      "Only one branch of the ladder runs",
      "`if not api_key:` tests for empty",
      "UPPER_CASE names mean constants",
    ],
    notes: "The script loops over four ports to save typing; loops are next session. Change MAX_ATTEMPTS to 10 and re-run.",
  });

  await d.twoPanels({
    title: "Nested if",
    sub: "A decision inside another decision",
    left: { caption: "Nested", fontSize: 11, lines: [
      "if src_ip.startswith(\"10.\"):",
      "    if protocol == \"tcp\":",
      "        if port in (22, 443):",
      "            action = \"ALLOW\"",
      "        else:",
      "            action = \"DENY\"",
      "    else:",
      "        action = \"ALLOW\"",
      "else:",
      "    action = \"DENY\"",
    ] },
    right: { caption: "Flattened with and", fontSize: 11, lines: [
      "internal = src_ip.startswith(\"10.\")",
      "",
      "if internal and protocol != \"tcp\":",
      "    action = \"ALLOW\"",
      "elif internal and port in (22, 443):",
      "    action = \"ALLOW\"",
      "else:",
      "    action = \"DENY\"",
    ] },
    below: "Each level of nesting adds an indent and a path to test. Keep nesting to **two or three levels**; beyond that, flatten with `and` or split into functions.",
    notes: "Both versions make the same decisions. Ask the class to trace 10.0.0.8 / udp / 53 through each one.",
  });

  await d.demo({
    tag: "D2", name: "Firewall Decision", file: "02_nested_if.py", codeW: 5.0,
    code: [
      "def decide(src_ip, protocol, port):",
      "    if src_ip.startswith(\"10.\"):          # internal?",
      "        if protocol == \"tcp\":",
      "            if port in (22, 443):",
      "                return \"ALLOW (internal admin/web)\"",
      "            else:",
      "                return \"DENY  (internal, port not allowed)\"",
      "        else:",
      "            return \"ALLOW (internal non-TCP)\"",
      "    else:                                 # internet",
      "        if protocol == \"tcp\" and port == 443:",
      "            return \"ALLOW (public HTTPS)\"",
      "        return \"DENY  (external)\"",
    ],
    output: [
      "10.0.0.8 tcp 22",
      "  -> ALLOW (internal admin/web)",
      "10.0.0.8 tcp 3389",
      "  -> DENY (internal, port not",
      "     allowed)",
      "10.0.0.8 udp 53",
      "  -> ALLOW (internal non-TCP)",
      "203.0.113.9 tcp 443",
      "  -> ALLOW (public HTTPS)",
      "203.0.113.9 tcp 22",
      "  -> DENY (external)",
    ],
    notes: "Output wrapped to fit the slide. def and return preview Session 9: for now, decide() is a named block that hands back a result. Default-deny is the security principle here: anything not explicitly allowed falls through to DENY.",
  });

  await d.tableCode({
    title: "range(): Number Sequences",
    sub: "Stop is always excluded",
    head: ["Call", "Produces"],
    colW: [1.9, 2.6],
    fontSize: 11,
    rows: [
      ["`range(5)`", "0 1 2 3 4"],
      ["`range(20, 26)`", "20 21 22 23 24 25"],
      ["`range(0, 50, 10)`", "0 10 20 30 40"],
      ["`range(10, 0, -3)`", "10 7 4 1"],
      ["`range(1, 65536)`", "Every valid port"],
    ],
    panel: { caption: "A range is lazy", fontSize: 10.5, lines: [
      "ports = range(1, 65536)",
      "print(len(ports))     # 65535",
      "print(ports[0])       # 1",
      "print(ports[-1])      # 65535",
      "",
      "# Stores only start, stop, step:",
      "# no list of 65535 numbers in memory",
      "print(list(range(3)))  # [0, 1, 2]",
      "",
      "# Main use: driving for loops",
      "# (Session 4)",
    ] },
    notes: "range is most useful with for loops next session (for port in range(1, 1025): scan). Today we use it for membership tests and to see sequences with list().",
  });

  await d.iconRows({
    title: "Membership: in and not in",
    sub: "Is this value inside that collection?",
    rows: [
      { icon: "FaListOl", color: C.navy, head: "Ranges, lists, tuples", text: "`port in range(1, 1024)`, `ip in blocklist`" },
      { icon: "FaFont", color: C.coral, head: "Strings: substring test", text: "`\"sqlmap\" in user_agent.lower()`" },
      { icon: "FaBook", color: C.teal, head: "Dictionaries: keys only", text: "`443 in services` checks keys, not values" },
      { icon: "FaBolt", color: C.purple, head: "Sets: fastest lookup", text: "`ip in seen_ips` stays fast with millions of items (Session 8)" },
    ],
    panel: { caption: "Detection-style checks", fontSize: 10.5, lines: [
      "if src in blocklist:",
      "    print(\"BLOCK\", src)",
      "",
      "if \"../\" in requested_path:",
      "    print(\"Path traversal attempt\")",
      "",
      "if method not in (\"GET\", \"POST\"):",
      "    print(\"405 Method Not Allowed\")",
    ] },
    notes: "Substring checks are the simplest form of signature-based detection, and also the easiest to evade (case changes, URL encoding). That is why we lower-case first, and why real tools normalise input.",
  });

  await d.demo({
    tag: "D3", name: "Ranges & Blocklists", file: "03_range_membership.py",
    code: [
      "print(list(range(5)))",
      "print(list(range(0, 50, 10)))",
      "print(list(range(10, 0, -3)))",
      "all_ports = range(1, 65536)",
      "",
      "port = 8080",
      "print(\"Privileged port?\", port in range(1, 1024))",
      "",
      "blocklist = [\"185.220.101.4\", \"45.155.205.233\"]",
      "if src in blocklist:",
      "    print(f\"BLOCK {src}: on threat-intel blocklist\")",
      "",
      "if \"sqlmap\" in user_agent.lower():",
      "    print(\"Scanner detected in User-Agent\")",
      "",
      "services = {22: \"ssh\", 80: \"http\", 443: \"https\"}",
      "print(\"'ssh' in services?\", \"ssh\" in services)",
    ],
    output: [
      "[0, 1, 2, 3, 4]",
      "[0, 10, 20, 30, 40]",
      "[10, 7, 4, 1]",
      "Ports in range: 65535",
      "Privileged port?   False",
      "BLOCK 45.155.205.233: on",
      "  threat-intel blocklist",
      "Scanner detected in User-Agent",
      "405 Method Not Allowed: DELETE",
      "'ssh' in services?  False",
    ],
    watch: [
      "`range` excludes the stop value",
      "`in` on a dict checks keys",
    ],
    notes: "Output trimmed and wrapped. sqlmap really does announce itself in its default User-Agent; attackers change it with --random-agent, so header checks are a weak signal on their own.",
  });

  await d.demo({
    tag: "D4", name: "Odd/Even & Largest of 3", part: "Lab programs", file: "04_lab_odd_even_largest.py",
    code: [
      "n = int(input(\"Enter a number: \"))",
      "if n % 2 == 0:",
      "    print(n, \"is even\")",
      "else:",
      "    print(n, \"is odd\")",
      "",
      "a, b, c = input(\"Enter three numbers: \").split()",
      "a, b, c = int(a), int(b), int(c)",
      "if a >= b and a >= c:",
      "    largest = a",
      "elif b >= a and b >= c:",
      "    largest = b",
      "else:",
      "    largest = c",
      "print(\"Largest (if/elif):\", largest)",
      "print(\"Largest (max())  :\", max(a, b, c))",
    ],
    output: [
      "> Enter a number: 17",
      "17 is odd",
      "> Enter three numbers: 42 7 19",
      "Largest (if/elif): 42",
      "Largest (max())  : 42",
    ],
    watch: [
      "`%` gives the remainder",
      "`>=` handles ties correctly",
      "Built-ins often beat hand-written logic",
    ],
    notes: "Ask: what does the ladder print for 5 5 5? With > instead of >= a tie can fall through to the wrong branch. Test edge cases: equal values and negative numbers.",
  });

  await d.twoPanels({
    title: "Bonus: match-case (Python 3.10+)",
    sub: "Structural pattern matching: a cleaner long elif ladder",
    left: { caption: "elif ladder", fontSize: 11, lines: [
      "if proto == \"tcp\":",
      "    handler = scan_tcp",
      "elif proto == \"udp\":",
      "    handler = scan_udp",
      "elif proto in (\"icmp\", \"icmpv6\"):",
      "    handler = ping",
      "else:",
      "    handler = None",
    ] },
    right: { caption: "match-case", fontSize: 11, lines: [
      "match proto:",
      "    case \"tcp\":",
      "        handler = scan_tcp",
      "    case \"udp\":",
      "        handler = scan_udp",
      "    case \"icmp\" | \"icmpv6\":",
      "        handler = ping",
      "    case _:",
      "        handler = None",
    ] },
    below: "`case _` is the catch-all, like `else`. Not in the syllabus, but you will meet it in modern code; it needs Python **3.10 or newer**.",
    notes: "match can also destructure tuples and dicts, which is powerful for parsing protocol messages. Optional slide: skip if short of time.",
  });

  await d.demo({
    tag: "D5", name: "Password Policy Checker", part: "Mini project", file: "05_password_policy.py", codeW: 5.1,
    code: [
      "COMMON = (\"123456\", \"password\", \"password123\", ...)",
      "pw = getpass(\"Password to check (hidden): \")",
      "",
      "if pw.lower() in COMMON:",
      "    print(\"REJECT: appears in the common-password list\")",
      "elif len(pw) < 12:",
      "    print(f\"REJECT: only {len(pw)} characters (minimum 12)\")",
      "else:",
      "    has_upper = pw.lower() != pw",
      "    has_lower = pw.upper() != pw",
      "    has_digit_or_symbol = not pw.isalpha()",
      "    has_symbol = not pw.isalnum()",
      "    score = (has_upper + has_lower",
      "             + has_digit_or_symbol + has_symbol)",
      "    if score == 4:",
      "        print(\"ACCEPT: strong password\")",
      "    elif score == 3:",
      "        print(\"ACCEPT: acceptable, add a symbol\")",
    ],
    output: [
      "> password123",
      "REJECT: appears in the",
      "  common-password list",
      "> short1A",
      "REJECT: only 7 characters",
      "> Tr0ub4dor&3x!",
      "Uppercase letter : yes",
      "Lowercase letter : yes",
      "Digit or symbol  : yes",
      "Symbol           : yes",
      "ACCEPT: strong password",
    ],
    notes: "Self-learning task: 'check valid password rules'. Then try correcthorsebatterystaple: 25 characters but rejected for having no uppercase or symbols. Discuss: NIST SP 800-63B now favours length and blocklists over composition rules. Should the policy change? Booleans add as 1 and 0, so summing them counts the rules passed.",
  });

  await d.troubleshoot({
    items: [
      ["`SyntaxError: expected ':'`", "Every `if`, `elif` and `else` line ends with a colon."],
      ["`IndentationError` after a colon", "`expected an indented block`: indent the next line. Use `pass` for an empty block."],
      ["`if x = 5:` gives SyntaxError", "`=` assigns; `==` compares. Python refuses assignment inside `if`."],
      ["Wrong branch runs in an elif ladder", "Conditions are checked in order. Put the most specific test first."],
      ["`if x == 1 or 2:` is always True", "`2` alone is truthy. Write `x == 1 or x == 2`, or `x in (1, 2)`."],
      ["`'ssh' in services` is False", "`in` on a dict checks keys. Use `in services.values()` for values."],
    ],
    notes: "The 'or 2' bug is one of the most common logic errors; it also hides in real security checks (if role == 'admin' or 'root': grants everyone access).",
  });

  await d.challenge({
    items: [
      { level: "EASY", head: "Leap year", text: "Read a year and print whether it is a leap year: divisible by 4, except centuries, unless divisible by 400.", hint: "`y % 4 == 0 and (y % 100 != 0 or y % 400 == 0)`." },
      { level: "MEDIUM", head: "HTTP status triage", text: "Read an HTTP status code and print its class: informational, success, redirect, client error or server error. Flag 401 and 403 as possible attacks.", hint: "`code in range(400, 500)`." },
      { level: "STRETCH", head: "Quadratic roots", text: "Read a, b, c and print the real roots, a single root, or 'no real roots' using the discriminant.", hint: "`d = b*b - 4*a*c`; `import math`; `math.sqrt(d)`." },
    ],
    notes: "All three are on the self-learning list (leap year, quadratic roots) or extend it. Medium connects to web-log analysis later in the module.",
  });

  await d.summary({
    built: [
      ["D1", "Lockout & Port Classes", "`if`/`else`, elif ladder, conditional expression"],
      ["D2", "Firewall Decision", "Nested `if`, default deny"],
      ["D3", "Ranges & Blocklists", "`range()`, `in`, `not in`"],
      ["D4", "Odd/Even & Largest of 3", "Lab programs with `%` and `>=`"],
      ["D5", "Password Policy Checker", "Everything combined"],
    ],
    takeaways: [
      "The first True branch of an elif ladder wins",
      "Keep nesting shallow; flatten with `and`",
      "`range(start, stop, step)` excludes stop",
      "`in` gives readable blocklist and signature checks",
    ],
    next: "Session 4: Loops: for, while, loop else, break, continue, nested loops",
  });

  await d.save(out);
};

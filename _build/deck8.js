// Session 8: Dictionaries - creating, accessing, traversing, methods, Caesar cipher
const { Deck, C } = require("./lib");

module.exports = async function build(out) {
  const d = new Deck(8, "Dictionaries");

  await d.titleSlide({
    title: "Dictionaries: Fast Lookups by Key",
    subtitle: "Map ports to services, IPs to counts, users to records; the structure behind every log analysis.",
    flow: [
      ["FaBook", "key: value", "Store pairs, look up by key", C.coral],
      ["FaBolt", "Fast", "Lookup stays instant as it grows", C.navy],
      ["FaSortAmountDown", "Count", "Tally events per key", C.teal],
      ["FaLock", "Cipher", "A ROT-13 mapping", C.coral],
    ],
    notes: "If lists are the everyday container, dictionaries are the everyday lookup. Counting failed logins per IP, mapping a port to a service, grouping hosts by OS: all dictionaries. We finish with the syllabus Caesar-cipher exercise, which is literally a dictionary.",
  });

  await d.goalsAgenda({
    sub: "Theory with a live demo after every concept",
    goals: [
      ["FaBook", "Create dicts and look up values safely"],
      ["FaRedo", "Traverse keys, values and items"],
      ["FaTools", "Use `get`, `setdefault`, `update` and the counter pattern"],
      ["FaLock", "Build a ROT-13 cipher from a dictionary"],
    ],
    agenda: [
      "Creating & accessing",
      "D1  Lookup, get(), KeyError",
      "Traversing & methods",
      "D2  items(), counters, grouping",
      "D3  Lab: words & salaries",
      "D4  Lab: ROT-13 cipher",
      "D5  Brute-force detector",
      "Troubleshooting & challenge",
    ],
    notes: "D3 and D4 are the syllabus lab programs; D4 is the Caesar/ROT-13 exercise.",
  });

  await d.iconRows({
    title: "Creating & Accessing",
    sub: "An unordered* mapping of unique keys to values  (*insertion order is kept since 3.7)",
    rows: [
      { icon: "FaBook", color: C.coral, head: "`{key: value, ...}`", text: "`{22: \"ssh\", 80: \"http\"}` or `dict(ip=\"10.0.0.5\")`. Keys must be immutable." },
      { icon: "FaSearch", color: C.navy, head: "Look up with `d[key]`", text: "`ports[22]` -> `\"ssh\"`. A missing key raises **KeyError**." },
      { icon: "FaShieldAlt", color: C.teal, head: "Safer: `d.get(key, default)`", text: "`ports.get(8080, \"unknown\")` never raises; returns the default." },
      { icon: "FaPen", color: C.purple, head: "Add / update / delete", text: "`d[k] = v` adds or replaces; `del d[k]`; `d.pop(k, None)` is safe." },
    ],
    panel: { caption: "Basics", fontSize: 10.5, lines: [
      "ports = {22: \"ssh\", 80: \"http\"}",
      "ports[22]              # 'ssh'",
      "ports[8080]           # KeyError!",
      "ports.get(8080)       # None",
      "ports.get(8080, \"?\")  # '?'",
      "",
      "ports[53] = \"dns\"      # add",
      "ports[80] = \"HTTP\"     # update",
      "del ports[22]          # delete",
      "443 in ports           # True (keys)",
    ] },
    notes: "Keys are unique: assigning to an existing key overwrites it. Membership (in) checks keys, not values. Keys must be hashable, so a tuple can be a key but a list cannot.",
  });

  await d.demo({
    tag: "D1", name: "Lookup, get(), KeyError", file: "01_create_access.py",
    code: [
      "ports = {22: \"ssh\", 80: \"http\", 443: \"https\"}",
      "host = dict(ip=\"10.0.0.5\", os=\"Linux\", patched=False)",
      "",
      "print(ports[22])",
      "try:",
      "    print(ports[8080])",
      "except KeyError as err:",
      "    print(\"KeyError:\", err)",
      "print(\"get(8080, 'unknown'):\", ports.get(8080, \"unknown\"))",
      "",
      "print(\"'https' in ports?\", \"https\" in ports)",
      "",
      "ports[53] = \"dns\"       # add",
      "del ports[22]           # delete",
      "removed = ports.pop(53, None)",
    ],
    output: [
      "ports: {22: 'ssh', 80: 'http',",
      "        443: 'https'}",
      "port 22 is ssh",
      "KeyError: 8080",
      "get(8080): None",
      "get(8080, 'unknown'): unknown",
      "443 in ports?  True",
      "'https' in ports? False",
      "after edits: {80: 'HTTP', 443: 'https'}",
      "size: 2",
    ],
    watch: [
      "`[]` raises KeyError; `.get()` is safe",
      "`in` checks keys, not values",
      "Keys are unique: reassigning overwrites",
    ],
    notes: "The KeyError vs get() choice is constant in real code: use [] when a missing key is a bug, get() when it's expected. Note 'https' in ports is False because https is a value, not a key.",
  });

  await d.demo({
    tag: "D2", name: "items(), Counters, Grouping", file: "02_traverse_methods.py", codeW: 5.0,
    code: [
      "for host in inventory:            # yields KEYS",
      "    ...",
      "for host, info in inventory.items():   # key + value",
      "    print(host, info['ip'], info['os'])",
      "",
      "settings.update({\"retries\": 5, \"verbose\": True})",
      "",
      "# The counter pattern",
      "counts = {}",
      "for ip in log_ips:",
      "    counts[ip] = counts.get(ip, 0) + 1",
      "",
      "# Grouping with setdefault",
      "by_os = {}",
      "for host, info in inventory.items():",
      "    by_os.setdefault(info['os'], []).append(host)",
    ],
    output: [
      "hosts  : ['web01', 'dc01']",
      "  web01  10.0.0.5   Linux",
      "  dc01   10.0.0.6   Windows",
      "",
      "settings: {'timeout': 30,",
      "  'retries': 5, 'verbose': True}",
      "",
      "hits per IP: {'10.0.0.5': 2,",
      "  '45.155.205.233': 3, '8.8.8.8': 1}",
      "  ALERT: 45.155.205.233 seen 3 times",
      "grouped by OS: {'Linux': ['web01'],",
      "  'Windows': ['dc01']}",
    ],
    watch: [
      "`.items()` gives key and value",
      "`get(k, 0) + 1` = count safely",
      "`setdefault(k, []).append()` = group",
    ],
    notes: "The counter and setdefault-grouping patterns are the two you will use most in log analysis. collections.Counter and defaultdict do the same with less code; worth mentioning as the next step.",
  });

  await d.tableSlide({
    title: "Dictionary Methods",
    sub: "The ones you reach for daily",
    head: ["Method", "Does", "Example"],
    colW: [2.1, 3.1, 3.8],
    fontSize: 10.5,
    rows: [
      ["`.get(k, default)`", "Look up without KeyError", "`d.get(ip, 0)`"],
      ["`.keys()` `.values()` `.items()`", "Views for looping", "`for k, v in d.items():`"],
      ["`.setdefault(k, d)`", "Get k, inserting default if absent", "`d.setdefault(ip, []).append(x)`"],
      ["`.update(other)`", "Merge another dict in", "`cfg.update(overrides)`"],
      ["`.pop(k, default)`", "Remove and return", "`d.pop(ip, None)`"],
      ["`in`", "Is this a key?", "`if ip in counts:`"],
      ["`len(d)`", "Number of pairs", "`len(sessions)`"],
      ["`dict(zip(a, b))`", "Build from two lists", "`dict(zip(ports, names))`"],
    ],
    belowY: 4.55,
    below: ["`max(d, key=d.get)` finds the key with the largest value: the busiest IP, the top talker, the most-hit URL."],
    notes: "max(d, key=d.get) is worth memorising for 'which key has the highest count'. The views from keys()/values()/items() are live: they reflect later changes to the dict.",
  });

  await d.demo({
    tag: "D3", name: "Words & Salaries", part: "Lab programs", file: "03_lab_dicts.py", codeW: 4.8,
    code: [
      "odd_words = {1: \"one\", 3: \"three\", 5: \"five\",",
      "             7: \"seven\", 9: \"nine\"}",
      "for num, word in odd_words.items():",
      "    print(f\"  {num} = {word}\")",
      "",
      "employees = {}",
      "n = int(input(\"How many employees? \"))",
      "for _ in range(n):",
      "    name = input(\"  Name   : \")",
      "    salary = int(input(\"  Salary : \"))",
      "    employees[name] = salary",
      "",
      "top = max(employees, key=employees.get)",
      "print(sum(employees.values()))",
    ],
    output: [
      "Odd-number words:",
      "  1 = one",
      "  3 = three",
      "  ...",
      "> How many employees? 2",
      "> Asha / 50000, Rahul / 72000",
      "Name         Salary",
      "Asha            50,000",
      "Rahul           72,000",
      "Highest paid: Rahul (72,000)",
      "Total payroll: 122,000",
    ],
    watch: [
      "Build a dict one entry per input",
      "`max(d, key=d.get)` = top earner",
      "`sum(d.values())` totals the values",
    ],
    notes: "The two syllabus lab programs. employees[name] = salary both adds and updates. Ask how to handle two employees with the same name (the second overwrites the first: a real data-quality issue).",
  });

  // Caesar cipher custom slide
  {
    const s = d.slide("The Caesar cipher shifts each letter a fixed number of places; ROT-13 shifts by 13. Because 13 + 13 = 26, applying ROT-13 twice returns the original, so one function both encodes and decodes. The syllabus expresses the key as a dictionary, which is exactly a substitution table. This is the classic 'how simple ciphers work' exercise - not real encryption (Session 20 covers that).");
    d.heading(s, "The Caesar Cipher as a Dictionary", "A substitution cipher is just a key -> value lookup");
    // the wheel idea, text explanation
    d.codePanel(s, { caption: "Build the ROT-13 key", fontSize: 10.5, lines: [
      "key = {}",
      "for i in range(26):",
      "    p = chr(ord('a') + i)",
      "    c = chr(ord('a') + (i + 13) % 26)",
      "    key[p] = c",
      "    key[p.upper()] = c.upper()",
      "",
      "# key['a'] -> 'n',  key['n'] -> 'a'",
    ] }, 0.5, 1.45, 4.5, 2.1);
    d.codePanel(s, { caption: "Translate with it", fontSize: 10.5, lines: [
      "def rot13(text):",
      "    out = \"\"",
      "    for ch in text:",
      "        out += key.get(ch, ch)",
      "    return out",
      "",
      "# non-letters pass through unchanged",
      "# encode and decode are the SAME call",
    ] }, 5.2, 1.45, 4.3, 2.1);
    const { tb } = require("./lib");
    s.addShape("roundRect", { x: 0.5, y: 3.75, w: 9, h: 1.35, fill: { color: C.navy }, line: { color: C.navy }, rectRadius: 0.08 });
    tb(s, [
      { text: "Secret:  ", options: { bold: true, color: C.coral } },
      { text: "Pnrfne pvcure? V zhpu cersre Pnrfne fnynq!", options: { fontFace: "Courier New", color: C.white, breakLine: true } },
      { text: "Decoded: ", options: { bold: true, color: C.teal } },
      { text: "Caesar cipher? I much prefer Caesar salad!", options: { fontFace: "Courier New", color: C.white, breakLine: true } },
      { text: "% 26 wraps z back to a; ", options: { color: C.codeComment } },
      { text: "codecs.encode(s, \"rot_13\")", options: { fontFace: "Courier New", color: C.white } },
      { text: " does the same.", options: { color: C.codeComment } },
    ], { x: 0.75, y: 3.95, w: 8.5, h: 1.0, fontSize: 11.5, valign: "middle", paraSpaceAfter: 4 });
  }

  await d.demo({
    tag: "D4", name: "ROT-13 Cipher", part: "Lab program", file: "04_rot13_cipher.py", codeW: 4.7,
    code: [
      "key = {}",
      "for i in range(26):",
      "    p = chr(ord('a') + i)",
      "    c = chr(ord('a') + (i + 13) % 26)",
      "    key[p] = c",
      "    key[p.upper()] = c.upper()",
      "",
      "def rot13(text):",
      "    result = \"\"",
      "    for ch in text:",
      "        result += key.get(ch, ch)",
      "    return result",
      "",
      "print(rot13(secret))",
    ],
    output: [
      "Original : Caesar cipher? I much",
      "  prefer Caesar salad!",
      "Encoded  : Pnrfne pvcure? V zhpu",
      "  cersre Pnrfne fnynq!",
      "Decoded  : Caesar cipher? I much",
      "  prefer Caesar salad! (same)",
      "",
      "Secret   : Pnrfne pvcure? ...",
      "Decoded  : Caesar cipher? I much",
      "  prefer Caesar salad!",
    ],
    watch: [
      "`key.get(ch, ch)` keeps punctuation",
      "Same function encodes and decodes",
      "A substitution cipher = a dict",
    ],
    notes: "The headline syllabus exercise. Stress that this is for understanding, not security: a substitution cipher is broken by frequency analysis in seconds. Real cryptography is Session 20.",
  });

  await d.demo({
    tag: "D5", name: "Brute-force Detector", part: "Mini project", file: "05_log_analysis.py", codeW: 5.1,
    code: [
      "events = [  # (time, ip, user, result)",
      "    (\"10:00\", \"45.155.205.233\", \"root\", \"FAIL\"), ... ]",
      "",
      "fails = {}",
      "for _, ip, _, result in events:",
      "    if result == \"FAIL\":",
      "        fails[ip] = fails.get(ip, 0) + 1",
      "",
      "for ip, n in sorted(fails.items(),",
      "        key=lambda kv: kv[1], reverse=True):",
      "    flag = \"  <-- brute force\" if n >= 3 else \"\"",
      "",
      "for ts, ip, user, result in events:",
      "    if result == \"OK\" and fails.get(ip, 0) >= 3:",
      "        print(f\"{user}@{ip} in AFTER {fails[ip]} fails\")",
    ],
    output: [
      "Failed logins per IP:",
      "  45.155.205.233   4  <-- brute force",
      "  203.0.113.9      1",
      "",
      "Usernames targeted:",
      "  45.155.205.233   admin, root",
      "  203.0.113.9      bob",
      "",
      "Possible compromises:",
      "  10:03  root@45.155.205.233 logged",
      "    in AFTER 4 failures",
    ],
    watch: [
      "Dict as a per-IP counter",
      "Sort items by value with a key",
      "Correlate fails + a later success",
    ],
    notes: "This is a real detection recipe: count failures per source, flag thresholds, then correlate a success after many failures as a likely compromise. All from dictionaries. The data is a hard-coded sample; Session 12 reads it from a file.",
  });

  await d.troubleshoot({
    items: [
      ["`KeyError: 'x'`", "The key isn't there. Use `.get(k, default)` or check `if k in d`."],
      ["`unhashable type: 'list'`", "A list can't be a key. Use a tuple, or a string."],
      ["Membership missed a value", "`in` tests keys. For values use `v in d.values()`."],
      ["`dict changed size during iteration`", "Don't add/remove while looping. Loop over `list(d)` or `d.copy()`."],
      ["Lost an entry unexpectedly", "Keys are unique; assigning an existing key overwrites it."],
      ["`'dict' object is not subscriptable` by index", "No `d[0]`. Dicts are keyed, not positional. Use a key."],
    ],
    notes: "The change-size-during-iteration error is common when cleaning a dict; iterate over a snapshot of the keys.",
  });

  await d.challenge({
    items: [
      { level: "EASY", head: "Word frequency", text: "Read a sentence and print how many times each word appears, most frequent first.", hint: "A dict counter, then `sorted(..., key=..., reverse=True)`." },
      { level: "MEDIUM", head: "Caesar shift N", text: "Generalise ROT-13 to any shift 0-25, with separate encode and decode functions.", hint: "`(i + shift) % 26` to encode, `- shift` to decode." },
      { level: "STRETCH", head: "Crack a Caesar cipher", text: "Given ciphertext, try all 25 shifts and pick the one where common English words appear.", hint: "Score each shift by counting words like 'the', 'and', 'is'." },
    ],
    notes: "Word frequency is on the self-learning list. Stretch is real cryptanalysis in miniature: brute-forcing a 25-key space and scoring plaintext, which is exactly how simple ciphers fall.",
  });

  await d.summary({
    built: [
      ["D1", "Lookup, get(), KeyError", "Create, access safely, add/update/delete"],
      ["D2", "Counters & Grouping", "items(), the counter and setdefault patterns"],
      ["D3", "Words & Salaries", "Lab programs"],
      ["D4", "ROT-13 Cipher", "A substitution cipher is a dictionary"],
      ["D5", "Brute-force Detector", "Count, threshold, correlate"],
    ],
    takeaways: [
      "Dicts map unique keys to values with instant lookup",
      "`.get(k, default)` avoids KeyError",
      "`get(k, 0) + 1` and `setdefault(k, []).append()` drive log analysis",
      "A substitution cipher is literally a key -> value dict",
    ],
    next: "Session 9: Functions: defining, parameters, arguments",
  });

  await d.save(out);
};

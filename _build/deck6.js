// Session 6: Lists - creating, operations, slicing, methods, comprehensions
const { Deck, C } = require("./lib");

module.exports = async function build(out) {
  const d = new Deck(6, "Lists");

  await d.titleSlide({
    title: "Lists: Ordered, Mutable Collections",
    subtitle: "Hold scan results, log lines, IPs and alerts in one place; sort, filter and deduplicate them.",
    flow: [
      ["FaThList", "Create", "Literals, list(), range()", C.coral],
      ["FaArrowsAltH", "Operate", "Join, slice, sort, aggregate", C.navy],
      ["FaTools", "Methods", "append, pop, remove, index", C.teal],
      ["FaFilter", "Comprehend", "Filter + transform in one line", C.coral],
    ],
    notes: "A list is the everyday container: a collection of items in order that you can change. Today we fill lists, reshape them, and meet the list comprehension, which replaces many small loops.",
  });

  await d.goalsAgenda({
    sub: "Theory with a live demo after every concept",
    goals: [
      ["FaThList", "Create and index lists; use their mutability"],
      ["FaArrowsAltH", "Join, repeat, slice, copy and sort"],
      ["FaTools", "Use list methods; model a stack and a queue"],
      ["FaFilter", "Write list comprehensions to filter logs"],
    ],
    agenda: [
      "Creating & accessing lists",
      "D1  Create, index, mutate",
      "Operations: join, slice, sort",
      "D2  Copy, sort, aggregate",
      "List methods",
      "D3  Stacks, queues, dedupe",
      "D4  Lab: greatest, delete, odd sum",
      "D5  List comprehensions",
      "Troubleshooting & challenge",
    ],
    notes: "D4 is the syllabus lab set. D5's comprehensions are not strictly in the syllabus but repay the time many times over in later sessions.",
  });

  await d.iconRows({
    title: "Creating & Accessing Lists",
    sub: "An ordered, mutable sequence of any objects",
    rows: [
      { icon: "FaThList", color: C.coral, head: "Literals and `list()`", text: "`[22, 80, 443]`, `list(\"abc\")`, `list(range(5))`, `[]` for empty." },
      { icon: "FaHashtag", color: C.navy, head: "Index and slice", text: "`ports[0]`, `ports[-1]`, `ports[1:3]`. Same rules as strings." },
      { icon: "FaPen", color: C.teal, head: "Mutable", text: "`ports[0] = 21` and even `ports[1:3] = [...]` work in place." },
      { icon: "FaLayerGroup", color: C.purple, head: "Mixed types allowed", text: "`[\"10.0.0.5\", 443, True, None]` is legal, though usually you keep one kind." },
    ],
    panel: { caption: "Create and access", fontSize: 11, lines: [
      "ports = [22, 80, 443, 3389]",
      "ports[0]        # 22",
      "ports[-1]       # 3389",
      "ports[1:3]      # [80, 443]",
      "len(ports)      # 4",
      "",
      "ports[0] = 21           # mutate",
      "ports[1:3] = [8080, 8443]",
    ] },
    notes: "Contrast with strings (immutable): a list lets you change elements in place. That power comes with the aliasing trap from Session 2, revisited in D2.",
  });

  await d.demo({
    tag: "D1", name: "Create, Index, Mutate", file: "01_create_access.py",
    code: [
      "ports = [22, 80, 443, 3389]",
      "chars = list(\"GET\")          # ['G', 'E', 'T']",
      "nums = list(range(1, 6))      # [1, 2, 3, 4, 5]",
      "mixed = [\"10.0.0.5\", 443, True, None]",
      "",
      "print(\"First :\", ports[0])",
      "print(\"Last  :\", ports[-1])",
      "print(\"Slice :\", ports[1:3])",
      "",
      "ports[0] = 21                 # change in place",
      "ports[1:3] = [8080, 8443]     # replace a slice",
      "",
      "open_now = [22, 80]",
      "for p in [21, 22, 80, 445]:",
      "    print(f\"Port {p:>4}: \"",
      "          f\"{'OPEN' if p in open_now else 'closed'}\")",
    ],
    output: [
      "[22, 80, 443, 3389]",
      "['G', 'E', 'T']",
      "[1, 2, 3, 4, 5]",
      "First : 22",
      "Last  : 3389",
      "Slice : [80, 443]",
      "After slice replace:",
      "  [21, 8080, 8443, 3389]",
      "Port   21: closed",
      "Port   22: OPEN",
      "Port   80: OPEN",
      "Port  445: closed",
    ],
    watch: [
      "`list(\"GET\")` splits into characters",
      "A slice can be assigned to",
    ],
    notes: "Output trimmed. Replacing a slice can change the list's length: ports[1:3] = [1,2,3] grows it. Handy, occasionally surprising.",
  });

  await d.demo({
    tag: "D2", name: "Copy, Sort, Aggregate", file: "02_operations.py", codeW: 5.0,
    code: [
      "all_hosts = internal + external     # new list",
      "buffer = [0] * 5                    # [0,0,0,0,0]",
      "",
      "backup = all_hosts[:]               # shallow COPY",
      "backup.append(\"192.168.1.1\")",
      "# all_hosts is unchanged",
      "",
      "latencies = [42, 7, 128, 15, 3]",
      "print(sorted(latencies))            # new, sorted",
      "latencies.sort(reverse=True)        # in place",
      "",
      "ips = [\"10.0.0.20\", \"10.0.0.3\", \"10.0.0.100\"]",
      "print(sorted(ips))                  # string order!",
      "",
      "print(min(latencies), max(latencies), sum(latencies))",
    ],
    output: [
      "Joined: ['10.0.0.5', '10.0.0.6',",
      "  '8.8.8.8', '1.1.1.1']",
      "Repeat: [0, 0, 0, 0, 0]",
      "backup adds a host; original intact",
      "sorted() (new) : [3, 7, 15, 42, 128]",
      "after .sort()  : [128, 42, 15, 7, 3]",
      "string sort    : ['10.0.0.100',",
      "  '10.0.0.20', '10.0.0.3']",
      "min/max/sum: 3 128 195",
    ],
    watch: [
      "`sorted()` returns new; `.sort()` is in place",
      "`[:]` copies so the original is safe",
      "IPs sort as **text**, not numbers",
    ],
    notes: "The string-sort gotcha matters: '10.0.0.100' < '10.0.0.20' alphabetically. To sort IPs correctly, convert with ipaddress.ip_address as the sort key (Session 16).",
  });

  await d.tableSlide({
    title: "List Methods",
    sub: "Most change the list in place and return None",
    head: ["Method", "Does", "Example"],
    colW: [1.9, 3.1, 4.0],
    fontSize: 10.5,
    rows: [
      ["`.append(x)`", "Add one item at the end", "`alerts.append(\"scan\")`"],
      ["`.extend(xs)`", "Add several items", "`alerts.extend([a, b])`"],
      ["`.insert(i, x)`", "Add at a position", "`alerts.insert(0, \"urgent\")`"],
      ["`.remove(x)`", "Delete first matching value", "`alerts.remove(\"scan\")`"],
      ["`.pop([i])`", "Remove and return (last, or i)", "`job = queue.pop(0)`"],
      ["`.index(x)`", "Position of first match", "`log.index(\"POST\")`"],
      ["`.count(x)`", "How many times x appears", "`log.count(\"GET\")`"],
      ["`.sort()` `.reverse()`", "Reorder in place", "`nums.sort(reverse=True)`"],
      ["`.clear()`", "Remove everything", "`alerts.clear()`"],
    ],
    belowY: 4.7,
    below: ["`append` + `pop()` make a **stack** (last in, first out); `append` + `pop(0)` make a **queue** (first in, first out)."],
    notes: "Because these return None, x = mylist.sort() is a classic bug: x becomes None. Call sorted(mylist) when you want a value back.",
  });

  await d.demo({
    tag: "D3", name: "Stacks, Queues, Dedupe", file: "03_methods.py",
    code: [
      "alerts.append(\"port scan\")",
      "alerts.extend([\"malware hash\", \"bad login\"])",
      "alerts.insert(0, \"CRITICAL: exfiltration\")",
      "",
      "alerts.remove(\"port scan\")      # by value",
      "first = alerts.pop(0)            # by index, returns it",
      "",
      "# Stack (LIFO): append / pop",
      "undo.append(\"rule2\")",
      "undo.pop()                      # 'rule2'",
      "",
      "# Queue (FIFO): append / pop(0)",
      "queue.pop(0)                    # 'job1'",
      "",
      "unique = []",
      "for ip in seen_ips:",
      "    if ip not in unique:",
      "        unique.append(ip)",
    ],
    output: [
      "Alerts: ['CRITICAL: exfiltration',",
      "  'port scan', 'malware hash',",
      "  'bad login']",
      "index of 'bad login': 3",
      "GET count: 3",
      "handled first: CRITICAL: exfiltration",
      "remaining: ['malware hash',",
      "  'bad login']",
      "undo last change: rule2",
      "process next   : job1",
      "unique IPs: ['1.1.1.1', '8.8.8.8',",
      "  '9.9.9.9']",
    ],
    watch: [
      "`pop()` returns the item it removes",
      "The dedupe keeps first-seen order",
    ],
    notes: "The dedupe loop is O(n^2) because 'in' scans the list each time; for big data use a set (Session 8), which keeps lookups fast. Mention that dict.fromkeys(seq) also dedupes while keeping order.",
  });

  await d.demo({
    tag: "D4", name: "Greatest, Delete, Odd Sum", part: "Lab programs", file: "04_lab_list_programs.py", codeW: 4.9,
    code: [
      "raw = input(\"Enter numbers: \").split()",
      "numbers = [int(x) for x in raw]",
      "",
      "greatest = numbers[0]",
      "for n in numbers[1:]:",
      "    if n > greatest:",
      "        greatest = n",
      "",
      "target = int(input(\"Value to delete: \"))",
      "cleaned = [n for n in numbers if n != target]",
      "",
      "odd_sum = 0",
      "for n in numbers:",
      "    if n % 2 == 1:",
      "        odd_sum += n",
    ],
    output: [
      "> Enter numbers: 4 9 2 9 7 1 9 6",
      "List: [4, 9, 2, 9, 7, 1, 9, 6]",
      "Greatest: 9  (max() agrees: 9 )",
      "> Value to delete: 9",
      "After deleting 9: [4, 2, 7, 1, 6]",
      "Sum of odd numbers: 35",
    ],
    watch: [
      "`[int(x) for x in raw]` parses input",
      "Deleting ALL matches = a filter",
    ],
    notes: "The three syllabus lab programs. Note the idiom for 'delete all occurrences': build a new filtered list, rather than removing inside a loop (which skips items). max() is the real-world answer for 'greatest'.",
  });

  await d.twoPanels({
    title: "List Comprehensions",
    sub: "Build a new list by transforming and filtering another, in one line",
    left: { caption: "The pattern", fontSize: 10.5, lines: [
      "# [ expr  for item in iterable  if cond ]",
      "",
      "squares = [n*n for n in range(1, 6)]",
      "# [1, 4, 9, 16, 25]",
      "",
      "codes = [int(l.split()[0])",
      "         for l in log_lines]",
      "",
      "errors = [l for l in log_lines",
      "          if int(l.split()[0]) >= 400]",
    ] },
    right: { caption: "vs the long form", fontSize: 10.5, lines: [
      "squares = []",
      "for n in range(1, 6):",
      "    squares.append(n * n)",
      "",
      "# Same result, four lines",
      "",
      "# Nested: two subnets",
      "[f\"10.0.{net}.{h}\"",
      " for net in (1, 2)",
      " for h in range(1, 3)]",
    ] },
    below: "Read it as 'give me `expr` for each `item`, keeping only those where `cond`'. Clear for simple maps and filters; use a real loop when logic gets complex.",
    notes: "Comprehensions are everywhere in Python security tooling. Don't overuse them: if you need nested conditions or side effects, a plain loop reads better.",
  });

  await d.demo({
    tag: "D5", name: "Filtering Logs", file: "05_comprehensions.py", codeW: 5.0,
    code: [
      "log_lines = [\"200 GET /index.html\",",
      "             \"404 GET /secret\",",
      "             \"500 GET /api/users\",",
      "             \"403 GET /admin\"]",
      "",
      "codes = [int(line.split()[0]) for line in log_lines]",
      "",
      "errors = [line for line in log_lines",
      "          if int(line.split()[0]) >= 400]",
      "",
      "paths_with_errors = [line.split()[2]",
      "    for line in log_lines",
      "    if int(line.split()[0]) >= 400]",
    ],
    output: [
      "Status codes:",
      "  [200, 404, 200, 500, 403]",
      "",
      "Error responses:",
      "   404 GET /secret",
      "   500 GET /api/users",
      "   403 GET /admin",
      "",
      "Paths that errored:",
      "  ['/secret', '/api/users',",
      "   '/admin']",
    ],
    watch: [
      "Transform: one value per line",
      "Filter: keep lines matching `cond`",
      "Both at once: transform + `if`",
    ],
    notes: "This is real log triage: extract status codes, keep the errors, list the URLs attackers probed. 403/404 bursts on /admin and /secret are a scanning signature.",
  });

  await d.troubleshoot({
    items: [
      ["`x = mylist.sort()` makes x None", "`.sort()` sorts in place and returns None. Use `sorted(mylist)` for a value."],
      ["Two lists change together", "`b = a` aliases. Copy with `a[:]`, `a.copy()` or `list(a)`."],
      ["`IndexError: list index out of range`", "Index past the end. Check `len()`; slices are safe."],
      ["`.remove(x)` raises ValueError", "x isn't in the list. Guard with `if x in mylist:` first."],
      ["Items skipped when removing in a loop", "Removing shifts indexes. Build a new list with a comprehension."],
      ["IPs sort in the wrong order", "They sort as text. Use a key: `sorted(ips, key=ipaddress.ip_address)`."],
    ],
    notes: "The alias and remove-in-loop bugs are the two that cost real debugging time.",
  });

  await d.challenge({
    items: [
      { level: "EASY", head: "Second largest", text: "Read numbers and print the second-largest distinct value without using sort().", hint: "Track the top two as you loop, or use `set` then `max` twice." },
      { level: "MEDIUM", head: "Top talkers", text: "Given a list of source IPs, print the three that appear most often, with counts.", hint: "`collections.Counter(ips).most_common(3)`." },
      { level: "STRETCH", head: "Flatten & sort ports", text: "Given a list of per-host port lists, produce one sorted list of unique ports across all hosts.", hint: "Nested comprehension into a `set`, then `sorted`." },
    ],
    notes: "Medium introduces collections.Counter, which students will reach for constantly in log analysis. Stretch combines comprehensions, sets and sorting.",
  });

  await d.summary({
    built: [
      ["D1", "Create, Index, Mutate", "Literals, `list()`, slicing, in-place edits"],
      ["D2", "Copy, Sort, Aggregate", "`+`, `[:]`, `sorted`/`sort`, min/max/sum"],
      ["D3", "Stacks, Queues, Dedupe", "append, pop, remove, index, count"],
      ["D4", "Greatest, Delete, Odd Sum", "Lab programs"],
      ["D5", "Filtering Logs", "List comprehensions"],
    ],
    takeaways: [
      "Lists are ordered and mutable; index and slice like strings",
      "`sorted()` returns new; `.sort()` changes in place",
      "Copy with `[:]` to avoid the aliasing trap",
      "Comprehensions filter and transform in one readable line",
    ],
    next: "Session 7: Nested & 2D lists, and tuples (methods, unpacking)",
  });

  await d.save(out);
};

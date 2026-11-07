// Session 10: return values, variable scope, argument mutability, recursion, lambda
const { Deck, C } = require("./lib");

module.exports = async function build(out) {
  const d = new Deck(10, "Functions, Part 2");

  await d.titleSlide({
    title: "Return Values, Scope and Recursion",
    subtitle: "What a function hands back, what it can see and change, and how it can call itself.",
    flow: [
      ["FaUndo", "return", "One value or many", C.coral],
      ["FaLayerGroup", "Scope", "Local, global, LEGB", C.navy],
      ["FaExchangeAlt", "Mutability", "What a callee can change", C.teal],
      ["FaSync", "Recursion", "A function that calls itself", C.coral],
    ],
    notes: "Session 9 built and called functions. Now the deeper half: what return really does, where variables live, which arguments a function can modify, and recursion plus lambda. These explain the subtle bugs beginners hit.",
  });

  await d.goalsAgenda({
    sub: "Theory with a live demo after every concept",
    goals: [
      ["FaUndo", "Return one or several values; use early returns"],
      ["FaLayerGroup", "Explain local vs global scope and LEGB"],
      ["FaExchangeAlt", "Predict what a function can change in place"],
      ["FaSync", "Write recursion; pass functions as data (lambda)"],
    ],
    agenda: [
      "Return values",
      "D1  One value, many, early return",
      "Variable scope",
      "D2  Local, global, LEGB",
      "Argument mutability",
      "D3  What a callee can change",
      "D4  Lab: overlap, longest, filter",
      "D5  Recursion & lambda",
      "Troubleshooting & challenge",
    ],
    notes: "D4 is the syllabus lab set (overlapping, find_longest_word, filter_long_words).",
  });

  await d.iconRows({
    title: "Return Values",
    sub: "How a function hands a result back to its caller",
    rows: [
      { icon: "FaUndo", color: C.coral, head: "`return value`", text: "Ends the function and gives the value back to be used in an expression." },
      { icon: "FaCubes", color: C.navy, head: "Return several values", text: "`return host, port` returns a tuple; the caller unpacks it." },
      { icon: "FaShieldAlt", color: C.teal, head: "Early return as a guard", text: "`if bad: return \"invalid\"` handles edge cases first, keeping code flat." },
      { icon: "FaBan", color: C.purple, head: "No return = None", text: "A function that only prints returns `None`. Don't use its result by mistake." },
    ],
    panel: { caption: "Return styles", fontSize: 10.5, lines: [
      "def classify_port(port):",
      "    if port < 1024:",
      "        return \"well-known\"",
      "    return \"high\"",
      "",
      "def parse(text):",
      "    host, _, port = text.partition(\":\")",
      "    return host, int(port)   # a tuple",
      "",
      "host, port = parse(\"10.0.0.5:443\")",
    ] },
    notes: "Early returns (guard clauses) are cleaner than deeply nested if/else. Returning a tuple is Python's way to hand back several results at once.",
  });

  await d.demo({
    tag: "D1", name: "One, Many, Early Return", file: "01_return_values.py", codeW: 5.0,
    code: [
      "def classify_port(port):",
      "    if not isinstance(port, int):",
      "        return \"invalid\"            # guard",
      "    if port < 0 or port > 65535:",
      "        return \"out of range\"",
      "    if port < 1024:",
      "        return \"well-known\"",
      "    return \"high\"",
      "",
      "def parse_hostport(text):",
      "    host, _, port = text.partition(\":\")",
      "    return host, int(port) if port else None",
      "",
      "host, port = parse_hostport(\"10.0.0.5:443\")",
      "def noop(): pass        # returns None",
    ],
    output: [
      "     22 -> well-known",
      "   8080 -> high",
      "  70000 -> out of range",
      "    'x' -> invalid",
      "",
      "host: 10.0.0.5 | port: 443",
      "first open: 22",
      "noop() returns: None",
    ],
    watch: [
      "Each guard returns and stops",
      "`return host, port` is a tuple",
      "`pass` / no return gives None",
    ],
    notes: "classify_port returns as soon as it knows the answer, so no else is needed. isinstance checks the type before comparing, avoiding a TypeError on the string input.",
  });

  await d.twoPanels({
    title: "Variable Scope: LEGB",
    sub: "Where a name is looked up: Local, Enclosing, Global, Built-in",
    left: { caption: "Locals vanish after the call", fontSize: 10.5, lines: [
      "MAX_RETRIES = 3        # global",
      "",
      "def attempt(label):",
      "    tries = 0          # local",
      "    while tries < MAX_RETRIES:",
      "        tries += 1     # reads global OK",
      "    return tries",
      "",
      "attempt(\"ssh\")",
      "print(tries)   # NameError",
    ] },
    right: { caption: "Reassigning a global", fontSize: 10.5, lines: [
      "alert_count = 0",
      "",
      "def bad(msg):",
      "    alert_count += 1   # UnboundLocal!",
      "",
      "def good(msg):",
      "    global alert_count",
      "    alert_count += 1   # OK now",
      "",
      "# Better: return the new value",
      "# and let the caller keep it",
    ] },
    below: "Reading a global inside a function is fine; **reassigning** one needs `global`. Prefer passing values in and returning them out over hidden global state.",
    notes: "The UnboundLocalError is subtle: assigning anywhere in a function makes the name local for the whole function, so the += reads a local that doesn't exist yet. Globals make security tools hard to test; pure functions (in, out, no side effects) are easier to reason about.",
  });

  await d.demo({
    tag: "D2", name: "Local, Global, LEGB", file: "02_scope.py", codeW: 4.9,
    code: [
      "def raise_alert_BAD(msg):",
      "    alert_count = alert_count + 1   # local!",
      "    return alert_count",
      "try:",
      "    raise_alert_BAD(\"scan\")",
      "except UnboundLocalError as err:",
      "    print(\"UnboundLocalError:\", err)",
      "",
      "def raise_alert(msg):",
      "    global alert_count",
      "    alert_count += 1",
      "    return alert_count",
      "",
      "# pure alternative: pass count in, return it",
      "def raise_alert_pure(count, msg):",
      "    return count + 1",
    ],
    output: [
      "ssh: gave up after 3",
      "UnboundLocalError: cannot access",
      "  local variable 'alert_count'",
      "  where it is not associated",
      "  with a value",
      "",
      "raise_alert: 1",
      "raise_alert: 2",
      "alert_count now: 2",
      "pure counter: 2",
      "LEGB lookup: enclosing",
    ],
    watch: [
      "Assigning makes a name local",
      "`global` to reassign module state",
      "Prefer pure: in -> out, no globals",
    ],
    notes: "Show both: the broken version raising UnboundLocalError, and the fix. Then the pure version, which needs no global at all and is easier to test.",
  });

  await d.demo({
    tag: "D3", name: "What a Callee Can Change", file: "03_mutability.py", codeW: 5.0,
    code: [
      "def try_to_change(n, text):     # immutable args",
      "    n += 100",
      "    text += \" MODIFIED\"         # rebinds locally only",
      "    return n, text",
      "try_to_change(count, label)     # caller unchanged",
      "",
      "def add_port(port_list, port):  # mutable arg",
      "    port_list.append(port)      # changes caller's list!",
      "add_port(ports, 443)            # ports is now [22,80,443]",
      "",
      "def normalise(ips):             # the safe pattern",
      "    return [ip.strip().lower() for ip in ips]  # new list",
      "",
      "def wipe(secret):               # bytearray is mutable",
      "    for i in range(len(secret)): secret[i] = 0",
    ],
    output: [
      "Immutable args unchanged: 1 scan",
      "Mutable arg changed:",
      "  [22, 80, 443]",
      "",
      "original still raw:",
      "  [' 10.0.0.5 ', '8.8.8.8\\n']",
      "returned cleaned  :",
      "  ['10.0.0.5', '8.8.8.8']",
      "",
      "wiped key: b'\\x00\\x00\\x00",
      "  \\x00\\x00\\x00'",
    ],
    watch: [
      "Immutable args: caller is safe",
      "Mutable args: callee can change them",
      "Return a new object to be safe",
    ],
    notes: "Key mental model: the function gets a reference to the SAME object. Rebinding (n += 100) makes a new local binding; mutating (.append) changes the shared object. Wiping a bytearray is how real tools scrub secrets from memory.",
  });

  await d.demo({
    tag: "D4", name: "Overlap, Longest, Filter", part: "Lab programs", file: "04_lab_word_functions.py",
    code: [
      "def overlapping(a, b):",
      "    for item in a:",
      "        if item in b:",
      "            return True       # found one: done",
      "    return False",
      "",
      "def find_longest_word(words):",
      "    longest = 0",
      "    for w in words:",
      "        if len(w) > longest:",
      "            longest = len(w)",
      "    return longest",
      "",
      "def filter_long_words(words, n):",
      "    return [w for w in words if len(w) > n]",
    ],
    output: [
      "overlapping([1,2,3],[4,5,2]): True",
      "overlapping([1,2,3],[4,5,6]): False",
      "",
      "longest word length: 14",
      "longer than 3: ['firewall',",
      "  'encryption', 'authentication']",
      "actual longest word:",
      "  authentication",
    ],
    watch: [
      "`overlapping` returns early on a match",
      "`filter_long_words` is a comprehension",
      "`max(words, key=len)` finds the word",
    ],
    notes: "The three syllabus function labs. overlapping returns True the moment it finds a shared member, without checking the rest. find_longest_word returns a length; max(words, key=len) returns the word itself.",
  });

  await d.demo({
    tag: "D5", name: "Recursion & lambda", file: "05_recursion_lambda.py", codeW: 5.0,
    code: [
      "def factorial(n):",
      "    if n <= 1:              # base case",
      "        return 1",
      "    return n * factorial(n - 1)   # recursive case",
      "",
      "def total_size(path):       # recurse over subfolders",
      "    if os.path.isfile(path):",
      "        return os.path.getsize(path)",
      "    return sum(total_size(os.path.join(path, e))",
      "               for e in os.listdir(path))",
      "",
      "by_port = sorted(conns, key=lambda c: c[1])",
      "suspicious = list(filter(lambda p: p > 1024, ports))",
    ],
    output: [
      "factorial(5): 120",
      "Bytes in this demo folder: 7,499",
      "",
      "double(21): 42",
      "sorted by port:",
      "  [('10.0.0.6', 22),",
      "   ('10.0.0.5', 443),",
      "   ('10.0.0.7', 4444)]",
      "filter >1024: [4444, 31337]",
    ],
    watch: [
      "Every recursion needs a base case",
      "Trees (folders) fit recursion",
      "`lambda` = a tiny inline function",
    ],
    notes: "Recursion needs a base case or it hits Python's recursion limit (~1000). A filesystem is tree-shaped, so a recursive walk is natural (os.walk does this iteratively; Session 11). lambda is used mainly as a key= or with filter/map.",
  });

  await d.troubleshoot({
    items: [
      ["`UnboundLocalError`", "You reassign a global in a function. Add `global x`, or pass and return it."],
      ["Function result is `None`", "Missing `return`. The function only printed its result."],
      ["Caller's list changed unexpectedly", "You mutated a mutable argument. Work on a copy, return new."],
      ["`RecursionError`", "No base case, or input too deep. Add a stop condition or use a loop."],
      ["`NameError` after the call", "Locals don't exist outside. `return` the value you need."],
      ["`SyntaxError` in a lambda", "Lambdas hold one expression, no statements. Use `def` instead."],
    ],
    notes: "UnboundLocalError and the mutated-argument surprise are the two scope/mutability bugs that cost the most time.",
  });

  await d.challenge({
    items: [
      { level: "EASY", head: "Sum of digits (recursive)", text: "Write a recursive function that returns the sum of a number's digits.", hint: "`n % 10 + digit_sum(n // 10)`, base case `n == 0`." },
      { level: "MEDIUM", head: "Flatten nested lists", text: "Write a recursive function that flattens a list that may contain sub-lists to any depth.", hint: "If an item is a list, recurse; else append it." },
      { level: "STRETCH", head: "Sort findings", text: "Given findings as (severity, title) tuples, sort by severity high-to-low, then title A-Z, with one `sorted` key.", hint: "`key=lambda f: (-f[0], f[1])`." },
    ],
    notes: "Stretch shows sorting by several fields with a lambda returning a tuple, and negating for descending order.",
  });

  await d.summary({
    built: [
      ["D1", "Return Values", "One, many (tuple), early-return guards"],
      ["D2", "Scope & LEGB", "Local vs global, the UnboundLocal trap"],
      ["D3", "Argument Mutability", "Immutable safe, mutable changeable"],
      ["D4", "Overlap, Longest, Filter", "Lab programs"],
      ["D5", "Recursion & lambda", "Base cases, functions as data"],
    ],
    takeaways: [
      "`return` hands back one value or a tuple of several",
      "Reassigning a global needs `global`; prefer pure functions",
      "A callee can change mutable arguments in place",
      "Recursion needs a base case; `lambda` is a one-expression function",
    ],
    next: "Session 11: Modules, packages, and the standard library",
  });

  await d.save(out);
};

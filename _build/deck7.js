// Session 7: Nested & 2D lists, tuples, unpacking
const { Deck, C } = require("./lib");

module.exports = async function build(out) {
  const d = new Deck(7, "Nested Lists & Tuples");

  await d.titleSlide({
    title: "Nested Lists, Grids and Tuples",
    subtitle: "Model tables of data, keep fixed records safe from change, and unpack values cleanly.",
    flow: [
      ["FaTable", "2D lists", "Rows and columns of data", C.coral],
      ["FaLock", "Tuples", "Fixed, immutable records", C.navy],
      ["FaKey", "As keys", "Tuples index dicts and sets", C.teal],
      ["FaExchangeAlt", "Unpack", "Pull a record into variables", C.coral],
    ],
    notes: "Scan results, connection tables and packet summaries are naturally tables: lists of rows. Tuples give us a fixed record that can't be edited by accident, and unpacking makes reading those records clean.",
  });

  await d.goalsAgenda({
    sub: "Theory with a live demo after every concept",
    goals: [
      ["FaTable", "Build and index nested / 2D lists"],
      ["FaLock", "Create tuples and use their immutability"],
      ["FaKey", "Use tuples as dictionary keys"],
      ["FaExchangeAlt", "Unpack tuples, including starred unpacking"],
    ],
    agenda: [
      "Nested & 2D lists",
      "D1  A scan table & a grid",
      "Tuples",
      "D2  Immutable records",
      "Unpacking",
      "D3  Swap, star, multi-return",
      "D4  Lab: Fibonacci, min/max",
      "D5  Connection-table summary",
      "Troubleshooting & challenge",
    ],
    notes: "D4 is the syllabus lab set for tuples.",
  });

  await d.iconRows({
    title: "Nested & 2D Lists",
    sub: "A list whose items are themselves lists: rows and columns",
    rows: [
      { icon: "FaTable", color: C.coral, head: "A list of rows", text: "`scan = [[\"10.0.0.5\", 22, \"open\"], ...]` is a table." },
      { icon: "FaHashtag", color: C.navy, head: "Double indexing", text: "`scan[0][1]` is row 0, column 1. First index the row, then the column." },
      { icon: "FaRedo", color: C.teal, head: "Iterate rows", text: "`for host, port, state in scan:` walks and unpacks each row." },
      { icon: "FaExclamationTriangle", color: C.purple, head: "The `* ` trap", text: "`[[0]*3]*3` shares one row. Use a comprehension for independent rows." },
    ],
    panel: { caption: "2D access", fontSize: 10.5, lines: [
      "grid = [[1, 2, 3],",
      "        [4, 5, 6],",
      "        [7, 8, 9]]",
      "grid[1][2]        # 6",
      "",
      "# WRONG: three shared rows",
      "bad = [[0]*3] * 3",
      "# RIGHT: fresh row each time",
      "good = [[0]*3 for _ in range(3)]",
    ] },
    notes: "The shared-row trap is a genuine, painful bug: editing bad[0][0] changes all three rows because they are the same object. The comprehension builds a new inner list each iteration.",
  });

  await d.demo({
    tag: "D1", name: "A Scan Table & a Grid", file: "01_nested_2d.py",
    code: [
      "scan = [",
      "    [\"10.0.0.5\", 22, \"open\"],",
      "    [\"10.0.0.5\", 80, \"open\"],",
      "    [\"10.0.0.6\", 22, \"closed\"],",
      "]",
      "print(\"Row 0 port:\", scan[0][1])",
      "",
      "for host, port, state in scan:",
      "    if state == \"open\":",
      "        print(f\"  {host}:{port}\")",
      "",
      "print([grid[i][i] for i in range(len(grid))])",
      "",
      "bad = [[0] * 3] * 3       # rows shared!",
      "bad[0][0] = 99",
      "good = [[0] * 3 for _ in range(3)]",
      "good[0][0] = 99",
    ],
    output: [
      "First row : ['10.0.0.5', 22, 'open']",
      "Row 0 port: 22",
      "Open services:",
      "  10.0.0.5:22",
      "  10.0.0.5:80",
      "Diagonal: [1, 5, 9]",
      "Wrong (rows shared):",
      "  [[99,0,0],[99,0,0],[99,0,0]]",
      "Right (independent):",
      "  [[99,0,0],[0,0,0],[0,0,0]]",
    ],
    watch: [
      "`scan[0][1]`: row then column",
      "Unpack each row in the `for`",
      "`*` shares the inner list",
    ],
    notes: "Walk the shared-row output slowly: one assignment changed all three rows in 'bad'. This is the single most common 2D-list mistake.",
  });

  await d.demo({
    tag: "D2", name: "Immutable Records", file: "02_tuples.py", codeW: 4.8,
    code: [
      "endpoint = (\"10.0.0.5\", 443)   # a (host, port) record",
      "one = (42,)                    # one item NEEDS the comma",
      "not_a_tuple = (42)             # just the int 42",
      "rgb = 255, 128, 0              # parens optional",
      "",
      "try:",
      "    endpoint[1] = 8443         # immutable",
      "except TypeError as err:",
      "    print(\"TypeError:\", err)",
      "",
      "flags = (\"SYN\", \"ACK\", \"SYN\", \"FIN\")",
      "print(flags.count(\"SYN\"), flags.index(\"FIN\"))",
      "",
      "seen = {}",
      "seen[(\"10.0.0.5\", 22)] = \"ssh\"   # tuple as dict key",
    ],
    output: [
      "endpoint: ('10.0.0.5', 443)",
      "one: (42,) | (42) is: int",
      "rgb: (255, 128, 0)",
      "TypeError: 'tuple' object does",
      "  not support item assignment",
      "",
      "count('SYN'): 2   index('FIN'): 3",
      "",
      "service map:",
      "  {('10.0.0.5', 22): 'ssh'}",
      "look up: ssh",
    ],
    watch: [
      "`(42,)` is a tuple; `(42)` is an int",
      "Tuples can't be edited",
      "Only immutable things can be dict keys",
    ],
    notes: "The missing-comma bug is real: (42) is just 42 in parentheses. A (host, port) tuple as a dict key is the natural way to map a connection to a service; a list can't do this because it's unhashable.",
  });

  await d.cards3({
    title: "List vs Tuple: When to Use Which",
    sub: "Same indexing and slicing; the difference is mutability and intent",
    cards: [
      { icon: "FaThList", color: C.teal, head: "Use a list", body: ["Items of the **same kind**", "A collection that **grows or shrinks**", "Scan results, log lines, a queue", "`[22, 80, 443]`"] },
      { icon: "FaLock", color: C.coral, head: "Use a tuple", body: ["A **fixed record** of related fields", "Returning **several values**", "A **dict key** or **set** member", "`(\"10.0.0.5\", 443)`"] },
      { icon: "FaBalanceScale", color: C.navy, head: "Practical effects", body: ["Slightly smaller and faster", "Prevents accidental edits", "Signal 'this won't change'", "Convert: `list(t)` / `tuple(l)`"] },
    ],
    below: [
      "**Rule of thumb:** list = a sequence of similar things; tuple = one thing with several parts. A row returned from a database is a tuple; a table of rows is a list.",
    ],
    notes: "The semantic difference matters more than performance. Reaching for a tuple tells the next reader 'these fields belong together and won't change'.",
  });

  await d.demo({
    tag: "D3", name: "Swap, Star, Multi-return", file: "03_unpacking.py",
    code: [
      "host, port = (\"10.0.0.5\", 443)",
      "",
      "a, b = b, a                  # swap, no temp",
      "",
      "first, *rest = [10, 0, 0, 5]",
      "*head, last = [10, 0, 0, 5]",
      "",
      "def min_max_avg(values):",
      "    return min(values), max(values), sum(values)/len(values)",
      "",
      "lo, hi, avg = min_max_avg([42, 7, 128, 15, 3])",
      "",
      "for port, name in services.items():",
      "    ...",
      "for i, letter in enumerate(\"AB\", start=1):",
      "    ...",
      "for ip, status in zip(ips, states):",
      "    ...",
    ],
    output: [
      "host: 10.0.0.5 | port: 443",
      "swapped: 2 1",
      "first: 10 | rest: [0, 0, 5]",
      "*head, last -> last: 5",
      "",
      "lo=3 hi=128 avg=39.0",
      "  22 -> ssh",
      "  80 -> http",
      "  1:A",
      "  2:B",
      "  10.0.0.5 is up",
      "  10.0.0.6 is down",
    ],
    watch: [
      "Swap is tuple pack + unpack",
      "`*rest` grabs the leftover items",
      "`items`/`enumerate`/`zip` yield tuples",
    ],
    notes: "The loops students already use were handing out tuples all along. A function returns several values by returning a tuple, which the caller unpacks: return min, max, avg.",
  });

  await d.demo({
    tag: "D4", name: "Fibonacci Tuple, Min/Max", part: "Lab programs", file: "04_lab_tuples.py",
    code: [
      "fib = []",
      "a, b = 0, 1",
      "for _ in range(9):",
      "    fib.append(a)",
      "    a, b = b, a + b",
      "fib = tuple(fib)          # freeze it",
      "",
      "values = (42, 7, 128, 15, 3, 99)",
      "print(\"Min:\", min(values))",
      "print(\"Max:\", max(values))",
      "print(\"Sum:\", sum(values))",
      "",
      "# No .append on a tuple; build a new one",
      "values = values + (256,)",
    ],
    output: [
      "First 9 Fibonacci terms:",
      "  (0, 1, 1, 2, 3, 5, 8, 13, 21)",
      "Type: tuple",
      "",
      "Tuple : (42, 7, 128, 15, 3, 99)",
      "Min   : 3",
      "Max   : 128",
      "Sum   : 294",
      "After adding 256 (new tuple):",
      "  (42, 7, 128, 15, 3, 99, 256)",
    ],
    watch: [
      "Build in a list, then `tuple()` it",
      "`a, b = b, a+b` advances Fibonacci",
      "'Adding' makes a NEW tuple",
    ],
    notes: "The two syllabus lab programs. The Fibonacci step a, b = b, a+b is a neat use of tuple unpacking: both new values are computed from the old pair at once.",
  });

  await d.demo({
    tag: "D5", name: "Connection-Table Summary", part: "Mini project", file: "05_connection_table.py", codeW: 5.1,
    code: [
      "conns = [   # (src, dst, dst_port, state)",
      "    (\"10.0.0.5\", \"93.184.216.34\", 443, \"ESTABLISHED\"),",
      "    (\"10.0.0.7\", \"45.155.205.233\", 4444, \"ESTABLISHED\"),",
      "    (\"10.0.0.5\", \"8.8.8.8\", 53, \"TIME_WAIT\"),",
      "]",
      "",
      "state_counts = {}",
      "for *_, state in conns:          # ignore leading fields",
      "    state_counts[state] = state_counts.get(state, 0) + 1",
      "",
      "SUSPICIOUS = {4444, 1337, 31337}",
      "for src, dst, port, state in conns:",
      "    if port in SUSPICIOUS:",
      "        print(f\"  {src} -> {dst}:{port}\")",
      "",
      "for row in sorted(conns, key=lambda r: r[2]):",
      "    ...",
    ],
    output: [
      "Connections by state:",
      "  ESTABLISHED  3",
      "  TIME_WAIT    1",
      "  SYN_SENT     1",
      "",
      "Suspicious connections:",
      "  10.0.0.7 -> 45.155.205.233:4444",
      "  10.0.0.7 -> 45.155.205.233:4444",
      "",
      "Sorted by destination port:",
      "   22 ...   53 ...  443 ... 4444",
    ],
    watch: [
      "`for *_, state` ignores fields",
      "Sort rows with `key=lambda r: r[2]`",
      "Port 4444 is a classic C2 default",
    ],
    notes: "This is netstat triage in miniature: count states, flag known-bad ports, sort by port. Data is a hard-coded sample. key=lambda previews how sorting by a field works; students meet lambda again with functions next session.",
  });

  await d.troubleshoot({
    items: [
      ["`(42)` isn't a tuple", "A single-element tuple needs a comma: `(42,)`."],
      ["`'tuple' object` won't assign", "Tuples are immutable. Build a new tuple, or use a list."],
      ["Editing one grid row changed them all", "`[[0]*3]*3` shares a row. Use `[[0]*3 for _ in range(3)]`."],
      ["`too many values to unpack`", "Left side has fewer names than the tuple has items. Count them, or use `*rest`."],
      ["`unhashable type: 'list'`", "A list can't be a dict key or set member. Use a tuple."],
      ["Tuple has no `.append`", "Tuples can't grow. Concatenate: `t = t + (x,)`."],
    ],
    notes: "The single-element comma and the shared-row trap are the two that catch everyone.",
  });

  await d.challenge({
    items: [
      { level: "EASY", head: "Transpose a grid", text: "Turn a 2D list of rows into a list of columns (swap rows and columns).", hint: "`list(zip(*grid))` does it, or nested comprehension." },
      { level: "MEDIUM", head: "Dedupe connections", text: "From the connection table, print each unique (src, dst, port) once, ignoring state.", hint: "Add the 3-tuple to a `set`; tuples are hashable." },
      { level: "STRETCH", head: "Group ports by host", text: "From a list of (host, port) tuples, build a dict mapping each host to a sorted list of its ports.", hint: "`setdefault(host, []).append(port)`, then sort each." },
    ],
    notes: "All three use tuples as the natural record type. Stretch previews dictionaries (next session).",
  });

  await d.summary({
    built: [
      ["D1", "Scan Table & Grid", "2D lists, double indexing, the `*` trap"],
      ["D2", "Immutable Records", "Tuples, the comma gotcha, tuple keys"],
      ["D3", "Swap, Star, Multi-return", "Unpacking everywhere"],
      ["D4", "Fibonacci, Min/Max", "Lab programs"],
      ["D5", "Connection-Table Summary", "Tuples + sorting by a key"],
    ],
    takeaways: [
      "A 2D list is a list of row lists; index `[row][col]`",
      "Build independent rows with a comprehension, not `*`",
      "Tuples are immutable records; `(42,)` needs the comma",
      "Unpacking powers swaps, multi-return, and every `items()` loop",
    ],
    next: "Session 8: Dictionaries: creating, accessing, methods, and a Caesar cipher",
  });

  await d.save(out);
};

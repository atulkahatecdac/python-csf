// Session 4: for, while, loop else, break, continue, nested loops
const { Deck, C } = require("./lib");

module.exports = async function build(out) {
  const d = new Deck(4, "Loops");

  await d.titleSlide({
    title: "Loops: Repeating Work at Machine Speed",
    subtitle: "Scan ranges, walk through logs, retry connections and see why short PINs fall to brute force.",
    flow: [
      ["FaRedo", "for", "Once per item in a collection", C.coral],
      ["FaSyncAlt", "while", "Until a condition becomes False", C.navy],
      ["FaSignOutAlt", "break / continue", "Leave early or skip ahead", C.teal],
      ["FaThLarge", "Nested", "A loop inside a loop", C.coral],
    ],
    notes: "Loops are where automation pays off: the same check applied to ten thousand log lines or every host in a subnet. All network activity in today's demos is simulated; real scanning comes with Scapy in Session 16, on lab networks only.",
  });

  await d.goalsAgenda({
    sub: "Theory with a live demo after every concept",
    goals: [
      ["FaRedo", "Iterate over lists, ranges, strings and dicts with `for`"],
      ["FaSyncAlt", "Use `while` for retries and queues"],
      ["FaSignOutAlt", "Control loops with `break`, `continue`, `else`"],
      ["FaThLarge", "Write nested loops and estimate their cost"],
    ],
    agenda: [
      "The for loop",
      "D1  Lists, ranges, enumerate",
      "The while loop",
      "D2  Back-off, retries, queues",
      "break, continue, loop else",
      "D3  Hunting an IOC in auth.log",
      "D4  Nested loops & PIN space",
      "D5  Lab: factorial, reverse, prime",
      "Troubleshooting & challenge",
    ],
    notes: "D5 covers the syllabus lab programs for this session.",
  });

  await d.iconRows({
    title: "The for Loop",
    sub: "Runs the block once for every item, in order",
    rows: [
      { icon: "FaRedo", color: C.coral, head: "`for item in collection:`", text: "The loop variable takes each value in turn; no index needed." },
      { icon: "FaListOl", color: C.navy, head: "`range()` for counting", text: "`for port in range(1, 1025):` visits 1 to 1024." },
      { icon: "FaHashtag", color: C.teal, head: "`enumerate()` for position", text: "`for n, line in enumerate(log, start=1):` gives line numbers." },
      { icon: "FaPlus", color: C.purple, head: "Accumulator pattern", text: "Start a counter before the loop; update it inside: `count += 1`." },
    ],
    panel: { caption: "Syntax", fontSize: 11, lines: [
      "for ip in suspicious_ips:",
      "    print(\"Checking\", ip)",
      "",
      "digits = 0",
      "for ch in \"web01-dc2\":",
      "    if ch.isdigit():",
      "        digits += 1",
      "print(digits)        # 3",
    ] },
    notes: "Python's for is a 'for each' loop, unlike C's for(i=0; i<n; i++). Looping directly over items is clearer and avoids off-by-one errors.",
  });

  await d.tableSlide({
    title: "What Can a for Loop Walk Through?",
    sub: "Anything iterable: it hands out one item at a time",
    head: ["Iterable", "Each item is", "Example"],
    colW: [1.9, 2.6, 4.5],
    fontSize: 11,
    rows: [
      ["List / tuple", "One element", "`for ip in blocklist:`"],
      ["`range()`", "One integer", "`for port in range(20, 26):`"],
      ["String", "One character", "`for ch in hostname:`"],
      ["Dictionary", "One key", "`for port in services:`"],
      ["`dict.items()`", "A (key, value) pair", "`for port, name in services.items():`"],
      ["`enumerate(x)`", "An (index, item) pair", "`for n, line in enumerate(log, 1):`"],
      ["`zip(a, b)`", "Matching items from a and b", "`for host, port in zip(hosts, ports):`"],
      ["Open file", "One line of text (Session 12)", "`for line in open(\"auth.log\"):`"],
    ],
    belowY: 4.55,
    below: ["The pattern `for a, b in pairs:` **unpacks** each pair into two variables (more on unpacking in Session 7)."],
    notes: "Reading a log file line by line with a for loop uses almost no memory, even for gigabyte files: an important property for forensic work.",
  });

  await d.demo({
    tag: "D1", name: "Lists, Ranges, enumerate", file: "01_for_loops.py",
    code: [
      "for ip in suspicious_ips:",
      "    print(\"Checking\", ip)",
      "",
      "OPEN_PORTS = {22, 80, 443}        # simulated",
      "for port in list(range(20, 26)) + list(range(79, 82)):",
      "    state = \"open\" if port in OPEN_PORTS else \"closed\"",
      "    print(f\"  {port:>3}/tcp  {state}\")",
      "",
      "for ch in hostname:",
      "    if ch.isdigit():",
      "        digits += 1",
      "",
      "for line_no, entry in enumerate(log, start=1):",
      "    if \"FAILED\" in entry:",
      "        print(f\"Line {line_no}: {entry}\")",
      "",
      "for port, name in services.items():",
      "    print(f\"{port:>4} -> {name}\")",
    ],
    output: [
      "Checking 185.220.101.4",
      "Checking 45.155.205.233",
      "Checking 10.0.0.15",
      "   20/tcp  closed",
      "   21/tcp  closed",
      "   22/tcp  open",
      "   ...",
      "   80/tcp  open",
      "'web01-dc2-prod7' contains 4 digits",
      "Line 2: login FAILED",
      "Line 3: login FAILED",
      "  22 -> ssh",
      "  80 -> http",
      " 443 -> https",
    ],
    notes: "Output trimmed. The 'scan' only checks a hard-coded set: no packets are sent. Point out the accumulator (digits += 1) and that enumerate's start=1 matches how humans number log lines.",
  });

  await d.twoPanels({
    title: "The while Loop",
    sub: "Repeat as long as a condition stays True",
    left: { caption: "Counted / retry loop", fontSize: 11, lines: [
      "tries = 0",
      "while tries < 3:",
      "    ok = try_login()",
      "    tries += 1",
      "    if ok:",
      "        break",
      "",
      "# Forget 'tries += 1' and the",
      "# loop never ends: press Ctrl+C",
    ] },
    right: { caption: "Loop until done", fontSize: 11, lines: [
      "while True:",
      "    if not queue:",
      "        break",
      "    alert = queue.pop(0)",
      "    handle(alert)",
      "",
      "# Use for when you know the items;",
      "# while when you don't know how",
      "# many rounds it will take",
    ] },
    below: "**for** walks a known collection; **while** repeats until something changes: a retry succeeds, a queue empties, a user types `quit`.",
    notes: "Infinite loops are the classic while bug: the condition never becomes False because the variable is never updated. Ctrl+C raises KeyboardInterrupt and stops the script.",
  });

  await d.demo({
    tag: "D2", name: "Back-off, Retries, Queues", file: "02_while_loops.py",
    code: [
      "attempt, delay = 1, 1",
      "while attempt <= 5:",
      "    print(f\"Attempt {attempt}: wait {delay}s ...\")",
      "    delay *= 2",
      "    attempt += 1",
      "",
      "while tries < MAX_TRIES:",
      "    guess = typed_passwords[tries]",
      "    tries += 1",
      "    if guess == correct:",
      "        print(f\"Login succeeded on try {tries}\")",
      "        break",
      "    print(f\"Try {tries}: wrong password\")",
      "else:",
      "    print(\"Account locked\")",
      "",
      "while True:",
      "    if not alerts:",
      "        break",
      "    alert = alerts.pop(0)",
    ],
    output: [
      "Attempt 1: wait 1s ...",
      "Attempt 2: wait 2s ...",
      "Attempt 3: wait 4s ...",
      "Attempt 4: wait 8s ...",
      "Attempt 5: wait 16s ...",
      "Try 1: wrong password",
      "Try 2: wrong password",
      "Login succeeded on try 3",
      "Handling: port scan from ...",
      "Handling: malware hash match",
      "Handling: impossible travel",
      "Queue empty - stopping",
    ],
    notes: "Exponential back-off is how well-behaved clients retry, and also how account-lockout policies slow brute force. Change the correct password so it is never typed and the else branch prints 'Account locked'.",
  });

  await d.grid4({
    title: "break, continue, else and pass",
    sub: "Four keywords that change a loop's flow",
    cells: [
      { icon: "FaStopCircle", color: C.coral, head: "`break`", text: ["Leaves the loop immediately.", "Use it when you have found what you were looking for."] },
      { icon: "FaStepForward", color: C.navy, head: "`continue`", text: ["Skips the rest of this round; starts the next one.", "Use it to ignore blank lines, comments, noise."] },
      { icon: "FaFlagCheckered", color: C.teal, head: "Loop `else`", text: ["Runs only if the loop finished **without** `break`.", "Perfect for 'searched everything, not found'."] },
      { icon: "FaPause", color: C.purple, head: "`pass`", text: ["Does nothing. A placeholder where a block is required.", "`if x: pass` while you write the real code."] },
    ],
    notes: "Loop else confuses people because of its name: read it as 'no break'. It works on both for and while.",
  });

  await d.demo({
    tag: "D3", name: "Hunting an IOC in auth.log", file: "03_break_continue_else.py", codeW: 5.0,
    code: [
      "IOC_IP = \"45.155.205.233\"",
      "",
      "for line in auth_log:",
      "    if not line.strip() or line.startswith(\"#\"):",
      "        continue                       # skip noise",
      "    print(\"  \", line[16:])",
      "",
      "for line in auth_log:",
      "    if \"Accepted\" in line and IOC_IP in line:",
      "        print(\"ALERT - attacker logged in:\", line[:15])",
      "        break",
      "else:",
      "    print(\"No successful login from\", IOC_IP)",
    ],
    output: [
      "Relevant lines:",
      " sshd[811]: Accepted password",
      "   for alice from 10.0.0.21",
      " sshd[812]: Failed password",
      "   for root from 45.155.205.233",
      " ...",
      " sshd[813]: Accepted password",
      "   for root from 45.155.205.233",
      "",
      "ALERT - attacker logged in:",
      "  Nov  7 10:14:15",
      "No successful login from",
      "  203.0.113.50 (else clause ran)",
    ],
    notes: "Output trimmed and wrapped. The story: two failed root logins from a known-bad IP, then a success: a classic brute-force-then-compromise pattern. line[16:] and line[:15] are string slices (Session 5).",
  });

  await d.twoPanels({
    title: "Nested Loops",
    sub: "The inner loop runs completely for every round of the outer loop",
    left: { caption: "A grid of hosts", fontSize: 11, lines: [
      "for third in (10, 20):",
      "    for host in range(1, 3):",
      "        print(f\"192.168.{third}.{host}\")",
      "",
      "# 2 x 2 = 4 addresses",
      "",
      "# Cost multiplies:",
      "# 4 digits  -> 10**4 = 10,000",
      "# 8 digits  -> 10**8 = 100 million",
    ] },
    right: { caption: "Output", output: true, fontSize: 11, lines: [
      "192.168.10.1",
      "192.168.10.2",
      "192.168.20.1",
      "192.168.20.2",
    ] },
    below: "`break` only leaves the **innermost** loop. To stop all levels, use a flag (as in D4) or put the loops in a function and `return`.",
    notes: "Rough timing rule: Python checks around a million simple things per second, so 10**8 iterations is minutes, 10**12 is days. That is the arithmetic behind password-length advice.",
  });

  await d.demo({
    tag: "D4", name: "Nested Loops & PIN Space", file: "04_nested_loops.py",
    code: [
      "for row in range(1, 6):",
      "    for col in range(1, 6):",
      "        print(f\"{row * col:4}\", end=\"\")",
      "    print()",
      "",
      "stored_hash = hashlib.sha256(b\"7392\").hexdigest()",
      "found = None",
      "for a in range(10):",
      "    for b in range(10):",
      "        for c in range(10):",
      "            for d in range(10):",
      "                guess = f\"{a}{b}{c}{d}\"",
      "                h = hashlib.sha256(guess.encode())",
      "                if h.hexdigest() == stored_hash:",
      "                    found = guess",
      "                    break",
      "            if found: break",
      "        if found: break",
      "    if found: break",
    ],
    output: [
      "   1   2   3   4   5",
      "   2   4   6   8  10",
      "   3   6   9  12  15",
      "   4   8  12  16  20",
      "   5  10  15  20  25",
      "",
      "PIN recovered: 7392",
      "  after 7,393 tries in 0.011 s",
    ],
    watch: [
      "One `break` per level",
      "10,000 options fall instantly",
      "Defence: rate limits, salts",
    ],
    notes: "We hash a PIN we chose and recover it from our own hash: this is exactly why unsalted hashes of short secrets are worthless if a database leaks. Real systems add salts and slow hashes (bcrypt, Argon2) and lock accounts after a few online attempts. The multiplication table is a self-learning task.",
  });

  await d.demo({
    tag: "D5", name: "Factorial, Reverse, Prime", part: "Lab programs", file: "05_lab_factorial_reverse_prime.py", codeW: 5.1,
    code: [
      "fact = 1",
      "for i in range(2, n + 1):",
      "    fact *= i",
      "",
      "num, rev = n, 0",
      "while num > 0:",
      "    rev = rev * 10 + num % 10    # last digit",
      "    num //= 10                   # drop it",
      "",
      "for d in range(2, int(n ** 0.5) + 1):",
      "    if n % d == 0:",
      "        print(f\"{n} is not prime ({d} x {n // d})\")",
      "        break",
      "else:",
      "    print(n, \"is prime\")",
    ],
    output: [
      "> Enter a number: 10",
      "10! = 3,628,800",
      "Reverse of 10 = 1",
      "10 is not prime (2 x 5)",
      "",
      "> Enter a number: 1234",
      "Reverse of 1234 = 4321",
      "1234 is not prime (2 x 617)",
    ],
    watch: [
      "for, while and for-else in one file",
      "Test only up to the square root",
    ],
    notes: "Try 97: prime, and 97! has 152 digits; Python's integers just cope. The square-root trick: if n has a factor larger than its root, it must also have one smaller. Prime numbers underpin RSA (Session 20).",
  });

  await d.troubleshoot({
    items: [
      ["The script never ends", "A while condition never turns False. Update the loop variable; press **Ctrl+C** to stop."],
      ["Loop runs one time too few", "`range(1, 10)` stops at 9. Use `range(1, 11)` to include 10."],
      ["`break` didn't stop the outer loop", "It only exits the innermost loop. Use a flag, or `return` from a function."],
      ["else ran when I didn't expect it", "Loop `else` runs when there was **no break**, including for an empty list."],
      ["Changing a list while looping over it", "Items get skipped. Loop over a copy: `for x in items[:]`."],
      ["`'int' object is not iterable`", "`for i in 10:` is wrong. Use `for i in range(10):`."],
    ],
    notes: "Modifying a list while iterating over it is a real-world bug: removing items shifts the rest left, so the loop skips the next one.",
  });

  await d.challenge({
    items: [
      { level: "EASY", head: "Sum of digits", text: "Read a number and print the sum of its digits, using a while loop with `% 10` and `// 10`.", hint: "Same pattern as the reverse in D5." },
      { level: "MEDIUM", head: "Palindrome check", text: "Read a word and report whether it reads the same backwards, without slicing: compare characters from both ends.", hint: "`while left < right:` with two indexes." },
      { level: "STRETCH", head: "Failed-login counter", text: "Using the auth_log lines from D3, count failed logins per IP and print any IP with 2 or more.", hint: "A dict as a counter: `counts[ip] = counts.get(ip, 0) + 1`." },
    ],
    notes: "Easy and Medium are on the self-learning list. Stretch previews dictionaries (Session 8) and is the core of every brute-force detector.",
  });

  await d.summary({
    built: [
      ["D1", "Lists, Ranges, enumerate", "`for` over every kind of iterable"],
      ["D2", "Back-off, Retries, Queues", "`while`, `while True` + `break`"],
      ["D3", "Hunting an IOC", "`continue`, `break`, loop `else`"],
      ["D4", "Nested Loops & PIN Space", "Grids, tables, brute-force cost"],
      ["D5", "Factorial, Reverse, Prime", "Lab programs"],
    ],
    takeaways: [
      "`for` walks a collection; `while` waits for a condition",
      "`break` exits, `continue` skips, `else` means no break",
      "Nested loops multiply the work",
      "Short secrets fall to simple loops",
    ],
    next: "Session 5: Strings: operators, slicing, functions and methods",
  });

  await d.save(out);
};

// Session 13: Exceptions - try, except, else, finally, hierarchy, custom exceptions
const { Deck, C } = require("./lib");

module.exports = async function build(out) {
  const d = new Deck(13, "Exceptions");

  await d.titleSlide({
    title: "Exceptions: Fail Loudly, Recover Gracefully",
    subtitle: "Handle bad input, missing files and network errors so one failure doesn't crash the whole tool.",
    flow: [
      ["FaShieldAlt", "try / except", "Catch what you expect", C.coral],
      ["FaSitemap", "Hierarchy", "Errors form a class tree", C.navy],
      ["FaBroom", "finally", "Always clean up", C.teal],
      ["FaPlusCircle", "Custom", "Your own error types", C.coral],
    ],
    notes: "Security tools eat messy input: malformed logs, missing files, hosts that don't answer. Exceptions let us handle the expected failures and keep running. The guiding rule: catch what you can handle, let the rest surface.",
  });

  await d.goalsAgenda({
    sub: "Theory with a live demo after every concept",
    goals: [
      ["FaShieldAlt", "Catch specific exceptions with `try`/`except`"],
      ["FaLayerGroup", "Use `else` and `finally` correctly"],
      ["FaSitemap", "Read the exception hierarchy; `raise` your own"],
      ["FaPlusCircle", "Define custom exception classes"],
    ],
    agenda: [
      "try / except basics",
      "D1  Catch specific errors",
      "else, finally, multiple except",
      "D2  Full skeleton",
      "Hierarchy & raising",
      "D3  Class tree, raise, re-raise",
      "D4  Lab: custom exceptions",
      "D5  Robust targets loader",
      "Troubleshooting & challenge",
    ],
    notes: "D4 covers the self-learning 'create and raise custom exceptions' task.",
  });

  await d.iconRows({
    title: "try / except",
    sub: "Attempt something; handle the failure instead of crashing",
    rows: [
      { icon: "FaPlay", color: C.coral, head: "`try:`", text: "The risky code goes here. If it raises, Python jumps to a matching `except`." },
      { icon: "FaHandPaper", color: C.navy, head: "`except ValueError as err:`", text: "Catch a **specific** type; `err` is the exception object with the message." },
      { icon: "FaLayerGroup", color: C.teal, head: "Several `except` blocks", text: "Handle different errors differently; or one block for `(A, B)`." },
      { icon: "FaBan", color: C.purple, head: "Avoid bare `except:`", text: "It also swallows Ctrl+C and real bugs. Use `except Exception` at most." },
    ],
    panel: { caption: "Catch what you expect", fontSize: 10.5, lines: [
      "try:",
      "    port = int(text)",
      "except ValueError as err:",
      "    print(\"not a number:\", err)",
      "",
      "try:",
      "    print(data[\"port\"])",
      "except KeyError:",
      "    print(\"no port field\")",
    ] },
    notes: "Catch the narrowest exception you can actually handle. A bare except: hides typos and makes Ctrl+C stop working; it is one of the most common bad habits in beginner security scripts.",
  });

  await d.demo({
    tag: "D1", name: "Catch Specific Errors", file: "01_try_except.py", codeW: 5.0,
    code: [
      "def to_port(text):",
      "    try:",
      "        port = int(text)",
      "    except ValueError as err:",
      "        return f\"not a number ({err})\"",
      "    if not (1 <= port <= 65535):",
      "        return \"out of range\"",
      "    return f\"ok: {port}\"",
      "",
      "try:",
      "    print(data[\"port\"])        # KeyError",
      "except KeyError as err:",
      "    print(\"No such field:\", err)",
      "",
      "try:",
      "    print(10 / 0)              # ZeroDivisionError",
      "except ZeroDivisionError:",
      "    print(\"Cannot divide by zero\")",
    ],
    output: [
      "   '443' -> ok: 443",
      " '70000' -> out of range",
      "   'ssh' -> not a number (invalid",
      "   literal for int()...)",
      "  '  22 ' -> ok: 22",
      "",
      "No such field: 'port'",
      "Cannot divide by zero",
      "Handled: ValueError - invalid",
      "  literal for int()...",
    ],
    watch: [
      "Catch the type you expect",
      "`as err` gives the message",
      "`int('  22 ')` strips spaces: ok",
    ],
    notes: "to_port turns a crash into a clean message. Different error types get different handlers. int() tolerates surrounding whitespace, which is why '  22 ' works.",
  });

  await d.twoPanels({
    title: "else and finally",
    sub: "The full try / except / else / finally skeleton",
    left: { caption: "Skeleton", fontSize: 10.5, lines: [
      "try:",
      "    f = open(path)",
      "    port = int(f.readline())",
      "except FileNotFoundError:",
      "    ...        # no file",
      "except ValueError:",
      "    ...        # not a number",
      "else:",
      "    ...        # ran if NO error",
      "finally:",
      "    f.close()  # ALWAYS runs",
    ] },
    right: { caption: "When each runs", fontSize: 10.5, lines: [
      "try    : the risky code",
      "except : only if it raised",
      "         (matching type)",
      "else   : only if it did NOT",
      "         raise",
      "finally: always - success,",
      "         failure, even return",
      "",
      "# finally is for cleanup:",
      "# close files, sockets, locks",
    ] },
    below: "`else` holds the 'success only' code, keeping the `try` block small. `finally` always runs, so it's where you release resources.",
    notes: "Keeping only the risky line in try (and the success path in else) makes it clear which statement you expected to fail. finally runs even if the try block returns or re-raises.",
  });

  await d.demo({
    tag: "D2", name: "Full Skeleton", file: "02_multiple_finally.py", codeW: 5.0,
    code: [
      "def read_port_from_file(path):",
      "    f = None",
      "    try:",
      "        f = open(path, encoding=\"utf-8\")",
      "        port = int(f.readline().strip())",
      "    except FileNotFoundError:",
      "        print(\"  no such file\"); return None",
      "    except ValueError:",
      "        print(\"  not a number\"); return None",
      "    else:",
      "        print(\"  read succeeded\"); return port",
      "    finally:",
      "        if f: f.close()",
      "        print(\"  cleanup (always runs)\")",
      "",
      "except (ValueError, TypeError):   # several in one",
    ],
    output: [
      "good.txt:",
      "  [else]   read succeeded",
      "  [finally] cleanup done",
      "  result: 443",
      "bad.txt:",
      "  [except] not a number",
      "  [finally] cleanup done",
      "missing.txt:",
      "  [except] no such file",
      "  [finally] cleanup done",
      "int(None) failed: TypeError",
    ],
    watch: [
      "`finally` runs on every path",
      "`else` only on the clean path",
      "`except (A, B)` catches either",
    ],
    notes: "Walk the three cases: success (else + finally), bad value (except + finally), missing file (except + finally). finally runs every single time, which is why cleanup belongs there.",
  });

  await d.demo({
    tag: "D3", name: "Class Tree, raise, re-raise", file: "03_hierarchy.py", codeW: 5.0,
    code: [
      "# Catching a base catches its subclasses",
      "except Exception as err:      # ValueError, KeyError, ...",
      "    print(type(err).__name__, err)",
      "",
      "except LookupError:           # KeyError AND IndexError",
      "    ...",
      "",
      "def set_threshold(n):",
      "    if not isinstance(n, int):",
      "        raise TypeError(\"must be an int\")",
      "    if n < 0:",
      "        raise ValueError(f\"negative: {n}\")",
      "    return n",
      "",
      "except ValueError:",
      "    print(\"[log] bad value\"); raise   # re-raise",
    ],
    output: [
      "value  -> ValueError: invalid...",
      "key    -> KeyError: 'missing'",
      "zero   -> ZeroDivisionError",
      "LookupError caught: KeyError",
      "LookupError caught: IndexError",
      "",
      "threshold: 5",
      "rejected -1: ValueError: negative",
      "rejected 'x': TypeError: must be int",
      "  [log] bad config, re-raising",
      "  caller still sees the ValueError",
    ],
    watch: [
      "Catch a base to catch its children",
      "`raise` to signal your own errors",
      "bare `raise` re-throws the current one",
    ],
    notes: "Exceptions form a tree: BaseException > Exception > LookupError > KeyError/IndexError. Catching a parent catches all children. raise (no argument) inside except re-raises, so you can log then let it propagate.",
  });

  // hierarchy diagram slide
  {
    const s = d.slide("The exception class tree. Catching a node catches it and everything beneath it. Catch narrow (a leaf) when you can handle that exact case; catch Exception only at the top level of a tool, to log and exit cleanly. Never catch BaseException - that includes KeyboardInterrupt (Ctrl+C) and SystemExit.");
    d.heading(s, "The Exception Hierarchy", "Catching a class also catches everything below it");
    const { tb } = require("./lib");
    const box = (x, y, w, label, col, fs = 12) => {
      s.addShape("roundRect", { x, y, w, h: 0.42, fill: { color: col }, line: { color: col }, rectRadius: 0.05 });
      tb(s, label, { x, y, w, h: 0.42, fontFace: "Courier New", fontSize: fs, bold: true, color: C.white, align: "center", valign: "middle" });
    };
    const line = (x1, y1, x2, y2) => s.addShape("line", { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), line: { color: C.line, width: 1.5 }, flipV: (y2 < y1) !== (x2 < x1) });
    box(3.7, 1.45, 2.6, "BaseException", C.gray);
    line(5.0, 1.87, 5.0, 2.15);
    box(3.9, 2.15, 2.2, "Exception", C.navy);
    // children row
    const y3 = 3.0;
    box(0.8, y3, 2.0, "ValueError", C.teal);
    box(3.1, y3, 2.0, "LookupError", C.coral);
    box(5.4, y3, 2.0, "OSError", C.teal);
    box(7.7, y3, 1.8, "Arithmetic‑", C.teal, 10);
    line(5.0, 2.57, 1.8, y3);
    line(5.0, 2.57, 4.1, y3);
    line(5.0, 2.57, 6.4, y3);
    line(5.0, 2.57, 8.6, y3);
    // leaves under LookupError and OSError
    const y4 = 3.75;
    box(2.4, y4, 1.9, "KeyError", C.navy);
    box(4.4, y4, 2.0, "IndexError", C.navy);
    box(6.0, y4, 2.6, "FileNotFound‑", C.navy, 10);
    line(4.1, y3 + 0.42, 3.35, y4);
    line(4.1, y3 + 0.42, 5.4, y4);
    line(6.4, y3 + 0.42, 7.3, y4);
    tb(s, [
      { text: "Catch narrow", options: { bold: true, color: C.teal } },
      { text: " (a leaf) to handle one exact case; ", options: {} },
      { text: "catch wide", options: { bold: true, color: C.coral } },
      { text: " (Exception) only at a tool's top level. Never catch ", options: {} },
      { text: "BaseException", options: { fontFace: "Courier New", bold: true } },
      { text: " — it includes Ctrl+C.", options: {} },
    ], { x: 0.6, y: 4.5, w: 8.9, h: 0.6, fontSize: 12.5, valign: "middle" });
  }

  await d.demo({
    tag: "D4", name: "Custom Exceptions", part: "Lab", file: "04_custom_exceptions.py", codeW: 5.0,
    code: [
      "class SecurityError(Exception):",
      "    \"\"\"Base for our tool's errors.\"\"\"",
      "",
      "class WeakPasswordError(SecurityError): ...",
      "",
      "class BlockedIPError(SecurityError):",
      "    def __init__(self, ip):",
      "        super().__init__(f\"IP {ip} is blocklisted\")",
      "        self.ip = ip          # extra data",
      "",
      "def connect(ip):",
      "    if ip in BLOCKLIST:",
      "        raise BlockedIPError(ip)",
      "",
      "except BlockedIPError as err:",
      "    print(err, err.ip)        # subclass data",
    ],
    output: [
      "'short'           REJECTED:",
      "  too short (5 chars, need 12)",
      "'a-long-...phrase' accepted",
      "",
      "connected to 10.0.0.5",
      "blocked: IP 45.155.205.233 is",
      "  on the blocklist",
      "  (ip attribute: 45.155.205.233)",
    ],
    watch: [
      "Inherit from `Exception`",
      "A shared base = catch them together",
      "Custom exceptions can carry data",
    ],
    notes: "Custom exceptions make errors self-describing and catchable as a group (all SecurityError). Carrying data (self.ip) lets the handler act on specifics. This is how real libraries design their error APIs.",
  });

  await d.demo({
    tag: "D5", name: "Robust Targets Loader", part: "Mini project", file: "05_robust_scanner.py", codeW: 5.1,
    code: [
      "class ConfigError(Exception): ...",
      "",
      "def parse_target(line):",
      "    if \":\" not in line:",
      "        raise ConfigError(f\"missing ':' in {line!r}\")",
      "    host, _, port_text = line.partition(\":\")",
      "    try:",
      "        port = int(port_text)",
      "    except ValueError:",
      "        raise ConfigError(f\"port not a number: {line!r}\")",
      "    ...",
      "",
      "for line in raw_targets:",
      "    try:",
      "        target = parse_target(line)",
      "    except ConfigError as err:",
      "        print(\"SKIP:\", err); continue   # keep going",
    ],
    output: [
      "SKIP: port out of range in",
      "  '10.0.0.7:99999'",
      "SKIP: missing ':' in 'brokenline'",
      "SKIP: port is not a number in",
      "  '10.0.0.8:ssh'",
      "",
      "Parsed 3 valid targets,",
      "  skipped 3 bad lines:",
      "  10.0.0.5:22",
      "  10.0.0.6:443",
      "  10.0.0.9:80",
    ],
    watch: [
      "Validate, raise a clear ConfigError",
      "`continue` past bad lines",
      "One bad input never stops the run",
    ],
    notes: "This is the robustness principle in action: a tool that processes many items must survive a bad one. Catch per item, log it, continue. The clear ConfigError messages tell the user exactly which line to fix.",
  });

  await d.troubleshoot({
    items: [
      ["Errors silently vanish", "A bare `except:` swallowed everything. Catch specific types."],
      ["Ctrl+C stopped working", "`except:` or `except BaseException` caught it. Use `except Exception`."],
      ["`finally` changed my return value", "A `return` in `finally` overrides earlier ones. Avoid it."],
      ["Wrong handler ran", "A base class before a subclass catches first. Order specific -> general."],
      ["Exception message is useless", "Catch `as err` and print it; don't discard the detail."],
      ["Caught error but kept going wrongly", "Only catch what you can recover from; otherwise let it raise."],
    ],
    notes: "Order matters: if you put except Exception before except ValueError, the ValueError handler is unreachable.",
  });

  await d.challenge({
    items: [
      { level: "EASY", head: "Safe int()", text: "Write `safe_int(text, default=0)` that returns the int or the default instead of raising.", hint: "try/except ValueError, return default." },
      { level: "MEDIUM", head: "Retry on failure", text: "Write a loop that retries a flaky operation up to 3 times, catching the error and waiting between tries.", hint: "`for attempt in range(3):` with try/except and `break`." },
      { level: "STRETCH", head: "Validated config", text: "Load key=value config lines, raising a custom `ConfigError` that reports the line number of the first bad entry.", hint: "`enumerate(lines, 1)`; include the number in the message." },
    ],
    notes: "Medium (retry with back-off) is a real pattern for network tools. Stretch extends D5 with line numbers for better error reports.",
  });

  await d.summary({
    built: [
      ["D1", "Catch Specific Errors", "`try`/`except`, the exception object"],
      ["D2", "Full Skeleton", "`else`, `finally`, multiple `except`"],
      ["D3", "Hierarchy, raise", "Class tree, `raise`, re-raise"],
      ["D4", "Custom Exceptions", "Your own error types with data"],
      ["D5", "Robust Targets Loader", "Survive bad input, keep running"],
    ],
    takeaways: [
      "Catch the narrowest exception you can handle",
      "`else` = success-only, `finally` = always (cleanup)",
      "Catching a base class catches its subclasses",
      "Custom exceptions make errors clear and catchable as a group",
    ],
    next: "Session 14: Classes and objects: the basics of OOP",
  });

  await d.save(out);
};

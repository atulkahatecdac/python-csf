#!/usr/bin/env python3
"""Demo 1 - try / except basics.

Run:  python 01_try_except.py
Shows: catching an error, the exception object, catching specific types,
       and why a bare 'except:' is dangerous.
"""


def to_port(text):
    """Convert text to a valid port, or explain why it failed."""
    try:
        port = int(text)
    except ValueError as err:               # catch ONLY what we expect
        return f"not a number ({err})"
    if not (1 <= port <= 65535):
        return "out of range"
    return f"ok: {port}"


for value in ["443", "70000", "ssh", "  22 "]:
    print(f"{value!r:>8} -> {to_port(value)}")

# --- Different errors, caught specifically ----------------------------------
data = {"ip": "10.0.0.5"}
try:
    print("\nport:", data["port"])          # missing key -> KeyError
except KeyError as err:
    print("No such field:", err)

try:
    print(10 / 0)                            # ZeroDivisionError
except ZeroDivisionError:
    print("Cannot divide by zero")

# --- Why 'except Exception' beats a bare 'except:' --------------------------
# A bare 'except:' also swallows Ctrl+C and real crashes - avoid it.
try:
    risky = int("oops")
except Exception as err:                     # catches normal errors only
    print("Handled:", type(err).__name__, "-", err)

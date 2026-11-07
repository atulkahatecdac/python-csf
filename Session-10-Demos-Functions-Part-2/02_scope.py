#!/usr/bin/env python3
"""Demo 2 - Variable scope: local, global, and the LEGB rule.

Run:  python 02_scope.py
Shows: locals vanish after the call, reading a global, the global keyword,
       and why 'global state' is risky in security tools.
"""

MAX_RETRIES = 3                      # a module-level constant (global)


def attempt(label):
    tries = 0                        # local: exists only inside this call
    while tries < MAX_RETRIES:       # reading a global is fine
        tries += 1
    return f"{label}: gave up after {tries}"


print(attempt("ssh"))
# print(tries)                       # NameError: 'tries' is local to attempt

# --- Reassigning a global needs the 'global' keyword ------------------------
alert_count = 0

def raise_alert_BAD(msg):
    alert_count = alert_count + 1    # treats it as local -> UnboundLocalError
    return alert_count

try:
    raise_alert_BAD("scan")
except UnboundLocalError as err:
    print("UnboundLocalError:", err)

def raise_alert(msg):
    global alert_count               # say we mean the module-level one
    alert_count += 1
    return alert_count

print("\nraise_alert:", raise_alert("scan"))
print("raise_alert:", raise_alert("login"))
print("alert_count now:", alert_count)

# --- Better than globals: return the new value and let the caller keep it ---
def raise_alert_pure(count, msg):
    return count + 1                 # no hidden state

count = 0
count = raise_alert_pure(count, "scan")
count = raise_alert_pure(count, "login")
print("\npure counter:", count)

# LEGB: Local -> Enclosing -> Global -> Built-in is the lookup order
name = "global"
def outer():
    name = "enclosing"
    def inner():
        return name                  # finds the enclosing 'name'
    return inner()
print("\nLEGB lookup:", outer())

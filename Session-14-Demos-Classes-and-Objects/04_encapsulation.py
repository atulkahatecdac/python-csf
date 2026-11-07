#!/usr/bin/env python3
"""Demo 4 - Encapsulation: protecting an object's internal state.

Run:  python 04_encapsulation.py
Shows: the _private convention, name-mangled __really_private, and
       @property for controlled, validated access - useful for an account-lockout model.
"""


class Account:
    MAX_FAILS = 3

    def __init__(self, username):
        self.username = username
        self._fails = 0              # _single: "internal, please don't touch"
        self.__locked = False        # __double: name-mangled, harder to reach

    def record_failure(self):
        self._fails += 1
        if self._fails >= self.MAX_FAILS:
            self.__locked = True

    def record_success(self):
        if self.__locked:
            raise PermissionError(f"{self.username} is locked")
        self._fails = 0

    @property
    def locked(self):
        """A read-only, computed view of internal state."""
        return self.__locked

    @property
    def remaining(self):
        return max(0, self.MAX_FAILS - self._fails)


acct = Account("alice")
print(f"attempts remaining: {acct.remaining}")

for attempt in range(4):
    acct.record_failure()
    print(f"after fail {attempt + 1}: locked={acct.locked}, remaining={acct.remaining}")

# 'locked' is read-only: trying to set it raises
try:
    acct.locked = False
except AttributeError as err:
    print("\nCan't set locked directly:", err)

# The _fails convention is advisory - Python trusts you not to poke it:
print("peeking at _fails (allowed, discouraged):", acct._fails)
# The __locked name is mangled to _Account__locked:
print("mangled name:", acct._Account__locked)

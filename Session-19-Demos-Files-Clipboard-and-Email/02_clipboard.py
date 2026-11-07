#!/usr/bin/env python3
"""Demo 2 - win32clipboard: read and write the clipboard.

Run:  python 02_clipboard.py        (Windows only)
Shows: reading the current clipboard, writing to it, and restoring it.
The clipboard often holds passwords and secrets copied from managers -
a reason DFIR looks at it, and why clipboard managers are a privacy concern.
All on YOUR OWN clipboard; we restore the original contents afterwards.
"""
import time
import win32clipboard
import win32con


def _open():
    """Open the clipboard, retrying: it's shared, so another app may hold it."""
    for _ in range(10):
        try:
            win32clipboard.OpenClipboard()
            return
        except Exception:
            time.sleep(0.05)
    win32clipboard.OpenClipboard()      # last try; let it raise if still busy


def get_text():
    """Return clipboard text, or None if it holds no text."""
    _open()
    try:
        if win32clipboard.IsClipboardFormatAvailable(win32con.CF_UNICODETEXT):
            return win32clipboard.GetClipboardData(win32con.CF_UNICODETEXT)
        return None
    finally:
        win32clipboard.CloseClipboard()


def set_text(text):
    _open()
    try:
        win32clipboard.EmptyClipboard()
        win32clipboard.SetClipboardText(text, win32con.CF_UNICODETEXT)
    finally:
        win32clipboard.CloseClipboard()


# --- Save whatever is currently on the clipboard ----------------------------
original = get_text()
print("Current clipboard text:", repr(original)[:60] if original else "(no text)")

# --- Write something, read it back ------------------------------------------
set_text("CSF demo: this replaced the clipboard")
print("After set_text ->", repr(get_text()))

# --- A naive 'secret detector' on clipboard text ----------------------------
def looks_sensitive(text):
    if not text:
        return False
    lowered = text.lower()
    return any(w in lowered for w in ("password", "secret", "api_key", "bearer"))

set_text("password=Hunter2")
print("\nSensitive content on clipboard?", looks_sensitive(get_text()))

# --- Restore the user's original clipboard ----------------------------------
if original is not None:
    set_text(original)
    print("\nRestored your original clipboard.")
else:
    set_text("")
    print("\nCleared the demo text (clipboard had no text originally).")

print("\nDFIR note: clipboard contents live in memory and some managers keep")
print("history on disk - both can expose passwords copied from a vault.")

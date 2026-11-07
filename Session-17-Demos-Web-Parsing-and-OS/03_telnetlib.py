#!/usr/bin/env python3
"""Demo 3 - telnetlib: banner grabbing (concept + offline parsing).

Run:  python 03_telnetlib.py
telnetlib (Python 3.12 and earlier) speaks line protocols like Telnet, SMTP
and HTTP. A classic use is BANNER GRABBING: connect to a port and read the
service's greeting to identify it. Here we PARSE a saved banner so the demo is
offline and reproducible; the live-connect code is shown but guarded.

NOTE: telnetlib was removed in Python 3.13. For new code use sockets or a
maintained library. Only connect to hosts you are authorised to test.
"""

# --- A saved banner, as a service would send it -----------------------------
saved_banner = b"220 mail.example.com ESMTP Postfix (Ubuntu)\r\n"


def identify(banner_bytes):
    """Very small banner fingerprinting from the greeting line."""
    text = banner_bytes.decode(errors="replace").strip()
    service = "unknown"
    if text.startswith("220") and "SMTP" in text.upper():
        service = "SMTP mail server"
    elif text.startswith("SSH-"):
        service = "SSH server"
    elif text.startswith("HTTP/"):
        service = "HTTP server"
    return service, text


service, text = identify(saved_banner)
print("Banner :", text)
print("Service:", service)
print("Version hint:", text.split("Postfix")[-1].strip() if "Postfix" in text else "n/a")

# --- What the LIVE version would look like (not run here) --------------------
LIVE_CODE = '''
import telnetlib                      # Python <= 3.12 only
with telnetlib.Telnet("mail.example.com", 25, timeout=3) as tn:
    banner = tn.read_until(b"\\n", timeout=3)
    print(identify(banner))
'''
print("\nLive banner-grab code (authorised hosts only):")
print(LIVE_CODE)

# Check whether telnetlib still exists in this Python
import warnings
try:
    with warnings.catch_warnings():
        warnings.simplefilter("ignore", DeprecationWarning)
        import telnetlib  # noqa: F401
    print("telnetlib is available in this Python (<= 3.12, deprecated).")
except ImportError:
    print("telnetlib removed (Python 3.13+). Use sockets instead.")

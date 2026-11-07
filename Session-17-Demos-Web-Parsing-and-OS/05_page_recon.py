#!/usr/bin/env python3
"""Demo 5 - Mini project: web-page recon report (offline).

Run:  python 05_page_recon.py
Brings together Beautiful Soup + os: parse saved HTML files in a folder and
write a recon summary (links, forms, external scripts, risky comments).
Fetching live pages would use 'requests' - shown but not run.
"""
import os
from bs4 import BeautifulSoup, Comment

# Create a couple of sample saved pages (as if downloaded for review)
PAGES = {
    "home.html": "<html><title>Home</title><body>"
                 "<a href='/about'>About</a><a href='https://tracker.ad/x'>ad</a>"
                 "<script src='https://cdn.x/a.js'></script></body></html>",
    "login.html": "<html><title>Login</title><body>"
                  "<!-- test creds admin/admin removed? -->"
                  "<form action='/auth' method='post'>"
                  "<input type='password' name='pw'></form></body></html>",
}
for name, html in PAGES.items():
    with open(name, "w", encoding="utf-8") as f:
        f.write(html)

RISKY_WORDS = ("todo", "password", "creds", "debug", "key", "secret")


def recon(path):
    with open(path, encoding="utf-8") as f:
        soup = BeautifulSoup(f.read(), "html.parser")
    ext_links = [a["href"] for a in soup.find_all("a", href=True)
                 if a["href"].startswith("http")]
    forms = [f.get("action") for f in soup.find_all("form")]
    scripts = [s["src"] for s in soup.find_all("script", src=True)]
    risky = [c.strip() for c in soup.find_all(string=lambda t: isinstance(t, Comment))
             if any(w in c.lower() for w in RISKY_WORDS)]
    return soup.title.string if soup.title else "?", ext_links, forms, scripts, risky


# --- Walk the saved pages and report ----------------------------------------
print("WEB RECON REPORT")
print("=" * 40)
for path in sorted(PAGES):
    title, ext, forms, scripts, risky = recon(path)
    print(f"\n{path}  ({title})")
    print(f"  external links  : {ext or 'none'}")
    print(f"  forms           : {forms or 'none'}")
    print(f"  external scripts: {scripts or 'none'}")
    if risky:
        print(f"  RISKY COMMENTS  : {risky}")

print("\n(To fetch live pages: requests.get(url).text -> BeautifulSoup,")
print(" on sites you are authorised to assess.)")

for name in PAGES:                      # tidy up the samples
    os.remove(name)

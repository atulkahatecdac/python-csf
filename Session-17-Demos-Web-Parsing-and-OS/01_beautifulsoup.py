#!/usr/bin/env python3
"""Demo 1 - Beautiful Soup: parse HTML (offline sample).

Run:  python 01_beautifulsoup.py
Shows: parsing HTML, finding tags, extracting links/forms, reading comments
and hidden inputs - the recon a web assessor does on a saved page.
We parse a string here so it is reproducible and needs no network.
"""
from bs4 import BeautifulSoup, Comment

HTML = """
<html><head><title>Admin Portal</title>
  <script src="https://cdn.example.com/app.js"></script>
</head>
<body>
  <!-- TODO: remove debug token before go-live: DEBUG=1 -->
  <h1>Login</h1>
  <form action="/login" method="post">
    <input type="text" name="username">
    <input type="password" name="password">
    <input type="hidden" name="csrf" value="abc123">
  </form>
  <a href="/admin">Admin</a>
  <a href="/help">Help</a>
  <a href="http://old-intranet.local/legacy">Legacy</a>
</body></html>
"""

soup = BeautifulSoup(HTML, "html.parser")

# --- Simple extraction ------------------------------------------------------
print("Title:", soup.title.string)
print("H1   :", soup.h1.get_text())

# --- All links (and flag off-site ones) -------------------------------------
print("\nLinks:")
for a in soup.find_all("a"):
    href = a.get("href", "")
    where = "external" if href.startswith("http") else "internal"
    print(f"  {href:<32} [{where}]  {a.get_text()}")

# --- Forms and their inputs (where data is submitted) -----------------------
print("\nForms:")
for form in soup.find_all("form"):
    print(f"  action={form['action']} method={form.get('method', 'get')}")
    for inp in form.find_all("input"):
        print(f"    input name={inp.get('name')} type={inp.get('type')}")

# --- Hidden inputs often hold tokens ----------------------------------------
print("\nHidden fields:")
for inp in soup.find_all("input", {"type": "hidden"}):
    print(f"  {inp['name']} = {inp.get('value')}")

# --- HTML comments can leak secrets (classic finding) -----------------------
print("\nComments (often overlooked):")
for c in soup.find_all(string=lambda t: isinstance(t, Comment)):
    print("  ", c.strip())

# --- External scripts (supply-chain surface) --------------------------------
print("\nExternal scripts:")
for s in soup.find_all("script", src=True):
    print("  ", s["src"])

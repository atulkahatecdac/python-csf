// Session 20: Cryptography with pycryptodome - hashing, AES, RSA, hybrid
const { Deck, C } = require("./lib");

module.exports = async function build(out) {
  const d = new Deck(20, "Cryptography");

  await d.titleSlide({
    title: "Cryptography with Python",
    subtitle: "Hash for integrity, encrypt with AES, exchange keys with RSA, and combine them the way TLS does.",
    flow: [
      ["FaFingerprint", "Hash", "Integrity & passwords", C.coral],
      ["FaKey", "AES", "Fast symmetric encryption", C.navy],
      ["FaUserLock", "RSA", "Public-key crypto", C.teal],
      ["FaExchangeAlt", "Hybrid", "How real systems combine them", C.coral],
    ],
    notes: "The syllabus says PyCrypto, which is dead and insecure; we use its maintained drop-in, pycryptodome (import Crypto). Golden rule up front: do NOT invent your own crypto. Use these vetted primitives correctly. We cover hashing, AES, RSA and the hybrid scheme that underpins TLS.",
  });

  await d.goalsAgenda({
    sub: "Theory with a live demo after every concept",
    goals: [
      ["FaFingerprint", "Hash for integrity; store passwords safely"],
      ["FaKey", "Encrypt with AES-GCM (authenticated)"],
      ["FaUserLock", "Use RSA for encryption and signatures"],
      ["FaExchangeAlt", "Combine AES + RSA (hybrid encryption)"],
    ],
    agenda: [
      "Hashing, salting, HMAC",
      "D1  Integrity & passwords",
      "Symmetric: AES-GCM",
      "D2  Encrypt, detect tampering",
      "Asymmetric: RSA",
      "D3  Encrypt & sign",
      "D4  Lab: encrypt a file",
      "D5  Hybrid encryption",
      "Pitfalls & challenge",
    ],
    notes: "pycryptodome is in requirements.txt (pip install pycryptodome; import Crypto). Never import the old 'pycrypto'.",
  });

  await d.cards3({
    title: "Three Jobs, Three Tools",
    sub: "Match the primitive to the goal",
    cards: [
      { icon: "FaFingerprint", color: C.coral, head: "Hashing", body: ["One-way fingerprint", "Integrity, password storage", "SHA-256, PBKDF2, bcrypt", "**Not** reversible, no key"] },
      { icon: "FaKey", color: C.navy, head: "Symmetric (AES)", body: ["One shared secret key", "Fast; for bulk data", "Same key encrypts + decrypts", "Problem: sharing the key"] },
      { icon: "FaUserLock", color: C.teal, head: "Asymmetric (RSA)", body: ["Public + private key pair", "Public encrypts, private decrypts", "Also: sign and verify", "Slow; for small data / keys"] },
    ],
    below: [
      "**Golden rule:** don't roll your own crypto. Use vetted libraries (pycryptodome) and standard modes (AES-GCM, RSA-OAEP).",
      "**Confidentiality** (keep secret) is encryption; **integrity** (detect change) is hashing/MAC; you often need both.",
    ],
    notes: "The commonest beginner mistake is confusing encoding (base64) with encryption, or hashing with encryption. Hashing has no key and can't be reversed; encryption has a key and can.",
  });

  await d.demo({
    tag: "D1", name: "Integrity & Passwords", file: "01_hashing.py", codeW: 5.0,
    code: [
      "import hashlib, hmac, os",
      "",
      "hashlib.sha256(data).hexdigest()   # integrity",
      "",
      "# BAD: unsalted - same password, same hash",
      "hashlib.sha256(b\"password123\").hexdigest()",
      "",
      "# GOOD: salt + slow KDF",
      "salt = os.urandom(16)",
      "hashlib.pbkdf2_hmac(\"sha256\", pw, salt, 200_000)",
      "",
      "# constant-time compare (avoids timing leaks)",
      "hmac.compare_digest(test, expected)",
      "",
      "# HMAC: authenticity of a message",
      "hmac.new(key, msg, hashlib.sha256).hexdigest()",
    ],
    output: [
      "SHA-256 : 4ce78dedfb87...",
      "  'hello' : 2cf24dba5fb0a30e...",
      "  'hellO' : 04a6f55face2f46b...",
      "",
      "Unsalted (same hash - bad):",
      "  ef92b778bafe...  ef92b778bafe...",
      "PBKDF2 (salted, slow):",
      "  correct password? True",
      "  wrong password?   False",
      "HMAC tampered detected? True",
    ],
    watch: [
      "One bit in -> totally different hash",
      "Salt + many iterations for passwords",
      "`compare_digest` is constant-time",
    ],
    notes: "Never store raw SHA-256 of passwords: identical passwords collide and GPUs brute-force fast. Use a salted, slow KDF (PBKDF2/bcrypt/argon2). compare_digest avoids timing attacks. HMAC proves a message wasn't altered by someone without the key.",
  });

  await d.demo({
    tag: "D2", name: "AES-GCM: Encrypt & Verify", file: "02_symmetric.py", codeW: 5.0,
    code: [
      "from Crypto.Cipher import AES",
      "from Crypto.Random import get_random_bytes",
      "",
      "key = get_random_bytes(32)        # AES-256",
      "cipher = AES.new(key, AES.MODE_GCM)",
      "ciphertext, tag = cipher.encrypt_and_digest(plaintext)",
      "nonce = cipher.nonce              # store with ciphertext",
      "",
      "dec = AES.new(key, AES.MODE_GCM, nonce=nonce)",
      "dec.decrypt_and_verify(ciphertext, tag)",
      "",
      "# flip one ciphertext bit -> verify raises ValueError",
      "",
      "from Crypto.Protocol.KDF import scrypt",
      "key = scrypt(password, salt, 32, N=2**14, r=8, p=1)",
    ],
    output: [
      "Plaintext : Top secret: the vault...",
      "Nonce     : cc2c6d196d357a38...",
      "Ciphertext: 7565ff46e2d0784a...",
      "Tag       : cc9b6562369381d0...",
      "",
      "Decrypted : Top secret: the vault...",
      "Tamper detected: MAC check failed",
      "",
      "Key from password (scrypt):",
      "  94fee81b379e00ab...",
    ],
    watch: [
      "GCM gives secrecy AND integrity",
      "Never reuse a (key, nonce) pair",
      "Derive keys from passwords with scrypt",
    ],
    notes: "AES-GCM is authenticated encryption: the tag detects any tampering on decrypt. The nonce must be unique per message under a key; reuse breaks GCM catastrophically. For password-based keys, use a KDF (scrypt/PBKDF2), never the password bytes directly.",
  });

  await d.demo({
    tag: "D3", name: "RSA: Encrypt & Sign", file: "03_asymmetric.py", codeW: 5.0,
    code: [
      "from Crypto.PublicKey import RSA",
      "from Crypto.Cipher import PKCS1_OAEP",
      "from Crypto.Signature import pkcs1_15",
      "from Crypto.Hash import SHA256",
      "",
      "key = RSA.generate(2048)",
      "pub = key.publickey()",
      "",
      "# public encrypts, private decrypts",
      "ct = PKCS1_OAEP.new(pub).encrypt(message)",
      "PKCS1_OAEP.new(key).decrypt(ct)",
      "",
      "# private signs, public verifies",
      "sig = pkcs1_15.new(key).sign(SHA256.new(doc))",
      "pkcs1_15.new(pub).verify(SHA256.new(doc), sig)",
    ],
    output: [
      "Generated a 2048 bit RSA key pair",
      "",
      "Encrypted with PUBLIC key:",
      "  8d03e5b6b6383f5d...",
      "Decrypted with PRIVATE key:",
      "  Session key: 9f86d081...",
      "",
      "Signature on original: VALID",
      "Tampered document:",
      "  correctly REJECTED",
    ],
    watch: [
      "Encrypt with public, decrypt with private",
      "Sign with private, verify with public",
      "A changed doc fails verification",
    ],
    notes: "RSA does two things: encryption (public->private) and signatures (private->public). Signatures give authenticity and integrity, not secrecy. RSA is slow and limited to small messages, which motivates hybrid encryption (D5). Use OAEP padding, not raw RSA.",
  });

  await d.demo({
    tag: "D4", name: "Encrypt a File", part: "Lab", file: "04_lab_file_crypto.py", codeW: 5.1,
    code: [
      "def encrypt_file(in_path, out_path, password):",
      "    data = open(in_path, \"rb\").read()",
      "    salt = get_random_bytes(16)",
      "    key = scrypt(password, salt, 32, N=2**14, r=8, p=1)",
      "    cipher = AES.new(key, AES.MODE_GCM)",
      "    ct, tag = cipher.encrypt_and_digest(data)",
      "    # layout: salt | nonce | tag | ciphertext",
      "    open(out_path, \"wb\").write(",
      "        salt + cipher.nonce + tag + ct)",
      "",
      "def decrypt_file(in_path, out_path, password):",
      "    ... split salt/nonce/tag/ct, re-derive key,",
      "        decrypt_and_verify  # raises on wrong pw",
    ],
    output: [
      "Original size : 62 bytes",
      "Encrypted size: 110 bytes",
      "  (salt+nonce+tag+ct)",
      "",
      "Encrypted bytes are unreadable:",
      "  7ba2c6ffe8c6f303005c16da...",
      "",
      "Decrypted matches original: True",
      "Wrong password rejected:",
      "  MAC check failed",
    ],
    watch: [
      "Store salt + nonce + tag with ciphertext",
      "Re-derive the key from the password",
      "Wrong password -> MAC check fails",
    ],
    notes: "The self-learning 'encrypt/decrypt file contents' task, done correctly: random salt and nonce, authenticated encryption, everything needed to decrypt stored in the file (but NOT the password). A wrong password fails the MAC check rather than returning garbage.",
  });

  await d.demo({
    tag: "D5", name: "Hybrid Encryption", part: "Mini project", file: "05_hybrid.py", codeW: 5.1,
    code: [
      "# Encrypt bulk data with AES, wrap the AES key with RSA",
      "recipient = RSA.generate(2048)",
      "",
      "# SENDER",
      "aes_key = get_random_bytes(32)",
      "cipher = AES.new(aes_key, AES.MODE_GCM)",
      "ct, tag = cipher.encrypt_and_digest(message)",
      "wrapped = PKCS1_OAEP.new(recipient.publickey()).encrypt(aes_key)",
      "",
      "# RECIPIENT",
      "aes_key = PKCS1_OAEP.new(recipient).decrypt(wrapped)",
      "AES.new(aes_key, AES.MODE_GCM, nonce=cipher.nonce)",
      "   .decrypt_and_verify(ct, tag)",
    ],
    output: [
      "SENDER:",
      "  data encrypted with AES  : 290 bytes",
      "  AES key wrapped with RSA : 256 bytes",
      "  sends: wrapped_key + nonce",
      "         + tag + ciphertext",
      "",
      "RECIPIENT:",
      "  unwrapped AES key matches: True",
      "  decrypted: Large confidential...",
    ],
    watch: [
      "RSA-encrypt the small AES key only",
      "AES-encrypt the bulk data",
      "This is how TLS/PGP/age work",
    ],
    notes: "Hybrid encryption is the real-world pattern: RSA is slow and size-limited, AES is fast and unlimited, so wrap a fresh AES key with RSA and encrypt the data with AES. TLS, PGP, SSH and age all do exactly this.",
  });

  await d.troubleshoot({
    items: [
      ["`ModuleNotFoundError: Crypto`", "Install `pycryptodome` (the import is `Crypto`). Not `pycrypto`."],
      ["Old `pycrypto` installed", "It's unmaintained and insecure. Uninstall it; use pycryptodome."],
      ["`MAC check failed` on decrypt", "Wrong key/password, or the data was changed. That's GCM working."],
      ["Reused nonce in GCM", "Catastrophic: a nonce must be unique per key. Let the library pick it."],
      ["RSA `encrypt` fails on big data", "RSA only fits small messages. Use hybrid encryption."],
      ["Hashing used to 'encrypt'", "Hashing is one-way with no key. Use AES to encrypt."],
    ],
    notes: "The pycrypto vs pycryptodome confusion is common; always pip install pycryptodome. Nonce reuse is the subtle, dangerous one.",
  });

  await d.challenge({
    items: [
      { level: "EASY", head: "File hasher", text: "Write a tool that prints MD5, SHA-1 and SHA-256 of a file (like a forensic hash set).", hint: "Three `hashlib` objects, update each with the same chunks." },
      { level: "MEDIUM", head: "Password vault entry", text: "Store a service/password pair encrypted with a master password; decrypt on the right master.", hint: "scrypt(master) -> AES-GCM; store salt+nonce+tag+ct." },
      { level: "STRETCH", head: "Signed messages", text: "Build sign/verify helpers so two parties can exchange tamper-evident messages with RSA signatures.", hint: "pkcs1_15 + SHA256; share public keys, keep private keys." },
    ],
    notes: "Medium is a real (if minimal) password manager. Stretch is message authentication, the basis of code signing and secure updates.",
  });

  await d.summary({
    built: [
      ["D1", "Integrity & Passwords", "Hashes, salt, PBKDF2, HMAC"],
      ["D2", "AES-GCM", "Authenticated symmetric encryption"],
      ["D3", "RSA", "Public-key encryption and signatures"],
      ["D4", "Encrypt a File", "Lab: password-based file crypto"],
      ["D5", "Hybrid Encryption", "AES + RSA, the way TLS does it"],
    ],
    takeaways: [
      "Don't roll your own crypto; use pycryptodome correctly",
      "Hash (no key) for integrity; encrypt (key) for secrecy",
      "AES-GCM is authenticated; never reuse a nonce",
      "Hybrid = RSA-wrap a fast AES key for the bulk data",
    ],
    next: "Session 21: Forensics - registry, PDF metadata and image EXIF",
  });

  await d.save(out);
};

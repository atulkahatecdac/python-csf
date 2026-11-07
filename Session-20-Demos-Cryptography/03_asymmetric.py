#!/usr/bin/env python3
"""Demo 3 - Asymmetric crypto: RSA encryption and digital signatures.

Run:  python 03_asymmetric.py
Shows: generating an RSA key pair, encrypting with the public key, decrypting
with the private key, and signing/verifying. The basis of TLS, SSH and PGP.
"""
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP
from Crypto.Signature import pkcs1_15
from Crypto.Hash import SHA256

# --- Generate a key pair ----------------------------------------------------
key = RSA.generate(2048)
private_key = key
public_key = key.publickey()
print("Generated a", key.size_in_bits(), "bit RSA key pair")

# --- Public key encrypts; only the private key can decrypt ------------------
message = b"Session key: 9f86d081884c7d659a2f"
encryptor = PKCS1_OAEP.new(public_key)
ciphertext = encryptor.encrypt(message)
print("\nEncrypted with PUBLIC key:", ciphertext.hex()[:32], "...")

decryptor = PKCS1_OAEP.new(private_key)
print("Decrypted with PRIVATE key:", decryptor.decrypt(ciphertext).decode())

# --- Digital signature: private key signs, anyone verifies with public ------
document = b"I authorise the payment of 1000."
digest = SHA256.new(document)
signature = pkcs1_15.new(private_key).sign(digest)
print("\nSignature:", signature.hex()[:32], "...")

# Verify a genuine signature
try:
    pkcs1_15.new(public_key).verify(digest, signature)
    print("Signature on original document: VALID")
except (ValueError, TypeError):
    print("Signature INVALID")

# Verify against a TAMPERED document -> fails
tampered = SHA256.new(b"I authorise the payment of 9999.")
try:
    pkcs1_15.new(public_key).verify(tampered, signature)
    print("Tampered document: VALID (should not happen!)")
except (ValueError, TypeError):
    print("Tampered document: correctly REJECTED")

# --- Export keys (PEM) - how they're stored and shared ----------------------
print("\nPublic key (PEM), first line:")
print("  ", public_key.export_key().decode().splitlines()[0])
print("Share the PUBLIC key; guard the PRIVATE key.")

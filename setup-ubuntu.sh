#!/usr/bin/env bash
# One-time setup for students on Ubuntu 22.04 / 24.04 (also works on Kali / Debian).
# Usage (from the course folder):   bash setup-ubuntu.sh
set -euo pipefail

cd "$(dirname "$0")"

echo "[1/4] Installing python3-venv and python3-pip (needs sudo)..."
sudo apt update
sudo apt install -y python3 python3-venv python3-pip

echo "[2/4] Creating the virtual environment in .venv ..."
if [ -d .venv ] && [ ! -x .venv/bin/python ]; then
  echo "      Found a broken or non-Linux .venv - recreating it."
  rm -rf .venv
fi
[ -d .venv ] || python3 -m venv .venv

echo "[3/4] Installing course packages..."
.venv/bin/python -m pip install --upgrade pip
.venv/bin/python -m pip install -r requirements.txt

echo "[4/4] Making demo scripts executable..."
chmod +x Session-*-Demos/*.py

echo
.venv/bin/python --version
echo "Done. In every new terminal, run:   source .venv/bin/activate"

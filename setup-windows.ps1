# One-time setup for students on Windows 10/11.
# Usage (from the course folder, in PowerShell):
#   powershell -ExecutionPolicy Bypass -File setup-windows.ps1
# Needs Python 3.12 from https://www.python.org/downloads/ (tick "Add python.exe to PATH").
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "[1/3] Checking for Python 3.12..."
& py -3.12 --version
if ($LASTEXITCODE -ne 0) { throw "Python 3.12 not found. Install it from python.org, then re-run this script." }

Write-Host "[2/3] Creating the virtual environment in .venv ..."
if ((Test-Path .venv) -and -not (Test-Path .venv\Scripts\python.exe)) {
  Write-Host "      Found a non-Windows .venv - recreating it."
  Remove-Item -Recurse -Force .venv
}
if (-not (Test-Path .venv)) { & py -3.12 -m venv .venv }

Write-Host "[3/3] Installing course packages..."
& .venv\Scripts\python.exe -m pip install --upgrade pip
& .venv\Scripts\python.exe -m pip install -r requirements.txt

& .venv\Scripts\python.exe --version
Write-Host "Done. In every new terminal, run:   .\.venv\Scripts\Activate.ps1"
Write-Host "(If that is blocked: Set-ExecutionPolicy -Scope CurrentUser RemoteSigned)"

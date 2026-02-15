# Setup and run Library Management System
# Usage: Open PowerShell as Administrator and run:
#   .\setup-project.ps1
# This script will:
# - clone the repo if not present
# - attempt to run with Docker Compose if available
# - otherwise install dependencies and start backend and frontend locally

$repo = 'https://github.com/nurzh07/library-management-system.git'
$dir = 'library-management-system'

function Run-Command($cmd) {
  Write-Host "Running: $cmd"
  & powershell -NoProfile -Command $cmd
  if ($LASTEXITCODE -ne 0) {
    throw "Command failed: $cmd"
  }
}

# Clone or update
if (Test-Path $dir) {
  Write-Host "Directory '$dir' already exists. Pulling latest changes..."
  Push-Location $dir
  try {
    Run-Command 'git pull'
  } finally {
    Pop-Location
  }
} else {
  Write-Host "Cloning $repo..."
  Run-Command "git clone $repo"
}

Set-Location $dir

# Prefer Docker Compose
$hasDocker = $false
try {
  docker version > $null 2>&1
  $hasDocker = $true
} catch {
  $hasDocker = $false
}

if ($hasDocker -and (Test-Path 'docker-compose.yml' -or Test-Path 'docker-compose.yaml')) {
  Write-Host "Docker detected and docker-compose found — starting containers..."
  # Try new CLI first: `docker compose`, fall back to `docker-compose`
  $useNew = $false
  try { docker compose version > $null 2>&1; $useNew = $true } catch { $useNew = $false }
  if ($useNew) {
    Run-Command 'docker compose up -d --build'
  } else {
    Run-Command 'docker-compose up -d --build'
  }
  Write-Host "Containers are starting. Use 'docker ps' to check."
  return
}

# Fallback: run locally (Node required)
Write-Host "Docker not available or no docker-compose.yml found. Falling back to local start. Node.js and npm must be installed."

# Backend
if (Test-Path 'backend') {
  Push-Location 'backend'
  if (Test-Path 'package.json') {
    Write-Host "Installing backend dependencies..."
    Run-Command 'npm install'
    # Try common scripts
    $pkg = Get-Content package.json -Raw | ConvertFrom-Json
    if ($pkg.scripts.'start') { Run-Command 'npm run start' }
    elseif ($pkg.scripts.'dev') { Run-Command 'npm run dev' }
    else { Write-Host "No start/dev script in backend/package.json — start manually." }
  }
  Pop-Location
}

# Frontend
if (Test-Path 'frontend') {
  Push-Location 'frontend'
  if (Test-Path 'package.json') {
    Write-Host "Installing frontend dependencies..."
    Run-Command 'npm install'
    $pkg = Get-Content package.json -Raw | ConvertFrom-Json
    if ($pkg.scripts.'dev') { Write-Host "Starting frontend (dev)..."; Start-Process -NoNewWindow -FilePath npm -ArgumentList 'run','dev' }
    elseif ($pkg.scripts.'start') { Start-Process -NoNewWindow -FilePath npm -ArgumentList 'run','start' }
    else { Write-Host "No dev/start script in frontend/package.json — serve build or start manually." }
  }
  Pop-Location
}

Write-Host "Setup script finished. Check application logs and browsers to confirm services are running."
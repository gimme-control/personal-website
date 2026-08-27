# Build blog from posts/ and serve the site locally.
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (-not (Test-Path "scripts\node_modules")) {
    Write-Host "Installing dependencies (first time only)..." -ForegroundColor Yellow
    Push-Location scripts
    npm install --silent
    Pop-Location
}

Write-Host "Building blog from posts/..." -ForegroundColor Cyan
Push-Location scripts
npm run build
if ($LASTEXITCODE -ne 0) { Pop-Location; exit $LASTEXITCODE }
Pop-Location

$port = if ($env:PORT) { $env:PORT } else { 8000 }
Write-Host ""
Write-Host "Site running at http://localhost:${port}" -ForegroundColor Green
Write-Host "  Home:  http://localhost:${port}/"
Write-Host "  Blog:  http://localhost:${port}/blog/"
Write-Host ""
Write-Host "Press Ctrl+C to stop."

python -m http.server $port

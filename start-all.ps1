Param(
  [switch]$SkipSeed
)

$ErrorActionPreference = 'Stop'

function Write-Section([string]$text) {
  Write-Host "`n==== $text ====\n" -ForegroundColor Cyan
}

function Test-CommandExists([string]$name) {
  return [bool](Get-Command $name -ErrorAction SilentlyContinue)
}

function Invoke-ComposeUp([string[]]$services) {
  $joined = $services -join ' '
  if (Test-CommandExists 'docker-compose') {
    docker-compose up -d $services
  }
  elseif (Test-CommandExists 'docker') {
    docker compose up -d $services
  }
  else {
    throw 'Docker is not installed or not available in PATH.'
  }
}

function Start-Terminal {
  Param(
    [Parameter(Mandatory=$true)][string]$Title,
    [Parameter(Mandatory=$true)][string]$WorkingDirectory,
    [Parameter(Mandatory=$true)][string]$Command
  )
  $psArgs = @(
    '-NoExit',
    '-Command',
    "$Host.UI.RawUI.WindowTitle = '$Title'; $Command"
  )
  Start-Process -FilePath 'powershell.exe' -WorkingDirectory $WorkingDirectory -ArgumentList $psArgs | Out-Null
}

# Resolve directories relative to this script
$RootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BackendDir = Join-Path $RootDir 'TheExportExpress-main\backend'
$FrontendDir = Join-Path $RootDir 'TheExportExpress-main\frontend'
$WebsiteIntegrationDir = Join-Path $RootDir 'website-integration'
$DesktopAppDir = Join-Path $RootDir 'desktop-app'
$AIEngineDir = Join-Path $RootDir 'ai-engine'

Write-Section 'Starting infrastructure (MongoDB, Redis)'
try {
  Push-Location $RootDir
  # Ensure Docker is available
  if (-not (Test-CommandExists 'docker') -and -not (Test-CommandExists 'docker-compose')) {
    throw 'Docker Desktop is not running or docker is not in PATH.'
  }
  Invoke-ComposeUp @('mongodb','redis')
}
finally { Pop-Location }

# Backend API
if (Test-Path $BackendDir) {
  $backendCmd = @()
  $backendCmd += "if (-not (Test-Path 'node_modules')) { npm install }"
  if (-not $SkipSeed) {
    $backendCmd += "if (-not (Test-Path '.seeded')) { npm run seed:all; New-Item -ItemType File -Path '.seeded' | Out-Null }"
  }
  $backendCmd += 'npm run dev'
  Start-Terminal -Title 'ExportExpress Backend' -WorkingDirectory $BackendDir -Command ($backendCmd -join '; ')
} else { Write-Warning "Backend directory not found at $BackendDir" }

# Frontend Web App
if (Test-Path $FrontendDir) {
  $frontendCmd = "if (-not (Test-Path 'node_modules')) { npm install }; npm run dev"
  Start-Terminal -Title 'ExportExpress Frontend' -WorkingDirectory $FrontendDir -Command $frontendCmd
} else { Write-Warning "Frontend directory not found at $FrontendDir" }

# Website Integration (WebSocket server)
if (Test-Path $WebsiteIntegrationDir) {
  $wsCmd = "if (-not (Test-Path 'node_modules')) { npm install }; npm run dev"
  Start-Terminal -Title 'Website Integration' -WorkingDirectory $WebsiteIntegrationDir -Command $wsCmd
} else { Write-Warning "Website integration directory not found at $WebsiteIntegrationDir" }

# Desktop App (Tauri)
if (Test-Path $DesktopAppDir) {
  $desktopCmd = "if (-not (Test-Path 'node_modules')) { npm install }; npm run tauri dev"
  Start-Terminal -Title 'Desktop App (Tauri)' -WorkingDirectory $DesktopAppDir -Command $desktopCmd
} else { Write-Warning "Desktop app directory not found at $DesktopAppDir" }

# AI Engine (Python)
if (Test-Path $AIEngineDir) {
  $aiCmd = @()
  $aiCmd += "$env:PYTHONUNBUFFERED = '1'"
  $aiCmd += "if (Get-Command python -ErrorAction SilentlyContinue) { python -m pip install -r requirements.txt } elseif (Get-Command py -ErrorAction SilentlyContinue) { py -m pip install -r requirements.txt } else { Write-Host 'Python not found in PATH. Skipping dependency install.' }"
  $aiCmd += "if (Get-Command python -ErrorAction SilentlyContinue) { python src/main.py } elseif (Get-Command py -ErrorAction SilentlyContinue) { py src/main.py } else { Write-Error 'Python not found. AI Engine not started.' }"
  Start-Terminal -Title 'AI Engine' -WorkingDirectory $AIEngineDir -Command ($aiCmd -join '; ')
} else { Write-Warning "AI engine directory not found at $AIEngineDir" }

Write-Section 'All service windows launched'
Write-Host 'You can verify services with these URLs:' -ForegroundColor Green
Write-Host '  Backend:  http://localhost:3000'
Write-Host '  Frontend: http://localhost:5173'
Write-Host '  Website Integration (WS): http://localhost:3001'
Write-Host '  Desktop App: http://localhost:1421'
Write-Host '  AI Engine: http://localhost:8001'



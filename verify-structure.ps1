# Verification script for ExportMaster Pro project structure

Write-Host "Verifying ExportMaster Pro project structure..." -ForegroundColor Green

$requiredFiles = @(
    "src-tauri/Cargo.toml",
    "src-tauri/build.rs", 
    "src-tauri/tauri.conf.json",
    "src-tauri/src/main.rs",
    "src-tauri/src/config/mod.rs",
    "src-tauri/src/database/mod.rs",
    "src-tauri/src/error/mod.rs",
    "src-tauri/src/models/mod.rs",
    "config/default.toml",
    "config/development.toml",
    "config/production.toml",
    ".env.example",
    ".gitignore",
    "README.md"
)

$existingCount = 0
$missingCount = 0

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        $existingCount++
        Write-Host "✓ $file" -ForegroundColor Green
    } else {
        $missingCount++
        Write-Host "✗ $file" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "Existing files: $existingCount" -ForegroundColor Green
Write-Host "Missing files: $missingCount" -ForegroundColor Red

if ($missingCount -eq 0) {
    Write-Host ""
    Write-Host "✅ All required files are present!" -ForegroundColor Green
    Write-Host "Core project structure setup is complete." -ForegroundColor Green
}
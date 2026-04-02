# Regenerate slogans/manifest.json from all .svg files in that folder.
# Run this whenever you add new slogan SVG files (e.g. a new font).
# Usage: .\update-manifest.ps1

$slogansDir = Join-Path $PSScriptRoot "slogans"
$manifestPath = Join-Path $slogansDir "manifest.json"

$files = Get-ChildItem -Path $slogansDir -Filter "*.svg" | ForEach-Object { $_.Name } | Sort-Object
$lines = $files | ForEach-Object { "  `"$_`"" }
$json = "[" + [Environment]::NewLine + ($lines -join ("," + [Environment]::NewLine)) + [Environment]::NewLine + "]"
Set-Content -Path $manifestPath -Value $json -Encoding UTF8
Write-Host "Updated $manifestPath with $($files.Count) SVG files."

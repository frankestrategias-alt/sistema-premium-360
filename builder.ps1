$ErrorActionPreference = "Stop"
$htmlPath = "index.html"
$cssPath = "estilos/styles.css"
$outputPath = "C:\Users\FRANK\.gemini\antigravity\brain\2960ba89-7d54-4b0d-b759-6f3881dd6b0e\delivery_system_io.html"

Write-Host "Leyendo archivos..."
$html = Get-Content $htmlPath -Raw
$css = Get-Content $cssPath -Raw

Write-Host "Insertando CSS..."
# Reemplaza la etiqueta link por el bloque style completo
$styleBlock = "<style>`n$css`n</style>"
$finalHtml = $html -replace '<link rel="stylesheet" href="estilos/styles.css[^">]*">', $styleBlock

Write-Host "Guardando en $outputPath..."
[System.IO.File]::WriteAllText($outputPath, $finalHtml, [System.Text.Encoding]::UTF8)
Write-Host "¡Completado!"

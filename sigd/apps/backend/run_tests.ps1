# Script de execução e reporting de testes SIGD
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
Write-Host "=== SIGD Test Runner ===" -ForegroundColor Cyan
Write-Host "Data: $timestamp"

# T1 — Testes Unitários
Write-Host "`n[T1] A correr testes unitários..." -ForegroundColor Yellow
$result = mvn test 2>&1
$passCount = ($result | Select-String "Tests run:" | 
  ForEach-Object { [regex]::Match($_, 'Tests run: (\d+)').Groups[1].Value } | 
  Measure-Object -Sum).Sum
$failCount = ($result | Select-String "Failures: (\d+)" | 
  ForEach-Object { [regex]::Match($_, 'Failures: (\d+)').Groups[1].Value } | 
  Measure-Object -Sum).Sum
Write-Host "Total: $passCount | Falhas: $failCount" -ForegroundColor $(if ($failCount -gt 0) {"Red"} else {"Green"})

# T6 — Cobertura JaCoCo
Write-Host "`n[T6] A gerar relatório de cobertura..." -ForegroundColor Yellow
mvn jacoco:report 2>&1 | Out-Null
Write-Host "Relatório gerado em: target/site/jacoco/index.html" -ForegroundColor Green

Write-Host "`n=== Concluído ===" -ForegroundColor Cyan

Write-Host "--- RNF-15 ---"
$testFiles = Get-ChildItem -Recurse -Filter "*Test*.java" src/test | Measure-Object | Select-Object Count
Write-Host "Test files count: $($testFiles.Count)"

Write-Host "--- RNF-16 ---"
Write-Host "Check pom.xml for jacoco:"
Select-String "jacoco" pom.xml -Quiet

Write-Host "--- RNF-17 ---"
Write-Host "Check docker-compose.yml for volumes:"
Select-String "volumes:" ../docker-compose.yml -Quiet
Write-Host "Check flyway migrations:"
$migrations = Get-ChildItem -Path src/main/resources/db/migration -Filter "V*.sql" -ErrorAction SilentlyContinue | Measure-Object | Select-Object Count
Write-Host "Flyway migrations count: $($migrations.Count)"

Write-Host "--- RNF-19 ---"
Write-Host "Check start.ps1:"
Test-Path "../start.ps1"
Write-Host "Check github workflows:"
Test-Path "../../.github/workflows"

Write-Host "--- RNF-21 ---"
Write-Host "Check backup scripts (sh or ps1):"
$backups = Get-ChildItem -Recurse -Include "*.ps1","*.sh" -Path ../.. -ErrorAction SilentlyContinue | Where-Object { $_.Name -match "backup" } | Measure-Object | Select-Object Count
Write-Host "Backup scripts count: $($backups.Count)"

Write-Host "--- RNF-22 ---"
Write-Host "Check @Scheduled:"
Get-ChildItem -Recurse -Filter "*.java" src/main | Select-String "@Scheduled" -List | Measure-Object | Select-Object Count | ForEach-Object { Write-Host "Files with @Scheduled: $($_.Count)" }

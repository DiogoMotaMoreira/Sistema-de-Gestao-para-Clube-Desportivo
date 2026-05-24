# Caminho: C:\Projetos\LI4\Sistema-de-Gestao-para-Clube-Desportivo\sigd\start.ps1

$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-21.0.11.10-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;$env:USERPROFILE\tools\apache-maven-3.9.6\bin;$env:PATH"

$backendPath = "$PSScriptRoot\apps\backend"
$frontendPath = "$PSScriptRoot\apps\mobile"

# Docker
Write-Host "A iniciar Docker..." -ForegroundColor Cyan
docker compose -f "$backendPath\docker-compose.yml" up -d
Start-Sleep -Seconds 5

# Backend (nova janela)
Write-Host "A iniciar Backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; mvn spring-boot:run"

# Frontend (nova janela)
Write-Host "A iniciar Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npx expo start --web"

Write-Host "Tudo iniciado! Backend: http://localhost:8080 | Frontend: http://localhost:8082" -ForegroundColor Magenta
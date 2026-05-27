# Caminho: C:\Projetos\LI4\Sistema-de-Gestao-para-Clube-Desportivo\sigd\start.ps1

$pcAtual = $env:USERNAME

if ($pcAtual -eq "rafae") {
    $env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-21.0.11.10-hotspot"
    $env:PATH = "$env:JAVA_HOME\bin;C:\Users\rafae\tools\apache-maven-3.9.6\bin;$env:PATH"
} elseif ($pcAtual -eq "nunog") {
    $env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot"
    $env:PATH = "$env:JAVA_HOME\bin;C:\Users\nunog\tools\apache-maven-3.9.6\bin;$env:PATH"
} else {
    # Fallback genérico usando o perfil de utilizador
    $env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot"
    $env:PATH = "$env:JAVA_HOME\bin;$env:USERPROFILE\tools\apache-maven-3.9.6\bin;$env:PATH"
}


$backendPath = "$PSScriptRoot\apps\backend"
$frontendPath = "$PSScriptRoot\apps\mobile"

# Função para libertar porta
function Kill-ProcessOnPort {
    param ([int]$Port)
    $connections = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    if ($connections) {
        Write-Host "Porta $Port ocupada. A matar processo..." -ForegroundColor Yellow
        foreach ($conn in $connections) {
            Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
        }
    }
}

# Docker
Write-Host "A parar Docker (contentores antigos)..." -ForegroundColor Cyan
docker compose -f "$backendPath\docker-compose.yml" down
Write-Host "A iniciar Docker..." -ForegroundColor Cyan
docker compose -f "$backendPath\docker-compose.yml" up -d

$maxRetries = 30
$retries = 0
do {
  $status = docker inspect --format='{{.State.Health.Status}}' sigd-mysql 2>$null
  if ($status -ne 'healthy') {
    $retries++
    if ($retries -ge $maxRetries) {
      Write-Host "TIMEOUT: MySQL nao ficou healthy. Verifica o Docker." -ForegroundColor Red
      exit 1
    }
    Write-Host "MySQL ainda nao esta healthy ($status). Tentativa $retries/$maxRetries..."
    Start-Sleep -Seconds 5
  }
} while ($status -ne 'healthy')
Write-Host "MySQL healthy! A iniciar Backend..." -ForegroundColor Green

$resposta = Read-Host "Repor dados de demonstracao? (s/n)"
if ($resposta -eq 's' -or $resposta -eq 'S') {
    Write-Host "A repor dados..." -ForegroundColor Yellow
    cmd.exe /c "docker exec -i sigd-mysql mysql --default-character-set=utf8mb4 -u sigd_user -psigd_password_dev sigd_dev < apps\backend\src\main\resources\db\migration\seed_master_demo.sql"
    Write-Host "Dados repostos com sucesso!" -ForegroundColor Green
}

# Backend (nova janela)
Kill-ProcessOnPort -Port 8080
Write-Host "A iniciar Backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; mvn spring-boot:run"

# Frontend (nova janela)
Kill-ProcessOnPort -Port 8082
Write-Host "A iniciar Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npx expo start --web --port 8082"

Write-Host "Tudo iniciado! Backend: http://localhost:8080 | Frontend: http://localhost:8082" -ForegroundColor Magenta
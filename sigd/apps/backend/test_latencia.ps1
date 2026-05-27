$token = (Invoke-RestMethod -Uri "http://localhost:8080/api/v1/auth/login" `
  -Method POST -ContentType "application/json" `
  -Body '{"username":"admin","password":"Sigd@2025"}').token

$endpoints = @(
  @{url="/api/v1/tesouraria/atletas?page=0&size=10"; nome="Listagem atletas"},
  @{url="/api/v1/clinica/ocorrencias/ativas"; nome="Ocorrencias ativas"},
  @{url="/api/v1/admin/audit-log?page=0&size=10"; nome="Audit log"},
  @{url="/api/v1/treinador/plantel/semaforo?equipaId=2"; nome="Semaforo plantel"},
  @{url="/api/v1/ceo/kpis"; nome="CEO KPIs"},
  @{url="/api/v1/portal/me"; nome="Portal EE perfil"}
)

foreach ($ep in $endpoints) {
  $start = Get-Date
  try {
    Invoke-WebRequest -Uri "http://localhost:8080$($ep.url)" `
      -Headers @{Authorization="Bearer $token"} -UseBasicParsing | Out-Null
    $ms = [math]::Round(((Get-Date) - $start).TotalMilliseconds)
    $estado = if ($ms -le 1500) { "PASSA" } else { "FALHA" }
    Write-Host "$($ep.nome): ${ms}ms → $estado"
  } catch {
    Write-Host "$($ep.nome): ERRO → $_"
  }
}

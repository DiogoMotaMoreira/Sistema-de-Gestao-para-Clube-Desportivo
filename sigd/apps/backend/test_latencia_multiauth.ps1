$endpoints = @(
  @{url="/api/v1/tesouraria/atletas?page=0&size=10"; nome="Listagem atletas"; user="secretaria"; pass="Sigd@2025"},
  @{url="/api/v1/clinica/ocorrencias/ativas"; nome="Ocorrencias ativas"; user="medico"; pass="Sigd@2025"},
  @{url="/api/v1/admin/audit-log?page=0&size=10"; nome="Audit log"; user="admin"; pass="Sigd@2025"},
  @{url="/api/v1/treinador/plantel/semaforo?equipaId=2"; nome="Semaforo plantel"; user="treinador"; pass="Sigd@2025"},
  @{url="/api/v1/ceo/kpis"; nome="CEO KPIs"; user="ceo"; pass="Sigd@2025"},
  @{url="/api/v1/portal/me"; nome="Portal EE perfil"; user="ee_joao"; pass="Sigd@2025"}
)

foreach ($ep in $endpoints) {
  $body = '{"username":"' + $ep.user + '","password":"' + $ep.pass + '"}'
  try {
      $token = (Invoke-RestMethod -Uri "http://localhost:8080/api/v1/auth/login" -Method POST -ContentType "application/json" -Body $body).accessToken
      
      $start = Get-Date
      Invoke-WebRequest -Uri "http://localhost:8080$($ep.url)" -Headers @{Authorization="Bearer $token"} -UseBasicParsing | Out-Null
      $ms = [math]::Round(((Get-Date) - $start).TotalMilliseconds)
      $estado = if ($ms -le 1500) { "PASSA" } else { "FALHA" }
      Write-Host "$($ep.nome): ${ms}ms -> $estado"
  } catch {
      Write-Host "$($ep.nome): ERRO -> $_"
  }
}

[xml]$j = Get-Content 'target/site/jacoco/jacoco.xml'
$j.report.counter | Where-Object {$_.type -in 'LINE','BRANCH','METHOD'} | ForEach-Object {
    $c = [int]$_.covered
    $m = [int]$_.missed
    $t = $c + $m
    $p = if ($t -gt 0) { [math]::Round($c / $t * 100, 1) } else { 0 }
    Write-Host "$($_.type): $c/$t ($p%)"
}

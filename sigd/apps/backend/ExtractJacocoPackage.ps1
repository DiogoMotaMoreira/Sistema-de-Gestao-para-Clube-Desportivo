[xml]$j = Get-Content 'target/site/jacoco/jacoco.xml'
$j.report.package | Sort-Object { [int]$_.counter[0].missed } -Descending | Select-Object -First 15 | ForEach-Object { 
    $pkg = $_.name
    $c = $_.counter | Where-Object {$_.type -eq 'LINE'}
    if($c) { 
        $cov=[int]$c.covered
        $mis=[int]$c.missed
        $tot=$cov+$mis
        $pct=if($tot -gt 0){[math]::Round($cov/$tot*100,1)}else{0}
        Write-Host "$pkg : $cov/$tot ($pct%)" 
    } 
}

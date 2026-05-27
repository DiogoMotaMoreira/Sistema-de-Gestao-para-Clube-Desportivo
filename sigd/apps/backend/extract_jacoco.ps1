[xml]$jacoco = Get-Content "target/site/jacoco/jacoco.xml"

Write-Host "--- Totals ---"
$jacoco.report.counter | Where-Object {$_.type -in "LINE","BRANCH","METHOD","CLASS"} | ForEach-Object {
    $covered = [int]$_.covered
    $missed = [int]$_.missed
    $total = $covered + $missed
    $pct = 0
    if ($total -gt 0) { $pct = [math]::Round($covered/$total*100, 1) }
    Write-Host "$($_.type): $covered/$total ($pct%)"
}

Write-Host "--- Worst Packages (Lines) ---"
$packages = @()
foreach ($pkg in $jacoco.report.package) {
    $lineCounter = $pkg.counter | Where-Object { $_.type -eq "LINE" }
    if ($lineCounter) {
        $covered = [int]$lineCounter.covered
        $missed = [int]$lineCounter.missed
        $total = $covered + $missed
        $pct = 0
        if ($total -gt 0) { $pct = [math]::Round($covered/$total*100, 1) }
        $packages += [PSCustomObject]@{
            Name = $pkg.name
            Pct = $pct
            Covered = $covered
            Total = $total
        }
    }
}

$packages | Sort-Object Pct | Select-Object -First 5 | ForEach-Object {
    Write-Host "$($_.Name) - $($_.Pct)% ($($_.Covered)/$($_.Total))"
}

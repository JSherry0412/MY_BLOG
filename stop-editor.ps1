$ErrorActionPreference = 'Stop'
$port = 4173
$project = Split-Path -Parent $MyInvocation.MyCommand.Path
try {
    $listeners = @(Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | Where-Object { $_.LocalAddress -eq '127.0.0.1' })
    if ($listeners.Count -eq 0) {
        Write-Host 'Blog editor is not running on 127.0.0.1:4173.'
        exit 0
    }
    if ($listeners.Count -ne 1) { throw 'Multiple listeners found; no process was stopped.' }
    $process = Get-CimInstance Win32_Process -Filter "ProcessId = $($listeners[0].OwningProcess)"
    if (-not $process -or $process.Name -ne 'node.exe' -or $process.CommandLine -notmatch '(?i)(^|[\\/\s"''])editor-server\.cjs([\s"'']|$)') {
        throw 'The port is not owned by a recognized blog editor; no process was stopped.'
    }
    $response = Invoke-WebRequest -Uri 'http://127.0.0.1:4173/app.js' -UseBasicParsing -TimeoutSec 3
    $sha = [System.Security.Cryptography.SHA256]::Create()
    try {
        $localHash = [Convert]::ToBase64String($sha.ComputeHash([IO.File]::ReadAllBytes((Join-Path $project 'app.js'))))
        $response.RawContentStream.Position = 0
        $remoteHash = [Convert]::ToBase64String($sha.ComputeHash($response.RawContentStream))
    } finally { $sha.Dispose() }
    if ($localHash -ne $remoteHash) { throw 'The running site differs from this project; no process was stopped.' }
    Stop-Process -Id $process.ProcessId -ErrorAction Stop
    Write-Host 'Blog editor stopped. You can close this window.'
} catch {
    Write-Host "Could not stop blog editor: $($_.Exception.Message)"
    exit 1
}

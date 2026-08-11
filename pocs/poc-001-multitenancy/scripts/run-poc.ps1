$ErrorActionPreference = "Stop"

$PocDir = Split-Path -Parent $PSScriptRoot
$EnvPath = Join-Path $PocDir ".env"
$ComposePath = Join-Path $PocDir "docker-compose.yml"
$BootstrapPath = Join-Path $PocDir "scripts\bootstrap-app-role.ps1"
$MigrationPath = Join-Path $PocDir "migrations\001_initial_multitenancy.sql"
$SeedPath = Join-Path $PocDir "migrations\002_seed_multitenancy_poc.sql"
$IsolationTestPath = Join-Path $PocDir "tests\rls-isolation.sql"
$WriteTestPath = Join-Path $PocDir "tests\rls-write-protection.sql"

if (-not (Test-Path $EnvPath)) {
    throw "No existe .env para el POC."
}

$EnvLines = Get-Content $EnvPath

$AppPassword = (($EnvLines |
    Where-Object { $_ -like "POC_APP_PASSWORD=*" }) -split "=", 2)[1]

if ([string]::IsNullOrWhiteSpace($AppPassword)) {
    throw "POC_APP_PASSWORD no esta definida."
}

Write-Host "===== 1. LEVANTAR POSTGRESQL ====="

docker compose `
    --env-file $EnvPath `
    -f $ComposePath `
    up -d postgres

if ($LASTEXITCODE -ne 0) {
    throw "No fue posible levantar PostgreSQL."
}

Write-Host "Esperando healthcheck de PostgreSQL..."

$Healthy = $false

for ($Attempt = 1; $Attempt -le 30; $Attempt++) {

    $Health = docker inspect `
        sgd-poc001-postgres `
        --format "{{.State.Health.Status}}" `
        2>$null

    if ($Health -eq "healthy") {
        $Healthy = $true
        break
    }

    Start-Sleep -Seconds 2
}

if (-not $Healthy) {
    throw "PostgreSQL no alcanzo estado healthy."
}

Write-Host "PostgreSQL healthy."

docker compose `
    --env-file $EnvPath `
    -f $ComposePath `
    ps

Write-Host ""
Write-Host "===== 2. BOOTSTRAP ROL APP ====="

powershell `
    -ExecutionPolicy Bypass `
    -File $BootstrapPath

if ($LASTEXITCODE -ne 0) {
    throw "Fallo bootstrap-app-role.ps1."
}

Write-Host ""
Write-Host "===== 3. MIGRACION 001 ====="

Get-Content $MigrationPath -Raw |
    docker exec -i `
        sgd-poc001-postgres `
        psql `
        -U sgd_poc `
        -d sgd_poc_multitenancy `
        -v ON_ERROR_STOP=1

if ($LASTEXITCODE -ne 0) {
    throw "Fallo la migracion 001."
}

Write-Host ""
Write-Host "===== 4. SEED POC ====="

Get-Content $SeedPath -Raw |
    docker exec -i `
        sgd-poc001-postgres `
        psql `
        -U sgd_poc `
        -d sgd_poc_multitenancy `
        -v ON_ERROR_STOP=1

if ($LASTEXITCODE -ne 0) {
    throw "Fallo el seed del POC."
}

Write-Host ""
Write-Host "===== 5. TESTS DE AISLAMIENTO ====="

Get-Content $IsolationTestPath -Raw |
    docker exec -i `
        -e PGPASSWORD=$AppPassword `
        sgd-poc001-postgres `
        psql `
        -h 127.0.0.1 `
        -U sgd_poc_app `
        -d sgd_poc_multitenancy

if ($LASTEXITCODE -ne 0) {
    throw "Fallaron los tests de aislamiento RLS."
}

Write-Host ""
Write-Host "===== 6. TESTS DE PROTECCION DE ESCRITURA ====="

Get-Content $WriteTestPath -Raw |
    docker exec -i `
        -e PGPASSWORD=$AppPassword `
        sgd-poc001-postgres `
        psql `
        -h 127.0.0.1 `
        -U sgd_poc_app `
        -d sgd_poc_multitenancy

if ($LASTEXITCODE -ne 0) {
    throw "Fallaron los tests de escritura RLS."
}

Remove-Variable AppPassword -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "=========================================="
Write-Host "POC-001 MULTITENANCY: PASS"
Write-Host "=========================================="

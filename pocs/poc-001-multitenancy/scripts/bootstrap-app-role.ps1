$ErrorActionPreference = "Stop"

$PocDir = Split-Path -Parent $PSScriptRoot
$EnvPath = Join-Path $PocDir ".env"

if (-not (Test-Path $EnvPath)) {
    throw "No existe el archivo .env del POC."
}

$EnvLines = Get-Content $EnvPath

$AppLine = $EnvLines |
    Where-Object { $_ -like "POC_APP_PASSWORD=*" } |
    Select-Object -First 1

if ([string]::IsNullOrWhiteSpace($AppLine)) {
    throw "POC_APP_PASSWORD no esta definida."
}

$AppPassword = ($AppLine -split "=", 2)[1]

if ([string]::IsNullOrWhiteSpace($AppPassword)) {
    throw "POC_APP_PASSWORD no esta definida."
}

$AppPasswordEscaped = $AppPassword.Replace("'", "''")

$Sql = @"
DO `$do`$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_roles
        WHERE rolname = 'sgd_poc_app'
    ) THEN
        CREATE ROLE sgd_poc_app
            LOGIN
            PASSWORD '$AppPasswordEscaped'
            NOSUPERUSER
            NOCREATEDB
            NOCREATEROLE
            NOBYPASSRLS;
    ELSE
        ALTER ROLE sgd_poc_app
            LOGIN
            PASSWORD '$AppPasswordEscaped'
            NOSUPERUSER
            NOCREATEDB
            NOCREATEROLE
            NOBYPASSRLS;
    END IF;
END
`$do`$;
"@

$Sql | docker exec -i sgd-poc001-postgres psql -U sgd_poc -d sgd_poc_multitenancy -v ON_ERROR_STOP=1

if ($LASTEXITCODE -ne 0) {
    throw "Fallo el bootstrap del rol sgd_poc_app."
}

Remove-Variable AppPassword,AppPasswordEscaped,AppLine,Sql -ErrorAction SilentlyContinue

Write-Host "Rol sgd_poc_app preparado correctamente."

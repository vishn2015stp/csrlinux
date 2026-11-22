@echo off
echo ========================================================
echo Starting Hyper-CSR with PocketBase on Windows...
echo ========================================================

where go >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Go is not installed or not on PATH.
    echo Download from https://go.dev/dl/ and restart your terminal.
    pause
    exit /b 1
)

echo [1/4] Installing frontend dependencies...
call npm install

echo [2/4] Building the production frontend...
call npm run build

if not exist "go.mod" (
    echo Initializing Go module...
    call go mod init myapp
)

echo [3/4] Downloading/updating Go dependencies...
call go mod tidy

if not exist "myapp.exe" (
    echo [4/4] Building PocketBase binary...
    call go build -o myapp.exe
    if %errorlevel% neq 0 (
        echo ERROR: Go build failed.
        pause
        exit /b 1
    )
) else (
    echo [4/4] PocketBase binary already exists, skipping build.
)

echo.
echo ========================================================
echo Migrations will run automatically on first start.
echo Open http://localhost:8090/_/ to create your admin account.
echo ========================================================
echo.

start "Hyper-CSR App" cmd /k "myapp.exe serve --http=0.0.0.0:8090"

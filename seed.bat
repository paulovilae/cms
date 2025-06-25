@echo off
echo Running IntelliTrade seed process...

REM Make a POST request to the seed endpoint using curl
curl -X POST http://localhost:3002/next/seed -H "Content-Type: application/json" -b "%USERPROFILE%\cookies.txt"

echo.
echo If the above command failed, please:
echo 1. Make sure the server is running at http://localhost:3002
echo 2. Login to the admin panel first at http://localhost:3002/admin
echo 3. Save your cookies using a browser extension or developer tools to %USERPROFILE%\cookies.txt
echo.
echo Alternatively, use the "Seed Demo Data" button we added to the admin dashboard.
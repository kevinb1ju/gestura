@echo off
echo ============================================
echo   🎈 Pop the Balloon! - Starting Game...
echo ============================================
echo.
echo Starting local server on http://localhost:8000
echo Press Ctrl+C to stop the server when done.
echo.
start "" "http://localhost:8000"
python -m http.server 8000
pause

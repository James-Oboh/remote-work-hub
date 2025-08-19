@echo off
REM ============================
REM Run Spring Boot backend + React frontend (Windows)
REM ============================

:: --------- Backend ---------
echo 🚀 Starting Spring Boot backend...
cd backend

REM Clean and package backend
call mvn clean package -DskipTests

REM Start backend in a new cmd window with memory limits
start "Spring Boot Backend" cmd /k java -Xms128m -Xmx512m -XX:MaxMetaspaceSize=128m -Dspring.main.lazy-initialization=true -jar target\remote-work-hub-0.0.1-SNAPSHOT.jar

cd ..
echo.
echo Backend should be starting on http://localhost:8085
echo.

:: --------- Frontend ---------
echo 🌐 Starting React frontend...
cd frontend

REM Ensure dependencies installed
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
)

REM Ensure react-scripts is installed
call npm install react-scripts --save

REM Start frontend in a new cmd window with memory limit
start "React Frontend" cmd /k "set NODE_OPTIONS=--max-old-space-size=512 && npx react-scripts start"

cd ..
echo.
echo Frontend should be running on http://localhost:3000
echo.

pause

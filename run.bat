@echo off
REM ============================
REM Run Spring Boot backend + React frontend (Windows, 4GB RAM)
REM ============================

echo Starting Spring Boot backend...
cd backend
call mvn clean package -DskipTests
start "Spring Boot" cmd /k java -Xms128m -Xmx512m -XX:MaxMetaspaceSize=128m -Dspring.main.lazy-initialization=true -jar target\remote-work-hub-0.0.1-SNAPSHOT.jar
cd ..

echo.
echo Backend started on http://localhost:8085
echo.

echo Building React frontend...
cd frontend
call npm install
start npm start
:: start "React Frontend" cmd /k npx serve -s build -l 3000
cd ..

echo.
echo Frontend started on http://localhost:3000
echo.

pause
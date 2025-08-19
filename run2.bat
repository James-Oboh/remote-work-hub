@echo off
:: =============================
:: Start Spring Boot Backend (memory capped)
:: =============================
cd backend
echo 🚀 Starting backend with max 512MB RAM...
call mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-Xmx512m"
cd ..

:: =============================
:: Start React Frontend (Dev Server with memory cap)
:: =============================
cd frontend
echo 🌐 Starting frontend with max 512MB RAM...
set NODE_OPTIONS=--max-old-space-size=512
call npm start
cd ..
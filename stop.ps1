# PowerShell скрипті - Барлық сервистерді тоқтату
Write-Host "🛑 LMS жүйесін тоқтату..." -ForegroundColor Red

docker compose down
docker compose -f docker-compose.elk.yml down

Write-Host "✅ Барлық сервистер тоқтатылды!" -ForegroundColor Green

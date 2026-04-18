# PowerShell скрипті - Барлық сервистерді іске қосу
# Іске қосу: .\start.ps1

Write-Host "🚀 LMS жүйесін іске қосу..." -ForegroundColor Green

# Негізгі сервистер
Write-Host "📦 Postgres + Backend + Frontend іске қосылуда..."
docker compose up -d --build

# Мониторинг (қосымша)
Write-Host "📊 Prometheus + Grafana іске қосылуда..."
docker compose --profile monitoring up -d

# ELK Stack (қосымша)
Write-Host "📝 ELK Stack іске қосылуда..."
docker compose -f docker-compose.elk.yml up -d

Write-Host "✅ Барлық сервистер іске қосылды!" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 Қолжетімді адрестер:" -ForegroundColor Cyan
Write-Host "   Frontend:    http://localhost:3001"
Write-Host "   Backend API: http://localhost:3000"
Write-Host "   Prometheus:  http://localhost:9090"
Write-Host "   Grafana:     http://localhost:3002 (admin/admin)"
Write-Host "   Kibana:      http://localhost:5601"

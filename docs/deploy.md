# Деплой нұсқаулығы

Жоба талабы: бұлттық платформаға орналастыру (Heroku, Render, Railway, AWS, Azure т.б.).

## Жалпы схема

1. **PostgreSQL** — провайдердің managed Postgres қызметі (немесе Docker).
2. **Backend** — Node.js қосымшасы (`PORT`, `DATABASE_URL` немесе `DB_*`, `JWT_SECRET`, `CORS_ORIGIN`).
3. **Frontend** — статикалық build (`npm run build`) + CDN немесе static hosting; `VITE_API_URL` = backend API толық URL (мысалы `https://api.example.com/api`).

## Environment айнымалылары

### Backend

| Айнымалы | Сипаттама |
|----------|-----------|
| `NODE_ENV` | `production` |
| `PORT` | Провайдер берген порт (көбінесе `process.env.PORT`) |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | PostgreSQL |
| `JWT_SECRET` | Күшті кездейсоқ жол |
| `CORS_ORIGIN` | Frontend URL (мысалы `https://myapp.onrender.com`) |

### Frontend (build уақытында)

| Айнымалы | Сипаттама |
|----------|-----------|
| `VITE_API_URL` | Backend API базасы, мысалы `https://lms-api.onrender.com/api` |

## Render.com мысалы (қысқа)

1. Жаңа **PostgreSQL** сервис құру.
2. **Web Service** → GitHub репосын байланыстыру, root `backend`, build `npm install`, start `npm start`.
3. PostgreSQL connection string-ді `DB_*` немесе бір `DATABASE_URL` ретінде баптау (қажет болса `database.js`-ті өзгертіңіз).
4. **Static Site** немесе бөлек Web Service: root `frontend`, build `npm install && npm run build`, publish `dist`; **Environment** `VITE_API_URL` орнату керек болса build command-қа қосыңыз:

```bash
VITE_API_URL=https://your-api.onrender.com/api npm run build
```

## CI/CD Pipeline (GitHub Actions)

GitHub репозиторийінде автоматты CI/CD орнатылған:

```
Push/PR → Test (Backend + Frontend) → Build → Deploy (main branch)
```

**Pipeline кадамдары:**
1. **Backend тесттері** — Jest + PostgreSQL контейнері
2. **Frontend тесттері** — Vitest + React Testing Library
3. **Build** — Backend және Frontend жинау
4. **Deploy** — Render.com-ға автоматты деплой (main branch бойынша)

**GitHub Secrets орнату керек:**
- `RENDER_BACKEND_DEPLOY_HOOK` — Backend deploy hook URL
- `RENDER_FRONTEND_DEPLOY_HOOK` — Frontend deploy hook URL

## Мониторинг (Docker)

### Prometheus + Grafana

```bash
docker compose --profile monitoring up -d
```

- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3002 (логин `admin` / `admin`)
- **Backend метрикалары**: `http://localhost:3000/metrics`

**Дайын Dashboard бар:** `LMS Application Dashboard`
- CPU, Memory, Request Rate, Response Time
- API metrics, Active Users, Books & Borrowings
- Node.js heap usage, Event Loop Lag

### ELK Stack (Elasticsearch + Logstash + Kibana)

Логтарды жинау және талдау:

```bash
docker compose -f docker-compose.elk.yml up -d
```

- **Elasticsearch**: http://localhost:9200
- **Kibana**: http://localhost:5601
- **Лог файлдары**: `./backend/logs/*.log`

**Логтар индексі**: `lms-logs-*`

## Жүктемелік тестілеу (k6)

**Smoke Test (тірі тексеру):**
```bash
k6 run load-tests/k6/smoke.js
```

**Stress Test (шекті жүктеме):**
```bash
k6 run load-tests/k6/stress.js
```
- 50 → 100 → 150 VU дейін жүктемені арттыру
- 20 минут ішінде жүйенің шектерін анықтау

**Spike Test (кенеттен өсу):**
```bash
k6 run load-tests/k6/spike.js
```
- 10 VU → 200 VU (30 секундта)
- Жүйенің қалпына келу қабілетін тексеру

**Docker арқылы іске қосу:**
```bash
docker run --rm -i --network host grafana/k6 run - <load-tests/k6/stress.js
```

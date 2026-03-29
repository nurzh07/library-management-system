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

## Мониторинг (Docker)

Полный стек:

```bash
docker compose --profile monitoring up -d
```

- Prometheus: http://localhost:9090  
- Grafana: http://localhost:3002 (логин `admin` / `admin`, алдымен Prometheus data source қосыңыз: `http://prometheus:9090`)

Backend метрикалары: `http://localhost:3000/metrics`

# Кітапхана Ақпараттық Жүйесі (Library Management System)

Канагат:
Тақырып, мақсат, жоспар, презентация

Нуржыгыт:
Backend, database, API, authentication

Айбек:
Frontend, UI/UX, responsive pages

Бакдаулет:
DevOps, documentation, testing, GitHub, Docker, CI/CD

## 📋 Жоба сипаттамасы

Кітапхана ақпараттық жүйесі - бұл кітапхана ресурстарын басқаруға арналған веб-қосымша. Жүйе кітаптарды, авторларды, оқырмандарды басқаруға және кітап беру/қайтару операцияларын жүргізуге мүмкіндік береді.

## 🎯 Мақсаттар

- Кітапхана ресурстарын тиімді басқару
- Оқырмандар мен кітаптардың ақпаратын жүйелеу
- Кітап беру/қайтару процестерін автоматтандыру
- Админ-панель арқылы контентті басқару
- Қауіпсіз пайдаланушы аутентификациясы

## 🏗️ Архитектура

### Технологиялық стек

**Backend:**
- Node.js + Express.js
- PostgreSQL (дерекқор)
- Sequelize (ORM)
- JWT (аутентификация)
- bcrypt (құпиясөздерді хэштеу)

**Frontend:**
- React.js
- React Router
- Axios (API шақырулары)
- Material-UI / Tailwind CSS

**DevOps:**
- Docker + Docker Compose
- GitHub Actions (CI/CD)
- Nginx (reverse proxy)

**Тестілеу:**
- Jest (unit тесттер)
- Supertest (integration тесттер)
- k6 (жүктемелік тестілеу)

**Мониторинг:**
- Winston (логирование)
- Prometheus + Grafana

## 📁 Жоба құрылымы

```
LMS/
├── backend/                 # Backend қосымшасы
│   ├── src/
│   │   ├── config/         # Конфигурациялар
│   │   ├── controllers/    # Контроллерлер
│   │   ├── models/         # Модельдер
│   │   ├── routes/         # Маршруттар
│   │   ├── middleware/     # Middleware
│   │   ├── services/       # Бизнес-логика
│   │   ├── utils/          # Утилиталар
│   │   └── app.js          # Негізгі файл
│   ├── tests/              # Тесттер
│   ├── Dockerfile
│   └── package.json
├── frontend/               # Frontend қосымшасы
│   ├── src/
│   │   ├── components/    # Компоненттер
│   │   ├── pages/         # Беттер
│   │   ├── services/      # API сервистері
│   │   ├── context/       # Context API
│   │   └── App.js
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml      # Docker Compose конфигурациясы
├── .github/
│   └── workflows/         # CI/CD pipeline
├── docs/                   # Құжаттама
│   ├── api.md             # API құжаттамасы
│   ├── setup.md           # Орнату нұсқаулығы
│   └── user-guide.md      # Пайдаланушы нұсқаулығы
└── README.md

```

## 👥 Команда рөлдері

- **Backend Developer**: API әзірлеу, дерекқор дизайны, аутентификация
- **Frontend Developer**: UI/UX әзірлеу, компоненттер құру
- **DevOps Engineer**: Docker, CI/CD, деплой, мониторинг

## 🔐 Негізгі функционалдық

### Пайдаланушы рөлдері
- **Оқырман (User)**: Кітаптарды іздеу, кітап сұрау, өз тарихын көру
- **Әкімші (Admin)**: Барлық операцияларға қол жеткізу, админ-панель

### Негізгі модульдер
1. **Аутентификация**
   - Тіркелу
   - Кіру/Шығу
   - Профильді басқару

2. **Кітаптар модулі**
   - Кітаптарды қосу/өңдеу/жою
   - Кітаптарды іздеу және сүзгілеу
   - Кітаптарды сұрыптау және пагинация

3. **Авторлар модулі**
   - Авторларды басқару (CRUD)
   - Автор бойынша кітаптарды іздеу

4. **Оқырмандар модулі**
   - Оқырмандарды басқару
   - Оқырман тарихы

5. **Кітап беру/қайтару**
   - Кітап беру операциясы
   - Кітап қайтару
   - Мерзімді бақылау

6. **Админ-панель**
   - Статистика
   - Пайдаланушыларды басқару
   - Кітаптар мен авторларды басқару

## 📊 Дерекқор схемасы

### Негізгі кестелер:
- `users` - Пайдаланушылар
- `books` - Кітаптар
- `authors` - Авторлар
- `book_authors` - Кітап-Автор байланысы (many-to-many)
- `borrowings` - Кітап беру операциялары
- `categories` - Кітап категориялары

## 🚀 Орнату және іске қосу

Толық нұсқаулық: [docs/setup.md](docs/setup.md)

### Жылдам бастау (Docker арқылы — Postgres + Backend + Frontend):
```bash
docker compose up -d --build
```
- Frontend: http://localhost:3001  
- Backend API: http://localhost:3000/api  
- Docker backend: `DB_SYNC_ON_START` кестелерді бірінші рет жасайды; `JWT_SECRET` орта айнымалысымен өзгертуге болады.  
- Prometheus + Grafana (қосымша профиль):
```bash
docker compose --profile monitoring up -d
```
- Prometheus: http://localhost:9090 · Grafana: http://localhost:3002 (`admin` / `admin`)

### Бұлттық деплой
Нұсқаулық: [docs/deploy.md](docs/deploy.md)

## 📝 API Құжаттамасы

API эндпоинттерінің толық тізімі: [docs/api.md](docs/api.md)

## 🧪 Тестілеу

```bash
# Backend тесттер
cd backend
npm test

# Frontend тесттер
cd frontend
npm test
```

## 📈 Мониторинг

- Логи: Winston + Morgan
- Метрикалар: `GET /metrics` (Prometheus форматы, `prom-client`)
- Docker профилі: `docker compose --profile monitoring up -d` (Prometheus + Grafana, `monitoring/prometheus.yml`)
- Жүктемелік тест: [load-tests/k6/smoke.js](load-tests/k6/smoke.js) — `k6 run load-tests/k6/smoke.js` (алдымен [k6 орнату](https://k6.io/docs/get-started/installation/))

## 🔒 Қауіпсіздік

- JWT токендер
- bcrypt хэштеу
- SQL инъекциядан қорғау (Sequelize)
- XSS/CSRF қорғанысы
- Input валидация

## 📅 Кезеңдер

- ✅ **1-апта**: Жоба жоспары
- ✅ **2-апта**: Ортаны баптау
- ✅ **3-апта**: Аутентификация
- ✅ **4-апта**: Дерекқор дизайны
- ✅ **5-апта**: Негізгі CRUD операциялары
- ⏳ **6-15 апта**: Қалған функционалдық және DevOps

## 👨‍💻 Дамыту

```bash
# Backend дамыту
cd backend
npm install
npm run dev

# Frontend дамыту
cd frontend
npm install
npm run dev
```

## 📄 Лицензия

MIT License

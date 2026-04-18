# 🎓 Жоба Презентациясы - LMS Кітапхана АҚЖ

## 📊 Жоба жайлы (Препод үшін)

**Команда:** Канагат, Нуржыгыт, Айбек, Бакдаулет  
**Курс:** Advanced Backend & DevOps  
**Мерзім:** 15 апта  
**Технологиялар:** Full-Stack + DevOps + Testing + Monitoring

---

## 🏆 Жетістіктер (14 апта толық)

### ✅ 1-2 апта: Жобаны жоспарлау + Орта баптау (10%)
- Жоба құрылымы, архитектура, командалық рөлдер
- GitHub репозиторий, code style конвенциялар

### ✅ 3 апта: Аутентификация (10%)
- JWT токендер, bcrypt хэштеу
- Рөлдер: user/admin
- Middleware қорғаныс

### ✅ 4 апта: Дерекқор (10%)
- PostgreSQL + Sequelize ORM
- 6 модель: Users, Books, Authors, Categories, Borrowings, BookAuthors
- Many-to-Many, One-to-Many байланыстар

### ✅ 5-6 апта: Негізгі функционал (20%)
- CRUD операциялар
- Пагинация, іздеу, сүзгілеу, сұрыптау
- Валидация + қателерді өңдеу

### ✅ 7-8 апта: Frontend (10%)
- React 18 + Vite
- Material-UI (MUI)
- Адаптивті дизайн (Desktop + Mobile)

### ✅ 9 апта: Админ-панель (5%)
- Статистикалық деректер
- Пайдаланушыларды басқару
- Контент басқару

### ✅ 10 апта: Кеңейтілген мүмкіндіктер (5%)
- Кітап беру/қайтару жүйесі
- Мерзімді бақылау
- Алерттер

### ✅ 11 апта: Docker (5%)
- Multi-stage Dockerfile
- Docker Compose (Backend + Frontend + PostgreSQL)
- Volume management

### ✅ 12 апта: CI/CD (5%)
- GitHub Actions workflow
- Test → Build → Deploy pipeline
- Render.com автоматты деплой

### ✅ 13 апта: Тестілеу (10%)
- **Unit тесттер:** Jest (5 test suite)
- **Integration тесттер:** Supertest (API тесттері)
- **E2E тесттер:** Playwright (Chromium, Firefox, WebKit, Mobile)
- **Жүктемелік тесттер:** k6 (smoke, stress, spike)

### ✅ 14 апта: Деплой + Мониторинг (10%)
- **Мониторинг:** Prometheus + Grafana + Dashboard
- **Логирование:** ELK Stack (Elasticsearch + Logstash + Kibana)
- **Құжаттама:** API docs, Setup guide, User guide

---

## 🎯 Архитектура

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                       │
│                   http://localhost:3001                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND (Express)                      │
│                   http://localhost:3000                     │
│  • JWT Auth  • CRUD API  • Validation  • Error Handling     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE (PostgreSQL)                  │
│                      Port: 5432                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧪 Тестілеу стратегиясы

| Тест түрі | Қамтылу | Құрал | Файлдар |
|-----------|---------|-------|---------|
| Unit | 47% | Jest | `backend/src/tests/*.test.js` (5 файл) |
| Integration | API endpoints | Supertest | Auth, Books, Authors, Borrowings, Admin |
| E2E | UI/UX | Playwright | `e2e/tests/*.spec.js` (12 тест) |
| Load | 150-200 VU | k6 | smoke, stress, spike |

---

## 📊 DevOps Pipeline

```
Git Push → GitHub Actions → Test → Build → Deploy
                ↓
        ┌───────┴───────┐
        ↓               ↓
   Backend Test    Frontend Test
   (Jest + PG)     (Vitest)
        ↓               ↓
        └───────┬───────┘
                ↓
            Build
                ↓
           Deploy to
          Render.com
```

---

## 🚀 Іске қосу нұсқаулығы

### Docker (ең оңай):
```bash
docker compose up -d --build
```

### Жергілікті орта:
```bash
# Backend
cd backend && npm run dev

# Frontend  
cd frontend && npm run dev

# Демо деректер
node backend/src/scripts/seedDemoData.js
```

### Тесттер:
```bash
# Backend
cd backend && npm test

# E2E
cd e2e && npm test

# Load tests
k6 run load-tests/k6/smoke.js
```

---

## 🎉 Демо аккаунттар

| Рөл | Email | Пароль |
|-----|-------|--------|
| Админ | `admin@library.kz` | `Admin123!` |
| Қолданушы | `user@library.kz` | `User123!` |

---

## 📈 Мониторинг

- **Prometheus:** http://localhost:9090
- **Grafana:** http://localhost:3002 (admin/admin)
- **Kibana:** http://localhost:5601

---

**✅ Барлық 14 апта талаптары орындалды!**  
**✅ Жоба толық функционалды және тестіленген!**  
**✅ Документация толық!**

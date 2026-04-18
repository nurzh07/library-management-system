# Орнату нұсқаулығы

## Алғышарттар

- Node.js 18+ 
- PostgreSQL 15+
- npm немесе yarn
- Docker (опционально)

## Жергілікті орнату

### 1. Репозиторийді клонилау

```bash
git clone <repository-url>
cd LMS
```

### 2. Backend орнату

```bash
cd backend
npm install
```

### 3. Дерекқорды баптау

PostgreSQL дерекқорын құрыңыз:

```bash
createdb lms_db
```

`.env` файлын құрыңыз:

```bash
cp .env.example .env
```

`.env` файлын өзгерту (міндетті: **JWT_SECRET**; жоқ болса production-да логин 500 береді):

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lms_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key-at-least-32-chars
JWT_EXPIRES_IN=7d
# Vite 3001 немесе 5173 — үтірмен екеуін де жазуға болады
CORS_ORIGIN=http://localhost:3001,http://localhost:5173
```

**Frontend әзірлеу:** `npm run dev` кезінде сұраулар `/api` арқылы Vite проксиге барады (CORS қажет емес). Backend `http://localhost:3000` жүріп тұруы керек.

**Docker:** `docker compose` ішінде `DB_SYNC_ON_START=true` бірінші іске қосқанда кестелерді жасайды.

### 4. Backend іске қосу

```bash
npm run dev
```

Backend `http://localhost:3000` портында жұмыс істейді.

### 5. Frontend орнату

Жаңа терминалда:

```bash
cd frontend
npm install
```

### 6. Frontend іске қосу

```bash
npm run dev
```

Frontend `http://localhost:3001` портында жұмыс істейді.

## Docker арқылы орнату

### 1. Docker Compose арқылы іске қосу

```bash
docker-compose up -d
```

Бұл команда:
- PostgreSQL контейнерін іске қосады
- Backend контейнерін іске қосады

### 2. Логтарды көру

```bash
docker-compose logs -f
```

### 3. Тоқтату

```bash
docker-compose down
```

## Тестілеу

### Backend тесттер (Unit + Integration)

```bash
cd backend
npm test
```

### Frontend тесттер (Unit)

```bash
cd frontend
npm test
```

### E2E тесттер (Playwright)

**Орнату:**
```bash
cd e2e
npm install
npx playwright install
```

**Іске қосу:**
```bash
# Барлық тесттер
npm test

# UI режимде
npm run test:ui

# Браузерді көрсету
npm run test:headed

# Тек Chromium
npx playwright test --project=chromium

# Мобильді тест
npx playwright test --project="Mobile Chrome"
```

**Ескерту:** E2E тесттер іске қосу үшін сервер іске қосылған болуы керек:
```bash
# Backend + Frontend іске қосу
docker compose up -d
# немесе
npm run dev (backend)
npm run dev (frontend)
```

## Өндіріс ортасына деплой

### Environment айнымалыларын баптау

Өндіріс ортасында келесі айнымалыларды баптаңыз:

- `NODE_ENV=production`
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `JWT_SECRET` (күшті кілт)
- `CORS_ORIGIN` (frontend URL)

### Build

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

## Мәселелерді шешу

### Дерекқорға қосылу қатесі

- PostgreSQL іске қосылғанын тексеріңіз
- `.env` файлындағы дерекқор параметрлерін тексеріңіз
- Дерекқордың бар екенін тексеріңіз

### Порт бос емес

- Басқа портты пайдаланыңыз
- Портты пайдаланып жатқан процесті тоқтатыңыз

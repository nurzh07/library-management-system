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

`.env` файлын өзгерту:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lms_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key
```

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

### Backend тесттер

```bash
cd backend
npm test
```

### Frontend тесттер

```bash
cd frontend
npm test
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

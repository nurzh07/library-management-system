# API Құжаттамасы

## Base URL
```
http://localhost:3000/api
```

### Жүйелік эндпоинттер (API префиксіз)

| Әдіс | Жол | Сипаттама |
|------|-----|-----------|
| GET | `http://localhost:3000/health` | Қызметтің тірі екенін тексеру |
| GET | `http://localhost:3000/metrics` | Prometheus метрикалары (мониторинг) |

## Аутентификация

Көптеген эндпоинттер JWT токенді талап етеді. Токенді `Authorization` заголовіне қосыңыз:
```
Authorization: Bearer <token>
```

## Эндпоинттер

### Аутентификация

#### Тіркелу
```
POST /auth/register
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "Аты",
  "lastName": "Тегі",
  "phone": "+77001234567"
}
```

#### Кіру
```
POST /auth/login
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Профиль алу
```
GET /auth/profile
```
**Требует аутентификации**

#### Профильді жаңарту
```
PUT /auth/profile
```
**Требует аутентификации**

### Кітаптар

#### Барлық кітаптарды алу
```
GET /books?page=1&limit=10&search=&categoryId=&authorId=&sortBy=createdAt&sortOrder=DESC
```

#### Кітапты ID бойынша алу
```
GET /books/:id
```

#### Кітап қосу (Admin only)
```
POST /books
```

**Body:**
```json
{
  "title": "Кітап атауы",
  "isbn": "978-0-123456-78-9",
  "description": "Сипаттама",
  "publicationYear": 2023,
  "publisher": "Баспа",
  "totalCopies": 5,
  "categoryId": 1,
  "authorIds": [1, 2],
  "coverImage": "url"
}
```

#### Кітапты жаңарту (Admin only)
```
PUT /books/:id
```

#### Кітапты жою (Admin only)
```
DELETE /books/:id
```

### Авторлар

#### Барлық авторларды алу
```
GET /authors?page=1&limit=10&search=&sortBy=lastName&sortOrder=ASC
```

#### Авторды ID бойынша алу
```
GET /authors/:id
```

#### Автор қосу (Admin only)
```
POST /authors
```

**Body:**
```json
{
  "firstName": "Аты",
  "lastName": "Тегі",
  "biography": "Өмірбаяны",
  "dateOfBirth": "1980-01-01",
  "nationality": "Қазақстан"
}
```

#### Авторды жаңарту (Admin only)
```
PUT /authors/:id
```

#### Авторды жою (Admin only)
```
DELETE /authors/:id
```

### Пайдаланушылар

#### Барлық пайдаланушыларды алу (Admin only)
```
GET /users?page=1&limit=10&search=&role=&sortBy=createdAt&sortOrder=DESC
```

#### Пайдаланушыны ID бойынша алу
```
GET /users/:id
```

#### Пайдаланушыны жаңарту
```
PUT /users/:id
```

#### Пайдаланушыны жою (Admin only)
```
DELETE /users/:id
```

### Кітап беру/қайтару

#### Барлық берулерді алу
```
GET /borrowings?page=1&limit=10&status=&userId=&bookId=
```

#### Беруді ID бойынша алу
```
GET /borrowings/:id
```

#### Кітап алу
```
POST /borrowings
```

**Body:**
```json
{
  "bookId": 1,
  "userId": 1,  // Optional, admin only
  "dueDate": "2024-02-27"  // Optional
}
```

#### Кітап қайтару
```
POST /borrowings/:id/return
```

### Категориялар (қоғамдық)

```
GET /categories
```

### Админ (JWT + рөл `admin`)

```
GET /admin/stats
```

Жауап мысалы: `users`, `books`, `authors`, `borrowings`, `activeBorrowings` сандары.

## Жауап форматы

### Сәтті жауап
```json
{
  "success": true,
  "message": "Операция сәтті орындалды",
  "data": {
    // Данные
  }
}
```

### Қате жауап
```json
{
  "success": false,
  "message": "Қате сипаттамасы",
  "errors": [
    {
      "field": "email",
      "message": "Email дұрыс емес"
    }
  ]
}
```

## Статус кодтары

- `200` - Сәтті
- `201` - Жасалды
- `400` - Дұрыс емес сұрау
- `401` - Аутентификация қажет
- `403` - Қол жетімсіз
- `404` - Табылмады
- `409` - Қайшылық
- `500` - Сервер қатесі

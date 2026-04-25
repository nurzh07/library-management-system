#!/bin/sh
set -e

# Кестелерді синхрондау
npm run migrate 2>/dev/null || true

# Админ аккаунтты жасау (егер жоқ болса)
node src/scripts/createAdmin.js 2>/dev/null || true

# Негізгі серверді іске қосу
exec "$@"

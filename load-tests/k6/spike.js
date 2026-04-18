/**
 * k6 Spike Test - Кенеттен жүктеме өсуі тесті
 * Мақсат: Жүйе кенеттен трафикке қалай реакция беретінін тексеру
 * (мысалы: сату, жарнама, вирустық контент)
 * 
 * Іске қосу:
 *   k6 run load-tests/k6/spike.js
 * Немесе Docker:
 *   docker run --rm -i --network host grafana/k6 run - <load-tests/k6/spike.js
 */
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Counter } from 'k6/metrics';

const BASE = __ENV.API_URL || 'http://localhost:3000';

// Кастом метрикалар
const errorRate = new Rate('error_rate');
const recoveryRate = new Rate('recovery_rate');
const spikeErrors = new Counter('spike_errors');

export const options = {
  stages: [
    // 1. Тұрақты жүктеме (базалық)
    { duration: '2m', target: 10 },   // 10 VU - нормальды жүктеме
    
    // 2. 🔥 SPIKE - Кенеттен жүктеме өсуі
    { duration: '30s', target: 200 }, // 30 секундта 200 VU-ге дейін
    
    // 3. Шекті жүктеме (қысқа)
    { duration: '3m', target: 200 },  // 3 минут 200 VU-де ұстау
    
    // 4. 📉 Төмендеу - Жүктемені азайту
    { duration: '30s', target: 10 },   // 30 секундта 10 VU-ге төмендеу
    
    // 5. 🔄 Қалпына келтіру тексеру
    { duration: '5m', target: 10 },    // 5 минут қалпына келу тексеру
    
    // 6. Бітіру
    { duration: '1m', target: 0 },     // Жүйені босату
  ],
  thresholds: {
    http_req_failed: ['rate<0.2'],     // Spike кезінде 20% қате рұқсат
    http_req_duration: ['p(95)<10000'], // 95-процентиль 10 секундтан аз
    error_rate: ['rate<0.15'],          // 15% қатеден аз
  },
};

function testEndpoint(name, method, url, payload = null) {
  let res;
  
  if (method === 'GET') {
    res = http.get(url);
  } else if (method === 'POST') {
    res = http.post(url, JSON.stringify(payload), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  const success = check(res, {
    [`${name} status OK`]: (r) => r.status === 200 || r.status === 201,
    [`${name} response time < 10s`]: (r) => r.timings.duration < 10000,
  });
  
  if (!success) {
    spikeErrors.add(1);
  }
  
  errorRate.add(!success);
  return { success, responseTime: res.timings.duration };
}

export default function () {
  // Барлық негізгі эндпоинттерге сұраныс
  const results = [];
  
  // 1. Health check (барлық сценарийлерде маңызды)
  results.push(testEndpoint('health', 'GET', `${BASE}/health`));
  
  // 2. Кітаптар тізімі
  results.push(testEndpoint('books-list', 'GET', `${BASE}/api/books?page=1&limit=10`));
  
  // 3. Авторлар тізімі
  results.push(testEndpoint('authors-list', 'GET', `${BASE}/api/authors?page=1&limit=10`));
  
  // 4. Категориялар
  results.push(testEndpoint('categories', 'GET', `${BASE}/api/categories`));
  
  // 5. Іздеу (ауыр сұрау)
  results.push(testEndpoint('search', 'GET', `${BASE}/api/books?search=a&page=1&limit=20`));
  
  // Жалпы нәтиже
  const allSuccess = results.every(r => r.success);
  
  // Егер spike аяқталса (200 VU-ден кейін), қалпына келуді тексеру
  if (__VU <= 20) {
    recoveryRate.add(allSuccess);
  }
  
  sleep(1); // Spike кезінде тез сұраныс
}

export function handleSummary(data) {
  const spikeStage = data.metrics.vus.values.max >= 150;
  const recoverySuccess = data.metrics.recovery_rate ? 
    data.metrics.recovery_rate.values.rate > 0.9 : false;
  
  return {
    stdout: `
╔══════════════════════════════════════════════════════════════╗
║                   SPIKE TEST SUMMARY                         ║
╠══════════════════════════════════════════════════════════════╣
  🔥 Spike detected: ${spikeStage ? '✅ YES' : '❌ NO'}
  📊 Max VUs: ${data.metrics.vus.values.max}
  ⏱️  P95 Response: ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms
  ⏱️  P99 Response: ${data.metrics.http_req_duration.values['p(99)'].toFixed(2)}ms
  ❌ Error rate: ${(data.metrics.http_req_failed.values.rate * 100).toFixed(2)}%
  🔄 Recovery: ${recoverySuccess ? '✅ GOOD' : '⚠️  CHECK'}
  
  ${data.metrics.http_req_failed.values.rate < 0.2 ? 
    '✅ Система spike-ты выдержала!' : 
    '❌ Spike кезінде жүйе тұрақсыз жұмыс істеді'}
╚══════════════════════════════════════════════════════════════╝
    `,
  };
}

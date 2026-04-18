/**
 * k6 Stress Test - Шекті жүктеме тесті
 * Мақсат: Жүйенің шекті мүмкіндіктерін анықтау
 * 
 * Іске қосу:
 *   k6 run load-tests/k6/stress.js
 * Немесе Docker:
 *   docker run --rm -i --network host grafana/k6 run - <load-tests/k6/stress.js
 */
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const BASE = __ENV.API_URL || 'http://localhost:3000';

// Кастом метрикалар
const errorRate = new Rate('error_rate');
const responseTime = new Trend('response_time');

export const options = {
  stages: [
    // 1. Бастапқы жүктеме
    { duration: '2m', target: 50 },   // 50 VU дейін баяу көтеру
    // 2. Тұрақты жүктеме
    { duration: '5m', target: 50 },   // 50 VU-де 5 минут ұстау
    // 3. Шекке жету
    { duration: '5m', target: 100 },  // 100 VU дейін көтеру
    // 4. Максималды жүктеме
    { duration: '5m', target: 100 }, // 100 VU-де 5 минут ұстау
    // 5. Қосымша шек
    { duration: '5m', target: 150 },  // 150 VU дейін көтеру
    // 6. Төмендеу
    { duration: '2m', target: 0 },    // Баяу төмендеу
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'],     // 5% қатеден аз
    http_req_duration: ['p(95)<5000'],  // 95-процентиль 5 секундтан аз
    error_rate: ['rate<0.1'],           // 10% қатеден аз
  },
};

function testHealth() {
  const res = http.get(`${BASE}/health`);
  const success = check(res, {
    'health status 200': (r) => r.status === 200,
    'health response time < 500ms': (r) => r.timings.duration < 500,
  });
  errorRate.add(!success);
  responseTime.add(res.timings.duration);
  return success;
}

function testBooksList() {
  const res = http.get(`${BASE}/api/books?page=1&limit=20`);
  const success = check(res, {
    'books list status 200': (r) => r.status === 200,
    'books list response has data': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.success === true && body.data && body.data.books;
      } catch {
        return false;
      }
    },
  });
  errorRate.add(!success);
  responseTime.add(res.timings.duration);
  return success;
}

function testAuthorsList() {
  const res = http.get(`${BASE}/api/authors?page=1&limit=10`);
  const success = check(res, {
    'authors list status 200': (r) => r.status === 200,
  });
  errorRate.add(!success);
  responseTime.add(res.timings.duration);
  return success;
}

function testSearch() {
  const res = http.get(`${BASE}/api/books?search=test&page=1&limit=10`);
  const success = check(res, {
    'search status 200': (r) => r.status === 200,
  });
  errorRate.add(!success);
  responseTime.add(res.timings.duration);
  return success;
}

export default function () {
  // Әр VU әртүрлі эндпоинттерге сұраныс жібереді
  const testType = __VU % 4;
  
  switch (testType) {
    case 0:
      testHealth();
      break;
    case 1:
      testBooksList();
      break;
    case 2:
      testAuthorsList();
      break;
    case 3:
      testSearch();
      break;
  }

  sleep(Math.random() * 2 + 0.5); // 0.5 - 2.5 секунд кідіру
}

export function handleSummary(data) {
  return {
    stdout: `
╔══════════════════════════════════════════════════════════════╗
║                  STRESS TEST SUMMARY                          ║
╠══════════════════════════════════════════════════════════════╣
  📊 Max VUs reached: ${Math.max(...data.metrics.vus.values)}
  ❌ Error rate: ${(data.metrics.error_rate.values.rate * 100).toFixed(2)}%
  ⏱️  P95 Response time: ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms
  ⏱️  P99 Response time: ${data.metrics.http_req_duration.values['p(99)'].toFixed(2)}ms
  🔥 Failed requests: ${data.metrics.http_req_failed.values.rate < 0.05 ? '✅ OK' : '❌ HIGH'}
╚══════════════════════════════════════════════════════════════╝
    `,
  };
}

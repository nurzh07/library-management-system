/**
 * k6 жүктемелік / дым тесті
 * Орнату: https://k6.io/docs/get-started/installation/
 * Іске қосу (backend іске қосылғанда):
 *   k6 run load-tests/k6/smoke.js
 * Немесе Docker:
 *   docker run --rm -i --network host grafana/k6 run - <load-tests/k6/smoke.js
 */
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE = __ENV.API_URL || 'http://localhost:3000';

export const options = {
  vus: 5,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.1'],
    http_req_duration: ['p(95)<2000'],
  },
};

export default function () {
  const resHealth = http.get(`${BASE}/health`);
  check(resHealth, { 'health 200': (r) => r.status === 200 });

  const resBooks = http.get(`${BASE}/api/books?page=1&limit=5`);
  check(resBooks, { 'books 200': (r) => r.status === 200 });

  sleep(0.3);
}

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  insecureSkipTLSVerify: true,
  stages: [
    { duration: '10s', target: 800 }
  ],
};

export default function () {
  // Hit the Nginx reverse proxy which load balances to the backends
  const res = http.get('https://localhost/api/healthz');

  check(res, {
    'is status 200': (r) => r.status === 200,
  });

  sleep(0.1);
}

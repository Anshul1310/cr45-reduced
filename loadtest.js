import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  insecureSkipTLSVerify: true,
  stages: [
    { duration: '10s', target: 100 }
  ],
};

export default function () {
  const res = http.get('https://localhost/api/stress');

  check(res, {
    'is status 200': (r) => r.status === 200,
  });

  sleep(0.1);
}

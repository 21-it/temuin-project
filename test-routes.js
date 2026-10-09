const http = require('http');

const urls = [
  '/',
  '/barang',
  '/lapor',
  '/lapor/hilang',
  '/lapor/temuan',
  '/lacak?code=TMN-2026-F001',
  '/admin/login',
];

async function checkUrl(path) {
  return new Promise((resolve) => {
    http.get('http://localhost:3000' + path, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          path,
          status: res.statusCode,
          length: data.length,
          hasTitle: data.includes('Temuin') || data.includes('html'),
        });
      });
    }).on('error', (err) => {
      resolve({ path, error: err.message });
    });
  });
}

async function run() {
  console.log('Testing Temuin routes on http://localhost:3000...');
  for (const u of urls) {
    const res = await checkUrl(u);
    console.log(`[${res.status}] ${res.path} - ${res.length} bytes (Valid: ${res.hasTitle})`);
  }
}

run();

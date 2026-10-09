const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const items = [
  { file: 'sample-tumbler.svg', title: 'Tumbler Putih Corkcicle', icon: '🥤', bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d' },
  { file: 'sample-calc.svg', title: 'Kalkulator Casio FX-991EX', icon: '🔢', bg: '#f8fafc', border: '#cbd5e1', text: '#334155' },
  { file: 'sample-wallet.svg', title: 'Dompet Kulit Cokelat', icon: '👛', bg: '#fefce8', border: '#fef08a', text: '#854d0e' },
  { file: 'sample-jacket.svg', title: 'Jaket Hoodie Uniqlo Abu', icon: '🧥', bg: '#f1f5f9', border: '#cbd5e1', text: '#475569' },
  { file: 'sample-keys.svg', title: 'Kunci Motor & Flashdisk', icon: '🔑', bg: '#fff7ed', border: '#fed7aa', text: '#c2410c' },
  { file: 'sample-earphone.svg', title: 'TWS Baseus Encok WM01', icon: '🎧', bg: '#f8fafc', border: '#e2e8f0', text: '#0f172a' },
  { file: 'sample-glasses.svg', title: 'Kacamata Frame Hitam', icon: '👓', bg: '#f0fdfa', border: '#99f6e4', text: '#0f766e' },
  { file: 'sample-book.svg', title: 'Buku Matematika Erlangga', icon: '📚', bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
  { file: 'sample-idcard.svg', title: 'Kartu Pelajar & e-Money', icon: '🪪', bg: '#faf5ff', border: '#e9d5ff', text: '#6b21a8' },
  { file: 'sample-watch.svg', title: 'Casio G-Shock Matte Black', icon: '⌚', bg: '#f8fafc', border: '#cbd5e1', text: '#1e293b' },
  { file: 'sample-pencilcase.svg', title: 'Tempat Pensil Sage Green', icon: '✏️', bg: '#f0fdf4', border: '#bbf7d0', text: '#166534' },
  { file: 'sample-lunchbox.svg', title: 'Kotak Bekal Tupperware', icon: '🍱', bg: '#ecfeff', border: '#a5f3fc', text: '#0e7490' },
  { file: 'sample-usb.svg', title: 'Flashdisk Kingston 64GB', icon: '💾', bg: '#f8fafc', border: '#cbd5e1', text: '#334155' },
  { file: 'sample-cap.svg', title: 'Topi Baseball Navy NYC', icon: '🧢', bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af' },
  { file: 'placeholder.svg', title: 'Tanpa Foto Dokumentasi', icon: '📦', bg: '#f8fafc', border: '#e2e8f0', text: '#64748b' },
];

for (const it of items) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="600" height="450">
  <rect width="600" height="450" fill="${it.bg}" rx="16"/>
  <rect x="20" y="20" width="560" height="410" fill="none" stroke="${it.border}" stroke-width="2" stroke-dasharray="6,6" rx="12"/>
  <circle cx="300" cy="180" r="64" fill="#ffffff" stroke="${it.border}" stroke-width="2"/>
  <text x="300" y="200" font-size="56" text-anchor="middle">${it.icon}</text>
  <text x="300" y="290" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="600" fill="${it.text}" text-anchor="middle">${it.title}</text>
  <text x="300" y="325" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Dokumentasi Temuin Kampus</text>
</svg>`;
  fs.writeFileSync(path.join(uploadDir, it.file), svg.trim(), 'utf8');
}

console.log('✅ 15 SVG sample images generated in public/uploads!');

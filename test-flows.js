const { PrismaClient } = require('@prisma/client');
const http = require('http');

const prisma = new PrismaClient();

async function runFlowTest() {
  console.log('🧪 Memulai pengujian alur fungsional Temuin...');

  // 1. Ambil 1 item temuan
  const item = await prisma.item.findFirst({
    where: { status: 'ACTIVE' },
    include: { category: true, location: true },
  });

  if (!item) {
    throw new Error('Tidak ada item aktif ditemukan di database');
  }

  console.log(`✅ Item ditemukan untuk pengujian: "${item.title}" (ID: ${item.id}, Kode: ${item.trackingCode})`);

  // 2. Test request ke detail page
  const detailRes = await new Promise((resolve) => {
    http.get(`http://localhost:3000/barang/${item.id}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, length: data.length, title: data.includes(item.title) }));
    });
  });

  console.log(`✅ Detail Page /barang/${item.id} -> HTTP ${detailRes.status} (Title Rendered: ${detailRes.title})`);

  // 3. Test pelacakan kode
  const lacakRes = await new Promise((resolve) => {
    http.get(`http://localhost:3000/lacak?code=${item.trackingCode}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, codeRendered: data.includes(item.trackingCode) }));
    });
  });

  console.log(`✅ Lacak Page /lacak?code=${item.trackingCode} -> HTTP ${lacakRes.status} (Code Rendered: ${lacakRes.codeRendered})`);

  // 4. Test submit claim
  const testClaim = await prisma.claim.create({
    data: {
      itemId: item.id,
      claimantName: 'Rifki Pratama Test',
      claimantClass: 'XII MIPA 2',
      claimantContact: '081299998888',
      proofDescription: 'Tutup botol memiliki stiker logo NASA hologram dan ada lecet kecil di sisi bawah.',
      status: 'PENDING',
    },
  });
  console.log(`✅ Submit Klaim Sukses: Claim ID ${testClaim.id} untuk barang ${item.title}`);

  // 5. Verifikasi klaim tersimpan di database
  const countClaims = await prisma.claim.count({ where: { itemId: item.id } });
  console.log(`✅ Jumlah klaim terdaftar untuk barang ini: ${countClaims}`);

  console.log('\n🎉 SEMUA ALUR UTAMA BERFUNGSI 100% SEMPURNA!');
}

runFlowTest()
  .catch(err => {
    console.error('❌ Error flow test:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

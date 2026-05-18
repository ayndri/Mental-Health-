/**
 * Seed script — inserts dummy journals & highlights for the first registered user.
 * Usage:  node src/db/seed.js
 *         node src/db/seed.js --email user@example.com
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const db = require('./database');

const emailArg = process.argv.find(a => a.startsWith('--email='))?.split('=')[1]
              || process.argv[process.argv.indexOf('--email') + 1];

function daysAgo(n, hour = 20, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function dateOnly(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

const journals = [
  {
    mood: 'happy',
    title: 'Hari yang menyenangkan bersama teman',
    content: [
      'Hari ini aku merasakan...\nSenang banget! Ketemu teman-teman lama setelah lama nggak ketemu. Rasanya hangat dan penuh energi positif.',
      'Aku memikirkan...\nBetapa berharganya hubungan yang tulus. Kadang kita terlalu sibuk sampai lupa meluangkan waktu untuk orang-orang yang berarti.',
      'Aku bersyukur karena...\nPunya teman-teman yang selalu ada dan mau dengerin ceritaku.',
    ].join('\n\n'),
    daysBack: 1,
  },
  {
    mood: 'anxious',
    title: 'Deadline minggu depan bikin deg-degan',
    content: [
      'Hari ini aku merasakan...\nCemas sekali. Ada 3 deadline minggu depan dan rasanya semuanya datang bersamaan. Kepala rasanya penuh banget.',
      'Aku memikirkan...\nApa aku sudah cukup mempersiapkan semuanya? Takut mengecewakan orang-orang yang mengandalkanku.',
      'Aku bersyukur karena...\nMasih punya waktu untuk memperbaiki dan menyempurnakan semuanya. Dan punya lingkungan yang suportif.',
    ].join('\n\n'),
    daysBack: 3,
  },
  {
    mood: 'sad',
    title: 'Merindukan rumah',
    content: [
      'Hari ini aku merasakan...\nSedih dan rindu rumah. Entah kenapa tiba-tiba teringat masakan ibu dan suasana rumah yang hangat.',
      'Aku memikirkan...\nSudah berapa lama aku nggak pulang ke rumah. Mungkin sudah waktunya merencanakan liburan ke kampung halaman.',
      'Aku bersyukur karena...\nMemiliki keluarga yang menyayangi dan selalu support apapun pilihanku.',
    ].join('\n\n'),
    daysBack: 5,
  },
  {
    mood: 'neutral',
    title: 'Hari Senin seperti biasa',
    content: [
      'Hari ini aku merasakan...\nBiasa aja sih, nggak ada yang spesial. Hari Senin memang gitu ya, pelan-pelan berjalan.',
      'Aku memikirkan...\nMungkin perlu lebih banyak variasi dalam rutinitas harian. Monoton itu bikin energi terkuras tanpa disadari.',
      'Aku bersyukur karena...\nTubuh yang sehat dan bisa menjalani hari dengan baik meski tanpa kejadian luar biasa.',
    ].join('\n\n'),
    daysBack: 7,
  },
  {
    mood: 'angry',
    title: 'Frustrasi dengan situasi hari ini',
    content: [
      'Hari ini aku merasakan...\nKesal dan frustrasi. Ada miskomunikasi yang seharusnya bisa dihindari kalau orang-orangnya mau lebih perhatian.',
      'Aku memikirkan...\nCara untuk menyampaikan perasaan ini dengan lebih baik. Marah itu sah, tapi cara ekspresikannya yang perlu dijaga.',
      'Aku bersyukur karena...\nBisa menyadari emosiku sendiri dan milih untuk nulis di sini daripada meluapkannya ke orang yang salah.',
    ].join('\n\n'),
    daysBack: 9,
  },
  {
    mood: 'happy',
    title: 'Pencapaian kecil yang membahagiakan',
    content: [
      'Hari ini aku merasakan...\nSangat puas dan bahagia! Berhasil menyelesaikan project yang sudah tertunda berminggu-minggu.',
      'Aku memikirkan...\nPentingnya merayakan pencapaian kecil. Sering kali kita terlalu fokus ke tujuan besar sampai lupa menghargai progres.',
      'Aku bersyukur karena...\nKemampuan untuk terus berusaha meski sempat mau nyerah di tengah jalan.',
    ].join('\n\n'),
    daysBack: 11,
  },
  {
    mood: 'anxious',
    title: 'Overthinking sebelum tidur',
    content: [
      'Hari ini aku merasakan...\nGelisah dan nggak bisa tidur. Pikiran terus muter ke hal-hal yang belum tentu terjadi.',
      'Aku memikirkan...\nKenapa overthinking ini susah banget dikontrol. Udah tahu nggak baik, tapi tetap aja kepikiran.',
      'Aku bersyukur karena...\nMasih bisa menyadari pola pikir ini dan mencari cara untuk mengatasinya, salah satunya dengan menulis.',
    ].join('\n\n'),
    daysBack: 13,
  },
  {
    mood: 'sad',
    title: 'Kehilangan motivasi',
    content: [
      'Hari ini aku merasakan...\nLemas dan nggak bersemangat. Susah banget buat mulai ngapa-ngapain padahal ada banyak yang harus dikerjain.',
      'Aku memikirkan...\nApa yang bikin aku kehilangan motivasi belakangan ini. Mungkin terlalu memaksakan diri tanpa istirahat cukup.',
      'Aku bersyukur karena...\nMemiliki tempat untuk mencurahkan perasaan ini dan tahu bahwa hari yang buruk nggak berarti hidup yang buruk.',
    ].join('\n\n'),
    daysBack: 16,
  },
  {
    mood: 'neutral',
    title: 'Refleksi di akhir bulan',
    content: [
      'Hari ini aku merasakan...\nTenang dan sedikit merenung. Bulan ini berlalu begitu cepat, ada banyak hal yang terjadi.',
      'Aku memikirkan...\nApa yang sudah aku capai bulan ini dan apa yang masih perlu diperbaiki. Evaluasi diri itu penting.',
      'Aku bersyukur karena...\nSetiap pengalaman bulan ini, baik yang menyenangkan maupun yang berat, semuanya mengajarkan sesuatu.',
    ].join('\n\n'),
    daysBack: 20,
  },
  {
    mood: 'happy',
    title: 'Olahraga pagi yang refreshing',
    content: [
      'Hari ini aku merasakan...\nSegar dan penuh semangat setelah olahraga pagi. Endorphin beneran nyata efeknya!',
      'Aku memikirkan...\nKenapa susah banget mulai padahal hasilnya selalu bikin senang. Mungkin itu yang namanya activation energy.',
      'Aku bersyukur karena...\nTubuh yang masih kuat untuk bergerak dan punya waktu pagi yang tenang sebelum hari dimulai.',
    ].join('\n\n'),
    daysBack: 23,
  },
];

const highlights = [
  { article_id: 'artikel-stres-kerja', article_title: '5 Cara Mengatasi Stres di Hari Sibuk', text: 'Stres itu bukan musuh — ia adalah sinyal dari tubuhmu bahwa kamu butuh perhatian lebih. Belajar mendengarkannya adalah langkah pertama.', color: '#415f83' },
  { article_id: 'artikel-stres-kerja', article_title: '5 Cara Mengatasi Stres di Hari Sibuk', text: 'Teknik 4-7-8: tarik napas 4 detik, tahan 7 detik, hembuskan 8 detik. Tiga kali pengulangan sudah cukup untuk menenangkan sistem saraf.', color: '#5BA970' },
  { article_id: 'artikel-stres-kerja', article_title: '5 Cara Mengatasi Stres di Hari Sibuk', text: 'Jangan menunggu merasa siap untuk beristirahat. Jadwalkan istirahat seperti kamu menjadwalkan meeting penting.', color: '#A78BFA' },
  { article_id: 'artikel-tidur-mental', article_title: 'Kenapa Tidur Cukup Itu Penting untuk Kesehatan Mental', text: 'Saat tidur, otakmu memproses emosi dan konsolidasi memori. Kurang tidur bukan sekadar lelah — ia adalah beban emosional yang menumpuk.', color: '#E596B2' },
  { article_id: 'artikel-tidur-mental', article_title: 'Kenapa Tidur Cukup Itu Penting untuk Kesehatan Mental', text: 'Konsistensi waktu tidur lebih penting dari durasi. Tidur dan bangun di jam yang sama setiap hari melatih ritme biologismu.', color: '#415f83' },
  { article_id: 'artikel-mindfulness', article_title: 'Mindfulness: Cara Mudah Hadir di Momen Ini', text: 'Mindfulness bukan tentang mengosongkan pikiran — tapi tentang mengamati pikiran tanpa menghakimi. Kamu hanya perlu menjadi saksi yang baik untuk dirimu sendiri.', color: '#5BA970' },
  { article_id: 'artikel-mindfulness', article_title: 'Mindfulness: Cara Mudah Hadir di Momen Ini', text: 'Mulai dari 5 menit sehari. Duduk, tutup mata, dan perhatikan napasmu. Saat pikiran mengembara — dan itu wajar — cukup bawa kembali perhatianmu ke napas.', color: '#A78BFA' },
  { article_id: 'artikel-mindfulness', article_title: 'Mindfulness: Cara Mudah Hadir di Momen Ini', text: 'Penelitian menunjukkan 8 minggu praktik mindfulness secara konsisten dapat mengubah struktur fisik otak di area yang mengatur emosi.', color: '#E596B2' },
  { article_id: 'artikel-self-compassion', article_title: 'Self-Compassion: Belajar Baik Hati pada Diri Sendiri', text: 'Kita sering memberi nasihat terbaik untuk orang lain, tapi lupa memberikannya untuk diri sendiri. Coba tanya: "Apa yang akan aku katakan ke teman yang sedang merasakannya?"', color: '#415f83' },
  { article_id: 'artikel-self-compassion', article_title: 'Self-Compassion: Belajar Baik Hati pada Diri Sendiri', text: 'Self-compassion bukan berarti tidak bertanggung jawab atau memanjakan diri. Justru penelitian menunjukkan orang yang berbelas kasih pada diri sendiri lebih termotivasi untuk berkembang.', color: '#5BA970' },
];

async function main() {
  let user;
  if (emailArg) {
    const r = await db.query('SELECT id, name FROM users WHERE email = $1', [emailArg]);
    user = r.rows[0];
  } else {
    const r = await db.query('SELECT id, name FROM users ORDER BY id ASC LIMIT 1');
    user = r.rows[0];
  }

  if (!user) {
    console.error('❌  Tidak ada user ditemukan. Daftar dulu lewat aplikasi, baru jalankan seed.');
    process.exit(1);
  }

  console.log(`🌱  Seeding data untuk user: ${user.name} (id=${user.id})`);

  let journalCount = 0;
  for (const j of journals) {
    try {
      await db.query(
        'INSERT INTO journals (user_id, mood, title, content, date, created_at) VALUES ($1, $2, $3, $4, $5, $6)',
        [user.id, j.mood, j.title, j.content, dateOnly(j.daysBack), daysAgo(j.daysBack)]
      );
      journalCount++;
    } catch (e) {
      console.warn(`  ⚠️  Skip journal "${j.title}": ${e.message}`);
    }
  }

  let highlightCount = 0;
  for (const h of highlights) {
    try {
      await db.query(
        'INSERT INTO highlights (user_id, article_id, article_title, text, color) VALUES ($1, $2, $3, $4, $5)',
        [user.id, h.article_id, h.article_title, h.text, h.color]
      );
      highlightCount++;
    } catch (e) {
      console.warn(`  ⚠️  Skip highlight: ${e.message}`);
    }
  }

  console.log(`✅  Selesai! Ditambahkan: ${journalCount} jurnal, ${highlightCount} highlight.`);
  process.exit(0);
}

main().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});

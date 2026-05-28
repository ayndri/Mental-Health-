/**
 * Seed mental health articles.
 * Usage: node src/db/seed-articles.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
const db = require('./database');

const ARTICLES = [
  {
    slug: 'memahami-kecemasan',
    title: 'Memahami Kecemasan: Ketika Rasa Khawatir Jadi Berlebihan',
    excerpt: 'Kecemasan adalah respons alami tubuh terhadap ancaman. Tapi ketika ia datang terus-menerus tanpa sebab jelas, ada yang perlu kamu perhatikan.',
    category: 'Kecemasan',
    emotion_tags: ['anxious', 'neutral'],
    author: 'Tim Seribu Cerita',
    read_time: 6,
    cover_gradient: 'linear-gradient(135deg, #EEF2FA 0%, #B0C8E8 100%)',
    cover_emoji: '😰',
    content: [
      { type: 'p', text: 'Pernahkah kamu tiba-tiba merasa jantung berdebar kencang, telapak tangan berkeringat, atau pikiran berputar-putar memikirkan hal yang belum tentu terjadi? Itulah kecemasan — respons alami yang dimiliki setiap manusia.' },
      { type: 'h2', text: 'Apa Itu Kecemasan?' },
      { type: 'p', text: 'Kecemasan adalah reaksi emosional dan fisik terhadap situasi yang dianggap mengancam atau tidak pasti. Dalam kadar wajar, kecemasan justru berguna — ia membantu kita waspada saat ujian, presentasi, atau menghadapi tantangan baru.' },
      { type: 'p', text: 'Namun ketika kecemasan muncul berlebihan, berlangsung lama, atau mengganggu aktivitas sehari-hari, ini bisa menjadi tanda gangguan kecemasan yang perlu mendapat perhatian.' },
      { type: 'h2', text: 'Tanda-tanda Kecemasan Berlebih' },
      { type: 'ul', items: [
        'Khawatir terus-menerus tentang berbagai hal, bahkan hal kecil',
        'Sulit berkonsentrasi karena pikiran selalu "berisik"',
        'Mudah lelah meski tidak banyak aktivitas fisik',
        'Gangguan tidur — sulit tidur atau tidur tidak nyenyak',
        'Ketegangan otot, sakit kepala, atau gangguan pencernaan',
        'Menghindari situasi tertentu karena takut berlebihan',
      ]},
      { type: 'h2', text: 'Apa yang Bisa Dilakukan?' },
      { type: 'p', text: 'Langkah pertama adalah mengakui bahwa kamu sedang cemas — itu bukan tanda kelemahan. Beberapa strategi yang terbukti membantu:' },
      { type: 'ul', items: [
        'Teknik pernapasan dalam (inhale 4 detik, tahan 4, exhale 6)',
        'Grounding technique: sebutkan 5 hal yang kamu lihat, 4 yang kamu dengar, 3 yang bisa kamu sentuh',
        'Batasi konsumsi berita dan media sosial jika memicu kecemasan',
        'Tulis kekhawatiranmu di jurnal — seringkali pikiran yang ditulis terasa lebih ringan',
        'Bicara dengan orang yang kamu percaya tentang perasaanmu',
      ]},
      { type: 'quote', text: '"Kamu tidak harus menghilangkan kecemasan sepenuhnya. Cukup belajar hidup bersamanya, sambil terus melangkah."' },
      { type: 'h2', text: 'Kapan Harus Mencari Bantuan?' },
      { type: 'p', text: 'Jika kecemasan sudah mengganggu pekerjaan, hubungan, atau kualitas tidurmu selama lebih dari dua minggu, pertimbangkan untuk berbicara dengan psikolog atau psikiater. Bantuan profesional bukan tanda kelemahan — justru sebaliknya.' },
    ],
  },
  {
    slug: 'mengatasi-overthinking',
    title: 'Overthinking? Cara Menenangkan Pikiran yang Tidak Berhenti',
    excerpt: 'Otak yang terus berputar memikirkan skenario terburuk bisa sangat melelahkan. Ini bukan berarti kamu lemah — ini berarti kamu perlu strategi yang tepat.',
    category: 'Kecemasan',
    emotion_tags: ['anxious', 'neutral'],
    author: 'Tim Seribu Cerita',
    read_time: 5,
    cover_gradient: 'linear-gradient(135deg, #FFFBEB 0%, #F5E090 100%)',
    cover_emoji: '🌀',
    content: [
      { type: 'p', text: 'Overthinking — atau dalam bahasa Indonesia sering disebut "kebanyakan pikir" — adalah kebiasaan mental yang membuat kita terjebak dalam lingkaran pikiran yang sama berulang kali. Bukan hanya melelahkan, tapi juga bisa melumpuhkan kemampuan kita untuk bertindak.' },
      { type: 'h2', text: 'Mengapa Kita Overthinking?' },
      { type: 'p', text: 'Otak kita dirancang untuk memecahkan masalah dan menghindari bahaya. Namun di dunia modern, "bahaya" seringkali bukan ancaman fisik, melainkan tekanan sosial, pekerjaan, atau ekspektasi. Akibatnya, otak terus "bekerja" bahkan ketika tidak ada yang perlu dipecahkan saat ini.' },
      { type: 'h2', text: 'Tanda Kamu Sedang Overthinking' },
      { type: 'ul', items: [
        'Memikirkan percakapan yang sudah lewat dan apa yang "seharusnya" kamu katakan',
        'Membayangkan skenario terburuk yang belum tentu terjadi',
        'Sulit membuat keputusan karena terlalu banyak mempertimbangkan',
        'Sering bertanya "bagaimana kalau..." dan "seandainya..."',
        'Merasa lelah meski tidak banyak aktivitas',
      ]},
      { type: 'h2', text: '5 Cara Memutus Siklus Overthinking' },
      { type: 'ul', items: [
        'Sadari dan beri nama: "Aku sedang overthinking sekarang." Kesadaran adalah langkah pertama.',
        'Tetapkan "waktu khawatir": luangkan 15 menit spesifik per hari untuk memikirkan kekhawatiranmu, di luar itu, alihkan perhatian.',
        'Tanya diri sendiri: "Apakah ini akan penting dalam 5 tahun?" — seringkali jawabannya tidak.',
        'Gerakkan tubuhmu: jalan kaki, olahraga, atau bahkan berdiri dan meregangkan badan bisa memutus pola pikir.',
        'Tulis isi pikiranmu: memindahkan pikiran ke kertas membantu otak "melepaskannya".',
      ]},
      { type: 'quote', text: '"Kamu tidak bisa mengendalikan semua yang terjadi, tapi kamu bisa memilih di mana kamu menaruh perhatianmu."' },
      { type: 'h2', text: 'Satu Hal yang Perlu Diingat' },
      { type: 'p', text: 'Overthinking seringkali adalah cara otak mencoba melindungi dirimu. Bukan musuh — tapi kebiasaan yang bisa diubah perlahan. Bersabarlah dengan dirimu sendiri dalam prosesnya.' },
    ],
  },
  {
    slug: 'mengatasi-kesedihan',
    title: 'Melewati Rasa Sedih: Panduan untuk Hati yang Lelah',
    excerpt: 'Sedih itu manusiawi. Tapi ada bedanya antara kesedihan yang normal dan yang perlu mendapat perhatian lebih. Kenali keduanya.',
    category: 'Kesedihan',
    emotion_tags: ['sad', 'neutral'],
    author: 'Tim Seribu Cerita',
    read_time: 7,
    cover_gradient: 'linear-gradient(135deg, #EEF2FA 0%, #9DB8D9 100%)',
    cover_emoji: '🌧️',
    content: [
      { type: 'p', text: 'Kesedihan adalah salah satu emosi paling universal yang pernah dirasakan manusia. Ia bisa datang karena kehilangan, kekecewaan, perpisahan, atau bahkan tanpa alasan yang jelas. Dan itu normal.' },
      { type: 'h2', text: 'Kesedihan yang Normal vs. yang Perlu Diperhatikan' },
      { type: 'p', text: 'Kesedihan normal biasanya datang bersamaan dengan peristiwa tertentu, perlahan mereda dalam beberapa hari atau minggu, dan tidak menghalangi fungsi sehari-hari sepenuhnya.' },
      { type: 'p', text: 'Kesedihan yang perlu mendapat perhatian lebih adalah ketika ia berlangsung lebih dari dua minggu, terasa sangat berat tanpa sebab jelas, disertai perasaan tidak berharga, atau mulai memengaruhi pekerjaan dan hubungan.' },
      { type: 'h2', text: 'Cara Melewati Rasa Sedih' },
      { type: 'ul', items: [
        'Izinkan dirimu untuk merasakannya — jangan paksa dirimu "baik-baik saja"',
        'Menangis itu boleh, bahkan menyehatkan secara fisiologis',
        'Ceritakan kepada seseorang yang kamu percaya, atau tuliskan di jurnal',
        'Jaga kebutuhan dasar: tidur cukup, makan teratur, gerak ringan',
        'Lakukan hal kecil yang memberi rasa pencapaian, meski sesederhana merapikan meja',
        'Hindari isolasi total — koneksi sosial penting bahkan ketika terasa berat',
      ]},
      { type: 'quote', text: '"Kesedihan bukan kelemahan. Ia adalah bukti bahwa kamu pernah mencintai sesuatu atau seseorang dengan sungguh-sungguh."' },
      { type: 'h2', text: 'Kapan Harus Berbicara dengan Profesional?' },
      { type: 'p', text: 'Jika kesedihanmu disertai pikiran untuk menyakiti diri sendiri, perasaan hampa yang berkepanjangan, atau kehilangan minat pada semua hal yang dulu kamu sukai — ini saatnya mencari bantuan profesional. Psikolog dan psikiater terlatih untuk membantumu melewati ini.' },
    ],
  },
  {
    slug: 'mengelola-kemarahan',
    title: 'Kemarahan yang Sehat: Belajar Mengelola Emosi Terpanas',
    excerpt: 'Marah bukan musuh — ia adalah sinyal penting. Yang membedakan adalah bagaimana kita meresponsnya, bukan apakah kita merasakannya.',
    category: 'Manajemen Emosi',
    emotion_tags: ['angry', 'neutral'],
    author: 'Tim Seribu Cerita',
    read_time: 5,
    cover_gradient: 'linear-gradient(135deg, #FFF0F5 0%, #F5A8C0 100%)',
    cover_emoji: '🔥',
    content: [
      { type: 'p', text: 'Kemarahan seringkali dipandang sebagai emosi "buruk" yang harus ditekan. Padahal, marah adalah sinyal biologis yang sangat penting — ia memberi tahu kita bahwa ada sesuatu yang tidak sesuai dengan nilai atau kebutuhan kita.' },
      { type: 'h2', text: 'Fungsi Kemarahan yang Sering Terlupakan' },
      { type: 'p', text: 'Kemarahan bisa menjadi bahan bakar untuk perubahan positif, mendorong kita menetapkan batasan yang sehat, dan bahkan melindungi orang-orang yang kita cintai. Masalahnya bukan pada marahnya — tapi pada cara kita mengekspresikannya.' },
      { type: 'h2', text: 'Tanda Kemarahan Sudah Tidak Sehat' },
      { type: 'ul', items: [
        'Marah sangat intens terhadap hal-hal kecil',
        'Menyakiti diri sendiri atau orang lain secara verbal maupun fisik',
        'Merasa menyesal setelah marah tapi polanya terus berulang',
        'Kemarahan yang datang tiba-tiba tanpa pemicu jelas',
        'Menggunakan kemarahan untuk mengontrol orang lain',
      ]},
      { type: 'h2', text: 'Teknik Mengelola Kemarahan' },
      { type: 'ul', items: [
        'Pause sebelum merespons: tarik napas dalam, hitung hingga 10',
        'Identifikasi apa yang sebenarnya memicunya — seringkali bukan hal yang tampak di permukaan',
        'Ekspresikan dengan kata-kata: "Aku merasa marah karena..." bukan "Kamu selalu..."',
        'Keluarkan energi dengan cara sehat: olahraga, menulis, atau berbicara dengan seseorang',
        'Beri dirimu ruang untuk mendinginkan diri sebelum berdiskusi',
      ]},
      { type: 'quote', text: '"Di antara stimulus dan respons ada sebuah ruang. Di ruang itulah kekuatan dan kebebasanmu berada." — Viktor Frankl' },
    ],
  },
  {
    slug: 'self-care-yang-beneran-bekerja',
    title: 'Self-Care yang Beneran Bekerja (Bukan Sekadar Mandi Busa)',
    excerpt: 'Self-care bukan cuma soal lilin aromaterapi atau spa hari Minggu. Ini tentang kebiasaan kecil sehari-hari yang menjaga tanki emosionalmu tetap terisi.',
    category: 'Self-Care',
    emotion_tags: ['neutral', 'sad', 'anxious', 'happy'],
    author: 'Tim Seribu Cerita',
    read_time: 6,
    cover_gradient: 'linear-gradient(135deg, #EBF6EE 0%, #A8DDB5 100%)',
    cover_emoji: '🌱',
    content: [
      { type: 'p', text: 'Media sosial seringkali menggambarkan self-care sebagai sesuatu yang mahal, instagramable, dan membutuhkan waktu luang. Padahal, self-care yang paling efektif justru adalah hal-hal kecil yang dilakukan konsisten setiap hari.' },
      { type: 'h2', text: 'Pilar Self-Care yang Sering Diabaikan' },
      { type: 'h2', text: '1. Tidur yang Cukup' },
      { type: 'p', text: 'Tidak ada suplemen, meditasi, atau rutinitas pagi yang bisa menggantikan tidur 7-9 jam berkualitas. Tidur adalah saat otak memproses emosi, memperkuat memori, dan memulihkan seluruh sistem tubuh.' },
      { type: 'h2', text: '2. Batasan yang Sehat (Boundaries)' },
      { type: 'p', text: 'Mengatakan "tidak" kepada hal yang menguras energimu adalah bentuk self-care yang kuat. Ini bukan egois — ini adalah cara menjaga dirimu agar bisa terus hadir untuk orang-orang yang kamu cintai.' },
      { type: 'h2', text: '3. Koneksi Sosial yang Bermakna' },
      { type: 'p', text: 'Manusia adalah makhluk sosial. Satu percakapan mendalam dengan seseorang yang benar-benar mendengarkan lebih menyehatkan daripada ratusan likes di Instagram.' },
      { type: 'h2', text: 'Kebiasaan Kecil yang Dampaknya Besar' },
      { type: 'ul', items: [
        'Minum air yang cukup — dehidrasi ringan sudah bisa memengaruhi suasana hati',
        'Gerak 20-30 menit sehari, bahkan jalan santai di sekitar rumah',
        'Jeda dari layar setiap jam, minimal 5 menit',
        'Tulis 3 hal yang kamu syukuri sebelum tidur',
        'Masak atau menyiapkan makanan bergizi untuk dirimu sendiri',
      ]},
      { type: 'quote', text: '"Kamu tidak bisa mengisi dari gelas yang kosong. Merawat dirimu sendiri bukan keserakahan — itu kebutuhan."' },
    ],
  },
  {
    slug: 'journaling-untuk-kesehatan-mental',
    title: 'Journaling: Kenapa Menulis Perasaanmu Bisa Sangat Menyehatkan',
    excerpt: 'Ada alasan ilmiah mengapa menulis jurnal membuat lebih lega. Ini bukan sekadar tren — ini adalah salah satu alat kesehatan mental paling efektif yang bisa kamu mulai hari ini.',
    category: 'Self-Care',
    emotion_tags: ['neutral', 'sad', 'anxious', 'happy'],
    author: 'Tim Seribu Cerita',
    read_time: 5,
    cover_gradient: 'linear-gradient(135deg, #FFFBEB 0%, #F5D78A 100%)',
    cover_emoji: '📔',
    content: [
      { type: 'p', text: 'Penelitian dari Dr. James Pennebaker dari University of Texas membuktikan: menulis tentang pikiran dan perasaan terdalam selama 15-20 menit per hari selama beberapa hari bisa secara signifikan meningkatkan kesejahteraan psikologis.' },
      { type: 'h2', text: 'Mengapa Journaling Bekerja?' },
      { type: 'p', text: 'Ketika kamu menulis, otak bagian prefrontal cortex (yang bertanggung jawab atas penalaran) mulai bekerja memproses emosi. Ini membantu menurunkan aktivitas amygdala — pusat kecemasan dan respons "fight or flight" — sehingga kamu merasa lebih tenang.' },
      { type: 'p', text: 'Selain itu, menulis membantu kamu melihat pola dalam pikiranmu, mendapatkan jarak emosional dari masalah, dan memperjelas apa yang sebenarnya kamu rasakan.' },
      { type: 'h2', text: 'Cara Memulai (Tanpa Tekanan)' },
      { type: 'ul', items: [
        'Tidak perlu tulisan yang bagus atau grammar yang benar — tulis saja apa yang ada di kepala',
        'Mulai dengan 5 menit per hari, lalu tingkatkan sesuai kenyamanan',
        'Coba prompt sederhana: "Hari ini aku merasa..." atau "Yang paling menggangguku adalah..."',
        'Tidak harus setiap hari — bahkan sekali seminggu sudah bermanfaat',
        'Gunakan media apa pun: buku fisik, aplikasi, atau dokumen digital',
      ]},
      { type: 'h2', text: 'Tipe Journaling yang Bisa Dicoba' },
      { type: 'ul', items: [
        'Gratitude journal: tulis 3 hal yang kamu syukuri hari ini',
        'Brain dump: tulis SEMUA yang ada di pikiranmu tanpa filter',
        'Emotion journal: fokus pada satu emosi dan eksplorasi dari mana ia datang',
        'Future self journal: tulis surat kepada dirimu di masa depan',
      ]},
      { type: 'quote', text: '"Journal adalah tempat di mana kamu bisa jujur sepenuhnya — tidak ada yang menghakimi, tidak ada yang perlu kamu jaga perasaannya."' },
    ],
  },
  {
    slug: 'pentingnya-bercerita',
    title: 'Pentingnya Bercerita: Mengapa Curhat Itu Menyehatkan',
    excerpt: 'Ada alasan mengapa kita merasa lebih ringan setelah berbagi cerita. Ini bukan kelemahan — ini adalah salah satu mekanisme penyembuhan paling kuno dan efektif yang dimiliki manusia.',
    category: 'Komunikasi',
    emotion_tags: ['neutral', 'sad', 'anxious'],
    author: 'Tim Seribu Cerita',
    read_time: 4,
    cover_gradient: 'linear-gradient(135deg, #FEF0F5 0%, #F5A8C0 100%)',
    cover_emoji: '💬',
    content: [
      { type: 'p', text: 'Sejak ribuan tahun lalu, manusia menyembuhkan diri melalui bercerita. Dari ritual adat, tradisi lisan, hingga terapi modern — inti dari semua itu adalah satu: mengungkapkan apa yang ada di dalam, kepada seseorang yang mendengarkan.' },
      { type: 'h2', text: 'Apa yang Terjadi di Otak Saat Kamu Bercerita' },
      { type: 'p', text: 'Ketika kamu menceritakan pengalaman emosionalmu, otak membantu "mengintegrasikan" memori tersebut — menghubungkan fakta (apa yang terjadi) dengan emosi (bagaimana rasanya). Proses ini disebut narrative processing, dan ia secara aktif mengurangi intensitas emosi negatif.' },
      { type: 'h2', text: 'Manfaat Curhat yang Terbukti' },
      { type: 'ul', items: [
        'Menurunkan kadar kortisol (hormon stres) dalam tubuh',
        'Membantu otak memproses dan "menutup" pengalaman yang menyakitkan',
        'Meningkatkan rasa keterhubungan dan tidak sendirian',
        'Seringkali membuka perspektif baru tentang masalah',
        'Memberi rasa lega yang nyata secara fisiologis',
      ]},
      { type: 'h2', text: 'Tidak Mudah Bercerita? Ini Normal' },
      { type: 'p', text: 'Banyak orang tumbuh dengan pesan bahwa emosi harus disimpan sendiri, atau takut menjadi beban bagi orang lain. Tapi menjaga semuanya sendiri justru yang membuat beban itu semakin berat.' },
      { type: 'p', text: 'Kamu tidak harus menceritakan semuanya sekaligus. Mulai dengan hal kecil. Kepada satu orang yang kamu percaya. Atau tuliskan dulu di jurnal sebelum siap berbagi dengan orang lain.' },
      { type: 'quote', text: '"Kamu tidak harus menanggung semuanya sendiri. Meminta seseorang untuk mendengarkan bukan beban — itu adalah kepercayaan yang kamu berikan."' },
    ],
  },
  {
    slug: 'kapan-harus-ke-psikolog',
    title: 'Kapan Harus ke Psikolog? Tanda-tanda yang Tidak Boleh Diabaikan',
    excerpt: 'Masih banyak yang menunggu sampai "parah" sebelum mencari bantuan. Padahal semakin awal kamu datang, semakin mudah prosesnya.',
    category: 'Bantuan Profesional',
    emotion_tags: ['neutral', 'sad', 'anxious', 'angry'],
    author: 'Tim Seribu Cerita',
    read_time: 5,
    cover_gradient: 'linear-gradient(135deg, #EBF6EE 0%, #88C99A 100%)',
    cover_emoji: '🩺',
    content: [
      { type: 'p', text: 'Salah satu mitos terbesar tentang kesehatan mental adalah bahwa kamu harus benar-benar "tidak bisa berfungsi" sebelum layak mencari bantuan profesional. Padahal, pergi ke psikolog ketika kamu masih oke justru adalah tanda kecerdasan emosional.' },
      { type: 'h2', text: 'Tanda Sudah Waktunya Berbicara dengan Profesional' },
      { type: 'ul', items: [
        'Perasaan sedih, cemas, atau marah yang berlangsung lebih dari 2 minggu',
        'Gangguan tidur yang memengaruhi fungsi sehari-hari',
        'Menarik diri dari hubungan sosial dan aktivitas yang dulu disukai',
        'Kesulitan berkonsentrasi di pekerjaan atau sekolah',
        'Pikiran untuk menyakiti diri sendiri (ini darurat — segera cari bantuan)',
        'Merasa tidak ada harapan atau tujuan hidup',
        'Menggunakan alkohol, zat, atau perilaku tertentu untuk "kabur" dari perasaan',
      ]},
      { type: 'h2', text: 'Kamu Tidak Harus "Gila" untuk ke Psikolog' },
      { type: 'p', text: 'Psikolog membantu siapa saja yang ingin memahami diri lebih baik, mengelola stres lebih efektif, memperbaiki hubungan, atau melewati masa transisi hidup. Ini bukan hanya untuk kondisi klinis berat.' },
      { type: 'h2', text: 'Psikolog vs. Psikiater: Apa Bedanya?' },
      { type: 'p', text: 'Psikolog adalah ahli yang membantu melalui terapi bicara dan berbagai pendekatan psikologis. Psikiater adalah dokter spesialis yang bisa memberikan diagnosis medis dan resep obat jika diperlukan. Keduanya bisa bekerja sama dalam penangananmu.' },
      { type: 'quote', text: '"Mencari bantuan bukan berarti kamu lemah. Itu berarti kamu cukup bijak untuk mengenali kapan kamu butuh dukungan lebih."' },
      { type: 'h2', text: 'Mulai dari Mana?' },
      { type: 'p', text: 'Kamu bisa menggunakan fitur Cari Faskes di Seribu Cerita untuk menemukan psikolog, psikiater, dan klinik kesehatan mental terdekat di kotamu.' },
    ],
  },
];

async function seedArticles() {
  console.log('Seeding articles...');
  let inserted = 0;
  let skipped  = 0;

  for (const art of ARTICLES) {
    try {
      const existing = await db.query('SELECT id FROM articles WHERE slug = $1', [art.slug]);
      if (existing.rows[0]) { skipped++; continue; }

      await db.query(
        `INSERT INTO articles
          (slug, title, excerpt, category, emotion_tags, content, author, read_time, cover_gradient, cover_emoji)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [
          art.slug, art.title, art.excerpt, art.category,
          art.emotion_tags,
          JSON.stringify(art.content),
          art.author, art.read_time,
          art.cover_gradient, art.cover_emoji,
        ]
      );
      inserted++;
      console.log(`  ✓ ${art.title}`);
    } catch (err) {
      console.error(`  ✗ ${art.slug}:`, err.message);
    }
  }

  console.log(`\nDone: ${inserted} inserted, ${skipped} already exist.`);
  process.exit(0);
}

seedArticles();

const Anthropic = require('@anthropic-ai/sdk');

const SYSTEM_PROMPT = `Kamu adalah Sari, teman curhat yang hangat dan peduli dari aplikasi Seribu Cerita — platform kesehatan mental digital.

Tugasmu adalah mendengarkan dengan penuh perhatian dan memberikan dukungan emosional kepada pengguna.

Panduan:
- Gunakan Bahasa Indonesia yang santai dan bersahabat, seperti ngobrol dengan teman sebaya
- Validasi perasaan pengguna dulu sebelum kasih saran — buat mereka merasa didengar
- Ajukan pertanyaan terbuka untuk membantu pengguna lebih memahami dirinya
- Berikan strategi coping yang praktis dan mudah dilakukan saat diminta
- Jangan mendiagnosis, meresepkan obat, atau mengaku sebagai terapis/psikolog
- Kalau situasinya serius atau mengancam keselamatan, dorong pengguna cari bantuan profesional
- Respons ringkas (2-4 kalimat), hangat, dan fokus — tidak perlu panjang
- Boleh pakai emoji secara alami untuk suasana yang lebih bersahabat 🌸

Ingat: kamu teman yang mendengarkan, bukan terapis profesional.`;

const EMOTION_MAP = [
  ['happy',   ['senang', 'bahagia', 'gembira', 'happy', 'seru', 'semangat', 'excited', 'lega', 'syukur']],
  ['sad',     ['sedih', 'menangis', 'nangis', 'galau', 'down', 'kesepian', 'patah hati', 'hancur', 'kecewa']],
  ['anxious', ['cemas', 'khawatir', 'takut', 'gelisah', 'panik', 'gugup', 'stres', 'stress', 'overthinking', 'overwhelm']],
  ['angry',   ['marah', 'kesal', 'sebal', 'jengkel', 'frustrasi', 'benci', 'emosi', 'gondok']],
];

function detectEmotion(text) {
  const lower = text.toLowerCase();
  for (const [emotion, keywords] of EMOTION_MAP) {
    if (keywords.some(kw => lower.includes(kw))) return emotion;
  }
  return 'neutral';
}

let client = null;
if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your_anthropic_api_key_here') {
  client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

async function getChatResponse(userMessage, chatHistory = []) {
  if (!client) {
    return 'Halo! Aku Sari 🌸 Maaf, aku sedang dalam mode offline nih. Tapi aku tetap di sini untukmu ya! Pastikan ANTHROPIC_API_KEY sudah diisi di file .env untuk mengaktifkan Sari sepenuhnya.';
  }

  const messages = [];

  // inject last 6 turns as context
  for (const chat of chatHistory.slice(-6)) {
    messages.push({ role: 'user', content: chat.message });
    if (chat.coping_strategy) {
      messages.push({ role: 'assistant', content: chat.coping_strategy });
    }
  }
  messages.push({ role: 'user', content: userMessage });

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 400,
    system: SYSTEM_PROMPT,
    messages,
  });

  return response.content[0].text;
}

module.exports = { getChatResponse, detectEmotion };

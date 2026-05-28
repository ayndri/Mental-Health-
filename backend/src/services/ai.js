const HF_CHAT_URL = 'https://syahrulw-seribucerita-emotion.hf.space/chat';

async function getAIResponse(userMessage, chatHistory = []) {
  const history = [];
  for (const chat of chatHistory) {
    history.push({ role: 'user', content: chat.message });
    if (chat.coping_strategy) {
      history.push({ role: 'assistant', content: chat.coping_strategy });
    }
  }

  const response = await fetch(HF_CHAT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: userMessage, history, calibrate: true }),
    signal: AbortSignal.timeout(25000),
  });

  if (!response.ok) {
    throw new Error(`HF API error: ${response.status}`);
  }

  const data = await response.json();
  // Normalize HF labels (fear→anxious, anger→angry) to match app labels
  const LABEL_MAP = { fear: 'anxious', anger: 'angry' };
  const rawLabel = data.emotion?.label ?? 'neutral';
  const emotion = LABEL_MAP[rawLabel] ?? rawLabel;

  let emotionScores = null;
  if (data.emotion?.scores) {
    emotionScores = {};
    for (const [k, v] of Object.entries(data.emotion.scores)) {
      emotionScores[LABEL_MAP[k] ?? k] = v;
    }
  }

  return { emotion, emotionScores, aiReply: data.ai_response };
}

// ─── Generate summary article via Anthropic ───────────────────────────────────
async function generateSummary(history) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return buildFallbackSummary(history);
  }

  try {
    const Anthropic = require('@anthropic-ai/sdk');
    const client = new Anthropic();

    const conversationText = history
      .map(m => `${m.role === 'user' ? 'Pengguna' : 'Sari'}: ${m.content}`)
      .join('\n');

    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 700,
      messages: [
        {
          role: 'user',
          content: `Kamu adalah psikolog yang ahli dalam menulis ringkasan reflektif. Berdasarkan percakapan antara pengguna dan AI companion kesehatan mental bernama Sari:

${conversationText}

Tulis ringkasan artikel dalam Bahasa Indonesia yang hangat dan suportif. Balas HANYA dengan JSON valid tanpa komentar:
{
  "title": "judul yang personal dan menyentuh, maks 8 kata",
  "emotion": "1-2 kata emosi dominan dalam Bahasa Indonesia",
  "emotion_key": "satu kata dari: anxious, sad, angry, happy, neutral",
  "emotion_emoji": "1 emoji yang merepresentasikan emosi",
  "insight": "2-3 kalimat insight utama tentang apa yang sedang dirasakan pengguna, tulis dengan hangat",
  "tips": ["saran praktis pertama dalam 1 kalimat", "saran praktis kedua", "saran praktis ketiga"],
  "closing": "1 kalimat penutup yang hangat, personal, dan memberi semangat"
}`,
        },
      ],
    });

    const text = msg.content[0].text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return buildFallbackSummary(history);
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error('generateSummary error:', err);
    return buildFallbackSummary(history);
  }
}

function buildFallbackSummary(history) {
  const userMessages = history.filter(m => m.role === 'user');
  const count = userMessages.length;
  return {
    title: 'Terima Kasih Sudah Berbagi',
    emotion: 'tenang',
    emotion_key: 'neutral',
    emotion_emoji: '💙',
    insight: `Kamu sudah mengambil langkah luar biasa dengan berbagi perasaanmu dalam ${count} pesan. Setiap cerita yang kamu ungkapkan adalah bagian dari perjalanan mengenal dirimu sendiri — dan itu bukan hal yang mudah.`,
    tips: [
      'Luangkan waktu 5 menit setiap hari untuk menulis jurnal perasaanmu',
      'Jangan ragu untuk berbagi dengan orang yang kamu percaya',
      'Ingat bahwa meminta bantuan adalah tanda kekuatan, bukan kelemahan',
    ],
    closing: 'Kamu tidak sendirian — dan setiap langkah kecil yang kamu ambil hari ini adalah kemajuan yang luar biasa 💙',
  };
}

module.exports = { getAIResponse, generateSummary };

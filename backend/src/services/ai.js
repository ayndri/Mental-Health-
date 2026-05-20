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
  return {
    emotion: data.emotion?.label ?? 'neutral',
    aiReply: data.ai_response,
  };
}

module.exports = { getAIResponse };

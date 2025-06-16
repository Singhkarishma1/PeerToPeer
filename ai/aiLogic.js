const axios = require('axios');

async function generateWithGroq(prompt) {
  const response = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: "llama2-70b-4096",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data.choices[0].message.content;
}

async function getAIMatches(currentUser, otherUsers) {
  const matches = [];
  for (const peer of otherUsers) {
    const prompt = `
User A: ${JSON.stringify(currentUser.personalInfo)}
User B: ${JSON.stringify(peer.personalInfo)}
Are these two users a good peer learning match? Reply with a score (0-10) and a one-sentence reason.\nFormat: Score: <number>, Reason: <reason>
    `;
    const aiResult = await generateWithGroq(prompt);
    matches.push({
      peerId: peer._id,
      name: peer.personalInfo.fullName,
      email: peer.personalInfo.email,
      aiResult
    });
  }
  return matches;
}

module.exports = { getAIMatches };

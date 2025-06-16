const axios = require('axios');
require('dotenv').config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/v1/chat/completions';

async function generateWithGroq(prompt) {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not defined in environment variables');
  }

  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1024
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Groq API error:', error.response?.data || error.message);
    throw new Error('Failed to generate response from Groq API');
  }
}

module.exports = { generateWithGroq }; 
const express = require('express');
const router = express.Router();
const User = require('../backend/models/User'); // Adjust path if needed
const { getAIMatches } = require('./aiLogic');
const { generateWithGroq } = require('./groqClient');

router.post('/ai-match', async (req, res) => {
  const { userId } = req.body;
  try {
    const currentUser = await User.findById(userId);
    if (!currentUser) return res.status(404).json({ error: 'User not found' });

    const otherUsers = await User.find({ _id: { $ne: userId } }).limit(10);
    const matches = await getAIMatches(currentUser, otherUsers);

    res.json({ matches });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route for generating AI responses
router.post('/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const result = await generateWithGroq(prompt);
    res.json({ result });
  } catch (error) {
    console.error('AI generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

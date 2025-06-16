const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Get dashboard data
router.get('/', auth, async (req, res) => {
  try {
    // In a real application, you would fetch this data from your database
    // and calculate real-time statistics from your P2P network
    const dashboardData = {
      stats: {
        totalConnections: 12,
        activePeers: 5,
        sharedFiles: 8,
        downloadSpeed: '2.5 MB/s',
        uploadSpeed: '1.8 MB/s'
      },
      recentActivity: [
        {
          type: 'download',
          description: 'Downloaded "project_documentation.pdf" from peer_123',
          timestamp: '2 minutes ago'
        },
        {
          type: 'upload',
          description: 'Shared "presentation.pptx" with peer_456',
          timestamp: '15 minutes ago'
        },
        {
          type: 'connection',
          description: 'New peer connected: peer_789',
          timestamp: '1 hour ago'
        }
      ]
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

module.exports = router; 
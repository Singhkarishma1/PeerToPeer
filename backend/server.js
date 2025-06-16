const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const axios = require('axios');
require('dotenv').config();
const { generateWithGroq } = require('../ai/groqClient');
const User = require('./models/User');
const Notification = require('./models/Notification');
const Chat = require('./models/Chat');
const aiRoutes = require('../ai/aiRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));
app.use(express.json());

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`);
  }
});
const upload = multer({ storage });

// Serve uploads folder as static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB at:', MONGODB_URI);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Sign In Route
app.post('/api/signin', async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ "personalInfo.email": email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Send response
    res.status(200).json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.personalInfo.email,
        phone: user.phone,
        location: user.location,
        subjects: user.subjects
      }
    });
  } catch (error) {
    console.error('Sign in error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Register Route
app.post('/api/register', async (req, res) => {
  try {
    let { fullName, email, password, phone, location } = req.body;
    email = email.toLowerCase();

    // Validate input
    if (!fullName || !email || !password || !phone || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      personalInfo: {
        fullName,
        email,
        phone,
        location,
        profilePicture: "https://via.placeholder.com/40"
      },
      password: hashedPassword,
      education: {
        institution: "",
        degree: "",
        fieldOfStudy: "",
        graduationYear: 0
      },
      availability: {
        preferredDays: [],
        preferredTimes: [],
        timezone: ""
      }
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Send response
    res.status(201).json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.personalInfo.email,
        phone: user.phone,
        location: user.location,
        subjects: user.subjects
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Profile Routes
app.get('/api/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

app.put('/api/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user profile
    Object.assign(user, req.body);
    await user.save();

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    if (error.name === 'ValidationError') {
      // Return detailed validation error messages
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Profile picture upload endpoint
app.post('/api/upload-profile-picture', verifyToken, upload.single('profilePicture'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  // Return the URL to the uploaded image
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// AI Match Explanation Route
app.post('/api/groq-generate', async (req, res) => {
  const { prompt } = req.body;
  try {
    const result = await generateWithGroq(prompt);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI-Powered Peer Matching Route
app.post('/api/ai-match', async (req, res) => {
  const { userId } = req.body;
  try {
    const currentUser = await User.findById(userId);
    if (!currentUser) return res.status(404).json({ error: 'User not found' });

    // Find potential matches (all other users)
    const otherUsers = await User.find({ _id: { $ne: userId } }).limit(10);

    // For each, ask Groq for a match explanation
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

    res.json({ matches });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Notification Routes
app.get('/api/notifications', verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

app.post('/api/notifications/read', verifyToken, async (req, res) => {
  try {
    const { notificationIds } = req.body;
    await Notification.updateMany(
      { _id: { $in: notificationIds }, userId: req.userId },
      { $set: { read: true } }
    );
    res.json({ message: 'Notifications marked as read' });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    res.status(500).json({ message: 'Error marking notifications as read' });
  }
});

// Chat Routes
app.get('/api/chats/recent', verifyToken, async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.userId })
      .populate('participants', 'personalInfo.fullName personalInfo.profilePicture')
      .sort({ lastMessageTime: -1 })
      .limit(10);

    const formattedChats = chats.map(chat => {
      const peer = chat.participants.find(p => p._id.toString() !== req.userId);
      const unreadCount = chat.messages.filter(m => 
        m.sender.toString() !== req.userId && !m.read
      ).length;

      return {
        _id: chat._id,
        peerId: peer._id,
        peerName: peer.personalInfo.fullName,
        peerProfile: peer.personalInfo.profilePicture,
        lastMessage: chat.lastMessage,
        lastMessageTime: chat.lastMessageTime,
        unreadCount
      };
    });

    res.json(formattedChats);
  } catch (error) {
    console.error('Error fetching recent chats:', error);
    res.status(500).json({ message: 'Error fetching recent chats' });
  }
});

app.get('/api/chats/:peerId', verifyToken, async (req, res) => {
  try {
    const { peerId } = req.params;
    
    // Find or create chat
    let chat = await Chat.findOne({
      participants: { $all: [req.userId, peerId] }
    }).populate('participants', 'personalInfo.fullName personalInfo.profilePicture');

    if (!chat) {
      chat = await Chat.create({
        participants: [req.userId, peerId],
        messages: []
      });
      chat = await chat.populate('participants', 'personalInfo.fullName personalInfo.profilePicture');
    }

    // Mark messages as read
    await Chat.updateMany(
      { 
        _id: chat._id,
        'messages.sender': peerId,
        'messages.read': false
      },
      { $set: { 'messages.$[].read': true } }
    );

    res.json(chat);
  } catch (error) {
    console.error('Error fetching chat:', error);
    res.status(500).json({ message: 'Error fetching chat' });
  }
});

app.post('/api/chats/:peerId/messages', verifyToken, async (req, res) => {
  try {
    const { peerId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const chat = await Chat.findOneAndUpdate(
      { participants: { $all: [req.userId, peerId] } },
      {
        $push: {
          messages: {
            sender: req.userId,
            content
          }
        },
        $set: {
          lastMessage: content,
          lastMessageTime: new Date()
        }
      },
      { new: true }
    ).populate('participants', 'personalInfo.fullName personalInfo.profilePicture');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Create notification for the peer
    await Notification.create({
      userId: peerId,
      message: `New message from ${user.personalInfo.fullName}`,
      type: 'message',
      link: `/chats/${req.userId}`
    });

    res.json(chat);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
});

app.use('/api', aiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
// backend/routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  sendMessage,
  getChatMessages,
  getChatList,
  deleteConversation,
} = require('../controllers/chatController');

// Get the list of chat conversations for the logged-in user
router.get('/list', protect, getChatList);

// Get messages for a specific booking
router.get('/:bookingId', protect, getChatMessages);

// Send a new message
router.post('/', protect, sendMessage);

// Delete a conversation by booking ID
router.delete('/:bookingId', protect, deleteConversation);

module.exports = router;

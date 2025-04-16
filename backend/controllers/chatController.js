// backend/controllers/chatController.js
const ChatMessage = require('../models/ChatMessage');
const Booking = require('../models/Booking');

// GET /api/chat/list
// Returns a list of conversations for the logged-in user.
exports.getChatList = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all bookings where the user is either student or faculty.
    const bookings = await Booking.find({
      $or: [{ student: userId }, { faculty: userId }],
    });

    const bookingIds = bookings.map(b => b._id);

    // Fetch all messages for these bookings, sorted oldest first.
    const messages = await ChatMessage.find({
      booking: { $in: bookingIds },
    }).sort({ createdAt: 1 });

    // Group messages by booking id.
    const conversationMap = {};
    messages.forEach(msg => {
      const bid = msg.booking.toString();
      if (!conversationMap[bid]) {
        conversationMap[bid] = [];
      }
      conversationMap[bid].push(msg);
    });

    // Build conversation summary for each booking.
    const conversationList = bookings.map(booking => {
      const convMessages = conversationMap[booking._id.toString()] || [];
      return {
        bookingId: booking._id,
        sessionDate: booking.sessionDate,
        duration: booking.duration,
        cost: booking.cost,
        status: booking.paymentStatus,
        lastMessage: convMessages.length > 0
          ? convMessages[convMessages.length - 1].message
          : '',
        // You can also add details like names of the other party
      };
    });

    res.json(conversationList);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching conversation list',
      error: error.message,
    });
  }
};

// GET /api/chat/:bookingId
// Returns all chat messages for a given booking (conversation), sorted by createdAt.
exports.getChatMessages = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const messages = await ChatMessage.find({ booking: bookingId })
      .sort({ createdAt: 1 })
      .populate('sender', 'name');

    res.json(messages);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching chat messages',
      error: error.message,
    });
  }
};

// POST /api/chat
// Saves a new chat message for a given booking.
exports.sendMessage = async (req, res) => {
  try {
    const { bookingId, message } = req.body;

    const newMessage = await ChatMessage.create({
      booking: bookingId,
      sender: req.user._id,
      message,
    });

    const populatedMessage = await newMessage.populate('sender', 'name');
    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({
      message: 'Error sending message',
      error: error.message,
    });
  }
};

// DELETE /api/chat/:bookingId
// Deletes all messages for a specific booking (conversation).
exports.deleteConversation = async (req, res) => {
  try {
    const { bookingId } = req.params;

    await ChatMessage.deleteMany({ booking: bookingId });

    res.status(200).json({ message: 'Chat conversation deleted successfully.' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting conversation',
      error: error.message,
    });
  }
};

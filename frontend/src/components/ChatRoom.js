// frontend/src/components/ChatRoom.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './Chat.css';

function ChatRoom() {
  const { conversation } = useLocation().state || {};
  const bookingId = conversation?.bookingId;
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!bookingId) return;
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/chat/${bookingId}`,
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        setMessages(data);
      } catch (error) {
        console.error('Error fetching chat messages', error);
      }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [bookingId, userInfo.token]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await axios.post(
        'http://localhost:5000/api/chat',
        { bookingId, message: newMessage },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setNewMessage('');
      const { data } = await axios.get(
        `http://localhost:5000/api/chat/${bookingId}`,
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setMessages(data);
    } catch (error) {
      console.error('Error sending message', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">Chat Room</div>
      <div className="chat-body">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`chat-bubble ${msg.sender.name === userInfo.name ? 'sent' : 'received'}`}
          >
            <span className="chat-sender">{msg.sender.name}</span>
            <span className="chat-text">{msg.message}</span>
          </div>
        ))}
      </div>
      <div className="chat-footer">
        <input
          type="text"
          className="chat-input"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button className="chat-send" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatRoom;

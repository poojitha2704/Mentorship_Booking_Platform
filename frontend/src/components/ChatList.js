// frontend/src/components/ChatList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ChatList() {
  const [conversations, setConversations] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await axios.get(
          'http://localhost:5000/api/chat/list',
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        setConversations(data);
      } catch (error) {
        console.error('Error fetching conversations', error);
      }
    };
    fetchConversations();
  }, [userInfo.token]);

  const getOtherPersonName = (conv) => {
    if (!conv || !conv.participants || conv.participants.length < 2) return 'Unknown';
    const otherPerson = conv.participants.find(p => p._id !== userInfo._id);
    return otherPerson ? otherPerson.name : 'Unknown';
  };

  const deleteConversation = async (bookingId) => {
    try {
      await axios.delete(`http://localhost:5000/api/chat/${bookingId}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      setConversations(prev => prev.filter(conv => conv.bookingId !== bookingId));
    } catch (error) {
      console.error('Error deleting conversation', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 
        className="common-container text-center" 
        style={{ background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)', color: 'white' }}
      >
        Conversations
      </h2>
      {conversations.length > 0 ? (
        conversations.map((conv) => (
          <div
            key={conv.bookingId}
            className="card mb-3"
            style={{ cursor: 'pointer', position: 'relative' }}
          >
            <div className="card-body" onClick={() => navigate('/chat-room', { state: { conversation: conv } })}>
              <p>
                <strong>{getOtherPersonName(conv)}</strong>
              </p>
              <p>
                <strong>Last Message:</strong> {conv.lastMessage || 'No messages yet.'}
              </p>
            </div>
            <button
              onClick={() => deleteConversation(conv.bookingId)}
              style={{ position: 'absolute', top: '10px', right: '10px' }}
              className="btn btn-sm btn-danger"
            >
              Delete
            </button>
          </div>
        ))
      ) : (
        <p
          className="common-container text-center"
          style={{ background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)', color: 'white', padding: '1rem', borderRadius: '8px' }}
        >
          No conversations found.
        </p>
      )}
    </div>
  );
}

export default ChatList;

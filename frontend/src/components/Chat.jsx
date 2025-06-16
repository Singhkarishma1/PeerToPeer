import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [peer, setPeer] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const { peerId } = useParams();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/chats/${peerId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMessages(response.data.messages);
        const peerUser = response.data.participants.find(p => p._id !== localStorage.getItem('userId'));
        setPeer(peerUser);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching chat:', error);
        setLoading(false);
      }
    };

    fetchChat();
    // Set up polling for new messages every 5 seconds
    const interval = setInterval(fetchChat, 5000);
    return () => clearInterval(interval);
  }, [peerId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/chats/${peerId}/messages`,
        { content: newMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setMessages(response.data.messages);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A3BFF]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {/* Chat Header */}
      <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <img
          src={peer?.personalInfo?.profilePicture || "https://via.placeholder.com/40"}
          alt={peer?.personalInfo?.fullName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="ml-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {peer?.personalInfo?.fullName}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {peer?.personalInfo?.bio || "Peer"}
          </p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwnMessage = message.sender === localStorage.getItem('userId');
          return (
            <div
              key={message._id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  isOwnMessage
                    ? 'bg-[#4A3BFF] text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A3BFF] dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-[#4A3BFF] text-white rounded-lg hover:bg-[#3A2BFF] focus:outline-none focus:ring-2 focus:ring-[#4A3BFF] focus:ring-offset-2"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat; 
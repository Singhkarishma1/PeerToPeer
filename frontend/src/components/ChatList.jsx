import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/chats/recent', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setChats(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching chats:', error);
        setLoading(false);
      }
    };

    fetchChats();
    // Set up polling for new messages every 30 seconds
    const interval = setInterval(fetchChats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A3BFF]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Messages</h2>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {chats.length > 0 ? (
          chats.map((chat) => (
            <Link
              key={chat._id}
              to={`/chats/${chat.peerId}`}
              className="block hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="flex items-center p-4">
                <img
                  src={chat.peerProfile || "https://via.placeholder.com/40"}
                  alt={chat.peerName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {chat.peerName}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(chat.lastMessageTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {chat.lastMessage}
                  </p>
                </div>
                {chat.unreadCount > 0 && (
                  <span className="ml-2 bg-[#4A3BFF] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </Link>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No conversations yet
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList; 
import React from 'react';
import { useParams } from 'react-router-dom';
import ChatList from '../components/ChatList';
import Chat from '../components/Chat';

const ChatPage = () => {
  const { peerId } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat List - Hidden on mobile when chat is open */}
        <div className={`${peerId ? 'hidden lg:block' : 'block'} lg:col-span-1`}>
          <ChatList />
        </div>

        {/* Chat Window */}
        <div className={`${peerId ? 'block' : 'hidden lg:block'} lg:col-span-3 h-[calc(100vh-12rem)]`}>
          {peerId ? (
            <Chat />
          ) : (
            <div className="h-full flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p className="text-lg">Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage; 
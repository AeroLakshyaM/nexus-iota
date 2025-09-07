import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ChatList() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    if (!currentUserId) {
      navigate('/login');
      return;
    }
    fetchActiveChats();
  }, [currentUserId]);

  const fetchActiveChats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/api/chat/user/${currentUserId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch chats');
      }
      const data = await response.json();
      setChats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const getUnreadBadge = (unreadCount) => {
    if (unreadCount === 0) return null;
    return (
      <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {unreadCount > 9 ? '9+' : unreadCount}
      </span>
    );
  };

  if (!currentUserId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-900">My Chats</h1>
            </div>
            <button
              onClick={fetchActiveChats}
              className="text-gray-600 hover:text-black transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading chats...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchActiveChats}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : chats.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">💬</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Chats</h3>
            <p className="text-gray-600 mb-6">
              You don't have any active conversations yet.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Browse Users
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {chats.map((chat) => (
              <div
                key={chat.swap_request_id}
                className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => navigate(`/chat/${chat.swap_request_id}`)}
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    {/* User Avatar */}
                    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-lg font-bold">
                      {chat.other_user_name.substring(0, 2).toUpperCase()}
                    </div>
                    
                    {/* Chat Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {chat.other_user_name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {getUnreadBadge(chat.unread_count)}
                          <span className="text-sm text-gray-500">
                            {formatDate(chat.request_date)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Swap Details */}
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-green-600 font-medium">
                          {chat.offered_skill}
                        </span>
                        <span className="text-gray-400">↔</span>
                        <span className="text-sm text-blue-600 font-medium">
                          {chat.wanted_skill}
                        </span>
                      </div>
                      
                      {/* Last Message Preview */}
                      <p className="text-sm text-gray-500 mt-1 truncate">
                        {chat.unread_count > 0 ? (
                          <span className="font-medium text-blue-600">
                            {chat.unread_count} new message{chat.unread_count > 1 ? 's' : ''}
                          </span>
                        ) : (
                          'Tap to view conversation'
                        )}
                      </p>
                    </div>
                  </div>
                  
                  {/* Arrow Icon */}
                  <div className="text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 
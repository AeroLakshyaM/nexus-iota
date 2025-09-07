import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Chat() {
  const { swapRequestId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [swapRequest, setSwapRequest] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const messagesEndRef = useRef(null);

  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    if (!currentUserId) {
      navigate("/login");
      return;
    }
    fetchSwapRequestDetails();
    fetchMessages();
  }, [swapRequestId, currentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchSwapRequestDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/swap-requests/received/${currentUserId}`,
      );
      if (response.ok) {
        const requests = await response.json();
        const request = requests.find((r) => r.id == swapRequestId);

        if (!request) {
          // Try sent requests
          const sentResponse = await fetch(
            `http://localhost:4000/api/swap-requests/sent/${currentUserId}`,
          );
          if (sentResponse.ok) {
            const sentRequests = await sentResponse.json();
            const sentRequest = sentRequests.find((r) => r.id == swapRequestId);
            if (sentRequest) {
              setSwapRequest(sentRequest);
              setOtherUser({
                name: sentRequest.to_user_name,
                id: sentRequest.to_user_id,
              });
            }
          }
        } else {
          setSwapRequest(request);
          setOtherUser({
            name: request.from_user_name,
            id: request.from_user_id,
          });
        }
      }
    } catch (err) {
      console.error("Error fetching swap request details:", err);
    }
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:4000/api/chat/${swapRequestId}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const data = await response.json();
      setMessages(data);

      // Mark messages as read
      markMessagesAsRead();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    try {
      // Mark chat message notifications as read
      const response = await fetch(
        `http://localhost:4000/api/notifications/${currentUserId}`,
      );
      if (response.ok) {
        const notifications = await response.json();
        const chatNotifications = notifications.filter(
          (n) => n.type === "chat_message" && !n.is_read,
        );

        // Mark each unread chat notification as read
        for (const notification of chatNotifications) {
          await fetch(
            `http://localhost:4000/api/notifications/${notification.id}/read`,
            {
              method: "PUT",
            },
          );
        }
      }
    } catch (err) {
      console.error("Error marking messages as read:", err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(
        `http://localhost:4000/api/chat/${swapRequestId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender_id: parseInt(currentUserId),
            receiver_id: otherUser.id,
            message: newMessage.trim(),
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();

      // Add the new message to the list
      const newMsg = {
        id: data.id,
        sender_id: parseInt(currentUserId),
        message: newMessage.trim(),
        created_at: new Date().toISOString(),
        sender_name: "You",
      };

      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");
    } catch (err) {
      setError(err.message);
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
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
                onClick={() => navigate("/swap-requests")}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Chat with {otherUser?.name || "User"}
                </h1>
                {swapRequest && (
                  <p className="text-sm text-gray-500">
                    {swapRequest.offered_skill} ↔ {swapRequest.wanted_skill}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[600px] flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-600">
                <p>{error}</p>
                <button
                  onClick={fetchMessages}
                  className="mt-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <div className="text-4xl mb-4">💬</div>
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_id == currentUserId ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender_id == currentUserId
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender_id == currentUserId
                          ? "text-gray-300"
                          : "text-gray-500"
                      }`}
                    >
                      {formatTime(message.created_at)}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={sendMessage} className="flex space-x-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                disabled={loading || undefined}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || loading || undefined}
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

import "../app/globals.css";
import Header from "@/components/header";
import { getUserMessages, deleteMessage } from "@/pages/api/functions";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { Trash2 } from 'lucide-react';

export default function Home() {
  const [userMessages, setUserMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      router.push('/login');
      return;
    }
    
    setUsername(storedUsername);
    fetchUserMessages(storedUsername);
  }, [router]);

  const fetchUserMessages = async (username) => {
    const messages = await getUserMessages(username);
    setUserMessages(messages.data);
  };

  const handleDeleteMessage = async (messageId) => {
    if (isDeleting) return;
    
    if (window.confirm('Are you sure you want to delete this message?')) {
      setIsDeleting(true);
      try {
        const result = await deleteMessage(messageId);
        if (result.success) {
          // Refresh messages after successful deletion
          await fetchUserMessages(username);
        } else {
          alert('Failed to delete message. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting message:', error);
        alert('Failed to delete message. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Fixed header */}
      <Header />
      
      {/* Scrollable content */}
      <main className="pt-[64px]"> {/* Adjust pt value to match your header height */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Profile Header - Fixed */}
          <div className="bg-zinc-800 rounded-lg p-6 mb-8 border border-orange-500/20">
            <h1 className="text-2xl font-bold text-orange-500 mb-2">
              {username}&apos;s Profile
            </h1>
            <p className="text-zinc-400">
              Total Messages: {userMessages.length}
            </p>
          </div>

          {/* Messages Section */}
          <div>
            <h2 className="text-xl font-semibold text-orange-500 mb-4">
              Your Messages
            </h2>
            
            {/* Scrollable Messages Container */}
            <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4">
              {userMessages.length === 0 ? (
                <p className="text-zinc-400 italic">
                  You haven&apos;t posted any messages yet.
                </p>
              ) : (
                userMessages.map((message) => (
                  <div
                    key={message._id}
                    className="bg-zinc-800 rounded-lg p-4 border border-orange-500/20 relative group"
                  >
                    <p className="text-zinc-200 mb-2">{message.content}</p>
                    <div className="flex justify-between items-center text-sm text-zinc-400">
                      <div className="flex items-center gap-4">
                        <span>👍 {message.rating.positive}</span>
                        <span>👎 {message.rating.negative}</span>
                      </div>
                      <span>{new Date(message.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-2 text-sm text-zinc-500">
                      Location: {message.location.lat.toFixed(4)}, {message.location.long.toFixed(4)}
                    </div>
                    
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteMessage(message._id)}
                      disabled={isDeleting}
                      className="absolute top-4 right-4 p-2 text-red-500 cursor-pointer"
                      title="Delete message"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

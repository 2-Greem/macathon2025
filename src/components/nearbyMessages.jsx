import { motion } from "framer-motion"
import { X, ThumbsUp, ThumbsDown } from "lucide-react"
import { rateMessage } from "@/pages/api/functions"
import { useState, useEffect } from "react"

export default function NearbyMessages({ isOpen, onClose, messages, onMessagesUpdate }) {
  const [isRating, setIsRating] = useState(false);
  const [votedMessages, setVotedMessages] = useState({});

  // Load voted messages from localStorage on component mount
  useEffect(() => {
    const savedVotes = localStorage.getItem('votedMessages');
    if (savedVotes) {
      setVotedMessages(JSON.parse(savedVotes));
    }
  }, []);

  if (!isOpen) return null

  const handleRate = async (messageId, type) => {
    if (isRating || votedMessages[messageId]) return;
    
    setIsRating(true);
    try {
      const result = await rateMessage(messageId, type);
      if (result.success) {
        // Save the vote to localStorage
        const newVotedMessages = { ...votedMessages, [messageId]: type };
        setVotedMessages(newVotedMessages);
        localStorage.setItem('votedMessages', JSON.stringify(newVotedMessages));
        
        // Trigger a refresh of messages
        if (onMessagesUpdate) {
          onMessagesUpdate();
        }
      }
    } catch (error) {
      console.error('Error rating message:', error);
    } finally {
      setIsRating(false);
    }
  };

  const getButtonStyles = (messageId, type) => {
    const baseStyles = "flex items-center gap-1 transition-colors cursor-pointer";
    const voted = votedMessages[messageId] === type;
    
    if (voted && type === 'positive') {
      return `${baseStyles} text-green-500`;
    } else if (voted && type === 'negative') {
      return `${baseStyles} text-red-500`;
    } else if (votedMessages[messageId]) {
      return `${baseStyles} text-zinc-600 cursor-not-allowed`;
    } else if (type === 'positive') {
      return `${baseStyles} text-zinc-400 hover:text-green-500`;
    } else {
      return `${baseStyles} text-zinc-400 hover:text-red-500`;
    }
  };

  return (
    <motion.div
      className="absolute bottom-0 left-0 z-30 w-full sm:w-96 bg-zinc-900 text-white rounded-t-xl shadow-xl"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
    >
      <div className="flex justify-between items-center p-4 border-b border-orange-600/30">
        <h2 className="text-xl font-bold text-orange-500">Nearby Messages</h2>
        <button
          onClick={onClose}
          className="text-orange-500 hover:text-orange-400 transition-colors"
          aria-label="Close nearby messages"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <p className="text-center text-orange-400/70 italic">No messages found nearby. Be the first to leave one!</p>
        ) : (
          messages.map((message) => (
            <div key={message.message_id} className="bg-zinc-800 p-3 rounded-lg border-l-4 border-orange-500">
              <p className="text-white mb-2">{message.content}</p>
              <div className="flex justify-between items-center">
                <div className="text-xs text-zinc-400">
                  <span>{message.username}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(message.timestamp).toLocaleString()}</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleRate(message.message_id, 'positive')}
                    className={getButtonStyles(message.message_id, 'positive')}
                    disabled={isRating || votedMessages[message.message_id]}
                    title={votedMessages[message.message_id] ? "You've already voted" : "Like this message"}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span className="text-sm">{message.rating.positive}</span>
                  </button>
                  <button
                    onClick={() => handleRate(message.message_id, 'negative')}
                    className={getButtonStyles(message.message_id, 'negative')}
                    disabled={isRating || votedMessages[message.message_id]}
                    title={votedMessages[message.message_id] ? "You've already voted" : "Dislike this message"}
                  >
                    <ThumbsDown className="h-4 w-4" />
                    <span className="text-sm">{message.rating.negative}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  )
}

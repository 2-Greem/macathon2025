import { motion } from "framer-motion"
import { X } from "lucide-react"
import { rateMessage } from "@/pages/api/functions"
import { useState, useEffect } from "react"
import BaseTierMessage from "./ui/baseTierMessage"
import BronzeTierMessage from "./ui/bronzeTierMessage"
import SilverTierMessage from "./ui/silverTierMessage"
import GoldTierMessage from "./ui/goldTierMessage"

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
          messages.map((message) => {
            // Determine which tier message to display based on message.rating.positive
            let MessageComponent;
            if (message.rating.positive > 50) {
              MessageComponent = GoldTierMessage;
            } else if (message.rating.positive > 25) {
              MessageComponent = SilverTierMessage;
            } else if (message.rating.positive > 10) {
              MessageComponent = BronzeTierMessage;
            } else {
              MessageComponent = BaseTierMessage;
            }

            return (
              <MessageComponent
                key={message.id} // Assuming message.id exists, you can use a unique key
                message={message}
                votedMessages={votedMessages}
                isRating={isRating}
                handleRate={handleRate}
              />
            );
          })
        )}
      </div>
    </motion.div>
  )
}

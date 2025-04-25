import { ThumbsUp, ThumbsDown } from "lucide-react"

export default function GoldTierMessage({ message, votedMessages, isRating, handleRate }){
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

    return <div key={message.message_id} className="bg-gradient-to-br from-zinc-700 via-gray-900 to-indigo-600 p-3 rounded-lg border-x-4 border-2 border-indigo-600">
              <p className="text-purple-400 mb-2 font-serif"><b>{message.content}</b></p>
              <div className="flex justify-between items-center">
                <div className="text-xs text-white">
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
}
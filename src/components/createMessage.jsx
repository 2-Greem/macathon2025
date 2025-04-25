import { useState } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"

export default function CreateMessage({ isOpen, onClose, onSubmit }) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim()) {
      onSubmit(message)
      setMessage("")
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      className="absolute bottom-0 right-0 z-30 w-full sm:w-96 bg-zinc-900 text-white rounded-t-xl shadow-xl"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
    >
      <div className="flex justify-between items-center p-4 border-b border-orange-600/30">
        <h2 className="text-xl font-bold text-orange-500">Leave a Message</h2>
        <button
          onClick={onClose}
          className="text-orange-500 hover:text-orange-400 transition-colors"
          aria-label="Close message creation"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-orange-400 mb-1">
            Your message:
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full h-32 p-3 bg-zinc-800 text-white rounded-lg border border-orange-500/30 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none resize-none"
            placeholder="Write your message here..."
            maxLength={100}
          />
          <p className="text-right text-xs text-orange-400/70 mt-1">{message.length}/100 characters</p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!message.trim()}
            className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-900 font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Leave Message
          </button>
        </div>
      </form>
    </motion.div>
  )
}

"use client"

import { motion } from "framer-motion"
import { X } from "lucide-react"

export default function NearbyMessages({ isOpen, onClose, messages }) {
  if (!isOpen) return null

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
            <div key={message.id} className="bg-zinc-800 p-3 rounded-lg border-l-4 border-orange-500">
              <p className="text-white mb-2">{message.content}</p>
              <div className="flex justify-between text-xs text-tan-300">
                <span>{message.author}</span>
                <span>{new Date(message.timestamp).toLocaleString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  )
}

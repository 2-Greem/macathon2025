"use client"
import "../app/globals.css"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import NearbyMessages from "@/components/NearbyMessages"
import CreateMessage from "@/components/CreateMessage"
import Header from "@/components/header"
import { MessageCircle, PenSquare } from "lucide-react"

// Dynamically import the Map component with no SSR
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full bg-zinc-900">
      <div className="text-orange-500 text-xl">Loading map...</div>
    </div>
  ),
})

export default function Home() {
  const [showNearbyMessages, setShowNearbyMessages] = useState(false)
  const [showCreateMessage, setShowCreateMessage] = useState(false)
  const [userLocation, setUserLocation] = useState(null)
  const [nearbyMessages, setNearbyMessages] = useState([])

  // Get user location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          console.error("Error getting location:", error)
          // Default to a location if geolocation fails
          setUserLocation([51.505, -0.09])
        },
      )
    }
  }, [])

  // Mock function to fetch nearby messages
  const fetchNearbyMessages = (lat, lng) => {
    // This would be replaced with an actual API call
    const mockMessages = [
      {
        id: 1,
        content: "Try finger but hole",
        location: [lat + 0.001, lng - 0.001],
        author: "Anonymous",
        timestamp: new Date().toISOString(),
      },
      {
        id: 2,
        content: "Praise the sun!",
        location: [lat - 0.002, lng + 0.002],
        author: "Solaire",
        timestamp: new Date().toISOString(),
      },
      {
        id: 3,
        content: "Beware of dog",
        location: [lat + 0.003, lng + 0.001],
        author: "Warrior",
        timestamp: new Date().toISOString(),
      },
    ]
    setNearbyMessages(mockMessages)
  }

  // Handle creating a new message
  const handleCreateMessage = (message) => {
    if (!userLocation) return

    // This would be replaced with an actual API call
    console.log("Creating message:", message, "at location:", userLocation)

    // Close the create message popup
    setShowCreateMessage(false)

    // Refresh nearby messages
    fetchNearbyMessages(userLocation[0], userLocation[1])
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      {/* Header - Always on top */}
      <Header />

      {/* Main content area - Fills remaining space */}
      <main className="relative flex-1 overflow-hidden">
        {/* Map Container */}
        <div className="absolute inset-0 z-0">{userLocation && <Map center={userLocation} />}</div>

        {/* UI Controls Layer */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Only show nearby messages button when the panel is closed */}
          {!showNearbyMessages && (
            <button
              onClick={() => {
                if (userLocation) {
                  fetchNearbyMessages(userLocation[0], userLocation[1])
                }
                setShowNearbyMessages(true)
                setShowCreateMessage(false)
              }}
              className="absolute bottom-6 left-6 z-20 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-zinc-900 p-3 rounded-full shadow-lg transition-all duration-300 pointer-events-auto"
              aria-label="Show nearby messages"
            >
              <MessageCircle className="h-6 w-6" />
            </button>
          )}

          {/* Only show create message button when the panel is closed */}
          {!showCreateMessage && (
            <button
              onClick={() => {
                setShowCreateMessage(true)
                setShowNearbyMessages(false)
              }}
              className="absolute bottom-6 right-6 z-20 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-zinc-900 p-3 rounded-full shadow-lg transition-all duration-300 pointer-events-auto"
              aria-label="Create a message"
            >
              <PenSquare className="h-6 w-6" />
            </button>
          )}

          {/* Panels - These need pointer-events-auto to be interactive */}
          <div className="pointer-events-auto">
            <NearbyMessages
              isOpen={showNearbyMessages}
              onClose={() => setShowNearbyMessages(false)}
              messages={nearbyMessages}
            />

            <CreateMessage
              isOpen={showCreateMessage}
              onClose={() => setShowCreateMessage(false)}
              onSubmit={handleCreateMessage}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

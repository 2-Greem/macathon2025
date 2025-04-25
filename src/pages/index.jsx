import "../app/globals.css"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import NearbyMessages from "@/components/nearbyMessages"
import CreateMessage from "@/components/createMessage"
import Header from "@/components/header"
import { MessageCircle, PenSquare } from "lucide-react"
import { getAllMessages, isLoggedIn, sendMessage, username, innerMessageRadius} from "./api/functions"

// Dynamically import the Map component with no SSR
const Map = dynamic(() => import("@/components/map"), {
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

  // Function to fetch nearby messages
  const fetchNearbyMessages = async (lat, lon, maxDistance) => {
    const messages = await getAllMessages();
    const filtered = messages.data.filter(msg => {
      const dLat = (msg.location.lat - lat) * 111000; // in meters
      const dLon = (msg.location.long - lon) * 111000 * Math.cos(lat * Math.PI / 180);
      const distance = Math.sqrt(dLat * dLat + dLon * dLon);
      return distance <= maxDistance;
  });
    setNearbyMessages(filtered)
  }

  // Handle creating a new message
  const handleCreateMessage = (message) => {
    if (!userLocation) return

    // API Call - Need to replace the user stuff
    sendMessage(username, message, userLocation[0], userLocation[1]);

    // Close the create message popup
    setShowCreateMessage(false)

    // Refresh nearby messages
    fetchNearbyMessages(userLocation[0], userLocation[1], innerMessageRadius)
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
                  fetchNearbyMessages(userLocation[0], userLocation[1], innerMessageRadius)
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

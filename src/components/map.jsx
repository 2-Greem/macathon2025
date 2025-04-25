import { useEffect, useRef, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet"
import { redMarkerIcon, greyMarkerIcon, goldMarkerIcon } from "./ui/markers"
import SnapBackToCenter from "./snapBackToCenter"
import { getAllMessages, innerMessageRadius, outerMessageRadius} from "@/pages/api/functions"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Component to update map view when center prop changes
function ChangeView({ center }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, 16)
  }, [center, map])
  return null
}

export default function Map({ center }) {
  const isMounted = useRef(false)
  const [innerMessages, setInnerMessages] = useState([]);
  const [outerMessages, setOuterMessages] = useState([]);

  // Get all messages in a 500m radius
  // Function to fetch nearby messages
  const fetchNearbyMessages = async (center, outerDistance, innerDistance) => {
    const [lat, long] = center;
    const messages = await getAllMessages();
    const outerFiltered = messages.data.filter(msg => {
      const dLat = (msg.location.lat - lat) * 111000; // in meters
      const dLon = (msg.location.long - long) * 111000 * Math.cos(lat * Math.PI / 180);
      const distance = Math.sqrt(dLat * dLat + dLon * dLon);
      return distance <= outerDistance && distance > innerDistance;
    });
    setOuterMessages(outerFiltered);
    const innerFiltered = messages.data.filter(msg => {
      const dLat = (msg.location.lat - lat) * 111000; // in meters
      const dLon = (msg.location.long - long) * 111000 * Math.cos(lat * Math.PI / 180);
      const distance = Math.sqrt(dLat * dLat + dLon * dLon);
      return distance <= innerDistance;
    });
    setInnerMessages(innerFiltered);
  }

  useEffect(() => {
    if (!isMounted.current) {
      // Fix Leaflet default icon issue
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      })
      isMounted.current = true
    }
  }, [])

  // Call fetchNearbyMessages when the center changes
  useEffect(() => {
    fetchNearbyMessages(center, outerMessageRadius, innerMessageRadius); // 1000m outer radius, 500m inner radius
  }, [center]);

  return (
    <div className="leaflet-container" style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={center}
        zoom={16}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        attributionControl={false}
      >
        <ChangeView center={center} />
        <SnapBackToCenter center={center} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={center} icon={goldMarkerIcon}>
          <Popup><strong>Its You</strong></Popup>
        </Marker>
        <Circle center={center} radius={innerMessageRadius} color="red" fillColor="yellow" fillOpacity={0.01} />
        <Circle center={center} radius={outerMessageRadius} color="black" fillColor="grey" fillOpacity={0.1} />
        {/* Add a marker for each message */}
        {innerMessages.map((message) => (
          <Marker key={message.message_id} 
            position={[message.location.lat, message.location.long]}
            icon={redMarkerIcon}>
            <Popup>
              <strong>{message.username}</strong><br />
              {message.content}<br />
            </Popup>
          </Marker>
        ))}
        {outerMessages.map((message) => (
          <Marker key={message.message_id} position={[message.location.lat, message.location.long]} icon={greyMarkerIcon}>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

"use client"

import { useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
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
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={center}>
          <Popup>You are here</Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

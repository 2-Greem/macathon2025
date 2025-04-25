import { useRef, useEffect} from "react";
import { useMap } from "react-leaflet";

export default function SnapBackToCenter({ center }) {
    const map = useMap();
    const timeoutRef = useRef(null);
  
    useEffect(() => {
      const handleMoveEnd = () => {
        // Clear any previous timeout to avoid spamming
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        // Snap back after 1 second
        timeoutRef.current = setTimeout(() => {
          map.setView(center, map.getZoom());
        }, 1000); // adjust this number to change the snapback time
      };
  
      map.on("moveend", handleMoveEnd);
  
      return () => {
        map.off("moveend", handleMoveEnd);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, [center, map]);
  
    return null;
  }
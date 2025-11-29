"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { Location, IoTData } from "../../../../shared/types";

// Dynamically import Leaflet to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);

interface ShipmentTrackingMapProps {
  origin: Location;
  destination: Location;
  currentLocation?: Location;
  iotData: IoTData[];
}

export default function ShipmentTrackingMap({
  origin,
  destination,
  currentLocation,
  iotData,
}: ShipmentTrackingMapProps) {
  const [isClient, setIsClient] = useState(false);
  const mapInitialized = useRef(false);

  // Create a unique key based on all props that should trigger map reinitialization
  const mapKey = useRef(0);

  useEffect(() => {
    mapKey.current += 1; // Increment key whenever props change
  }, [origin, destination, currentLocation, iotData.length]);

  useEffect(() => {
    setIsClient(true);
    // Import Leaflet CSS dynamically
    if (typeof window !== "undefined") {
      import("leaflet/dist/leaflet.css").catch(() => {
        // CSS import may fail in some environments, that's okay
      });
    }

    return () => {
      // Reset initialization flag when component unmounts
      mapInitialized.current = false;
    };
  }, []);

  const route =
    iotData.length > 0
      ? iotData.map(
          (data) => [data.location.lat, data.location.lng] as [number, number]
        )
      : [
          [origin.lat, origin.lng] as [number, number],
          [destination.lat, destination.lng] as [number, number],
        ];

  const center = currentLocation
    ? [currentLocation.lat, currentLocation.lng]
    : [(origin.lat + destination.lat) / 2, (origin.lng + destination.lng) / 2];

  if (!isClient || typeof window === "undefined") {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        Loading map...
      </div>
    );
  }

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden">
      <MapContainer
        key={`map-${mapKey.current}`} // Use the computed key to force reinitialization when props change
        center={center as [number, number]}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[origin.lat, origin.lng]}>
          <Popup>
            Origin: {origin.city}, {origin.state}
          </Popup>
        </Marker>
        <Marker position={[destination.lat, destination.lng]}>
          <Popup>
            Destination: {destination.city}, {destination.state}
          </Popup>
        </Marker>
        {currentLocation && (
          <Marker position={[currentLocation.lat, currentLocation.lng]}>
            <Popup>
              Current Location
              <br />
              Temp: {iotData[iotData.length - 1]?.temperature.toFixed(1)}°C
            </Popup>
          </Marker>
        )}
        <Polyline positions={route} color="blue" />
      </MapContainer>
    </div>
  );
}

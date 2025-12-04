"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Location, IoTData } from "../../../../shared/types";

// Fix default Leaflet icons for Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface ShipmentTrackingMapProps {
  origin: Location;
  destination: Location;
  currentLocation?: Location;
  iotData: IoTData[];
}

// Component to capture map instance for cleanup
function MapInstanceCapture({
  onMapCreated,
}: {
  onMapCreated: (map: L.Map) => void;
}) {
  const map = useMap();
  useEffect(() => {
    onMapCreated(map);
  }, [map, onMapCreated]);
  return null;
}

export default function ShipmentTrackingMap({
  origin,
  destination,
  currentLocation,
  iotData,
}: ShipmentTrackingMapProps) {
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState<{
    location: Location;
    label: string;
    temperature?: number;
  } | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      // Cleanup: remove map instance when component unmounts
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Handle map creation
  const handleMapCreated = useCallback((map: L.Map) => {
    // Clean up previous map instance if it exists
    if (mapRef.current && mapRef.current !== map) {
      mapRef.current.remove();
    }
    mapRef.current = map;
  }, []);

  const isValid = (n: number) => typeof n === "number" && !isNaN(n);

  const center = useMemo(() => {
    if (
      currentLocation &&
      isValid(currentLocation.lat) &&
      isValid(currentLocation.lng)
    ) {
      return [currentLocation.lat, currentLocation.lng];
    }

    if (
      isValid(origin.lat) &&
      isValid(origin.lng) &&
      isValid(destination.lat) &&
      isValid(destination.lng)
    ) {
      return [
        (origin.lat + destination.lat) / 2,
        (origin.lng + destination.lng) / 2,
      ];
    }

    return [39.8283, -98.5795]; // fallback
  }, [origin, destination, currentLocation]);

  const route = useMemo(() => {
    if (iotData.length > 0) {
      return iotData
        .map((d) => [d.location.lat, d.location.lng])
        .filter(([lat, lng]) => isValid(lat) && isValid(lng));
    }
    return [
      [origin.lat, origin.lng],
      [destination.lat, destination.lng],
    ].filter(([lat, lng]) => isValid(lat) && isValid(lng));
  }, [iotData, origin, destination]);

  const makeIcon = (color: string) =>
    L.divIcon({
      className: "custom-marker",
      html: `<div style="width:20px;height:20px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,.3)"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

  // Create a stable key for the map container to force remounting when props change
  const mapKey = useMemo(
    () =>
      `${origin.lat}-${origin.lng}-${destination.lat}-${destination.lng}-${currentLocation?.lat}-${currentLocation?.lng}`,
    [origin, destination, currentLocation]
  );

  if (
    !isValid(origin.lat) ||
    !isValid(origin.lng) ||
    !isValid(destination.lat) ||
    !isValid(destination.lng)
  ) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-500">Invalid location coordinates</p>
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-500">Loading map…</p>
      </div>
    );
  }

  return (
    <div className="w-full h-96 min-h-96 rounded-lg overflow-hidden relative">
      <MapContainer
        key={mapKey}
        center={center as any}
        zoom={6}
        style={{ width: "100%", height: "100%" }}
      >
        <MapInstanceCapture onMapCreated={handleMapCreated} />
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {route.length >= 2 && (
          <Polyline
            positions={route as any}
            pathOptions={{ color: "#3b82f6", weight: 3, opacity: 0.8 }}
          />
        )}

        {/* Origin */}
        <Marker
          position={[origin.lat, origin.lng]}
          icon={makeIcon("#10b981")}
          eventHandlers={{
            click: () =>
              setSelected({
                location: origin,
                label: `Origin: ${origin.city}, ${origin.state}`,
              }),
          }}
        >
          {selected?.location === origin && (
            <Popup>
              <div className="font-semibold">{selected.label}</div>
            </Popup>
          )}
        </Marker>

        {/* Destination */}
        <Marker
          position={[destination.lat, destination.lng]}
          icon={makeIcon("#ef4444")}
          eventHandlers={{
            click: () =>
              setSelected({
                location: destination,
                label: `Destination: ${destination.city}, ${destination.state}`,
              }),
          }}
        >
          {selected?.location === destination && (
            <Popup>
              <div className="font-semibold">{selected.label}</div>
            </Popup>
          )}
        </Marker>

        {/* Current */}
        {currentLocation && (
          <Marker
            position={[currentLocation.lat, currentLocation.lng]}
            icon={makeIcon("#3b82f6")}
            eventHandlers={{
              click: () =>
                setSelected({
                  location: currentLocation,
                  label: "Current Location",
                  temperature: iotData[iotData.length - 1]?.temperature,
                }),
            }}
          >
            {selected?.location === currentLocation && (
              <Popup>
                <div className="font-semibold">{selected.label}</div>
                {selected.temperature !== undefined && (
                  <div className="text-sm text-gray-600">
                    Temp: {selected.temperature.toFixed(1)}°C
                  </div>
                )}
              </Popup>
            )}
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

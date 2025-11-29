"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import type { Load } from "../../../../shared/types";
import { format } from "date-fns";

interface LoadCardProps {
  load: Load;
  showActions?: boolean;
}

export default function LoadCard({ load, showActions = false }: LoadCardProps) {
  const statusConfig = {
    posted: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      icon: "📋",
      label: "Posted",
    },
    bidding: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      icon: "💰",
      label: "Bidding",
    },
    assigned: {
      bg: "bg-green-100",
      text: "text-green-800",
      icon: "✅",
      label: "Assigned",
    },
    in_transit: {
      bg: "bg-purple-100",
      text: "text-purple-800",
      icon: "🚚",
      label: "In Transit",
    },
    delivered: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      icon: "📦",
      label: "Delivered",
    },
    completed: {
      bg: "bg-green-100",
      text: "text-green-800",
      icon: "✓",
      label: "Completed",
    },
    cancelled: {
      bg: "bg-red-100",
      text: "text-red-800",
      icon: "✗",
      label: "Cancelled",
    },
  };

  const status = statusConfig[load.status as keyof typeof statusConfig] || {
    bg: "bg-gray-100",
    text: "text-gray-800",
    icon: "📦",
    label: load.status.toUpperCase().replace("_", " "),
  };

  const tempRange = load.temperatureRequirement;
  const isFrozen = tempRange.min < -10;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-primary-300 overflow-hidden group">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-1">{load.cargoType}</h3>
            <p className="text-sm text-primary-100">
              ID: {load.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1.5 bg-white/20 backdrop-blur-sm ${status.text}`}
          >
            <span>{status.icon}</span>
            <span>{status.label}</span>
          </span>
        </div>
      </div>

      <div className="p-6">
        {/* Route Information */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-green-600 text-lg">📍</span>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Origin
                  </p>
                  <p className="font-semibold text-gray-900">
                    {load.origin.city}, {load.origin.state}
                  </p>
                </div>
              </div>
            </div>
            <div className="mx-3 text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
            <div className="flex-1 text-right">
              <div className="flex items-center justify-end space-x-2">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Destination
                  </p>
                  <p className="font-semibold text-gray-900">
                    {load.destination.city}, {load.destination.state}
                  </p>
                </div>
                <span className="text-red-600 text-lg">🎯</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <p className="text-xs text-gray-600 mb-1 flex items-center space-x-1">
              <span>🌡️</span>
              <span>Temperature</span>
            </p>
            <p className="text-base font-bold text-primary-600">
              {tempRange.min}°C - {tempRange.max}°C
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {isFrozen ? "❄️ Frozen" : "🧊 Refrigerated"}
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
            <p className="text-xs text-gray-600 mb-1 flex items-center space-x-1">
              <span>💰</span>
              <span>Base Price</span>
            </p>
            <p className="text-base font-bold text-purple-600">
              ${load.basePrice.toLocaleString()}
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-3 border border-green-100">
            <p className="text-xs text-gray-600 mb-1 flex items-center space-x-1">
              <span>⚖️</span>
              <span>Weight</span>
            </p>
            <p className="text-base font-bold text-green-600">
              {load.weight.toLocaleString()} lbs
            </p>
          </div>

          <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
            <p className="text-xs text-gray-600 mb-1 flex items-center space-x-1">
              <span>📦</span>
              <span>Volume</span>
            </p>
            <p className="text-base font-bold text-orange-600">
              {load.volume.toLocaleString()} cu ft
            </p>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Pickup Date</p>
            <p className="text-sm font-semibold text-gray-900">
              {format(new Date(load.pickupDate), "MMM dd, yyyy")}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Delivery Date</p>
            <p className="text-sm font-semibold text-gray-900">
              {format(new Date(load.deliveryDate), "MMM dd, yyyy")}
            </p>
          </div>
        </div>

        {/* Bids Count */}
        {load.bids.length > 0 && (
          <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-600">💰</span>
                <span className="text-sm font-semibold text-yellow-800">
                  {load.bids.length} Bid{load.bids.length > 1 ? "s" : ""}{" "}
                  Received
                </span>
              </div>
              {load.status === "bidding" && (
                <span className="text-xs text-yellow-600 animate-pulse">
                  Active
                </span>
              )}
            </div>
          </div>
        )}

        {/* Special Requirements */}
        {load.specialRequirements.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Special Requirements:</p>
            <div className="flex flex-wrap gap-2">
              {load.specialRequirements.map((req, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {req}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex space-x-2 pt-4 border-t border-gray-200">
            <Link href={`/loads/${load.id}`} className="flex-1">
              <Button variant="primary" size="sm" className="w-full">
                View Details
              </Button>
            </Link>
            {load.status === "posted" && (
              <Link href={`/loads/${load.id}/bid`} className="flex-1">
                <Button variant="secondary" size="sm" className="w-full">
                  Place Bid
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

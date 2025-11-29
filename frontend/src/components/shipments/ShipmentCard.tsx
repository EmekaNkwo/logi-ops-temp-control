"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import type { Shipment } from "../../../../shared/types";
import { format } from "date-fns";

interface ShipmentCardProps {
  shipment: Shipment;
}

export default function ShipmentCard({ shipment }: ShipmentCardProps) {
  const latestData = shipment.iotData[shipment.iotData.length - 1];

  const statusConfig = {
    in_transit: {
      bg: "bg-purple-100",
      text: "text-purple-800",
      icon: "🚚",
      label: "In Transit",
    },
    delivered: {
      bg: "bg-green-100",
      text: "text-green-800",
      icon: "✅",
      label: "Delivered",
    },
    assigned: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      icon: "📋",
      label: "Assigned",
    },
    completed: {
      bg: "bg-green-100",
      text: "text-green-800",
      icon: "✓",
      label: "Completed",
    },
    default: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      icon: "📦",
      label: shipment.status.toUpperCase().replace("_", " "),
    },
  };

  const complianceConfig = {
    compliant: {
      bg: "bg-green-100",
      text: "text-green-800",
      icon: "✓",
    },
    warning: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      icon: "⚠",
    },
    violation: {
      bg: "bg-red-100",
      text: "text-red-800",
      icon: "✗",
    },
    default: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      icon: "○",
    },
  };

  const status =
    statusConfig[shipment.status as keyof typeof statusConfig] ||
    statusConfig.default;
  const compliance =
    complianceConfig[
      shipment.complianceStatus as keyof typeof complianceConfig
    ] || complianceConfig.default;
  const unresolvedIssues = shipment.complianceIssues.filter(
    (i) => !i.resolved
  ).length;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-primary-300 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
                {shipment.cargoType.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {shipment.cargoType}
                </h3>
                <p className="text-sm text-gray-500">
                  ID: {shipment.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 ${status.bg} ${status.text}`}
              >
                <span>{status.icon}</span>
                <span>{status.label}</span>
              </span>
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 ${compliance.bg} ${compliance.text}`}
              >
                <span>{compliance.icon}</span>
                <span>{shipment.complianceStatus.toUpperCase()}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Route Information */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-green-600 font-semibold">📍</span>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">
                    Origin
                  </p>
                  <p className="font-semibold text-gray-900">
                    {shipment.origin.city}, {shipment.origin.state}
                  </p>
                </div>
              </div>
            </div>
            <div className="mx-4 text-gray-400">
              <svg
                className="w-6 h-6"
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
                  <p className="text-xs text-gray-600 uppercase tracking-wide">
                    Destination
                  </p>
                  <p className="font-semibold text-gray-900">
                    {shipment.destination.city}, {shipment.destination.state}
                  </p>
                </div>
                <span className="text-red-600 font-semibold">🎯</span>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <p className="text-xs text-gray-600 mb-1 flex items-center space-x-1">
              <span>🌡️</span>
              <span>Temperature</span>
            </p>
            <p className="text-lg font-bold text-primary-600">
              {latestData?.temperature.toFixed(1) || "N/A"}°C
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Range: {shipment.temperatureRequirement.min}°C -{" "}
              {shipment.temperatureRequirement.max}°C
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
            <p className="text-xs text-gray-600 mb-1 flex items-center space-x-1">
              <span>💧</span>
              <span>Humidity</span>
            </p>
            <p className="text-lg font-bold text-purple-600">
              {latestData?.humidity.toFixed(1) || "N/A"}%
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-3 border border-green-100">
            <p className="text-xs text-gray-600 mb-1 flex items-center space-x-1">
              <span>📅</span>
              <span>ETA</span>
            </p>
            <p className="text-lg font-bold text-green-600">
              {shipment.estimatedArrival
                ? format(new Date(shipment.estimatedArrival), "MMM dd")
                : "N/A"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {shipment.estimatedArrival
                ? format(new Date(shipment.estimatedArrival), "yyyy")
                : ""}
            </p>
          </div>

          <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
            <p className="text-xs text-gray-600 mb-1 flex items-center space-x-1">
              <span>⚖️</span>
              <span>Weight</span>
            </p>
            <p className="text-lg font-bold text-orange-600">
              {shipment.weight.toLocaleString()} lbs
            </p>
          </div>
        </div>

        {/* Compliance Alert */}
        {unresolvedIssues > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-red-600 text-xl">⚠️</span>
              <div>
                <p className="text-sm font-semibold text-red-800">
                  {unresolvedIssues} Unresolved Compliance Issue
                  {unresolvedIssues > 1 ? "s" : ""}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Action required - Review shipment details
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Carrier:</span> {shipment.carrierName}
          </div>
          <Link href={`/shipments/${shipment.id}`}>
            <Button variant="primary" size="sm">
              View Details →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

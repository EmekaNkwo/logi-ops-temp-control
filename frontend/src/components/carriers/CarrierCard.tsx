"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import type { Carrier } from "../../../../shared/types";

interface CarrierCardProps {
  carrier: Carrier;
}

export default function CarrierCard({ carrier }: CarrierCardProps) {
  const vettingConfig = {
    approved: {
      bg: "bg-green-100",
      text: "text-green-800",
      icon: "✅",
      label: "Approved",
    },
    pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      icon: "⏳",
      label: "Pending",
    },
    under_review: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      icon: "🔍",
      label: "Under Review",
    },
    rejected: {
      bg: "bg-red-100",
      text: "text-red-800",
      icon: "✗",
      label: "Rejected",
    },
  };

  const vetting = vettingConfig[carrier.vettingStatus] || {
    bg: "bg-gray-100",
    text: "text-gray-800",
    icon: "○",
    label: carrier.vettingStatus.toUpperCase().replace("_", " "),
  };

  const ratingStars = carrier.rating ? Math.round(carrier.rating) : 0;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-primary-300 overflow-hidden group">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
                {carrier.companyName.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold">{carrier.companyName}</h3>
                <p className="text-sm text-primary-100">
                  {carrier.contactName}
                </p>
              </div>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1.5 bg-white/20 backdrop-blur-sm ${vetting.text}`}
          >
            <span>{vetting.icon}</span>
            <span>{vetting.label}</span>
          </span>
        </div>
      </div>

      <div className="p-6">
        {/* Rating */}
        {carrier.rating && (
          <div className="mb-4 pb-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">
                  Rating:
                </span>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-lg ${
                        star <= ratingStars
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-900 ml-2">
                  {carrier.rating.toFixed(1)}
                </span>
              </div>
              {carrier.totalReviews && (
                <span className="text-xs text-gray-500">
                  ({carrier.totalReviews} reviews)
                </span>
              )}
            </div>
          </div>
        )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <p className="text-xs text-gray-600 mb-1 flex items-center space-x-1">
              <span>🚛</span>
              <span>Equipment</span>
            </p>
            <p className="text-lg font-bold text-blue-600">
              {carrier.equipment.length} unit
              {carrier.equipment.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
            <p className="text-xs text-gray-600 mb-1 flex items-center space-x-1">
              <span>📅</span>
              <span>Experience</span>
            </p>
            <p className="text-lg font-bold text-purple-600">
              {carrier.foodHandlingExperience} year
              {carrier.foodHandlingExperience !== 1 ? "s" : ""}
            </p>
          </div>

          {carrier.vettingScore && (
            <div className="bg-green-50 rounded-lg p-3 border border-green-100">
              <p className="text-xs text-gray-600 mb-1 flex items-center space-x-1">
                <span>⭐</span>
                <span>Vetting Score</span>
              </p>
              <p className="text-lg font-bold text-green-600">
                {carrier.vettingScore}/100
              </p>
            </div>
          )}

          {carrier.totalShipments !== undefined && (
            <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
              <p className="text-xs text-gray-600 mb-1 flex items-center space-x-1">
                <span>📦</span>
                <span>Shipments</span>
              </p>
              <p className="text-lg font-bold text-orange-600">
                {carrier.totalShipments}
              </p>
            </div>
          )}
        </div>

        {/* Certifications */}
        {carrier.certifications.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Certifications:</p>
            <div className="flex flex-wrap gap-2">
              {carrier.certifications.map((cert, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full font-medium border border-primary-200"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Safety Rating */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Safety Rating:</span>
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${
                carrier.safetyRating === "satisfactory"
                  ? "bg-green-100 text-green-800"
                  : carrier.safetyRating === "conditional"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {carrier.safetyRating.charAt(0).toUpperCase() +
                carrier.safetyRating.slice(1)}
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="mb-4 text-sm text-gray-600">
          <span className="flex items-center space-x-1">
            <span>📍</span>
            <span>
              {carrier.address.city}, {carrier.address.state}
            </span>
          </span>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-200">
          <Link href={`/carriers/${carrier.id}`} className="block">
            <Button variant="primary" size="sm" className="w-full">
              View Details →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

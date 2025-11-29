"use client";

import Card from "@/components/ui/Card";
import {
  TruckIcon,
  ClockIcon,
  ShieldCheckIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import type { Carrier } from "../../../../shared/types";

interface CarrierEquipmentCertificationsProps {
  carrier: Carrier;
}

export default function CarrierEquipmentCertifications({
  carrier,
}: CarrierEquipmentCertificationsProps) {
  return (
    <Card className="h-full">
      <div className="flex items-center space-x-2 mb-4">
        <TruckIcon className="h-6 w-6 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-900">
          Equipment & Certifications
        </h2>
      </div>
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-center space-x-2 mb-1">
            <TruckIcon className="h-5 w-5 text-blue-600" />
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Equipment Units
            </p>
          </div>
          <p className="font-semibold text-gray-900 text-xl">
            {carrier.equipment.length}
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-center space-x-2 mb-1">
            <ClockIcon className="h-5 w-5 text-green-600" />
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Food Handling Experience
            </p>
          </div>
          <p className="font-semibold text-gray-900 text-xl">
            {carrier.foodHandlingExperience} years
          </p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <div className="flex items-center space-x-2 mb-1">
            <ShieldCheckIcon className="h-5 w-5 text-purple-600" />
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Safety Rating
            </p>
          </div>
          <p className="font-semibold text-gray-900 capitalize">
            {carrier.safetyRating}
          </p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
          <div className="flex items-center space-x-2 mb-2">
            <CheckBadgeIcon className="h-5 w-5 text-yellow-600" />
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Certifications
            </p>
          </div>
          {carrier.certifications.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {carrier.certifications.map((cert, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white border border-yellow-200 rounded-full text-sm font-medium text-gray-700"
                >
                  {cert}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">None</p>
          )}
        </div>
      </div>
    </Card>
  );
}

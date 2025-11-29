"use client";

import Card from "@/components/ui/Card";
import {
  TruckIcon,
  CubeIcon,
  BoltIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import type { Equipment } from "../../../../shared/types";

interface CarrierEquipmentListProps {
  equipment: Equipment[];
}

export default function CarrierEquipmentList({
  equipment,
}: CarrierEquipmentListProps) {
  if (equipment.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <TruckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No equipment listed</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center space-x-2 mb-6">
        <TruckIcon className="h-6 w-6 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-900">
          Equipment Details
        </h2>
        <span className="ml-auto text-sm text-gray-500">
          {equipment.length} unit{equipment.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="space-y-4 max-h-[500px] overflow-y-auto">
        {equipment.map((eq) => (
          <div
            key={eq.id}
            className="border-2 border-gray-200 rounded-xl p-5 hover:border-primary-300 hover:shadow-md transition-all duration-200 bg-white"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <div className="bg-primary-100 rounded-lg p-3">
                  <TruckIcon className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {eq.make} {eq.model}
                  </h3>
                  <p className="text-sm text-gray-600">Year: {eq.year}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold capitalize">
                {eq.type.replace("_", " ")}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                <div className="flex items-center space-x-2 mb-1">
                  <CubeIcon className="h-4 w-4 text-purple-600" />
                  <p className="text-xs text-gray-600">Capacity</p>
                </div>
                <p className="font-semibold text-gray-900">
                  {eq.capacity.toLocaleString()} cu ft
                </p>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <div className="flex items-center space-x-2 mb-1">
                  {eq.temperatureRange.min < -10 ? (
                    <ArrowPathIcon className="h-4 w-4 text-blue-600" />
                  ) : (
                    <BoltIcon className="h-4 w-4 text-blue-600" />
                  )}
                  <p className="text-xs text-gray-600">Temp Range</p>
                </div>
                <p className="font-semibold text-gray-900">
                  {eq.temperatureRange.min}°C to {eq.temperatureRange.max}°C
                </p>
              </div>
            </div>

            {eq.certifications.length > 0 && (
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <ShieldCheckIcon className="h-4 w-4 text-gray-600" />
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Certifications
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {eq.certifications.map((cert, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-700"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

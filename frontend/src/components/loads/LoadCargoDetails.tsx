"use client";

import Card from "@/components/ui/Card";
import {
  CubeIcon,
  ScaleIcon,
  CurrencyDollarIcon,
  TagIcon,
  BoltIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import type { Load } from "../../../../shared/types";

interface LoadCargoDetailsProps {
  load: Load;
}

export default function LoadCargoDetails({ load }: LoadCargoDetailsProps) {
  const tempRangeColor =
    load.temperatureRequirement.range === "frozen"
      ? "bg-blue-500"
      : "bg-orange-500";

  return (
    <Card className="h-full">
      <div className="flex items-center space-x-2 mb-4">
        <CubeIcon className="h-6 w-6 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-900">Cargo Details</h2>
      </div>
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <TagIcon className="h-5 w-5 text-gray-500" />
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Cargo Type
            </p>
          </div>
          <p className="font-semibold text-gray-900 text-lg">
            {load.cargoType}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
            <div className="flex items-center space-x-2 mb-1">
              <ScaleIcon className="h-4 w-4 text-yellow-600" />
              <p className="text-xs text-gray-600">Weight</p>
            </div>
            <p className="font-semibold text-gray-900">
              {load.weight.toLocaleString()} lbs
            </p>
          </div>

          <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
            <div className="flex items-center space-x-2 mb-1">
              <CubeIcon className="h-4 w-4 text-purple-600" />
              <p className="text-xs text-gray-600">Volume</p>
            </div>
            <p className="font-semibold text-gray-900">
              {load.volume.toLocaleString()} cu ft
            </p>
          </div>
        </div>

        <div className={`${tempRangeColor} p-4 rounded-lg text-white`}>
          <div className="flex items-center space-x-2 mb-2">
            {load.temperatureRequirement.range === "frozen" ? (
              <ArrowPathIcon className="h-5 w-5" />
            ) : (
              <BoltIcon className="h-5 w-5" />
            )}
            <p className="text-xs font-medium uppercase tracking-wide opacity-90">
              Temperature Range
            </p>
          </div>
          <p className="font-semibold text-lg">
            {load.temperatureRequirement.min}°C to{" "}
            {load.temperatureRequirement.max}°C
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-center space-x-2 mb-2">
            <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Base Price
            </p>
          </div>
          <p className="font-semibold text-green-800 text-2xl">
            ${load.basePrice.toLocaleString()}
          </p>
        </div>
      </div>
    </Card>
  );
}

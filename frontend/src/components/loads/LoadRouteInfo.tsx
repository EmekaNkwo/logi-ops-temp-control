"use client";

import Card from "@/components/ui/Card";
import { format } from "date-fns";
import {
  MapPinIcon,
  CalendarDaysIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import type { Load } from "../../../../shared/types";

interface LoadRouteInfoProps {
  load: Load;
}

export default function LoadRouteInfo({ load }: LoadRouteInfoProps) {
  return (
    <Card className="h-full">
      <div className="flex items-center space-x-2 mb-4">
        <MapPinIcon className="h-6 w-6 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-900">
          Route Information
        </h2>
      </div>
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">
            Origin
          </p>
          <p className="font-semibold text-gray-900 text-lg">
            {load.origin.city}, {load.origin.state}
          </p>
          <p className="text-sm text-gray-600 mt-1">{load.origin.address}</p>
        </div>

        <div className="flex justify-center">
          <ArrowRightIcon className="h-6 w-6 text-gray-400" />
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <p className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">
            Destination
          </p>
          <p className="font-semibold text-gray-900 text-lg">
            {load.destination.city}, {load.destination.state}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {load.destination.address}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div className="flex items-start space-x-3">
            <CalendarDaysIcon className="h-5 w-5 text-primary-500 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 mb-1">Pickup Date</p>
              <p className="font-semibold text-gray-900">
                {format(new Date(load.pickupDate), "MMM dd, yyyy")}
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CalendarDaysIcon className="h-5 w-5 text-primary-500 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 mb-1">Delivery Date</p>
              <p className="font-semibold text-gray-900">
                {format(new Date(load.deliveryDate), "MMM dd, yyyy")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

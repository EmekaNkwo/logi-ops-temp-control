"use client";

import Card from "@/components/ui/Card";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";
import type { Carrier } from "../../../../shared/types";

interface CarrierCompanyInfoProps {
  carrier: Carrier;
}

export default function CarrierCompanyInfo({
  carrier,
}: CarrierCompanyInfoProps) {
  return (
    <Card className="h-full">
      <div className="flex items-center space-x-2 mb-4">
        <IdentificationIcon className="h-6 w-6 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-900">
          Company Information
        </h2>
      </div>
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-center space-x-2 mb-1">
            <EnvelopeIcon className="h-5 w-5 text-blue-600" />
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Email
            </p>
          </div>
          <p className="font-semibold text-gray-900">{carrier.email}</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-center space-x-2 mb-1">
            <PhoneIcon className="h-5 w-5 text-green-600" />
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Phone
            </p>
          </div>
          <p className="font-semibold text-gray-900">{carrier.phone}</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <div className="flex items-center space-x-2 mb-1">
            <MapPinIcon className="h-5 w-5 text-purple-600" />
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Location
            </p>
          </div>
          <p className="font-semibold text-gray-900">
            {carrier.address.city}, {carrier.address.state}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              DOT Number
            </p>
            <p className="font-semibold text-gray-900">{carrier.dotNumber}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              MC Number
            </p>
            <p className="font-semibold text-gray-900">{carrier.mcNumber}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

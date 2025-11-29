"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface CarrierDetailHeaderProps {
  companyName: string;
  contactName: string;
}

export default function CarrierDetailHeader({
  companyName,
  contactName,
}: CarrierDetailHeaderProps) {
  return (
    <div className="mb-8">
      <Link
        href="/carriers"
        className="inline-flex items-center text-sm text-gray-600 hover:text-primary-600 mb-4 transition-colors"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-2" />
        Back to Carriers
      </Link>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {companyName}
          </h1>
          <p className="text-gray-600">{contactName}</p>
        </div>
      </div>
    </div>
  );
}

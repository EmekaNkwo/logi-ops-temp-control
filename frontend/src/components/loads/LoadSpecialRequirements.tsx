"use client";

import Card from "@/components/ui/Card";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import type { Load } from "../../../../shared/types";

interface LoadSpecialRequirementsProps {
  requirements: string[];
}

export default function LoadSpecialRequirements({
  requirements,
}: LoadSpecialRequirementsProps) {
  if (requirements.length === 0) {
    return null;
  }

  return (
    <Card>
      <div className="flex items-center space-x-2 mb-4">
        <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
        <h2 className="text-xl font-semibold text-gray-900">
          Special Requirements
        </h2>
      </div>
      <div className="space-y-2">
        {requirements.map((req, idx) => (
          <div
            key={idx}
            className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start space-x-3"
          >
            <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {idx + 1}
            </div>
            <p className="text-gray-700 flex-1">{req}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  CheckCircleIcon,
  TruckIcon,
  ClipboardDocumentCheckIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import type { Load } from "../../../../shared/types";

interface LoadStatusActionsProps {
  load: Load;
  onGetMatches: () => void;
  loadingMatches: boolean;
}

export default function LoadStatusActions({
  load,
  onGetMatches,
  loadingMatches,
}: LoadStatusActionsProps) {
  const statusColors = {
    posted: "bg-blue-100 text-blue-800 border-blue-200",
    bidding: "bg-yellow-100 text-yellow-800 border-yellow-200",
    assigned: "bg-green-100 text-green-800 border-green-200",
    in_transit: "bg-purple-100 text-purple-800 border-purple-200",
    delivered: "bg-gray-100 text-gray-800 border-gray-200",
    completed: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <Card className="h-full">
      <div className="flex items-center space-x-2 mb-4">
        <ClipboardDocumentCheckIcon className="h-6 w-6 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-900">
          Status & Actions
        </h2>
      </div>
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Status
          </p>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${
              statusColors[load.status]
            }`}
          >
            {load.status.toUpperCase().replace("_", " ")}
          </span>
        </div>

        {load.assignedCarrierName && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <TruckIcon className="h-5 w-5 text-green-600" />
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Assigned Carrier
              </p>
            </div>
            <p className="font-semibold text-gray-900">
              {load.assignedCarrierName}
            </p>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <CheckCircleIcon className="h-5 w-5 text-blue-600" />
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Bids Received
                </p>
              </div>
              <p className="font-semibold text-gray-900 text-2xl">
                {load.bids.length}
              </p>
            </div>
          </div>
        </div>

        {load.status === "posted" && (
          <Button
            onClick={onGetMatches}
            disabled={loadingMatches}
            variant="primary"
            className="w-full flex items-center justify-center space-x-2"
          >
            {loadingMatches ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Finding Matches...</span>
              </>
            ) : (
              <>
                <SparklesIcon className="h-5 w-5" />
                <span>Find Matching Carriers</span>
              </>
            )}
          </Button>
        )}
      </div>
    </Card>
  );
}

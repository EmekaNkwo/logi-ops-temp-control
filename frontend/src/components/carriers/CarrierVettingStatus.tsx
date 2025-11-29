"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  StarIcon,
  TruckIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import type { Carrier } from "../../../../shared/types";

interface CarrierVettingStatusProps {
  carrier: Carrier;
  onReRunVetting: () => void;
}

export default function CarrierVettingStatus({
  carrier,
  onReRunVetting,
}: CarrierVettingStatusProps) {
  const getStatusConfig = (status: string) => {
    const configs = {
      approved: {
        icon: CheckCircleIcon,
        color: "text-green-600",
        bg: "bg-green-100",
        border: "border-green-200",
        label: "APPROVED",
      },
      pending: {
        icon: ClockIcon,
        color: "text-yellow-600",
        bg: "bg-yellow-100",
        border: "border-yellow-200",
        label: "PENDING",
      },
      under_review: {
        icon: ExclamationTriangleIcon,
        color: "text-blue-600",
        bg: "bg-blue-100",
        border: "border-blue-200",
        label: "UNDER REVIEW",
      },
      rejected: {
        icon: XCircleIcon,
        color: "text-red-600",
        bg: "bg-red-100",
        border: "border-red-200",
        label: "REJECTED",
      },
    };
    return (
      configs[status as keyof typeof configs] || {
        icon: ClockIcon,
        color: "text-gray-600",
        bg: "bg-gray-100",
        border: "border-gray-200",
        label: status.toUpperCase(),
      }
    );
  };

  const statusConfig = getStatusConfig(carrier.vettingStatus);
  const StatusIcon = statusConfig.icon;

  return (
    <Card className="h-full">
      <div className="flex items-center space-x-2 mb-4">
        <CheckCircleIcon className="h-6 w-6 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-900">Vetting Status</h2>
      </div>
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Status
          </p>
          <div
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg border ${statusConfig.bg} ${statusConfig.border}`}
          >
            <StatusIcon className={`h-5 w-5 ${statusConfig.color}`} />
            <span className={`font-semibold ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>
        </div>

        {carrier.vettingScore !== undefined && (
          <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Vetting Score
            </p>
            <div className="flex items-baseline space-x-2">
              <p className="text-3xl font-bold text-primary-600">
                {carrier.vettingScore}
              </p>
              <span className="text-gray-500">/100</span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  carrier.vettingScore >= 80
                    ? "bg-green-500"
                    : carrier.vettingScore >= 60
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${carrier.vettingScore}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
          <div className="flex items-center space-x-2 mb-1">
            <StarIcon className="h-5 w-5 text-yellow-600" />
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Rating
            </p>
          </div>
          <p className="font-semibold text-gray-900 text-xl">
            {carrier.rating ? `${carrier.rating.toFixed(1)}/5.0` : "N/A"}
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-center space-x-2 mb-1">
            <TruckIcon className="h-5 w-5 text-blue-600" />
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Total Shipments
            </p>
          </div>
          <p className="font-semibold text-gray-900 text-xl">
            {carrier.totalShipments || 0}
          </p>
        </div>

        <Button
          onClick={onReRunVetting}
          variant="secondary"
          className="w-full flex items-center justify-center space-x-2"
        >
          <ArrowPathIcon className="h-4 w-4" />
          <span>Re-run Vetting</span>
        </Button>
      </div>
    </Card>
  );
}

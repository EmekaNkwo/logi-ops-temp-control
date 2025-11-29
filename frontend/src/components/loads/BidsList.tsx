"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { format } from "date-fns";
import {
  CurrencyDollarIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import type { Load } from "../../../../shared/types";

interface BidsListProps {
  bids: Load["bids"];
  loadStatus: Load["status"];
  onAcceptBid: (carrierId: string, bidId: string) => void;
}

export default function BidsList({
  bids,
  loadStatus,
  onAcceptBid,
}: BidsListProps) {
  if (bids.length === 0) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      accepted: {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-200",
        icon: CheckCircleIcon,
      },
      rejected: {
        bg: "bg-red-100",
        text: "text-red-800",
        border: "border-red-200",
        icon: XCircleIcon,
      },
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        border: "border-yellow-200",
        icon: ClockIcon,
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}
      >
        <Icon className="h-3 w-3" />
        <span>{status.toUpperCase()}</span>
      </span>
    );
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <CurrencyDollarIcon className="h-6 w-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">Bids</h2>
        </div>
        <span className="text-sm text-gray-500">
          {bids.length} bid{bids.length !== 1 ? "s" : ""} received
        </span>
      </div>
      <div className="space-y-4">
        {bids.map((bid) => (
          <div
            key={bid.id}
            className="border-2 border-gray-200 rounded-xl p-5 hover:border-primary-300 hover:shadow-md transition-all duration-200 bg-white"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg text-gray-900">
                    {bid.carrierName}
                  </h3>
                  {getStatusBadge(bid.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2 mb-1">
                      <CurrencyDollarIcon className="h-4 w-4 text-green-600" />
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Bid Amount
                      </p>
                    </div>
                    <p className="font-bold text-green-800 text-xl">
                      ${bid.amount.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2 mb-1">
                      <CalendarDaysIcon className="h-4 w-4 text-blue-600" />
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Est. Delivery
                      </p>
                    </div>
                    <p className="font-semibold text-blue-800">
                      {format(
                        new Date(bid.estimatedDeliveryDate),
                        "MMM dd, yyyy"
                      )}
                    </p>
                  </div>
                </div>

                {bid.notes && (
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-2 mb-1">
                      <DocumentTextIcon className="h-4 w-4 text-gray-500" />
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Notes
                      </p>
                    </div>
                    <p className="text-sm text-gray-700">{bid.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {bid.status === "pending" && loadStatus === "bidding" && (
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onAcceptBid(bid.carrierId, bid.id)}
                  className="flex items-center space-x-2"
                >
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>Accept Bid</span>
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  TruckIcon,
  SparklesIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import type { Load } from "../../../../shared/types";

interface MatchingCarrier {
  carrier: {
    id: string;
    companyName: string;
  };
  score: number;
  reasons: string[];
}

interface MatchingCarriersListProps {
  matches: MatchingCarrier[];
  load: Load;
  onAssign: (carrierId: string) => void;
}

export default function MatchingCarriersList({
  matches,
  load,
  onAssign,
}: MatchingCarriersListProps) {
  if (matches.length === 0) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-orange-500";
  };

  return (
    <Card>
      <div className="flex items-center space-x-2 mb-6">
        <SparklesIcon className="h-6 w-6 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-900">
          Matching Carriers
        </h2>
        <span className="ml-auto text-sm text-gray-500">
          {matches.length} match{matches.length !== 1 ? "es" : ""} found
        </span>
      </div>
      <div className="space-y-4">
        {matches.map((match, idx) => (
          <div
            key={match.carrier.id}
            className="border-2 border-gray-200 rounded-xl p-5 hover:border-primary-300 hover:shadow-md transition-all duration-200 bg-white"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start space-x-3 flex-1">
                <div className="bg-primary-100 rounded-lg p-3">
                  <TruckIcon className="h-6 w-6 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {match.carrier.companyName}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="relative w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`absolute top-0 left-0 h-full ${getScoreColor(
                          match.score
                        )} transition-all duration-300`}
                        style={{ width: `${match.score}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      {match.score}/100
                    </span>
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="primary"
                onClick={() => onAssign(match.carrier.id)}
                disabled={load.status !== "posted"}
                className="flex items-center space-x-2"
              >
                <CheckCircleIcon className="h-4 w-4" />
                <span>Assign</span>
              </Button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Match Reasons
              </p>
              <div className="space-y-1.5">
                {match.reasons.map((reason: string, i: number) => (
                  <div key={i} className="flex items-start space-x-2">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

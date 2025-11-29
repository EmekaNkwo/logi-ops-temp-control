"use client";

import Card from "@/components/ui/Card";
import type { VettingResult } from "../../../../shared/types";

interface VettingResultCardProps {
  result: VettingResult;
}

export default function VettingResultCard({ result }: VettingResultCardProps) {
  const statusColors = {
    approved: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    under_review: "bg-blue-100 text-blue-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <Card title="Vetting Results">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              statusColors[result.status]
            }`}
          >
            {result.status.toUpperCase().replace("_", " ")}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Score:</span>
          <span className="text-2xl font-bold text-primary-600">
            {result.score}/100
          </span>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3">Vetting Checks:</h4>
          <div className="space-y-3">
            <div
              className={`p-3 rounded ${
                result.checks.equipment.passed ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">Equipment</span>
                <span
                  className={
                    result.checks.equipment.passed
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {result.checks.equipment.passed ? "✓ Passed" : "✗ Failed"}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {result.checks.equipment.details}
              </p>
            </div>

            <div
              className={`p-3 rounded ${
                result.checks.insurance.passed ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">Insurance</span>
                <span
                  className={
                    result.checks.insurance.passed
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {result.checks.insurance.passed ? "✓ Passed" : "✗ Failed"}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {result.checks.insurance.details}
              </p>
            </div>

            <div
              className={`p-3 rounded ${
                result.checks.safety.passed ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">Safety</span>
                <span
                  className={
                    result.checks.safety.passed
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {result.checks.safety.passed ? "✓ Passed" : "✗ Failed"}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {result.checks.safety.details}
              </p>
            </div>

            <div
              className={`p-3 rounded ${
                result.checks.experience.passed ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">Experience</span>
                <span
                  className={
                    result.checks.experience.passed
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {result.checks.experience.passed ? "✓ Passed" : "✗ Failed"}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {result.checks.experience.details}
              </p>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 pt-2">
          Reviewed at: {new Date(result.reviewedAt).toLocaleString()}
        </div>
      </div>
    </Card>
  );
}

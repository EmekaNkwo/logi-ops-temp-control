"use client";

import Card from "@/components/ui/Card";
import type { ComplianceIssue } from "../../../../shared/types";
import { format } from "date-fns";

interface ComplianceIssuesListProps {
  issues: ComplianceIssue[];
}

export default function ComplianceIssuesList({
  issues,
}: ComplianceIssuesListProps) {
  if (issues.length === 0) {
    return (
      <Card title="Compliance Status">
        <div className="text-center py-4">
          <p className="text-green-600 font-semibold">
            ✓ No compliance issues detected
          </p>
        </div>
      </Card>
    );
  }

  const severityColors = {
    low: "bg-yellow-50 border-yellow-200",
    medium: "bg-orange-50 border-orange-200",
    high: "bg-red-50 border-red-200",
    critical: "bg-red-100 border-red-300",
  };

  const typeLabels = {
    temperature_excursion: "Temperature Excursion",
    haccp_violation: "HACCP Violation",
    documentation_gap: "Documentation Gap",
    delay: "Delay",
  };

  return (
    <Card title={`Compliance Issues (${issues.length})`}>
      <div className="space-y-3">
        {issues.map((issue) => (
          <div
            key={issue.id}
            className={`p-4 rounded-lg border ${
              severityColors[issue.severity]
            } ${issue.resolved ? "opacity-60" : ""}`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold text-gray-900">
                  {typeLabels[issue.type] || issue.type}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {issue.description}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    issue.severity === "critical"
                      ? "bg-red-200 text-red-800"
                      : issue.severity === "high"
                      ? "bg-orange-200 text-orange-800"
                      : issue.severity === "medium"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {issue.severity.toUpperCase()}
                </span>
                {issue.resolved && (
                  <span className="text-xs text-green-600 mt-1">
                    ✓ Resolved
                  </span>
                )}
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Detected:{" "}
              {format(new Date(issue.detectedAt), "MMM dd, yyyy HH:mm")}
              {issue.resolvedAt && (
                <span className="ml-4">
                  Resolved:{" "}
                  {format(new Date(issue.resolvedAt), "MMM dd, yyyy HH:mm")}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

interface LoadsPageHeaderProps {
  totalLoads: number;
  onFilterChange?: (filter: string) => void;
  activeFilter?: string;
  onPostNewLoad?: () => void;
}

export default function LoadsPageHeader({
  totalLoads,
  onFilterChange,
  activeFilter: externalActiveFilter,
  onPostNewLoad,
}: LoadsPageHeaderProps) {
  const [internalActiveFilter, setInternalActiveFilter] = useState("all");
  const activeFilter = externalActiveFilter || internalActiveFilter;

  const filters = [
    { id: "all", label: "All Loads", count: totalLoads, icon: "📦" },
    { id: "posted", label: "Posted", icon: "📋" },
    { id: "bidding", label: "Bidding", icon: "💰" },
    { id: "assigned", label: "Assigned", icon: "✅" },
    { id: "in_transit", label: "In Transit", icon: "🚚" },
  ];

  useEffect(() => {
    if (externalActiveFilter !== undefined) {
      setInternalActiveFilter(externalActiveFilter);
    }
  }, [externalActiveFilter]);

  const handleFilterClick = (filterId: string) => {
    setInternalActiveFilter(filterId);
    if (onFilterChange) {
      onFilterChange(filterId);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Available Loads
          </h1>
          <p className="text-gray-600">
            Browse and bid on temperature-controlled shipping opportunities
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              // This will be handled by parent component
              if (onPostNewLoad) {
                onPostNewLoad();
              }
            }}
          >
            + Post New Load
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => handleFilterClick(filter.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center space-x-2 ${
              activeFilter === filter.id
                ? "bg-primary-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {filter.icon && <span>{filter.icon}</span>}
            <span>{filter.label}</span>
            {filter.count !== undefined && (
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  activeFilter === filter.id
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {filter.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

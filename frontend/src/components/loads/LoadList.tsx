"use client";

import type { Load } from "../../../../shared/types";
import LoadCard from "./LoadCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Card from "@/components/ui/Card";
import Pagination from "@/components/ui/Pagination";

interface LoadListProps {
  loads: Load[];
  loading: boolean;
  currentPage?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
}

export default function LoadList({
  loads,
  loading,
  currentPage = 1,
  itemsPerPage = 12,
  onPageChange,
}: LoadListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading loads...</p>
        </div>
      </div>
    );
  }

  if (loads.length === 0) {
    return (
      <Card className="text-center py-16">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Loads Available
        </h3>
        <p className="text-gray-600 max-w-md mx-auto mb-6">
          There are currently no loads available. Be the first to post a load or
          check back later for new opportunities.
        </p>
      </Card>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(loads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLoads = loads.slice(startIndex, endIndex);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedLoads.map((load) => (
          <LoadCard key={load.id} load={load} showActions />
        ))}
      </div>

      {onPageChange && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          itemsPerPage={itemsPerPage}
          totalItems={loads.length}
        />
      )}
    </>
  );
}

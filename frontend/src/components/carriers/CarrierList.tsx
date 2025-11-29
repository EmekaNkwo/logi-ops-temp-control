"use client";

import type { Carrier } from "../../../../shared/types";
import CarrierCard from "./CarrierCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Card from "@/components/ui/Card";
import Pagination from "@/components/ui/Pagination";

interface CarrierListProps {
  carriers: Carrier[];
  loading: boolean;
  currentPage?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
}

export default function CarrierList({
  carriers,
  loading,
  currentPage = 1,
  itemsPerPage = 12,
  onPageChange,
}: CarrierListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading carriers...</p>
        </div>
      </div>
    );
  }

  if (carriers.length === 0) {
    return (
      <Card className="text-center py-16">
        <div className="text-6xl mb-4">🚛</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Carriers Found
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          There are currently no carriers registered. Check back later or
          register as a carrier to get started.
        </p>
      </Card>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(carriers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCarriers = carriers.slice(startIndex, endIndex);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedCarriers.map((carrier) => (
          <CarrierCard key={carrier.id} carrier={carrier} />
        ))}
      </div>

      {onPageChange && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          itemsPerPage={itemsPerPage}
          totalItems={carriers.length}
        />
      )}
    </>
  );
}

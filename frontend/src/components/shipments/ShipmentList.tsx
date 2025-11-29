"use client";

import type { Shipment } from "../../../../shared/types";
import ShipmentCard from "./ShipmentCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Card from "@/components/ui/Card";
import Pagination from "@/components/ui/Pagination";

interface ShipmentListProps {
  shipments: Shipment[];
  loading: boolean;
  currentPage?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
}

export default function ShipmentList({
  shipments,
  loading,
  currentPage = 1,
  itemsPerPage = 10,
  onPageChange,
}: ShipmentListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading shipments...</p>
        </div>
      </div>
    );
  }

  if (shipments.length === 0) {
    return (
      <Card className="text-center py-16">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Active Shipments
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          There are currently no active shipments. Check back later or create a
          new load to get started.
        </p>
      </Card>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(shipments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedShipments = shipments.slice(startIndex, endIndex);

  return (
    <>
      <div className="grid grid-cols-1 gap-6">
        {paginatedShipments.map((shipment) => (
          <ShipmentCard key={shipment.id} shipment={shipment} />
        ))}
      </div>

      {onPageChange && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          itemsPerPage={itemsPerPage}
          totalItems={shipments.length}
        />
      )}
    </>
  );
}

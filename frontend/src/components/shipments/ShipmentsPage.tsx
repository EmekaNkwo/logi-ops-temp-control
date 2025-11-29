"use client";

import { useEffect, useState } from "react";
import { useShipmentStore } from "@/stores/useShipmentStore";
import type { Shipment } from "../../../../shared/types";
import ShipmentsPageHeader from "./ShipmentsPageHeader";
import ShipmentList from "./ShipmentList";
import NewShipmentModal from "./NewShipmentModal";

const ITEMS_PER_PAGE = 10;

export default function ShipmentsPage() {
  const { shipments, loading, fetchShipments } = useShipmentStore();
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isNewShipmentModalOpen, setIsNewShipmentModalOpen] = useState(false);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  useEffect(() => {
    setFilteredShipments(shipments);
    setCurrentPage(1); // Reset to first page when shipments change
  }, [shipments]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1); // Reset to first page when filter changes

    if (filter === "all") {
      setFilteredShipments(shipments);
    } else {
      setFilteredShipments(shipments.filter((s) => s.status === filter));
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ShipmentsPageHeader
          totalShipments={filteredShipments.length}
          onFilterChange={handleFilterChange}
          activeFilter={activeFilter}
          onNewShipment={() => setIsNewShipmentModalOpen(true)}
        />
        <ShipmentList
          shipments={filteredShipments}
          loading={loading}
          currentPage={currentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
        />
        <NewShipmentModal
          isOpen={isNewShipmentModalOpen}
          onClose={() => setIsNewShipmentModalOpen(false)}
        />
      </main>
    </div>
  );
}

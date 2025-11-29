"use client";

import { useEffect, useState } from "react";
import { useCarrierStore } from "@/stores/useCarrierStore";
import type { Carrier } from "../../../../shared/types";
import CarriersPageHeader from "./CarriersPageHeader";
import CarrierList from "./CarrierList";
import CarrierRegistrationModal from "@/components/registration/CarrierRegistrationModal";

const ITEMS_PER_PAGE = 12;

export default function CarriersPage() {
  const { carriers, loading, fetchCarriers } = useCarrierStore();
  const [filteredCarriers, setFilteredCarriers] = useState<Carrier[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  useEffect(() => {
    fetchCarriers();
  }, [fetchCarriers]);

  useEffect(() => {
    setFilteredCarriers(carriers);
    setCurrentPage(1); // Reset to first page when carriers change
  }, [carriers]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1); // Reset to first page when filter changes

    if (filter === "all") {
      setFilteredCarriers(carriers);
    } else {
      setFilteredCarriers(carriers.filter((c) => c.vettingStatus === filter));
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
        <CarriersPageHeader
          totalCarriers={filteredCarriers.length}
          onFilterChange={handleFilterChange}
          activeFilter={activeFilter}
          onRegisterCarrier={() => setIsRegisterModalOpen(true)}
        />
        <CarrierList
          carriers={filteredCarriers}
          loading={loading}
          currentPage={currentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
        />
        <CarrierRegistrationModal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
        />
      </main>
    </div>
  );
}

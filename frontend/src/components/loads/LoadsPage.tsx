"use client";

import { useEffect, useState } from "react";
import { useLoadStore } from "@/stores/useLoadStore";
import type { Load } from "../../../../shared/types";
import LoadsPageHeader from "./LoadsPageHeader";
import LoadList from "./LoadList";
import NewLoadModal from "./NewLoadModal";

const ITEMS_PER_PAGE = 12;

export default function LoadsPage() {
  const { loads, loading, fetchLoads } = useLoadStore();
  const [filteredLoads, setFilteredLoads] = useState<Load[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isNewLoadModalOpen, setIsNewLoadModalOpen] = useState(false);

  useEffect(() => {
    fetchLoads();
  }, [fetchLoads]);

  useEffect(() => {
    setFilteredLoads(loads);
    setCurrentPage(1); // Reset to first page when loads change
  }, [loads]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1); // Reset to first page when filter changes

    if (filter === "all") {
      setFilteredLoads(loads);
    } else {
      setFilteredLoads(loads.filter((l) => l.status === filter));
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
        <LoadsPageHeader
          totalLoads={filteredLoads.length}
          onFilterChange={handleFilterChange}
          activeFilter={activeFilter}
          onPostNewLoad={() => setIsNewLoadModalOpen(true)}
        />
        <LoadList
          loads={filteredLoads}
          loading={loading}
          currentPage={currentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
        />
        <NewLoadModal
          isOpen={isNewLoadModalOpen}
          onClose={() => setIsNewLoadModalOpen(false)}
        />
      </main>
    </div>
  );
}

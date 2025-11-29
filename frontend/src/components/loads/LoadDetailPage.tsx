"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoadStore } from "@/stores/useLoadStore";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import LoadDetailHeader from "./LoadDetailHeader";
import LoadRouteInfo from "./LoadRouteInfo";
import LoadCargoDetails from "./LoadCargoDetails";
import LoadStatusActions from "./LoadStatusActions";
import LoadSpecialRequirements from "./LoadSpecialRequirements";
import MatchingCarriersList from "./MatchingCarriersList";
import BidsList from "./BidsList";

interface LoadDetailPageProps {
  loadId: string;
}

export default function LoadDetailPage({ loadId }: LoadDetailPageProps) {
  const { currentLoad, fetchLoad, getMatches, assignLoad, loading } =
    useLoadStore();
  const [matches, setMatches] = useState<any[]>([]);
  const [showMatches, setShowMatches] = useState(false);
  const [loadingMatches, setLoadingMatches] = useState(false);

  const handleGetMatches = async () => {
    setLoadingMatches(true);
    try {
      const results = await getMatches(loadId);
      setMatches(results);
      setShowMatches(true);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoadingMatches(false);
    }
  };

  const handleAssign = async (carrierId: string, bidId?: string) => {
    if (confirm("Assign this load to the selected carrier?")) {
      try {
        await assignLoad(loadId, carrierId, bidId);
        alert("Load assigned successfully!");
        fetchLoad(loadId);
        setShowMatches(false);
        setMatches([]);
      } catch (error: any) {
        alert(`Error: ${error.message}`);
      }
    }
  };

  if (loading || !currentLoad) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading load details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoadDetailHeader loadId={currentLoad.id} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <LoadRouteInfo load={currentLoad} />
          <LoadCargoDetails load={currentLoad} />
          <LoadStatusActions
            load={currentLoad}
            onGetMatches={handleGetMatches}
            loadingMatches={loadingMatches}
          />
        </div>

        {currentLoad.specialRequirements.length > 0 && (
          <div className="mb-6">
            <LoadSpecialRequirements
              requirements={currentLoad.specialRequirements}
            />
          </div>
        )}

        {showMatches && matches.length > 0 && (
          <div className="mb-6">
            <MatchingCarriersList
              matches={matches}
              load={currentLoad}
              onAssign={handleAssign}
            />
          </div>
        )}

        {currentLoad.bids.length > 0 && (
          <div className="mb-6">
            <BidsList
              bids={currentLoad.bids}
              loadStatus={currentLoad.status}
              onAcceptBid={handleAssign}
            />
          </div>
        )}
      </main>
    </div>
  );
}

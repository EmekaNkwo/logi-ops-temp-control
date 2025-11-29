"use client";

import { useEffect } from "react";
import { useCarrierStore } from "@/stores/useCarrierStore";
import { useReviewStore } from "@/stores/useReviewStore";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import VettingResultCard from "@/components/vetting/VettingResultCard";
import ReviewList from "@/components/reviews/ReviewList";
import CarrierDetailHeader from "./CarrierDetailHeader";
import CarrierCompanyInfo from "./CarrierCompanyInfo";
import CarrierVettingStatus from "./CarrierVettingStatus";
import CarrierEquipmentCertifications from "./CarrierEquipmentCertifications";
import CarrierEquipmentList from "./CarrierEquipmentList";

interface CarrierDetailPageProps {
  carrierId: string;
}

export default function CarrierDetailPage({
  carrierId,
}: CarrierDetailPageProps) {
  const { currentCarrier, fetchCarrier, vetCarrier, loading } =
    useCarrierStore();
  const { reviews, fetchReviews } = useReviewStore();

  useEffect(() => {
    fetchCarrier(carrierId);
    fetchReviews({ carrierId });
  }, [carrierId, fetchCarrier, fetchReviews]);

  const handleVetting = async () => {
    if (currentCarrier) {
      try {
        await vetCarrier(currentCarrier.id);
        alert("Vetting completed! Check the results below.");
      } catch (error: any) {
        alert(`Error: ${error.message}`);
      }
    }
  };

  if (loading || !currentCarrier) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading carrier details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CarrierDetailHeader
          companyName={currentCarrier.companyName}
          contactName={currentCarrier.contactName}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <CarrierCompanyInfo carrier={currentCarrier} />
          <CarrierVettingStatus
            carrier={currentCarrier}
            onReRunVetting={handleVetting}
          />
          <CarrierEquipmentCertifications carrier={currentCarrier} />
        </div>

        {currentCarrier.vettingScore !== undefined && (
          <div className="mb-6">
            <VettingResultCard
              result={{
                carrierId: currentCarrier.id,
                status: currentCarrier.vettingStatus,
                score: currentCarrier.vettingScore,
                checks: {
                  equipment: { passed: true, details: "Equipment check" },
                  insurance: { passed: true, details: "Insurance check" },
                  safety: { passed: true, details: "Safety check" },
                  experience: { passed: true, details: "Experience check" },
                },
                reviewedAt: new Date().toISOString(),
              }}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CarrierEquipmentList equipment={currentCarrier.equipment} />
          <ReviewList reviews={reviews} title="Reviews" />
        </div>
      </main>
    </div>
  );
}

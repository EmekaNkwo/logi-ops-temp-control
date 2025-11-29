"use client";

import { use } from "react";
import Navbar from "@/components/layout/Navbar";
import CarrierDetailPage from "@/components/carriers/CarrierDetailPage";

export default function CarrierDetailPageRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <CarrierDetailPage carrierId={id} />
    </div>
  );
}

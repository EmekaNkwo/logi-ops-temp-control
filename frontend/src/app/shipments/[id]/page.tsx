"use client";

import { use } from "react";
import Navbar from "@/components/layout/Navbar";
import ShipmentDashboard from "@/components/shipments/ShipmentDashboard";

export default function ShipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ShipmentDashboard shipmentId={id} />
      </main>
    </div>
  );
}

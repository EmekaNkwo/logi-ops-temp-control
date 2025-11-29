"use client";

import { use, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { useLoadStore } from "@/stores/useLoadStore";
import LoadDetailPage from "@/components/loads/LoadDetailPage";

export default function LoadDetailPageRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { fetchLoad } = useLoadStore();

  useEffect(() => {
    fetchLoad(id);
  }, [id, fetchLoad]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <LoadDetailPage loadId={id} />
    </div>
  );
}

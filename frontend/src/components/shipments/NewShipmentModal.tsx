"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLoadStore } from "@/stores/useLoadStore";
import { useCarrierStore } from "@/stores/useCarrierStore";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface NewShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewShipmentModal({
  isOpen,
  onClose,
}: NewShipmentModalProps) {
  const router = useRouter();
  const { loads, fetchLoads, assignLoad } = useLoadStore();
  const { carriers, fetchCarriers } = useCarrierStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    loadId: "",
    carrierId: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (loads.length === 0) fetchLoads();
      if (carriers.length === 0) fetchCarriers();
    }
  }, [isOpen, loads.length, carriers.length, fetchLoads, fetchCarriers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const load = loads.find((l) => l.id === formData.loadId);
      const carrier = carriers.find((c) => c.id === formData.carrierId);

      if (!load || !carrier) {
        alert("Please select both a load and a carrier");
        setLoading(false);
        return;
      }

      // Use the assign load API which creates a shipment
      const result = await assignLoad(formData.loadId, formData.carrierId);

      handleClose();
      if (result.shipment) {
        router.push(`/shipments/${result.shipment.id}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      loadId: "",
      carrierId: "",
    });
    onClose();
  };

  const availableLoads = loads.filter(
    (l) => l.status === "posted" || l.status === "bidding"
  );
  const approvedCarriers = carriers.filter(
    (c) => c.vettingStatus === "approved"
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Shipment"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Load *
          </label>
          <select
            required
            value={formData.loadId}
            onChange={(e) =>
              setFormData({ ...formData, loadId: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Choose a load...</option>
            {availableLoads.map((load) => (
              <option key={load.id} value={load.id}>
                {load.cargoType} - {load.origin.city} to {load.destination.city}{" "}
                (${load.basePrice.toLocaleString()})
              </option>
            ))}
          </select>
          {availableLoads.length === 0 && (
            <p className="text-sm text-gray-500 mt-1">
              No available loads. Post a new load first.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Carrier *
          </label>
          <select
            required
            value={formData.carrierId}
            onChange={(e) =>
              setFormData({ ...formData, carrierId: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Choose a carrier...</option>
            {approvedCarriers.map((carrier) => (
              <option key={carrier.id} value={carrier.id}>
                {carrier.companyName} ({carrier.equipment.length} equipment)
              </option>
            ))}
          </select>
          {approvedCarriers.length === 0 && (
            <p className="text-sm text-gray-500 mt-1">
              No approved carriers available.
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              loading ||
              availableLoads.length === 0 ||
              approvedCarriers.length === 0
            }
          >
            {loading ? <LoadingSpinner size="sm" /> : "Create Shipment"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

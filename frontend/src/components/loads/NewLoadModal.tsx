"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLoadStore } from "@/stores/useLoadStore";
import { useShipperStore } from "@/stores/useShipperStore";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { v4 as uuidv4 } from "uuid";

interface NewLoadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewLoadModal({ isOpen, onClose }: NewLoadModalProps) {
  const router = useRouter();
  const { createLoad, loading } = useLoadStore();
  const { shippers, fetchShippers } = useShipperStore();
  const [formData, setFormData] = useState({
    shipperId: "",
    origin: {
      address: "",
      city: "",
      state: "",
      zipCode: "",
    },
    destination: {
      address: "",
      city: "",
      state: "",
      zipCode: "",
    },
    pickupDate: "",
    deliveryDate: "",
    cargoType: "",
    weight: "",
    volume: "",
    temperatureMin: "",
    temperatureMax: "",
    basePrice: "",
    specialRequirements: [] as string[],
  });
  const [newRequirement, setNewRequirement] = useState("");

  useEffect(() => {
    if (isOpen && shippers.length === 0) {
      fetchShippers();
    }
  }, [isOpen, shippers.length, fetchShippers]);

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData({
        ...formData,
        specialRequirements: [
          ...formData.specialRequirements,
          newRequirement.trim(),
        ],
      });
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    setFormData({
      ...formData,
      specialRequirements: formData.specialRequirements.filter(
        (_, i) => i !== index
      ),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const shipper = shippers.find((s) => s.id === formData.shipperId);
      if (!shipper) {
        alert("Please select a shipper");
        return;
      }

      const load = await createLoad({
        id: uuidv4(),
        shipperId: formData.shipperId,
        shipperName: shipper.companyName,
        origin: {
          lat: 0,
          lng: 0,
          ...formData.origin,
        },
        destination: {
          lat: 0,
          lng: 0,
          ...formData.destination,
        },
        pickupDate: formData.pickupDate,
        deliveryDate: formData.deliveryDate,
        cargoType: formData.cargoType,
        weight: parseInt(formData.weight),
        volume: parseInt(formData.volume),
        temperatureRequirement: {
          min: parseInt(formData.temperatureMin),
          max: parseInt(formData.temperatureMax),
          range:
            parseInt(formData.temperatureMin) < -10 ? "frozen" : "refrigerated",
        },
        specialRequirements: formData.specialRequirements,
        basePrice: parseInt(formData.basePrice),
        status: "posted",
        bids: [],
        postedAt: new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString().split("T")[0],
      });

      handleClose();
      router.push(`/loads/${load.id}`);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleClose = () => {
    // Reset form on close
    setFormData({
      shipperId: "",
      origin: {
        address: "",
        city: "",
        state: "",
        zipCode: "",
      },
      destination: {
        address: "",
        city: "",
        state: "",
        zipCode: "",
      },
      pickupDate: "",
      deliveryDate: "",
      cargoType: "",
      weight: "",
      volume: "",
      temperatureMin: "",
      temperatureMax: "",
      basePrice: "",
      specialRequirements: [],
    });
    setNewRequirement("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Post New Load"
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Shipper *
          </label>
          <select
            required
            value={formData.shipperId}
            onChange={(e) =>
              setFormData({ ...formData, shipperId: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select a shipper</option>
            {shippers.map((shipper) => (
              <option key={shipper.id} value={shipper.id}>
                {shipper.companyName}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Origin</h3>
            <input
              type="text"
              placeholder="Address"
              required
              value={formData.origin.address}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  origin: { ...formData.origin, address: e.target.value },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
            />
            <input
              type="text"
              placeholder="City"
              required
              value={formData.origin.city}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  origin: { ...formData.origin, city: e.target.value },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="State"
                required
                value={formData.origin.state}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    origin: { ...formData.origin, state: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="ZIP"
                required
                value={formData.origin.zipCode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    origin: { ...formData.origin, zipCode: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Destination</h3>
            <input
              type="text"
              placeholder="Address"
              required
              value={formData.destination.address}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  destination: {
                    ...formData.destination,
                    address: e.target.value,
                  },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
            />
            <input
              type="text"
              placeholder="City"
              required
              value={formData.destination.city}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  destination: {
                    ...formData.destination,
                    city: e.target.value,
                  },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="State"
                required
                value={formData.destination.state}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    destination: {
                      ...formData.destination,
                      state: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="ZIP"
                required
                value={formData.destination.zipCode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    destination: {
                      ...formData.destination,
                      zipCode: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pickup Date *
            </label>
            <input
              type="date"
              required
              value={formData.pickupDate}
              onChange={(e) =>
                setFormData({ ...formData, pickupDate: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Date *
            </label>
            <input
              type="date"
              required
              value={formData.deliveryDate}
              onChange={(e) =>
                setFormData({ ...formData, deliveryDate: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cargo Type *
            </label>
            <input
              type="text"
              required
              value={formData.cargoType}
              onChange={(e) =>
                setFormData({ ...formData, cargoType: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight (lbs) *
            </label>
            <input
              type="number"
              required
              value={formData.weight}
              onChange={(e) =>
                setFormData({ ...formData, weight: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Volume (cu ft) *
            </label>
            <input
              type="number"
              required
              value={formData.volume}
              onChange={(e) =>
                setFormData({ ...formData, volume: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Temperature (°C) *
            </label>
            <input
              type="number"
              required
              value={formData.temperatureMin}
              onChange={(e) =>
                setFormData({ ...formData, temperatureMin: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Temperature (°C) *
            </label>
            <input
              type="number"
              required
              value={formData.temperatureMax}
              onChange={(e) =>
                setFormData({ ...formData, temperatureMax: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base Price ($) *
            </label>
            <input
              type="number"
              required
              value={formData.basePrice}
              onChange={(e) =>
                setFormData({ ...formData, basePrice: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Requirements
          </label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addRequirement())
              }
              placeholder="Add requirement"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            />
            <Button type="button" variant="secondary" onClick={addRequirement}>
              Add
            </Button>
          </div>
          {formData.specialRequirements.length > 0 && (
            <div className="space-y-1">
              {formData.specialRequirements.map((req, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded"
                >
                  <span className="text-sm">{req}</span>
                  <button
                    type="button"
                    onClick={() => removeRequirement(idx)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? <LoadingSpinner size="sm" /> : "Post Load"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

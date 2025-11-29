"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCarrierStore } from "@/stores/useCarrierStore";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { v4 as uuidv4 } from "uuid";
import type { Equipment } from "../../../../shared/types";

export default function CarrierRegistrationForm() {
  const router = useRouter();
  const { createCarrier, vetCarrier, loading } = useCarrierStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    dotNumber: "",
    mcNumber: "",
    safetyRating: "satisfactory" as
      | "satisfactory"
      | "conditional"
      | "unsatisfactory",
    foodHandlingExperience: "",
    certifications: [] as string[],
    insurance: {
      liability: "",
      cargo: "",
      expirationDate: "",
    },
  });
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [newEquipment, setNewEquipment] = useState({
    type: "reefer_truck" as Equipment["type"],
    make: "",
    model: "",
    year: "",
    capacity: "",
    temperatureRange: { min: "", max: "" },
    certifications: [] as string[],
  });

  const addEquipment = () => {
    if (newEquipment.make && newEquipment.model && newEquipment.year) {
      setEquipment([
        ...equipment,
        {
          id: uuidv4(),
          ...newEquipment,
          year: parseInt(newEquipment.year),
          capacity: parseInt(newEquipment.capacity),
          temperatureRange: {
            min: parseInt(newEquipment.temperatureRange.min),
            max: parseInt(newEquipment.temperatureRange.max),
          },
          lastInspectionDate: new Date().toISOString().split("T")[0],
        },
      ]);
      setNewEquipment({
        type: "reefer_truck",
        make: "",
        model: "",
        year: "",
        capacity: "",
        temperatureRange: { min: "", max: "" },
        certifications: [],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const carrier = await createCarrier({
        id: uuidv4(),
        ...formData,
        address: {
          lat: 0,
          lng: 0,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        equipment,
        insurance: {
          liability: parseInt(formData.insurance.liability),
          cargo: parseInt(formData.insurance.cargo),
          expirationDate: formData.insurance.expirationDate,
        },
        foodHandlingExperience: parseInt(formData.foodHandlingExperience),
        vettingStatus: "pending",
        registrationDate: new Date().toISOString().split("T")[0],
      });

      // Automatically trigger vetting
      await vetCarrier(carrier.id);
      router.push(`/carriers/${carrier.id}`);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <Card
      title={`Register as Carrier - Step ${step} of 2`}
      className="max-w-4xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactName}
                  onChange={(e) =>
                    setFormData({ ...formData, contactName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.zipCode}
                  onChange={(e) =>
                    setFormData({ ...formData, zipCode: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  DOT Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.dotNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, dotNumber: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  MC Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.mcNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, mcNumber: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="button" onClick={() => setStep(2)}>
                Next: Equipment & Insurance
              </Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="border-b pb-4 mb-4">
              <h3 className="text-lg font-semibold mb-2">Equipment</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={newEquipment.type}
                    onChange={(e) =>
                      setNewEquipment({
                        ...newEquipment,
                        type: e.target.value as Equipment["type"],
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="reefer_truck">Reefer Truck</option>
                    <option value="dry_van">Dry Van</option>
                    <option value="refrigerated_container">
                      Refrigerated Container
                    </option>
                    <option value="frozen_truck">Frozen Truck</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Make
                  </label>
                  <input
                    type="text"
                    value={newEquipment.make}
                    onChange={(e) =>
                      setNewEquipment({ ...newEquipment, make: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Model
                  </label>
                  <input
                    type="text"
                    value={newEquipment.model}
                    onChange={(e) =>
                      setNewEquipment({
                        ...newEquipment,
                        model: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    value={newEquipment.year}
                    onChange={(e) =>
                      setNewEquipment({ ...newEquipment, year: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity (cu ft)
                  </label>
                  <input
                    type="number"
                    value={newEquipment.capacity}
                    onChange={(e) =>
                      setNewEquipment({
                        ...newEquipment,
                        capacity: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Temp (°C)
                  </label>
                  <input
                    type="number"
                    value={newEquipment.temperatureRange.min}
                    onChange={(e) =>
                      setNewEquipment({
                        ...newEquipment,
                        temperatureRange: {
                          ...newEquipment.temperatureRange,
                          min: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Temp (°C)
                  </label>
                  <input
                    type="number"
                    value={newEquipment.temperatureRange.max}
                    onChange={(e) =>
                      setNewEquipment({
                        ...newEquipment,
                        temperatureRange: {
                          ...newEquipment.temperatureRange,
                          max: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <Button type="button" variant="secondary" onClick={addEquipment}>
                Add Equipment
              </Button>
            </div>

            {equipment.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">
                  Added Equipment ({equipment.length}):
                </p>
                <div className="space-y-2">
                  {equipment.map((eq) => (
                    <div key={eq.id} className="bg-gray-50 p-2 rounded text-sm">
                      {eq.make} {eq.model} ({eq.type}) - {eq.capacity} cu ft,{" "}
                      {eq.temperatureRange.min}°C to {eq.temperatureRange.max}°C
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-b pb-4 mb-4">
              <h3 className="text-lg font-semibold mb-2">Insurance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Liability Coverage ($) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.insurance.liability}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        insurance: {
                          ...formData.insurance,
                          liability: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cargo Coverage ($) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.insurance.cargo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        insurance: {
                          ...formData.insurance,
                          cargo: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiration Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.insurance.expirationDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        insurance: {
                          ...formData.insurance,
                          expirationDate: e.target.value,
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
                  Food Handling Experience (years) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.foodHandlingExperience}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      foodHandlingExperience: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Safety Rating *
                </label>
                <select
                  required
                  value={formData.safetyRating}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      safetyRating: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="satisfactory">Satisfactory</option>
                  <option value="conditional">Conditional</option>
                  <option value="unsatisfactory">Unsatisfactory</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={loading || equipment.length === 0}
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  "Register & Get Vetted"
                )}
              </Button>
            </div>
          </>
        )}
      </form>
    </Card>
  );
}

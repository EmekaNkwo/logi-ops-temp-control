"use client";

import { useEffect } from "react";
import Card from "@/components/ui/Card";
import TemperatureChart from "./TemperatureChart";
import dynamic from "next/dynamic";

const ShipmentTrackingMap = dynamic(() => import("./ShipmentTrackingMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
      Loading map...
    </div>
  ),
});
import ComplianceIssuesList from "./ComplianceIssuesList";
import { useShipmentStore } from "@/stores/useShipmentStore";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { format } from "date-fns";

interface ShipmentDashboardProps {
  shipmentId: string;
}

export default function ShipmentDashboard({
  shipmentId,
}: ShipmentDashboardProps) {
  const {
    currentShipment,
    fetchShipment,
    subscribeToShipment,
    unsubscribeFromShipment,
    loading,
  } = useShipmentStore();

  useEffect(() => {
    fetchShipment(shipmentId);
    subscribeToShipment(shipmentId);

    return () => {
      unsubscribeFromShipment(shipmentId);
    };
  }, [shipmentId, fetchShipment, subscribeToShipment, unsubscribeFromShipment]);

  if (loading || !currentShipment) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const latestData =
    currentShipment.iotData[currentShipment.iotData.length - 1];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-sm text-gray-600">Current Temperature</div>
          <div className="text-2xl font-bold text-primary-600">
            {latestData?.temperature.toFixed(1) || "N/A"}°C
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Range: {currentShipment.temperatureRequirement.min}°C -{" "}
            {currentShipment.temperatureRequirement.max}°C
          </div>
        </Card>

        <Card>
          <div className="text-sm text-gray-600">Current Humidity</div>
          <div className="text-2xl font-bold text-blue-600">
            {latestData?.humidity.toFixed(1) || "N/A"}%
          </div>
        </Card>

        <Card>
          <div className="text-sm text-gray-600">Status</div>
          <div className="text-2xl font-bold text-gray-900 capitalize">
            {currentShipment.status.replace("_", " ")}
          </div>
        </Card>

        <Card>
          <div className="text-sm text-gray-600">Compliance</div>
          <div
            className={`text-2xl font-bold ${
              currentShipment.complianceStatus === "compliant"
                ? "text-green-600"
                : currentShipment.complianceStatus === "warning"
                ? "text-yellow-600"
                : currentShipment.complianceStatus === "violation"
                ? "text-red-600"
                : "text-gray-600"
            }`}
          >
            {currentShipment.complianceStatus.toUpperCase()}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Temperature & Humidity Monitoring">
          <TemperatureChart
            iotData={currentShipment.iotData}
            minTemp={currentShipment.temperatureRequirement.min}
            maxTemp={currentShipment.temperatureRequirement.max}
          />
        </Card>

        <Card title="Route Tracking">
          <ShipmentTrackingMap
            origin={currentShipment.origin}
            destination={currentShipment.destination}
            currentLocation={currentShipment.currentLocation}
            iotData={currentShipment.iotData}
          />
        </Card>
      </div>

      <Card title="Shipment Details">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Shipper</p>
            <p className="font-medium">{currentShipment.shipperName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Carrier</p>
            <p className="font-medium">{currentShipment.carrierName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Cargo Type</p>
            <p className="font-medium">{currentShipment.cargoType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Weight</p>
            <p className="font-medium">
              {currentShipment.weight.toLocaleString()} lbs
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Pickup Date</p>
            <p className="font-medium">
              {format(new Date(currentShipment.pickupDate), "MMM dd, yyyy")}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Delivery Date</p>
            <p className="font-medium">
              {format(new Date(currentShipment.deliveryDate), "MMM dd, yyyy")}
            </p>
          </div>
        </div>
      </Card>

      <ComplianceIssuesList issues={currentShipment.complianceIssues} />
    </div>
  );
}

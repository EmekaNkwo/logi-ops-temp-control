"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { IoTData } from "../../../../shared/types";

interface TemperatureChartProps {
  iotData: IoTData[];
  minTemp: number;
  maxTemp: number;
}

export default function TemperatureChart({
  iotData,
  minTemp,
  maxTemp,
}: TemperatureChartProps) {
  const chartData = useMemo(() => {
    return iotData.map((data, index) => ({
      time: new Date(data.timestamp).toLocaleTimeString(),
      temperature: data.temperature,
      humidity: data.humidity,
      minThreshold: minTemp,
      maxThreshold: maxTemp,
    }));
  }, [iotData, minTemp, maxTemp]);

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#0ea5e9"
            strokeWidth={2}
            name="Temperature (°C)"
          />
          <Line
            type="monotone"
            dataKey="minThreshold"
            stroke="#ef4444"
            strokeDasharray="5 5"
            name="Min Threshold"
          />
          <Line
            type="monotone"
            dataKey="maxThreshold"
            stroke="#ef4444"
            strokeDasharray="5 5"
            name="Max Threshold"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

"use client";

import FeatureItem from "./FeatureItem";

const features = [
  {
    title: "Carrier Vetting",
    description:
      "Comprehensive verification of equipment, insurance, and certifications to ensure only qualified carriers handle your shipments.",
    icon: "🔍",
  },
  {
    title: "Load Matching",
    description:
      "AI-powered matching algorithm that considers equipment compatibility, routes, temperature requirements, and timing constraints.",
    icon: "🎯",
  },
  {
    title: "Real-Time Monitoring",
    description:
      "Live temperature, humidity, and GPS tracking with WebSocket updates. Monitor your shipments 24/7 from anywhere.",
    icon: "📊",
  },
  {
    title: "Compliance Checking",
    description:
      "Automated HACCP and temperature excursion detection. Get instant alerts for any compliance violations.",
    icon: "✅",
  },
  {
    title: "Rating & Reviews",
    description:
      "Build trust with our comprehensive rating system. Shippers and carriers can review each other after every shipment.",
    icon: "⭐",
  },
  {
    title: "Documentation",
    description:
      "Automated documentation and compliance checking. All shipment records are securely stored and easily accessible.",
    icon: "📄",
  },
];

export default function FeaturesSection() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
      <div className="text-center mb-10">
        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Why Choose Logi-Ops?
        </h3>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Everything you need for safe, compliant temperature-controlled food
          shipping
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureItem
            key={index}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
          />
        ))}
      </div>
    </div>
  );
}

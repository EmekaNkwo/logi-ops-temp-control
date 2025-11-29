"use client";

import FeatureCard from "./FeatureCard";

const actionCards = [
  {
    title: "For Shippers",
    description:
      "Post loads and find verified carriers with temperature-controlled equipment. Get competitive bids and track your shipments in real-time.",
    href: "/register/shipper",
    buttonText: "Register as Shipper",
    icon: "🚚",
  },
  {
    title: "For Carriers",
    description:
      "Get vetted, bid on loads, and grow your temperature-controlled shipping business. Access a marketplace of quality shippers.",
    href: "/register/carrier",
    buttonText: "Register as Carrier",
    icon: "🚛",
  },
  {
    title: "Real-Time Tracking",
    description:
      "Monitor temperature, humidity, and location in real-time with IoT sensors. Get instant alerts for any issues.",
    href: "/shipments",
    buttonText: "View Dashboard",
    icon: "📱",
  },
];

export default function ActionCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      {actionCards.map((card, index) => (
        <FeatureCard
          key={index}
          title={card.title}
          description={card.description}
          href={card.href}
          buttonText={card.buttonText}
          icon={card.icon}
        />
      ))}
    </div>
  );
}

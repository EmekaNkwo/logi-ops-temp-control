"use client";

import HeroSection from "./HeroSection";
import ActionCards from "./ActionCards";
import FeaturesSection from "./FeaturesSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <HeroSection />
        <ActionCards />
        <FeaturesSection />
      </main>
    </div>
  );
}

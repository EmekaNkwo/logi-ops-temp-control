"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ShipperRegistrationModal from "@/components/registration/ShipperRegistrationModal";
import CarrierRegistrationModal from "@/components/registration/CarrierRegistrationModal";

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShipperModalOpen, setIsShipperModalOpen] = useState(false);
  const [isCarrierModalOpen, setIsCarrierModalOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/loads", label: "Browse Loads", icon: "📦" },
    { href: "/shipments", label: "Track Shipments", icon: "🚚" },
    { href: "/carriers", label: "Carriers", icon: "👥" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <span className="text-white text-xl font-bold">L</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                  Logi-Ops
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    isActive(link.href)
                      ? "bg-primary-100 text-primary-700"
                      : "text-gray-700 hover:bg-gray-100 hover:text-primary-600"
                  }`}
                >
                  <span className="text-lg">{link.icon}</span>
                  <span>{link.label}</span>
                  {isActive(link.href) && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full"></span>
                  )}
                </Link>
              ))}

              {/* Divider */}
              <div className="h-6 w-px bg-gray-300 mx-2"></div>

              {/* Register Links */}
              <button
                onClick={() => setIsShipperModalOpen(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isActive("/register/shipper")
                    ? "bg-primary-600 text-white shadow-md"
                    : "bg-primary-50 text-primary-700 hover:bg-primary-100 hover:shadow-sm"
                }`}
              >
                <span>🏢</span>
                <span>Register Shipper</span>
              </button>
              <button
                onClick={() => setIsCarrierModalOpen(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isActive("/register/carrier")
                    ? "bg-primary-600 text-white shadow-md"
                    : "bg-primary-50 text-primary-700 hover:bg-primary-100 hover:shadow-sm"
                }`}
              >
                <span>🚛</span>
                <span>Register Carrier</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 animate-in slide-in-from-top duration-200">
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActive(link.href)
                        ? "bg-primary-100 text-primary-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-xl">{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                ))}
                <div className="h-px bg-gray-200 my-2"></div>
                <button
                  onClick={() => {
                    setIsShipperModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors bg-primary-50 text-primary-700 hover:bg-primary-100 w-full"
                >
                  <span>🏢</span>
                  <span>Register Shipper</span>
                </button>
                <button
                  onClick={() => {
                    setIsCarrierModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors bg-primary-50 text-primary-700 hover:bg-primary-100 w-full"
                >
                  <span>🚛</span>
                  <span>Register Carrier</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Modals */}
      <ShipperRegistrationModal
        isOpen={isShipperModalOpen}
        onClose={() => setIsShipperModalOpen(false)}
      />
      <CarrierRegistrationModal
        isOpen={isCarrierModalOpen}
        onClose={() => setIsCarrierModalOpen(false)}
      />
    </>
  );
}

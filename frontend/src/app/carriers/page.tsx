import Navbar from "@/components/layout/Navbar";
import CarriersPage from "@/components/carriers/CarriersPage";

export default function CarriersPageRoute() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <CarriersPage />
    </div>
  );
}

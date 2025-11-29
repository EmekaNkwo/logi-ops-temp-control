import Navbar from "@/components/layout/Navbar";
import ShipmentsPage from "@/components/shipments/ShipmentsPage";

export default function ShipmentsPageRoute() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <ShipmentsPage />
    </div>
  );
}

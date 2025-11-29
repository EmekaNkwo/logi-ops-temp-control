import Navbar from "@/components/layout/Navbar";
import LoadsPage from "@/components/loads/LoadsPage";

export default function LoadsPageRoute() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <LoadsPage />
    </div>
  );
}

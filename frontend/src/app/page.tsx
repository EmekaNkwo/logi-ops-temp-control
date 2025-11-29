import Navbar from "@/components/layout/Navbar";
import HomePage from "@/components/home/HomePage";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />
      <HomePage />
    </div>
  );
}

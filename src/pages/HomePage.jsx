import Footer from "../components/Footer";
import FormInput from "../components/Inventory";
import Sidebar from "../components/Sidebar";

export default function HomePage() {
  return (
    <div className="flex">
      {/* Sidebar di kiri */}
      <div className="w-64">
        <Sidebar />
      </div>

      {/* Konten utama di kanan */}
      <div className="flex-1 p-4">
       
       <FormInput/>
      </div>
    </div>
  );
}

import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import FormInput from "../components/Inventory";
import DataPage from "./DataPage";
import Export from "../components/Export";
import UserInfo from "../components/UserInfo";
import UploadExcel from "../components/UploadExcel";
import Laporan from "../components/Laporan";
import DaftarBarang from "../components/DaftarBarang";
import StatusBarang from "../components/StatusBarang";
import Profile from "../components/Profile";
import InputArsip from "../components/InputArsip";
import PRPage from "./PRPage"; // 🔹 import PRPage
import DataPR from "../components/DataPR";
import DataOSPR from "../components/DataOSPR";
import DataOSPO from "../components/DataOSPO";
import DataOSPage from "./DataOSPage";
import LaporanPR from "../components/DataPR";
import Dashboard from "../components/Dasbhoard";
import Notifikasi from "../components/Notifikasi";





function PRLaporan() {
  return <h1 className="text-xl font-bold">Laporan PR</h1>;
}

export default function HomePage() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar di kiri */}
      <div className="w-64 bg-gray-100 border-r">
        <Sidebar />
      </div>
      {/* Konten utama di kanan */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* User info di atas */}
        <div className="p-4 border-b bg-white shadow-sm">
          <UserInfo />
        </div>

        {/* Halaman konten */}
        <div className="flex-1 overflow-auto p-6">
          <Routes>
            {/* redirect default ke dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Data */}
            <Route path="/data" element={<DataPage />}>
              <Route path="input" element={<FormInput />} />
              <Route path="monitor" element={<UploadExcel />} />
            </Route>
            {/* Data OS */}
            <Route path="/data-os" element={<DataOSPage />}>
              <Route path="pr" element={<DataOSPR />} />
              <Route path="po" element={<DataOSPO />} />
            </Route>
            {/* Daftar Barang */}
            <Route path="/daftar-barang" element={<DaftarBarang />} />
            <Route path="/status-barang" element={<StatusBarang />} />
            <Route path="/laporan" element={<Laporan />} />
            <Route path="/laporan/:statusParam" element={<Laporan />} />

            {/* PR */}
            <Route path="/pr" element={<PRPage />}>
              <Route path="input" element={<InputArsip />} />
              <Route path="laporan" element={<LaporanPR />} />
            </Route>

            {/* Notifikasi */}
            <Route path="/notifikasi" element={<Notifikasi />} />

            {/* Profil */}
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

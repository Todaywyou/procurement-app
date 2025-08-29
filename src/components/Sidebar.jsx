import { Link } from "react-router-dom";
import {
  LayoutGrid,
  Database,
  Box,
  ClipboardList,
  FileText,
  Bell,
} from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-100 shadow-lg fixed left-0 top-0 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b flex items-center justify-center">
        <img src="/vite.svg" alt="Logo" className="h-10" />
      </div>

      {/* Menu Navigasi */}
      <nav className="flex-1 p-4 space-y-4 text-gray-700">
        <Link
          to="/dashboard"
          className="flex items-center gap-3 p-2 hover:bg-gray-200 rounded"
        >
          <LayoutGrid size={20} /> Dashboard
        </Link>

        <div>
          <Link
            to="/form-input"
            className="flex items-center gap-3 p-2 hover:bg-gray-200 rounded"
          >
            <Database size={20} /> Data
          </Link>
          <div className="ml-8 text-sm text-gray-500">
            <p>› Input Data</p>
            <p>› Ekspor Data</p>
          </div>
        </div>

        <Link
          to="/inventory"
          className="flex items-center gap-3 p-2 hover:bg-gray-200 rounded"
        >
          <Box size={20} /> Daftar Barang
        </Link>

        <Link
          to="/status-barang"
          className="flex items-center gap-3 p-2 hover:bg-gray-200 rounded"
        >
          <ClipboardList size={20} /> Status Barang
        </Link>

        <Link
          to="/laporan"
          className="flex items-center gap-3 p-2 hover:bg-gray-200 rounded"
        >
          <FileText size={20} /> Laporan
        </Link>

        <div>
          <Link
            to="/pr"
            className="flex items-center gap-3 p-2 hover:bg-gray-200 rounded text-red-500"
          >
            <FileText size={20} /> PR
          </Link>
          <div className="ml-8 text-sm text-gray-500">
            <p className="text-red-500">› Input Data Arsip</p>
            <p>› Laporan PR</p>
          </div>
        </div>

        <Link
          to="/notifikasi"
          className="flex items-center gap-3 p-2 hover:bg-gray-200 rounded"
        >
          <Bell size={20} /> Notifikasi
        </Link>
      </nav>
    </div>
  );
}

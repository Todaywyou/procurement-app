import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  Database,
  Box,
  ClipboardList,
  FileText,
  Bell,
} from "lucide-react";

export default function Sidebar() {
  const menuItemClass = ({ isActive }) =>
    `flex items-center gap-3 p-2 rounded transition-colors ${
      isActive
        ? "bg-red-100 text-red-600 font-semibold"
        : "text-gray-700 hover:bg-gray-300"
    }`;

  const subItemClass = ({ isActive }) =>
    `block pl-2 py-1 transition-colors ${
      isActive ? "text-red-600 font-medium" : "text-gray-500 hover:text-red-400"
    }`;

  return (
    <div className="w-64 h-screen bg-gray-100 shadow-lg fixed left-0 top-0 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b flex items-center justify-center">
        <img src="/logo_per.png" alt="Logo" className="h-12" />
      </div>
      {/* Menu Navigasi */}
      <nav className="flex-1 p-4 space-y-4">
        {/* Dashboard */}
        <NavLink to="/dashboard" className={menuItemClass}>
          <LayoutGrid size={20} /> Dashboard
        </NavLink>

        {/* Data */}
        <div>
          <NavLink to="/data" className={menuItemClass}>
            <Database size={20} /> Data
          </NavLink>
          <div className="ml-8 text-sm">
            <NavLink to="/data/input" className={subItemClass}>
              › Input Data
            </NavLink>
            <NavLink to="/data/monitor" className={subItemClass}>
              › Monitor Data
            </NavLink>
          </div>
        </div>

        {/* Data OS PR/PO */}
        <div>
          <NavLink to="/data-os" className={menuItemClass}>
            <ClipboardList size={20} /> Data OS PR/PO
          </NavLink>
          <div className="ml-8 text-sm">
            <NavLink to="/data-os/pr" className={subItemClass}>
              › OS PR
            </NavLink>
            <NavLink to="/data-os/po" className={subItemClass}>
              › OS PO
            </NavLink>
          </div>
        </div>

        {/* Daftar Barang */}
        <NavLink to="/daftar-barang" className={menuItemClass}>
          <Box size={20} /> Daftar Barang
        </NavLink>

        {/* Status Barang */}
        <NavLink to="/laporan" className={menuItemClass}>
          <ClipboardList size={20} /> Status Barang
        </NavLink>

        {/* Laporan */}
        <NavLink to="/status-barang" className={menuItemClass}>
          <FileText size={20} /> Laporan
        </NavLink>

        {/* PR */}
        <div>
          <NavLink to="/pr" className={menuItemClass}>
            <FileText size={20} /> PR
          </NavLink>
          <div className="ml-8 text-sm">
            <NavLink to="/pr/input" className={subItemClass}>
              › Input Data Arsip
            </NavLink>
            <NavLink to="/pr/laporan" className={subItemClass}>
              › Laporan PR
            </NavLink>
          </div>
        </div>

        {/* Notifikasi */}
        <NavLink to="/notifikasi" className={menuItemClass}>
          <Bell size={20} /> Notifikasi
        </NavLink>
      </nav>
    </div>
  );
}

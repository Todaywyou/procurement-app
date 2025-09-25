// src/pages/PRPage.jsx
import { NavLink, Outlet } from "react-router-dom";

export default function PRPage() {
  const tabClass = ({ isActive }) =>
    `px-4 py-2 rounded transition ${
      isActive
        ? "bg-pink-200 text-pink-600 font-semibold"
        : "bg-gray-100 text-black hover:bg-gray-200"
    }`;

  return (
    <div className="p-6">
      {/* Judul */}
      <h1 className="text-3xl font-bold mb-2">DATA PR</h1>
      <p className="text-gray-500 mb-6">INPUT DATA ARSIP | LAPORAN PR</p>

      {/* Tab menu */}
      <div className="flex gap-4 mb-6">
        <NavLink to="input" className={tabClass}>
          INPUT DATA ARSIP
        </NavLink>
        <NavLink to="laporan" className={tabClass}>
          LAPORAN PR
        </NavLink>
      </div>

      {/* Konten child route */}
      <Outlet />
    </div>
  );
}

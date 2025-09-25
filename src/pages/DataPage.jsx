// src/pages/DataPage.jsx
import { NavLink, Outlet } from "react-router-dom";

export default function DataPage() {
  return (
    <div className="p-6">
      {/* Judul */}
      <h1 className="text-3xl font-bold mb-2">DATA</h1>
      <p className="text-gray-500 mb-6">INPUT DATA \ EXPORT DATA</p>

      {/* Tombol navigasi */}
      <div className="flex gap-4 mb-6">
        <NavLink
          to="/data/input"
          className={({ isActive }) =>
            `px-4 py-2 rounded transition ${
              isActive
                ? "bg-pink-200 text-pink-600 font-semibold"
                : "bg-gray-100 text-black hover:bg-gray-200"
            }`
          }
        >
          INPUT DATA
        </NavLink>

        <NavLink
          to="/data/monitor"
          className={({ isActive }) =>
            `px-4 py-2 rounded transition ${
              isActive
                ? "bg-pink-200 text-pink-600 font-semibold"
                : "bg-gray-100 text-black hover:bg-gray-200"
            }`
          }
        >
          EXPORT DATA
        </NavLink>
      </div>

      {/* Tempat render sub-route */}
      <Outlet />
    </div>
  );
}

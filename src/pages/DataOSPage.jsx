import { NavLink, Outlet } from "react-router-dom";

export default function DataOSPage() {
  return (
    <div className="p-6">
      {/* Judul */}
      <h1 className="text-3xl font-bold mb-2">DATA OS PR/PO</h1>
      <p className="text-gray-500 mb-6">Outstanding PR dan Outstanding PO</p>

      {/* Tombol navigasi */}
      <div className="flex gap-4 mb-6">
        <NavLink
          to="/data-os/pr"
          className={({ isActive }) =>
            `px-4 py-2 rounded transition ${
              isActive
                ? "bg-red-200 text-red-600 font-semibold"
                : "bg-gray-100 text-black hover:bg-gray-200"
            }`
          }
        >
          OS PR
        </NavLink>

        <NavLink
          to="/data-os/po"
          className={({ isActive }) =>
            `px-4 py-2 rounded transition ${
              isActive
                ? "bg-red-200 text-red-600 font-semibold"
                : "bg-gray-100 text-black hover:bg-gray-200"
            }`
          }
        >
          OS PO
        </NavLink>
      </div>

      {/* Tempat render sub-route */}
      <Outlet />
    </div>
  );
}

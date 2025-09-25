import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Laporan() {
  const { statusParam } = useParams(); // ambil dari URL
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 8;

  // Saat halaman pertama kali dibuka → set filter sesuai URL
  useEffect(() => {
    if (statusParam) {
      setStatusFilter(statusParam);
    }
  }, [statusParam]);

  useEffect(() => {
    fetch("http://localhost/inventory-api/get_inventory.php")
      .then((res) => res.json())
      .then((result) => setData(result))
      .catch((err) => console.error(err));
  }, []);

  const filtered = data
    .filter((row) =>
      Object.values(row).join(" ").toLowerCase().includes(search.toLowerCase())
    )
    .filter((row) => {
      if (statusFilter === "Semua") return true;
      if (statusFilter === "Aman") return row.indikator_status === "Hijau";
      if (statusFilter === "Menipis") return row.indikator_status === "Kuning";
      if (statusFilter === "Kritis") return row.indikator_status === "Merah";
      return true;
    });

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + rowsPerPage);

  const columns = [
    "material",
    "deskripsi",
    "satuan",
    "konsumsi_bulanan",
    "konsumsi_per",
    "konsumsi_rka",
    "stock_on_hand",
    "quantity",
    "proc_time",
    "del_time",
    "safety_stock",
    "keterangan",
    "tanggal_input",
    "bulan",
    "hari",
    "tanggal_stok_habis",
    "indikator_status",
    "tgl_buat_pr",
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case "Merah":
        return "bg-red-100 text-red-600 font-semibold";
      case "Kuning":
        return "bg-yellow-100 text-yellow-700 font-semibold";
      case "Hijau":
        return "bg-green-100 text-green-700 font-semibold";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatNumber = (value) => {
    if (!value) return "-";
    return new Intl.NumberFormat("id-ID").format(value);
  };

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-50">
      <div className="mb-4">
        <h2 className="font-bold text-red-600 mb-2 text-lg">STATUS BARANG</h2>
        <div className="flex gap-3 flex-wrap">
          {["Semua", "Aman", "Menipis", "Kritis"].map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg shadow-sm transition font-medium
                ${
                  status === statusFilter
                    ? status === "Aman"
                      ? "bg-green-500 text-white"
                      : status === "Menipis"
                      ? "bg-yellow-500 text-white"
                      : status === "Kritis"
                      ? "bg-red-500 text-white"
                      : "bg-gray-500 text-white"
                    : status === "Aman"
                    ? "bg-green-200 text-green-700"
                    : status === "Menipis"
                    ? "bg-yellow-200 text-yellow-700"
                    : status === "Kritis"
                    ? "bg-red-200 text-red-700"
                    : "bg-gray-200 text-gray-700"
                }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="flex justify-end items-center mb-2 sticky top-0 bg-gray-50 z-20 p-2">
        <input
          type="text"
          placeholder="Cari data..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
        />
      </div>

      {/* Table */}
      <div className="flex-1 border rounded bg-white shadow overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-red-300 text-white sticky top-0 z-10">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="border px-3 py-2 text-center whitespace-nowrap font-semibold"
                >
                  {col.replace("_", " ").toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((row, idx) => (
              <tr
                key={row.id}
                className={`${
                  idx % 2 === 0 ? "bg-white" : "bg-red-50"
                } hover:bg-red-100 transition`}
              >
                {columns.map((col) => (
                  <td
                    key={col}
                    className={`border px-3 py-2 text-center align-top ${
                      col === "deskripsi" ? "text-left" : ""
                    } ${
                      col === "indikator_status" ? getStatusClass(row[col]) : ""
                    }`}
                  >
                    {col === "quantity" ? formatNumber(row[col]) : row[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center mt-3 gap-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-red-200 text-red-700 rounded hover:bg-red-300 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-gray-600 font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-red-200 text-red-700 rounded hover:bg-red-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

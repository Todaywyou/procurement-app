import React, { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";

export default function DaftarBarang() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;

  // 🔹 Fungsi fetch data
  const fetchData = () => {
    fetch("http://localhost/inventory-api/get_inventory.php")
      .then((res) => res.json())
      .then((result) => setData(result))
      .catch((err) => console.error("Error fetch data:", err));
  };

  // 🔹 Ambil data awal + auto-refresh tiap 1 menit
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // 60 detik
    return () => clearInterval(interval);
  }, []);

  // 🔹 Auto hitung saat edit (lokal)
  const auto = useMemo(() => {
    if (!editForm) return {};
    const b = Number(editForm.konsumsi_bulanan) || 0;
    const p = Number(editForm.konsumsi_per) || 0;
    const r = Number(editForm.konsumsi_rka) || 0;
    const konsumsi_pakai = Math.max(b, p, r);

    const today = new Date();
    const tanggal_input = today.toISOString().split("T")[0];

    const qty_pr = Number(editForm.qty_pr) || 0;
    const quantity = Number(editForm.stock_on_hand) || 0; // 🔹 Hanya stok on hand
    const bulan = konsumsi_pakai > 0 ? quantity / konsumsi_pakai : 0;
    const hari = Math.round(bulan * 30);

    const tgl_stok_habis = new Date(today);
    tgl_stok_habis.setDate(today.getDate() + hari);
    const tanggal_stok_habis = tgl_stok_habis.toISOString().split("T")[0];

    const proc = Number(editForm.proc_time) || 0;
    const del = Number(editForm.del_time) || 0;
    const safe = Number(editForm.safety_stock) || 0;
    const totalLead = proc + del + safe;
    const ratio = totalLead > 0 ? bulan / totalLead : 0;

    let indikator_status = "Tidak ada";
    if (ratio < 1) indikator_status = "Merah";
    else if (ratio >= 1 && ratio <= 1.4) indikator_status = "Kuning";
    else if (ratio > 1.4) indikator_status = "Hijau";

    const tgl_buat_pr = new Date(tgl_stok_habis);
    tgl_buat_pr.setDate(tgl_buat_pr.getDate() - Math.floor(proc + del + safe));

    return {
      konsumsi_pakai,
      tanggal_input,
      quantity,
      bulan: bulan.toFixed(2),
      hari,
      tanggal_stok_habis,
      indikator_status,
      tgl_buat_pr: tgl_buat_pr.toISOString().split("T")[0],
    };
  }, [editForm]);

  const handleEdit = (row) => {
    setEditingId(row.id);
    setEditForm(row);
  };

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const updatedRow = { ...editForm, ...auto };
    if (!updatedRow.id) return;

    fetch("http://localhost/inventory-api/update_inventory.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedRow),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          alert("✅ Data berhasil diperbarui");
          setData((prev) =>
            prev.map((item) => (item.id === updatedRow.id ? updatedRow : item))
          );
          setEditingId(null);
        } else {
          alert("❌ Gagal update: " + res.error);
        }
      })
      .catch((err) => alert("❌ Koneksi error: " + err.message));
  };

  const filtered = data.filter((row) =>
    Object.values(row).join(" ").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginatedData = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const columns = [
    "material",
    "deskripsi",
    "satuan",

    "konsumsi_bulanan",
    "konsumsi_per",
    "konsumsi_rka",
    "stock_on_hand",
    "qty_pr",
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

  const autoColumns = [
    "qty_pr",
    "quantity",
    "konsumsi_pakai",
    "tanggal_input",
    "bulan",
    "hari",
    "tanggal_stok_habis",
    "indikator_status",
    "tgl_buat_pr",
  ];

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-50">
      <div className="flex justify-end mb-3">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Cari data..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded pl-9 pr-3 py-2 focus:outline-none w-64"
          />
        </div>
      </div>
      <div className="border rounded-lg shadow bg-white overflow-hidden">
        <div className="max-h-[480px] overflow-y-auto">
          <table className="min-w-[1200px] border-collapse w-full text-sm">
            <thead className="bg-red-400 text-white sticky top-0">
              <tr>
                {columns.map((col) => (
                  <th key={col} className="border px-3 py-2 text-center">
                    {col.replace("_", " ").toUpperCase()}
                  </th>
                ))}
                <th className="border px-3 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row) => (
                <tr key={row.id}>
                  {columns.map((col) => (
                    <td key={col} className="border px-3 py-2 text-center">
                      {col === "material" ? (
                        <div className="flex items-center justify-center space-x-2">
                          {row[col]}
                          {Number(row.qty_pr) > 0 && (
                            <span
                              className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block"
                              title="Sudah ada PR"
                            ></span>
                          )}
                        </div>
                      ) : editingId === row.id ? (
                        autoColumns.includes(col) ? (
                          row[col]
                        ) : (
                          <input
                            type="text"
                            name={col}
                            value={editForm[col] || ""}
                            onChange={handleChange}
                            className="border rounded px-2 py-1 w-24"
                          />
                        )
                      ) : (
                        row[col]
                      )}
                    </td>
                  ))}
                  <td className="border px-3 py-2 text-center">
                    {editingId === row.id ? (
                      <button
                        onClick={handleSave}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Simpan
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(row)}
                        className="text-red-600"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center p-3 bg-gray-50 border-t">
          <span className="text-sm">
            Halaman {currentPage} dari {totalPages}
          </span>
          <div className="space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
         
    </div>
  );
}

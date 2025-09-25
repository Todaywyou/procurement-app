import React, { useState, useEffect } from "react";
import axios from "axios";

export default function LaporanPR() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filterField, setFilterField] = useState("");
  const [bulan, setBulan] = useState("");
  const [tahun, setTahun] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const limit = 5;

  // Fetch data
  const fetchAll = async () => {
    try {
      const res = await axios.get(
        "http://localhost/inventory-api/get_laporan.php",
        {
          params: {
            page,
            limit,
            no_laporan_pr: search || undefined,
            tanggal_field: filterField || undefined,
            bulan: bulan || undefined,
            tahun: tahun || undefined,
          },
        }
      );

      if (res.data) {
        setData(res.data.data || []);
        setTotalPage(res.data.pagination?.total_page || 1);
        setTotalData(res.data.pagination?.total_data || 0);
      }
    } catch (err) {
      console.error("Gagal fetch:", err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [page]);

  // Handle filter
  const handleFilter = () => {
    setPage(1);
    fetchAll();
  };

  const resetFilter = () => {
    setFilterField("");
    setBulan("");
    setTahun("");
    setSearch("");
    setPage(1);
    fetchAll();
  };

  // 🔹 Mapping untuk ganti label key tertentu di modal
  const fieldLabels = {
    tanggal_purececing: "Tanggal Purchasing",
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">DATA PR</h1>

      {/* Input pencarian */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Masukkan No Laporan PR"
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={() => {
            setPage(1);
            fetchAll();
          }}
          className="bg-red-400 text-white px-4 py-1 rounded"
        >
          Cari
        </button>
        <button onClick={resetFilter} className="bg-gray-300 px-4 py-1 rounded">
          Reset
        </button>
      </div>

      {/* Filter tanggal */}
      <div className="flex gap-2 mb-4">
        <select
          value={filterField}
          onChange={(e) => setFilterField(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="">Pilih Tanggal Berdasarkan</option>
          <option value="tanggal_ic">Tanggal IC</option>
          <option value="tanggal_purececing">Tanggal Purchasing</option>
          <option value="tanggal_ic_seched">Tanggal IC Schedule</option>
          <option value="tanggal_gm">Tanggal GM</option>
          <option value="tanggal_man_purchmen">Tanggal Man Purch</option>
        </select>
        <select
          value={bulan}
          onChange={(e) => setBulan(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="">Pilih Bulan</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
        <select
          value={tahun}
          onChange={(e) => setTahun(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="">Pilih Tahun</option>
          {Array.from({ length: 6 }, (_, i) => (
            <option key={i} value={2020 + i}>
              {2020 + i}
            </option>
          ))}
        </select>
        <button
          onClick={handleFilter}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          Filter
        </button>
        <button
          onClick={resetFilter}
          className="bg-yellow-400 text-black px-4 py-1 rounded"
        >
          Reset Filter
        </button>
      </div>

      {/* Table */}
      {!selected && data.length > 0 && (
        <div className="mt-6 bg-white p-4 shadow rounded border border-red-200">
          <div className="overflow-x-auto">
            <table className="table-auto border-collapse border w-full text-xs">
              <thead>
                <tr className="bg-red-100 text-red-700">
                  <th className="border px-2 py-1">No Laporan PR</th>
                  <th className="border px-2 py-1">Jumlah Item</th>
                  <th className="border px-2 py-1">Nama Item</th>
                  <th className="border px-2 py-1">Nomor WO</th>
                  <th className="border px-2 py-1">Pembuat</th>
                  <th className="border px-2 py-1">Biaya</th>
                  <th className="border px-2 py-1">Mata Uang</th>
                  {/* 🔹 ubah label header disini */}
                  <th className="border px-2 py-1">Tanggal Purchasing</th>
                  <th className="border px-2 py-1">Diterima</th>
                  <th className="border px-2 py-1">Kembali ke IC</th>
                  <th className="border px-2 py-1">Kembali ke Purch</th>
                  <th className="border px-2 py-1">Tanggal IC Schedule</th>
                  <th className="border px-2 py-1">Tanggal GM</th>
                  <th className="border px-2 py-1">Tanggal Man Purch</th>
                  <th className="border px-2 py-1">Keterangan</th>
                  <th className="border px-2 py-1">File</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-red-50 cursor-pointer"
                    onClick={() => setSelected(row)}
                  >
                    <td className="border px-2 py-1">{row.no_laporan_pr}</td>
                    <td className="border px-2 py-1">{row.jumlah_item}</td>
                    <td className="border px-2 py-1">{row.nama_item}</td>
                    <td className="border px-2 py-1">{row.nomor_wo}</td>
                    <td className="border px-2 py-1">{row.pembuat}</td>
                    <td className="border px-2 py-1">{row.biaya}</td>
                    <td className="border px-2 py-1">{row.mata_uang}</td>
                    <td className="border px-2 py-1">
                      {row.tanggal_purececing}
                    </td>
                    <td className="border px-2 py-1">{row.diterima}</td>
                    <td className="border px-2 py-1">{row.kembali_ke_ic}</td>
                    <td className="border px-2 py-1">{row.kembali_ke_purch}</td>
                    <td className="border px-2 py-1">
                      {row.tanggal_ic_seched}
                    </td>
                    <td className="border px-2 py-1">{row.tanggal_gm}</td>
                    <td className="border px-2 py-1">
                      {row.tanggal_man_purchmen}
                    </td>
                    <td className="border px-2 py-1">{row.keterangan}</td>
                    <td className="border px-2 py-1">
                      {row.berkas_pr && (
                        <a
                          href={`http://localhost/inventory-api/download.php?id=${row.id}`}
                          className="text-red-500 hover:underline"
                        >
                          📂 Download
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col items-center mt-4 text-sm">
            <span className="text-gray-600 mb-2">
              Total Data: {totalData} | Halaman {page} dari {totalPage}
            </span>
            <div className="space-x-2">
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page <= 1}
                className="px-4 py-2 bg-red-200 hover:bg-red-300 text-red-700 rounded disabled:opacity-50"
              >
                ◀ Prev
              </button>
              <button
                onClick={() => setPage((prev) => Math.min(totalPage, prev + 1))}
                disabled={page >= totalPage}
                className="px-4 py-2 bg-red-200 hover:bg-red-300 text-red-700 rounded disabled:opacity-50"
              >
                Next ▶
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Arsip */}
      {selected && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-3/4 max-h-[90vh] overflow-y-auto relative">
            {/* Tombol close */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl font-bold"
            >
              ❌
            </button>

            <h2 className="text-xl font-bold mb-4 text-red-600">
              Detail Arsip PR
            </h2>

            <div className="grid grid-cols-2 gap-4 text-sm">
              {Object.entries(selected).map(([key, value]) => (
                <div key={key} className="border-b py-1">
                  <span className="font-semibold capitalize">
                    {fieldLabels[key] || key}:
                  </span>{" "}
                  <span className="ml-1">{value || "-"}</span>
                </div>
              ))}
            </div>

            {selected.berkas_pr && (
              <div className="mt-4">
                <a
                  href={`http://localhost/inventory-api/download.php?id=${selected.id}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  📂 Download File
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

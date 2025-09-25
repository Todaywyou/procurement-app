import { useState, useEffect } from "react";
import axios from "axios";

export default function DataOSPR() {
  const [form, setForm] = useState({
    material: "",
    outstanding_pr: "",
    pr_date: "",
    qty_pr: "",
  });
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const API_URL = "http://localhost/inventory-api/os_pr.php";

  const fetchData = async () => {
    const res = await axios.get(API_URL);
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post(API_URL, form);
      setForm({ material: "", outstanding_pr: "", pr_date: "", qty_pr: "" });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setForm({ material: "", outstanding_pr: "", pr_date: "", qty_pr: "" });
  };

  // ✅ Fungsi Hapus
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}?id=${id}`);
      fetchData();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const filteredData = data.filter((row) =>
    row.material.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-6 text-red-700 border-b-2 border-red-200 pb-2">
        OS PR FORM
      </h2>

      {/* Form Input */}
      <div className="grid grid-cols-2 gap-6 max-w-3xl">
        <label className="flex flex-col text-sm font-semibold text-gray-700">
          MATERIAL
          <input
            type="text"
            name="material"
            value={form.material}
            onChange={handleChange}
            className="mt-1 border border-red-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-300"
          />
        </label>
        <label className="flex flex-col text-sm font-semibold text-gray-700">
          OUTSTANDING PR
          <input
            type="text"
            name="outstanding_pr"
            value={form.outstanding_pr}
            onChange={handleChange}
            className="mt-1 border border-red-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-300"
          />
        </label>
        <label className="flex flex-col text-sm font-semibold text-gray-700">
          PR DATE
          <input
            type="date"
            name="pr_date"
            value={form.pr_date}
            onChange={handleChange}
            className="mt-1 border border-red-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-300"
          />
        </label>
        <label className="flex flex-col text-sm font-semibold text-gray-700">
          QTY PR
          <input
            type="number"
            name="qty_pr"
            value={form.qty_pr}
            onChange={handleChange}
            className="mt-1 border border-red-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-300"
          />
        </label>
      </div>

      {/* Tombol Aksi */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={handleSubmit}
          className="bg-red-200 hover:bg-red-300 text-red-900 font-semibold px-5 py-2 rounded-lg shadow-sm transition"
        >
          SIMPAN
        </button>
        <button
          onClick={handleCancel}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-5 py-2 rounded-lg shadow-sm transition"
        >
          BATAL
        </button>
      </div>

      {/* Data Table */}
      <h3 className="mt-10 text-lg font-bold text-red-700 border-b-2 border-red-200 pb-2">
        DATA OS PR
      </h3>

      {/* Search Bar */}
      <div className="my-4 flex justify-end">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            🔍
          </span>
          <input
            type="text"
            placeholder="Cari berdasarkan material..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 border border-red-300 p-2 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-red-300"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="mt-3 border-collapse w-full shadow-sm">
          <thead className="bg-red-100 text-red-800">
            <tr>
              <th className="border border-red-200 p-3 text-left">MATERIAL</th>
              <th className="border border-red-200 p-3 text-left">
                OUTSTANDING PR
              </th>
              <th className="border border-red-200 p-3 text-left">PR DATE</th>
              <th className="border border-red-200 p-3 text-left">QTY PR</th>
              <th className="border border-red-200 p-3 text-center">AKSI</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <tr key={row.id} className="hover:bg-red-50 transition-colors">
                  <td className="border border-red-200 p-3">{row.material}</td>
                  <td className="border border-red-200 p-3">
                    {row.outstanding_pr}
                  </td>
                  <td className="border border-red-200 p-3">{row.pr_date}</td>
                  <td className="border border-red-200 p-3">{row.qty_pr}</td>
                  <td className="border border-red-200 p-3 text-center">
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow-sm transition"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  Data tidak ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

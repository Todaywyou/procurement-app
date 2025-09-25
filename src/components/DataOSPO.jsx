import { useEffect, useState } from "react";
import axios from "axios";

export default function DataOSPO() {
  const [form, setForm] = useState({
    material: "",
    no_po: "",
    qty_po: "",
    delivery_date: "",
  });
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const API_URL = "http://localhost/inventory-api/ospo.php";

  // Ambil data
  const fetchData = async () => {
    try {
      const res = await axios.get(API_URL);
      setData(res.data);
    } catch (err) {
      console.error("Fetch data error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Simpan data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, form, {
        headers: { "Content-Type": "application/json" },
      });
      setForm({ material: "", no_po: "", qty_po: "", delivery_date: "" });
      fetchData();
    } catch (err) {
      console.error("Submit error:", err);
      alert("Gagal menyimpan data.");
    }
  };

  // Hapus data
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}?id=${id}`);
      fetchData();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Filter pencarian
  const filteredData = data.filter(
    (item) =>
      item.material.toLowerCase().includes(search.toLowerCase()) ||
      item.no_po.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-white rounded-xl shadow-md">
      {/* 🔹 Form Input */}
      <h2 className="text-xl font-bold mb-6 text-red-700 border-b-2 border-red-200 pb-2">
        OS PO FORM
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-6 max-w-3xl border border-red-300 p-6 rounded-lg"
      >
        {/* Material */}
        <label className="flex flex-col text-sm font-semibold text-gray-700">
          MATERIAL
          <input
            type="text"
            value={form.material}
            onChange={(e) => setForm({ ...form, material: e.target.value })}
            className="mt-1 border border-red-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-300"
            required
          />
        </label>

        {/* No PO */}
        <label className="flex flex-col text-sm font-semibold text-gray-700">
          NO PO
          <input
            type="text"
            value={form.no_po}
            onChange={(e) => setForm({ ...form, no_po: e.target.value })}
            className="mt-1 border border-red-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-300"
            required
          />
        </label>

        {/* Qty PO */}
        <label className="flex flex-col text-sm font-semibold text-gray-700">
          QTY PO
          <input
            type="number"
            value={form.qty_po}
            onChange={(e) => setForm({ ...form, qty_po: e.target.value })}
            className="mt-1 border border-red-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-300"
            required
          />
        </label>

        {/* Delivery Date */}
        <label className="flex flex-col text-sm font-semibold text-gray-700">
          DELIVERY DATE
          <input
            type="date"
            value={form.delivery_date}
            onChange={(e) =>
              setForm({ ...form, delivery_date: e.target.value })
            }
            className="mt-1 border border-red-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-300"
            required
          />
        </label>

        {/* Tombol */}
        <div className="col-span-2 flex gap-4 mt-4">
          <button
            type="submit"
            className="bg-red-200 hover:bg-red-300 text-red-900 font-semibold px-5 py-2 rounded-lg shadow-sm transition"
          >
            SIMPAN
          </button>
          <button
            type="button"
            onClick={() =>
              setForm({
                material: "",
                no_po: "",
                qty_po: "",
                delivery_date: "",
              })
            }
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-5 py-2 rounded-lg shadow-sm transition"
          >
            BATAL
          </button>
        </div>
      </form>

      {/* 🔹 Data Table */}
      <h3 className="mt-10 text-lg font-bold text-red-700 border-b-2 border-red-200 pb-2">
        DATA OS PO
      </h3>

      {/* Search Bar */}
      <div className="my-4 flex justify-end">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            🔍
          </span>
          <input
            type="text"
            placeholder="Cari berdasarkan material / no PO..."
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
              <th className="border border-red-200 p-3 text-left">NO PO</th>
              <th className="border border-red-200 p-3 text-left">QTY PO</th>
              <th className="border border-red-200 p-3 text-left">
                DELIVERY DATE
              </th>
              <th className="border border-red-200 p-3 text-center">AKSI</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-red-50 transition-colors">
                  <td className="border border-red-200 p-3">{item.material}</td>
                  <td className="border border-red-200 p-3">{item.no_po}</td>
                  <td className="border border-red-200 p-3">{item.qty_po}</td>
                  <td className="border border-red-200 p-3">
                    {item.delivery_date}
                  </td>
                  <td className="border border-red-200 p-3 text-center">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow-sm"
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

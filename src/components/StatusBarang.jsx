import { useState } from "react";
import axios from "axios";
import { Calendar, Download, Search } from "lucide-react";

export default function StatusBarang() {
  const [tahun, setTahun] = useState("");
  const [bulan, setBulan] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [laporanSiap, setLaporanSiap] = useState(false);

  const handleCari = async () => {
    if (!tahun || !bulan) {
      alert("Isi Tahun dan Bulan terlebih dahulu!");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost/inventory-api/statusbarang.php",
        { tahun, bulan },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        setFileUrl(res.data.fileUrl || "");
        setLaporanSiap(true); // tampilkan card
      } else {
        alert(res.data.error || "Gagal ambil data");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi error server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 flex justify-end">
      <div className="w-full max-w-5xl">
        <h1 className="text-2xl font-bold text-red-700 mb-2">
          📊 Laporan Barang
        </h1>
        <p className="text-gray-600 mb-6">
          Pilih periode waktu untuk melihat laporan
        </p>

        {/* Input Section */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          {/* Tahun */}
          <div className="flex items-center gap-2">
            <label className="font-medium text-gray-700">Tahun</label>
            <input
              type="number"
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
              placeholder="2025"
              className="border border-red-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 w-28"
            />
            <Calendar size={18} className="text-red-500" />
          </div>

          {/* Bulan */}
          <div className="flex items-center gap-2">
            <label className="font-medium text-gray-700">Bulan</label>
            <input
              type="number"
              value={bulan}
              onChange={(e) => setBulan(e.target.value)}
              placeholder="1-12"
              className="border border-red-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400 w-20"
            />
          </div>

          {/* Tombol Cari */}
          <button
            onClick={handleCari}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition disabled:opacity-60"
            disabled={loading}
          >
            <Search size={16} />
            {loading ? "Loading..." : "Cari"}
          </button>
        </div>

        {/* Laporan Section */}
        {laporanSiap && (
          <div className="mt-6">
            {/* Kotak info laporan */}
            <div className="border border-red-300 rounded-lg p-6 bg-red-50 mb-4">
              <h2 className="text-xl font-semibold text-red-700 mb-2">
                Laporan Bulan {bulan} Tahun {tahun}
              </h2>
              <p className="text-gray-600">
                Berikut adalah laporan untuk periode yang dipilih. Silakan
                download file laporan untuk detail lengkap.
              </p>
            </div>

            {/* Tombol Download */}
            {fileUrl ? (
              <a
                href={fileUrl}
                download
                className="inline-flex items-center gap-2 bg-red-500 text-white px-5 py-3 rounded-lg shadow hover:bg-red-600 transition"
              >
                <Download size={20} />
                Download File Laporan
              </a>
            ) : (
              <div className="text-gray-400">Belum ada file untuk diunduh</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

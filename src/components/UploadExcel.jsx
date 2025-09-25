import { useState } from "react";
import axios from "axios";
import { Upload, Folder } from "lucide-react";

export default function UploadExcel() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("⚠️ Pilih file Excel terlebih dahulu!");
      return;
    }

    const formData = new FormData();
    formData.append("excel", file);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(res.data.message || "✅ Upload berhasil!");
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("❌ Gagal upload file!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center bg-white">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        {/* Judul */}
        <h2 className="text-2xl font-bold text-red-600 mb-2">
          Import Data Barang
        </h2>
        <p className="text-gray-500 mb-6">
          Upload file Excel (sheet: <b>LAPORAN</b>) untuk menyimpan ke database.
        </p>

        {/* Ikon Folder */}
        <div className="flex items-center justify-center mb-6">
          <div className="bg-red-100 p-6 rounded-full shadow-inner">
            <Folder className="w-16 h-16 text-red-500" />
          </div>
        </div>

        {/* Input File */}
        <label className="cursor-pointer block mb-4">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="border-2 border-dashed border-red-300 p-4 rounded-xl hover:bg-red-50 transition">
            {file ? (
              <p className="text-gray-700 font-medium">{file.name}</p>
            ) : (
              <p className="text-gray-400">📂 Pilih file Excel...</p>
            )}
          </div>
        </label>

        {/* Tombol Upload */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl shadow-md font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
        >
          <Upload className="w-5 h-5" />
          {loading ? "Uploading..." : "Upload Excel"}
        </button>

        {/* Pesan */}
        {message && (
          <p
            className={`mt-4 font-medium ${
              message.includes("✅")
                ? "text-green-600"
                : message.includes("⚠️")
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

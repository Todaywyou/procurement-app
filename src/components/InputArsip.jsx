import { useState } from "react";
import axios from "axios";

export default function InputArsip() {
  // 🔹 State awal form
  const [formData, setFormData] = useState({
    no_laporan_pr: "",
    tanggal_ic: "",
    jumlah_item: "",
    nama_item: "",
    nomor_wo: "",
    pembuat: "",
    biaya: "",
    mata_uang: "",
    tanggal_purececing: "",
    diterima: "",
    kembali_ke_ic: "",
    kembali_ke_purch: "",
    tanggal_ic_seched: "",
    smom: "",
    tanggal_gm: "",
    tanggal_man_purchmen: "",
    keterangan: "",
  });

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key]);
    });
    if (file) form.append("berkas_pr", file);

    try {
      const res = await axios.post(
        "http://localhost/inventory-api/save_arsip.php",
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setMessage(res.data.message || "✅ Data berhasil disimpan");

      // reset form
      setFormData({
        no_laporan_pr: "",
        tanggal_ic: "",
        jumlah_item: "",
        nama_item: "",
        nomor_wo: "",
        pembuat: "",
        biaya: "",
        mata_uang: "",
        tanggal_purececing: "",
        diterima: "",
        kembali_ke_ic: "",
        kembali_ke_purch: "",
        tanggal_ic_seched: "",
        smom: "",
        tanggal_gm: "",
        tanggal_man_purchmen: "",
        keterangan: "",
      });
      setFile(null);
    } catch (error) {
      console.error(error);
      setMessage("❌ Gagal menyimpan data. Periksa server API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-gray-100 rounded-md shadow-md max-w-5xl mx-auto"
    >
      <h2 className="font-bold text-2xl mb-6 text-center text-red-600">
        Form Input Arsip PR
      </h2>

      <div className="grid grid-cols-2 gap-6">
        {/* Bagian Kiri */}
        <div className="space-y-3">
          <div>
            <label className="block font-medium text-sm">No Laporan PR</label>
            <input
              name="no_laporan_pr"
              value={formData.no_laporan_pr}
              className="w-full p-2 border rounded"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-medium text-sm">Tanggal IC</label>
            <input
              type="date"
              name="tanggal_ic"
              value={formData.tanggal_ic}
              className="w-full p-2 border rounded"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-medium text-sm">Jumlah Item</label>
            <input
              type="number"
              name="jumlah_item"
              value={formData.jumlah_item}
              className="w-full p-2 border rounded"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-medium text-sm">Nama Item</label>
            <input
              name="nama_item"
              value={formData.nama_item}
              className="w-full p-2 border rounded"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-medium text-sm">Nomor WO</label>
            <input
              name="nomor_wo"
              value={formData.nomor_wo}
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
          </div>

          {/* 🔹 Create By */}
          <div>
            <label className="block font-medium text-sm">Create By</label>
            <input
              name="pembuat"
              value={formData.pembuat}
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-sm">Mata Uang</label>
              <input
                name="mata_uang"
                value={formData.mata_uang}
                className="w-full p-2 border rounded"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-medium text-sm">Biaya</label>
              <input
                type="number"
                name="biaya"
                value={formData.biaya}
                className="w-full p-2 border rounded"
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Bagian Kanan */}
        <div className="space-y-3">
          <div>
            <label className="block font-medium text-sm">
              Tanggal Purchasing
            </label>
            <input
              type="date"
              name="tanggal_purececing"
              value={formData.tanggal_purececing}
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block font-medium text-sm">Diterima</label>
            <input
              name="diterima"
              value={formData.diterima}
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block font-medium text-sm">Kembali ke IC</label>
            <input
              type="date" // ✅ diganti jadi date
              name="kembali_ke_ic"
              value={formData.kembali_ke_ic}
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block font-medium text-sm">
              Kembali ke Purch
            </label>
            <input
              type="date" // ✅ diganti jadi date
              name="kembali_ke_purch"
              value={formData.kembali_ke_purch}
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block font-medium text-sm">
              Tanggal IC Seched
            </label>
            <input
              type="date"
              name="tanggal_ic_seched"
              value={formData.tanggal_ic_seched}
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block font-medium text-sm">Smom</label>
            <input
              name="smom"
              value={formData.smom}
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
          </div>

          {/* 🔹 Tambahan Baru */}
          <div>
            <label className="block font-medium text-sm">Tanggal GM</label>
            <input
              type="date"
              name="tanggal_gm"
              value={formData.tanggal_gm}
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block font-medium text-sm">
              Tanggal Man Purchmen
            </label>
            <input
              type="date"
              name="tanggal_man_purchmen"
              value={formData.tanggal_man_purchmen}
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block font-medium text-sm">Keterangan</label>
            <textarea
              name="keterangan"
              value={formData.keterangan}
              className="w-full p-2 border rounded"
              rows="2"
              onChange={handleChange}
            ></textarea>
          </div>

          <div>
            <label className="block font-medium text-sm">Berkas PR</label>
            <input
              type="file"
              name="berkas_pr"
              className="w-full p-2 border rounded bg-white"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded w-full"
      >
        {loading ? "Menyimpan..." : "SIMPAN"}
      </button>

      {message && (
        <p
          className={`mt-3 text-center font-medium ${
            message.includes("Gagal") ? "text-red-600" : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}

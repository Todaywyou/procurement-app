import { useState, useEffect, useMemo } from "react";

// Komponen input stabil
function Input({ label, name, value, onChange, ...props }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium">{label}</label>
      <input
        className="border rounded p-2"
        name={name}
        value={value ?? ""}
        onChange={onChange}
        {...props}
      />
    </div>
  );
}

function Readonly({ label, value }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium">{label}</label>
      <input
        className="border rounded p-2 bg-gray-100"
        value={value ?? ""}
        readOnly
      />
    </div>
  );
}

export default function FormInput() {
  const [formData, setFormData] = useState({
    material: "",
    cat_material: "",
    deskripsi: "",
    satuan: "",
    konsumsi_bulanan: "",
    konsumsi_per: "",
    konsumsi_rka: "",
    stock_on_hand: "",
    proc_time: "",
    del_time: "",
    safety_stock: "",
    keterangan: "",
  });

  const [satuanList, setSatuanList] = useState([]);

  // Ambil list satuan
  useEffect(() => {
    fetch("http://localhost/inventory-api/get_satuan.php")
      .then((res) => res.json())
      .then((data) => {
        setSatuanList(data);
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, satuan: String(data[0].id) }));
        }
      })
      .catch((err) => console.error("Error fetch satuan:", err));
  }, []);

  // Handle input (selalu string)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Hitung otomatis pakai useMemo
  const auto = useMemo(() => {
    const b = Number(formData.konsumsi_bulanan) || 0;
    const p = Number(formData.konsumsi_per) || 0;
    const r = Number(formData.konsumsi_rka) || 0;
    const konsumsi_pakai = Math.max(b, p, r);

    const today = new Date();
    const tanggal_input = today.toISOString().split("T")[0];

    const quantity = Number(formData.stock_on_hand) || 0;
    const bulan = konsumsi_pakai > 0 ? quantity / konsumsi_pakai  : 0;
    const hari = Math.round(bulan * 30);

    const tgl_stok_habis = new Date(today);
    tgl_stok_habis.setDate(today.getDate() + hari);
    const tanggal_stok_habis = tgl_stok_habis.toISOString().split("T")[0];

    const proc = Number(formData.proc_time) || 0;
    const del = Number(formData.del_time) || 0;
    const safe = Number(formData.safety_stock) || 0;
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
  }, [formData]);

  // Submit data
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost/inventory-api/insert.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, ...auto }),
    });
    const data = await res.json();
    if (data.success) {
      alert("✅ Data berhasil disimpan!");
    } else {
      alert("❌ Gagal: " + data.error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-2 gap-6 p-6 bg-white shadow rounded-xl"
    >
      {/* KIRI */}
      <div className="space-y-4">
        <h2 className="font-bold">Data Material</h2>
        <Input
          label="Material"
          name="material"
          value={formData.material}
          onChange={handleChange}
        />
        <Input
          label="Cat Material"
          name="cat_material"
          value={formData.cat_material}
          onChange={handleChange}
        />
        <Input
          label="Deskripsi"
          name="deskripsi"
          value={formData.deskripsi}
          onChange={handleChange}
        />

        <h2 className="font-bold">Konsumsi</h2>
        <div className="flex flex-col">
          <label className="text-sm font-medium">Satuan</label>
          <select
            name="satuan"
            value={formData.satuan ?? ""}
            onChange={handleChange}
            className="border rounded p-2"
          >
            <option value="">-- Pilih Satuan --</option>
            {satuanList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nama_satuan}
              </option>
            ))}
          </select>
        </div>
        <Readonly label="Jumlah Konsumsi Dipakai" value={auto.konsumsi_pakai} />
        <Input
          label="Konsumsi Bulanan"
          name="konsumsi_bulanan"
          value={formData.konsumsi_bulanan}
          onChange={handleChange}
        />
        <Input
          label="Konsumsi Per"
          name="konsumsi_per"
          value={formData.konsumsi_per}
          onChange={handleChange}
        />
        <Input
          label="Konsumsi RKA"
          name="konsumsi_rka"
          value={formData.konsumsi_rka}
          onChange={handleChange}
        />
        <Input
          label="Stock On Hand"
          name="stock_on_hand"
          value={formData.stock_on_hand}
          onChange={handleChange}
        />

        <Readonly label="Tgl Buat PR (Otomatis)" value={auto.tgl_buat_pr} />

        <Input
          label="Keterangan"
          name="keterangan"
          value={formData.keterangan}
          onChange={handleChange}
        />
      </div>

      {/* KANAN */}
      <div className="space-y-4">
        <h2 className="font-bold">Ketahanan Stok</h2>
        <Readonly label="Tanggal Input" value={auto.tanggal_input} />
        <Readonly label="Quantity" value={auto.quantity} />
        <Readonly label="Bulan" value={auto.bulan} />
        <Readonly label="Hari" value={auto.hari} />
        <Readonly label="Tanggal Stok Habis" value={auto.tanggal_stok_habis} />

        <h2 className="font-bold">Lead Time (Bulan)</h2>
        <Input
          label="Proc. Time"
          name="proc_time"
          value={formData.proc_time}
          onChange={handleChange}
        />
        <Input
          label="Del. Time"
          name="del_time"
          value={formData.del_time}
          onChange={handleChange}
        />
        <Input
          label="Safety Stock"
          name="safety_stock"
          value={formData.safety_stock}
          onChange={handleChange}
        />

        <h2 className="font-bold">Indikator</h2>
        <Readonly label="Status" value={auto.indikator_status} />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
        >
          Simpan
        </button>
      </div>
    </form>
  );
}

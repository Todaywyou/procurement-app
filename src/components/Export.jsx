import { useState } from "react";
import * as XLSX from "xlsx";

export default function Export() {
  const [status, setStatus] = useState("");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const bstr = event.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });

      const sheet = workbook.Sheets["LAPORAN"];
      if (!sheet) {
        alert("Sheet LAPORAN tidak ditemukan di Excel!");
        return;
      }

      const rawData = XLSX.utils.sheet_to_json(sheet);

      // Mapping header Excel ke field database
      const headerMap = {
        MATERIAL: "material",
        "CAT.MATERIAL": "cat_material",
        DESCRIPTION: "deskripsi",
        SATUAN: "satuan",
        "KONSUMSI BULANAN": "konsumsi_bulanan",
        "KONSUMSI PE": "konsumsi_per",
        "KONSUMSI RKA": "konsumsi_rka",
        "JUMLAH KONSUMSI YANG DIPAKAI": "konsumsi_pakai",
        "JUMLAH STOCK ON HAND": "stock_on_hand",
        QUANTITY: "quantity",
        BULAN: "bulan",
        HARI: "hari",
        TANGGAL: "tanggal_stok_habis",
        "PROC.TIME": "proc_time",
        "DEL.TIME": "del_time",
        "SAFETY STOCK": "safety_stock",
        INDIKATOR: "indikator_status",
        KETERANGAN: "keterangan",
      };

      // Konversi data Excel → sesuai dengan field database
      const mappedData = rawData.map((row) => {
        let obj = {};

        Object.keys(headerMap).forEach((excelHeader) => {
          const dbField = headerMap[excelHeader];
          obj[dbField] = row[excelHeader] ?? "";
        });

        // Hitung otomatis tgl_buat_pr (tanggal_stok_habis - 1 bulan)
        if (row["TANGGAL"]) {
          const tanggal = new Date(row["TANGGAL"]);
          tanggal.setMonth(tanggal.getMonth() - 1);
          obj["tgl_buat_pr"] = tanggal.toISOString().split("T")[0];
        } else {
          obj["tgl_buat_pr"] = "";
        }

        return obj;
      });

      try {
        const res = await fetch(
          "http://localhost/inventory-api/insert_batch.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: mappedData }),
          }
        );

        const result = await res.json();
        if (result.success) {
          setStatus(
            `✅ Berhasil: ${result.inserted} data, Gagal: ${result.failed}`
          );
          console.log("Detail error:", result.errors);
        } else {
          setStatus(`❌ Gagal: ${result.error || "Unknown error"}`);
        }
      } catch (err) {
        setStatus(`❌ Error: ${err.message}`);
      }
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Export Data Barang</h1>
      <p className="text-gray-600">
        Upload Excel untuk membaca data dari sheet LAPORAN.
      </p>

      <label className="block w-64 cursor-pointer mt-4">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="hidden"
        />
        <div className="bg-gray-200 hover:bg-gray-300 text-center py-4 rounded-lg shadow-md">
          Upload Excel
        </div>
      </label>

      {status && <p className="mt-4">{status}</p>}
    </div>
  );
}

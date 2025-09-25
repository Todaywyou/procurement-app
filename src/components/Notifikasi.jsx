import { useEffect, useState } from "react";
import {
  Trash2,
  AlertTriangle,
  AlertOctagon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function Notifikasi() {
  const [notifications, setNotifications] = useState([]);
  const [expanded, setExpanded] = useState(null);

  // 🔹 Fungsi ambil data dari API
  const fetchData = () => {
    fetch("http://localhost/inventory-api/notifikasi.php")
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.error("Fetch error:", err));
  };

  // 🔹 Ambil data pertama kali + auto refresh tiap 60 detik
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  // 🔹 Hapus notifikasi (disembunyikan 4 hari lewat API)
  const handleDelete = (id) => {
    fetch("http://localhost/inventory-api/delete_notif.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `id=${id}`,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        } else {
          console.error("Gagal hapus:", data.error);
        }
      })
      .catch((err) => console.error("Error:", err));
  };

  // 🔹 Expand detail notifikasi
  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <div className="p-6">
      {/* 🔔 Header tanpa icon Bell */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">
          📢 Notifications{" "}
          {notifications.length > 0 && (
            <span className="ml-2 text-sm text-gray-600">
              ({notifications.length})
            </span>
          )}
        </h2>
      </div>

      {/* 📌 List Notifikasi */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <p className="text-gray-500">Tidak ada notifikasi.</p>
        ) : (
          notifications.map((notif) => {
            const isExpanded = expanded === notif.id;
            const isMerah = notif.indikator_status === "Merah";
            return (
              <div
                key={notif.id}
                className={`rounded-xl shadow p-4 border transition hover:scale-[1.01] cursor-pointer
                  ${
                    isMerah
                      ? "border-red-500 bg-red-50"
                      : "border-yellow-500 bg-yellow-50"
                  }`}
              >
                {/* Header notifikasi */}
                <div
                  className="flex items-center justify-between"
                  onClick={() => toggleExpand(notif.id)}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    {isMerah ? (
                      <AlertOctagon className="text-red-600" size={18} />
                    ) : (
                      <AlertTriangle className="text-yellow-600" size={18} />
                    )}
                    {notif.material}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        isMerah
                          ? "bg-red-200 text-red-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {notif.indikator_status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notif.id);
                      }}
                      className="text-gray-500 hover:text-red-600 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Detail expand */}
                {isExpanded && (
                  <div className="mt-3 text-sm text-gray-700 space-y-1 border-t pt-2">
                    <p>
                      <span className="font-medium">Deskripsi:</span>{" "}
                      {notif.deskripsi}
                    </p>
                    <p>
                      <span className="font-medium">Stok:</span>{" "}
                      {notif.stock_on_hand} {notif.satuan}
                    </p>
                    <p>
                      <span className="font-medium">Konsumsi / bulan:</span>{" "}
                      {notif.konsumsi_pakai}
                    </p>
                    <p>
                      <span className="font-medium">Estimasi habis:</span>{" "}
                      {notif.tanggal_stok_habis}
                    </p>
                    <p>
                      <span className="font-medium">Buat PR sebelum:</span>{" "}
                      {notif.tgl_buat_pr}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

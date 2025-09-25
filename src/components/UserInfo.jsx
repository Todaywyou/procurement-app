import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";

export default function UserInfo() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // 🔹 ambil jumlah notifikasi
    fetch("http://localhost/inventory-api/notifikasi.php")
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.error("Fetch notif error:", err));
  }, []);

  if (!user) {
    return <div className="text-gray-500 text-right">Tidak ada user login</div>;
  }

  const initial = user.name ? user.name.charAt(0).toUpperCase() : "?";

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/"); // kembali login
  };

  return (
    <div className="flex justify-end mb-4 relative items-center space-x-4">
      {/* 🔔 Lonceng notifikasi */}
      <button
        className="relative"
        onClick={() => navigate("/notifikasi")} // 👈 langsung ke halaman Notifikasi
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {/* 👤 User avatar & nama */}
      <div
        className="flex items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold mr-3">
          {initial}
        </div>
        <span className="font-semibold text-gray-700">{user.name}</span>
      </div>

      {/* 📌 Dropdown user */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-40 bg-white shadow-lg rounded-md border z-50">
          <button
            onClick={() => navigate("/profile")}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Profil
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

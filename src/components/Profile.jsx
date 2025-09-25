import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (!savedUser || !savedUser.id) {
      setUser(null);
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost/inventory-api/get_user.php?id=${savedUser.id}`)
      .then((res) => {
        if (res.data && !res.data.error) {
          setUser(res.data);
        } else {
          setUser(savedUser);
        }
        setLoading(false);
      })
      .catch(() => {
        setUser(savedUser);
        setLoading(false);
      });
  }, []);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("❌ Password dan konfirmasi tidak sama.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost/inventory-api/update_password.php",
        {
          id: user.id,
          password: newPassword,
        }
      );

      if (res.data.message) {
        setMessage("✅ " + res.data.message);
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setMessage("❌ Gagal menghubungi server.");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!user) return <p className="p-6">Data user tidak ditemukan</p>;

  // 🔹 Ambil inisial dari nama
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-6">Profil Pengguna</h1>

      {/* Kartu Profil */}
      <div className="bg-white p-6 rounded-2xl shadow-lg w-96 flex flex-col items-center space-y-4">
        {/* Avatar Bulat */}
        <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
          {initials}
        </div>

        {/* Info User */}
        <div className="text-center">
          <p className="text-lg font-semibold">{user.name}</p>
          <p className="text-gray-500">{user.email}</p>
        </div>

        {/* Tombol Ubah Password */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="mt-4 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          <Lock size={18} />
          {showForm ? "Tutup" : "Ubah Kata Sandi"}
        </button>
      </div>

      {/* Form Update Password */}
      {showForm && (
        <div className="bg-white p-6 mt-6 rounded-2xl shadow-lg w-96">
          <h2 className="text-lg font-bold mb-4">Perbarui Password</h2>
          <form onSubmit={handlePasswordUpdate} className="space-y-3">
            {/* Input Password Baru */}
            <div className="relative">
              <input
                type={showNewPw ? "text" : "password"}
                placeholder="Password baru"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPw(!showNewPw)}
                className="absolute right-3 top-2 text-gray-500"
              >
                {showNewPw ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Input Konfirmasi Password */}
            <div className="relative">
              <input
                type={showConfirmPw ? "text" : "password"}
                placeholder="Konfirmasi password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPw(!showConfirmPw)}
                className="absolute right-3 top-2 text-gray-500"
              >
                {showConfirmPw ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
            >
              Simpan Password
            </button>
          </form>
          {message && (
            <p
              className={`mt-3 text-sm ${
                message.includes("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

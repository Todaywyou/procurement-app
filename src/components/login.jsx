import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // URL backend API
      const response = await fetch("http://localhost/inventory-api/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Cek kalau response bukan 200
      if (!response.ok) {
        throw new Error("Gagal terhubung ke server");
      }

      const result = await response.json();

      if (result.success) {
        alert("Login berhasil!");
        navigate("/das"); // redirect ke dashboard
      } else {
        alert(result.message || "Email atau password salah");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan koneksi ke server! Pastikan Apache berjalan.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200 px-4">
      <div className="w-full max-w-md bg-gray-300 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
          LOGIN
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email"
              className="w-full px-4 py-2 border border-gray-400 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="•••••••"
              className="w-full px-4 py-2 border border-gray-400 rounded-md"
              required
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="px-10 py-3 rounded-full bg-gradient-to-r from-blue-600 to-red-600 text-white font-semibold shadow-md"
            >
              LOGIN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

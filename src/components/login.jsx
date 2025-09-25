import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // 👁️ icon mata

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost/inventory-api/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Gagal terhubung ke server");
      }

      const result = await response.json();

      if (result.success) {
        localStorage.setItem("user", JSON.stringify(result.user));
        alert("Login berhasil!");
        navigate("/das");
      } else {
        alert(result.message || "Email atau password salah");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan koneksi ke server! Pastikan Apache berjalan.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl text-center border border-red-100">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="/logo_per.png" // ganti dengan path logo kamu
            alt="Logo"
            className="h-20"
          />
        </div>

        {/* Judul */}
        <h1 className="text-2xl font-bold text-red-700">Inventory Control</h1>
        <p className="text-sm text-red-500 mb-6 tracking-wide">
          Chemical Fast Moving
        </p>

        {/* Form */}
        <form className="space-y-5 text-left" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-red-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email"
              className="w-full px-4 py-2 border border-red-200 rounded-md focus:ring-2 focus:ring-red-300 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-red-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••"
                className="w-full px-4 py-2 border border-red-200 rounded-md focus:ring-2 focus:ring-red-300 focus:outline-none pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-red-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Remember me & forgot password */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="h-4 w-4 text-red-500" />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-red-500 hover:text-red-700">
              Forgot password?
            </a>
          </div>

          {/* Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-gradient-to-r from-red-400 to-red-600 text-white font-semibold shadow-md hover:opacity-90 transition"
            >
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

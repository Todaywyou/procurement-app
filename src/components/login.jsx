import React from "react";

function Login() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200 px-4">
      <div className="w-full max-w-md bg-gray-300 p-8 rounded-lg shadow-lg">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-8 tracking-wider text-gray-800">
          LOGIN
        </h2>

        {/* Form */}
        <form className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              EMAIL
            </label>
            <input
              type="email"
              placeholder="email"
              className="w-full px-4 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              PASSWORD
            </label>
            <input
              type="password"
              placeholder="•••••••"
              className="w-full px-4 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-10 py-3 rounded-full bg-gradient-to-r from-blue-600 to-red-600 text-white font-semibold shadow-md hover:opacity-90 transition"
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

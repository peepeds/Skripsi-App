import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * UnauthenticatedModal
 * Modal untuk menampilkan pesan ketika user belum terautentikasi
 * dan mencoba mengakses fitur yang memerlukan autentikasi
 */
export function UnauthenticatedModal({ redirectPath = "/" }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Navigate to login dengan redirect path sebagai query parameter
    navigate(`/login?redirect=${encodeURIComponent(redirectPath)}`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4 shadow-lg">
        {/* Header Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-2">
          Autentikasi Diperlukan
        </h2>

        {/* Message */}
        <p className="text-gray-600 text-center mb-6">
          Anda belum terautentikasi. Silakan login untuk melanjutkan aksi ini.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleGoBack}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Kembali
          </button>
          <button
            onClick={handleLogin}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

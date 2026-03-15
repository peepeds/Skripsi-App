/**
 * Not Found Page (404)
 * 
 * Purpose: Display a user-friendly error page when a route doesn't exist
 * 
 * Features:
 *   - Animated background orbs for visual interest
 *   - Clear 404 error message in Indonesian
 *   - Two button options:
 *     1. "Kembali ke Beranda" - Go back to home page
 *     2. "Kembali ke Halaman Sebelumnya" - Go back to previous page
 *   - Responsive design with decorative grid overlay
 * 
 * Tech Stack:
 *   - React Router: useNavigate() for navigation
 *   - CSS: Custom styles in ./not-found.css (orbs, grid, animations)
 *   - Styling: Tailwind CSS classes for layout and spacing
 */

import React from "react";
import { useNavigate } from "react-router-dom";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen grid place-items-center overflow-hidden px-5 py-12 bg-gradient-to-br from-amber-100 via-orange-100 to-cyan-50 text-slate-900" style={{ fontFamily: '"Space Grotesk", "Trebuchet MS", sans-serif' }}>
      {/* Background decorative orbs */}
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full blur-md opacity-70 -translate-x-1/2 -translate-y-1/2" style={{ animation: 'floaty 8s ease-in-out infinite', background: 'radial-gradient(circle, rgba(251, 191, 36, 0.4), transparent)' }} />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full blur-md opacity-70 translate-x-1/2 translate-y-1/2" style={{ animation: 'floaty 8s ease-in-out infinite 2s', background: 'radial-gradient(circle, rgba(255, 100, 87, 0.4), transparent)' }} />

      {/* Main 404 card content */}
      <div className="relative z-10 w-full max-w-2xl p-10 bg-white/86 rounded-3xl shadow-2xl backdrop-blur-3xl" style={{ animation: 'cardReveal 700ms ease-out both' }}>
        {/* Error label */}
        <p className="text-xs font-semibold tracking-widest uppercase text-cyan-600 mb-3">404 ERROR</p>
        
        {/* Error title (Indonesian: "Page not found") */}
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4" style={{ fontFamily: '"Fraunces", "Georgia", serif' }}>Halaman tidak ditemukan</h1>
        
        {/* Error description message */}
        <p className="text-lg leading-relaxed text-slate-500 mb-7">
          Sepertinya kamu tersesat. Coba kembali ke beranda atau ulangi langkahmu.
        </p>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Button 1: Go to home page */}
          <button
            className="px-5 py-3 text-sm font-semibold text-slate-900 rounded-full transition-all duration-180 active:scale-95 hover:scale-105 hover:shadow-lg"
            style={{
              background: 'linear-gradient(120deg, #fb7185, #f97316, #facc15)',
              boxShadow: '0 16px 40px rgba(249, 115, 22, 0.25)'
            }}
            onClick={() => navigate("/")}
          >
            Kembali ke Beranda
          </button>

          {/* Button 2: Go back to previous page */}
          <button
            className="px-5 py-3 text-sm font-semibold text-slate-900 rounded-full bg-transparent border-2 border-slate-200 transition-all duration-180 active:scale-95 hover:scale-105 hover:shadow-lg"
            onClick={() => navigate(-1)}
          >
            Kembali ke Halaman Sebelumnya
          </button>
        </div>

        {/* Route path display */}
        <div className="text-xs font-mono tracking-widest uppercase text-slate-400">/not-found</div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes floaty {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(10px, -10px); }
          50% { transform: translate(-5px, 10px); }
          75% { transform: translate(10px, 5px); }
        }
        @keyframes cardReveal {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
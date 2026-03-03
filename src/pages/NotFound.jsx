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
import "./not-found.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      {/* Background decorative orbs */}
      <div className="not-found-orb not-found-orb--left" />
      <div className="not-found-orb not-found-orb--right" />

      {/* Main 404 card content */}
      <div className="not-found-card">
        {/* Error label */}
        <p className="not-found-eyebrow">404 ERROR</p>
        
        {/* Error title (Indonesian: "Page not found") */}
        <h1 className="not-found-title">Halaman tidak ditemukan</h1>
        
        {/* Error description message */}
        <p className="not-found-copy">
          Sepertinya kamu tersesat. Coba kembali ke beranda atau ulangi langkahmu.
        </p>

        {/* Action buttons */}
        <div className="not-found-actions">
          {/* Button 1: Go to home page */}
          <button
            className="not-found-btn not-found-btn--primary"
            onClick={() => navigate("/")}
          >
            Kembali ke Beranda
          </button>

          {/* Button 2: Go back to previous page */}
          <button
            className="not-found-btn not-found-btn--ghost"
            onClick={() => navigate(-1)}
          >
            Kembali ke Halaman Sebelumnya
          </button>
        </div>

        {/* Route path display */}
        <div className="not-found-code">/not-found</div>
      </div>

      {/* Decorative grid background (hidden from screen readers) */}
      <div className="not-found-grid" aria-hidden="true" />
    </div>
  );
}

// src/pages/NotFound.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./not-found.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-orb not-found-orb--left" />
      <div className="not-found-orb not-found-orb--right" />

      <div className="not-found-card">
        <p className="not-found-eyebrow">404 ERROR</p>
        <h1 className="not-found-title">Halaman tidak ditemukan</h1>
        <p className="not-found-copy">
          Sepertinya kamu tersesat. Coba kembali ke beranda atau ulangi langkahmu.
        </p>
        <div className="not-found-actions">
          <button
            className="not-found-btn not-found-btn--primary"
            onClick={() => navigate("/")}
          >
            Kembali ke Beranda
          </button>
          <button
            className="not-found-btn not-found-btn--ghost"
            onClick={() => navigate(-1)}
          >
            Kembali ke Halaman Sebelumnya
          </button>
        </div>
        <div className="not-found-code">/not-found</div>
      </div>

      <div className="not-found-grid" aria-hidden="true" />
    </div>
  );
}

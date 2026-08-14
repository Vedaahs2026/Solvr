"use client";

import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer style={{
      backgroundColor: "var(--primary-green-dark)",
      color: "var(--bg-beige)",
      padding: "60px 0 30px 0",
      borderTop: "3px solid var(--accent-gold)"
    }}>
      <div className="container">
        <div className="footer-grid" style={{ marginBottom: "40px" }}>
          <div>
            <h3 style={{ color: "var(--white)", marginBottom: "16px" }} className="logo">
              SOL<span className="logo-v">V</span>R
            </h3>
            <p style={{ color: "rgba(245, 235, 224, 0.7)", fontSize: "0.9rem", maxWidth: "360px", lineHeight: 1.6 }}>
              SOLVR is an engineering and design lab dedicated to building functional, high-utility consumer items that address real-world daily problems.
            </p>
          </div>
          <div>
            <h4 style={{ color: "var(--accent-gold)", fontSize: "1rem", marginBottom: "16px", fontWeight: 700 }}>Navigation</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.9rem" }}>
              <li><Link href="/" style={{ color: "rgba(245, 235, 224, 0.8)" }}>Home</Link></li>
              <li><Link href="/about" style={{ color: "rgba(245, 235, 224, 0.8)" }}>About</Link></li>
              <li><Link href="/products" style={{ color: "rgba(245, 235, 224, 0.8)" }}>Products</Link></li>
              <li><Link href="/contact" style={{ color: "rgba(245, 235, 224, 0.8)" }}>Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: "var(--accent-gold)", fontSize: "1rem", marginBottom: "16px", fontWeight: 700 }}>Get in Touch</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.9rem", color: "rgba(245, 235, 224, 0.8)" }}>
              <li>
                <strong>Email:</strong><br />
                <a href="mailto:solutions@solvr.lab" style={{ color: "rgba(245, 235, 224, 0.8)", textDecoration: "none" }}>
                  solutions@solvr.lab
                </a>
              </li>
              <li>
                <strong>Mobile:</strong><br />
                <span>+1 (555) 019-2831</span>
              </li>
            </ul>
          </div>
        </div>

        <div style={{
          borderTop: "1px solid rgba(245, 235, 224, 0.15)",
          paddingTop: "24px",
          textAlign: "center",
          fontSize: "0.8rem",
          color: "rgba(245, 235, 224, 0.5)"
        }}>
          <span>&copy; {new Date().getFullYear()} SOLVR Lab. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

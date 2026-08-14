"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <main style={{ 
        padding: "80px 0",
        background: "linear-gradient(180deg, #fdfbf7 0%, #f7f4eb 100%)",
        minHeight: "75vh",
        display: "flex",
        alignItems: "center"
      }}>
        <style jsx>{`
          .social-contact-button {
            display: flex;
            flex-direction: column;
            alignItems: center;
            justify-content: center;
            gap: 10px;
            padding: 24px 12px;
            border-radius: 16px;
            border: 1px solid rgba(6, 78, 59, 0.08);
            text-decoration: none;
            font-weight: 700;
            font-size: 0.9rem;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            cursor: pointer;
          }

          .social-contact-button:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(6, 78, 59, 0.08);
            border-color: currentColor !important;
          }
        `}</style>

        <div className="container" style={{ maxWidth: "900px" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span style={{
              fontSize: "0.85rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "var(--accent-gold)",
              marginBottom: "12px",
              display: "block"
            }}>
              Connect With Us
            </span>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--primary-green)", marginBottom: "16px", lineHeight: 1.2 }}>
              Get In Touch
            </h1>
            <div style={{
              width: "60px",
              height: "4px",
              backgroundColor: "var(--accent-gold)",
              borderRadius: "2px",
              margin: "0 auto"
            }} />
          </div>

          {/* Grid Layout containing details and social contact buttons */}
          <div className="grid-2" style={{ gap: "40px", alignItems: "stretch" }}>
            {/* Left side: Headquarters contact details */}
            <div style={{
              backgroundColor: "var(--white)",
              padding: "44px",
              borderRadius: "24px",
              boxShadow: "0 8px 32px rgba(6, 78, 59, 0.04)",
              border: "1px solid rgba(6, 78, 59, 0.08)",
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}>
              <div>
                <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--primary-green)", marginBottom: "16px" }}>
                  SOLVR Headquarters
                </h3>
                <p style={{ fontSize: "0.95rem", color: "#475569", lineHeight: 1.6, marginBottom: "28px" }}>
                  Reach out to our core team for office visits, general support, or business-hour inquiries.
                </p>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "20px", fontSize: "1.05rem", color: "#1e293b" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                    <span style={{ fontSize: "1.3rem" }}>📞</span>
                    <div>
                      <strong>Phone:</strong><br />
                      <span style={{ color: "#334155" }}>+1 (555) 019-2831</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                    <span style={{ fontSize: "1.3rem" }}>⏰</span>
                    <div>
                      <strong>Business Hours:</strong><br />
                      <span style={{ color: "#334155" }}>Monday - Saturday, 9:00 AM - 6:00 PM</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                    <span style={{ fontSize: "1.3rem" }}>📍</span>
                    <div>
                      <strong>Address:</strong><br />
                      <span style={{ color: "#334155" }}>Innovation Park, Suite 404, Engineering Way</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Clickable contact icons */}
            <div style={{
              backgroundColor: "var(--white)",
              padding: "44px",
              borderRadius: "24px",
              boxShadow: "0 8px 32px rgba(6, 78, 59, 0.04)",
              border: "1px solid rgba(6, 78, 59, 0.08)",
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}>
              <div>
                <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--primary-green)", marginBottom: "16px" }}>
                  Connect Online
                </h3>
                <p style={{ fontSize: "0.95rem", color: "#475569", lineHeight: 1.6, marginBottom: "32px" }}>
                  Chat with us instantly or follow our latest updates across our official social channels.
                </p>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px"
                }}>
                  {[
                    {
                      name: "WhatsApp",
                      icon: (
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      ),
                      url: "https://wa.me/15550192832"
                    },
                    {
                      name: "Email Us",
                      icon: (
                        <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                      ),
                      url: "mailto:solutions@solvr.lab"
                    },
                    {
                      name: "Instagram",
                      icon: (
                        <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                      ),
                      url: "https://instagram.com"
                    },
                    {
                      name: "Facebook",
                      icon: (
                        <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                      ),
                      url: "https://facebook.com"
                    }
                  ].map((social, idx) => (
                    <a
                      key={idx}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-contact-button"
                      style={{
                        color: "var(--primary-green)",
                        backgroundColor: "rgba(6, 78, 59, 0.04)"
                      }}
                    >
                      {social.icon}
                      <span>{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab: "profile" | "address" | "orders";
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, customers, updateCustomer } = useApp();
  const [name, setName] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  // Retrieve customer data to preserve addresses during update
  const customer = customers.find((c) => c.phone === currentUser.phone);
  const addresses = customer?.addresses || [];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateCustomer(currentUser.phone, name, addresses);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose(); // Automatically close popup after saving changes
    }, 1800);
  };

  const userInitial = name.trim() ? name.trim().charAt(0).toUpperCase() : currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1001, backdropFilter: "blur(4px)" }}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: "460px", 
          width: "90%", 
          padding: "36px 32px 32px 32px", 
          borderRadius: "28px",
          boxShadow: "0 20px 50px rgba(6, 78, 59, 0.15)",
          border: "1px solid rgba(6, 78, 59, 0.1)",
          backgroundColor: "#fdfbf7"
        }}
      >
        <button 
          className="modal-close" 
          onClick={onClose}
          style={{ top: "20px", right: "20px", fontSize: "1.4rem", color: "var(--text-muted)", cursor: "pointer" }}
        >
          &times;
        </button>

        {/* Top Profile Avatar Header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "20px" }}>
          <div style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: "var(--primary-green)",
            color: "var(--accent-gold)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            fontWeight: 800,
            boxShadow: "0 6px 16px rgba(6, 78, 59, 0.2)",
            marginBottom: "12px"
          }}>
            {userInitial}
          </div>

          <h3 style={{ fontSize: "1.5rem", color: "var(--primary-green)", fontWeight: 900, margin: 0, lineHeight: 1.2 }}>
            Edit Profile
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
            Update your account details below
          </p>
        </div>

        {success && (
          <div style={{
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            color: "var(--success)",
            padding: "12px 16px",
            borderRadius: "14px",
            fontSize: "0.85rem",
            marginBottom: "20px",
            textAlign: "center",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            fontWeight: 700
          }}>
            ✓ Profile saved successfully!
          </div>
        )}

        <form onSubmit={handleSaveProfile} style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: "18px" }}>
          
          {/* Registered Phone Number */}
          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--primary-green-dark)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Registered Phone Number
            </label>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "rgba(6, 78, 59, 0.04)",
              border: "1px solid rgba(6, 78, 59, 0.12)",
              borderRadius: "14px",
              padding: "12px 16px",
              marginTop: "6px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--primary-green-dark)", fontWeight: 700, fontSize: "0.95rem" }}>
                {/* Sleek SVG Phone Icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--accent-gold)", flexShrink: 0 }}>
                  <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                <span>{currentUser.phone}</span>
              </div>
              <span style={{ 
                fontSize: "0.72rem", 
                fontWeight: 800, 
                backgroundColor: "rgba(6, 78, 59, 0.1)", 
                color: "var(--primary-green)", 
                padding: "3px 9px", 
                borderRadius: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.04em"
              }}>
                ✓ Verified
              </span>
            </div>
          </div>

          {/* Your Name */}
          <div className="form-group" style={{ margin: 0 }}>
            <label htmlFor="edit-name" style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--primary-green-dark)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Your Name
            </label>
            <input
              id="edit-name"
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              autoFocus
              style={{
                marginTop: "6px",
                borderRadius: "14px",
                padding: "12px 16px",
                fontSize: "0.95rem",
                fontWeight: "600",
                border: "1.5px solid rgba(6, 78, 59, 0.2)",
                backgroundColor: "#ffffff"
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button 
              type="button" 
              className="btn-outline" 
              onClick={onClose}
              style={{ flex: 1, justifyContent: "center", padding: "12px", borderRadius: "14px", fontWeight: 700 }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ flex: 1.5, justifyContent: "center", padding: "12px", borderRadius: "14px", fontWeight: 800, boxShadow: "var(--shadow-md)" }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

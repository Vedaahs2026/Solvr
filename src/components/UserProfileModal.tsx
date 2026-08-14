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
    }, 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1001 }}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: "450px", width: "90%", padding: "32px" }}
      >
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>

        <h3 style={{ fontSize: "1.4rem", color: "var(--primary-green)", marginBottom: "8px", textAlign: "center" }}>
          Edit Profile
        </h3>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "24px", textAlign: "center" }}>
          Update your screen name. Phone number acts as secure login ID.
        </p>

        {success && (
          <div style={{
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            color: "var(--success)",
            padding: "10px 14px",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.85rem",
            marginBottom: "16px",
            textAlign: "left",
            borderLeft: "4px solid var(--success)",
            fontWeight: 600
          }}>
            ✓ Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSaveProfile} style={{ textAlign: "left" }}>
          <div className="form-group" style={{ marginBottom: "16px" }}>
            <label>Registered Phone Number</label>
            <div style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "rgba(6, 78, 59, 0.05)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-sm)",
              padding: "12px 16px",
              color: "var(--text-muted)",
              fontSize: "0.95rem",
              fontWeight: "600",
              gap: "8px"
            }}>
              <span>🔒</span> {currentUser.phone}
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "24px" }}>
            <label htmlFor="edit-name">Your Display Name</label>
            <input
              id="edit-name"
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              required
              autoFocus
            />
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button 
              type="button" 
              className="btn-outline" 
              onClick={onClose}
              style={{ flex: 1, justifyContent: "center" }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ flex: 1.5, justifyContent: "center" }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

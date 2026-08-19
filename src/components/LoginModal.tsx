"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";

export const LoginModal: React.FC = () => {
  const { 
    customers, 
    loginCustomer, 
    // We will add these to context next
    isLoginOpen, 
    setIsLoginOpen 
  } = useApp();

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [isNewUser, setIsNewUser] = useState(false);
  const [error, setError] = useState("");

  if (!isLoginOpen) return null;

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanPhone = phone.trim().replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      setError("Please enter a valid phone number (at least 10 digits).");
      return;
    }
    setPhone(cleanPhone);

    // Secure normalize match against database phone logs
    const userExists = (customers || []).some(
      (c: any) => c.phone.toString().replace(/\D/g, "") === cleanPhone
    );

    console.log("Checking customer list for phone:", cleanPhone);
    console.log("Database customers current list:", (customers || []).map((c: any) => `${c.name}: ${c.phone}`));
    console.log("User found in database (returning user)?:", userExists);

    setIsNewUser(!userExists);
    setStep(2);
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (otp !== "123456") {
      setError("Invalid OTP. For demonstration, please use dummy OTP: 123456");
      return;
    }

    if (isNewUser && (!name || name.trim() === "")) {
      setError("Please enter your name to complete registration.");
      return;
    }

    const success = loginCustomer(phone, isNewUser ? name : undefined);
    if (success) {
      // Reset form
      setPhone("");
      setName("");
      setOtp("");
      setStep(1);
      setIsNewUser(false);
      setIsLoginOpen(false);
    } else {
      setError("An error occurred during login. Please try again.");
    }
  };

  const handleClose = () => {
    setPhone("");
    setName("");
    setOtp("");
    setStep(1);
    setIsNewUser(false);
    setError("");
    setIsLoginOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>
          &times;
        </button>

        <h3 style={{ fontSize: "1.5rem", marginBottom: "12px" }}>
          {step === 1 ? "Login / Sign Up" : isNewUser ? "Create Profile" : "Verify Phone"}
        </h3>
        <p style={{ fontSize: "0.9rem", marginBottom: "24px", color: "var(--text-muted)" }}>
          {step === 1 
            ? "Enter your mobile number to get started with SOLVR" 
            : isNewUser 
              ? "We notice you're new! Please enter your name and the dummy OTP code." 
              : "Enter the verification code sent to your phone."
          }
        </p>

        {error && (
          <div style={{
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            color: "var(--error)",
            padding: "10px 14px",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.85rem",
            marginBottom: "16px",
            textAlign: "left",
            borderLeft: "4px solid var(--error)"
          }}>
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handlePhoneSubmit}>
            <div className="form-group">
              <label htmlFor="login-phone">Mobile Number</label>
              <input
                id="login-phone"
                type="tel"
                className="form-control"
                placeholder="Enter 10-digit number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                maxLength={10}
                required
                autoFocus
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "8px" }}>
              Continue
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifySubmit}>
            {isNewUser && (
              <div className="form-group">
                <label htmlFor="login-name">Your Full Name</label>
                <input
                  id="login-name"
                  type="text"
                  className="form-control"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="login-otp">One-Time Password (OTP)</label>
              <input
                id="login-otp"
                type="text"
                className="form-control"
                placeholder="Enter 123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                maxLength={6}
                required
                autoFocus={!isNewUser}
              />
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", alignSelf: "flex-start", marginTop: "2px" }}>
                Use mock OTP: <strong style={{ color: "var(--primary-green)" }}>123456</strong>
              </span>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
              <button 
                type="button" 
                className="btn-outline" 
                style={{ flex: 1, justifyContent: "center", padding: "10px" }}
                onClick={() => {
                  setStep(1);
                  setError("");
                }}
              >
                Back
              </button>
              <button 
                type="submit" 
                className="btn-primary" 
                style={{ flex: 2, justifyContent: "center", padding: "10px" }}
              >
                Verify & Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

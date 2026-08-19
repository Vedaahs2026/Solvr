"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";

export const LoginModal: React.FC = () => {
  const { 
    customers, 
    loginCustomer, 
    isLoginOpen, 
    setIsLoginOpen 
  } = useApp();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isNewUser, setIsNewUser] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isLoginOpen) return null;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    const userExists = (customers || []).some(
      (c: any) => c.email && c.email.trim().toLowerCase() === cleanEmail
    );

    // Generate a random 6-digit OTP code
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setSentOtp(generatedOtp);
    setIsNewUser(!userExists);

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, otp: generatedOtp })
      });

      if (!res.ok) {
        throw new Error("Failed to send OTP email");
      }

      setStep(2);
    } catch (err: any) {
      console.error(err);
      setError("Could not send OTP email. Please verify SMTP credentials or try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (otp !== sentOtp) {
      setError("Invalid OTP. Please check your email inbox and enter the correct code.");
      return;
    }

    if (isNewUser) {
      // Transition to Step 3 for Profile Creation after successful OTP verification
      setStep(3);
    } else {
      // Log in returning user directly
      const success = loginCustomer(email);
      if (success) {
        handleResetAndClose();
      } else {
        setError("An error occurred during login. Please try again.");
      }
    }
  };

  const handleRegisterProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || name.trim() === "") {
      setError("Please enter your name.");
      return;
    }
    
    const cleanPhone = phone.trim().replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    const success = loginCustomer(email, name.trim(), cleanPhone);
    if (success) {
      handleResetAndClose();
    } else {
      setError("An error occurred during registration.");
    }
  };

  const handleResetAndClose = () => {
    setEmail("");
    setPhone("");
    setName("");
    setOtp("");
    setSentOtp("");
    setStep(1);
    setIsNewUser(false);
    setError("");
    setIsLoginOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={handleResetAndClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleResetAndClose}>
          &times;
        </button>

        <h3 style={{ fontSize: "1.5rem", marginBottom: "12px" }}>
          {step === 1 ? "Login / Sign Up" : step === 2 ? "Verify Email" : "Create Profile"}
        </h3>
        <p style={{ fontSize: "0.9rem", marginBottom: "24px", color: "var(--text-muted)", lineHeight: 1.4 }}>
          {step === 1 
            ? "Enter your email address to get started with SOLVR" 
            : step === 2
              ? `An email with the verification code has been sent to ${email}.`
              : "We notice you're new! Please enter your name and a 10-digit mobile number to complete your profile."
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

        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                type="email"
                className="form-control"
                placeholder="e.g. name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                autoFocus
              />
            </div>
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: "100%", justifyContent: "center", marginTop: "8px" }}
              disabled={loading}
            >
              {loading ? "Sending Verification Code..." : "Continue"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <div className="form-group">
              <label htmlFor="login-otp">One-Time Password (OTP)</label>
              <input
                id="login-otp"
                type="text"
                className="form-control"
                placeholder="Enter 6-digit verification code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                maxLength={6}
                required
                autoFocus
              />
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", alignSelf: "flex-start", marginTop: "4.5px", textAlign: "left", lineHeight: 1.4 }}>
                An email with the verification code has been sent to <strong>{email}</strong>. If you didn't receive the OTP, please check your spam folder as well.
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
                Verify OTP
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleRegisterProfile}>
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
              />
            </div>
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: "100%", justifyContent: "center", marginTop: "16px" }}
            >
              Complete Profile & Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

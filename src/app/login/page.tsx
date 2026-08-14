"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { customers, loginCustomer } = useApp();

  const redirectUrl = searchParams.get("redirect") || "/";

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [isNewUser, setIsNewUser] = useState(false);
  const [error, setError] = useState("");

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanPhone = phone.trim().replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      setError("Please enter a valid phone number (at least 10 digits).");
      return;
    }
    setPhone(cleanPhone);

    const userExists = (customers || []).some(
      (c: any) => c.phone.toString().replace(/\D/g, "") === cleanPhone
    );

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
      router.push(redirectUrl);
    } else {
      setError("An error occurred during login. Please try again.");
    }
  };

  return (
    <div style={{
      maxWidth: "420px",
      width: "100%",
      backgroundColor: "#fdfbf7", // Lighter warm cream card background for clean separation
      borderRadius: "24px",
      boxShadow: "var(--shadow-lg)",
      border: "1px solid rgba(6, 78, 59, 0.1)",
      padding: "40px",
      margin: "40px auto",
      textAlign: "center"
    }}>
      <div className="logo" style={{ justifyContent: "center", marginBottom: "20px" }}>
        SOL<span className="logo-v">V</span>R
      </div>

      <h3 style={{ fontSize: "1.5rem", marginBottom: "8px", color: "var(--primary-green)", fontWeight: 800 }}>
        {step === 1 ? "Login / Sign Up" : isNewUser ? "Create Profile" : "Verify Phone"}
      </h3>
      <p style={{ fontSize: "0.85rem", marginBottom: "24px", color: "var(--text-muted)", lineHeight: 1.5 }}>
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
        <form onSubmit={handlePhoneSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label htmlFor="login-phone" style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Mobile Number
            </label>
            <input
              id="login-phone"
              type="tel"
              className="form-control"
              placeholder="Enter 10-digit number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              required
              style={{ border: "1px solid rgba(6, 78, 59, 0.25)" }}
              autoFocus
            />
          </div>
          <button 
            type="submit" 
            className="btn-primary" 
            style={{ 
              width: "100%", 
              justifyContent: "center", 
              marginTop: "8px",
              backgroundColor: "#111827", // Dark button
              color: "#ffffff",
              fontWeight: 800,
              borderRadius: "16px",
              padding: "14px",
              border: "none",
              cursor: "pointer"
            }}
          >
            Continue &nbsp;➔
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifySubmit} style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" }}>
          {isNewUser && (
            <div className="form-group" style={{ margin: 0 }}>
              <label htmlFor="login-name" style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                Your Full Name
              </label>
              <input
                id="login-name"
                type="text"
                className="form-control"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ border: "1px solid rgba(6, 78, 59, 0.25)" }}
                autoFocus
              />
            </div>
          )}
          
          <div className="form-group" style={{ margin: 0 }}>
            <label htmlFor="login-otp" style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              One-Time Password (OTP)
            </label>
            <input
              id="login-otp"
              type="text"
              className="form-control"
              placeholder="Enter 123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              maxLength={6}
              required
              style={{ border: "1px solid rgba(6, 78, 59, 0.25)" }}
              autoFocus={!isNewUser}
            />
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", alignSelf: "flex-start", marginTop: "2px" }}>
              Use mock OTP: <strong style={{ color: "var(--primary-green)", fontWeight: 700 }}>123456</strong>
            </span>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
            <button 
              type="button" 
              className="btn-outline" 
              style={{ 
                flex: 1, 
                justifyContent: "center", 
                padding: "14px",
                borderColor: "#111827",
                color: "#111827",
                fontWeight: 800,
                borderRadius: "16px",
                backgroundColor: "transparent",
                cursor: "pointer"
              }}
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
              style={{ 
                flex: 2, 
                justifyContent: "center", 
                padding: "14px",
                backgroundColor: "#111827", // Dark button
                color: "#ffffff",
                fontWeight: 800,
                borderRadius: "16px",
                border: "none",
                cursor: "pointer"
              }}
            >
              Verify & Login
            </button>
          </div>
        </form>
      )}

      <Link 
        href={redirectUrl} 
        style={{ 
          display: "block", 
          marginTop: "24px", 
          fontSize: "0.85rem", 
          color: "var(--primary-green)", 
          fontWeight: 700,
          textDecoration: "underline"
        }}
      >
        Cancel & Go Back
      </Link>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        minHeight: "75vh",
        padding: "40px 20px",
        backgroundColor: "var(--bg-beige)"
      }}>
        <Suspense fallback={
          <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "1.1rem" }}>
            Loading secure gateway...
          </div>
        }>
          <LoginContent />
        </Suspense>
      </main>
      
      <Footer />
    </>
  );
}

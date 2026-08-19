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

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isNewUser, setIsNewUser] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        router.push(redirectUrl);
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
      router.push(redirectUrl);
    } else {
      setError("An error occurred during registration.");
    }
  };

  return (
    <div style={{
      maxWidth: "420px",
      width: "100%",
      backgroundColor: "#fdfbf7",
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
        {step === 1 ? "Login / Sign Up" : step === 2 ? "Verify Email" : "Create Profile"}
      </h3>
      <p style={{ fontSize: "0.85rem", marginBottom: "24px", color: "var(--text-muted)", lineHeight: 1.5 }}>
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
        <form onSubmit={handleEmailSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label htmlFor="login-email" style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              className="form-control"
              placeholder="e.g. name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={{ border: "1px solid rgba(6, 78, 59, 0.25)" }}
              autoFocus
            />
          </div>
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            style={{ 
              width: "100%", 
              justifyContent: "center", 
              marginTop: "8px",
              backgroundColor: "#111827",
              color: "#ffffff",
              fontWeight: 800,
              borderRadius: "16px",
              padding: "14px",
              border: "none",
              cursor: "pointer"
            }}
          >
            {loading ? "Sending OTP..." : "Continue ➔"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label htmlFor="login-otp" style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              One-Time Password (OTP)
            </label>
            <input
              id="login-otp"
              type="text"
              className="form-control"
              placeholder="Enter verification code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              maxLength={6}
              required
              style={{ border: "1px solid rgba(6, 78, 59, 0.25)" }}
              autoFocus
            />
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", alignSelf: "flex-start", marginTop: "4.5px", lineHeight: 1.4 }}>
              An email with the verification code has been sent to <strong>{email}</strong>. If you didn't receive the OTP, please check your spam folder as well.
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
                backgroundColor: "#111827",
                color: "#ffffff",
                fontWeight: 800,
                borderRadius: "16px",
                border: "none",
                cursor: "pointer"
              }}
            >
              Verify OTP
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleRegisterProfile} style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" }}>
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
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              maxLength={10}
              required
              style={{ border: "1px solid rgba(6, 78, 59, 0.25)" }}
            />
          </div>
          <button 
            type="submit" 
            className="btn-primary" 
            style={{ 
              width: "100%", 
              justifyContent: "center", 
              marginTop: "8px",
              backgroundColor: "#111827",
              color: "#ffffff",
              fontWeight: 800,
              borderRadius: "16px",
              padding: "14px",
              border: "none",
              cursor: "pointer"
            }}
          >
            Complete Profile & Login
          </button>
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

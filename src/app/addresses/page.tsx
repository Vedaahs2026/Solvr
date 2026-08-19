"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useApp } from "@/context/AppContext";
import Link from "next/link";

export default function SavedAddressesPage() {
  const router = useRouter();
  const { currentUser, customers, updateCustomer } = useApp();
  
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // View states: true for form, false for listing
  const [isAdding, setIsAdding] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  // Form states
  const [fullName, setFullName] = useState("");
  const [street, setStreet] = useState("");
  const [cityVal, setCityVal] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [pincode, setPincode] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  // Sync default values when logging in
  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.name);
      setContactPhone(currentUser.phone);
    } else if (hasMounted) {
      router.push("/login?redirect=/addresses");
    }
  }, [currentUser, router, hasMounted]);

  if (!hasMounted) {
    return (
      <>
        <Navbar />
        <main style={{ minHeight: "80vh", backgroundColor: "var(--bg-beige)" }} />
      </>
    );
  }

  if (!currentUser) {
    return (
      <>
        <Navbar />
        <main style={{ minHeight: "75vh" }} className="flex-center">
          <div style={{
            backgroundColor: "var(--white)",
            padding: "40px",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-lg)",
            maxWidth: "480px",
            textAlign: "center",
            border: "1px solid var(--border-color)"
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🔒</div>
            <h2 style={{ marginBottom: "12px" }}>Access Restricted</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "24px" }}>
              Please sign in to view, edit, or manage your saved delivery addresses.
            </p>
            <button className="btn-primary" onClick={() => router.push("/login?redirect=/addresses")} style={{ width: "100%", justifyContent: "center" }}>
              Sign In / Sign Up
            </button>
            <Link href="/" style={{ display: "block", marginTop: "16px", fontSize: "0.9rem", color: "var(--primary-green)", fontWeight: 600 }}>
              ← Return Home
            </Link>
          </div>
        </main>
      </>
    );
  }

  // Find customer data to read addresses
  const customer = customers.find((c) => 
    (c.phone && currentUser?.phone && c.phone.toString().replace(/\D/g, "") === currentUser.phone.toString().replace(/\D/g, "")) ||
    (c.email && currentUser?.email && c.email.trim().toLowerCase() === currentUser.email.trim().toLowerCase())
  );
  const addresses = customer?.addresses || [];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName.trim() || !street.trim() || !cityVal.trim() || !stateVal.trim() || !pincode.trim() || !contactPhone.trim()) {
      alert("Please fill in all the required delivery address fields.");
      return;
    }

    // Combine structured fields into a single record string
    const formattedAddress = `${street.trim()}, ${cityVal.trim()}, ${stateVal.trim()} - ${pincode.trim()} (Name: ${fullName.trim()}, Phone: ${contactPhone.trim()})`;
    
    const updated = [...addresses, formattedAddress];
    updateCustomer(currentUser.email, currentUser.name, currentUser.phone, updated);
    
    // Reset form states (keep default name and phone for next run)
    setStreet("");
    setCityVal("");
    setStateVal("");
    setPincode("");
    
    setIsAdding(false);
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 3000);
  };

  const handleDeleteAddress = (indexToDelete: number) => {
    const updated = addresses.filter((_, idx) => idx !== indexToDelete);
    updateCustomer(currentUser.email, currentUser.name, currentUser.phone, updated);
  };

  const handleCancel = () => {
    setStreet("");
    setCityVal("");
    setStateVal("");
    setPincode("");
    setIsAdding(false);
  };

  return (
    <>
      <Navbar />

      <main style={{ padding: "60px 0", minHeight: "80vh" }}>
        <div className="container" style={{ maxWidth: "680px" }}>
          
          {/* View 1: Saved Addresses List */}
          {!isAdding ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Breadcrumbs */}
              <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "4px" }}>
                <Link href="/" style={{ color: "var(--primary-green)" }}>Home</Link>
                {" / "}
                <span>Saved Addresses</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--primary-green)", margin: 0 }}>
                    My Addresses
                  </h1>
                  <p style={{ color: "var(--text-muted)", marginTop: "4px", fontSize: "0.9rem" }}>
                    Manage saved shipping details for checkout convenience.
                  </p>
                </div>
                <button 
                  className="btn-primary" 
                  onClick={() => setIsAdding(true)}
                  style={{ padding: "10px 20px", fontSize: "0.9rem" }}
                >
                  + Add Address
                </button>
              </div>

              {successMessage && (
                <div style={{
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  color: "var(--success)",
                  padding: "12px 16px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.9rem",
                  borderLeft: "4px solid var(--success)",
                  fontWeight: 600
                }}>
                  ✓ Delivery address added to your profile!
                </div>
              )}

              <div style={{
                backgroundColor: "var(--white)",
                padding: "32px",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-sm)",
                border: "1px solid var(--border-color)"
              }}>
                <h3 style={{ fontSize: "1.15rem", color: "var(--primary-green)", marginBottom: "16px", fontWeight: "700" }}>
                  Saved Deliveries ({addresses.length})
                </h3>

                {addresses.length === 0 ? (
                  <div style={{
                    padding: "40px 0",
                    textAlign: "center",
                    border: "1px dashed var(--accent-gold)",
                    borderRadius: "var(--radius-sm)"
                  }}>
                    <span style={{ fontSize: "2rem", display: "block", marginBottom: "8px" }}>📍</span>
                    <p style={{ fontStyle: "italic", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                      No saved addresses yet. Click "+ Add Address" above to write details.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {addresses.map((addr, idx) => (
                      <div 
                        key={idx}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "16px 20px",
                          backgroundColor: "rgba(6, 78, 59, 0.03)",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid rgba(6, 78, 59, 0.05)",
                          fontSize: "0.95rem"
                        }}
                      >
                        <span style={{ flex: 1, paddingRight: "20px", color: "var(--text-dark)", lineHeight: 1.5 }}>
                          {addr}
                        </span>
                        <button 
                          onClick={() => handleDeleteAddress(idx)}
                          style={{
                            color: "var(--error)",
                            fontSize: "0.9rem",
                            fontWeight: "700",
                            padding: "6px 12px"
                          }}
                        >
                          🗑️ Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* View 2: Add Address Form (Matches reference image layout & design exactly) */
            <div style={{
              backgroundColor: "var(--white)",
              borderRadius: "24px",
              boxShadow: "var(--shadow-lg)",
              border: "1px solid var(--border-color)",
              padding: "36px",
              width: "100%"
            }}>
              {/* Header with location icon (matching image) */}
              <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "20px" }}>
                <div style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "16px",
                  backgroundColor: "rgba(6, 78, 59, 0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.4rem"
                }}>
                  📍
                </div>
                <div>
                  <h2 style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--primary-green)", margin: 0, letterSpacing: "-0.02em" }}>
                    Delivery Address
                  </h2>
                  <span style={{ fontSize: "0.75rem", color: "#a1a1a1", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.08em" }}>
                    WHERE SHOULD WE SEND YOUR SOLUTION?
                  </span>
                </div>
              </div>

              {/* Back link */}
              <button 
                onClick={handleCancel}
                style={{
                  color: "var(--text-dark)",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "28px"
                }}
              >
                ← Back to saved addresses
              </button>

              <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                
                {/* 1. Full Name */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label htmlFor="form-fullname" style={{ fontSize: "0.75rem", color: "#a1a1a1", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>
                    FULL NAME
                  </label>
                  <input
                    id="form-fullname"
                    type="text"
                    className="form-control"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                {/* 2. Street Address */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label htmlFor="form-street" style={{ fontSize: "0.75rem", color: "#a1a1a1", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>
                    STREET / APARTMENT / LANDMARK
                  </label>
                  <input
                    id="form-street"
                    type="text"
                    className="form-control"
                    placeholder="123 Boutique Lane, Suite 4B"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    required
                  />
                </div>

                {/* 3. City & State (Side-by-side) */}
                <div style={{ display: "flex", gap: "16px" }}>
                  <div className="form-group" style={{ flex: 1, margin: 0 }}>
                    <label htmlFor="form-city" style={{ fontSize: "0.75rem", color: "#a1a1a1", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>
                      CITY
                    </label>
                    <input
                      id="form-city"
                      type="text"
                      className="form-control"
                      placeholder="Mumbai"
                      value={cityVal}
                      onChange={(e) => setCityVal(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1, margin: 0 }}>
                    <label htmlFor="form-state" style={{ fontSize: "0.75rem", color: "#a1a1a1", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>
                      STATE
                    </label>
                    <input
                      id="form-state"
                      type="text"
                      className="form-control"
                      placeholder="Maharashtra"
                      value={stateVal}
                      onChange={(e) => setStateVal(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* 4. Pincode & Contact Phone (Side-by-side) */}
                <div style={{ display: "flex", gap: "16px", marginBottom: "8px" }}>
                  <div className="form-group" style={{ flex: 1, margin: 0 }}>
                    <label htmlFor="form-pincode" style={{ fontSize: "0.75rem", color: "#a1a1a1", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>
                      PINCODE
                    </label>
                    <input
                      id="form-pincode"
                      type="text"
                      maxLength={6}
                      className="form-control"
                      placeholder="6 Digits"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1, margin: 0 }}>
                    <label htmlFor="form-phone" style={{ fontSize: "0.75rem", color: "#a1a1a1", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>
                      CONTACT PHONE
                    </label>
                    <input
                      id="form-phone"
                      type="tel"
                      maxLength={10}
                      className="form-control"
                      placeholder="10 Digits"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      required
                    />
                  </div>
                </div>

                {/* Bottom Actions Row (matching screenshot spacing & colors) */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "24px",
                  gap: "16px"
                }}>
                  <button 
                    type="button" 
                    className="btn-outline" 
                    style={{ 
                      flex: 1, 
                      padding: "16px", 
                      justifyContent: "center",
                      borderRadius: "16px",
                      borderColor: "var(--border-color)",
                      color: "#a1a1a1",
                      fontWeight: 700,
                      backgroundColor: "var(--white)"
                    }}
                    onClick={handleCancel}
                  >
                    CANCEL
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary" 
                    style={{ 
                      flex: 2, 
                      padding: "16px", 
                      justifyContent: "center",
                      borderRadius: "16px",
                      backgroundColor: "#8a8a8a", // Matches the solid grey button in the screenshot
                      color: "var(--white)",
                      fontWeight: 700,
                      border: "none"
                    }}
                  >
                    PROCEED TO PAYMENT
                  </button>
                </div>

              </form>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}

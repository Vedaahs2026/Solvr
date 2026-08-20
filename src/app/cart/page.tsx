"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useApp } from "@/context/AppContext";
import Link from "next/link";

const parseAddressString = (addrStr: string) => {
  try {
    const nameMatch = addrStr.match(/\(Name:\s*([^,)]+)/);
    const phoneMatch = addrStr.match(/Phone:\s*([^)]+)\)/);
    
    const name = nameMatch ? nameMatch[1].trim() : "Customer";
    const phone = phoneMatch ? phoneMatch[1].trim() : "";
    
    const mainAddress = addrStr.split("(Name:")[0].trim();
    const parts = mainAddress.split(",");
    
    let street = "";
    let city = "";
    let state = "";
    let pincode = "";
    
    if (parts.length >= 3) {
      street = parts.slice(0, parts.length - 2).join(",").trim();
      city = parts[parts.length - 2].trim();
      
      const lastPart = parts[parts.length - 1] || "";
      const lastParts = lastPart.split("-");
      state = lastParts[0] ? lastParts[0].trim() : "";
      pincode = lastParts[1] ? lastParts[1].trim() : "";
    } else {
      street = mainAddress;
    }
    
    return { name, street, city, state, pincode, phone };
  } catch (e) {
    return {
      name: "Customer",
      street: addrStr,
      city: "",
      state: "",
      pincode: "",
      phone: ""
    };
  }
};

export default function CartPage() {
  const router = useRouter();
  const { 
    cart, 
    currentUser, 
    customers, 
    orders, 
    updateCustomer, 
    updateCartQuantity, 
    removeFromCart, 
    placeOrder, 
    setIsLoginOpen 
  } = useApp();

  // Checkout step control: "cart" | "address" | "success"
  const [step, setStep] = useState<"cart" | "address" | "success">("cart");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState("");

  // Address form states
  const [fullName, setFullName] = useState("");
  const [street, setStreet] = useState("");
  const [cityVal, setCityVal] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [pincode, setPincode] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Sync default values when logging in
  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.name);
      setContactPhone(currentUser.phone);
      
      // Auto-select first address if they have saved ones
      const customer = customers.find((c) => 
        (c.phone && currentUser?.phone && c.phone.toString().replace(/\D/g, "") === currentUser.phone.toString().replace(/\D/g, "")) ||
        (c.email && currentUser?.email && c.email.trim().toLowerCase() === currentUser.email.trim().toLowerCase())
      );
      if (customer?.addresses && customer.addresses.length > 0) {
        setSelectedAddress(customer.addresses[0]);
      } else {
        setIsAddingNewAddress(true);
      }
    }
  }, [currentUser, customers]);

  if (!hasMounted) {
    return (
      <>
        <Navbar />
        <main style={{ minHeight: "80vh", backgroundColor: "var(--bg-beige)" }} />
      </>
    );
  }

  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleProceedToCheckout = () => {
    if (!currentUser) {
      router.push("/login?redirect=/cart");
    } else if (cart.length === 0) {
      alert("Your cart is empty.");
    } else {
      setStep("address");
    }
  };

  const handleAddNewAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !street.trim() || !cityVal.trim() || !stateVal.trim() || !pincode.trim() || !contactPhone.trim()) {
      alert("Please fill in all address fields.");
      return;
    }

    const formattedAddress = `${street.trim()}, ${cityVal.trim()}, ${stateVal.trim()} - ${pincode.trim()} (Name: ${fullName.trim()}, Phone: ${contactPhone.trim()})`;
    
    // Save to customer profile in database
    const customer = customers.find((c) => c.email && c.email.trim().toLowerCase() === currentUser?.email.trim().toLowerCase());
    const existingAddresses = customer?.addresses || [];
    const updated = [...existingAddresses, formattedAddress];
    
    if (currentUser) {
      updateCustomer(currentUser.email, currentUser.name, currentUser.phone, updated);
    }
    
    // Select the new address and return to options list
    setSelectedAddress(formattedAddress);
    setIsAddingNewAddress(false);
    
    // Reset form inputs (leave name/phone defaults)
    setStreet("");
    setCityVal("");
    setStateVal("");
    setPincode("");
  };

  const handleFinalOrderSubmit = () => {
    if (!selectedAddress) {
      alert("Please select a delivery address.");
      return;
    }

    const parsedAddress = parseAddressString(selectedAddress);
    
    // Call context ordering logic to decrement inventory stocks
    const createdOrder = placeOrder(parsedAddress);
    if (createdOrder) {
      setSuccessOrderId(createdOrder.id);
      setStep("success");
    } else {
      alert("Failed to place order. Some items may be out of stock.");
    }
  };

  return (
    <>
      <Navbar />

      <main style={{ padding: "60px 0", minHeight: "80vh" }}>
        <div className="container" style={{ maxWidth: "1100px" }}>
          
          {/* STEP 1: SHOPPING CART */}
          {step === "cart" && (
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "32px" }}>
                <h1 style={{ fontSize: "2.4rem", fontWeight: 800, color: "var(--primary-green)", margin: 0 }}>
                  Shopping Cart
                </h1>
                <span style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  backgroundColor: "rgba(6, 78, 59, 0.08)",
                  color: "var(--primary-green)",
                  padding: "4px 12px",
                  borderRadius: "20px"
                }}>
                  {cartCount} ITEMS
                </span>
              </div>

              {cart.length === 0 ? (
                <div style={{
                  backgroundColor: "var(--white)",
                  borderRadius: "24px",
                  padding: "80px 24px",
                  textAlign: "center",
                  boxShadow: "var(--shadow-sm)",
                  border: "1px solid var(--border-color)"
                }}>
                  <span style={{ fontSize: "4rem", display: "block", marginBottom: "16px" }}>🛒</span>
                  <h3 style={{ color: "var(--primary-green)", marginBottom: "12px" }}>Your Cart is Empty</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "28px" }}>
                    Find engineered items to prototype solutions for your real-world problems.
                  </p>
                  <Link href="/products">
                    <button className="btn-primary">Explore Products</button>
                  </Link>
                </div>
              ) : (
                <div className="cart-layout-grid">
                  
                  {/* Left Column: Cart Items List */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {cart.map((item) => (
                      <div 
                        key={item.product.id}
                        style={{
                          backgroundColor: "var(--white)",
                          borderRadius: "24px",
                          padding: "24px",
                          boxShadow: "var(--shadow-sm)",
                          border: "1px solid var(--border-color)",
                          display: "flex",
                          gap: "24px",
                          alignItems: "center"
                        }}
                      >
                        {/* Image */}
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          style={{
                            width: "110px",
                            height: "110px",
                            objectFit: "cover",
                            borderRadius: "16px"
                          }}
                        />

                        {/* Mid Details */}
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px", textAlign: "left" }}>
                          <h3 style={{
                            fontSize: "1.05rem",
                            fontWeight: "800",
                            color: "var(--text-dark)",
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                            margin: 0
                          }}>
                            {item.product.name}
                          </h3>

                          {/* Attribute Badge */}
                          <div style={{ alignSelf: "flex-start" }}>
                            <span style={{
                              fontSize: "0.7rem",
                              fontWeight: "700",
                              color: "var(--text-muted)",
                              backgroundColor: "rgba(6, 78, 59, 0.04)",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              textTransform: "uppercase",
                              letterSpacing: "0.05em"
                            }}>
                              CUSTOMIZED: STANDARD
                            </span>
                          </div>

                          {/* Qty Controls (Matches layout in screenshot) */}
                          <div style={{ display: "flex", gap: "12px", marginTop: "4px", alignItems: "center" }}>
                            {/* Qty Selector with Plus/Minus buttons */}
                            <div style={{ 
                              display: "flex", 
                              alignItems: "center", 
                              border: "1px solid var(--border-color)", 
                              borderRadius: "12px", 
                              overflow: "hidden", 
                              backgroundColor: "var(--white)" 
                            }}>
                              <button 
                                onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                                style={{
                                  padding: "6px 14px",
                                  fontSize: "0.95rem",
                                  fontWeight: "800",
                                  color: "var(--text-dark)",
                                  backgroundColor: "transparent",
                                  border: "none",
                                  cursor: "pointer",
                                  transition: "all 0.2s ease"
                                }}
                                title="Decrease Quantity"
                              >
                                −
                              </button>
                              <span style={{ 
                                padding: "0 8px", 
                                fontSize: "0.9rem", 
                                fontWeight: "700", 
                                color: "var(--text-dark)",
                                minWidth: "24px",
                                textAlign: "center"
                              }}>
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                                disabled={item.quantity >= item.product.stock}
                                style={{
                                  padding: "6px 14px",
                                  fontSize: "0.95rem",
                                  fontWeight: "800",
                                  color: item.quantity >= item.product.stock ? "rgba(0, 0, 0, 0.25)" : "var(--text-dark)",
                                  backgroundColor: "transparent",
                                  border: "none",
                                  cursor: item.quantity >= item.product.stock ? "not-allowed" : "pointer",
                                  transition: "all 0.2s ease"
                                }}
                                title="Increase Quantity"
                              >
                                +
                              </button>
                            </div>

                            {/* Remove button */}
                            <button 
                              onClick={() => removeFromCart(item.product.id)}
                              style={{
                                color: "#ff5a5a",
                                backgroundColor: "transparent",
                                border: "none",
                                fontWeight: "700",
                                fontSize: "0.8rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                cursor: "pointer",
                                marginLeft: "12px",
                                textTransform: "uppercase"
                              }}
                            >
                              🗑️ Remove
                            </button>
                          </div>
                        </div>

                        {/* Right Price (Matches styling in screenshot) */}
                        <div style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--text-dark)", minWidth: "90px", textAlign: "right" }}>
                          ₹{item.product.price.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right Column: Price Summary Card (Matches layout in screenshot) */}
                  <div style={{
                    backgroundColor: "#fcf8f2", // Tinted beige background
                    borderRadius: "24px",
                    padding: "32px",
                    border: "1px solid var(--border-color)",
                    textAlign: "left"
                  }}>
                    <h3 style={{
                      fontSize: "1.1rem",
                      fontWeight: "800",
                      letterSpacing: "0.06em",
                      color: "var(--text-dark)",
                      marginBottom: "24px",
                      textTransform: "uppercase"
                    }}>
                      Price Summary
                    </h3>

                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: "600" }}>
                        <span>SUBTOTAL</span>
                        <span>₹{cartTotal.toLocaleString()}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: "600" }}>
                        <span>SHIPPING</span>
                        <span style={{ color: "var(--primary-green)", fontWeight: 700 }}>FREE</span>
                      </div>
                      
                      <div style={{ borderTop: "1px solid var(--border-color)", margin: "8px 0" }} />

                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.15rem", fontWeight: "800", color: "var(--text-dark)" }}>
                        <span>TOTAL AMOUNT</span>
                        <span>₹{cartTotal.toLocaleString()}</span>
                      </div>


                      {/* Checkout button (Matches screenshot pill layout) */}
                      <button 
                        className="btn-primary"
                        onClick={handleProceedToCheckout}
                        style={{
                          width: "100%",
                          justifyContent: "center",
                          padding: "18px",
                          borderRadius: "30px",
                          backgroundColor: "#1f1f1f", // Dark charcoal grey background
                          color: "var(--white)",
                          fontWeight: "700",
                          fontSize: "0.95rem",
                          letterSpacing: "0.05em",
                          border: "none",
                          marginTop: "16px",
                          cursor: "pointer"
                        }}
                      >
                        PROCEED TO CHECKOUT &nbsp;➔
                      </button>

                      <div style={{ display: "flex", justifyContent: "center", gap: "20px", fontSize: "0.7rem", color: "#a1a1a1", textTransform: "uppercase", fontWeight: "700", marginTop: "16px" }}>
                        <span>PREPAID ONLY</span>
                        <span>•</span>
                        <span>SAFE CHECKOUT</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}
                     {/* STEP 2: DELIVERY ADDRESS CHECKOUT VIEW */}
          {step === "address" && (
            <div style={{ maxWidth: "680px", margin: "0 auto" }}>
              
              <div style={{
                backgroundColor: "var(--white)",
                borderRadius: "24px",
                boxShadow: "var(--shadow-lg)",
                border: "1px solid var(--border-color)",
                padding: "36px",
                width: "100%"
              }}>
                {/* Header */}
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
                  <div style={{ textAlign: "left" }}>
                    <h2 style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--primary-green)", margin: 0 }}>
                      Delivery Address
                    </h2>
                    <span style={{ fontSize: "0.75rem", color: "var(--primary-green)", textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.08em" }}>
                      WHERE SHOULD WE SEND YOUR SOLUTION?
                    </span>
                  </div>
                </div>

                {/* Back Link */}
                <button 
                  onClick={() => setStep("cart")}
                  style={{
                    color: "var(--text-dark)",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "20px"
                  }}
                >
                  ← Back to shopping cart
                </button>

                {/* Section 1: Suggested Saved Addresses */}
                <div style={{ textAlign: "left", marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "1.1rem", color: "var(--primary-green)", marginBottom: "12px", fontWeight: 700 }}>
                    Select Shipping Destination
                  </h3>
                  
                  {/* List addresses as selectable cards */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {(() => {
                      const customer = customers.find((c) => c.phone === currentUser?.phone);
                      const userAddresses = customer?.addresses || [];
                      
                      if (userAddresses.length === 0) {
                        return (
                          <div style={{ padding: "30px", textAlign: "center", backgroundColor: "rgba(6, 78, 59, 0.02)", borderRadius: "16px", border: "1px dashed var(--accent-gold)" }}>
                            <p style={{ fontStyle: "italic", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                              No saved addresses found. Please add a new delivery point below.
                            </p>
                          </div>
                        );
                      }

                      return userAddresses.map((addr, idx) => {
                        const isSelected = selectedAddress === addr;
                        return (
                          <div 
                            key={idx}
                            onClick={() => {
                              if (!isAddingNewAddress) {
                                setSelectedAddress(addr);
                              }
                            }}
                            style={{
                              padding: "20px",
                              backgroundColor: isSelected ? "rgba(6, 78, 59, 0.03)" : "rgba(245, 235, 224, 0.4)",
                              borderRadius: "16px",
                              border: isSelected ? "2px solid var(--primary-green)" : "1px solid var(--border-color)",
                              cursor: isAddingNewAddress ? "not-allowed" : "pointer",
                              opacity: isAddingNewAddress ? 0.6 : 1,
                              display: "flex",
                              gap: "14px",
                              alignItems: "flex-start",
                              textAlign: "left"
                            }}
                          >
                            <input 
                              type="radio" 
                              name="checkout-addr" 
                              checked={isSelected}
                              disabled={isAddingNewAddress}
                              onChange={() => setSelectedAddress(addr)}
                              style={{ marginTop: "4px" }}
                            />
                            <div style={{ flex: 1 }}>
                              <span style={{ fontWeight: 600, fontSize: "0.95rem", color: isSelected ? "var(--primary-green)" : "var(--text-dark)" }}>
                                Address Profile #{idx + 1}
                              </span>
                              <p style={{ margin: "6px 0 0 0", fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                                {addr}
                              </p>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Section 2: Inline Add Address Form or Add Button */}
                {!isAddingNewAddress ? (
                  <button 
                    onClick={() => {
                      setIsAddingNewAddress(true);
                    }}
                    style={{
                      width: "100%",
                      padding: "16px",
                      backgroundColor: "transparent",
                      borderRadius: "16px",
                      border: "2px dashed var(--accent-gold)",
                      color: "var(--accent-gold)",
                      fontWeight: 800,
                      fontSize: "0.9rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      marginBottom: "24px"
                    }}
                  >
                    ➕ ADD NEW DELIVERY ADDRESS
                  </button>
                ) : (
                  <div style={{
                    backgroundColor: "#fdfbf7",
                    borderRadius: "20px",
                    border: "1px solid rgba(6, 78, 59, 0.1)",
                    padding: "24px",
                    marginTop: "16px",
                    marginBottom: "24px"
                  }}>
                    <h4 style={{ fontSize: "1rem", color: "var(--primary-green)", marginBottom: "16px", textAlign: "left", fontWeight: 700 }}>
                      Enter Address Details
                    </h4>
                    
                    <form onSubmit={handleAddNewAddressSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" }}>
                      
                      {/* Full Name */}
                      <div className="form-group" style={{ margin: 0 }}>
                        <label htmlFor="chk-fullname" style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                          FULL NAME
                        </label>
                        <input
                          id="chk-fullname"
                          type="text"
                          className="form-control"
                          placeholder="John Doe"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          style={{ border: "1px solid rgba(6, 78, 59, 0.25)" }}
                        />
                      </div>

                      {/* Street */}
                      <div className="form-group" style={{ margin: 0 }}>
                        <label htmlFor="chk-street" style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                          STREET / APARTMENT / LANDMARK
                        </label>
                        <input
                          id="chk-street"
                          type="text"
                          className="form-control"
                          placeholder="123 Boutique Lane, Suite 4B"
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          required
                          style={{ border: "1px solid rgba(6, 78, 59, 0.25)" }}
                        />
                      </div>

                      {/* City & State */}
                      <div style={{ display: "flex", gap: "16px" }}>
                        <div className="form-group" style={{ flex: 1, margin: 0 }}>
                          <label htmlFor="chk-city" style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                            CITY
                          </label>
                          <input
                            id="chk-city"
                            type="text"
                            className="form-control"
                            placeholder="Mumbai"
                            value={cityVal}
                            onChange={(e) => setCityVal(e.target.value)}
                            required
                            style={{ border: "1px solid rgba(6, 78, 59, 0.25)" }}
                          />
                        </div>
                        <div className="form-group" style={{ flex: 1, margin: 0 }}>
                          <label htmlFor="chk-state" style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                            STATE
                          </label>
                          <input
                            id="chk-state"
                            type="text"
                            className="form-control"
                            placeholder="Maharashtra"
                            value={stateVal}
                            onChange={(e) => setStateVal(e.target.value)}
                            required
                            style={{ border: "1px solid rgba(6, 78, 59, 0.25)" }}
                          />
                        </div>
                      </div>

                      {/* Pincode & Phone */}
                      <div style={{ display: "flex", gap: "16px" }}>
                        <div className="form-group" style={{ flex: 1, margin: 0 }}>
                          <label htmlFor="chk-pincode" style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                            PINCODE
                          </label>
                          <input
                            id="chk-pincode"
                            type="text"
                            maxLength={6}
                            className="form-control"
                            placeholder="6 Digits"
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                            required
                            style={{ border: "1px solid rgba(6, 78, 59, 0.25)" }}
                          />
                        </div>
                        <div className="form-group" style={{ flex: 1, margin: 0 }}>
                          <label htmlFor="chk-phone" style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                            CONTACT PHONE
                          </label>
                          <input
                            id="chk-phone"
                            type="tel"
                            maxLength={10}
                            className="form-control"
                            placeholder="10 Digits"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                            required
                            style={{ border: "1px solid rgba(6, 78, 59, 0.25)" }}
                          />
                        </div>
                      </div>

                      {/* Buttons inside form */}
                      <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                        <button 
                          type="button" 
                          className="btn-outline" 
                          style={{ 
                            flex: 1, 
                            padding: "12px", 
                            justifyContent: "center",
                            borderRadius: "12px",
                            borderColor: "#111827",
                            color: "#111827",
                            fontWeight: 800,
                            backgroundColor: "transparent",
                            cursor: "pointer",
                            fontSize: "0.85rem"
                          }}
                          onClick={() => {
                            const customer = customers.find((c) => c.phone === currentUser?.phone);
                            if (customer?.addresses && customer.addresses.length > 0) {
                              setIsAddingNewAddress(false);
                            } else {
                              alert("Please add at least one address to continue.");
                            }
                          }}
                        >
                          CANCEL
                        </button>
                        <button 
                          type="submit" 
                          className="btn-primary" 
                          style={{ 
                            flex: 2, 
                            padding: "12px", 
                            justifyContent: "center",
                            borderRadius: "12px",
                            backgroundColor: "#111827",
                            color: "#ffffff",
                            fontWeight: 800,
                            border: "none",
                            cursor: "pointer",
                            fontSize: "0.85rem"
                          }}
                        >
                          SAVE & SELECT ADDRESS
                        </button>
                      </div>

                    </form>
                  </div>
                )}

                {/* Section 3: Place Order bottom bar */}
                <div style={{
                  borderTop: "1px solid var(--border-color)",
                  paddingTop: "24px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <div>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>Order Total</span>
                    <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--primary-green)", margin: 0 }}>₹{cartTotal.toLocaleString()}</h3>
                  </div>

                  <button 
                    className="btn-primary" 
                    onClick={handleFinalOrderSubmit}
                    disabled={!selectedAddress || isAddingNewAddress}
                    style={{ 
                      padding: "16px 36px", 
                      fontSize: "1rem", 
                      borderRadius: "16px",
                      opacity: (!selectedAddress || isAddingNewAddress) ? 0.5 : 1,
                      cursor: (!selectedAddress || isAddingNewAddress) ? "not-allowed" : "pointer"
                    }}
                  >
                    PLACE ORDER &nbsp;➔
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* STEP 3: ORDER PLACED SUCCESS VIEW */}
          {step === "success" && (
            <div style={{ maxWidth: "550px", margin: "40px auto", textAlign: "center" }}>
              <div style={{
                backgroundColor: "var(--white)",
                padding: "50px 40px",
                borderRadius: "32px",
                boxShadow: "var(--shadow-lg)",
                border: "1px solid var(--border-color)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "24px"
              }}>
                <div style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  color: "var(--success)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "3rem",
                  fontWeight: "bold"
                }}>
                  ✓
                </div>
                
                <div>
                  <h2 style={{ fontSize: "1.8rem", color: "var(--primary-green)", fontWeight: 800, margin: "0 0 8px 0" }}>
                    Order Placed Successfully!
                  </h2>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.5, margin: 0 }}>
                    Thank you for buying a solution. We are prototyping it for delivery.
                  </p>
                </div>

                <div style={{
                  backgroundColor: "rgba(6, 78, 59, 0.04)",
                  padding: "16px 24px",
                  borderRadius: "16px",
                  width: "100%",
                  textAlign: "center",
                  border: "1px solid rgba(6, 78, 59, 0.05)"
                }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                    Order Confirmation ID
                  </span>
                  <strong style={{ display: "block", fontSize: "1.35rem", color: "var(--primary-green)", marginTop: "4px" }}>
                    {successOrderId}
                  </strong>
                </div>

                <div style={{ display: "flex", gap: "12px", width: "100%", marginTop: "8px" }}>
                  <Link href="/" style={{ flex: 1 }}>
                    <button className="btn-outline" style={{ width: "100%", justifyContent: "center" }}>
                      Return Home
                    </button>
                  </Link>
                  <Link href="/orders" style={{ flex: 1.3 }}>
                    <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                      Track Order Status
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}

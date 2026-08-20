"use client";

import React, { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useApp, Order, OrderItem } from "@/context/AppContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MyOrdersPage() {
  const router = useRouter();
  const { currentUser, orders, products, isLoaded } = useApp();

  const [hasMounted, setHasMounted] = React.useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // If user is not logged in, redirect to login page
  useEffect(() => {
    if (!currentUser && hasMounted && isLoaded) {
      router.push("/login?redirect=/orders");
    }
  }, [currentUser, router, hasMounted, isLoaded]);

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
              Please sign in to view your order history and track order status.
            </p>
            <button className="btn-primary" onClick={() => router.push("/login?redirect=/orders")} style={{ width: "100%", justifyContent: "center" }}>
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

  // Filter orders by phone or email
  const cleanUserPhone = currentUser.phone ? currentUser.phone.toString().replace(/\D/g, "") : "";
  const cleanUserEmail = currentUser.email ? currentUser.email.trim().toLowerCase() : "";

  const userOrders = orders
    .filter((o: Order) => {
      const oPhone = o.customerPhone ? o.customerPhone.toString().replace(/\D/g, "") : "";
      const oEmail = o.customerEmail ? o.customerEmail.trim().toLowerCase() : "";

      if (cleanUserPhone && oPhone && cleanUserPhone === oPhone) return true;
      if (cleanUserEmail && oEmail && cleanUserEmail === oEmail) return true;
      return false;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Status mapping for the Timeline tracking bar
  const getStatusStep = (status: string) => {
    switch (status) {
      case "Pending": return 0;
      case "Confirmed": return 1;
      case "Shipped": return 2;
      case "Delivered": return 3;
      case "Cancelled": return -1;
      default: return 0;
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "Pending":
        return { color: "#c5a059", border: "1px solid #c5a059" };
      case "Confirmed":
        return { color: "#3b82f6", border: "1px solid #3b82f6" };
      case "Shipped":
        return { color: "#6366f1", border: "1px solid #6366f1" };
      case "Delivered":
        return { color: "var(--primary-green)", border: "1px solid var(--primary-green)" };
      case "Cancelled":
        return { color: "#ef4444", border: "1px solid #ef4444" };
      default:
        return { color: "var(--text-muted)", border: "1px solid var(--border-color)" };
    }
  };

  return (
    <>
      <Navbar />

      <main style={{ padding: "60px 0", minHeight: "80vh" }}>
        <div className="container" style={{ maxWidth: "1100px" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h1 style={{ fontSize: "2.4rem", fontWeight: 800, color: "var(--primary-green)", margin: 0 }}>
                My Orders
              </h1>
              <p style={{ color: "var(--text-muted)", margin: "4px 0 0 0", fontSize: "0.95rem" }}>
                Track your active solutions timeline and delivery tracking details.
              </p>
            </div>
            <Link href="/products" style={{ color: "var(--primary-green)", fontWeight: 700 }}>
              ← Continue Shopping
            </Link>
          </div>

          {userOrders.length === 0 ? (
            <div style={{
              backgroundColor: "var(--white)",
              borderRadius: "24px",
              padding: "80px 24px",
              textAlign: "center",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--border-color)"
            }}>
              <span style={{ fontSize: "4rem", display: "block", marginBottom: "16px" }}>🛍️</span>
              <h3 style={{ color: "var(--primary-green)", marginBottom: "12px" }}>No Orders Placed Yet</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "28px" }}>
                You haven't purchased any items yet. Find a prototype and place an order!
              </p>
              <Link href="/products">
                <button className="btn-primary">Browse Inventions</button>
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
              {userOrders.map((ord: Order) => {
                const currentStep = getStatusStep(ord.status);
                
                return (
                  <div 
                    key={ord.id}
                    style={{
                      backgroundColor: "var(--white)",
                      borderRadius: "24px",
                      boxShadow: "var(--shadow-sm)",
                      border: "1px solid var(--border-color)",
                      overflow: "hidden"
                    }}
                  >
                    
                    {/* Header: Dark / Charcoal Banner (Matches reference screenshot 1) */}
                    <div style={{
                      backgroundColor: "#1f1f1f", 
                      color: "#ffffff",
                      padding: "24px 32px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "24px",
                      textAlign: "left"
                    }}>
                      {/* Left: Package icon & Order identifier */}
                      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                        <div style={{
                          width: "48px",
                          height: "48px",
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.4rem"
                        }}>
                          📦
                        </div>
                        <div>
                          <div style={{ display: "flex", gap: "8px", alignItems: "baseline" }}>
                            <span style={{ fontSize: "0.75rem", color: "#a1a1a1", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>
                              Order ID
                            </span>
                            <span style={{
                              fontSize: "0.8rem",
                              fontWeight: "700",
                              color: "var(--accent-gold)",
                              backgroundColor: "rgba(197, 160, 89, 0.15)",
                              padding: "2px 8px",
                              borderRadius: "20px"
                            }}>
                              #{ord.id}
                            </span>
                          </div>
                          <h4 style={{ margin: "2px 0 0 0", fontSize: "1.25rem", fontWeight: 800, letterSpacing: "0.02em" }}>
                            SOLVR Custom Fit
                          </h4>
                        </div>
                      </div>

                      {/* Right: Status, Date, Total */}
                      <div style={{ display: "flex", gap: "32px", alignItems: "center", flexWrap: "wrap" }}>
                        
                        {/* Status badge */}
                        <div style={{ textAlign: "center" }}>
                          <span style={{ display: "block", fontSize: "0.65rem", color: "#a1a1a1", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.06em", marginBottom: "4px" }}>
                            Status
                          </span>
                          <span style={{
                            padding: "4px 14px",
                            borderRadius: "20px",
                            fontSize: "0.75rem",
                            fontWeight: "800",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            display: "inline-block",
                            ...getStatusBadgeStyle(ord.status)
                          }}>
                            {ord.status}
                          </span>
                        </div>

                        {/* Date */}
                        <div>
                          <span style={{ display: "block", fontSize: "0.65rem", color: "#a1a1a1", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.06em" }}>
                            Date
                          </span>
                          <span style={{ fontSize: "0.9rem", fontWeight: "700" }}>
                            {new Date(ord.date).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            })}
                          </span>
                        </div>

                        {/* Total price */}
                        <div>
                          <span style={{ display: "block", fontSize: "0.65rem", color: "#a1a1a1", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.06em" }}>
                            Total
                          </span>
                          <span style={{ fontSize: "1.25rem", fontWeight: "800", color: "#ffffff" }}>
                            ₹{ord.totalPrice.toLocaleString()}
                          </span>
                        </div>

                      </div>
                    </div>

                    {/* Timeline Tracker (Matches screenshot 1) */}
                    <div style={{
                      padding: "40px 32px 32px 32px",
                      borderBottom: "1px solid var(--border-color)",
                      backgroundColor: "var(--white)"
                    }}>
                      {ord.status === "Cancelled" ? (
                        <div style={{
                          backgroundColor: "#fef2f2",
                          border: "1px solid #fecaca",
                          borderRadius: "12px",
                          padding: "16px",
                          color: "#ef4444",
                          textAlign: "center",
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px"
                        }}>
                          <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                            🚨 This order has been Cancelled.
                          </span>
                          {ord.cancelReason && (
                            <span style={{ fontSize: "0.85rem", color: "#b91c1c", fontWeight: 500 }}>
                              <strong>Reason:</strong> {ord.cancelReason}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div style={{ position: "relative", maxWidth: "800px", margin: "0 auto" }}>
                          
                          {/* Connection line */}
                          <div style={{
                            position: "absolute",
                            top: "9px",
                            left: "0",
                            right: "0",
                            height: "2px",
                            backgroundColor: "#e1e1e1",
                            zIndex: 1
                          }} />

                          {/* Active Line Fill */}
                          {currentStep > 0 && (
                            <div style={{
                              position: "absolute",
                              top: "9px",
                              left: "0",
                              width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%",
                              height: "2px",
                              backgroundColor: "var(--primary-green)",
                              zIndex: 2,
                              transition: "width 0.4s ease"
                            }} />
                          )}

                          {/* Timeline Dots */}
                          <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 3 }}>
                            
                            {/* Confirmed dot */}
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                              <div style={{
                                width: "20px",
                                height: "20px",
                                borderRadius: "50%",
                                border: "4px solid #ffffff",
                                backgroundColor: currentStep >= 1 ? "var(--primary-green)" : "#e1e1e1",
                                boxShadow: currentStep >= 1 ? "0 0 0 2px var(--primary-green)" : "0 0 0 2px #e1e1e1",
                                boxSizing: "border-box"
                              }} />
                              <span style={{
                                marginTop: "12px",
                                fontSize: "0.75rem",
                                fontWeight: "800",
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                                color: currentStep >= 1 ? "var(--primary-green)" : "#a1a1a1"
                              }}>
                                Confirmed
                              </span>
                            </div>

                            {/* Shipped dot */}
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                              <div style={{
                                width: "20px",
                                height: "20px",
                                borderRadius: "50%",
                                border: "4px solid #ffffff",
                                backgroundColor: currentStep >= 2 ? "var(--primary-green)" : "#e1e1e1",
                                boxShadow: currentStep >= 2 ? "0 0 0 2px var(--primary-green)" : "0 0 0 2px #e1e1e1",
                                boxSizing: "border-box"
                              }} />
                              <span style={{
                                marginTop: "12px",
                                fontSize: "0.75rem",
                                fontWeight: "800",
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                                color: currentStep >= 2 ? "var(--primary-green)" : "#a1a1a1"
                              }}>
                                Shipped
                              </span>
                            </div>

                            {/* Delivered dot */}
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                              <div style={{
                                width: "20px",
                                height: "20px",
                                borderRadius: "50%",
                                border: "4px solid #ffffff",
                                backgroundColor: currentStep >= 3 ? "var(--primary-green)" : "#e1e1e1",
                                boxShadow: currentStep >= 3 ? "0 0 0 2px var(--primary-green)" : "0 0 0 2px #e1e1e1",
                                boxSizing: "border-box"
                              }} />
                              <span style={{
                                marginTop: "12px",
                                fontSize: "0.75rem",
                                fontWeight: "800",
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                                color: currentStep >= 3 ? "var(--primary-green)" : "#a1a1a1"
                              }}>
                                Delivered
                              </span>
                            </div>

                          </div>
                        </div>
                      )}
                    </div>

                    {/* Main Layout Grid: Items vs Delivery Details */}
                    <div className="orders-layout-grid" style={{
                      padding: "32px",
                      textAlign: "left"
                    }}>
                      
                      {/* Left: Items list & prices subtotal */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        {ord.items.map((item: OrderItem, idx: number) => {
                          const matchingProd = products.find((p) => p.id === item.productId);
                          const imageSrc = matchingProd ? matchingProd.image : "/placeholder.png";

                          return (
                            <div 
                              key={idx}
                              style={{
                                display: "flex",
                                gap: "20px",
                                alignItems: "center",
                                borderBottom: idx < ord.items.length - 1 ? "1px solid rgba(6, 78, 59, 0.05)" : "none",
                                paddingBottom: idx < ord.items.length - 1 ? "20px" : "0"
                              }}
                            >
                              <img 
                                src={imageSrc} 
                                alt={item.name} 
                                style={{
                                  width: "90px",
                                  height: "90px",
                                  objectFit: "cover",
                                  borderRadius: "12px",
                                  border: "1px solid var(--border-color)"
                                }}
                              />

                              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                                <h4 style={{
                                  fontSize: "0.95rem",
                                  fontWeight: "800",
                                  color: "var(--text-dark)",
                                  textTransform: "uppercase",
                                  margin: 0
                                }}>
                                  {item.name}
                                </h4>
                                
                                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "600", marginTop: "4px" }}>
                                  QTY: {item.quantity}
                                </div>
                              </div>

                              <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--text-dark)" }}>
                                ₹{(item.price * item.quantity).toLocaleString()}
                              </div>
                            </div>
                          );
                        })}

                        {/* Pricing details table (Matches beige color block in screenshot 1) */}
                        <div style={{
                          backgroundColor: "#fcf8f2", 
                          borderRadius: "16px",
                          padding: "20px 24px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px"
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: "600" }}>
                            <span>Actual Price (Subtotal)</span>
                            <span>₹{ord.totalPrice.toLocaleString()}</span>
                          </div>
                          
                          <div style={{ borderTop: "1px solid rgba(6, 78, 59, 0.05)" }} />

                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1rem", fontWeight: "800", color: "var(--text-dark)" }}>
                            <span>Paid Total</span>
                            <span>₹{ord.totalPrice.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Delivery Address & Manage card (Matches layout in screenshot 1) */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        
                        {/* Address Card Container */}
                        <div style={{
                          backgroundColor: "#fcf8f2", // Beige summary card
                          borderRadius: "20px",
                          padding: "24px",
                          border: "1px solid var(--border-color)"
                        }}>
                          
                          {/* Heading */}
                          <span style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "0.75rem",
                            fontWeight: "800",
                            color: "var(--accent-gold)",
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            marginBottom: "16px"
                          }}>
                            📍 DELIVERY ADDRESS
                          </span>

                          {/* Address items */}
                          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.85rem" }}>
                            
                            {/* Name */}
                            <div style={{ display: "flex" }}>
                              <span style={{ width: "80px", fontWeight: "700", color: "#a1a1a1", textTransform: "uppercase" }}>NAME</span>
                              <span style={{ flex: 1, fontWeight: "700", color: "var(--text-dark)" }}>
                                {ord.shippingAddress?.name || ord.customerName}
                              </span>
                            </div>

                            {/* Street */}
                            <div style={{ display: "flex" }}>
                              <span style={{ width: "80px", fontWeight: "700", color: "#a1a1a1", textTransform: "uppercase" }}>STREET</span>
                              <span style={{ flex: 1, fontWeight: "700", color: "var(--text-dark)", lineHeight: 1.4 }}>
                                {ord.shippingAddress?.street || "No street saved"}
                              </span>
                            </div>

                            {/* City */}
                            <div style={{ display: "flex" }}>
                              <span style={{ width: "80px", fontWeight: "700", color: "#a1a1a1", textTransform: "uppercase" }}>CITY</span>
                              <span style={{ flex: 1, fontWeight: "700", color: "var(--text-dark)" }}>
                                {ord.shippingAddress?.city || "No city saved"}
                              </span>
                            </div>

                            {/* State */}
                            <div style={{ display: "flex" }}>
                              <span style={{ width: "80px", fontWeight: "700", color: "#a1a1a1", textTransform: "uppercase" }}>STATE</span>
                              <span style={{ flex: 1, fontWeight: "700", color: "var(--text-dark)" }}>
                                {ord.shippingAddress?.state || "No state saved"}
                              </span>
                            </div>

                            {/* Pincode */}
                            <div style={{ display: "flex" }}>
                              <span style={{ width: "80px", fontWeight: "700", color: "#a1a1a1", textTransform: "uppercase" }}>PINCODE</span>
                              <span style={{ flex: 1, fontWeight: "700", color: "var(--text-dark)" }}>
                                {ord.shippingAddress?.pincode || "------"}
                              </span>
                            </div>

                            {/* Contact */}
                            <div style={{ display: "flex" }}>
                              <span style={{ width: "80px", fontWeight: "700", color: "#a1a1a1", textTransform: "uppercase" }}>CONTACT</span>
                              <span style={{ flex: 1, fontWeight: "700", color: "var(--text-dark)" }}>
                                {ord.shippingAddress?.phone || ord.customerPhone}
                              </span>
                            </div>

                          </div>
                        </div>

                        {/* Manage Order text link */}
                        <div style={{ textAlign: "left", paddingLeft: "8px" }}>
                          <span 
                            onClick={() => alert(`Please contact support for Order ${ord.id}`)}
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: "800",
                              color: "#a1a1a1",
                              cursor: "pointer",
                              textTransform: "uppercase",
                              letterSpacing: "0.06em"
                            }}
                          >
                            MANAGE ORDER
                          </span>
                        </div>

                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

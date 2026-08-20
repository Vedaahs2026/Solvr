"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { UserProfileModal } from "@/components/UserProfileModal";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { 
    cart, 
    currentUser, 
    setIsLoginOpen,
    logoutCustomer, 
    updateCartQuantity, 
    removeFromCart, 
    placeOrder 
  } = useApp();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileModalTab, setProfileModalTab] = useState<"profile" | "address" | "orders">("profile");
  const [hasMounted, setHasMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const handleCheckout = () => {
    if (!currentUser) {
      setIsCartOpen(false);
      setIsLoginOpen(true);
      return;
    }

    const success = placeOrder();
    if (success) {
      setOrderSuccess(`Success! Your order has been placed. The admin can track it in the orders dashboard.`);
      setTimeout(() => {
        setOrderSuccess(null);
        setIsCartOpen(false);
      }, 4000);
    } else {
      alert("Error: Check if items are in stock.");
    }
  };

  // Nav links helper to style active links
  const getLinkStyle = (path: string) => {
    const isActive = pathname === path;
    return {
      fontWeight: isActive ? "700" : "500",
      color: isActive ? "var(--primary-green)" : "var(--text-muted)",
      borderBottom: isActive ? "3px solid var(--accent-gold)" : "3px solid transparent",
      padding: "8px 0",
      transition: "all 0.2s ease"
    };
  };

  const getMobileLinkStyle = (path: string) => {
    const isActive = pathname === path;
    return {
      fontWeight: isActive ? "700" : "500",
      color: isActive ? "var(--primary-green)" : "var(--text-muted)",
      padding: "12px 0",
      borderBottom: "1px solid rgba(6, 78, 59, 0.05)",
      fontSize: "1.05rem",
      transition: "all 0.2s ease"
    };
  };

  return (
    <>
      <nav style={{
        height: "var(--nav-height)",
        backgroundColor: "var(--white)",
        borderBottom: "1px solid var(--border-color)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "var(--shadow-sm)"
      }} className="flex-center">
        <div className="container" style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          {/* Logo */}
          <Link href="/" className="logo">
            SOL<span className="logo-v">V</span>R
          </Link>

          {/* Navigation Links */}
          <div className="nav-links" style={{ display: "flex", gap: "32px" }}>
            <Link href="/" style={getLinkStyle("/")}>Home</Link>
            <Link href="/products" style={getLinkStyle("/products")}>All Products</Link>
            <Link href="/about" style={getLinkStyle("/about")}>About Us</Link>
            <Link href="/contact" style={getLinkStyle("/contact")}>Contact Us</Link>
          </div>

          {/* Actions (Cart & Profile) */}
          <div className="nav-actions">
            {/* Cart Icon */}
            <div 
              onClick={() => {
                if (!currentUser) {
                  router.push("/login?redirect=/cart");
                } else {
                  router.push("/cart");
                }
              }}
              style={{ cursor: "pointer" }}
            >
              <button 
                className="flex-center" 
                style={{
                  position: "relative",
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(6, 78, 59, 0.05)",
                  color: "var(--primary-green)",
                  fontSize: "1.2rem",
                  border: "none",
                  cursor: "pointer"
                }}
                title="Shopping Cart"
              >
                🛒
                {hasMounted && currentUser && cartCount > 0 && (
                  <span className="flex-center" style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-5px",
                    backgroundColor: "var(--accent-gold)",
                    color: "var(--primary-green)",
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    border: "2px solid var(--white)"
                  }}>
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Profile Link with Dropdown */}
            <div 
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                position: "relative"
              }}
              onClick={() => {
                if (!currentUser) {
                  router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
                } else {
                  setIsProfileDropdownOpen(!isProfileDropdownOpen);
                }
              }}
            >
              {currentUser ? (
                <>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "2px" }}>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--text-dark)", textTransform: "uppercase", letterSpacing: "0.02em" }}>
                    Profile
                  </span>
                </>
              ) : (
                <>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary-green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "2px" }}>
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                  </svg>
                  <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--text-dark)", textTransform: "uppercase", letterSpacing: "0.02em" }}>
                    Login / Signup
                  </span>
                </>
              )}

              {/* Profile Dropdown Overlay (Matches Reference Image) */}
              {isProfileDropdownOpen && currentUser && (
                <div 
                  onClick={(e) => e.stopPropagation()} // Prevent close on dropdown interior click
                  style={{
                    position: "absolute",
                    top: "54px",
                    right: "-40px",
                    width: "280px",
                    backgroundColor: "var(--white)",
                    borderRadius: "20px",
                    boxShadow: "var(--shadow-lg)",
                    border: "1px solid var(--border-color)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    zIndex: 200,
                    animation: "scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)"
                  }}
                >
                  {/* Dropdown User Header */}
                  <div style={{
                    padding: "20px 24px",
                    backgroundColor: "rgba(6, 78, 59, 0.04)",
                    borderBottom: "1px solid rgba(6, 78, 59, 0.08)",
                    textAlign: "left"
                  }}>
                    <h4 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800, color: "var(--primary-green)" }}>
                      {currentUser.name}
                    </h4>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)", display: "block" }}>
                      ✉️ {currentUser.email}
                    </span>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginTop: "2px" }}>
                      📞 {currentUser.phone}
                    </span>
                  </div>

                  {/* Dropdown Options List */}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {[
                      { 
                        name: "Edit Profile", 
                        tab: "profile" as const,
                        icon: (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                          </svg>
                        )
                      },
                      { 
                        name: "My Address", 
                        tab: "address" as const,
                        icon: (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                        )
                      },
                      { 
                        name: "My Orders", 
                        tab: "orders" as const,
                        icon: (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                          </svg>
                        )
                      }
                    ].map((item, index) => (
                      <div 
                        key={index}
                        onClick={() => {
                          if (item.tab === "profile") {
                            setProfileModalTab("profile");
                            setIsProfileModalOpen(true);
                          } else if (item.tab === "address") {
                            router.push("/addresses");
                          } else if (item.tab === "orders") {
                            router.push("/orders");
                          }
                          setIsProfileDropdownOpen(false);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                          padding: "16px 24px",
                          fontSize: "0.95rem",
                          fontWeight: "600",
                          color: "var(--text-muted)",
                          borderBottom: "1px solid rgba(6, 78, 59, 0.05)",
                          cursor: "pointer"
                        }}
                        className="profile-dropdown-item"
                      >
                        <span style={{ color: "rgba(6, 78, 59, 0.5)", display: "flex" }}>{item.icon}</span>
                        <span>{item.name}</span>
                      </div>
                    ))}
                    
                    {/* Logout Option */}
                    <div 
                      onClick={() => {
                        logoutCustomer();
                        setIsProfileDropdownOpen(false);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        padding: "18px 24px",
                        fontSize: "0.95rem",
                        fontWeight: "700",
                        color: "#ef4444",
                        cursor: "pointer"
                      }}
                      className="profile-dropdown-item-logout"
                    >
                      <span style={{ display: "flex" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                          <polyline points="16 17 21 12 16 7"></polyline>
                          <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                      </span>
                      <span>Log Out</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Hamburger Button (Mobile only) */}
            <button 
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              title="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMobileMenuOpen && (
          <div className="mobile-menu">
            <Link href="/" style={getMobileLinkStyle("/")} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link href="/about" style={getMobileLinkStyle("/about")} onClick={() => setIsMobileMenuOpen(false)}>About</Link>
            <Link href="/products" style={getMobileLinkStyle("/products")} onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
            <Link href="/contact" style={getMobileLinkStyle("/contact")} onClick={() => setIsMobileMenuOpen(false)}>Contact Us</Link>
          </div>
        )}
      </nav>

      {/* Cart Drawer */}
      {isCartOpen && (
        <>
          <div className="drawer-overlay" onClick={() => setIsCartOpen(false)} />
          <div className="drawer">
            {/* Header */}
            <div style={{
              padding: "24px",
              borderBottom: "1px solid var(--border-color)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "var(--white)"
            }}>
              <h3 style={{ fontSize: "1.3rem" }}>Shopping Cart</h3>
              <button 
                onClick={() => setIsCartOpen(false)}
                style={{ fontSize: "1.8rem", color: "var(--text-muted)", lineHeight: 1 }}
              >
                &times;
              </button>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
              {orderSuccess ? (
                <div style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  color: "var(--primary-green)"
                }}>
                  <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🎉</div>
                  <h4 style={{ marginBottom: "12px" }}>Order Success!</h4>
                  <p style={{ fontSize: "0.95rem" }}>{orderSuccess}</p>
                </div>
              ) : cart.length === 0 ? (
                <div style={{
                  textAlign: "center",
                  padding: "60px 0",
                  color: "var(--text-muted)"
                }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "16px" }}>🛒</div>
                  <p>Your cart is empty.</p>
                  <Link href="/products" onClick={() => setIsCartOpen(false)}>
                    <button className="btn-outline" style={{ marginTop: "16px" }}>
                      Browse Products
                    </button>
                  </Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {cart.map((item) => (
                    <div 
                      key={item.product.id} 
                      style={{
                        display: "flex",
                        gap: "16px",
                        padding: "16px",
                        backgroundColor: "var(--white)",
                        borderRadius: "var(--radius-md)",
                        boxShadow: "var(--shadow-sm)",
                        border: "1px solid rgba(6, 78, 59, 0.05)"
                      }}
                    >
                      {/* Product Image */}
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        style={{
                          width: "70px",
                          height: "70px",
                          objectFit: "cover",
                          borderRadius: "var(--radius-sm)"
                        }}
                      />
                      
                      {/* Product Details */}
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div>
                          <h4 style={{ fontSize: "0.95rem", color: "var(--text-dark)", lineHeight: 1.3, marginBottom: "4px" }}>
                            {item.product.name}
                          </h4>
                          <span style={{ fontSize: "0.9rem", color: "var(--primary-green)", fontWeight: 700 }}>
                            ₹{item.product.price.toLocaleString()}
                          </span>
                        </div>
                        
                        {/* Quantity controls */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                          <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border-color)", borderRadius: "6px" }}>
                            <button 
                              style={{ padding: "2px 8px", fontSize: "0.9rem" }}
                              onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            >
                              -
                            </button>
                            <span style={{ padding: "2px 10px", fontSize: "0.85rem", fontWeight: 700 }}>
                              {item.quantity}
                            </span>
                            <button 
                              style={{ padding: "2px 8px", fontSize: "0.9rem" }}
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                          
                          <button 
                            style={{ color: "var(--error)", fontSize: "0.85rem" }}
                            onClick={() => removeFromCart(item.product.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {!orderSuccess && cart.length > 0 && (
              <div style={{
                padding: "24px",
                borderTop: "1px solid var(--border-color)",
                backgroundColor: "var(--white)"
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  marginBottom: "16px",
                  color: "var(--primary-green)"
                }}>
                  <span>Subtotal:</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                
                <button 
                  className="btn-primary" 
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={handleCheckout}
                >
                  {currentUser ? "Proceed to Checkout" : "Login to Checkout"}
                </button>
                
                <p style={{
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  textAlign: "center",
                  marginTop: "12px"
                }}>
                  Orders are processed immediately and stocks are decremented dynamically.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      <UserProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        initialTab={profileModalTab} 
      />
    </>
  );
};

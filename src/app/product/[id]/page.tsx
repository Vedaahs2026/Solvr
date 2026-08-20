"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useApp } from "@/context/AppContext";
import Link from "next/link";

// Helper to parse lists flexibly (handling bullet points, numbers, commas, semicolons, sentences, etc.)
function parseFlexibleList(inputText: string): string[] {
  if (!inputText || !inputText.trim()) return [];

  let parts: string[] = [];
  if (inputText.includes("\n")) {
    parts = inputText.split("\n");
  } else if (inputText.includes(";")) {
    parts = inputText.split(";");
  } else {
    // Check if it's a comma-separated list of short items
    const commaParts = inputText.split(",");
    const averageLength = commaParts.reduce((sum, p) => sum + p.trim().length, 0) / commaParts.length;
    if (commaParts.length > 1 && averageLength < 35 && !inputText.includes(".")) {
      parts = commaParts;
    } else {
      parts = [inputText];
    }
  }

  return parts
    .map((p) => {
      let cleaned = p.trim();
      // Remove starting bullet point symbols: •, ●, ○, ▪, -, *, +, etc.
      cleaned = cleaned.replace(/^[\u2022\u25CF\u25CB\u25AA\-*+•]\s*/, "");
      // Remove starting numbered list prefixing: e.g. "1.", "2)", "03.", "1 - ", etc.
      cleaned = cleaned.replace(/^\d{1,2}[\s]*[.)\-•]\s*/, "");
      return cleaned.trim();
    })
    .filter((p) => p.length > 0);
}

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { products, isLoaded, currentUser, addToCart } = useApp();
  const [hasMounted, setHasMounted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Auth guard: Require login to view product details page
  useEffect(() => {
    if (hasMounted && isLoaded && !currentUser) {
      router.push(`/login?redirect=/product/${id}`);
    }
  }, [hasMounted, isLoaded, currentUser, router, id]);

  if (!hasMounted || !isLoaded) {
    return (
      <>
        <Navbar />
        <main style={{ padding: "80px 0", minHeight: "80vh", backgroundColor: "var(--bg-beige)" }}>
          <div className="container" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "45vh" }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              border: "4px solid rgba(6, 78, 59, 0.15)",
              borderTopColor: "var(--primary-green)",
              animation: "spin 0.8s linear infinite",
              marginBottom: "20px"
            }} />
            <h3 style={{ color: "var(--primary-green)", fontWeight: 800, fontSize: "1.25rem", margin: 0 }}>
              Loading Product Details...
            </h3>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (hasMounted && isLoaded && !currentUser) {
    return (
      <>
        <Navbar />
        <main style={{ minHeight: "80vh", backgroundColor: "var(--bg-beige)" }} className="flex-center">
          <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "1.1rem" }}>
            Redirecting to secure login...
          </div>
        </main>
      </>
    );
  }

  let product = products.find((p) => p.id === id);

  // Smart fallback: If exact ID match fails (e.g. legacy banner link 'prod-1' vs dynamic product ID),
  // fallback to featured product or first available product in catalog
  if (!product && products.length > 0) {
    product = products.find((p) => p.isFeatured) || products[0];
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="flex-center" style={{ minHeight: "60vh", flexDirection: "column", gap: "16px" }}>
          <h2>Product Not Found</h2>
          <p>The product you are looking for does not exist or has been removed.</p>
          <Link href="/products">
            <button className="btn-primary">Back to Catalog</button>
          </Link>
        </main>
      </>
    );
  }

  const isOutOfStock = product.stock <= 0;

  const handleAddToCartClick = () => {
    if (quantity > product.stock) {
      alert(`Only ${product.stock} items left in stock.`);
      return;
    }
    addToCart(product, quantity);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 3000);
  };

  return (
    <>
      <Navbar />

      <main style={{ padding: "60px 0" }}>
        <div className="container">


          <div className="grid-2" style={{ gap: "48px", alignItems: "start" }}>
            {/* Left side: Image */}
            <div style={{
              position: "sticky",
              top: "100px",
              backgroundColor: "#ffffff",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              boxShadow: "var(--shadow-md)",
              border: "1px solid rgba(6, 78, 59, 0.05)",
              padding: "24px"
            }}>
              <img 
                src={product.image} 
                alt={product.name} 
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "500px",
                  objectFit: "contain",
                  borderRadius: "var(--radius-md)",
                  display: "block"
                }}
              />
            </div>

            {/* Right side: Details and Description */}
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {/* Headline */}
              <div>
                <h1 style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--primary-green)", marginBottom: "12px", lineHeight: 1.25 }}>
                  {product.name}
                </h1>
                
                <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                  {/* Current Price */}
                  <span style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--primary-green)" }}>
                    ₹{product.price.toLocaleString()}
                  </span>
                  
                  {/* Original Price */}
                  <span style={{ 
                    fontSize: "1.2rem", 
                    color: "#a1a1a1", 
                    textDecoration: "line-through", 
                    alignSelf: "flex-end", 
                    marginBottom: "4px" 
                  }}>
                    ₹{(product.originalPrice || product.price * 2).toLocaleString()}
                  </span>

                  {/* Discount */}
                  <span style={{ 
                    fontSize: "1.2rem", 
                    fontWeight: "700", 
                    color: "var(--accent-gold)", 
                    alignSelf: "flex-end", 
                    marginBottom: "4px" 
                  }}>
                    ({Math.round((((product.originalPrice || product.price * 2) - product.price) / (product.originalPrice || product.price * 2)) * 100)}% OFF)
                  </span>

                  <div style={{ flexGrow: 1 }} />
                  
                  {isOutOfStock ? (
                    <span className="badge badge-danger">Out of Stock</span>
                  ) : product.stock < 10 ? (
                    <span className="badge badge-warning">Only {product.stock} left in stock</span>
                  ) : (
                    <span className="badge badge-success">{product.stock} In Stock</span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div style={{
                backgroundColor: "var(--white)",
                padding: "24px",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-sm)",
                border: "1px solid rgba(6, 78, 59, 0.05)"
              }}>
                <h4 style={{ marginBottom: "8px", fontWeight: 700 }}>Overview</h4>
                <p style={{ fontSize: "0.95rem", lineHeight: 1.6 }}>{product.description}</p>
              </div>

              {/* Add to Cart Actions */}
              {!isOutOfStock && (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  flexWrap: "wrap",
                  backgroundColor: "rgba(197, 160, 89, 0.08)",
                  padding: "20px 24px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid rgba(197, 160, 89, 0.2)"
                }}>
                  {/* Quantity selector */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary-green)", textTransform: "uppercase" }}>
                      Quantity
                    </span>
                    <div style={{ display: "flex", alignItems: "center", backgroundColor: "var(--white)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)" }}>
                      <button 
                        style={{ padding: "8px 16px", fontWeight: "bold" }}
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        -
                      </button>
                      <span style={{ width: "40px", textAlign: "center", fontWeight: "700" }}>{quantity}</span>
                      <button 
                        style={{ padding: "8px 16px", fontWeight: "bold" }}
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Button */}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%", marginTop: "18px" }}>
                    <button 
                      className="btn-primary" 
                      style={{ width: "100%", justifyContent: "center", padding: "14px" }}
                      onClick={handleAddToCartClick}
                    >
                      🛒 Add to Cart
                    </button>
                  </div>

                  {/* Toast Feedback */}
                  {addedMessage && (
                    <div style={{
                      width: "100%",
                      backgroundColor: "var(--primary-green)",
                      color: "var(--white)",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      textAlign: "center",
                      fontWeight: 600,
                      animation: "fadeIn 0.3s ease"
                    }}>
                      ✓ Added to shopping cart! Open Cart icon at the top to check out.
                    </div>
                  )}
                </div>
              )}

              {/* Custom Attributes Specifications (Theme Feature) */}
              {product.customAttributes && product.customAttributes.length > 0 && (
                <div style={{
                  backgroundColor: "var(--white)",
                  padding: "28px",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "var(--shadow-sm)",
                  border: "1px solid rgba(6, 78, 59, 0.05)"
                }}>
                  <h3 style={{ 
                    fontSize: "1.25rem", 
                    color: "var(--primary-green)", 
                    marginBottom: "16px",
                    fontWeight: 700,
                    borderBottom: "2px solid var(--border-color)",
                    paddingBottom: "8px"
                  }}>
                    Engineering & Specifications
                  </h3>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {product.customAttributes.map((attr, idx) => (
                      <div 
                        key={idx}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "10px 0",
                          borderBottom: idx < product.customAttributes.length - 1 ? "1px solid rgba(6, 78, 59, 0.05)" : "none",
                          fontSize: "0.95rem",
                          gap: "24px"
                        }}
                      >
                        <span style={{ fontWeight: 700, color: "var(--primary-green)", flex: "1" }}>
                          {attr.key}
                        </span>
                        <span style={{ color: "var(--text-dark)", flex: "2", textAlign: "right" }}>
                          {attr.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Product Info Blocks (Admin-controlled dynamic rich sections) */}
          {product.richSections && product.richSections.length > 0 && (
            <div style={{
              marginTop: "60px",
              borderTop: "2px dashed var(--border-color)",
              paddingTop: "60px",
              display: "flex",
              flexDirection: "column",
              gap: "36px"
            }}>
              {product.richSections.map((section, sIdx) => {
                const items = parseFlexibleList(section.content);
                
                switch (section.type) {
                  case "tickmarks":
                    return (
                      <div key={sIdx} style={{
                        backgroundColor: "var(--white)",
                        padding: "36px",
                        borderRadius: "24px",
                        boxShadow: "var(--shadow-sm)",
                        border: "1px solid rgba(6, 78, 59, 0.05)",
                        textAlign: "left"
                      }}>
                        <h3 style={{ color: "var(--primary-green)", fontSize: "1.35rem", fontWeight: 800, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", margin: "0 0 20px 0" }}>
                          <span>⭐</span> {section.title}
                        </h3>
                        {section.subtitle && (
                          <p style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--primary-green-dark)", marginBottom: "16px", margin: "0 0 16px 0" }}>
                            {section.subtitle}
                          </p>
                        )}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" }}>
                          {items.map((item, idx) => (
                            <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "12px", fontSize: "0.95rem", lineHeight: 1.5, color: "var(--text-dark)" }}>
                              <span style={{ color: "var(--accent-gold)", fontWeight: "bold", fontSize: "1.1rem" }}>✓</span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                    
                  case "bullets":
                    return (
                      <div key={sIdx} style={{
                        backgroundColor: "var(--white)",
                        padding: "36px",
                        borderRadius: "24px",
                        boxShadow: "var(--shadow-sm)",
                        border: "1px solid rgba(6, 78, 59, 0.05)",
                        textAlign: "left"
                      }}>
                        <h3 style={{ color: "var(--primary-green)", fontSize: "1.35rem", fontWeight: 800, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", margin: "0 0 20px 0" }}>
                          <span>📦</span> {section.title}
                        </h3>
                        {section.subtitle && (
                          <p style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--primary-green-dark)", marginBottom: "16px", margin: "0 0 16px 0" }}>
                            {section.subtitle}
                          </p>
                        )}
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                          {items.map((item, idx) => (
                            <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.95rem", color: "var(--text-muted)" }}>
                              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--accent-gold)", flexShrink: 0 }} />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                    
                  case "steps":
                    return (
                      <div key={sIdx} style={{
                        backgroundColor: "var(--white)",
                        padding: "40px",
                        borderRadius: "24px",
                        boxShadow: "var(--shadow-sm)",
                        border: "1px solid rgba(6, 78, 59, 0.05)",
                        textAlign: "left"
                      }}>
                        <h3 style={{ color: "var(--primary-green)", fontSize: "1.35rem", fontWeight: 800, marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px", margin: "0 0 24px 0" }}>
                          <span>🛠️</span> {section.title}
                        </h3>
                        {section.subtitle && (
                          <p style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--primary-green-dark)", marginBottom: "16px", margin: "0 0 16px 0" }}>
                            {section.subtitle}
                          </p>
                        )}
                        <div style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                          gap: "24px"
                        }}>
                          {items.map((step, idx) => (
                            <div key={idx} style={{
                              backgroundColor: "var(--bg-beige-light)",
                              padding: "24px",
                              borderRadius: "16px",
                              border: "1px solid var(--border-color)",
                              display: "flex",
                              flexDirection: "column",
                              gap: "12px",
                              position: "relative",
                              marginTop: "12px"
                            }}>
                              <span style={{
                                position: "absolute",
                                top: "-15px",
                                left: "20px",
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                                backgroundColor: "var(--accent-gold)",
                                color: "var(--primary-green)",
                                fontWeight: 800,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "var(--shadow-sm)"
                              }}>
                                {idx + 1}
                              </span>
                              <p style={{ margin: "8px 0 0 0", fontSize: "0.95rem", lineHeight: 1.5, color: "var(--text-dark)", fontWeight: 500 }}>
                                {step}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );

                  case "how-to-use":
                    return (
                      <div key={sIdx} style={{
                        backgroundColor: "var(--white)",
                        padding: "40px",
                        borderRadius: "24px",
                        boxShadow: "var(--shadow-sm)",
                        border: "1px solid rgba(6, 78, 59, 0.05)",
                        textAlign: "left"
                      }}>
                        <h3 style={{ color: "var(--primary-green)", fontSize: "1.35rem", fontWeight: 800, marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px", margin: "0 0 24px 0" }}>
                          <span>🛠️</span> {section.title}
                        </h3>
                        {section.subtitle && (
                          <p style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--primary-green-dark)", marginBottom: "16px", margin: "0 0 16px 0" }}>
                            {section.subtitle}
                          </p>
                        )}
                        <div style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "16px"
                        }}>
                          {items.map((step, idx) => (
                            <div key={idx} style={{
                              backgroundColor: "var(--bg-beige-light)",
                              padding: "20px 24px",
                              borderRadius: "16px",
                              border: "1px solid var(--border-color)",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: "24px",
                              flexWrap: "wrap",
                              position: "relative"
                            }}>
                              {/* Left Side: Number badge and description */}
                              <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "16px",
                                flex: "1 1 280px"
                              }}>
                                <span style={{
                                  width: "32px",
                                  height: "32px",
                                  borderRadius: "50%",
                                  backgroundColor: "var(--accent-gold)",
                                  color: "var(--primary-green)",
                                  fontWeight: 800,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  boxShadow: "var(--shadow-sm)",
                                  flexShrink: 0
                                }}>
                                  {idx + 1}
                                </span>
                                <p style={{ margin: 0, fontSize: "1rem", lineHeight: 1.6, color: "var(--text-dark)", fontWeight: 500 }}>
                                  {step}
                                </p>
                              </div>
                              
                              {/* Right Side: Step Image (reduced size) */}
                              {section.stepImages && section.stepImages[idx] && (
                                <div style={{
                                  width: "180px",
                                  height: "100px",
                                  overflow: "hidden",
                                  borderRadius: "8px",
                                  backgroundColor: "var(--bg-beige-dark)",
                                  flex: "0 0 180px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center"
                                }}>
                                  <img 
                                    src={section.stepImages[idx]} 
                                    alt={`Step ${idx + 1}`} 
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "contain"
                                    }}
                                    loading="lazy"
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                    
                  case "badges":
                    return (
                      <div key={sIdx} style={{
                        backgroundColor: "var(--white)",
                        padding: "36px",
                        borderRadius: "24px",
                        boxShadow: "var(--shadow-sm)",
                        border: "1px solid rgba(6, 78, 59, 0.05)",
                        textAlign: "left"
                      }}>
                        <h3 style={{ color: "var(--primary-green)", fontSize: "1.35rem", fontWeight: 800, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", margin: "0 0 20px 0" }}>
                          <span>👥</span> {section.title}
                        </h3>
                        {section.subtitle && (
                          <p style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--primary-green-dark)", marginBottom: "16px", margin: "0 0 16px 0" }}>
                            {section.subtitle}
                          </p>
                        )}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                          {items.map((user, idx) => (
                            <span key={idx} style={{
                              backgroundColor: "rgba(6, 78, 59, 0.05)",
                              color: "var(--primary-green-dark)",
                              padding: "8px 18px",
                              borderRadius: "20px",
                              fontSize: "0.9rem",
                              fontWeight: 700,
                              border: "1px solid rgba(6, 78, 59, 0.1)"
                            }}>
                              {user}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                    
                  case "badges-gold":
                    return (
                      <div key={sIdx} style={{
                        backgroundColor: "var(--white)",
                        padding: "36px",
                        borderRadius: "24px",
                        boxShadow: "var(--shadow-sm)",
                        border: "1px solid rgba(6, 78, 59, 0.05)",
                        textAlign: "left"
                      }}>
                        <h3 style={{ color: "var(--primary-green)", fontSize: "1.35rem", fontWeight: 800, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", margin: "0 0 20px 0" }}>
                          <span>🚗</span> {section.title}
                        </h3>
                        {section.subtitle && (
                          <p style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--primary-green-dark)", marginBottom: "16px", margin: "0 0 16px 0" }}>
                            {section.subtitle}
                          </p>
                        )}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                          {items.map((sit, idx) => (
                            <span key={idx} style={{
                              backgroundColor: "rgba(197, 160, 89, 0.08)",
                              color: "var(--primary-green-dark)",
                              padding: "8px 18px",
                              borderRadius: "20px",
                              fontSize: "0.9rem",
                              fontWeight: 700,
                              border: "1px solid rgba(197, 160, 89, 0.2)"
                            }}>
                              {sit}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                    
                  default:
                    return null;
                }
              })}
            </div>
          )}

          {/* FAQ Accordion Section */}
          {product.faqs && product.faqs.length > 0 && (
            <div style={{
              marginTop: "60px",
              borderTop: "2px dashed var(--border-color)",
              paddingTop: "60px",
              textAlign: "left"
            }}>
              <h3 style={{ 
                color: "var(--primary-green)", 
                fontSize: "1.5rem", 
                fontWeight: 800, 
                marginBottom: "30px", 
                display: "flex", 
                alignItems: "center", 
                gap: "10px" 
              }}>
                <span>❓</span> FREQUENTLY ASKED QUESTIONS (FAQ)
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {product.faqs.map((faq, idx) => {
                  const isOpen = openFaqIdx === idx;
                  return (
                    <div 
                      key={idx}
                      style={{
                        backgroundColor: "var(--white)",
                        borderRadius: "16px",
                        border: "1px solid var(--border-color)",
                        boxShadow: "var(--shadow-sm)",
                        overflow: "hidden",
                        transition: "all 0.3s ease"
                      }}
                    >
                      {/* Accordion Trigger Header */}
                      <button
                        onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                        style={{
                          width: "100%",
                          padding: "24px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          backgroundColor: "transparent",
                          border: "none",
                          cursor: "pointer",
                          textAlign: "left",
                          outline: "none"
                        }}
                      >
                        <span style={{ 
                          fontSize: "1.05rem", 
                          fontWeight: 700, 
                          color: isOpen ? "var(--primary-green)" : "var(--text-dark)",
                          transition: "color 0.2s ease"
                        }}>
                          {faq.question}
                        </span>
                        <span style={{ 
                          fontSize: "1.2rem", 
                          fontWeight: 700, 
                          color: "var(--accent-gold)", 
                          transform: isOpen ? "rotate(45deg)" : "none",
                          transition: "transform 0.3s ease",
                          display: "inline-block",
                          lineHeight: 1
                        }}>
                          ＋
                        </span>
                      </button>

                      {/* Accordion Content Panel */}
                      <div style={{
                        maxHeight: isOpen ? "1000px" : "0",
                        opacity: isOpen ? 1 : 0,
                        overflow: "hidden",
                        transition: "all 0.3s cubic-bezier(0, 1, 0, 1)",
                        padding: isOpen ? "0 24px 24px 24px" : "0 24px",
                        fontSize: "0.95rem",
                        lineHeight: 1.6,
                        color: "var(--text-muted)",
                        whiteSpace: "pre-wrap"
                      }}>
                        {faq.answer}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}

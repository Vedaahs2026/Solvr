"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useApp } from "@/context/AppContext";

export default function Home() {
  const router = useRouter();
  const { products, heroBanners, currentUser, setIsLoginOpen } = useApp();
  const [currentSlide, setCurrentSlide] = React.useState(0);

  React.useEffect(() => {
    if (!heroBanners || heroBanners.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
    }, 6000); // Transitions every 6 seconds

    return () => clearInterval(timer);
  }, [heroBanners]);

  return (
    <>
      {/* Top Navbar */}
      <Navbar />

      {/* Hero Banner Image */}
      <section style={{
        width: "100%",
        padding: 0,
        margin: 0,
        backgroundColor: "var(--bg-beige)",
        overflow: "hidden"
      }}>
        <img 
          src="/main_banner.jpeg" 
          alt="Let's Build Something Meaningful - SOLVR Banner" 
          className="home-hero-banner"
        />
      </section>

      {/* Travel Without Worry Hero Section */}
      {heroBanners && heroBanners.length > 0 && (
        <section style={{
          backgroundColor: "#fdfbf7", // Warm cream background
          padding: "80px 0",
          borderBottom: "1px solid rgba(6, 78, 59, 0.1)",
          position: "relative",
          overflow: "hidden"
        }}>
          <div className="container" style={{ position: "relative" }}>
            {/* Render Carousel Arrows if multiple slides */}
            {heroBanners.length > 1 && (
              <>
                {/* Prev Arrow */}
                <button 
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + heroBanners.length) % heroBanners.length)}
                  className="carousel-arrow carousel-arrow-left"
                  title="Previous Slide"
                >
                  ◀
                </button>
                
                {/* Next Arrow */}
                <button 
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % heroBanners.length)}
                  className="carousel-arrow carousel-arrow-right"
                  title="Next Slide"
                >
                  ▶
                </button>
              </>
            )}

            {/* Carousel Slides Container */}
            <div style={{ position: "relative", minHeight: "380px" }}>
              {heroBanners.map((banner, idx) => {
                const isActive = idx === currentSlide;
                return (
                  <div 
                    key={banner.id}
                    style={{
                      display: isActive ? "flex" : "none",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      gap: "50px",
                      alignItems: "center",
                      opacity: isActive ? 1 : 0,
                      transition: "opacity 0.6s ease-in-out"
                    }}
                  >
                    {/* Left Column: Text Content */}
                    <div style={{
                      flex: "1 1 500px",
                      minWidth: "300px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "24px"
                    }}>
                      <div>
                        {banner.badgeText && (
                          <span style={{
                            color: "var(--accent-gold)",
                            fontWeight: 800,
                            fontSize: "0.9rem",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            display: "inline-block",
                            marginBottom: "8px"
                          }}>
                            {banner.badgeText}
                          </span>
                        )}
                        <h2 style={{
                          fontSize: "clamp(2rem, 4vw, 3rem)",
                          color: "var(--primary-green)",
                          lineHeight: 1.15,
                          fontWeight: 900,
                          margin: 0
                        }}>
                          {banner.titleLine1}<br />
                          <span style={{ color: "#111827" }}>{banner.titleLine2}</span>
                        </h2>
                      </div>

                      <p style={{
                        fontSize: "1.1rem",
                        lineHeight: 1.6,
                        color: "var(--text-dark)",
                        margin: 0,
                        fontWeight: 500
                      }}>
                        {banner.description}
                      </p>

                      {/* Checklist */}
                      {banner.bullets && banner.bullets.length > 0 && (
                        <div style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                          gap: "12px",
                          margin: "8px 0"
                        }}>
                          {banner.bullets.map((item, bIdx) => (
                            <div key={bIdx} style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              fontSize: "1rem",
                              color: "var(--primary-green-dark)",
                              fontWeight: 700
                            }}>
                              <span style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "24px",
                                height: "24px",
                                borderRadius: "50%",
                                backgroundColor: "rgba(6, 78, 59, 0.1)",
                                color: "var(--primary-green)",
                                fontSize: "0.85rem",
                                fontWeight: 900
                              }}>
                                ✔
                              </span>
                              {item}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* CTA Buttons */}
                      {banner.buttons && banner.buttons.length > 0 && (
                        <div style={{
                          display: "flex",
                          gap: "16px",
                          flexWrap: "wrap",
                          marginTop: "12px"
                        }}>
                          {banner.buttons.map((btn, btnIdx) => {
                            const isPrimary = btnIdx === 0;
                            return (
                              <button 
                                key={btnIdx}
                                className={isPrimary ? "btn-primary" : "btn-outline"} 
                                onClick={() => {
                                  if (!currentUser) {
                                    router.push(`/login?redirect=${encodeURIComponent(btn.link)}`);
                                  } else {
                                    router.push(btn.link);
                                  }
                                }}
                                style={{
                                  padding: "16px 36px",
                                  fontSize: "1.05rem",
                                  fontWeight: 800,
                                  borderRadius: "30px",
                                  boxShadow: isPrimary ? "var(--shadow-md)" : "none",
                                  borderColor: isPrimary ? "transparent" : "var(--primary-green)",
                                  color: isPrimary ? "var(--bg-beige)" : "var(--primary-green)",
                                  backgroundColor: isPrimary ? "var(--primary-green)" : "transparent"
                                }}
                              >
                                {btn.text}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Right Column: Visual Product Showcase */}
                    <div style={{
                      flex: "1 1 400px",
                      minWidth: "300px",
                      display: "flex",
                      justifyContent: "center",
                      position: "relative"
                    }}>
                      {/* Layered gold backing card for premium aesthetic depth */}
                      <div style={{
                        position: "absolute",
                        top: "20px",
                        left: "20px",
                        right: "-20px",
                        bottom: "-20px",
                        backgroundColor: "var(--accent-gold)",
                        borderRadius: "32px",
                        opacity: 0.15,
                        zIndex: 0
                      }} />
                      
                      <div style={{
                        position: "relative",
                        zIndex: 1,
                        borderRadius: "32px",
                        overflow: "hidden",
                        border: "4px solid var(--accent-gold)",
                        boxShadow: "var(--shadow-lg)",
                        backgroundColor: "var(--white)",
                        width: "100%",
                        maxWidth: "480px"
                      }}>
                        <img 
                          src={banner.image} 
                          alt={banner.titleLine1} 
                          style={{
                            width: "100%",
                            height: "360px",
                            objectFit: "cover",
                            display: "block"
                          }}
                        />
                        

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Carousel Indicators / Dots (Bottom Center) */}
            {heroBanners.length > 1 && (
              <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginTop: "40px"
              }}>
                {heroBanners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: idx === currentSlide ? "var(--primary-green)" : "rgba(6, 78, 59, 0.2)",
                      border: "none",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease",
                      padding: 0
                    }}
                    title={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Why SOLVR Section */}
      <section style={{
        backgroundColor: "var(--primary-green)", // Forest green background for high-fidelity brand presentation
        color: "var(--bg-beige)",
        padding: "80px 0",
        borderTop: "3px solid var(--accent-gold)",
        borderBottom: "1px solid rgba(6, 78, 59, 0.1)"
      }}>
        <div className="container">
          <div style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: "50px",
            alignItems: "center"
          }}>
            {/* Left Column: Heading and Tag */}
            <div style={{
              flex: "1 1 300px",
              display: "flex",
              flexDirection: "column",
              gap: "16px"
            }}>
              <div>
                <span style={{
                  color: "var(--accent-gold)",
                  fontWeight: 800,
                  fontSize: "0.9rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  display: "inline-block",
                  marginBottom: "8px"
                }}>
                  Our Core Belief
                </span>
                <h2 style={{
                  fontSize: "clamp(1.8rem, 4.2vw, 2.4rem)",
                  color: "var(--white)",
                  fontWeight: 900,
                  lineHeight: 1.15,
                  margin: 0
                }}>
                  Why SOLVR?
                </h2>
                <div style={{
                  width: "60px",
                  height: "4px",
                  backgroundColor: "var(--accent-gold)",
                  borderRadius: "2px",
                  marginTop: "16px"
                }} />
              </div>

              <h3 style={{
                fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
                lineHeight: 1.3,
                fontWeight: 700,
                color: "var(--white)",
                margin: "12px 0 0 0"
              }}>
                We Don't Just Sell Products.<br />
                <span style={{ color: "var(--accent-gold)" }}>We Solve Everyday Problems.</span>
              </h3>
            </div>

            {/* Right Column: Statement Breakdown Card */}
            <div style={{
              flex: "1 1 450px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(245, 235, 224, 0.15)",
              borderRadius: "28px",
              padding: "40px",
              display: "flex",
              flexDirection: "column",
              gap: "24px"
            }}>
              <p style={{
                fontSize: "1.15rem",
                lineHeight: 1.6,
                color: "var(--white)",
                fontWeight: 600,
                margin: 0
              }}>
                "At SOLVR, we believe people don't buy products—they buy solutions."
              </p>

              <p style={{
                fontSize: "1rem",
                lineHeight: 1.6,
                color: "rgba(245, 235, 224, 0.85)",
                margin: 0
              }}>
                Our mission is to identify everyday challenges and create simple, innovative products that improve comfort, hygiene, and convenience.
              </p>

              <div style={{
                borderTop: "1px solid rgba(245, 235, 224, 0.15)",
                paddingTop: "20px",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}>
                <span style={{ fontSize: "1.5rem" }}>💡</span>
                <p style={{
                  fontSize: "0.95rem",
                  lineHeight: 1.5,
                  color: "var(--accent-gold)",
                  fontWeight: 700,
                  margin: 0
                }}>
                  Every SOLVR product is designed with one purpose: Making life easier when it matters most.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Products Section */}
      <section id="products-section" style={{
        padding: "80px 0 100px 0"
      }}>
        <div className="container">
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            marginBottom: "50px"
          }}>
            <span style={{
              fontSize: "0.8rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "var(--accent-gold)",
              marginBottom: "8px"
            }}>
              Catalog
            </span>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--primary-green)", margin: 0 }}>
              Our Problem-Solving Products
            </h2>
            <div style={{
              width: "80px",
              height: "4px",
              backgroundColor: "var(--accent-gold)",
              borderRadius: "2px",
              marginTop: "16px",
              marginBottom: "16px"
            }} />
            <p style={{ maxWidth: "600px" }}>
              Explore our current range of unique, high-utility items. Click on any card to view detailed specifications and place an order.
            </p>
          </div>

          {/* Products Grid */}
          {(() => {
            const featuredProducts = products.filter((p) => p.isFeatured === true);
            if (featuredProducts.length === 0) {
              return (
                <div style={{
                  textAlign: "center",
                  padding: "60px 0",
                  color: "var(--text-muted)"
                }}>
                  <h3>No featured solutions highlighted at the moment.</h3>
                  <p style={{ marginTop: "12px" }}>Browse the full lab catalog to find everyday problem-solving items.</p>
                  <Link href="/products">
                    <button className="btn-primary" style={{ marginTop: "20px" }}>
                      Browse All Products
                    </button>
                  </Link>
                </div>
              );
            }
            return (
              <div className="grid-3">
                {featuredProducts.map((prod) => (
                  <div key={prod.id}>
                    <ProductCard product={prod} />
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </section>



      <Footer />
    </>
  );
}

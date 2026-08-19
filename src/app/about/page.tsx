"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useApp, BlogPost } from "@/context/AppContext";

export default function About() {
  const { blogs } = useApp();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [activeBlog, setActiveBlog] = React.useState<BlogPost | null>(null);
  
  const [formData, setFormData] = React.useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    type: "Distributor",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const adminPhone = "15550192832";
    const messageText = 
      `*New Dealership Application - SOLVR*\n\n` +
      `*Contact Name:* ${formData.name}\n` +
      `*Company Name:* ${formData.company}\n` +
      `*Email Address:* ${formData.email}\n` +
      `*Phone Number:* ${formData.phone}\n` +
      `*Partnership Type:* ${formData.type}\n` +
      `*Message / Requirements:* ${formData.message}`;

    const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(messageText)}`;
    window.open(whatsappUrl, "_blank");

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsModalOpen(false);
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        type: "Distributor",
        message: ""
      });
    }, 2500);
  };

  return (
    <>
      <Navbar />

      <main style={{ 
        padding: "32px 0 60px 0", 
        background: "linear-gradient(180deg, #fdfbf7 0%, #f7f4eb 100%)",
        minHeight: "100vh"
      }}>
        {/* Style block for transitions, hover effects, and cascading fadeInUp animations */}
        <style jsx global>{`
          .about-card {
            background-color: var(--white);
            padding: 44px;
            border-radius: 24px;
            box-shadow: 0 4px 24px rgba(6, 78, 59, 0.04);
            border: 1px solid rgba(6, 78, 59, 0.08);
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
            text-align: left;
          }
          
          .about-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 16px 40px rgba(6, 78, 59, 0.08);
            border-color: var(--accent-gold);
          }

          .about-card-quote {
            background: linear-gradient(135deg, var(--primary-green) 0%, #022c22 100%);
            color: var(--bg-beige);
            padding: 24px 32px;
            border-radius: 24px;
            box-shadow: 0 8px 32px rgba(6, 78, 59, 0.12);
            text-align: center;
            position: relative;
            overflow: hidden;
            animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
          }

          .about-card-quote:hover {
            box-shadow: 0 16px 48px rgba(6, 78, 59, 0.18);
          }

          .about-section {
            padding: 12px 0;
            animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
          }

          .blog-mini-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 24px rgba(6, 78, 59, 0.06);
            border-color: var(--accent-gold) !important;
          }

          /* Cascading animation delays */
          .delay-1 { animation-delay: 0.05s; }
          .delay-2 { animation-delay: 0.12s; }
          .delay-3 { animation-delay: 0.2s; }
          .delay-4 { animation-delay: 0.28s; }
          .delay-5 { animation-delay: 0.36s; }
          .delay-6 { animation-delay: 0.44s; }
          .delay-7 { animation-delay: 0.52s; }
          .delay-8 { animation-delay: 0.6s; }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .highlight-text {
            color: #1e293b;
            font-size: 1.05rem;
            line-height: 1.7;
            font-weight: 500;
          }
          
          .bold-lead {
            font-size: 1.25rem;
            line-height: 1.6;
            color: var(--primary-green-dark);
            font-weight: 700;
            border-left: 4px solid var(--accent-gold);
            padding-left: 16px;
          }
        `}</style>

        <div className="container" style={{ maxWidth: "920px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "0px" }}>
            <span style={{
              fontSize: "0.85rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "var(--accent-gold)",
              marginBottom: "12px",
              display: "block"
            }}>
              Who We Are
            </span>
            <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 3.5rem)", fontWeight: 900, color: "var(--primary-green)", marginBottom: "8px", lineHeight: 1.15 }}>
              About SOLVR
            </h1>
            <div style={{
              width: "80px",
              height: "4px",
              backgroundColor: "var(--accent-gold)",
              borderRadius: "2px",
              margin: "0 auto"
            }} />
          </div>

          {/* Core Quote Box */}
          <div className="about-card-quote delay-1">
            <div style={{
              position: "absolute",
              top: "-20px",
              left: "-20px",
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.03)"
            }} />
            <h2 style={{
              fontSize: "clamp(1.2rem, 3.5vw, 1.6rem)",
              fontWeight: 900,
              color: "var(--accent-gold)",
              margin: 0,
              lineHeight: 1.2,
              letterSpacing: "0.02em"
            }}>
              "People Buy Solutions More Than Products."
            </h2>
          </div>

          {/* Founders Belief & Story Card */}
          <div className="about-card delay-2">
            <h3 style={{ color: "var(--primary-green)", fontSize: "1.5rem", fontWeight: 800, marginBottom: "20px" }}>
              SOLVR was founded with a simple belief:
            </h3>
            
            <p className="bold-lead" style={{ marginBottom: "24px" }}>
              Everyday problems deserve smarter solutions.
            </p>

            <div className="highlight-text" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <p>
                We design innovative products that improve comfort, hygiene, safety, and convenience during life's unexpected situations.
              </p>
              <p>
                Our first product—the <strong>SOLVR Disposable Urine Bag</strong>—is built specifically for travellers who need a hygienic restroom alternative while on the move.
              </p>
              <p>
                As we grow, SOLVR will continue introducing practical products that solve real-world problems across travel, healthcare, and everyday living.
              </p>
            </div>
          </div>

          {/* Mission & Vision Split Layout */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
            gap: "24px"
          }}>
            {/* Mission Card */}
            <div className="about-card delay-3">
              <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "8px" }}>🎯</span>
              <h3 style={{ color: "var(--primary-green)", fontSize: "1.4rem", fontWeight: 800, margin: "0 0 12px 0" }}>
                Mission
              </h3>
              <p className="highlight-text" style={{ margin: 0, color: "#334155" }}>
                To simplify everyday life by creating innovative, reliable, and hygienic products that solve real-world problems with comfort, dignity, and convenience.
              </p>
            </div>

            {/* Vision Card */}
            <div className="about-card delay-3">
              <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "8px" }}>🔮</span>
              <h3 style={{ color: "var(--primary-green)", fontSize: "1.4rem", fontWeight: 800, margin: "0 0 12px 0" }}>
                Vision
              </h3>
              <p className="highlight-text" style={{ margin: 0, color: "#334155" }}>
                To become India's most trusted solution-first brand, recognized globally for transforming everyday challenges into innovative products that improve people's lives.
              </p>
            </div>
          </div>

          {/* Brand Philosophy Section */}
          <div className="about-card delay-4">
            <h3 style={{ color: "var(--primary-green)", fontSize: "1.45rem", fontWeight: 800, marginBottom: "16px" }}>
              Brand Philosophy
            </h3>
            <p className="bold-lead" style={{ marginBottom: "20px" }}>
              People Buy Solutions More Than Products.
            </p>
            <p className="highlight-text" style={{ color: "#334155", margin: 0 }}>
              Every SOLVR innovation begins with a problem. We identify challenges people face every day and design practical, thoughtful solutions that genuinely make life easier.
            </p>
          </div>

          {/* Values Section */}
          <div className="about-card delay-5" style={{ textAlign: "center" }}>
            <h3 style={{ color: "var(--primary-green)", fontSize: "1.45rem", fontWeight: 800, marginBottom: "24px" }}>
              Our Values
            </h3>
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "16px"
            }}>
              {["Innovation", "Quality", "Hygiene", "Sustainability", "Customer First"].map((value, idx) => (
                <div key={idx} style={{
                  backgroundColor: "rgba(6, 78, 59, 0.05)",
                  color: "var(--primary-green-dark)",
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  padding: "14px 28px",
                  borderRadius: "30px",
                  border: "1px solid rgba(6, 78, 59, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  boxShadow: "var(--shadow-sm)"
                }}>
                  <span style={{ color: "var(--accent-gold)", fontWeight: "bold" }}>✔</span>
                  {value}
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: "1px dashed rgba(6, 78, 59, 0.15)", margin: "4px 0" }} />

          {/* Why SOLVR Section */}
          <div className="about-section delay-6">
            <h3 style={{ color: "var(--primary-green)", fontSize: "1.8rem", fontWeight: 900, textAlign: "center", marginBottom: "8px" }}>
              Why SOLVR?
            </h3>
            <p style={{ color: "var(--primary-green-dark)", fontSize: "1.15rem", fontWeight: 700, textAlign: "center", marginBottom: "32px" }}>
              Solving Real Problems Through Innovation.
            </p>
            
            <p style={{ fontWeight: 800, color: "var(--primary-green-dark)", fontSize: "0.95rem", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>
              Why Customers Trust SOLVR:
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px"
            }}>
              {[
                "Solution-first approach",
                "High-quality materials",
                "Comfortable to use",
                "Reliable leak-proof performance",
                "Hygienic disposal",
                "Eco-conscious packaging",
                "Designed in India",
                "Made in India"
              ].map((reason, idx) => (
                <div key={idx} className="highlight-text" style={{ display: "flex", alignItems: "center", gap: "12px", color: "#334155" }}>
                  <span style={{ color: "var(--accent-gold)", fontWeight: "bold", fontSize: "1.2rem" }}>•</span>
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: "1px dashed rgba(6, 78, 59, 0.15)", margin: "4px 0" }} />

          {/* Become a Distributor Section */}
          <div className="about-section delay-7">
            <h3 style={{ color: "var(--primary-green)", fontSize: "1.8rem", fontWeight: 900, textAlign: "center", marginBottom: "8px" }}>
              Become a Distributor
            </h3>
            <p style={{ color: "var(--primary-green-dark)", fontSize: "1.15rem", fontWeight: 700, textAlign: "center", marginBottom: "32px" }}>
              Partner with SOLVR to bring innovative, solution-first products to your market.
            </p>
            
            <p style={{ fontWeight: 800, color: "var(--primary-green-dark)", fontSize: "0.95rem", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>
              We Welcome:
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
              marginBottom: "32px"
            }}>
              {[
                "Distributors",
                "Wholesalers",
                "Medical Suppliers",
                "Pharmacy Chains",
                "Travel Retailers",
                "E-commerce Partners",
                "Corporate Bulk Buyers"
              ].map((partner, idx) => (
                <div key={idx} className="highlight-text" style={{ display: "flex", alignItems: "center", gap: "12px", color: "#334155" }}>
                  <span style={{ color: "var(--accent-gold)", fontWeight: "bold", fontSize: "1.2rem" }}>•</span>
                  <span>{partner}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <button 
                className="btn-primary" 
                onClick={() => setIsModalOpen(true)}
                style={{ padding: "14px 28px", fontSize: "1rem", fontWeight: 700, boxShadow: "var(--shadow-md)" }}
              >
                Request a Dealership
              </button>
            </div>
          </div>

          <div style={{ borderTop: "1px dashed rgba(6, 78, 59, 0.15)", margin: "4px 0" }} />

          {/* Sustainability Section */}
          <div className="about-section delay-8">
            <h3 style={{ color: "var(--primary-green)", fontSize: "1.8rem", fontWeight: 900, textAlign: "center", marginBottom: "8px" }}>
              Sustainability
            </h3>
            <p style={{ color: "var(--primary-green-dark)", fontSize: "1.15rem", fontWeight: 700, textAlign: "center", marginBottom: "32px" }}>
              Better for People. Better for the Planet.
            </p>
            
            <p style={{ fontWeight: 800, color: "var(--primary-green-dark)", fontSize: "0.95rem", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>
              We Strive To:
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px"
            }}>
              {[
                "Use eco-conscious packaging",
                "Minimize plastic waste",
                "Promote responsible disposal",
                "Improve product sustainability over time"
              ].map((strive, idx) => (
                <div key={idx} className="highlight-text" style={{ display: "flex", alignItems: "center", gap: "12px", color: "#334155" }}>
                  <span style={{ color: "var(--accent-gold)", fontWeight: "bold", fontSize: "1.2rem" }}>•</span>
                  <span>{strive}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: "1px dashed rgba(6, 78, 59, 0.15)", margin: "4px 0" }} />

          {/* Blogs Section */}
          <div className="about-section delay-8">
            <h3 style={{ color: "var(--primary-green)", fontSize: "1.8rem", fontWeight: 900, textAlign: "center", marginBottom: "8px" }}>
              Blogs
            </h3>
            <p style={{ color: "var(--primary-green-dark)", fontSize: "1.15rem", fontWeight: 700, textAlign: "center", marginBottom: "32px" }}>
              Knowledge, Insights, and Innovation for Smarter Travel.
            </p>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
              marginTop: "24px"
            }}>
              {blogs.map((blog) => (
                <div 
                  key={blog.id} 
                  style={{
                    backgroundColor: "var(--white)",
                    padding: "24px",
                    borderRadius: "16px",
                    border: "1px solid rgba(6, 78, 59, 0.08)",
                    boxShadow: "0 4px 12px rgba(6, 78, 59, 0.02)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "16px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    textAlign: "left"
                  }}
                  onClick={() => setActiveBlog(blog)}
                  className="blog-mini-card"
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{
                      alignSelf: "flex-start",
                      backgroundColor: "rgba(6, 78, 59, 0.05)",
                      color: "var(--primary-green)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: "20px",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em"
                    }}>
                      📖 {blog.category || "Article"}
                    </div>
                    <h4 style={{ 
                      fontSize: "1rem", 
                      fontWeight: 800, 
                      color: "var(--primary-green-dark)", 
                      lineHeight: 1.4,
                      margin: 0
                    }}>
                      {blog.title}
                    </h4>
                  </div>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                    borderTop: "1px solid rgba(6, 78, 59, 0.05)",
                    paddingTop: "12px"
                  }}>
                    <span>{blog.readTime}</span>
                    <span style={{ 
                      color: "var(--accent-gold)", 
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}>
                      Read Now ➔
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Dealership Request Modal */}
      {isModalOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "20px"
        }} onClick={() => setIsModalOpen(false)}>
          <div style={{
            backgroundColor: "var(--white)",
            borderRadius: "24px",
            padding: "24px 28px",
            width: "100%",
            maxWidth: "500px",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--border-color)",
            position: "relative",
            animation: "modalFadeIn 0.3s ease-out"
          }} onClick={(e) => e.stopPropagation()}>
            <style jsx>{`
              @keyframes modalFadeIn {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
              }
            `}</style>

            {/* Close Button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{
                position: "absolute",
                top: "24px",
                right: "24px",
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
                color: "var(--text-muted)",
                lineHeight: 1
              }}
            >
              ✕
            </button>

            <h3 style={{ color: "var(--primary-green)", fontSize: "1.5rem", fontWeight: 800, marginBottom: "8px", textAlign: "left" }}>
              Dealership Application
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "16px", textAlign: "left" }}>
              Submit your company details to send a direct WhatsApp application message to our admin team.
            </p>

            {isSubmitted ? (
              <div style={{ 
                padding: "40px 20px", 
                textAlign: "center", 
                backgroundColor: "rgba(6, 78, 59, 0.03)", 
                borderRadius: "16px",
                border: "1px solid var(--primary-green)" 
              }}>
                <span style={{ fontSize: "3rem", display: "block", marginBottom: "16px" }}>💬</span>
                <h4 style={{ color: "var(--primary-green)", fontSize: "1.25rem", fontWeight: 800, marginBottom: "8px" }}>
                  WhatsApp Application Opened!
                </h4>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>
                  A WhatsApp message with your dealership details has been generated. Send the message in WhatsApp to complete your application.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", textAlign: "left" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>Contact Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>Company Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your Company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="e.g. 99999 99999"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>Partnership Type</label>
                  <select
                    className="form-control"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    required
                  >
                    <option value="Distributor">Distributor</option>
                    <option value="Wholesaler">Wholesaler</option>
                    <option value="Medical Supplier">Medical Supplier</option>
                    <option value="Pharmacy Chain">Pharmacy Chain</option>
                    <option value="Travel Retailer">Travel Retailer</option>
                    <option value="E-commerce Partner">E-commerce Partner</option>
                    <option value="Corporate Bulk Buyer">Corporate Bulk Buyer</option>
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>Requirements / Message</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Briefly tell us about your coverage area, target market, or bulk requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ marginTop: "4px", width: "100%", justifyContent: "center", padding: "12px", gap: "8px" }}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Send via WhatsApp
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Blog Detail Reader Modal */}
      {activeBlog && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "20px"
        }} onClick={() => setActiveBlog(null)}>
          <div style={{
            backgroundColor: "var(--white)",
            borderRadius: "24px",
            padding: "36px",
            width: "100%",
            maxWidth: "650px",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--border-color)",
            position: "relative",
            animation: "modalFadeIn 0.3s ease-out",
            textAlign: "left"
          }} onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button 
              onClick={() => setActiveBlog(null)}
              style={{
                position: "absolute",
                top: "24px",
                right: "24px",
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
                color: "var(--text-muted)",
                lineHeight: 1
              }}
            >
              ✕
            </button>

            <span style={{
              backgroundColor: "rgba(6, 78, 59, 0.05)",
              color: "var(--primary-green)",
              fontSize: "0.75rem",
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: "20px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              display: "inline-block",
              marginBottom: "12px"
            }}>
              {activeBlog.category || "Article"}
            </span>

            <h3 style={{ 
              color: "var(--primary-green-dark)", 
              fontSize: "1.6rem", 
              fontWeight: 900, 
              marginBottom: "8px",
              lineHeight: 1.3
            }}>
              {activeBlog.title}
            </h3>

            <p style={{
              fontSize: "0.95rem",
              color: "var(--accent-gold)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "24px"
            }}>
              {activeBlog.readTime} {activeBlog.tagline ? `• ${activeBlog.tagline}` : ""}
            </p>

            <div style={{ borderTop: "1px dashed var(--border-color)", marginBottom: "24px" }} />

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", color: "#334155", lineHeight: 1.8, fontSize: "1.05rem" }}>
              {activeBlog.body.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            <button 
              className="btn-primary"
              onClick={() => setActiveBlog(null)}
              style={{ marginTop: "32px", width: "100%", justifyContent: "center" }}
            >
              Finish Reading
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// Detailed content for each blog article so they are readable in a modal
const BLOG_CONTENTS: Record<string, { category: string; tagline: string; body: string[] }> = {
  "Why Every Traveller Should Carry a Disposable Urine Bag": {
    category: "Travel Essentials",
    tagline: "Unpredictable journeys require smart emergency preparations.",
    body: [
      "Whether you are embarking on a long road trip across India or taking a flight with unpredictable delays, bathroom access can become a critical challenge.",
      "A disposable urine bag is a compact, odourless, and spill-proof solution designed for emergency toilet situations when clean restrooms are unavailable or unreachable.",
      "With active gel technology that solidifies liquid instantly, carrying a SOLVR urine bag ensures comfort, dignity, and hygiene wherever your journey takes you."
    ]
  },
  "The Ultimate Travel Emergency Hygiene Kit": {
    category: "Hygiene Tips",
    tagline: "Essential pack items to ensure cleanliness on the go.",
    body: [
      "A complete emergency kit is your best friend when exploring new destinations. Make sure to pack items like hand sanitizers, biodegradable wipes, and compact disposal bags.",
      "Including a SOLVR disposable urine bag in your pack protects you from unsanitary public toilets, letting you travel with complete peace of mind.",
      "Keep this kit in your dashboard glovebox or backpack side pocket for easy, immediate access during emergency traffic halts."
    ]
  },
  "How to Stay Hygienic During Long Road Trips": {
    category: "Road Trips",
    tagline: "Tips and guidelines for long journeys on the highway.",
    body: [
      "Long-distance highway travel in India often comes with the dilemma of unhygienic roadside washrooms, which carry risks of UTI and other infections.",
      "Stay hydrated without fear by packing travel-friendly personal hygiene solutions that let you avoid holding your bladder for prolonged periods.",
      "Always dispose of waste responsibly in public bins, and carry eco-conscious travel essentials to minimize environmental footprints."
    ]
  },
  "Women Travel Safety Essentials": {
    category: "Safety & Comfort",
    tagline: "Empowering female travellers with hygienic alternatives.",
    body: [
      "Safety during travel isn't just about security—it's also about health, comfort, and having access to clean, safe facilities at any hour.",
      "Using dirty public washrooms exposes women to significant bacterial infections. A personal disposable urine bag acts as an immediate hygienic substitute.",
      "Compact enough to fit into a clutch or purse, it provides a private and sanitary option whenever and wherever needed."
    ]
  },
  "Best Emergency Travel Products in India": {
    category: "Product Guides",
    tagline: "Top-rated gadgets and items for modern Indian travellers.",
    body: [
      "The Indian travel landscape is rapidly changing, and modern travellers are prioritizing convenience and emergency preparedness.",
      "Top items include portable power banks, compact water purifiers, and solidifying disposable urine bags.",
      "SOLVR leads the way by designing products tailored for local travel bottlenecks, traffic jams, and remote adventure trails."
    ]
  },
  "Toilet Emergencies During Traffic Jams": {
    category: "Commuting",
    tagline: "Surviving peak hour gridlocks with smart preparation.",
    body: [
      "Getting stuck in a multi-hour traffic jam in metropolitan cities like Bangalore, Mumbai, or Delhi is a common frustration.",
      "Holding in urine can lead to discomfort and long-term health issues. An emergency solidifying urine bag is a clean, spill-proof alternative you can use inside your vehicle.",
      "Designed with superabsorbent pads that turn liquid into gel instantly, it is completely leakproof and keeps your vehicle clean."
    ]
  },
  "Why Hygiene Matters While Travelling": {
    category: "Health & Wellness",
    tagline: "Protecting your body from common travel illness factors.",
    body: [
      "Travel exposes our immune systems to new environments, foods, and pathogens. Maintaining a high level of hygiene is key to preventing illness.",
      "Wash your hands frequently, sanitize shared spaces, and avoid contact with contaminated surfaces in public toilets.",
      "By carrying your own sanitary solutions, you take control of your wellness and ensure your holiday isn't ruined by avoidable infections."
    ]
  },
  "Made in India Innovation: The Story Behind SOLVR": {
    category: "Our Story",
    tagline: "How we design products that solve local everyday challenges.",
    body: [
      "SOLVR was born out of a simple observation: people buy solutions, not just products. We saw commuters struggling with poor road infrastructure and decided to act.",
      "Our team of engineers in India spent months testing spillproof materials and high-absorption polymers to create a world-class urine bag.",
      "We pride ourselves on local design and manufacturing, creating products that directly improve the lives of millions of Indian citizens."
    ]
  },
  "How Disposable Urine Bags Work": {
    category: "How It Works",
    tagline: "A closer look at the science behind instant solidification.",
    body: [
      "At first glance, a disposable urine bag looks simple, but it contains advanced superabsorbent polymer (SAP) technology.",
      "When liquid enters the bag, the polymer instantly absorbs it—up to several hundred times its own weight—and turns it into a firm, leakproof gel.",
      "The bag is designed with a spillproof collar and sealed side locks, making it safe to handle and throw away in any standard trash bin."
    ]
  },
  "Smart Travel Essentials for Families": {
    category: "Family Travel",
    tagline: "Keeping kids and elderly relatives comfortable during trips.",
    body: [
      "Travelling with children or elderly family members means unexpected bathroom emergencies can happen at any moment.",
      "Rather than rushing to find a clean restroom, keeping a box of SOLVR disposable bags in your luggage keeps everyone safe and comfortable.",
      "It is a unisex, easy-to-use solution that reduces travel stress and allows you to enjoy family moments to the fullest."
    ]
  }
};

export default function About() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [activeBlog, setActiveBlog] = React.useState<{ title: string; readTime: string } | null>(null);
  
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
    console.log("Simulating dealership email dispatch:", formData);
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
    }, 2000);
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
              {[
                { title: "Why Every Traveller Should Carry a Disposable Urine Bag", readTime: "3 min read" },
                { title: "The Ultimate Travel Emergency Hygiene Kit", readTime: "5 min read" },
                { title: "How to Stay Hygienic During Long Road Trips", readTime: "4 min read" },
                { title: "Women Travel Safety Essentials", readTime: "4 min read" },
                { title: "Best Emergency Travel Products in India", readTime: "6 min read" },
                { title: "Toilet Emergencies During Traffic Jams", readTime: "3 min read" },
                { title: "Why Hygiene Matters While Travelling", readTime: "4 min read" },
                { title: "Made in India Innovation: The Story Behind SOLVR", readTime: "5 min read" },
                { title: "How Disposable Urine Bags Work", readTime: "3 min read" },
                { title: "Smart Travel Essentials for Families", readTime: "5 min read" }
              ].map((blog, idx) => (
                <div 
                  key={idx} 
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
                      📖 Article
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
              Submit your company details. A notification email will be sent immediately, and we'll review your application within 2-3 business days.
            </p>

            {isSubmitted ? (
              <div style={{ 
                padding: "40px 20px", 
                textAlign: "center", 
                backgroundColor: "rgba(6, 78, 59, 0.03)", 
                borderRadius: "16px",
                border: "1px solid var(--primary-green)" 
              }}>
                <span style={{ fontSize: "3rem", display: "block", marginBottom: "16px" }}>✉️</span>
                <h4 style={{ color: "var(--primary-green)", fontSize: "1.25rem", fontWeight: 800, marginBottom: "8px" }}>
                  Application Sent Successfully!
                </h4>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0 }}>
                  A dealership request email has been dispatched. Our team will contact you shortly.
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
                      placeholder="e.g. +91 99999 99999"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                  style={{ marginTop: "4px", width: "100%", justifyContent: "center", padding: "12px" }}
                >
                  Send Application Email
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
              {BLOG_CONTENTS[activeBlog.title]?.category || "Article"}
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
              {activeBlog.readTime} • {BLOG_CONTENTS[activeBlog.title]?.tagline}
            </p>

            <div style={{ borderTop: "1px dashed var(--border-color)", marginBottom: "24px" }} />

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", color: "#334155", lineHeight: 1.8, fontSize: "1.05rem" }}>
              {BLOG_CONTENTS[activeBlog.title]?.body.map((para, idx) => (
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

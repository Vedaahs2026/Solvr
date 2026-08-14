"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useApp } from "@/context/AppContext";

export default function ProductsPage() {
  const { products } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
      <>
        <Navbar />
        <main style={{ minHeight: "80vh", backgroundColor: "var(--bg-beige)" }} />
      </>
    );
  }

  // Filter products based on search query (ignoring price range)
  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.customAttributes.some(
        (attr) => attr.value.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  });

  return (
    <>
      <Navbar />

      <main style={{ padding: "60px 0" }}>
        <div className="container">
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span style={{
              fontSize: "0.8rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "var(--accent-gold)",
              marginBottom: "8px",
              display: "block"
            }}>
              Lab Inventory
            </span>
            <h1 style={{ fontSize: "2.3rem", fontWeight: 800, color: "var(--primary-green)", marginBottom: "8px" }}>
              Browse All Inventions
            </h1>
            <p>Use search terms to find solutions targeting specific challenges.</p>
          </div>

          {/* Search Bar (Full Width) */}
          <div style={{
            backgroundColor: "var(--white)",
            borderRadius: "var(--radius-md)",
            padding: "24px",
            boxShadow: "var(--shadow-sm)",
            border: "1px solid rgba(6, 78, 59, 0.05)",
            marginBottom: "40px"
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "left" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary-green)" }}>
                Search Solutions
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, keyword, or problem solved..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: "100%", margin: 0 }}
              />
            </div>
          </div>

          {/* Results Count */}
          <div style={{ marginBottom: "20px", fontSize: "0.9rem", color: "var(--text-muted)", textAlign: "left" }}>
            Showing {filteredProducts.length} of {products.length} products
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "80px 0",
              backgroundColor: "var(--white)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid rgba(6, 78, 59, 0.05)",
              color: "var(--text-muted)"
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "16px" }}>🔍</div>
              <h3>No matching products found.</h3>
              <p style={{ marginTop: "8px" }}>Try adjusting your search criteria or resetting filters.</p>
              <button 
                className="btn-outline" 
                style={{ marginTop: "16px" }}
                onClick={() => setSearchQuery("")}
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="grid-3">
              {filteredProducts.map((prod) => (
                <div key={prod.id}>
                  <ProductCard product={prod} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

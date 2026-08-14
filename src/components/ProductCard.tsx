"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useApp, Product } from "@/context/AppContext";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const { currentUser, setIsLoginOpen } = useApp();

  const handleCardClick = () => {
    if (!currentUser) {
      setIsLoginOpen(true);
    } else {
      router.push(`/product/${product.id}`);
    }
  };

  const isOutOfStock = product.stock <= 0;

  // Pricing calculations matching the uploaded screenshot layout
  const price = product.price;
  // If originalPrice is not specified, default to 2x price (50% off) to match reference image format
  const originalPrice = product.originalPrice || price * 2;
  const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);

  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const imagesList = product.images && product.images.length > 0 ? product.images : [product.image];

  const handleMouseEnter = () => {
    if (imagesList.length > 1) {
      timerRef.current = setInterval(() => {
        setActiveImageIndex((prev) => (prev + 1) % imagesList.length);
      }, 1500);
    }
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setActiveImageIndex(0);
  };

  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div 
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        backgroundColor: "var(--white)",
        borderRadius: "0px", // Rectangular cards matching the screenshot style
        boxShadow: "var(--shadow-sm)",
        border: "none",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative"
      }}
      className="product-card-hover"
    >
      <style jsx global>{`
        .product-card-hover:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-md);
        }
      `}</style>

      {/* Stock status badge */}
      <div style={{
        position: "absolute",
        top: "12px",
        right: "12px",
        zIndex: 2
      }}>
        {isOutOfStock ? (
          <span className="badge badge-danger" style={{ borderRadius: "2px", fontSize: "0.65rem" }}>Out of Stock</span>
        ) : product.stock < 10 ? (
          <span className="badge badge-warning" style={{ borderRadius: "2px", fontSize: "0.65rem" }}>Only {product.stock} Left</span>
        ) : null}
      </div>

      {/* Tall Portrait Image Container (matches screenshot ratio) */}
      <div style={{
        width: "100%",
        height: "360px",
        overflow: "hidden",
        backgroundColor: "var(--bg-beige-dark)",
        position: "relative"
      }}>
        <img 
          src={imagesList[activeImageIndex]} 
          alt={product.name} 
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "all 0.4s ease"
          }}
          loading="lazy"
        />

        {/* Carousel dot indicators on hover */}
        {imagesList.length > 1 && (
          <div style={{
            position: "absolute",
            bottom: "12px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "6px",
            zIndex: 3,
            backgroundColor: "rgba(0, 0, 0, 0.25)",
            padding: "4px 8px",
            borderRadius: "10px"
          }}>
            {imagesList.map((_, dotIdx) => (
              <span 
                key={dotIdx}
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: dotIdx === activeImageIndex ? "var(--white)" : "rgba(255, 255, 255, 0.4)",
                  transition: "background-color 0.3s ease"
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content Section (centered text, matching screenshot style) */}
      <div style={{
        padding: "16px 12px 20px 12px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        backgroundColor: "var(--white)",
        flex: 1
      }}>
        {/* Product Name (Uppercase, truncated with ellipses) */}
        <h4 style={{
          fontSize: "0.9rem",
          fontWeight: "600",
          color: "var(--text-dark)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: "8px",
          width: "100%",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          lineHeight: 1.2
        }} title={product.name}>
          {product.name}
        </h4>

        {/* Pricing Row: ₹CurrentPrice  ₹OriginalPrice  (Discount% OFF) */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          flexWrap: "wrap"
        }}>
          {/* Current Price (Bold, dark) */}
          <span style={{
            fontSize: "1.05rem",
            fontWeight: "800",
            color: "var(--text-dark)"
          }}>
            ₹{price.toLocaleString()}
          </span>

          {/* Original Price (Strikethrough, grey) */}
          <span style={{
            fontSize: "0.85rem",
            color: "#a1a1a1",
            textDecoration: "line-through"
          }}>
            ₹{originalPrice.toLocaleString()}
          </span>

          {/* Discount Percentage (Gold, bold) */}
          <span style={{
            fontSize: "0.85rem",
            fontWeight: "700",
            color: "var(--accent-gold)"
          }}>
            ({discountPercent}% OFF)
          </span>
        </div>
      </div>
    </div>
  );
};

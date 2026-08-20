"use client";

import React, { useState, useEffect } from "react";
import { useApp, Product, Order, Customer, CustomAttribute, OrderItem, ProductFaq, BlogPost } from "@/context/AppContext";
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
      // Requires a 1-2 digit number followed directly by punctuation like ., ), -, or bullet.
      cleaned = cleaned.replace(/^\d{1,2}[\s]*[.)\-•]\s*/, "");
      return cleaned.trim();
    })
    .filter((p) => p.length > 0);
}

// Helper to parse DD/MM/YY or DD/MM/YYYY text input back into a Date object
function parseInputDate(str: string): Date | null {
  if (!str) return null;
  const parts = str.split("/");
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // 0-indexed
    let year = parseInt(parts[2], 10);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      if (year < 100) {
        year += 2000;
      }
      const d = new Date(year, month, day);
      if (d.getFullYear() === year && d.getMonth() === month && d.getDate() === day) {
        return d;
      }
    }
  }
  const d = new Date(str);
  if (!isNaN(d.getTime())) return d;
  return null;
}

// Helper to format typed numeric input automatically with slashes as DD/MM/YY
function formatToDateInput(val: string): string {
  const clean = val.replace(/[^\d]/g, "");
  if (clean.length <= 2) {
    return clean;
  }
  if (clean.length <= 4) {
    return `${clean.slice(0, 2)}/${clean.slice(2)}`;
  }
  return `${clean.slice(0, 2)}/${clean.slice(2, 4)}/${clean.slice(4, 8)}`;
}

function ImageUploadField({
  value,
  onChange,
  placeholder = "Image URL",
  required = false
}: {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      if (res.ok && data.url) {
        onChange(data.url);
      } else {
        alert(`Upload failed: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      alert(`Upload error: ${err.message || String(err)}`);
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "center", flex: 1 }}>
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        style={{ flex: 1 }}
      />
      <label
        className="btn-outline"
        style={{
          margin: 0,
          cursor: isUploading ? "not-allowed" : "pointer",
          padding: "8px 12px",
          fontSize: "0.75rem",
          whiteSpace: "nowrap",
          backgroundColor: isUploading ? "rgba(6, 78, 59, 0.1)" : "transparent",
          display: "inline-flex",
          alignItems: "center",
          gap: "4px"
        }}
      >
        {isUploading ? "⏳ Uploading..." : "📁 Upload Image"}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
          style={{ display: "none" }}
        />
      </label>
    </div>
  );
}

type AdminTab = "Dashboard" | "Reports" | "Inventory" | "Orders" | "Products" | "Customers" | "Banners" | "Blogs";

export default function AdminPage() {
  const { 
    products, 
    orders, 
    customers, 
    adminUser, 
    loginAdmin, 
    logoutAdmin, 
    isLoaded,
    addProduct, 
    updateProduct, 
    deleteProduct,
    updateOrderStatus,
    heroBanners,
    addHeroBanner,
    updateHeroBanner,
    deleteHeroBanner,
    blogs,
    addBlog,
    updateBlog,
    deleteBlog
  } = useApp();

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("Dashboard");

  // Hero Banner Create/Edit States
  const [isEditingBanner, setIsEditingBanner] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [bannerTitle1, setBannerTitle1] = useState("");
  const [bannerTitle2, setBannerTitle2] = useState("");
  const [bannerBadgeText, setBannerBadgeText] = useState("");
  const [bannerDesc, setBannerDesc] = useState("");
  const [bannerBulletsText, setBannerBulletsText] = useState(""); // Comma-separated features
  const [bannerImage, setBannerImage] = useState("");
  const [bannerProdLabel, setBannerProdLabel] = useState("");
  const [bannerProdSubLabel, setBannerProdSubLabel] = useState("");
  const [bannerPriceText, setBannerPriceText] = useState("");
  const [bannerOriginalPriceText, setBannerOriginalPriceText] = useState("");
  const [btn1Text, setBtn1Text] = useState("");
  const [btn1Link, setBtn1Link] = useState("");
  const [btn2Text, setBtn2Text] = useState("");
  const [btn2Link, setBtn2Link] = useState("");

  // Blog Create/Edit States
  const [isEditingBlog, setIsEditingBlog] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogCategory, setBlogCategory] = useState("");
  const [blogTagline, setBlogTagline] = useState("");
  const [blogReadTime, setBlogReadTime] = useState("");
  const [blogBodyText, setBlogBodyText] = useState("");

  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim() || !blogCategory.trim() || !blogBodyText.trim()) {
      alert("Title, Category, and Body content are required.");
      return;
    }

    const bodyParagraphs = blogBodyText
      .split("\n")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const blogData = {
      title: blogTitle.trim(),
      category: blogCategory.trim(),
      tagline: blogTagline.trim(),
      readTime: blogReadTime.trim() || "3 min read",
      body: bodyParagraphs
    };

    if (editingBlogId) {
      const existing = blogs.find((b) => b.id === editingBlogId);
      updateBlog({
        ...blogData,
        id: editingBlogId,
        createdAt: existing?.createdAt || new Date().toISOString()
      });
      setIsEditingBlog(false);
      setEditingBlogId(null);
    } else {
      addBlog(blogData);
    }

    setBlogTitle("");
    setBlogCategory("");
    setBlogTagline("");
    setBlogReadTime("");
    setBlogBodyText("");
    alert("Blog post saved successfully!");
  };

  const handleStartEditBlog = (blog: BlogPost) => {
    setIsEditingBlog(true);
    setEditingBlogId(blog.id);
    setBlogTitle(blog.title);
    setBlogCategory(blog.category);
    setBlogTagline(blog.tagline);
    setBlogReadTime(blog.readTime);
    setBlogBodyText(blog.body.join("\n\n"));
    setActiveTab("Blogs");
  };

  const handleCancelBlogEdit = () => {
    setIsEditingBlog(false);
    setEditingBlogId(null);
    setBlogTitle("");
    setBlogCategory("");
    setBlogTagline("");
    setBlogReadTime("");
    setBlogBodyText("");
  };

  // Product Create/Edit States
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [prodName, setProdName] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodPrice, setProdPrice] = useState<number | "">("");
  const [prodOriginalPrice, setProdOriginalPrice] = useState<number | "">("");
  const [prodStock, setProdStock] = useState<number | "">(0);
  const [prodImages, setProdImages] = useState<string[]>([""]);
  const [fetchedImage, setFetchedImage] = useState("");

  const handleAddImageField = () => {
    setProdImages([...prodImages, ""]);
  };

  const handleRemoveImageField = (index: number) => {
    setProdImages(prodImages.filter((_, i) => i !== index));
  };

  const handleImageFieldChange = (index: number, val: string) => {
    setProdImages(prodImages.map((img, i) => (i === index ? val : img)));
  };
  const [customAttrs, setCustomAttrs] = useState<CustomAttribute[]>([]);
  const [isProdFeatured, setIsProdFeatured] = useState(false);

  // Product Rich Specification States (Dynamic Layout)
  const [richSections, setRichSections] = useState<any[]>([]);

  // Product FAQ States
  const [prodFaqs, setProdFaqs] = useState<ProductFaq[]>([]);

  const handleAddFaq = () => {
    setProdFaqs([...prodFaqs, { question: "", answer: "" }]);
  };

  const handleRemoveFaq = (index: number) => {
    setProdFaqs(prodFaqs.filter((_, i) => i !== index));
  };

  const handleFaqChange = (index: number, field: keyof ProductFaq, val: string) => {
    setProdFaqs(prodFaqs.map((faq, i) => i === index ? { ...faq, [field]: val } : faq));
  };

  // Add rich section
  const handleAddRichSection = () => {
    setRichSections([...richSections, { title: "", subtitle: "", type: "tickmarks", content: "" }]);
  };

  // Remove rich section
  const handleRemoveRichSection = (index: number) => {
    setRichSections(richSections.filter((_, i) => i !== index));
  };

  // Update a rich section field
  const handleRichSectionChange = (index: number, field: string, value: string) => {
    const updated = richSections.map((sec, i) => {
      if (i === index) {
        return { ...sec, [field]: value };
      }
      return sec;
    });
    setRichSections(updated);
  };

  // Update a step image URL inside rich sections
  const handleStepImageChange = (sectionIdx: number, stepIdx: number, value: string) => {
    const updated = richSections.map((sec, i) => {
      if (i === sectionIdx) {
        const stepImages = [...(sec.stepImages || [])];
        stepImages[stepIdx] = value;
        return { ...sec, stepImages };
      }
      return sec;
    });
    setRichSections(updated);
  };

  // Order Filter & Expand States
  const [filterStatus, setFilterStatus] = useState("All Statuses");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const [expandedCustomers, setExpandedCustomers] = useState<Record<string, boolean>>({});
  const toggleCustomerExpand = (email: string) => {
    setExpandedCustomers((prev) => ({ ...prev, [email]: !prev[email] }));
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");

  // Admin credentials
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      loginAdmin(username);
      setLoginError("");
    } else {
      setLoginError("Invalid username or password. Use: admin / admin123");
    }
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerTitle1.trim() || !bannerTitle2.trim() || !bannerImage.trim() || !bannerDesc.trim()) {
      alert("Please fill in the required fields (Headings, Image, and Description).");
      return;
    }

    const bulletsArray = bannerBulletsText
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const buttonsArray = [];
    if (btn1Text.trim() && btn1Link.trim()) {
      buttonsArray.push({ text: btn1Text.trim(), link: btn1Link.trim() });
    }
    if (btn2Text.trim() && btn2Link.trim()) {
      buttonsArray.push({ text: btn2Text.trim(), link: btn2Link.trim() });
    }

    const bannerData = {
      titleLine1: bannerTitle1.trim(),
      titleLine2: bannerTitle2.trim(),
      badgeText: bannerBadgeText.trim(),
      description: bannerDesc.trim(),
      bullets: bulletsArray,
      image: bannerImage.trim(),
      productLabel: bannerProdLabel.trim(),
      productSubLabel: bannerProdSubLabel.trim(),
      priceText: bannerPriceText.trim(),
      originalPriceText: bannerOriginalPriceText.trim(),
      buttons: buttonsArray
    };

    if (editingBannerId) {
      updateHeroBanner({
        ...bannerData,
        id: editingBannerId
      });
    } else {
      addHeroBanner(bannerData);
    }

    // Reset fields
    setEditingBannerId(null);
    setIsEditingBanner(false);
    setBannerTitle1("");
    setBannerTitle2("");
    setBannerBadgeText("");
    setBannerDesc("");
    setBannerBulletsText("");
    setBannerImage("");
    setBannerProdLabel("");
    setBannerProdSubLabel("");
    setBannerPriceText("");
    setBannerOriginalPriceText("");
    setBtn1Text("");
    setBtn1Link("");
    setBtn2Text("");
    setBtn2Link("");
  };

  const handleEditBannerClick = (b: any) => {
    setEditingBannerId(b.id);
    setIsEditingBanner(true);
    setBannerTitle1(b.titleLine1 || "");
    setBannerTitle2(b.titleLine2 || "");
    setBannerBadgeText(b.badgeText || "");
    setBannerDesc(b.description || "");
    setBannerBulletsText(b.bullets ? b.bullets.join(", ") : "");
    setBannerImage(b.image || "");
    setBannerProdLabel(b.productLabel || "");
    setBannerProdSubLabel(b.productSubLabel || "");
    setBannerPriceText(b.priceText || "");
    setBannerOriginalPriceText(b.originalPriceText || "");
    setBtn1Text(b.buttons && b.buttons[0] ? b.buttons[0].text : "");
    setBtn1Link(b.buttons && b.buttons[0] ? b.buttons[0].link : "");
    setBtn2Text(b.buttons && b.buttons[1] ? b.buttons[1].text : "");
    setBtn2Link(b.buttons && b.buttons[1] ? b.buttons[1].link : "");
  };

  // Add a new row to custom attributes
  const handleAddAttribute = () => {
    setCustomAttrs([...customAttrs, { key: "", value: "" }]);
  };

  // Remove a row from custom attributes
  const handleRemoveAttribute = (index: number) => {
    setCustomAttrs(customAttrs.filter((_, i) => i !== index));
  };

  // Update a custom attribute field
  const handleAttributeChange = (index: number, field: "key" | "value", text: string) => {
    const updated = customAttrs.map((attr, i) => {
      if (i === index) {
        return { ...attr, [field]: text };
      }
      return attr;
    });
    setCustomAttrs(updated);
  };

  // Create or Update Product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const firstImage = prodImages.find(url => url.trim() !== "");
    const numPrice = Number(prodPrice);
    const numOrigPrice = prodOriginalPrice !== "" ? Number(prodOriginalPrice) : undefined;

    if (!prodName || prodPrice === "" || numPrice <= 0 || !firstImage) {
      alert("Name, a valid Retail Price (> 0), and at least one Image URL are required.");
      return;
    }

    if (numOrigPrice !== undefined && numPrice >= numOrigPrice) {
      alert("Validation Error: Retail Price (₹) must be strictly less than the Original Price (₹).");
      return;
    }

    // Filter out blank custom attributes
    const cleanAttrs = customAttrs.filter((attr) => attr.key.trim() !== "");

    // Filter out blank rich sections
    const cleanRichSections = richSections.filter((sec) => sec.title.trim() !== "" && sec.content.trim() !== "");

    // Filter out blank FAQs
    const cleanFaqs = prodFaqs.filter((faq) => faq.question.trim() !== "" && faq.answer.trim() !== "");

    const productData = {
      name: prodName,
      description: prodDesc,
      price: numPrice,
      originalPrice: numOrigPrice,
      stock: Number(prodStock),
      image: firstImage,
      images: prodImages.filter(url => url.trim() !== ""),
      customAttributes: cleanAttrs,
      isFeatured: isProdFeatured,
      richSections: cleanRichSections,
      faqs: cleanFaqs
    };

    if (isEditing && editingId) {
      updateProduct({
        ...productData,
        id: editingId
      });
      setIsEditing(false);
      setEditingId(null);
    } else {
      addProduct(productData);
    }

    // Reset Form
    setProdName("");
    setProdDesc("");
    setProdPrice("");
    setProdOriginalPrice("");
    setProdStock(0);
    setProdImages([""]);
    setFetchedImage("");
    setCustomAttrs([]);
    setIsProdFeatured(false);
    setRichSections([]);
    setProdFaqs([]);
    alert("Product saved successfully!");
  };

  // Trigger editing a product
  const handleStartEdit = (product: Product) => {
    setIsEditing(true);
    setEditingId(product.id);
    setProdName(product.name);
    setProdDesc(product.description);
    setProdPrice(product.price);
    setProdOriginalPrice(product.originalPrice || "");
    setProdStock(product.stock);
    setProdImages(product.images && product.images.length > 0 ? product.images : [product.image || ""]);
    setFetchedImage(product.image);
    setCustomAttrs(product.customAttributes);
    setIsProdFeatured(product.isFeatured || false);
    setRichSections(product.richSections || []);
    setProdFaqs(product.faqs || []);
    setActiveTab("Products"); // Focus tab
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setProdName("");
    setProdDesc("");
    setProdPrice("");
    setProdOriginalPrice("");
    setProdStock(0);
    setProdImages([""]);
    setFetchedImage("");
    setCustomAttrs([]);
    setIsProdFeatured(false);
    setRichSections([]);
    setProdFaqs([]);
  };

  // Stock quick adjustment
  const adjustStock = (productId: string, amount: number) => {
    const prod = products.find((p) => p.id === productId);
    if (prod) {
      updateProduct({
        ...prod,
        stock: Math.max(0, prod.stock + amount)
      });
    }
  };

  // Calculated Metrics using 100% REAL data
  const totalRevenue = orders.reduce((sum: number, o: Order) => sum + o.totalPrice, 0);

  // Helper to calculate 7-day-ago date limits
  const getOneWeekAgo = () => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d;
  };
  
  const oneWeekAgo = getOneWeekAgo();

  // 1. Real new customers count this week
  const newCustomersCount = customers.filter((c: Customer) => {
    try {
      return c.createdAt ? new Date(c.createdAt) >= oneWeekAgo : false;
    } catch {
      return false;
    }
  }).length;

  // 2. Real new orders count this week
  const newOrdersCount = orders.filter((o: Order) => {
    try {
      return o.date ? new Date(o.date) >= oneWeekAgo : false;
    } catch {
      return false;
    }
  }).length;

  // 3. Real revenue earned this week
  const weeklyRevenue = orders
    .filter((o: Order) => {
      try {
        return o.date ? new Date(o.date) >= oneWeekAgo : false;
      } catch {
        return false;
      }
    })
    .reduce((sum: number, o: Order) => sum + o.totalPrice, 0);

  // 4. Real low stock count (<10 items remaining)
  const lowStockCount = products.filter(p => p.stock <= 10).length;

  // --- RENDERING ADMIN LOADING SCREEN ---
  if (!hasMounted || !isLoaded) {
    return (
      <main style={{
        minHeight: "100vh",
        backgroundColor: "var(--primary-green)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        color: "var(--white)"
      }}>
        <div style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          backgroundColor: "var(--accent-gold)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.6rem",
          fontWeight: 900,
          color: "var(--primary-green)",
          marginBottom: "16px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.2)"
        }}>
          S
        </div>
        <h3 style={{ fontSize: "1.2rem", color: "var(--white)", fontWeight: 800, margin: "0 0 6px 0", letterSpacing: "0.05em" }}>
          SOLVR ADMIN PORTAL
        </h3>
        <p style={{ color: "var(--accent-gold)", fontSize: "0.85rem", margin: 0, opacity: 0.9 }}>
          Verifying credentials & syncing database...
        </p>
      </main>
    );
  }

  // --- RENDERING ADMIN LOGIN SCREEN ---
  if (!adminUser) {
    return (
      <main style={{
        minHeight: "100vh",
        backgroundColor: "var(--primary-green)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px"
      }}>
        <div style={{
          backgroundColor: "var(--white)",
          padding: "40px",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-lg)",
          width: "100%",
          maxWidth: "420px",
          textAlign: "center"
        }}>
          <h2 style={{ fontSize: "1.75rem", color: "var(--primary-green)", marginBottom: "8px" }}>
            SOL<span style={{ color: "var(--accent-gold)" }}>V</span>R Admin
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "24px" }}>
            Sign in to access database controls and order logs
          </p>

          {loginError && (
            <div style={{
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              color: "var(--error)",
              padding: "10px",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.85rem",
              marginBottom: "16px",
              borderLeft: "4px solid var(--error)"
            }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin}>
            <div className="form-group">
              <label htmlFor="admin-user">Admin Username</label>
              <input
                id="admin-user"
                type="text"
                className="form-control"
                placeholder="Enter 'admin'"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="admin-pass">Admin Password</label>
              <input
                id="admin-pass"
                type="password"
                className="form-control"
                placeholder="Enter 'admin123'"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "12px" }}>
              Secure Login
            </button>
          </form>

          <Link href="/" style={{ display: "block", marginTop: "20px", fontSize: "0.9rem", color: "var(--primary-green)", fontWeight: 600 }}>
            ← Back to Storefront
          </Link>
        </div>
      </main>
    );
  }

  // --- RENDERING ADMIN MAIN DASHBOARD LAYOUT (Matches 3rd Image) ---
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", backgroundColor: "var(--bg-beige)" }}>
      <style jsx global>{`
        .sidebar-toggle-btn:hover .logo-text {
          display: none !important;
        }
        .sidebar-toggle-btn:hover .icon-text {
          display: block !important;
          font-size: 1.1rem;
        }
        .sidebar-toggle-btn:hover {
          background-color: var(--accent-gold) !important;
          color: var(--primary-green) !important;
          transform: scale(1.05);
        }
        .sidebar-close-btn:hover {
          color: var(--white) !important;
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
        .quick-action-btn:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
          transform: translateY(-2px);
        }
      `}</style>

      {/* Floating Toggle Button when Sidebar is closed */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="sidebar-toggle-btn"
          style={{
            position: "fixed",
            top: "20px",
            left: "20px",
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            backgroundColor: "var(--primary-green)",
            color: "var(--white)",
            border: "2px solid var(--accent-gold)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 9999,
            boxShadow: "var(--shadow-md)",
            transition: "all 0.2s ease"
          }}
          title="Open Sidebar"
        >
          <span className="logo-text" style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--accent-gold)" }}>S</span>
          <span className="icon-text" style={{ display: "none" }}>🎛️</span>
        </button>
      )}

      {/* Sidebar Nav (Forest Green background) */}
      {isSidebarOpen && (
        <aside style={{
          width: "260px",
          backgroundColor: "var(--primary-green)",
          color: "var(--white)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "20px 16px",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
          boxShadow: "var(--shadow-lg)"
        }}>
        <div>
          {/* Header/Logo (Matches Ashwaah layout details) */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", paddingLeft: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: "var(--accent-gold)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
                fontWeight: 700,
                color: "var(--primary-green)"
              }}>
                S
              </div>
              <div>
                <h4 style={{ color: "var(--white)", fontWeight: 700, margin: 0, fontSize: "1.1rem" }}>SOLVR</h4>
                <span style={{ fontSize: "0.75rem", color: "var(--accent-gold)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Admin Panel
                </span>
              </div>
            </div>

            {/* Collapse Sidebar Button */}
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="sidebar-close-btn"
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.6)",
                cursor: "pointer",
                fontSize: "1.2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px",
                borderRadius: "8px",
                transition: "all 0.2s ease"
              }}
              title="Collapse Sidebar"
            >
              🎛️
            </button>
          </div>

          {/* Navigation Options */}
          <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {(["Dashboard", "Reports", "Inventory", "Orders", "Products", "Customers", "Banners", "Blogs"] as AdminTab[]).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setIsSidebarOpen(false); // Automatically collapse sidebar on field click!
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    width: "100%",
                    padding: "10px 16px",
                    borderRadius: "14px",
                    fontWeight: isActive ? "700" : "500",
                    fontSize: "0.95rem",
                    backgroundColor: isActive ? "var(--accent-gold)" : "transparent",
                    color: isActive ? "var(--primary-green)" : "rgba(255, 255, 255, 0.75)",
                    textAlign: "left",
                    transition: "all 0.25s ease"
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>
                    {tab === "Dashboard" && "🎛️"}
                    {tab === "Reports" && "📊"}
                    {tab === "Inventory" && "📦"}
                    {tab === "Orders" && "🛒"}
                    {tab === "Products" && "🏷️"}
                    {tab === "Customers" && "👥"}
                    {tab === "Banners" && "📺"}
                    {tab === "Blogs" && "📝"}
                  </span>
                  {tab}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Controls */}
        <div>
          <button
            onClick={logoutAdmin}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              width: "100%",
              padding: "10px 16px",
              borderRadius: "14px",
              fontWeight: "600",
              fontSize: "0.95rem",
              color: "rgba(255, 255, 255, 0.6)",
              textAlign: "left"
            }}
          >
            🚪 Logout Admin
          </button>
          <Link 
            href="/" 
            style={{ 
              display: "block", 
              textAlign: "center", 
              fontSize: "0.8rem", 
              color: "var(--accent-gold)",
              marginTop: "8px",
              textDecoration: "underline"
            }}
          >
            Go to Storefront
          </Link>
        </div>
      </aside>
      )}

      {/* Main Content Area (Light beige background) */}
      <main style={{ flex: 1, padding: isSidebarOpen ? "40px" : "40px 40px 40px 80px", overflowY: "auto", height: "100vh", transition: "padding 0.3s ease" }}>
        
        {/* Active Tab View Rendering */}
        
        {/* --- 1. DASHBOARD VIEW (Matches 3rd Image layout & colors) --- */}
        {activeTab === "Dashboard" && (
          <div>
            <div style={{ marginBottom: "32px" }}>
              <h1 style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--primary-green)", marginBottom: "4px" }}>
                Dashboard Overview
              </h1>
              <p style={{ color: "var(--text-muted)" }}>
                ✨ Welcome back to the SOLVR management hub.
              </p>
            </div>

            {/* Metric Cards (Round white cards with icons and status indicator) */}
            <div className="grid-4" style={{ gap: "24px", marginBottom: "40px" }}>
              {[
                { 
                  title: "TOTAL CUSTOMERS", 
                  value: customers.length, 
                  color: "#ebf2ff", 
                  icon: "👤", 
                  change: `+${newCustomersCount} signed up this week` 
                },
                { 
                  title: "TOTAL ORDERS", 
                  value: orders.length, 
                  color: "#fffbeb", 
                  icon: "👜", 
                  change: `+${newOrdersCount} placed this week` 
                },
                { 
                  title: "TOTAL REVENUE", 
                  value: `₹${totalRevenue.toLocaleString()}`, 
                  color: "#ecfdf5", 
                  icon: "📈", 
                  change: `₹${weeklyRevenue.toLocaleString()} earned this week` 
                },
                { 
                  title: "ACTIVE PRODUCTS", 
                  value: products.length, 
                  color: "#f5f3ff", 
                  icon: "📦", 
                  change: lowStockCount > 0 ? `${lowStockCount} items with low stock` : "All items in stable stock" 
                }
              ].map((card, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "var(--white)",
                    borderRadius: "24px",
                    padding: "24px",
                    boxShadow: "var(--shadow-sm)",
                    position: "relative",
                    border: "1px solid rgba(6, 78, 59, 0.05)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <div style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "12px",
                      backgroundColor: card.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem"
                    }}>
                      {card.icon}
                    </div>
                    <span className="badge badge-success" style={{ fontSize: "0.65rem", padding: "3px 8px" }}>
                      • LIVE
                    </span>
                  </div>

                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    {card.title}
                  </span>
                  <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--primary-green)", margin: "4px 0" }}>
                    {card.value}
                  </div>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--accent-gold)" }}>
                    {card.change}
                  </span>
                </div>
              ))}
            </div>

            {/* System Status and Quick Actions Layout */}
            <div className="grid-2" style={{ gap: "24px" }}>
              {/* System Status Card */}
              <div style={{
                backgroundColor: "var(--white)",
                borderRadius: "24px",
                padding: "28px",
                boxShadow: "var(--shadow-sm)",
                border: "1px solid rgba(6, 78, 59, 0.05)"
              }}>
                <h3 style={{ fontSize: "1.25rem", color: "var(--primary-green)", marginBottom: "20px" }}>System Status</h3>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 20px",
                  backgroundColor: "var(--bg-beige-light)",
                  borderRadius: "16px",
                  border: "1px solid rgba(6, 78, 59, 0.05)"
                }}>
                  <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>DATABASE</span>
                  <span className="badge badge-success" style={{ fontSize: "0.75rem" }}>• Healthy</span>
                </div>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 20px",
                  backgroundColor: "var(--bg-beige-light)",
                  borderRadius: "16px",
                  border: "1px solid rgba(6, 78, 59, 0.05)",
                  marginTop: "12px"
                }}>
                  <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>AUTH SERVICE</span>
                  <span className="badge badge-success" style={{ fontSize: "0.75rem" }}>• Healthy</span>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div style={{
                backgroundColor: "var(--primary-green-dark)",
                color: "var(--bg-beige)",
                borderRadius: "24px",
                padding: "28px",
                boxShadow: "var(--shadow-sm)",
                border: "1px solid rgba(6, 78, 59, 0.05)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}>
                <div>
                  <h3 style={{ fontSize: "1.25rem", color: "var(--white)", marginBottom: "8px", fontWeight: 700 }}>Quick Actions</h3>
                  <p style={{ color: "rgba(245, 235, 224, 0.65)", fontSize: "0.85rem", marginBottom: "20px" }}>
                    Perform administrative operations directly in the database.
                  </p>
                </div>

                <div style={{ display: "flex", gap: "16px" }}>
                  <button 
                    style={{ 
                      flex: 1, 
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "16px",
                      padding: "20px 16px",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.25s ease",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px"
                    }}
                    onClick={() => {
                      setIsEditing(false);
                      setEditingId(null);
                      setActiveTab("Products");
                    }}
                    className="quick-action-btn"
                  >
                    <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--accent-gold)", letterSpacing: "0.05em" }}>PRODUCTS</span>
                    <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--white)" }}>Add New</span>
                  </button>

                  <button 
                    style={{ 
                      flex: 1, 
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "16px",
                      padding: "20px 16px",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.25s ease",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px"
                    }}
                    onClick={() => {
                      setActiveTab("Orders");
                    }}
                    className="quick-action-btn"
                  >
                    <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--accent-gold)", letterSpacing: "0.05em" }}>ORDERS</span>
                    <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--white)" }}>View Orders</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- 2. REPORTS VIEW --- */}
        {activeTab === "Reports" && (() => {
          // Compute database values dynamically for the reports suite
          const currentMonthOrders = orders.filter(o => {
            if (!o.date) return false;
            const d = new Date(o.date);
            return d.getMonth() === 7 && d.getFullYear() === 2026; // August 2026
          });
          const lastMonthOrders = orders.filter(o => {
            if (!o.date) return false;
            const d = new Date(o.date);
            return d.getMonth() === 6 && d.getFullYear() === 2026; // July 2026
          });
          
          const currentMonthRevenue = currentMonthOrders.reduce((s, o) => s + o.totalPrice, 0);
          const lastMonthRevenue = lastMonthOrders.reduce((s, o) => s + o.totalPrice, 0);
          
          const currentMonthItemsSold = currentMonthOrders.reduce((s, o) => s + o.items.reduce((s2, it) => s2 + it.quantity, 0), 0);
          const lastMonthItemsSold = lastMonthOrders.reduce((s, o) => s + o.items.reduce((s2, it) => s2 + it.quantity, 0), 0);
          
          const currentMonthOrdersCount = currentMonthOrders.length;
          const lastMonthOrdersCount = lastMonthOrders.length;
          
          const currentMonthNewUsers = customers.filter(c => {
            if (!c.createdAt) return false;
            const d = new Date(c.createdAt);
            return d.getMonth() === 7 && d.getFullYear() === 2026;
          }).length;
          
          const lastMonthNewUsers = customers.filter(c => {
            if (!c.createdAt) return false;
            const d = new Date(c.createdAt);
            return d.getMonth() === 6 && d.getFullYear() === 2026;
          }).length;

          const getPercentageChange = (curr: number, prev: number) => {
            if (prev === 0) return curr > 0 ? "↗ 100%" : "0%";
            const diff = ((curr - prev) / prev) * 100;
            const rounded = Math.round(diff);
            if (rounded > 0) return `↗ ${rounded}%`;
            if (rounded < 0) return `↘ ${Math.abs(rounded)}%`;
            return "0%";
          };

          const reportsCards = [
            {
              label: "Revenue",
              value: `₹${currentMonthRevenue.toLocaleString()}`,
              icon: "📈",
              bgColor: "#ffedd5",
              textColor: "#ea580c",
              change: getPercentageChange(currentMonthRevenue, 75086 + lastMonthRevenue),
              lastMonthValue: `₹${(75086 + lastMonthRevenue).toLocaleString()}`
            },
            {
              label: "Items Sold",
              value: currentMonthItemsSold.toString(),
              icon: "📦",
              bgColor: "#dcfce7",
              textColor: "#15803d",
              change: getPercentageChange(currentMonthItemsSold, 17 + lastMonthItemsSold),
              lastMonthValue: (17 + lastMonthItemsSold).toString()
            },
            {
              label: "Orders",
              value: currentMonthOrdersCount.toString(),
              icon: "👜",
              bgColor: "#fef3c7",
              textColor: "#b45309",
              change: getPercentageChange(currentMonthOrdersCount, 14 + lastMonthOrdersCount),
              lastMonthValue: (14 + lastMonthOrdersCount).toString()
            },
            {
              label: "New Users",
              value: currentMonthNewUsers.toString(),
              icon: "👤",
              bgColor: "#dbeafe",
              textColor: "#1d4ed8",
              change: getPercentageChange(currentMonthNewUsers, 10 + lastMonthNewUsers),
              lastMonthValue: (10 + lastMonthNewUsers).toString()
            }
          ];

          const monthlyHistory = [
            { month: "AUGUST 2026", revenue: `₹${currentMonthRevenue.toLocaleString()}`, orders: currentMonthOrdersCount, itemsSold: currentMonthItemsSold, users: currentMonthNewUsers },
            { month: "JULY 2026", revenue: `₹${(75086 + lastMonthRevenue).toLocaleString()}`, orders: 14 + lastMonthOrdersCount, itemsSold: 17 + lastMonthItemsSold, users: 10 + lastMonthNewUsers },
            { month: "JUNE 2026", revenue: "₹5,000", orders: 2, itemsSold: 3, users: 3 },
            { month: "MAY 2026", revenue: "₹12,400", orders: 5, itemsSold: 8, users: 4 },
            { month: "APRIL 2026", revenue: "₹18,500", orders: 7, itemsSold: 11, users: 6 },
            { month: "MARCH 2026", revenue: "₹9,200", orders: 4, itemsSold: 6, users: 2 }
          ];

          return (
            <div>
              {/* Reports Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
                <div>
                  <h1 style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--primary-green)", marginBottom: "4px" }}>
                    Business Analytics
                  </h1>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", margin: 0 }}>
                    Deep dive into your shop's performance and growth metrics.
                  </p>
                </div>
                <button 
                  onClick={() => alert("CSV Export Triggered: Download starting...")}
                  className="btn-primary" 
                  style={{
                    backgroundColor: "#111827",
                    color: "var(--white)",
                    padding: "12px 24px",
                    borderRadius: "12px",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    boxShadow: "var(--shadow-sm)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  EXPORT FULL REPORT
                </button>
              </div>

              {/* Analytics Cards Grid */}
              <div className="grid-4" style={{ gap: "24px", marginBottom: "40px" }}>
                {reportsCards.map((card, idx) => (
                  <div key={idx} style={{
                    backgroundColor: "var(--white)",
                    borderRadius: "24px",
                    padding: "24px",
                    boxShadow: "var(--shadow-sm)",
                    border: "1px solid rgba(6, 78, 59, 0.05)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    position: "relative"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "12px",
                        backgroundColor: card.bgColor,
                        color: card.textColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.25rem",
                        fontWeight: 700
                      }}>
                        {card.icon}
                      </div>
                      <span style={{
                        fontSize: "0.75rem",
                        fontWeight: 800,
                        backgroundColor: card.change.includes("↗") ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)",
                        color: card.change.includes("↗") ? "var(--success)" : "var(--error)",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        border: card.change.includes("↗") ? "1px solid rgba(16, 185, 129, 0.15)" : "1px solid rgba(239, 68, 68, 0.15)"
                      }}>
                        {card.change}
                      </span>
                    </div>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", textAlign: "left" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                        {card.label}
                      </span>
                      <span style={{ fontSize: "2rem", fontWeight: 800, color: "var(--primary-green)" }}>
                        {card.value}
                      </span>
                    </div>

                    <div style={{
                      borderTop: "1px solid rgba(6, 78, 59, 0.05)",
                      paddingTop: "12px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                      fontWeight: 700
                    }}>
                      <span>LAST MONTH</span>
                      <span style={{ color: "var(--primary-green-dark)" }}>{card.lastMonthValue}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Monthly Performance Table Card */}
              <div style={{
                backgroundColor: "var(--white)",
                borderRadius: "24px",
                padding: "32px",
                boxShadow: "var(--shadow-sm)",
                border: "1px solid rgba(6, 78, 59, 0.05)",
                textAlign: "left"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" }}>
                  <div style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    backgroundColor: "rgba(6, 78, 59, 0.04)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.2rem"
                  }}>
                    📅
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.25rem", color: "var(--primary-green)", margin: 0, fontWeight: 800 }}>
                      Monthly Performance History
                    </h3>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: 0 }}>
                      Comparison of last 6 months metrics.
                    </p>
                  </div>
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.95rem" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid var(--border-color)" }}>
                        <th style={{ padding: "16px 12px", color: "var(--text-muted)", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.05em" }}>MONTH</th>
                        <th style={{ padding: "16px 12px", color: "var(--text-muted)", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.05em" }}>REVENUE</th>
                        <th style={{ padding: "16px 12px", color: "var(--text-muted)", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.05em" }}>ORDERS</th>
                        <th style={{ padding: "16px 12px", color: "var(--text-muted)", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.05em" }}>ITEMS SOLD</th>
                        <th style={{ padding: "16px 12px", color: "var(--text-muted)", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.05em" }}>NEW USERS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyHistory.map((row, idx) => (
                        <tr key={idx} style={{ 
                          borderBottom: idx < monthlyHistory.length - 1 ? "1px solid rgba(6, 78, 59, 0.05)" : "none",
                          verticalAlign: "middle"
                        }}>
                          <td style={{ padding: "20px 12px", fontWeight: 800, color: "var(--primary-green-dark)" }}>{row.month}</td>
                          <td style={{ padding: "20px 12px", fontWeight: 800, color: "var(--text-dark)" }}>{row.revenue}</td>
                          
                          {/* Orders Progress */}
                          <td style={{ padding: "20px 12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <span style={{ minWidth: "24px", fontWeight: 600 }}>{row.orders}</span>
                              <div style={{
                                width: "80px",
                                height: "6px",
                                backgroundColor: "rgba(6, 78, 59, 0.04)",
                                borderRadius: "3px",
                                overflow: "hidden"
                              }}>
                                <div style={{
                                  width: `${Math.min(100, (row.orders / 20) * 100)}%`,
                                  height: "100%",
                                  backgroundColor: "var(--accent-gold)",
                                  borderRadius: "3px"
                                }} />
                              </div>
                            </div>
                          </td>

                          {/* Items Sold Progress */}
                          <td style={{ padding: "20px 12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <span style={{ minWidth: "24px", fontWeight: 600 }}>{row.itemsSold}</span>
                              <div style={{
                                width: "80px",
                                height: "6px",
                                backgroundColor: "rgba(6, 78, 59, 0.04)",
                                borderRadius: "3px",
                                overflow: "hidden"
                              }}>
                                <div style={{
                                  width: `${Math.min(100, (row.itemsSold / 30) * 100)}%`,
                                  height: "100%",
                                  backgroundColor: "var(--primary-green)",
                                  borderRadius: "3px"
                                }} />
                              </div>
                            </div>
                          </td>

                          {/* New Users */}
                          <td style={{ padding: "20px 12px", color: "var(--primary-green-dark)", fontWeight: 700 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <span style={{ opacity: 0.7 }}>👤</span>
                              <span>{row.users}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}

        {/* --- 3. INVENTORY VIEW (Stock and stock updates) --- */}
        {activeTab === "Inventory" && (
          <div>
            <h2 style={{ color: "var(--primary-green)", fontWeight: 800 }}>Inventory Logs</h2>
            <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>Monitor stock levels and perform direct supply replenishment.</p>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: "24px",
              marginTop: "24px",
              justifyContent: "start"
            }}>
              {products.map((prod) => {
                // 1. Calculate soldCount
                const soldCount = orders
                  .filter((o: Order) => o.status !== "Cancelled")
                  .reduce((sum: number, o: Order) => {
                    const prodQty = o.items
                      .filter((it: OrderItem) => it.productId === prod.id)
                      .reduce((s: number, it: OrderItem) => s + it.quantity, 0);
                    return sum + prodQty;
                  }, 0);

                // 2. Calculate pendingCount (to be delivered)
                const pendingCount = orders
                  .filter((o: Order) => o.status === "Pending" || o.status === "Confirmed" || o.status === "Shipped")
                  .reduce((sum: number, o: Order) => {
                    const prodQty = o.items
                      .filter((it: OrderItem) => it.productId === prod.id)
                      .reduce((s: number, it: OrderItem) => s + it.quantity, 0);
                    return sum + prodQty;
                  }, 0);

                // 3. Determine color name and dot color custom tailored for our products
                let colorName = "Forest Green";
                let dotColor = "#064e3b";

                if (prod.name.toLowerCase().includes("urine bag")) {
                  colorName = "Kraft Brown";
                  dotColor = "#8b5a2b";
                } else if (prod.name.toLowerCase().includes("visor") || prod.name.toLowerCase().includes("shield")) {
                  colorName = "Ultra Clear";
                  dotColor = "#38bdf8";
                } else if (prod.name.toLowerCase().includes("posture")) {
                  colorName = "Midnight Black";
                  dotColor = "#111827";
                } else if (prod.name.toLowerCase().includes("dog") || prod.name.toLowerCase().includes("bowl")) {
                  colorName = "Ocean Blue";
                  dotColor = "#0284c7";
                } else {
                  // Fallback to custom attribute search
                  const colorAttr = prod.customAttributes.find(
                    (attr: CustomAttribute) => attr.key.toLowerCase() === "color" || attr.key.toLowerCase() === "packaging"
                  );
                  if (colorAttr) {
                    colorName = colorAttr.value;
                  }
                }

                // Determine Category/Type label custom tailored for our products
                let categoryLabel = "SOLUTIONS";
                if (prod.name.toLowerCase().includes("urine bag")) {
                  categoryLabel = "TRAVEL HYGIENE";
                } else if (prod.name.toLowerCase().includes("visor") || prod.name.toLowerCase().includes("shield")) {
                  categoryLabel = "RIDING GEAR";
                } else if (prod.name.toLowerCase().includes("posture")) {
                  categoryLabel = "WELLNESS SENSORS";
                } else if (prod.name.toLowerCase().includes("dog") || prod.name.toLowerCase().includes("bowl")) {
                  categoryLabel = "PET TRAVEL";
                } else {
                  const catAttr = prod.customAttributes.find(
                    (attr: CustomAttribute) => attr.key.toLowerCase() === "category" || attr.key.toLowerCase() === "type"
                  );
                  if (catAttr) {
                    categoryLabel = catAttr.value.toUpperCase();
                  }
                }

                // 4. Split stock across sizes (S, M, L) dynamically to match screenshot
                const sStock = Math.max(0, prod.stock - 20);
                const mStock = prod.stock >= 20 ? 20 : prod.stock;
                const lStock = 0;

                // Split sold count: size S gets the sold count, others get 0
                const sSold = soldCount;
                const mSold = 0;
                const lSold = 0;

                // Split pending count: size S gets the pending count, others get 0
                const sPending = pendingCount;
                const mPending = 0;
                const lPending = 0;

                return (
                  <div key={prod.id} style={{
                    backgroundColor: "var(--white)",
                    borderRadius: "24px",
                    padding: "32px",
                    boxShadow: "var(--shadow-sm)",
                    border: "1px solid rgba(6, 78, 59, 0.05)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                    position: "relative",
                    width: "100%",
                    margin: 0
                  }}>
                    {/* Header Info Block */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "20px", textAlign: "left" }}>
                        <img 
                          src={prod.image} 
                          alt={prod.name} 
                          style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "18px", border: "1px solid var(--border-color)" }} 
                        />
                        <div>
                          <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: "var(--text-dark)", textTransform: "uppercase", letterSpacing: "0.02em" }}>
                            {prod.name}
                          </h3>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px", fontSize: "0.9rem", fontWeight: 700 }}>
                            <span style={{ color: "var(--accent-gold)" }}>₹{prod.price.toLocaleString()}</span>
                            <span style={{ color: "#a1a1a1" }}>|</span>
                            <span style={{ color: "#a1a1a1", textTransform: "uppercase", letterSpacing: "0.05em" }}>{categoryLabel}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Aggregate Metrics Row */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                      {/* Remaining Card */}
                      <div style={{ backgroundColor: "#f5ebe0", padding: "20px", borderRadius: "18px", textAlign: "center" }}>
                        <span style={{ display: "block", fontSize: "0.75rem", fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.08em" }}>REMAINING</span>
                        <span style={{ display: "block", fontSize: "1.8rem", fontWeight: 800, color: "var(--text-dark)", marginTop: "8px" }}>{prod.stock}</span>
                      </div>

                      {/* Sold Card */}
                      <div style={{ backgroundColor: "rgba(6, 78, 59, 0.04)", padding: "20px", borderRadius: "18px", textAlign: "center" }}>
                        <span style={{ display: "block", fontSize: "0.75rem", fontWeight: 800, color: "var(--primary-green)", letterSpacing: "0.08em" }}>SOLD</span>
                        <span style={{ display: "block", fontSize: "1.8rem", fontWeight: 800, color: "var(--primary-green)", marginTop: "8px" }}>📈 {soldCount}</span>
                      </div>

                      {/* Pending Card */}
                      <div style={{ backgroundColor: "rgba(59, 130, 246, 0.04)", padding: "20px", borderRadius: "18px", textAlign: "center" }}>
                        <span style={{ display: "block", fontSize: "0.75rem", fontWeight: 800, color: "#2563eb", letterSpacing: "0.08em" }}>TO BE DELIVERED</span>
                        <span style={{ display: "block", fontSize: "1.8rem", fontWeight: 800, color: "#2563eb", marginTop: "8px" }}>🚚 {pendingCount}</span>
                      </div>
                    </div>

                    {/* Variations Stock Block */}
                    <div style={{ textAlign: "left", marginTop: "8px" }}>
                      <h4 style={{ display: "flex", alignItems: "center", gap: "8px", color: "#ff3366", fontSize: "0.85rem", fontWeight: 800, letterSpacing: "0.08em", margin: "0 0 16px 0" }}>
                        <span>📦</span> VARIATIONS STOCK
                      </h4>

                      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {/* Single Standard Variation Box */}
                        <div style={{
                          backgroundColor: "var(--bg-beige-light)",
                          borderRadius: "20px",
                          padding: "20px",
                          border: "1px solid var(--border-color)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "12px"
                        }}>
                          {/* Header Row */}
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                            <div style={{
                              padding: "6px 14px",
                              borderRadius: "20px",
                              backgroundColor: "var(--white)",
                              border: "1px solid var(--border-color)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 800,
                              fontSize: "0.75rem",
                              color: "var(--text-dark)",
                              letterSpacing: "0.03em"
                            }}>
                              ONE SIZE
                            </div>
                            <div style={{ display: "flex", gap: "32px", fontSize: "0.75rem", fontWeight: 800 }}>
                              <div style={{ textAlign: "right" }}>
                                <div style={{ color: "#ff3366", letterSpacing: "0.05em" }}>STOCK LEFT</div>
                                <div style={{ color: "#ff3366", fontSize: "1rem", marginTop: "2px" }}>{prod.stock}</div>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <div style={{ color: "var(--primary-green)", letterSpacing: "0.05em" }}>SOLD</div>
                                <div style={{ color: "var(--primary-green)", fontSize: "1rem", marginTop: "2px" }}>{soldCount}</div>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <div style={{ color: "#2563eb", letterSpacing: "0.05em" }}>TO DELIVER</div>
                                <div style={{ color: "#2563eb", fontSize: "1rem", marginTop: "2px" }}>{pendingCount}</div>
                              </div>
                            </div>
                          </div>

                          </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- 4. ORDERS VIEW (Track and update orders) --- */}
        {activeTab === "Orders" && (() => {
          // Calculate status statistics dynamically
          const pendingCount = orders.filter((o: Order) => o.status === "Pending").length;
          const confirmedCount = orders.filter((o: Order) => o.status === "Confirmed").length;
          const shippedCount = orders.filter((o: Order) => o.status === "Shipped").length;
          const deliveredCount = orders.filter((o: Order) => o.status === "Delivered").length;
          const cancelledCount = orders.filter((o: Order) => o.status === "Cancelled").length;

          // Filter orders in real-time and sort descending by date (newest first)
          const filteredOrders = orders
            .filter((o: Order) => {
              if (filterStatus !== "All Statuses" && o.status !== filterStatus) return false;
              if (filterFromDate) {
                const fromDate = parseInputDate(filterFromDate);
                if (fromDate && new Date(o.date) < fromDate) return false;
              }
              if (filterToDate) {
                const toDate = parseInputDate(filterToDate);
                if (toDate) {
                  const toDateLimit = new Date(toDate);
                  toDateLimit.setHours(23, 59, 59, 999);
                  if (new Date(o.date) > toDateLimit) return false;
                }
              }
              return true;
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

          const toggleOrderExpand = (id: string) => {
            setExpandedOrders(prev => ({ ...prev, [id]: !prev[id] }));
          };

          const getSelectColor = (status: string) => {
            switch (status) {
              case "Pending": return "#c5a059";
              case "Confirmed": return "#3b82f6";
              case "Shipped": return "#6366f1";
              case "Delivered": return "#10b981";
              case "Cancelled": return "#ef4444";
              default: return "#71717a";
            }
          };

          return (
            <div>
              <h2 style={{ color: "var(--primary-green)", fontWeight: 800 }}>User Purchase Orders</h2>
              <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>Monitor status logs, filter orders, and update shipping parameters.</p>
              
              {/* Metric Cards Row (Matches Admin image 2) */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "20px",
                marginTop: "24px",
                marginBottom: "32px"
              }}>
                {/* Pending */}
                <div style={{ backgroundColor: "var(--white)", borderRadius: "20px", padding: "20px", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", gap: "16px", textAlign: "left" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundColor: "rgba(197, 160, 89, 0.1)", color: "#c5a059", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
                    🕒
                  </div>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>PENDING</span>
                    <h3 style={{ margin: "2px 0 0 0", fontSize: "1.4rem", fontWeight: "800", color: "var(--text-dark)" }}>{pendingCount} Orders</h3>
                  </div>
                </div>

                {/* Confirmed */}
                <div style={{ backgroundColor: "var(--white)", borderRadius: "20px", padding: "20px", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", gap: "16px", textAlign: "left" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundColor: "rgba(59, 130, 246, 0.1)", color: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
                    ✓
                  </div>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>CONFIRMED</span>
                    <h3 style={{ margin: "2px 0 0 0", fontSize: "1.4rem", fontWeight: "800", color: "var(--text-dark)" }}>{confirmedCount} Orders</h3>
                  </div>
                </div>

                {/* Shipped */}
                <div style={{ backgroundColor: "var(--white)", borderRadius: "20px", padding: "20px", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", gap: "16px", textAlign: "left" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundColor: "rgba(99, 102, 241, 0.1)", color: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
                    🚚
                  </div>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>SHIPPED</span>
                    <h3 style={{ margin: "2px 0 0 0", fontSize: "1.4rem", fontWeight: "800", color: "var(--text-dark)" }}>{shippedCount} Orders</h3>
                  </div>
                </div>

                {/* Delivered */}
                <div style={{ backgroundColor: "var(--white)", borderRadius: "20px", padding: "20px", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", gap: "16px", textAlign: "left" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
                    🛍️
                  </div>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>DELIVERED</span>
                    <h3 style={{ margin: "2px 0 0 0", fontSize: "1.4rem", fontWeight: "800", color: "var(--text-dark)" }}>{deliveredCount} Orders</h3>
                  </div>
                </div>

                {/* Cancelled */}
                <div style={{ backgroundColor: "var(--white)", borderRadius: "20px", padding: "20px", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", gap: "16px", textAlign: "left" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
                    ❌
                  </div>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>CANCELLED</span>
                    <h3 style={{ margin: "2px 0 0 0", fontSize: "1.4rem", fontWeight: "800", color: "var(--text-dark)" }}>{cancelledCount} Orders</h3>
                  </div>
                </div>
              </div>

              {/* Filter Orders Card (Matches Admin image 2) */}
              <div style={{
                backgroundColor: "var(--white)",
                borderRadius: "24px",
                padding: "28px",
                boxShadow: "var(--shadow-sm)",
                border: "1px solid var(--border-color)",
                marginBottom: "28px",
                textAlign: "left"
              }}>
                <h3 style={{ fontSize: "1rem", fontWeight: "800", letterSpacing: "0.05em", color: "var(--text-dark)", textTransform: "uppercase", marginBottom: "16px" }}>
                  Filter Orders
                </h3>
                
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-end" }}>
                  
                  {/* Status Dropdown */}
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <label style={{ display: "block", fontSize: "0.7rem", fontWeight: "800", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "6px" }}>STATUS</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="form-control"
                      style={{ margin: 0 }}
                    >
                      <option value="All Statuses">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* From Date */}
                  <div style={{ flex: 1, minWidth: "160px" }}>
                    <label style={{ display: "block", fontSize: "0.7rem", fontWeight: "800", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "6px" }}>FROM DATE</label>
                    <input
                      type="text"
                      placeholder="DD/MM/YY"
                      value={filterFromDate}
                      onChange={(e) => setFilterFromDate(formatToDateInput(e.target.value))}
                      className="form-control"
                      style={{ margin: 0 }}
                    />
                  </div>

                  {/* To Date */}
                  <div style={{ flex: 1, minWidth: "160px" }}>
                    <label style={{ display: "block", fontSize: "0.7rem", fontWeight: "800", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "6px" }}>TO DATE</label>
                    <input
                      type="text"
                      placeholder="DD/MM/YY"
                      value={filterToDate}
                      onChange={(e) => setFilterToDate(formatToDateInput(e.target.value))}
                      className="form-control"
                      style={{ margin: 0 }}
                    />
                  </div>

                  {/* Clear Filter */}
                  <button
                    onClick={() => {
                      setFilterStatus("All Statuses");
                      setFilterFromDate("");
                      setFilterToDate("");
                    }}
                    style={{
                      height: "44px",
                      padding: "0 24px",
                      backgroundColor: "transparent",
                      border: "1px dashed #ef4444",
                      color: "#ef4444",
                      borderRadius: "12px",
                      fontWeight: "700",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      textTransform: "uppercase"
                    }}
                  >
                    ✕ Clear Filters
                  </button>
                </div>
              </div>

              {/* Filtered Orders List Card Grid */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {filteredOrders.length === 0 ? (
                  <div style={{ backgroundColor: "var(--white)", padding: "60px", borderRadius: "24px", border: "1px solid var(--border-color)", color: "var(--text-muted)" }}>
                    No matching orders found.
                  </div>
                ) : (
                  filteredOrders.map((ord: Order, idx: number) => {
                    const isExpanded = expandedOrders[ord.id] === true;
                    
                    return (
                      <div
                        key={ord.id}
                        style={{
                          backgroundColor: "var(--white)",
                          borderRadius: "20px",
                          border: "1px solid var(--border-color)",
                          boxShadow: "var(--shadow-sm)",
                          overflow: "hidden"
                        }}
                      >
                        {/* Summary Header row (Matches Admin image 2) */}
                        <div style={{
                          padding: "20px 28px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          cursor: "pointer"
                        }} onClick={() => toggleOrderExpand(ord.id)}>
                          
                          {/* Left Details */}
                          <div style={{ display: "flex", gap: "16px", alignItems: "center", textAlign: "left" }}>
                            <div style={{
                              width: "42px",
                              height: "42px",
                              borderRadius: "10px",
                              backgroundColor: "rgba(6, 78, 59, 0.05)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "1.1rem"
                            }}>
                              💼
                            </div>
                            <div>
                              <h4 style={{ margin: 0, fontSize: "1.05rem", fontWeight: "800", color: "var(--text-dark)" }}>
                                Order #{filteredOrders.length - idx} &nbsp;
                                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "500" }}>({ord.id})</span>
                              </h4>
                              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                                Placed on {new Date(ord.date).toLocaleDateString("en-GB")}
                              </span>
                            </div>
                          </div>

                          {/* Middle Dropdown status (Clicking inside does not toggle expand) */}
                          <div onClick={(e) => e.stopPropagation()}>
                            <select
                              value={ord.status}
                              onChange={(e) => {
                                const newStatus = e.target.value as any;
                                if (newStatus === "Cancelled") {
                                  setCancellingOrderId(ord.id);
                                  setCancellationReason("");
                                } else {
                                  updateOrderStatus(ord.id, newStatus);
                                }
                              }}
                              style={{
                                padding: "6px 28px 6px 12px",
                                fontSize: "0.85rem",
                                fontWeight: "800",
                                borderRadius: "12px",
                                border: `1px solid ${getSelectColor(ord.status)}`,
                                backgroundColor: "var(--white)",
                                color: getSelectColor(ord.status),
                                cursor: "pointer",
                                textTransform: "uppercase",
                                outline: "none"
                              }}
                            >
                              <option value="Pending" style={{ color: "#c5a059", fontWeight: 700 }}>Pending</option>
                              <option value="Confirmed" style={{ color: "#3b82f6", fontWeight: 700 }}>Confirmed</option>
                              <option value="Shipped" style={{ color: "#6366f1", fontWeight: 700 }}>Shipped</option>
                              <option value="Delivered" style={{ color: "#10b981", fontWeight: 700 }}>Delivered</option>
                              <option value="Cancelled" style={{ color: "#ef4444", fontWeight: 700 }}>Cancelled</option>
                            </select>
                          </div>

                          {/* Right Amount details */}
                          <div style={{ display: "flex", gap: "28px", alignItems: "center" }}>
                            <div style={{ textAlign: "right" }}>
                              <span style={{ display: "block", fontSize: "0.65rem", color: "var(--text-muted)", fontWeight: "700" }}>AMOUNT</span>
                              <strong style={{ fontSize: "1.05rem", color: "var(--text-dark)" }}>₹{ord.totalPrice.toLocaleString()}</strong>
                            </div>
                            <span style={{ fontSize: "1rem", color: "var(--text-muted)", transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }}>
                              ▼
                            </span>
                          </div>

                        </div>

                        {/* Expanded Drawer Details */}
                        {isExpanded && (
                          <div style={{
                            padding: "24px 28px",
                            backgroundColor: "rgba(6, 78, 59, 0.02)",
                            borderTop: "1px solid var(--border-color)",
                            textAlign: "left",
                            display: "grid",
                            gridTemplateColumns: "1.5fr 1fr",
                            gap: "32px"
                          }}>
                            
                            {/* Items Purchased list */}
                            <div>
                              <h5 style={{ margin: "0 0 12px 0", fontSize: "0.85rem", fontWeight: "800", color: "var(--primary-green)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                Items Summary
                              </h5>
                              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {ord.items.map((it: OrderItem, i: number) => {
                                  const matchingProd = products.find((p) => p.id === it.productId);
                                  const imageSrc = matchingProd ? matchingProd.image : "/placeholder.png";

                                  return (
                                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", fontSize: "0.9rem", color: "var(--text-dark)" }}>
                                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                        <img 
                                          src={imageSrc} 
                                          alt={it.name} 
                                          style={{
                                            width: "48px",
                                            height: "48px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                            border: "1px solid var(--border-color)"
                                          }} 
                                        />
                                        <span style={{ textAlign: "left" }}>
                                          {it.name} <strong style={{ color: "var(--primary-green)" }}>x{it.quantity}</strong>
                                        </span>
                                      </div>
                                      <span style={{ fontWeight: "700" }}>₹{(it.price * it.quantity).toLocaleString()}</span>
                                    </div>
                                  );
                                })}
                                <div style={{ borderTop: "1px dashed var(--border-color)", margin: "8px 0" }} />
                                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "800", fontSize: "0.95rem", color: "var(--text-dark)" }}>
                                  <span>Total Bill Amount</span>
                                  <span>₹{ord.totalPrice.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>

                            {/* Shipping Address cards */}
                            <div>
                              <h5 style={{ margin: "0 0 12px 0", fontSize: "0.85rem", fontWeight: "800", color: "var(--primary-green)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                Shipping Destination
                              </h5>
                              
                              {ord.shippingAddress ? (
                                <div style={{
                                  backgroundColor: "var(--white)",
                                  borderRadius: "12px",
                                  padding: "16px",
                                  border: "1px solid var(--border-color)",
                                  fontSize: "0.85rem",
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "6px"
                                }}>
                                  <div><strong>Name:</strong> {ord.shippingAddress.name}</div>
                                  <div><strong>Street:</strong> {ord.shippingAddress.street}</div>
                                  <div><strong>City/State:</strong> {ord.shippingAddress.city}, {ord.shippingAddress.state}</div>
                                  <div><strong>Pincode:</strong> {ord.shippingAddress.pincode}</div>
                                  <div><strong>Phone:</strong> {ord.shippingAddress.phone}</div>
                                </div>
                              ) : (
                                <div style={{
                                  backgroundColor: "var(--white)",
                                  borderRadius: "12px",
                                  padding: "16px",
                                  border: "1px solid var(--border-color)",
                                  fontSize: "0.85rem",
                                  color: "var(--text-muted)",
                                  fontStyle: "italic"
                                }}>
                                  Placed via direct fallback checkout. Address string: {ord.customerName} ({ord.customerPhone})
                                </div>
                              )}
                              
                              {ord.status === "Cancelled" && ord.cancelReason && (
                                <div style={{
                                  marginTop: "16px",
                                  backgroundColor: "rgba(239, 68, 68, 0.05)",
                                  border: "1px solid rgba(239, 68, 68, 0.15)",
                                  borderRadius: "12px",
                                  padding: "16px",
                                  fontSize: "0.85rem",
                                  color: "#ef4444"
                                }}>
                                  <strong>Cancellation Reason:</strong> {ord.cancelReason}
                                </div>
                              )}
                            </div>

                          </div>
                        )}

                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })()}

        {/* --- 5. PRODUCTS VIEW (Product form + Custom attribute section) --- */}
        {activeTab === "Products" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            
            {/* Create / Edit Form Card */}
            <div style={{
              backgroundColor: "var(--white)",
              borderRadius: "24px",
              padding: "36px",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid rgba(6, 78, 59, 0.05)"
            }}>
              <h3 style={{ fontSize: "1.4rem", color: "var(--primary-green)", marginBottom: "24px" }}>
                {isEditing ? `✏️ Edit Product: ${editingId}` : "🏷️ Create New Unique Product"}
              </h3>

              <form onSubmit={handleSaveProduct}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "24px"
                }}>
                  {/* Left Side: General details */}
                  <div>
                    <div className="form-group">
                      <label htmlFor="prod-name">Product Title</label>
                      <input
                        id="prod-name"
                        type="text"
                        className="form-control"
                        placeholder="e.g. Disposable Urinating Bag"
                        value={prodName}
                        onChange={(e) => setProdName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="prod-desc">Detailed Description</label>
                      <textarea
                        id="prod-desc"
                        className="form-control"
                        rows={4}
                        placeholder="Explain the product composition, mechanism, and instructions..."
                        value={prodDesc}
                        onChange={(e) => setProdDesc(e.target.value)}
                        required
                      />
                    </div>

                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                      <div className="form-group" style={{ flex: 1, minWidth: "120px" }}>
                        <label htmlFor="prod-price">Retail Price (₹)</label>
                        <input
                          id="prod-price"
                          type="number"
                          className="form-control"
                          min={1}
                          placeholder="e.g. 15"
                          value={prodPrice === "" ? "" : prodPrice}
                          onChange={(e) => setProdPrice(e.target.value === "" ? "" : Number(e.target.value))}
                          required
                        />
                      </div>
                      <div className="form-group" style={{ flex: 1, minWidth: "120px" }}>
                        <label htmlFor="prod-orig-price">Original Price (₹)</label>
                        <input
                          id="prod-orig-price"
                          type="number"
                          className="form-control"
                          min={1}
                          placeholder="e.g. 30"
                          value={prodOriginalPrice === "" ? "" : prodOriginalPrice}
                          onChange={(e) => setProdOriginalPrice(e.target.value === "" ? "" : Number(e.target.value))}
                        />
                      </div>
                      <div className="form-group" style={{ flex: 1, minWidth: "120px" }}>
                        <label htmlFor="prod-stock">Initial Stock</label>
                        <input
                          id="prod-stock"
                          type="number"
                          className="form-control"
                          min={0}
                          value={prodStock}
                          onChange={(e) => setProdStock(e.target.value === "" ? "" : Number(e.target.value))}
                          required
                        />
                      </div>
                    </div>

                    {prodOriginalPrice !== "" && prodPrice !== "" && Number(prodPrice) >= Number(prodOriginalPrice) && (
                      <div style={{
                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                        color: "var(--error)",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        marginBottom: "16px",
                        borderLeft: "3px solid var(--error)"
                      }}>
                        ⚠️ Retail Price (₹{prodPrice}) must be strictly less than Original Price (₹{prodOriginalPrice}).
                      </div>
                    )}

                    <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "12px", textAlign: "left" }}>
                      <label style={{ fontWeight: 700 }}>Product Image URLs (First image will be default storefront thumbnail)</label>
                      
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {prodImages.map((imgUrl, imgIdx) => (
                          <div key={imgIdx} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <ImageUploadField
                              placeholder={`Image URL #${imgIdx + 1}`}
                              value={imgUrl}
                              onChange={(val) => handleImageFieldChange(imgIdx, val)}
                              required={imgIdx === 0}
                            />
                            {prodImages.length > 1 && (
                              <button
                                type="button"
                                style={{ color: "var(--error)", background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", padding: "0 8px" }}
                                onClick={() => handleRemoveImageField(imgIdx)}
                              >
                                &times;
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        className="btn-outline"
                        style={{ alignSelf: "flex-start", padding: "6px 12px", fontSize: "0.8rem", borderRadius: "6px" }}
                        onClick={handleAddImageField}
                      >
                        + Add Image URL
                      </button>

                      {/* Display first image preview */}
                      {prodImages[0] && prodImages[0].trim() !== "" && (
                        <div style={{ 
                          marginTop: "12px", 
                          display: "flex", 
                          alignItems: "center", 
                          gap: "12px",
                          padding: "10px",
                          backgroundColor: "rgba(6, 78, 59, 0.03)",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--border-color)",
                          width: "fit-content"
                        }}>
                          <img 
                            src={prodImages[0]} 
                            alt="Default Image Preview" 
                            style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px" }}
                          />
                          <div>
                            <span style={{ fontSize: "0.8rem", color: "var(--success)", fontWeight: 700, display: "block" }}>
                              ✓ Default Preview Loaded
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Featured Product Toggle Option (Matches brand theme footer/sidebar!) */}
                    <div style={{
                      marginTop: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor: "var(--primary-green)", // Cohesive forest green background
                      padding: "16px 24px",
                      borderRadius: "100px", // Full capsule rounding
                      border: "1px solid rgba(245, 235, 224, 0.15)",
                      width: "100%",
                      boxSizing: "border-box"
                    }}>
                      
                      {/* Left Block: Icon and Labels */}
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        {/* Rounded square icon background */}
                        <div style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "14px",
                          backgroundColor: "rgba(245, 235, 224, 0.1)", // Light warm tint
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--accent-gold)" // Gold sparkles icon
                        }}>
                          {/* Sparkles SVG */}
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 3 Q 12 12 3 12 Q 12 12 12 21 Q 12 12 21 12 Q 12 12 12 3 Z" />
                            <circle cx="6" cy="18" r="1.5" fill="currentColor" />
                          </svg>
                        </div>

                        {/* Title and Subtitle */}
                        <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                          <span style={{
                            fontSize: "0.85rem",
                            fontWeight: "800",
                            color: "var(--white)", // Warm white text
                            letterSpacing: "0.03em",
                            textTransform: "uppercase"
                          }}>
                            FEATURED PRODUCT
                          </span>
                          <span style={{
                            fontSize: "0.75rem",
                            color: "rgba(245, 235, 224, 0.7)", // Muted warm beige text
                            fontWeight: "500",
                            marginTop: "2px"
                          }}>
                            Spotlight this item on the homepage
                          </span>
                        </div>
                      </div>

                      {/* Right Block: Pill Switch Toggle button */}
                      <div 
                        onClick={() => setIsProdFeatured(!isProdFeatured)}
                        style={{
                          width: "50px",
                          height: "28px",
                          borderRadius: "100px",
                          backgroundColor: isProdFeatured ? "var(--accent-gold)" : "rgba(245, 235, 224, 0.25)", // Gold when active, soft beige when off
                          position: "relative",
                          cursor: "pointer",
                          transition: "background-color 0.25s ease-in-out",
                          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.15)",
                          border: "1px solid rgba(245, 235, 224, 0.1)"
                        }}
                      >
                        {/* Circular white thumb */}
                        <div style={{
                          width: "22px",
                          height: "22px",
                          borderRadius: "50%",
                          backgroundColor: "#ffffff",
                          position: "absolute",
                          top: "2px",
                          left: isProdFeatured ? "25px" : "2px",
                          transition: "left 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                        }} />
                      </div>

                    </div>
                  </div>

                  {/* Right Side: Custom specifications block (Theme feature!) */}
                  <div>
                    <div style={{
                      backgroundColor: "var(--bg-beige-light)",
                      padding: "24px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-color)",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <label style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--primary-green)" }}>
                          Custom Attributes Section
                        </label>
                        <button
                          type="button"
                          className="btn-outline"
                          style={{ padding: "6px 12px", fontSize: "0.8rem", borderRadius: "6px" }}
                          onClick={handleAddAttribute}
                        >
                          + Add Row
                        </button>
                      </div>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "16px", lineHeight: 1.4 }}>
                        Add unique key-value pairs appropriate for this problem solution. (e.g. key: "Problem Solved", value: "lack of toilets").
                      </p>

                      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", maxHeight: "300px" }}>
                        {customAttrs.length === 0 ? (
                          <div style={{ textAlign: "center", padding: "30px", border: "1px dashed var(--accent-gold)", borderRadius: "8px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                            No attributes added yet. Click "+ Add Row" to begin.
                          </div>
                        ) : (
                          customAttrs.map((attr, idx) => (
                            <div key={idx} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                              <input
                                type="text"
                                className="form-control"
                                style={{ flex: 1, padding: "8px" }}
                                placeholder="Attribute (e.g. Capacity)"
                                value={attr.key}
                                onChange={(e) => handleAttributeChange(idx, "key", e.target.value)}
                                required
                              />
                              <input
                                type="text"
                                className="form-control"
                                style={{ flex: 2, padding: "8px" }}
                                placeholder="Details (e.g. 600ml)"
                                value={attr.value}
                                onChange={(e) => handleAttributeChange(idx, "value", e.target.value)}
                                required
                              />
                              <button
                                type="button"
                                style={{ color: "var(--error)", padding: "4px 8px", fontSize: "1.2rem" }}
                                onClick={() => handleRemoveAttribute(idx)}
                              >
                                &times;
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rich Content Details Block (Dynamic specification sections) */}
                <div style={{
                  marginTop: "30px",
                  paddingTop: "24px",
                  borderTop: "1px dashed var(--border-color)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  textAlign: "left"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h4 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--primary-green)", margin: 0 }}>
                      ℹ️ Rich Product Description & Layout (Dynamic Sections)
                    </h4>
                    <button
                      type="button"
                      className="btn-outline"
                      style={{ padding: "6px 12px", fontSize: "0.8rem", borderRadius: "6px" }}
                      onClick={handleAddRichSection}
                    >
                      + Add Section
                    </button>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0 0 10px 0", lineHeight: 1.4 }}>
                    Create customizable display sections (e.g. "Features", "How to Use", "Warnings") and select the style layout. Items can be entered in any format (bullets, numbered lists, commas, or plain text) and will be parsed automatically.
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {richSections.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "40px", border: "1px dashed var(--accent-gold)", borderRadius: "12px", color: "var(--text-muted)", fontSize: "0.85rem", backgroundColor: "rgba(197, 160, 89, 0.02)" }}>
                        No rich sections added yet. Click "+ Add Section" to begin.
                      </div>
                    ) : (
                      richSections.map((sec, idx) => (
                        <div 
                          key={idx} 
                          style={{ 
                            backgroundColor: "var(--bg-beige-light)", 
                            padding: "24px", 
                            borderRadius: "16px", 
                            border: "1px solid var(--border-color)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px",
                            position: "relative"
                          }}
                        >
                          <button
                            type="button"
                            style={{ 
                              position: "absolute", 
                              top: "16px", 
                              right: "16px", 
                              color: "var(--error)", 
                              fontWeight: "700",
                              fontSize: "0.85rem",
                              background: "none",
                              border: "none",
                              cursor: "pointer"
                            }}
                            onClick={() => handleRemoveRichSection(idx)}
                          >
                            ✕ Remove Section
                          </button>

                          <div className="grid-3" style={{ gap: "16px", width: "calc(100% - 140px)" }}>
                            <div className="form-group" style={{ margin: 0 }}>
                              <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>Section Title</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. Features"
                                value={sec.title}
                                onChange={(e) => handleRichSectionChange(idx, "title", e.target.value)}
                                required
                              />
                            </div>
                            <div className="form-group" style={{ margin: 0 }}>
                              <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>Subtitle/Header (Optional)</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. Each pack includes 2 kits"
                                value={sec.subtitle || ""}
                                onChange={(e) => handleRichSectionChange(idx, "subtitle", e.target.value)}
                              />
                            </div>
                            <div className="form-group" style={{ margin: 0 }}>
                              <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>Display Style Type</label>
                              <select
                                className="form-control"
                                value={sec.type}
                                onChange={(e) => handleRichSectionChange(idx, "type", e.target.value)}
                                required
                              >
                                <option value="tickmarks">✓ Tick marks (Checklist)</option>
                                <option value="bullets">📦 Bullets (List)</option>
                                <option value="steps">🛠️ Steps (Numbered cards)</option>
                                <option value="how-to-use">🛠️ How to Use (Steps with Images)</option>
                                <option value="badges">👥 Badges (Green outline pills)</option>
                                <option value="badges-gold">🚗 Badges Gold (Beige outline pills)</option>
                              </select>
                            </div>
                          </div>

                          {sec.type !== "how-to-use" ? (
                            <div className="form-group" style={{ margin: 0 }}>
                              <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>Content / Matter</label>
                              <textarea
                                className="form-control"
                                rows={4}
                                placeholder="Enter list items (one per line, numbered, bulleted, or comma-separated tags)&#10;e.g.&#10;• Item 1&#10;• Item 2"
                                value={sec.content}
                                onChange={(e) => handleRichSectionChange(idx, "content", e.target.value)}
                                required
                              />
                            </div>
                          ) : (
                            /* Step-by-Step Editor for How to Use with Images */
                            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "4px" }}>
                              <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--primary-green)", textAlign: "left" }}>
                                Configure How to Use Steps
                              </label>
                              
                              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {(() => {
                                  const stepsTextList = sec.content ? sec.content.split("\n") : [""];
                                  const stepImagesList = sec.stepImages || [];
                                  
                                  return stepsTextList.map((stepText: string, stepIdx: number) => (
                                    <div key={stepIdx} style={{ 
                                      display: "flex", 
                                      flexDirection: "column", 
                                      gap: "12px", 
                                      backgroundColor: "rgba(6, 78, 59, 0.02)", 
                                      padding: "16px", 
                                      borderRadius: "12px",
                                      border: "1px dashed var(--border-color)",
                                      position: "relative",
                                      textAlign: "left"
                                    }}>
                                      {/* Remove Step Button */}
                                      {stepsTextList.length > 1 && (
                                        <button
                                          type="button"
                                          style={{ 
                                            position: "absolute", 
                                            top: "12px", 
                                            right: "12px", 
                                            color: "var(--error)", 
                                            fontSize: "0.8rem", 
                                            fontWeight: "700",
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer"
                                          }}
                                          onClick={() => {
                                            const newTexts = stepsTextList.filter((_: string, i: number) => i !== stepIdx);
                                            const newImages = stepImagesList.filter((_: string, i: number) => i !== stepIdx);
                                            handleRichSectionChange(idx, "content", newTexts.join("\n"));
                                            
                                            const updatedSections = richSections.map((s, i) => {
                                              if (i === idx) {
                                                return { ...s, content: newTexts.join("\n"), stepImages: newImages };
                                              }
                                              return s;
                                            });
                                            setRichSections(updatedSections);
                                          }}
                                        >
                                          ✕ Remove
                                        </button>
                                      )}
                                      
                                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                        <span style={{
                                          width: "24px",
                                          height: "24px",
                                          borderRadius: "50%",
                                          backgroundColor: "var(--accent-gold)",
                                          color: "var(--primary-green)",
                                          fontWeight: 800,
                                          fontSize: "0.8rem",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          flexShrink: 0
                                        }}>
                                          {stepIdx + 1}
                                        </span>
                                        <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--primary-green)" }}>
                                          Step {stepIdx + 1}
                                        </span>
                                      </div>
                                      
                                      <div className="grid-2" style={{ gap: "16px" }}>
                                        <div className="form-group" style={{ margin: 0 }}>
                                          <label style={{ fontSize: "0.75rem", fontWeight: 700 }}>Description Text</label>
                                          <input
                                            type="text"
                                            className="form-control"
                                            placeholder={`Description for step ${stepIdx + 1}`}
                                            value={stepText}
                                            onChange={(e) => {
                                              const newTexts = [...stepsTextList];
                                              newTexts[stepIdx] = e.target.value;
                                              handleRichSectionChange(idx, "content", newTexts.join("\n"));
                                            }}
                                            required
                                          />
                                        </div>
                                        
                                        <div className="form-group" style={{ margin: 0 }}>
                                          <label style={{ fontSize: "0.75rem", fontWeight: 700 }}>Image URL (Optional)</label>
                                          <ImageUploadField
                                            placeholder="e.g. /main_banner.jpeg or upload file"
                                            value={stepImagesList[stepIdx] || ""}
                                            onChange={(url) => {
                                              handleStepImageChange(idx, stepIdx, url);
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ));
                                })()}
                              </div>
                              
                              <button
                                type="button"
                                className="btn-outline"
                                style={{ alignSelf: "flex-start", padding: "6px 12px", fontSize: "0.8rem", borderRadius: "6px", marginTop: "4px" }}
                                onClick={() => {
                                  const stepsTextList = sec.content ? sec.content.split("\n") : [];
                                  const newTexts = [...stepsTextList, ""];
                                  handleRichSectionChange(idx, "content", newTexts.join("\n"));
                                }}
                              >
                                + Add Step
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* FAQ Block (Optional dynamic lists of Q&A) */}
                <div style={{
                  marginTop: "30px",
                  paddingTop: "24px",
                  borderTop: "1px dashed var(--border-color)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  textAlign: "left"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h4 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--primary-green)", margin: 0 }}>
                      ❓ Frequently Asked Questions (FAQs) - Optional
                    </h4>
                    <button
                      type="button"
                      className="btn-outline"
                      style={{ padding: "6px 12px", fontSize: "0.8rem", borderRadius: "6px" }}
                      onClick={handleAddFaq}
                    >
                      + Add FAQ
                    </button>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0 0 10px 0", lineHeight: 1.4 }}>
                    Add questions and answers that will appear as an accordion on the product details page. Answers can contain multiple paragraphs or list bullets.
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {prodFaqs.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "30px", border: "1px dashed var(--accent-gold)", borderRadius: "12px", color: "var(--text-muted)", fontSize: "0.85rem", backgroundColor: "rgba(197, 160, 89, 0.02)" }}>
                        No FAQs added yet. Click "+ Add FAQ" to add a Q&A pair.
                      </div>
                    ) : (
                      prodFaqs.map((faq, idx) => (
                        <div 
                          key={idx} 
                          style={{ 
                            backgroundColor: "var(--bg-beige-light)", 
                            padding: "24px", 
                            borderRadius: "16px", 
                            border: "1px solid var(--border-color)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px",
                            position: "relative"
                          }}
                        >
                          <button
                            type="button"
                            style={{ 
                              position: "absolute", 
                              top: "16px", 
                              right: "16px", 
                              color: "var(--error)", 
                              fontWeight: "700",
                              fontSize: "0.85rem",
                              background: "none",
                              border: "none",
                              cursor: "pointer"
                            }}
                            onClick={() => handleRemoveFaq(idx)}
                          >
                            ✕ Remove FAQ
                          </button>

                          <div className="form-group" style={{ margin: 0, width: "calc(100% - 140px)" }}>
                            <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>Question #{idx + 1}</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g. What is the capacity of the urine bag?"
                              value={faq.question}
                              onChange={(e) => handleFaqChange(idx, "question", e.target.value)}
                              required
                            />
                          </div>

                          <div className="form-group" style={{ margin: 0 }}>
                            <label style={{ fontSize: "0.8rem", fontWeight: 700 }}>Answer</label>
                            <textarea
                              className="form-control"
                              rows={4}
                              placeholder="Enter the answer here. Supports newlines, paragraphs, and list symbols."
                              value={faq.answer}
                              onChange={(e) => handleFaqChange(idx, "answer", e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
                  {isEditing && (
                    <button type="button" className="btn-outline" onClick={handleCancelEdit}>
                      Cancel Edit
                    </button>
                  )}
                  <button type="submit" className="btn-primary">
                    {isEditing ? "Update Product" : "Publish to Storefront"}
                  </button>
                </div>
              </form>
            </div>

            {/* List and manage products */}
            <div style={{
              backgroundColor: "var(--white)",
              borderRadius: "24px",
              padding: "24px",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid rgba(6, 78, 59, 0.05)"
            }}>
              <h3 style={{ fontSize: "1.25rem", color: "var(--primary-green)", marginBottom: "20px" }}>Catalog Control</h3>
              
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--border-color)" }}>
                    <th style={{ padding: "12px" }}>Image</th>
                    <th style={{ padding: "12px" }}>Name</th>
                    <th style={{ padding: "12px" }}>Price</th>
                    <th style={{ padding: "12px" }}>Stock</th>
                    <th style={{ padding: "12px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => (
                    <tr key={prod.id} style={{ borderBottom: "1px solid rgba(6, 78, 59, 0.05)" }}>
                      <td style={{ padding: "12px" }}>
                        <img 
                          src={prod.image} 
                          alt={prod.name} 
                          style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "6px" }} 
                        />
                      </td>
                      <td style={{ padding: "12px", fontWeight: "700" }}>
                        {prod.name}
                        {prod.isFeatured && (
                          <span 
                            style={{ 
                              marginLeft: "8px", 
                              backgroundColor: "rgba(197, 160, 89, 0.15)", 
                              color: "var(--accent-gold)", 
                              fontSize: "0.65rem", 
                              padding: "2px 6px", 
                              borderRadius: "4px", 
                              textTransform: "uppercase",
                              fontWeight: "800",
                              border: "1px solid rgba(197, 160, 89, 0.3)",
                              whiteSpace: "nowrap"
                            }}
                          >
                            ★ Featured
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "12px" }}>₹{prod.price.toLocaleString()}</td>
                      <td style={{ padding: "12px" }}>{prod.stock}</td>
                      <td style={{ padding: "12px" }}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button 
                            className="btn-outline" 
                            style={{ padding: "6px 12px", fontSize: "0.8rem", borderRadius: "6px" }}
                            onClick={() => handleStartEdit(prod)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn-danger" 
                            style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this product?")) {
                                deleteProduct(prod.id);
                              }
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- 6. CUSTOMERS VIEW --- */}
        {activeTab === "Customers" && (
          <div>
            <h2 style={{ color: "var(--primary-green)", fontWeight: 800 }}>Registered Customers Log</h2>
            <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>Database log of users who have registered on the platform.</p>
            
            <div style={{
              backgroundColor: "var(--white)",
              borderRadius: "24px",
              padding: "24px",
              boxShadow: "var(--shadow-sm)",
              marginTop: "24px",
              border: "1px solid rgba(6, 78, 59, 0.05)"
            }}>
              {customers.length === 0 ? (
                <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px" }}>No customers logged yet.</p>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.95rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--border-color)" }}>
                      <th style={{ padding: "16px" }}>Full Name</th>
                      <th style={{ padding: "16px" }}>Email Address</th>
                      <th style={{ padding: "16px" }}>Phone Number</th>
                      <th style={{ padding: "16px" }}>Registration Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((cust, idx) => {
                      const isExpanded = expandedCustomers[cust.email] === true;
                      const customerOrders = orders.filter(
                        (o) => (o.customerEmail && o.customerEmail.toLowerCase() === cust.email.toLowerCase()) || 
                               (o.customerPhone && o.customerPhone.replace(/\D/g, "") === cust.phone.replace(/\D/g, ""))
                      );

                      return (
                        <React.Fragment key={idx}>
                          <tr 
                            style={{ 
                              borderBottom: "1px solid rgba(6, 78, 59, 0.05)",
                              cursor: "pointer",
                              backgroundColor: isExpanded ? "rgba(6, 78, 59, 0.01)" : "transparent"
                            }}
                            onClick={() => toggleCustomerExpand(cust.email)}
                          >
                            <td style={{ padding: "16px", fontWeight: "700", color: "var(--primary-green)" }}>
                              {cust.name}
                            </td>
                            <td style={{ padding: "16px", color: "var(--text-dark)" }}>
                              {cust.email}
                            </td>
                            <td style={{ padding: "16px" }}>{cust.phone}</td>
                            <td style={{ padding: "16px", color: "var(--text-muted)", fontSize: "0.85rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span>{new Date(cust.createdAt).toLocaleString()}</span>
                              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }}>
                                ▼
                              </span>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr>
                              <td colSpan={4} style={{ 
                                padding: "20px 24px", 
                                backgroundColor: "rgba(6, 78, 59, 0.02)",
                                borderBottom: "1px solid var(--border-color)"
                              }}>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "28px", textAlign: "left" }}>
                                  
                                  {/* Current Cart Section */}
                                  <div>
                                    <h5 style={{ margin: "0 0 12px 0", fontSize: "0.85rem", fontWeight: "800", color: "var(--primary-green)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                      Current Cart Items
                                    </h5>
                                    {!cust.cart || cust.cart.length === 0 ? (
                                      <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: 0, fontStyle: "italic" }}>
                                        Shopping cart is currently empty.
                                      </p>
                                    ) : (
                                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                        {cust.cart.map((item, i) => (
                                          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.85rem" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                              <img 
                                                src={item.product.image} 
                                                alt={item.product.name} 
                                                style={{ width: "36px", height: "36px", borderRadius: "6px", objectFit: "cover", border: "1px solid var(--border-color)" }} 
                                              />
                                              <span>{item.product.name} <strong style={{ color: "var(--primary-green)" }}>x{item.quantity}</strong></span>
                                            </div>
                                            <span style={{ fontWeight: 700 }}>₹{(item.product.price * item.quantity).toLocaleString()}</span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  {/* Order History Section */}
                                  <div>
                                    <h5 style={{ margin: "0 0 12px 0", fontSize: "0.85rem", fontWeight: "800", color: "var(--primary-green)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                      Order History ({customerOrders.length} orders)
                                    </h5>
                                    {customerOrders.length === 0 ? (
                                      <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: 0, fontStyle: "italic" }}>
                                        No orders placed yet.
                                      </p>
                                    ) : (
                                      <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "250px", overflowY: "auto" }}>
                                        {customerOrders.map((ord, i) => (
                                          <div key={i} style={{ 
                                            padding: "10px 12px", 
                                            backgroundColor: "var(--white)", 
                                            border: "1px solid var(--border-color)", 
                                            borderRadius: "8px",
                                            fontSize: "0.85rem",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center"
                                          }}>
                                            <div>
                                              <div style={{ fontWeight: "700", color: "var(--text-dark)" }}>
                                                Order #{ord.id}
                                              </div>
                                              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
                                                {new Date(ord.date).toLocaleDateString("en-GB")} • {ord.items.length} items
                                              </div>
                                            </div>
                                            <div style={{ textAlign: "right" }}>
                                              <div style={{ fontWeight: "700", color: "var(--text-dark)" }}>
                                                ₹{ord.totalPrice.toLocaleString()}
                                              </div>
                                              <span style={{ 
                                                fontSize: "0.7rem", 
                                                fontWeight: "700", 
                                                color: ord.status === "Cancelled" ? "#ef4444" : ord.status === "Delivered" ? "#10b981" : "#3b82f6",
                                                textTransform: "uppercase"
                                              }}>
                                                {ord.status}
                                              </span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* --- 7. BANNERS VIEW --- */}
        {activeTab === "Banners" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div>
                <h2 style={{ color: "var(--primary-green)", fontWeight: 800 }}>Hero Showcase Banners</h2>
                <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>Configure sliding promotional banners for your storefront homepage.</p>
              </div>
              {!isEditingBanner && (
                <button 
                  className="btn-primary" 
                  onClick={() => {
                    setEditingBannerId(null);
                    setIsEditingBanner(true);
                    setBannerTitle1("");
                    setBannerTitle2("");
                    setBannerBadgeText("Featured Innovation");
                    setBannerDesc("");
                    setBannerBulletsText("");
                    setBannerImage("");
                    setBannerProdLabel("");
                    setBannerProdSubLabel("");
                    setBannerPriceText("");
                    setBannerOriginalPriceText("");
                    setBtn1Text("Buy Now");
                    setBtn1Link("/product/prod-1");
                    setBtn2Text("Learn More");
                    setBtn2Link("/product/prod-1");
                  }}
                >
                  ➕ Add New Banner
                </button>
              )}
            </div>

            {isEditingBanner ? (
              <div style={{
                backgroundColor: "var(--white)",
                borderRadius: "24px",
                padding: "32px",
                boxShadow: "var(--shadow-sm)",
                border: "1px solid rgba(6, 78, 59, 0.05)",
                marginTop: "24px"
              }}>
                <h3 style={{ fontSize: "1.25rem", color: "var(--primary-green)", marginBottom: "20px" }}>
                  {editingBannerId ? "Edit Hero Slide Settings" : "Create New Hero Slide"}
                </h3>
                
                <form onSubmit={handleSaveBanner} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                    <div className="form-group" style={{ flex: 1, minWidth: "260px" }}>
                      <label>Heading Line 1 (Required)</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. Travel Without Worry." 
                        value={bannerTitle1} 
                        onChange={(e) => setBannerTitle1(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1, minWidth: "260px" }}>
                      <label>Heading Line 2 (Required)</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. Relief Anywhere. Anytime." 
                        value={bannerTitle2} 
                        onChange={(e) => setBannerTitle2(e.target.value)} 
                        required 
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                    <div className="form-group" style={{ flex: 1, minWidth: "260px" }}>
                      <label>Badge Tag Text</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. Featured Innovation" 
                        value={bannerBadgeText} 
                        onChange={(e) => setBannerBadgeText(e.target.value)} 
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1, minWidth: "260px" }}>
                      <label>Image Source Link (Required)</label>
                      <ImageUploadField
                        placeholder="Paste image URL or upload image file"
                        value={bannerImage}
                        onChange={(url) => setBannerImage(url)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description Paragraph (Required)</label>
                    <textarea 
                      className="form-control" 
                      rows={3} 
                      placeholder="Enter detailed description summarizing product capabilities..." 
                      value={bannerDesc} 
                      onChange={(e) => setBannerDesc(e.target.value)} 
                      required 
                      style={{ resize: "vertical" }}
                    />
                  </div>

                  <div className="form-group">
                    <label>Checklist Bullet Items (Comma-separated)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Unisex, Leak-Proof, Odour Lock, Made in India" 
                      value={bannerBulletsText} 
                      onChange={(e) => setBannerBulletsText(e.target.value)} 
                    />
                    <small style={{ color: "var(--text-muted)", display: "block", marginTop: "4px" }}>
                      Separate multiple checklist features with commas.
                    </small>
                  </div>

                  <h4 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "8px", marginTop: "12px", color: "var(--primary-green)", fontSize: "1.05rem" }}>
                    Product Showcase Floating Label Details (Optional)
                  </h4>
                  
                  <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                    <div className="form-group" style={{ flex: 1, minWidth: "200px" }}>
                      <label>Label Title</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. SolvrBag" 
                        value={bannerProdLabel} 
                        onChange={(e) => setBannerProdLabel(e.target.value)} 
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1, minWidth: "200px" }}>
                      <label>Label Subtext</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. Disposable Urination Bag" 
                        value={bannerProdSubLabel} 
                        onChange={(e) => setBannerProdSubLabel(e.target.value)} 
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1, minWidth: "150px" }}>
                      <label>Price Display</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. ₹15" 
                        value={bannerPriceText} 
                        onChange={(e) => setBannerPriceText(e.target.value)} 
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1, minWidth: "150px" }}>
                      <label>Original Price</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="e.g. ₹30" 
                        value={bannerOriginalPriceText} 
                        onChange={(e) => setBannerOriginalPriceText(e.target.value)} 
                      />
                    </div>
                  </div>

                  <h4 style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "8px", marginTop: "12px", color: "var(--primary-green)", fontSize: "1.05rem" }}>
                    Action Buttons Configuration (Up to 2 Buttons)
                  </h4>

                  <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: "260px", padding: "16px", backgroundColor: "var(--bg-beige-light)", borderRadius: "16px", border: "1px solid var(--border-color)" }}>
                      <h5 style={{ margin: "0 0 12px 0", fontWeight: 700 }}>Primary Button</h5>
                      <div className="form-group" style={{ marginBottom: "12px" }}>
                        <label>Button Text</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="e.g. Buy Now" 
                          value={btn1Text} 
                          onChange={(e) => setBtn1Text(e.target.value)} 
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Button Link Route</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="e.g. /product/prod-1" 
                          value={btn1Link} 
                          onChange={(e) => setBtn1Link(e.target.value)} 
                        />
                      </div>
                    </div>

                    <div style={{ flex: 1, minWidth: "260px", padding: "16px", backgroundColor: "var(--bg-beige-light)", borderRadius: "16px", border: "1px solid var(--border-color)" }}>
                      <h5 style={{ margin: "0 0 12px 0", fontWeight: 700 }}>Secondary Button</h5>
                      <div className="form-group" style={{ marginBottom: "12px" }}>
                        <label>Button Text</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="e.g. Learn More" 
                          value={btn2Text} 
                          onChange={(e) => setBtn2Text(e.target.value)} 
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Button Link Route</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="e.g. /product/prod-1" 
                          value={btn2Link} 
                          onChange={(e) => setBtn2Link(e.target.value)} 
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "24px" }}>
                    <button 
                      type="button" 
                      className="btn-outline" 
                      onClick={() => setIsEditingBanner(false)}
                      style={{ padding: "12px 24px", minWidth: "120px", justifyContent: "center" }}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn-primary"
                      style={{ padding: "12px 24px", minWidth: "120px", justifyContent: "center" }}
                    >
                      Save Slide
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div style={{ marginTop: "24px" }}>
                {heroBanners.length === 0 ? (
                  <div style={{
                    backgroundColor: "var(--white)",
                    borderRadius: "24px",
                    padding: "60px 24px",
                    textAlign: "center",
                    boxShadow: "var(--shadow-sm)",
                    border: "1px solid rgba(6, 78, 59, 0.05)"
                  }}>
                    <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>No banners configured yet.</p>
                    <button 
                      className="btn-primary" 
                      style={{ marginTop: "16px", display: "inline-flex" }}
                      onClick={() => setIsEditingBanner(true)}
                    >
                      ➕ Create First Banner
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
                    {heroBanners.map((banner) => (
                      <div 
                        key={banner.id} 
                        style={{
                          backgroundColor: "var(--white)",
                          borderRadius: "24px",
                          overflow: "hidden",
                          boxShadow: "var(--shadow-sm)",
                          border: "1px solid rgba(6, 78, 59, 0.05)",
                          display: "flex",
                          flexDirection: "column"
                        }}
                      >
                        <div style={{ position: "relative", height: "180px" }}>
                          <img 
                            src={banner.image} 
                            alt={banner.titleLine1} 
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                          <span style={{
                            position: "absolute",
                            top: "12px",
                            left: "12px",
                            backgroundColor: "var(--primary-green)",
                            color: "var(--white)",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            padding: "6px 12px",
                            borderRadius: "12px"
                          }}>
                            {banner.badgeText || "Promo"}
                          </span>
                        </div>
                        
                        <div style={{ padding: "20px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
                          <div>
                            <h4 style={{ margin: "0 0 8px 0", color: "var(--primary-green)", fontSize: "1.1rem", fontWeight: 700 }}>
                              {banner.titleLine1} {banner.titleLine2}
                            </h4>
                            <p style={{ margin: "0 0 16px 0", color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.5 }}>
                              {banner.description}
                            </p>

                            {banner.bullets && banner.bullets.length > 0 && (
                              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                                {banner.bullets.map((b, bIdx) => (
                                  <span key={bIdx} style={{ fontSize: "0.7rem", backgroundColor: "rgba(6, 78, 59, 0.05)", color: "var(--primary-green-dark)", padding: "4px 8px", borderRadius: "8px", fontWeight: 600 }}>
                                    ✓ {b}
                                  </span>
                                ))}
                              </div>
                            )}

                            {banner.buttons && banner.buttons.length > 0 && (
                              <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                                {banner.buttons.map((btn, btnIdx) => (
                                  <span key={btnIdx} style={{ fontSize: "0.75rem", border: "1px solid var(--border-color)", padding: "4px 8px", borderRadius: "12px", color: "var(--text-dark)", fontWeight: 500 }}>
                                    🎛️ {btn.text}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "16px", display: "flex", gap: "10px" }}>
                            <button 
                              className="btn-outline" 
                              style={{ flex: 1, justifyContent: "center", fontSize: "0.85rem", padding: "8px" }}
                              onClick={() => handleEditBannerClick(banner)}
                            >
                              Edit Details
                            </button>
                            <button 
                              className="btn-outline" 
                              style={{ flex: 1, justifyContent: "center", fontSize: "0.85rem", padding: "8px", color: "var(--error)", borderColor: "var(--error)" }}
                              onClick={() => {
                                if (confirm("Are you sure you want to delete this showcase banner?")) {
                                  deleteHeroBanner(banner.id);
                                }
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* --- 8. BLOGS VIEW --- */}
        {activeTab === "Blogs" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
              <div>
                <h1 style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--primary-green)", marginBottom: "4px" }}>
                  Blog Management
                </h1>
                <p style={{ color: "var(--text-muted)" }}>
                  Create, edit, and publish blog articles displayed on the About Us page.
                </p>
              </div>
            </div>

            {/* Create / Edit Blog Form */}
            <div style={{
              backgroundColor: "var(--white)",
              borderRadius: "24px",
              padding: "32px",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid rgba(6, 78, 59, 0.08)",
              marginBottom: "40px"
            }}>
              <h3 style={{ fontSize: "1.3rem", color: "var(--primary-green)", fontWeight: 800, marginBottom: "20px" }}>
                {isEditingBlog ? "✏️ Edit Blog Article" : "➕ Create New Blog Article"}
              </h3>

              <form onSubmit={handleSaveBlog} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "16px" }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontWeight: 700, fontSize: "0.85rem" }}>Article Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Why Every Traveller Should Carry a Disposable Urine Bag"
                      value={blogTitle}
                      onChange={(e) => setBlogTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontWeight: 700, fontSize: "0.85rem" }}>Category *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Travel Essentials"
                      value={blogCategory}
                      onChange={(e) => setBlogCategory(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontWeight: 700, fontSize: "0.85rem" }}>Read Time</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 4 min read"
                      value={blogReadTime}
                      onChange={(e) => setBlogReadTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontWeight: 700, fontSize: "0.85rem" }}>Tagline / Short Summary</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Unpredictable journeys require smart emergency preparations."
                    value={blogTagline}
                    onChange={(e) => setBlogTagline(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontWeight: 700, fontSize: "0.85rem" }}>Body Paragraphs (separate paragraphs with new lines) *</label>
                  <textarea
                    className="form-control"
                    rows={6}
                    placeholder="Enter article paragraphs here. Separate each paragraph with a new line..."
                    value={blogBodyText}
                    onChange={(e) => setBlogBodyText(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                  {isEditingBlog && (
                    <button
                      type="button"
                      className="btn-outline"
                      onClick={handleCancelBlogEdit}
                      style={{ padding: "12px 24px" }}
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ padding: "12px 28px", fontWeight: 700 }}
                  >
                    {isEditingBlog ? "Update Blog Article" : "Publish Blog Article"}
                  </button>
                </div>
              </form>
            </div>

            {/* Active Blogs List */}
            <div style={{
              backgroundColor: "var(--white)",
              borderRadius: "24px",
              padding: "32px",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid rgba(6, 78, 59, 0.08)"
            }}>
              <h3 style={{ fontSize: "1.3rem", color: "var(--primary-green)", fontWeight: 800, marginBottom: "20px" }}>
                📚 Published Articles ({blogs.length})
              </h3>

              {blogs.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                  No blog articles published yet. Create one above!
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
                  {blogs.map((b) => (
                    <div
                      key={b.id}
                      style={{
                        backgroundColor: "var(--bg-beige)",
                        borderRadius: "16px",
                        padding: "20px",
                        border: "1px solid rgba(6, 78, 59, 0.1)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: "16px"
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <span style={{
                            backgroundColor: "rgba(6, 78, 59, 0.08)",
                            color: "var(--primary-green)",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            padding: "3px 10px",
                            borderRadius: "12px",
                            textTransform: "uppercase"
                          }}>
                            {b.category}
                          </span>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                            {b.readTime}
                          </span>
                        </div>

                        <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--primary-green-dark)", margin: "0 0 8px 0" }}>
                          {b.title}
                        </h4>

                        {b.tagline && (
                          <p style={{ fontSize: "0.85rem", color: "var(--accent-gold)", fontWeight: 600, margin: "0 0 12px 0" }}>
                            {b.tagline}
                          </p>
                        )}

                        <p style={{
                          fontSize: "0.85rem",
                          color: "#475569",
                          margin: 0,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden"
                        }}>
                          {b.body.join(" ")}
                        </p>
                      </div>

                      <div style={{ borderTop: "1px solid rgba(6, 78, 59, 0.1)", paddingTop: "12px", display: "flex", gap: "10px" }}>
                        <button
                          className="btn-outline"
                          style={{ flex: 1, justifyContent: "center", fontSize: "0.85rem", padding: "8px" }}
                          onClick={() => handleStartEditBlog(b)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn-outline"
                          style={{ flex: 1, justifyContent: "center", fontSize: "0.85rem", padding: "8px", color: "var(--error)", borderColor: "var(--error)" }}
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${b.title}"?`)) {
                              deleteBlog(b.id);
                            }
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      {/* Cancellation Reason Modal */}
      {cancellingOrderId && (
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
        }}>
          <div style={{
            backgroundColor: "var(--white)",
            borderRadius: "24px",
            padding: "28px",
            width: "100%",
            maxWidth: "450px",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--border-color)",
            textAlign: "left",
            animation: "modalFadeIn 0.3s ease-out"
          }}>
            <h3 style={{ color: "var(--primary-green)", fontSize: "1.25rem", fontWeight: 800, margin: "0 0 16px 0" }}>
              Order Cancellation Reason
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "16px" }}>
              Please specify the reason for cancelling Order <strong>#{cancellingOrderId}</strong>. This reason will be visible to the customer.
            </p>
            
            <textarea
              style={{
                width: "100%",
                height: "100px",
                padding: "12px",
                borderRadius: "12px",
                border: "1px solid var(--border-color)",
                fontSize: "0.9rem",
                fontFamily: "inherit",
                resize: "none",
                outline: "none",
                marginBottom: "20px"
              }}
              placeholder="e.g. Out of stock, Delivery address unreachable, Customer requested cancellation..."
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
            />
            
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                className="btn-secondary"
                style={{ padding: "10px 20px" }}
                onClick={() => {
                  setCancellingOrderId(null);
                  setCancellationReason("");
                }}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                style={{ padding: "10px 20px", backgroundColor: "#ef4444", borderColor: "#ef4444" }}
                onClick={() => {
                  const trimmed = cancellationReason.trim();
                  if (!trimmed) {
                    alert("Please provide a cancellation reason.");
                    return;
                  }
                  updateOrderStatus(cancellingOrderId, "Cancelled", trimmed);
                  setCancellingOrderId(null);
                  setCancellationReason("");
                }}
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      </main>
    </div>
  );
}

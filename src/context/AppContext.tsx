"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Types
export interface CustomAttribute {
  key: string;
  value: string;
}

export interface ProductRichSection {
  title: string;
  subtitle?: string;
  type: "tickmarks" | "bullets" | "steps" | "badges" | "badges-gold" | "how-to-use";
  content: string;
  stepImages?: string[];
}

export interface ProductFaq {
  question: string;
  answer: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  stock: number;
  customAttributes: CustomAttribute[];
  isFeatured?: boolean;
  richSections?: ProductRichSection[];
  faqs?: ProductFaq[];
}

export interface Customer {
  email: string;
  phone: string;
  name: string;
  createdAt: string;
  addresses?: string[];
  cart?: CartItem[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface HeroBannerButton {
  text: string;
  link: string;
}

export interface HeroBanner {
  id: string;
  titleLine1: string;
  titleLine2: string;
  badgeText: string;
  description: string;
  bullets: string[];
  image: string;
  productLabel?: string;
  productSubLabel?: string;
  priceText?: string;
  originalPriceText?: string;
  buttons?: HeroBannerButton[];
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  tagline: string;
  readTime: string;
  body: string[];
  createdAt: string;
}

export interface Order {
  id: string;
  customerPhone: string;
  customerName: string;
  customerEmail?: string;
  date: string;
  status: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
  items: OrderItem[];
  totalPrice: number;
  shippingAddress?: OrderAddress;
  cancelReason?: string;
}

export interface AppContextType {
  // Products
  products: Product[];
  
  // Cart
  cart: CartItem[];
  
  // Orders
  orders: Order[];
  
  // Auth
  currentUser: { email: string; phone: string; name: string } | null;
  adminUser: { username: string } | null;
  customers: Customer[];
  isLoaded: boolean;
  isLoginOpen: boolean;
  setIsLoginOpen: (open: boolean) => void;
  
  // Products Methods
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  
  // Cart Methods
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Auth Methods
  loginCustomer: (email: string, name?: string, phone?: string) => boolean;
  logoutCustomer: () => void;
  updateCustomer: (email: string, name: string, phone: string, addresses: string[]) => void;
  loginAdmin: (username: string) => boolean;
  logoutAdmin: () => void;
  
  // Orders Methods
  placeOrder: (shippingAddress?: OrderAddress) => Order | null;
  updateOrderStatus: (orderId: string, status: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled", cancelReason?: string) => void;
  
  // Hero Banners
  heroBanners: HeroBanner[];
  addHeroBanner: (banner: Omit<HeroBanner, "id">) => void;
  updateHeroBanner: (banner: HeroBanner) => void;
  deleteHeroBanner: (id: string) => void;

  // Blogs
  blogs: BlogPost[];
  addBlog: (blog: Omit<BlogPost, "id" | "createdAt">) => void;
  updateBlog: (blog: BlogPost) => void;
  deleteBlog: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<{ email: string; phone: string; name: string } | null>(null);
  const [adminUser, setAdminUser] = useState<{ username: string } | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [heroBanners, setHeroBanners] = useState<HeroBanner[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sessionInitialized, setSessionInitialized] = useState(false);

  // 1. Immediately restore user and admin sessions synchronously from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("solvr_current_user");
        const storedAdmin = localStorage.getItem("solvr_admin_user");
        const storedCart = localStorage.getItem("solvr_cart");

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser) {
            setCurrentUser(parsedUser);
            const userCartKey = `solvr_cart_${parsedUser.phone || parsedUser.email || "guest"}`;
            const storedUserCart = localStorage.getItem(userCartKey);
            if (storedUserCart) {
              setCart(JSON.parse(storedUserCart));
            } else {
              setCart([]);
            }
          }
        } else {
          setCart([]);
        }

        if (storedAdmin) {
          setAdminUser(JSON.parse(storedAdmin));
        }
      } catch (err) {
        console.error("Error restoring session from localStorage:", err);
      } finally {
        setSessionInitialized(true);
      }
    }
  }, []);

  // 2. Load remote database data asynchronously
  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodRes, custRes, orderRes, bannerRes, blogRes] = await Promise.all([
          fetch("/api/products").then((r) => r.json()),
          fetch("/api/customers").then((r) => r.json()),
          fetch("/api/orders").then((r) => r.json()),
          fetch("/api/hero-banners").then((r) => r.json()),
          fetch("/api/blogs").then((r) => r.json())
        ]);

        if (Array.isArray(prodRes)) setProducts(prodRes);
        if (Array.isArray(custRes)) setCustomers(custRes);
        if (Array.isArray(orderRes)) setOrders(orderRes);
        if (Array.isArray(bannerRes)) setHeroBanners(bannerRes);
        if (Array.isArray(blogRes)) setBlogs(blogRes);
      } catch (err) {
        console.error("Error loading remote seed data:", err);
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, []);

  // 3. Save session states to LocalStorage only AFTER session restoration is initialized
  useEffect(() => {
    if (sessionInitialized && typeof window !== "undefined") {
      localStorage.setItem("solvr_cart", JSON.stringify(cart));
      if (currentUser) {
        localStorage.setItem(`solvr_cart_${currentUser.phone || currentUser.email || "guest"}`, JSON.stringify(cart));
        
        // Update local customers state
        setCustomers((prev) =>
          prev.map((c) =>
            c.email && c.email.trim().toLowerCase() === currentUser.email.trim().toLowerCase()
              ? { ...c, cart }
              : c
          )
        );

        // Sync cart to SQLite database
        fetch("/api/customers", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: currentUser.email, cart })
        }).catch((err) => console.error("Error syncing customer cart in SQLite:", err));
      }
    }
  }, [cart, currentUser, sessionInitialized]);

  useEffect(() => {
    if (sessionInitialized && typeof window !== "undefined") {
      if (currentUser) {
        localStorage.setItem("solvr_current_user", JSON.stringify(currentUser));
      } else {
        localStorage.removeItem("solvr_current_user");
      }
    }
  }, [currentUser, sessionInitialized]);

  useEffect(() => {
    if (sessionInitialized && typeof window !== "undefined") {
      if (adminUser) {
        localStorage.setItem("solvr_admin_user", JSON.stringify(adminUser));
      } else {
        localStorage.removeItem("solvr_admin_user");
      }
    }
  }, [adminUser, sessionInitialized]);

  // Methods
  const addProduct = (newProd: Omit<Product, "id">) => {
    const product: Product = {
      ...newProd,
      id: `prod-${Date.now()}`
    };
    setProducts((prev) => [...prev, product]);
    fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    }).catch((err) => console.error("Error saving product to SQLite:", err));
  };

  const updateProduct = (updatedProd: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProd.id ? updatedProd : p)));
    fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProd)
    }).catch((err) => console.error("Error updating product in SQLite:", err));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    fetch(`/api/products?id=${id}`, {
      method: "DELETE"
    }).catch((err) => console.error("Error deleting product from SQLite:", err));
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const loginCustomer = (email: string, name?: string, phone?: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Look up customer
    const existing = customers.find((c) => c.email && c.email.trim().toLowerCase() === cleanEmail);
    
    if (existing) {
      // Returning customer - login directly
      setCurrentUser({ email: existing.email, phone: existing.phone, name: existing.name });
      if (existing.cart && existing.cart.length > 0) {
        setCart(existing.cart);
      }
      return true;
    } else {
      // New customer - needs name and phone
      if (!name || name.trim() === "" || !phone || phone.trim() === "") {
        // Signal that name/phone are required
        return false;
      }
      const cleanPhone = phone.trim().replace(/\D/g, "");
      // Create new customer
      const newCustomer: Customer = {
        email: cleanEmail,
        phone: cleanPhone,
        name: name.trim(),
        createdAt: new Date().toISOString(),
        addresses: []
      };
      setCustomers((prev) => [...prev, newCustomer]);
      setCurrentUser({ email: newCustomer.email, phone: newCustomer.phone, name: newCustomer.name });

      fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer)
      }).catch((err) => console.error("Error registering customer in SQLite:", err));

      return true;
    }
  };

  const logoutCustomer = () => {
    setCurrentUser(null);
    setCart([]);
  };

  const updateCustomer = (email: string, name: string, phone: string, addresses: string[]) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim().replace(/\D/g, "");
    const updated = {
      email: cleanEmail,
      name: name.trim(),
      phone: cleanPhone,
      addresses,
      createdAt: new Date().toISOString()
    };
    setCustomers((prev) =>
      prev.map((c) => (c.email && c.email.trim().toLowerCase() === cleanEmail ? updated : c))
    );
    if (currentUser && currentUser.email && currentUser.email.trim().toLowerCase() === cleanEmail) {
      setCurrentUser({ email: cleanEmail, phone: cleanPhone, name: name.trim() });
    }

    fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    }).catch((err) => console.error("Error updating customer in SQLite:", err));
  };

  const loginAdmin = (username: string): boolean => {
    setAdminUser({ username });
    return true;
  };

  const logoutAdmin = () => {
    setAdminUser(null);
  };

  const placeOrder = (shippingAddress?: OrderAddress): Order | null => {
    if (!currentUser || cart.length === 0) return null;

    // Check if we have enough stock for each item
    for (const item of cart) {
      const prod = products.find((p) => p.id === item.product.id);
      if (!prod || prod.stock < item.quantity) {
        return null; // Out of stock or product deleted
      }
    }

    // Deduct stock locally
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        const cartItem = cart.find((item) => item.product.id === p.id);
        if (cartItem) {
          return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
        }
        return p;
      })
    );

    // Create order
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerPhone: currentUser.phone,
      customerName: currentUser.name,
      customerEmail: currentUser.email,
      items: cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      })),
      totalPrice: cart.reduce((total, item) => total + item.product.price * item.quantity, 0),
      status: "Pending",
      date: new Date().toISOString(),
      shippingAddress
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Save order in SQLite (handles stock deduction too)
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOrder)
    }).catch((err) => console.error("Error placing order in SQLite:", err));

    // Trigger admin email notification
    fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newOrder)
    })
      .then((res) => {
        if (!res.ok) {
          console.error("Failed to send order email:", res.statusText);
        }
      })
      .catch((err) => {
        console.error("Error calling send-email API:", err);
      });

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled", cancelReason?: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status, cancelReason } : o))
    );
    fetch("/api/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: orderId, status, cancelReason })
    }).catch((err) => console.error("Error updating order status in SQLite:", err));
  };

  const addHeroBanner = (banner: Omit<HeroBanner, "id">) => {
    const newBanner: HeroBanner = {
      ...banner,
      id: `banner-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setHeroBanners((prev) => [...prev, newBanner]);

    fetch("/api/hero-banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBanner)
    }).catch((err) => console.error("Error adding banner in SQLite:", err));
  };

  const updateHeroBanner = (banner: HeroBanner) => {
    setHeroBanners((prev) => prev.map((b) => (b.id === banner.id ? banner : b)));
    fetch("/api/hero-banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(banner)
    }).catch((err) => console.error("Error updating banner in SQLite:", err));
  };

  const deleteHeroBanner = (id: string) => {
    setHeroBanners((prev) => prev.filter((b) => b.id !== id));
    fetch(`/api/hero-banners?id=${id}`, {
      method: "DELETE"
    }).catch((err) => console.error("Error deleting banner in SQLite:", err));
  };

  const addBlog = (blogData: Omit<BlogPost, "id" | "createdAt">) => {
    const newBlog: BlogPost = {
      ...blogData,
      id: `blog-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setBlogs((prev) => [newBlog, ...prev]);

    fetch("/api/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBlog)
    }).catch((err) => console.error("Error adding blog in SQLite:", err));
  };

  const updateBlog = (updatedBlog: BlogPost) => {
    setBlogs((prev) => prev.map((b) => (b.id === updatedBlog.id ? updatedBlog : b)));
    fetch("/api/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedBlog)
    }).catch((err) => console.error("Error updating blog in SQLite:", err));
  };

  const deleteBlog = (id: string) => {
    setBlogs((prev) => prev.filter((b) => b.id !== id));
    fetch(`/api/blogs?id=${id}`, {
      method: "DELETE"
    }).catch((err) => console.error("Error deleting blog in SQLite:", err));
  };

  return (
    <AppContext.Provider
      value={{
        products,
        customers,
        orders,
        cart,
        currentUser,
        adminUser,
        isLoaded,
        isLoginOpen,
        setIsLoginOpen,
        addProduct,
        updateProduct,
        deleteProduct,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        loginCustomer,
        logoutCustomer,
        updateCustomer,
        loginAdmin,
        logoutAdmin,
        placeOrder,
        updateOrderStatus,
        heroBanners,
        addHeroBanner,
        updateHeroBanner,
        deleteHeroBanner,
        blogs,
        addBlog,
        updateBlog,
        deleteBlog
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

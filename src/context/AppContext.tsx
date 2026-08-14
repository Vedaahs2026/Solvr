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
  type: "tickmarks" | "bullets" | "steps" | "badges" | "badges-gold";
  content: string;
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
  phone: string;
  name: string;
  createdAt: string;
  addresses?: string[];
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

export interface Order {
  id: string;
  customerPhone: string;
  customerName: string;
  date: string;
  status: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
  items: OrderItem[];
  totalPrice: number;
  shippingAddress?: OrderAddress;
}

export interface AppContextType {
  // Products
  products: Product[];
  
  // Cart
  cart: CartItem[];
  
  // Orders
  orders: Order[];
  
  // Auth
  currentUser: { phone: string; name: string } | null;
  adminUser: { username: string } | null;
  customers: Customer[];
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
  loginCustomer: (phone: string, name?: string) => boolean;
  logoutCustomer: () => void;
  updateCustomer: (phone: string, name: string, addresses: string[]) => void;
  loginAdmin: (username: string) => boolean;
  logoutAdmin: () => void;
  
  // Orders Methods
  placeOrder: (shippingAddress?: OrderAddress) => Order | null;
  updateOrderStatus: (orderId: string, status: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled") => void;
  
  // Hero Banners
  heroBanners: HeroBanner[];
  addHeroBanner: (banner: Omit<HeroBanner, "id">) => void;
  updateHeroBanner: (banner: HeroBanner) => void;
  deleteHeroBanner: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial mock products
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "SOLVR Disposable Urine Bag",
    description: "Relief Anywhere. Anytime. India's innovative disposable urine bag designed for comfortable, hygienic, and hassle-free relief while travelling.",
    price: 15,
    originalPrice: 30,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=60",
    stock: 120,
    customAttributes: [
      { key: "Problem Solved", value: "Urination difficulty during transit / lack of public toilets" },
      { key: "Gel Capacity", value: "700 ml" },
      { key: "Material", value: "Super Absorbent Polymer (SAP) & Polyethylene" },
      { key: "Pack Size", value: "2 Kits per pack" },
      { key: "Disposal Seal", value: "Eco-safe biodegradable peel-and-seal strip" }
    ],
    isFeatured: true,
    richSections: [
      {
        title: "Features",
        type: "tickmarks",
        content: "700 ml Capacity\nUnisex Design\nLeak-Proof Construction\nRapid Gel Absorption\nOdour Lock Technology\nCompact Travel Size\nEasy Fold & Seal\nHygienic Disposal\nEco-Conscious Kraft Packaging\nMade in India"
      },
      {
        title: "What's Inside?",
        subtitle: "Each Box Includes: 2 Travel Emergency Kits",
        type: "bullets",
        content: "Disposable Urine Bag (700 ml)\nHigh-Absorbency Pad\nWet Wipe\nDisposable Waste Bag"
      },
      {
        title: "How to Use",
        type: "steps",
        content: "Open and press the edges.\nSit comfortably and position the bag securely.\nUse the bag.\nFold along the dotted line.\nPlace inside the disposable waste bag.\nDispose responsibly."
      },
      {
        title: "Who Can Use It?",
        type: "badges",
        content: "Women, Men, Senior Citizens, Pregnant Women, Patients, Wheelchair Users, Drivers, Travellers, Campers, Hikers, Emergency Responders"
      },
      {
        title: "Ideal Situations",
        type: "badges-gold",
        content: "Traffic Jams, Long Road Trips, Sleeper Bus Travel, Train Journeys, Remote Locations, Outdoor Activities, Camping, Trekking, Medical Emergencies"
      }
    ]
  },
  {
    id: "prod-2",
    name: "Anti-Fog Helmet Visor Insert (SolvrShield)",
    description: "A micro-nanotech clear film that adheres to the inside of motorcycle helmet visors, completely eliminating fogging in cold or rainy weather. Employs a hydrophilic moisture-disbursing nano-structure that ensures absolute vision safety.",
    price: 25,
    originalPrice: 50,
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500&auto=format&fit=crop&q=60",
    stock: 85,
    customAttributes: [
      { key: "Problem Solved", value: "Helmet visor fogging, reducing riding visibility" },
      { key: "Technology", value: "Hydrophilic Nanofilm" },
      { key: "Lifespan", value: "Up to 2 years of active use" },
      { key: "Compatibility", value: "Universal - fits 98% of standard helmet visors" },
      { key: "Thickness", value: "0.5 mm ultra-thin profile" }
    ],
    isFeatured: true
  },
  {
    id: "prod-3",
    name: "Ergonomic Posture Sensor (PostureSolvr)",
    description: "A lightweight, clip-on posture sensor that helps you build muscle memory. It clips easily onto your collar, monitors your spine curvature angle, and vibrates gently if you slouch for more than 15 seconds.",
    price: 49,
    originalPrice: 98,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&auto=format&fit=crop&q=60",
    stock: 40,
    customAttributes: [
      { key: "Problem Solved", value: "Poor desk posture leading to neck and back pain" },
      { key: "Battery Life", value: "7 days per USB-C charge" },
      { key: "Haptic System", value: "Silent low-frequency haptic motor" },
      { key: "App Syncing", value: "None required - standalone intelligent feedback" }
    ],
    isFeatured: false
  },
  {
    id: "prod-4",
    name: "Spill-Proof Dog Travel Bowl (PawSolvr)",
    description: "A floating disk travel bowl designed to keep pets hydrated on the move without creating messes. The floating element controls water flow, preventing water splashing in moving vehicles and keeping your pet's beard dry.",
    price: 18,
    originalPrice: 36,
    image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=500&auto=format&fit=crop&q=60",
    stock: 150,
    customAttributes: [
      { key: "Problem Solved", value: "Water spills in moving cars / wet dog beard drippings" },
      { key: "Water Capacity", value: "1.5 Liters" },
      { key: "Material", value: "Food-grade, BPA-free ABS plastic" },
      { key: "Anti-Slip Base", value: "Heavy-weight double spill-proof rim" }
    ],
    isFeatured: false
  }
];

const DEFAULT_CUSTOMERS: Customer[] = [
  { phone: "9876543210", name: "Alice Johnson", createdAt: "2026-08-01T12:00:00Z", addresses: ["123 Green St, Forest Hills, NY 11375"] },
  { phone: "9988776655", name: "Bob Smith", createdAt: "2026-08-03T15:30:00Z", addresses: ["456 Beige Ave, Cream City, CA 90001"] }
];

const DEFAULT_ORDERS: Order[] = [
  {
    id: "ORD-1001",
    customerPhone: "9876543210",
    customerName: "Alice Johnson",
    items: [
      { productId: "prod-1", name: "Disposable Urination Bag (SolvrBag)", price: 15, quantity: 2 },
      { productId: "prod-2", name: "Anti-Fog Helmet Visor Insert (SolvrShield)", price: 25, quantity: 1 }
    ],
    totalPrice: 55,
    status: "Confirmed",
    date: "2026-08-04T10:15:00Z",
    shippingAddress: {
      name: "Alice Johnson",
      street: "123 Green St, Forest Hills",
      city: "Forest Hills",
      state: "New York",
      pincode: "11375",
      phone: "9876543210"
    }
  },
  {
    id: "ORD-1002",
    customerPhone: "9988776655",
    customerName: "Bob Smith",
    items: [
      { productId: "prod-3", name: "Ergonomic Posture Sensor (PostureSolvr)", price: 49, quantity: 1 }
    ],
    totalPrice: 49,
    status: "Pending",
    date: "2026-08-05T16:45:00Z",
    shippingAddress: {
      name: "Bob Smith",
      street: "456 Beige Ave, Cream City",
      city: "Cream City",
      state: "California",
      pincode: "90001",
      phone: "9988776655"
    }
  }
];

const DEFAULT_HERO_BANNERS: HeroBanner[] = [
  {
    id: "banner-1",
    titleLine1: "Travel Without Worry.",
    titleLine2: "Relief Anywhere. Anytime.",
    badgeText: "Featured Innovation",
    description: "India's innovative disposable urine bag designed for comfortable, hygienic, and hassle-free relief while travelling.",
    bullets: ["Unisex", "Leak-Proof", "Odour Lock", "Eco-Conscious Materials", "Made in India"],
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80",
    productLabel: "SolvrBag",
    productSubLabel: "Disposable Urination Bag",
    priceText: "₹15",
    originalPriceText: "₹30",
    buttons: [
      { text: "Buy Now", link: "/product/prod-1" },
      { text: "Learn More", link: "/product/prod-1" }
    ]
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<{ phone: string; name: string } | null>(null);
  const [adminUser, setAdminUser] = useState<{ username: string } | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [heroBanners, setHeroBanners] = useState<HeroBanner[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage on client mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProducts = localStorage.getItem("solvr_products");
      const storedCustomers = localStorage.getItem("solvr_customers");
      const storedOrders = localStorage.getItem("solvr_orders");
      const storedCart = localStorage.getItem("solvr_cart");
      const storedUser = localStorage.getItem("solvr_current_user");
      const storedAdmin = localStorage.getItem("solvr_admin_user");

      setProducts(storedProducts ? JSON.parse(storedProducts) : DEFAULT_PRODUCTS);
      setCustomers(storedCustomers ? JSON.parse(storedCustomers) : DEFAULT_CUSTOMERS);
      setOrders(storedOrders ? JSON.parse(storedOrders) : DEFAULT_ORDERS);
      
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      setCurrentUser(parsedUser);
      
      let initialCart: CartItem[] = [];
      if (parsedUser) {
        const storedUserCart = localStorage.getItem(`solvr_cart_${parsedUser.phone}`);
        initialCart = storedUserCart ? JSON.parse(storedUserCart) : [];
      } else {
        initialCart = storedCart ? JSON.parse(storedCart) : [];
      }
      setCart(initialCart);
      setAdminUser(storedAdmin ? JSON.parse(storedAdmin) : null);
      
      const storedHeroBanners = localStorage.getItem("solvr_hero_banners");
      setHeroBanners(storedHeroBanners ? JSON.parse(storedHeroBanners) : DEFAULT_HERO_BANNERS);

      setIsLoaded(true);
    }
  }, []);

  // Save to LocalStorage when states change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("solvr_products", JSON.stringify(products));
    }
  }, [products, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("solvr_customers", JSON.stringify(customers));
    }
  }, [customers, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("solvr_orders", JSON.stringify(orders));
    }
  }, [orders, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("solvr_hero_banners", JSON.stringify(heroBanners));
    }
  }, [heroBanners, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("solvr_cart", JSON.stringify(cart));
      if (currentUser) {
        localStorage.setItem(`solvr_cart_${currentUser.phone}`, JSON.stringify(cart));
      }
    }
  }, [cart, currentUser, isLoaded]);

  // Load user-specific cart when user logs in, or clear when logging out
  useEffect(() => {
    if (isLoaded) {
      if (currentUser) {
        const userCartStored = localStorage.getItem(`solvr_cart_${currentUser.phone}`);
        setCart(userCartStored ? JSON.parse(userCartStored) : []);
      } else {
        // Clear active cart upon logout
        setCart([]);
      }
    }
  }, [currentUser, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      if (currentUser) {
        localStorage.setItem("solvr_current_user", JSON.stringify(currentUser));
      } else {
        localStorage.removeItem("solvr_current_user");
      }
    }
  }, [currentUser, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      if (adminUser) {
        localStorage.setItem("solvr_admin_user", JSON.stringify(adminUser));
      } else {
        localStorage.removeItem("solvr_admin_user");
      }
    }
  }, [adminUser, isLoaded]);

  // Methods
  const addProduct = (newProd: Omit<Product, "id">) => {
    const product: Product = {
      ...newProd,
      id: `prod-${Date.now()}`
    };
    setProducts((prev) => [...prev, product]);
  };

  const updateProduct = (updatedProd: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProd.id ? updatedProd : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
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

  const loginCustomer = (phone: string, name?: string): boolean => {
    const cleanPhone = phone.trim().replace(/\D/g, "");
    
    // Look up customer
    const existing = customers.find((c) => c.phone.trim().replace(/\D/g, "") === cleanPhone);
    
    if (existing) {
      // Returning customer - login directly
      setCurrentUser({ phone: existing.phone, name: existing.name });
      return true;
    } else {
      // New customer - needs name
      if (!name || name.trim() === "") {
        // Signal that name is required
        return false;
      }
      // Create new customer
      const newCustomer: Customer = {
        phone: cleanPhone,
        name: name.trim(),
        createdAt: new Date().toISOString()
      };
      setCustomers((prev) => [...prev, newCustomer]);
      setCurrentUser({ phone: newCustomer.phone, name: newCustomer.name });
      return true;
    }
  };

  const logoutCustomer = () => {
    setCurrentUser(null);
  };

  const updateCustomer = (phone: string, name: string, addresses: string[]) => {
    setCustomers((prev) =>
      prev.map((c) => (c.phone === phone ? { ...c, name: name.trim(), addresses } : c))
    );
    if (currentUser && currentUser.phone === phone) {
      setCurrentUser({ phone, name: name.trim() });
    }
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

    // Deduct stock
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
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled") => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const addHeroBanner = (banner: Omit<HeroBanner, "id">) => {
    const newBanner: HeroBanner = {
      ...banner,
      id: `banner-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setHeroBanners((prev) => [...prev, newBanner]);
  };

  const updateHeroBanner = (banner: HeroBanner) => {
    setHeroBanners((prev) => prev.map((b) => (b.id === banner.id ? banner : b)));
  };

  const deleteHeroBanner = (id: string) => {
    setHeroBanners((prev) => prev.filter((b) => b.id !== id));
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
        deleteHeroBanner
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

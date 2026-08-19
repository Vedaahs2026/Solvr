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
  updateOrderStatus: (orderId: string, status: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled") => void;
  
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
  { email: "alice@gmail.com", phone: "9876543210", name: "Alice Johnson", createdAt: "2026-08-01T12:00:00Z", addresses: ["123 Green St, Forest Hills, NY 11375"] },
  { email: "bob@gmail.com", phone: "9988776655", name: "Bob Smith", createdAt: "2026-08-03T15:30:00Z", addresses: ["456 Beige Ave, Cream City, CA 90001"] }
];

const DEFAULT_ORDERS: Order[] = [
  {
    id: "ORD-1001",
    customerPhone: "9876543210",
    customerName: "Alice Johnson",
    customerEmail: "alice@gmail.com",
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
    customerEmail: "bob@gmail.com",
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

const DEFAULT_BLOGS: BlogPost[] = [
  {
    id: "blog-1",
    title: "Why Every Traveller Should Carry a Disposable Urine Bag",
    category: "Travel Essentials",
    tagline: "Unpredictable journeys require smart emergency preparations.",
    readTime: "3 min read",
    body: [
      "Whether you are embarking on a long road trip across India or taking a flight with unpredictable delays, bathroom access can become a critical challenge.",
      "A disposable urine bag is a compact, odourless, and spill-proof solution designed for emergency toilet situations when clean restrooms are unavailable or unreachable.",
      "With active gel technology that solidifies liquid instantly, carrying a SOLVR urine bag ensures comfort, dignity, and hygiene wherever your journey takes you."
    ],
    createdAt: "2026-08-01T10:00:00Z"
  },
  {
    id: "blog-2",
    title: "The Ultimate Travel Emergency Hygiene Kit",
    category: "Hygiene Tips",
    tagline: "Essential pack items to ensure cleanliness on the go.",
    readTime: "5 min read",
    body: [
      "A complete emergency kit is your best friend when exploring new destinations. Make sure to pack items like hand sanitizers, biodegradable wipes, and compact disposal bags.",
      "Including a SOLVR disposable urine bag in your pack protects you from unsanitary public toilets, letting you travel with complete peace of mind.",
      "Keep this kit in your dashboard glovebox or backpack side pocket for easy, immediate access during emergency traffic halts."
    ],
    createdAt: "2026-08-02T10:00:00Z"
  },
  {
    id: "blog-3",
    title: "How to Stay Hygienic During Long Road Trips",
    category: "Road Trips",
    tagline: "Tips and guidelines for long journeys on the highway.",
    readTime: "4 min read",
    body: [
      "Long-distance highway travel in India often comes with the dilemma of unhygienic roadside washrooms, which carry risks of UTI and other infections.",
      "Stay hydrated without fear by packing travel-friendly personal hygiene solutions that let you avoid holding your bladder for prolonged periods.",
      "Always dispose of waste responsibly in public bins, and carry eco-conscious travel essentials to minimize environmental footprints."
    ],
    createdAt: "2026-08-03T10:00:00Z"
  },
  {
    id: "blog-4",
    title: "Women Travel Safety Essentials",
    category: "Safety & Comfort",
    tagline: "Empowering female travellers with hygienic alternatives.",
    readTime: "4 min read",
    body: [
      "Safety during travel isn't just about security—it's also about health, comfort, and having access to clean, safe facilities at any hour.",
      "Using dirty public washrooms exposes women to significant bacterial infections. A personal disposable urine bag acts as an immediate hygienic substitute.",
      "Compact enough to fit into a clutch or purse, it provides a private and sanitary option whenever and wherever needed."
    ],
    createdAt: "2026-08-04T10:00:00Z"
  },
  {
    id: "blog-5",
    title: "Best Emergency Travel Products in India",
    category: "Product Guides",
    tagline: "Top-rated gadgets and items for modern Indian travellers.",
    readTime: "6 min read",
    body: [
      "The Indian travel landscape is rapidly changing, and modern travellers are prioritizing convenience and emergency preparedness.",
      "Top items include portable power banks, compact water purifiers, and solidifying disposable urine bags.",
      "SOLVR leads the way by designing products tailored for local travel bottlenecks, traffic jams, and remote adventure trails."
    ],
    createdAt: "2026-08-05T10:00:00Z"
  },
  {
    id: "blog-6",
    title: "Toilet Emergencies During Traffic Jams",
    category: "Commuting",
    tagline: "Surviving peak hour gridlocks with smart preparation.",
    readTime: "3 min read",
    body: [
      "Getting stuck in a multi-hour traffic jam in metropolitan cities like Bangalore, Mumbai, or Delhi is a common frustration.",
      "Holding in urine can lead to discomfort and long-term health issues. An emergency solidifying urine bag is a clean, spill-proof alternative you can use inside your vehicle.",
      "Designed with superabsorbent pads that turn liquid into gel instantly, it is completely leakproof and keeps your vehicle clean."
    ],
    createdAt: "2026-08-06T10:00:00Z"
  },
  {
    id: "blog-7",
    title: "Why Hygiene Matters While Travelling",
    category: "Health & Wellness",
    tagline: "Protecting your body from common travel illness factors.",
    readTime: "4 min read",
    body: [
      "Travel exposes our immune systems to new environments, foods, and pathogens. Maintaining a high level of hygiene is key to preventing illness.",
      "Wash your hands frequently, sanitize shared spaces, and avoid contact with contaminated surfaces in public toilets.",
      "By carrying your own sanitary solutions, you take control of your wellness and ensure your holiday isn't ruined by avoidable infections."
    ],
    createdAt: "2026-08-07T10:00:00Z"
  },
  {
    id: "blog-8",
    title: "Made in India Innovation: The Story Behind SOLVR",
    category: "Our Story",
    tagline: "How we design products that solve local everyday challenges.",
    readTime: "5 min read",
    body: [
      "SOLVR was born out of a simple observation: people buy solutions, not just products. We saw commuters struggling with poor road infrastructure and decided to act.",
      "Our team of engineers in India spent months testing spillproof materials and high-absorption polymers to create a world-class urine bag.",
      "We pride ourselves on local design and manufacturing, creating products that directly improve the lives of millions of Indian citizens."
    ],
    createdAt: "2026-08-08T10:00:00Z"
  },
  {
    id: "blog-9",
    title: "How Disposable Urine Bags Work",
    category: "How It Works",
    tagline: "A closer look at the science behind instant solidification.",
    readTime: "3 min read",
    body: [
      "At first glance, a disposable urine bag looks simple, but it contains advanced superabsorbent polymer (SAP) technology.",
      "When liquid enters the bag, the polymer instantly absorbs it—up to several hundred times its own weight—and turns it into a firm, leakproof gel.",
      "The bag is designed with a spillproof collar and sealed side locks, making it safe to handle and throw away in any standard trash bin."
    ],
    createdAt: "2026-08-09T10:00:00Z"
  },
  {
    id: "blog-10",
    title: "Smart Travel Essentials for Families",
    category: "Family Travel",
    tagline: "Keeping kids and elderly relatives comfortable during trips.",
    readTime: "5 min read",
    body: [
      "Travelling with children or elderly family members means unexpected bathroom emergencies can happen at any moment.",
      "Rather than rushing to find a clean restroom, keeping a box of SOLVR disposable bags in your luggage keeps everyone safe and comfortable.",
      "It is a unisex, easy-to-use solution that reduces travel stress and allows you to enjoy family moments to the fullest."
    ],
    createdAt: "2026-08-10T10:00:00Z"
  }
];

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

  // Load from LocalStorage on client mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProducts = localStorage.getItem("solvr_products");
      const storedCustomers = localStorage.getItem("solvr_customers");
      const storedOrders = localStorage.getItem("solvr_orders");
      const storedCart = localStorage.getItem("solvr_cart");
      const storedUser = localStorage.getItem("solvr_current_user");
      const storedAdmin = localStorage.getItem("solvr_admin_user");

      let initialProducts: Product[] = DEFAULT_PRODUCTS;
      if (storedProducts) {
        try {
          const parsedProducts: Product[] = JSON.parse(storedProducts);
          const existingProdIds = new Set(parsedProducts.map((p) => p.id));
          const missingDefaults = DEFAULT_PRODUCTS.filter((dp) => !existingProdIds.has(dp.id));
          initialProducts = [...parsedProducts, ...missingDefaults];
        } catch (e) {
          initialProducts = DEFAULT_PRODUCTS;
        }
      }
      setProducts(initialProducts);

      setCustomers(storedCustomers ? JSON.parse(storedCustomers) : DEFAULT_CUSTOMERS);
      setOrders(storedOrders ? JSON.parse(storedOrders) : DEFAULT_ORDERS);
      
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      setCurrentUser(parsedUser);
      
      let initialCart: CartItem[] = [];
      if (parsedUser) {
        const storedUserCart = localStorage.getItem(`solvr_cart_${parsedUser.email}`);
        initialCart = storedUserCart ? JSON.parse(storedUserCart) : [];
      } else {
        initialCart = storedCart ? JSON.parse(storedCart) : [];
      }
      setCart(initialCart);
      setAdminUser(storedAdmin ? JSON.parse(storedAdmin) : null);
      
      const storedHeroBanners = localStorage.getItem("solvr_hero_banners");
      let initialHeroBanners: HeroBanner[] = DEFAULT_HERO_BANNERS;
      if (storedHeroBanners) {
        try {
          const parsedBanners: HeroBanner[] = JSON.parse(storedHeroBanners);
          const existingBannerIds = new Set(parsedBanners.map((b) => b.id));
          const missingBanners = DEFAULT_HERO_BANNERS.filter((db) => !existingBannerIds.has(db.id));
          initialHeroBanners = [...parsedBanners, ...missingBanners];
        } catch (e) {
          initialHeroBanners = DEFAULT_HERO_BANNERS;
        }
      }
      setHeroBanners(initialHeroBanners);

      const storedBlogs = localStorage.getItem("solvr_blogs");
      let initialBlogs: BlogPost[] = DEFAULT_BLOGS;
      if (storedBlogs) {
        try {
          const parsedBlogs: BlogPost[] = JSON.parse(storedBlogs);
          const existingBlogIds = new Set(parsedBlogs.map((b) => b.id));
          const missingBlogs = DEFAULT_BLOGS.filter((db) => !existingBlogIds.has(db.id));
          initialBlogs = [...parsedBlogs, ...missingBlogs];
        } catch (e) {
          initialBlogs = DEFAULT_BLOGS;
        }
      }
      setBlogs(initialBlogs);

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
      localStorage.setItem("solvr_blogs", JSON.stringify(blogs));
    }
  }, [blogs, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("solvr_cart", JSON.stringify(cart));
      if (currentUser) {
        localStorage.setItem(`solvr_cart_${currentUser.email}`, JSON.stringify(cart));
      }
    }
  }, [cart, currentUser, isLoaded]);

  // Load user-specific cart when user logs in, or clear when logging out
  useEffect(() => {
    if (isLoaded) {
      if (currentUser) {
        const userCartStored = localStorage.getItem(`solvr_cart_${currentUser.email}`);
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

  const loginCustomer = (email: string, name?: string, phone?: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Look up customer
    const existing = customers.find((c) => c.email && c.email.trim().toLowerCase() === cleanEmail);
    
    if (existing) {
      // Returning customer - login directly
      setCurrentUser({ email: existing.email, phone: existing.phone, name: existing.name });
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
        createdAt: new Date().toISOString()
      };
      setCustomers((prev) => [...prev, newCustomer]);
      setCurrentUser({ email: newCustomer.email, phone: newCustomer.phone, name: newCustomer.name });
      return true;
    }
  };

  const logoutCustomer = () => {
    setCurrentUser(null);
  };

  const updateCustomer = (email: string, name: string, phone: string, addresses: string[]) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim().replace(/\D/g, "");
    setCustomers((prev) =>
      prev.map((c) => (c.email && c.email.trim().toLowerCase() === cleanEmail ? { ...c, name: name.trim(), phone: cleanPhone, addresses } : c))
    );
    if (currentUser && currentUser.email && currentUser.email.trim().toLowerCase() === cleanEmail) {
      setCurrentUser({ email: cleanEmail, phone: cleanPhone, name: name.trim() });
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

  const addBlog = (blogData: Omit<BlogPost, "id" | "createdAt">) => {
    const newBlog: BlogPost = {
      ...blogData,
      id: `blog-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setBlogs((prev) => [newBlog, ...prev]);
  };

  const updateBlog = (updatedBlog: BlogPost) => {
    setBlogs((prev) => prev.map((b) => (b.id === updatedBlog.id ? updatedBlog : b)));
  };

  const deleteBlog = (id: string) => {
    setBlogs((prev) => prev.filter((b) => b.id !== id));
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

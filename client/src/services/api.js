import { products as catalogProducts } from '../data/products';

// Mock API Service - Returns Promises to easily replace with real API later
const mockProducts = [...catalogProducts];

// Mock Categories Data
const mockCategories = [
  {
    id: 'eyeglasses',
    name: 'Eyeglasses',
    description: 'Stylish frames for everyday wear',
    icon: 'eye',
    count: mockProducts.filter(p => p.category === 'eyeglasses').length
  },
  {
    id: 'sunglasses',
    name: 'Sunglasses',
    description: 'UV protection with style',
    icon: 'sun',
    count: mockProducts.filter(p => p.category === 'sunglasses').length
  },
  {
    id: 'lenses',
    name: 'Contact Lenses',
    description: 'Comfort and clarity',
    icon: 'package',
    count: mockProducts.filter(p => p.category === 'lenses').length
  }
];

// Mock User Data (stored in localStorage)
let currentUser = null;

// Delay function to simulate API latency
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// API Service
export const apiService = {
  // Products
  getAllProducts: async () => {
    await delay(300);
    return Promise.resolve([...mockProducts]);
  },

  getProductById: async (id) => {
    await delay(200);
    const product = mockProducts.find(p => p.id === id);
    return product ? Promise.resolve(product) : Promise.reject(new Error('Product not found'));
  },

  getProductsByCategory: async (category) => {
    await delay(300);
    return Promise.resolve(mockProducts.filter(p => p.category === category));
  },

  getTrendingProducts: async () => {
    await delay(300);
    return Promise.resolve(mockProducts.filter(p => p.trending));
  },

  filterProducts: async (filters) => {
    await delay(300);
    let filtered = [...mockProducts];

    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    if (filters.frameShape && filters.frameShape.length > 0) {
      filtered = filtered.filter(p => filters.frameShape.includes(p.frameShape));
    }

    if (filters.frameSize && filters.frameSize.length > 0) {
      filtered = filtered.filter(p => filters.frameSize.includes(p.frameSize));
    }

    if (filters.frameMaterial && filters.frameMaterial.length > 0) {
      filtered = filtered.filter(p => filters.frameMaterial.includes(p.frameMaterial));
    }

    if (filters.colors && filters.colors.length > 0) {
      filtered = filtered.filter(p => 
        p.colors.some(color => filters.colors.includes(color))
      );
    }

    if (filters.gender && filters.gender !== 'all') {
      filtered = filtered.filter(p => p.gender === filters.gender || p.gender === 'unisex');
    }

    if (filters.priceRange) {
      filtered = filtered.filter(p => 
        p.price >= filters.priceRange.min && p.price <= filters.priceRange.max
      );
    }

    if (filters.inStockOnly) {
      filtered = filtered.filter(p => p.inStock);
    }

    // Sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'popularity':
          filtered.sort((a, b) => b.reviews - a.reviews);
          break;
        case 'discount':
          filtered.sort((a, b) => b.discount - a.discount);
          break;
        default:
          break;
      }
    }

    return Promise.resolve(filtered);
  },

  searchProducts: async (query) => {
    await delay(300);
    const lowerQuery = query.toLowerCase();
    return Promise.resolve(
      mockProducts.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.brand.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery)
      )
    );
  },

  // Categories
  getAllCategories: async () => {
    await delay(200);
    return Promise.resolve([...mockCategories]);
  },

  // Authentication
  login: async (email, password) => {
    await delay(500);
    
    // Simple mock validation
    if (email && password) {
      const user = {
        id: '1',
        name: 'Guest User',
        email: email,
        phone: '+91 98765 43210',
        avatar: null
      };
      
      currentUser = user;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isLoggedIn', 'true');
      
      return Promise.resolve({ user, token: 'mock-jwt-token' });
    }
    
    return Promise.reject(new Error('Invalid credentials'));
  },

  signup: async (userData) => {
    await delay(500);
    
    if (userData.email && userData.password && userData.name) {
      const user = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        avatar: null
      };
      
      currentUser = user;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isLoggedIn', 'true');
      
      return Promise.resolve({ user, token: 'mock-jwt-token' });
    }
    
    return Promise.reject(new Error('Invalid user data'));
  },

  logout: async () => {
    await delay(200);
    currentUser = null;
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    return Promise.resolve();
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (userStr && isLoggedIn) {
      return JSON.parse(userStr);
    }
    return null;
  },

  isAuthenticated: () => {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
};

export default apiService;

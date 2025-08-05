import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // UI State
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  
  // Real-time Data
  products: Product[];
  orders: Order[];
  predictions: MarketIntelligence[];
  
  // Connection State
  isOnline: boolean;
  lastSync: Date | null;
  
  // Actions
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  updateProducts: (products: Product[]) => void;
  updateOrders: (orders: Order[]) => void;
  updatePredictions: (predictions: MarketIntelligence[]) => void;
  setOnlineStatus: (status: boolean) => void;
  setLastSync: (date: Date) => void;
}

interface Product {
  _id: string;
  name: string;
  category: string;
  pricing: {
    current_price: number;
    predicted_price?: number;
  };
  inventory: {
    available: number;
  };
  market_intelligence?: {
    arbitrage_opportunities: Array<{
      market: string;
      potential_profit: number;
      confidence: number;
    }>;
  };
}

interface Order {
  _id: string;
  order_number: string;
  client: {
    company_name: string;
  };
  status_tracking: {
    current_status: string;
  };
  ai_analysis?: {
    predicted_total_profit: number;
    risk_score: number;
  };
}

interface MarketIntelligence {
  _id: string;
  product_id: string;
  predictions: {
    price_3_days: {
      value: number;
      confidence: number;
    };
  };
  arbitrage_opportunities: Array<{
    target_market: string;
    net_profit: number;
    confidence: number;
  }>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: 'light',
      sidebarCollapsed: false,
      products: [],
      orders: [],
      predictions: [],
      isOnline: true,
      lastSync: null,
      
      // Actions
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ 
        sidebarCollapsed: !state.sidebarCollapsed 
      })),
      updateProducts: (products) => set({ 
        products, 
        lastSync: new Date() 
      }),
      updateOrders: (orders) => set({ 
        orders, 
        lastSync: new Date() 
      }),
      updatePredictions: (predictions) => set({ 
        predictions, 
        lastSync: new Date() 
      }),
      setOnlineStatus: (isOnline) => set({ isOnline }),
      setLastSync: (lastSync) => set({ lastSync }),
    }),
    {
      name: 'exportpro-app-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
); 
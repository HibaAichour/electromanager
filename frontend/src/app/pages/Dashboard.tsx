import { Package, TrendingUp, DollarSign, ShoppingBag, AlertCircle } from "lucide-react";
import { StatsCard } from "../components/StatsCard";
import { useAuth } from "../hooks/useAuth";
import { Store } from "../types/auth";

export function Dashboard() {
  const { currentUser, userRole, userStoreId, hasPermission } = useAuth();

  // Mock data for different stores
  const allStoresData: Record<number, {
    stats: Array<{
      title: string;
      value: string;
      icon: any;
      color: string;
      trend: string;
      neonColor: 'blue' | 'purple' | 'indigo';
    }>;
    recentSales: Array<{
      id: string;
      product: string;
      amount: string;
      time: string;
    }>;
    lowStockProducts: Array<{
      name: string;
      stock: number;
      status: 'critique' | 'bas';
    }>;
  }> = {
    1: { // Paris Centre
      stats: [
        { title: "Total Produits", value: "1,248", icon: Package, color: "bg-gradient-to-br from-blue-500 to-blue-600", trend: "+12% ce mois", neonColor: 'blue' as const },
        { title: "Stock Total", value: "8,562", icon: ShoppingBag, color: "bg-gradient-to-br from-green-500 to-green-600", trend: "+5% ce mois", neonColor: 'indigo' as const },
        { title: "Ventes du Jour", value: "156", icon: TrendingUp, color: "bg-gradient-to-br from-purple-500 to-purple-600", trend: "+8% aujourd'hui", neonColor: 'purple' as const },
        { title: "Revenus", value: "45,890€", icon: DollarSign, color: "bg-gradient-to-br from-orange-500 to-orange-600", trend: "+15% ce mois", neonColor: 'blue' as const },
      ],
      recentSales: [
        { id: "VT-001", product: "Laptop Dell XPS 15", amount: "1,299€", time: "Il y a 5 min" },
        { id: "VT-002", product: "iPhone 14 Pro", amount: "1,199€", time: "Il y a 12 min" },
      ],
      lowStockProducts: [
        { name: "AirPods Pro", stock: 5, status: "critique" },
        { name: "iPad Air", stock: 12, status: "bas" },
      ]
    },
    2: { // Lyon Part-Dieu
      stats: [
        { title: "Total Produits", value: "987", icon: Package, color: "bg-gradient-to-br from-blue-500 to-blue-600", trend: "+8% ce mois", neonColor: 'blue' as const },
        { title: "Stock Total", value: "6,234", icon: ShoppingBag, color: "bg-gradient-to-br from-green-500 to-green-600", trend: "+3% ce mois", neonColor: 'indigo' as const },
        { title: "Ventes du Jour", value: "89", icon: TrendingUp, color: "bg-gradient-to-br from-purple-500 to-purple-600", trend: "+5% aujourd'hui", neonColor: 'purple' as const },
        { title: "Revenus", value: "32,450€", icon: DollarSign, color: "bg-gradient-to-br from-orange-500 to-orange-600", trend: "+10% ce mois", neonColor: 'blue' as const },
      ],
      recentSales: [
        { id: "VT-003", product: "Samsung Galaxy S23", amount: "899€", time: "Il y a 25 min" },
        { id: "VT-004", product: "MacBook Air M2", amount: "1,499€", time: "Il y a 1h" },
      ],
      lowStockProducts: [
        { name: "Apple Watch", stock: 8, status: "critique" },
        { name: "AirPods Max", stock: 15, status: "bas" },
      ]
    },
    3: { // Marseille Vieux-Port
      stats: [
        { title: "Total Produits", value: "756", icon: Package, color: "bg-gradient-to-br from-blue-500 to-blue-600", trend: "+15% ce mois", neonColor: 'blue' as const },
        { title: "Stock Total", value: "4,123", icon: ShoppingBag, color: "bg-gradient-to-br from-green-500 to-green-600", trend: "+7% ce mois", neonColor: 'indigo' as const },
        { title: "Ventes du Jour", value: "67", icon: TrendingUp, color: "bg-gradient-to-br from-purple-500 to-purple-600", trend: "+12% aujourd'hui", neonColor: 'purple' as const },
        { title: "Revenus", value: "28,760€", icon: DollarSign, color: "bg-gradient-to-br from-orange-500 to-orange-600", trend: "+18% ce mois", neonColor: 'blue' as const },
      ],
      recentSales: [
        { id: "VT-005", product: "iPad Pro", amount: "1,099€", time: "Il y a 30 min" },
        { id: "VT-006", product: "AirPods Pro", amount: "249€", time: "Il y a 45 min" },
      ],
      lowStockProducts: [
        { name: "iPhone 14", stock: 3, status: "critique" },
        { name: "Mac Mini", stock: 10, status: "bas" },
      ]
    }
  };

  // Global stats for administrators
  const globalStats: Array<{
    title: string;
    value: string;
    icon: any;
    color: string;
    trend: string;
    neonColor: 'blue' | 'purple' | 'indigo';
  }> = [
    { title: "Total Produits", value: "2,991", icon: Package, color: "bg-gradient-to-br from-blue-500 to-blue-600", trend: "+11% ce mois", neonColor: 'blue' as const },
    { title: "Stock Total", value: "18,919", icon: ShoppingBag, color: "bg-gradient-to-br from-green-500 to-green-600", trend: "+5% ce mois", neonColor: 'indigo' as const },
    { title: "Ventes du Jour", value: "312", icon: TrendingUp, color: "bg-gradient-to-br from-purple-500 to-purple-600", trend: "+8% aujourd'hui", neonColor: 'purple' as const },
    { title: "Revenus", value: "107,100€", icon: DollarSign, color: "bg-gradient-to-br from-orange-500 to-orange-600", trend: "+14% ce mois", neonColor: 'blue' as const },
  ];

  // Global recent sales for administrators
  const globalRecentSales: Array<{
    id: string;
    product: string;
    amount: string;
    time: string;
    store: string;
  }> = [
    { id: "VT-001", product: "Laptop Dell XPS 15", amount: "1,299€", time: "Il y a 5 min", store: "Paris Centre" },
    { id: "VT-002", product: "iPhone 14 Pro", amount: "1,199€", time: "Il y a 12 min", store: "Paris Centre" },
    { id: "VT-003", product: "Samsung Galaxy S23", amount: "899€", time: "Il y a 25 min", store: "Lyon Part-Dieu" },
    { id: "VT-004", product: "MacBook Air M2", amount: "1,499€", time: "Il y a 1h", store: "Lyon Part-Dieu" },
  ];

  // Global low stock products for administrators
  const globalLowStockProducts: Array<{
    name: string;
    stock: number;
    status: 'critique' | 'bas';
    store: string;
  }> = [
    { name: "AirPods Pro", stock: 5, status: "critique", store: "Paris Centre" },
    { name: "iPad Air", stock: 12, status: "bas", store: "Paris Centre" },
    { name: "Apple Watch", stock: 8, status: "critique", store: "Lyon Part-Dieu" },
    { name: "iPhone 14", stock: 3, status: "critique", store: "Marseille Vieux-Port" },
  ];

  // Get data based on user role
  let stats: Array<{
    title: string;
    value: string;
    icon: any;
    color: string;
    trend: string;
    neonColor: 'blue' | 'purple' | 'indigo';
  }>;
  let recentSales: Array<{
    id: string;
    product: string;
    amount: string;
    time: string;
    store?: string;
  }>;
  let lowStockProducts: Array<{
    name: string;
    stock: number;
    status: 'critique' | 'bas';
    store?: string;
  }>;
  
  if (userRole === 'administrateur') {
    stats = globalStats;
    recentSales = globalRecentSales;
    lowStockProducts = globalLowStockProducts;
  } else if (userStoreId && allStoresData[userStoreId]) {
    stats = allStoresData[userStoreId].stats;
    recentSales = allStoresData[userStoreId].recentSales;
    lowStockProducts = allStoresData[userStoreId].lowStockProducts;
  } else {
    // Fallback data
    stats = globalStats;
    recentSales = globalRecentSales;
    lowStockProducts = globalLowStockProducts;
  }

  return (
    <div className="space-y-6">
      {/* Store Info for Non-Admin Users */}
      {userRole !== 'administrateur' && userStoreId && (
        <div className="glass p-4 border border-white/20 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold">{userStoreId}</span>
            </div>
            <div>
              <h3 className="text-white font-semibold font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                {allStoresData[userStoreId] ? 
                  `Magasin: ${userStoreId === 1 ? 'Paris Centre' : userStoreId === 2 ? 'Lyon Part-Dieu' : 'Marseille Vieux-Port'}` 
                  : 'Magasin assigné'}
              </h3>
              <p className="text-gray-400 text-sm font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                Accès limité à votre magasin
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <div className="glass p-6 border border-white/20">
          <h3 className="font-semibold text-xl mb-6 text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
            Ventes Récentes
          </h3>
          <div className="space-y-4">
            {recentSales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between pb-4 border-b border-white/10 last:border-0">
                <div>
                  <p className="font-medium text-white font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                    {sale.product}
                  </p>
                  <p className="text-sm text-gray-400 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                    {sale.id} • {sale.time}
                    {sale.store && (
                      <span className="ml-2 text-blue-400">• {sale.store}</span>
                    )}
                  </p>
                </div>
                <p className="font-semibold text-green-400 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                  {sale.amount}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="glass p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle size={24} className="text-orange-400 neon-glow-orange" />
            <h3 className="font-semibold text-xl text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
              Alertes Stock Bas
            </h3>
          </div>
          <div className="space-y-4">
            {lowStockProducts.map((product) => (
              <div key={product.name} className="flex items-center justify-between pb-4 border-b border-white/10 last:border-0">
                <div>
                  <p className="font-medium text-white font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-400 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                    Stock restant: {product.stock} unités
                    {product.store && (
                      <span className="ml-2 text-blue-400">• {product.store}</span>
                    )}
                  </p>
                </div>
                <span className={`px-4 py-2 rounded-full text-xs font-bold font-inter ${
                  product.status === "critique"
                    ? "bg-red-500/20 text-red-400 border border-red-500/30 pulse-badge"
                    : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                }`} style={{ fontFamily: 'var(--font-inter)' }}>
                  {product.status === "critique" ? "Critique" : "Bas"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

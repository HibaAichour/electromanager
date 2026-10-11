import { useState } from "react";
import { Package, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";

interface StockItem {
  id: number;
  product: string;
  sku: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  lastUpdate: string;
  status: "good" | "low" | "critical";
}

export function Stock() {
  const [stockItems] = useState<StockItem[]>([
    {
      id: 1,
      product: "Laptop Dell XPS 15",
      sku: "LAP-001",
      currentStock: 45,
      minStock: 10,
      maxStock: 100,
      lastUpdate: "20/04/2026",
      status: "good"
    },
    {
      id: 2,
      product: "iPhone 14 Pro",
      sku: "PHN-002",
      currentStock: 120,
      minStock: 30,
      maxStock: 150,
      lastUpdate: "20/04/2026",
      status: "good"
    },
    {
      id: 3,
      product: "AirPods Pro",
      sku: "AUD-005",
      currentStock: 5,
      minStock: 15,
      maxStock: 50,
      lastUpdate: "19/04/2026",
      status: "critical"
    },
    {
      id: 4,
      product: "iPad Air",
      sku: "TAB-006",
      currentStock: 12,
      minStock: 10,
      maxStock: 50,
      lastUpdate: "19/04/2026",
      status: "low"
    },
    {
      id: 5,
      product: "Apple Watch Series 8",
      sku: "WAT-007",
      currentStock: 8,
      minStock: 10,
      maxStock: 40,
      lastUpdate: "18/04/2026",
      status: "critical"
    },
    {
      id: 6,
      product: "MacBook Air M2",
      sku: "LAP-004",
      currentStock: 32,
      minStock: 15,
      maxStock: 80,
      lastUpdate: "20/04/2026",
      status: "good"
    },
  ]);

  const stockStats = {
    total: stockItems.reduce((acc, item) => acc + item.currentStock, 0),
    critical: stockItems.filter(item => item.status === "critical").length,
    low: stockItems.filter(item => item.status === "low").length,
    good: stockItems.filter(item => item.status === "good").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Gestion du Stock</h2>
        <p className="text-gray-500 mt-1">Suivez et gérez vos niveaux de stock</p>
      </div>

      {/* Stock Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Stock Total</p>
              <p className="text-2xl font-bold text-gray-800">{stockStats.total}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center">
              <Package size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Stock Bon</p>
              <p className="text-2xl font-bold text-green-600">{stockStats.good}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center">
              <TrendingUp size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Stock Bas</p>
              <p className="text-2xl font-bold text-orange-600">{stockStats.low}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center">
              <TrendingDown size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Stock Critique</p>
              <p className="text-2xl font-bold text-red-600">{stockStats.critical}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-red-500 flex items-center justify-center">
              <AlertTriangle size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-semibold text-lg mb-4 text-gray-800">Détails du Stock</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Produit</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">SKU</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Stock Actuel</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Min/Max</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Statut</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Dernière MAJ</th>
              </tr>
            </thead>
            <tbody>
              {stockItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-medium text-gray-800">{item.product}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{item.sku}</td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-gray-800">{item.currentStock}</span>
                    <span className="text-sm text-gray-500"> unités</span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {item.minStock} / {item.maxStock}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === "critical"
                        ? "bg-red-100 text-red-700"
                        : item.status === "low"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-green-100 text-green-700"
                    }`}>
                      {item.status === "critical" ? "Critique" : item.status === "low" ? "Bas" : "Bon"}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">{item.lastUpdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

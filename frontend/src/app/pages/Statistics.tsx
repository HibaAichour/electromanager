import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, DollarSign, Package, ShoppingCart } from "lucide-react";

export function Statistics() {
  const monthlySales = [
    { month: "Jan", ventes: 4200, revenus: 45000 },
    { month: "Fév", ventes: 3800, revenus: 42000 },
    { month: "Mar", ventes: 5100, revenus: 58000 },
    { month: "Avr", ventes: 4600, revenus: 52000 },
    { month: "Mai", ventes: 5500, revenus: 62000 },
    { month: "Juin", ventes: 6200, revenus: 71000 },
  ];

  const topProducts = [
    { name: "iPhone 14 Pro", ventes: 245 },
    { name: "MacBook Air M2", ventes: 189 },
    { name: "Samsung Galaxy S23", ventes: 156 },
    { name: "iPad Air", ventes: 134 },
    { name: "AirPods Pro", ventes: 98 },
  ];

  const categoryDistribution = [
    { name: "Smartphones", value: 35, color: "#3b82f6" },
    { name: "Ordinateurs", value: 28, color: "#8b5cf6" },
    { name: "Audio", value: 15, color: "#10b981" },
    { name: "Tablettes", value: 12, color: "#f59e0b" },
    { name: "Montres", value: 10, color: "#ef4444" },
  ];

  const stats = [
    { title: "Ventes Totales", value: "30,400", icon: ShoppingCart, color: "bg-blue-500" },
    { title: "Revenus Totaux", value: "330,000€", icon: DollarSign, color: "bg-green-500" },
    { title: "Produits Vendus", value: "1,248", icon: Package, color: "bg-purple-500" },
    { title: "Croissance", value: "+18%", icon: TrendingUp, color: "bg-orange-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Statistiques</h2>
        <p className="text-gray-500 mt-1">Analysez les performances de vos magasins</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Sales Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-lg mb-4 text-gray-800">Ventes et Revenus Mensuels</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="ventes" stroke="#3b82f6" strokeWidth={2} name="Ventes" />
              <Line yAxisId="right" type="monotone" dataKey="revenus" stroke="#10b981" strokeWidth={2} name="Revenus (€)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-lg mb-4 text-gray-800">Répartition par Catégorie</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-semibold text-lg mb-4 text-gray-800">Produits les Plus Vendus</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topProducts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="ventes" fill="#3b82f6" name="Nombre de Ventes" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

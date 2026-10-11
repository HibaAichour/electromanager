import { useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
}

export function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products] = useState<Product[]>([
    { id: 1, name: "Laptop Dell XPS 15", category: "Ordinateurs", price: 1299, stock: 45, sku: "LAP-001" },
    { id: 2, name: "iPhone 14 Pro", category: "Smartphones", price: 1199, stock: 120, sku: "PHN-002" },
    { id: 3, name: "Samsung Galaxy S23", category: "Smartphones", price: 899, stock: 85, sku: "PHN-003" },
    { id: 4, name: "MacBook Air M2", category: "Ordinateurs", price: 1499, stock: 32, sku: "LAP-004" },
    { id: 5, name: "AirPods Pro", category: "Audio", price: 279, stock: 5, sku: "AUD-005" },
    { id: 6, name: "iPad Air", category: "Tablettes", price: 649, stock: 12, sku: "TAB-006" },
    { id: 7, name: "Apple Watch Series 8", category: "Montres", price: 449, stock: 8, sku: "WAT-007" },
    { id: 8, name: "Sony WH-1000XM5", category: "Audio", price: 399, stock: 28, sku: "AUD-008" },
  ]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestion des Produits</h2>
          <p className="text-gray-500 mt-1">Gérez votre catalogue de produits</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={20} />
          Ajouter un produit
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom, catégorie ou SKU..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">SKU</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Nom du Produit</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Catégorie</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Prix</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Stock</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 text-sm text-gray-600">{product.sku}</td>
                  <td className="py-4 px-4 font-medium text-gray-800">{product.name}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{product.category}</td>
                  <td className="py-4 px-4 font-semibold text-blue-600">{product.price}€</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.stock < 10
                        ? "bg-red-100 text-red-700"
                        : product.stock < 30
                        ? "bg-orange-100 text-orange-700"
                        : "bg-green-100 text-green-700"
                    }`}>
                      {product.stock} unités
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit size={16} className="text-blue-600" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun produit trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}

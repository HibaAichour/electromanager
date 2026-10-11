import { useState } from "react";
import { Plus, Minus, ShoppingCart, X } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  sku: string;
}

interface CartItem extends Product {
  quantity: number;
}

export function Sales() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products] = useState<Product[]>([
    { id: 1, name: "Laptop Dell XPS 15", price: 1299, stock: 45, sku: "LAP-001" },
    { id: 2, name: "iPhone 14 Pro", price: 1199, stock: 120, sku: "PHN-002" },
    { id: 3, name: "Samsung Galaxy S23", price: 899, stock: 85, sku: "PHN-003" },
    { id: 4, name: "MacBook Air M2", price: 1499, stock: 32, sku: "LAP-004" },
    { id: 5, name: "AirPods Pro", price: 279, stock: 5, sku: "AUD-005" },
    { id: 6, name: "iPad Air", price: 649, stock: 12, sku: "TAB-006" },
  ]);

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        if (newQuantity > 0 && newQuantity <= item.stock) {
          return { ...item, quantity: newQuantity };
        }
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cart.length > 0) {
      alert(`Vente enregistrée avec succès!\nTotal: ${calculateTotal().toFixed(2)}€`);
      setCart([]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Nouvelle Vente</h2>
        <p className="text-gray-500 mt-1">Enregistrez une nouvelle transaction</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products List */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-lg mb-4 text-gray-800">Produits Disponibles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer"
                onClick={() => addToCart(product)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800">{product.name}</h4>
                  <Plus size={20} className="text-blue-600" />
                </div>
                <p className="text-sm text-gray-500 mb-2">{product.sku}</p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-blue-600">{product.price}€</span>
                  <span className="text-sm text-gray-500">{product.stock} en stock</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shopping Cart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart size={20} className="text-blue-600" />
            <h3 className="font-semibold text-lg text-gray-800">Panier</h3>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Panier vide</p>
              <p className="text-sm text-gray-400 mt-1">Sélectionnez des produits</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-500">{item.sku}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 hover:bg-red-50 rounded transition-colors"
                      >
                        <X size={16} className="text-red-600" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="font-semibold text-blue-600">
                        {(item.price * item.quantity).toFixed(2)}€
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-800">Total</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {calculateTotal().toFixed(2)}€
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Valider la vente
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

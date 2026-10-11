import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Home,
  Package,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Store as StoreIcon,
  LogOut,
  BarChart3,
  Users,
  Settings,
  Plus,
  Edit,
  Trash2,
  Search
} from 'lucide-react';
import { useAuth } from "../hooks/useAuth";
import { useData, Product, Sale } from "../hooks/useData";
import { Modal } from "../components/Modal";
import { Alert } from "../components/Alert";
import { AssistantIA } from "../components/AssistantIA";

export function DashboardGerant() {
  const navigate = useNavigate();
  const { currentUser, logout, userStoreId } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; message: string } | null>(null);

  // Product CRUD states
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    category: '',
    price: 0,
    stock: 0,
    storeId: userStoreId || 1,
    description: '',
    sku: ''
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Sale recording states
  const [saleModalOpen, setSaleModalOpen] = useState(false);
  const [saleForm, setSaleForm] = useState({
    productId: 0,
    quantity: 1,
    searchTerm: ''
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Settings states
  const [settingsForm, setSettingsForm] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Data hook
  const {
    products,
    sales,
    users,
    addSale,
    updateProduct,
    getProductsByStore,
    getSalesByStore,
    getUsersByStore
  } = useData();

  // Get store-specific data
  const storeProducts = getProductsByStore(userStoreId || 1);
  const storeSales = getSalesByStore(userStoreId || 1);
  const storeEmployees = getUsersByStore(userStoreId || 1);

  // Helper function
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `Il y a ${diffDays}j`;
  };

  // Product CRUD handlers
  const handleOpenProductModal = () => {
    setProductModalOpen(true);
    setProductForm({
      name: '',
      category: '',
      price: 0,
      stock: 0,
      storeId: userStoreId || 1,
      description: '',
      sku: ''
    });
    setEditingProduct(null);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      storeId: product.storeId,
      description: product.description,
      sku: product.sku
    });
    setProductModalOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteProduct = () => {
    if (productToDelete) {
      const updatedProducts = products.filter(p => p.id !== productToDelete.id);
      localStorage.setItem('electromanager_products', JSON.stringify(updatedProducts));
      
      setAlert({ type: 'success', message: `Produit "${productToDelete.name}" supprimé avec succès` });
      setTimeout(() => setAlert(null), 3000);
      
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
    }
  };

  const handleProductSubmit = () => {
    if (!productForm.name || !productForm.category || (productForm.price || 0) <= 0) {
      setAlert({ type: 'error', message: 'Veuillez remplir tous les champs obligatoires' });
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    if (editingProduct) {
      const updatedProducts = products.map(p => 
        p.id === editingProduct.id 
          ? { ...productForm, id: editingProduct.id } as Product
          : p
      );
      localStorage.setItem('electromanager_products', JSON.stringify(updatedProducts));
      
      setAlert({ type: 'success', message: `Produit "${productForm.name}" modifié avec succès` });
    } else {
      const newProduct = {
        ...productForm,
        id: Date.now(),
      } as Product;
      const updatedProducts = [...products, newProduct];
      localStorage.setItem('electromanager_products', JSON.stringify(updatedProducts));
      
      setAlert({ type: 'success', message: `Produit "${productForm.name}" ajouté avec succès` });
    }

    setTimeout(() => setAlert(null), 3000);
    
    setProductModalOpen(false);
    setProductForm({
      name: '',
      category: '',
      price: 0,
      stock: 0,
      storeId: userStoreId || 1,
      description: '',
      sku: ''
    });
    setEditingProduct(null);
  };

  // Sale handlers
  const handleOpenSaleModal = () => {
    setSaleModalOpen(true);
    setSaleForm({ productId: 0, quantity: 1, searchTerm: '' });
    setSelectedProduct(null);
  };

  const handleProductSelect = (productId: number) => {
    const product = storeProducts.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setSaleForm(prev => ({ 
        ...prev, 
        productId: product.id,
        searchTerm: product.name
      }));
    }
  };

  const handleSaleSubmit = () => {
    if (!selectedProduct || saleForm.quantity < 1) {
      setAlert({ type: 'error', message: 'Veuillez sélectionner un produit et une quantité valide' });
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    if (selectedProduct.stock < saleForm.quantity) {
      setAlert({ type: 'error', message: 'Stock insuffisant' });
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    const newSale = {
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      quantity: saleForm.quantity,
      unitPrice: selectedProduct.price,
      totalAmount: selectedProduct.price * saleForm.quantity,
      storeId: selectedProduct.storeId,
      employeeId: typeof currentUser?.id === 'number' ? currentUser.id : 1,
      employeeName: `${currentUser?.firstName} ${currentUser?.lastName}`,
      paymentMethod: 'cash' as const
    };

    addSale(newSale);

    updateProduct(selectedProduct.id, {
      ...selectedProduct,
      stock: selectedProduct.stock - saleForm.quantity
    });

    setAlert({ type: 'success', message: `Vente enregistrée: ${saleForm.quantity}x ${selectedProduct.name}` });
    setTimeout(() => setAlert(null), 3000);
    
    setSaleModalOpen(false);
    setSaleForm({ productId: 0, quantity: 1, searchTerm: '' });
    setSelectedProduct(null);
  };

  // Settings handlers
  const handleSettingsSubmit = () => {
    if (!settingsForm.firstName || !settingsForm.email) {
      setAlert({ type: 'error', message: 'Veuillez remplir tous les champs obligatoires' });
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    if (settingsForm.newPassword && settingsForm.newPassword !== settingsForm.confirmPassword) {
      setAlert({ type: 'error', message: 'Les mots de passe ne correspondent pas' });
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    // Update user in localStorage
    const updatedUsers = users.map(user => 
      user.id === currentUser?.id 
        ? { ...user, firstName: settingsForm.firstName, lastName: settingsForm.lastName, email: settingsForm.email }
        : user
    );
    localStorage.setItem('electromanager_users', JSON.stringify(updatedUsers));

    setAlert({ type: 'success', message: 'Profil mis à jour avec succès' });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Manager menu items
  const managerMenuItems = [
    { path: "/gerant", icon: Home, label: "Vue d'ensemble", section: 'overview' },
    { path: "/gerant/products", icon: Package, label: "Produits", section: 'products' },
    { path: "/gerant/sales", icon: TrendingUp, label: "Ventes", section: 'sales' },
    { path: "/gerant/stock", icon: ShoppingBag, label: "Stock", section: 'stock' },
    { path: "/gerant/employees", icon: Users, label: "Employés", section: 'employees' },
    { path: "/gerant/statistics", icon: BarChart3, label: "Statistiques", section: 'statistics' },
    { path: "/gerant/settings", icon: Settings, label: "Paramètres", section: 'settings' },
  ];

  // Statistics calculations
  const totalProducts = storeProducts.length;
  const totalRevenue = storeSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const todaySales = storeSales.filter(s => new Date(s.timestamp).toDateString() === new Date().toDateString()).length;
  const totalStock = storeProducts.reduce((sum, product) => sum + product.stock, 0);

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Store Info Header */}
            <div className="glass p-6 border border-white/20 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                  <StoreIcon size={32} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-2xl font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                    Magasin {userStoreId || 1}
                  </h3>
                  <p className="text-gray-400 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                    Bienvenue dans votre espace de gestion
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass p-6 border border-white/20 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Package size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Total Produits</p>
                    <p className="text-white font-bold text-2xl font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                      {totalProducts}
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass p-6 border border-white/20 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                    <ShoppingBag size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Stock Total</p>
                    <p className="text-white font-bold text-2xl font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                      {totalStock}
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass p-6 border border-white/20 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <TrendingUp size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Ventes Aujourd'hui</p>
                    <p className="text-white font-bold text-2xl font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                      {todaySales}
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass p-6 border border-white/20 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                    <DollarSign size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Chiffre d'affaires</p>
                    <p className="text-white font-bold text-2xl font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                      {totalRevenue.toLocaleString()}€
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Sales */}
            <div className="glass p-6 border border-white/20 rounded-lg">
              <h3 className="font-semibold text-lg mb-4 text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                Ventes Récentes
              </h3>
              <div className="space-y-3">
                {storeSales.slice(0, 5).map((sale: any) => (
                  <div key={sale.id} className="flex items-center justify-between p-3 glass rounded-lg border border-white/10">
                    <div>
                      <p className="font-medium text-white font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                        {sale.productName}
                      </p>
                      <p className="text-sm text-gray-400 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                        {sale.quantity} unités • {sale.employeeName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-semibold font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                        {sale.totalAmount.toLocaleString()}€
                      </p>
                      <p className="text-gray-400 text-sm font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                        {formatTimeAgo(new Date(sale.timestamp))}
                      </p>
                    </div>
                  </div>
                ))}
                {storeSales.length === 0 && (
                  <p className="text-center text-gray-400 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                    Aucune vente enregistrée aujourd'hui
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 'products':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                  Produits du Magasin
                </h2>
                <p className="text-gray-400 mt-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                  Gérez les produits de votre magasin
                </p>
              </div>
              <button 
                onClick={handleOpenProductModal}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium font-poppins"
              >
                <Plus size={20} />
                Ajouter un produit
              </button>
            </div>

            <div className="glass border border-white/20 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-white/10">
                    <tr>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Produit</th>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Catégorie</th>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Prix</th>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Stock</th>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>SKU</th>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {storeProducts.map((product: any) => (
                      <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-white font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                              {product.name}
                            </p>
                            <p className="text-sm text-gray-400 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                              {product.description}
                            </p>
                          </div>
                        </td>
                        <td className="p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                          {product.category}
                        </td>
                        <td className="p-4 text-green-400 font-semibold font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                          {product.price.toLocaleString()}€
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium font-inter ${
                            product.stock > 10 ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                            product.stock > 5 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                            'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`} style={{ fontFamily: 'var(--font-inter)' }}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                          {product.sku || 'N/A'}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEditProduct(product)}
                              className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <Edit size={16} className="text-blue-400" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product)}
                              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 size={16} className="text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'sales':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                  Ventes
                </h2>
                <p className="text-gray-400 mt-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                  Gérez les ventes de votre magasin
                </p>
              </div>
              <button 
                onClick={handleOpenSaleModal}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium font-poppins"
              >
                <Plus size={20} />
                Nouvelle Vente
              </button>
            </div>

            {/* Sale Form */}
            <div className="glass p-6 border border-white/20 rounded-lg">
              <h3 className="font-semibold text-lg mb-4 text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                Formulaire de Vente
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                    Sélectionner un produit
                  </label>
                  <select
                    value={saleForm.productId}
                    onChange={(e) => handleProductSelect(parseInt(e.target.value))}
                    className="w-full px-3 py-2 glass border border-white/20 rounded-lg text-black"
                  >
                    <option value="">Choisir un produit...</option>
                    {storeProducts.map((product: any) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {product.price}€ (Stock: {product.stock})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                    Quantité
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedProduct?.stock || 1}
                    value={saleForm.quantity}
                    onChange={(e) => setSaleForm(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 glass border border-white/20 rounded-lg text-black"
                    disabled={!selectedProduct}
                  />
                </div>
              </div>

              {selectedProduct && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="glass p-4 border border-white/10 rounded-lg">
                    <p className="text-gray-400 text-sm font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Prix unitaire</p>
                    <p className="text-white font-semibold text-lg font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                      {selectedProduct.price.toLocaleString()}€
                    </p>
                  </div>
                  <div className="glass p-4 border border-white/10 rounded-lg">
                    <p className="text-gray-400 text-sm font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Stock disponible</p>
                    <p className="text-white font-semibold text-lg font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                      {selectedProduct.stock} unités
                    </p>
                  </div>
                  <div className="glass p-4 border border-white/10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-600/20">
                    <p className="text-gray-300 text-sm font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Total</p>
                    <p className="text-white font-bold text-xl font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                      {(selectedProduct.price * saleForm.quantity).toLocaleString()}€
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={() => {
                    setSaleForm({ productId: 0, quantity: 1, searchTerm: '' });
                    setSelectedProduct(null);
                  }}
                  className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10 text-gray-300 font-medium font-poppins"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaleSubmit}
                  disabled={!selectedProduct || saleForm.quantity < 1}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed font-medium font-poppins"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  Valider la vente
                </button>
              </div>
            </div>

            {/* Recent Sales */}
            <div className="glass p-6 border border-white/20 rounded-lg">
              <h3 className="font-semibold text-lg mb-4 text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                Historique des Ventes
              </h3>
              <div className="space-y-4">
                {storeSales.slice(0, 10).map((sale: any) => (
                  <div key={sale.id} className="flex items-center justify-between pb-4 border-b border-white/10 last:border-0">
                    <div>
                      <p className="font-medium text-white font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                        {sale.productName}
                      </p>
                      <p className="text-gray-400 text-sm font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                        {sale.quantity} unités • {sale.employeeName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-semibold font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                        {sale.totalAmount.toLocaleString()}€
                      </p>
                      <p className="text-gray-400 text-sm font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                        {formatTimeAgo(new Date(sale.timestamp))}
                      </p>
                    </div>
                  </div>
                ))}
                {storeSales.length === 0 && (
                  <p className="text-center text-gray-400 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                    Aucune vente enregistrée
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 'stock':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                Gestion du Stock
              </h2>
              <p className="text-gray-400 mt-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                Consultez et gérez le stock de votre magasin
              </p>
            </div>

            {/* Stock Overview */}
            <div className="glass p-6 border border-white/20 rounded-lg">
              <h3 className="font-semibold text-lg mb-4 text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                Résumé du Stock
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Total produits</span>
                    <span className="text-white font-semibold font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                      {storeProducts.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Stock total</span>
                    <span className="text-white font-semibold font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                      {totalStock} unités
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-green-400 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Stock suffisant</span>
                    <span className="text-green-400 font-semibold font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                      {storeProducts.filter(p => p.stock > 10).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-orange-400 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Stock bas</span>
                    <span className="text-orange-400 font-semibold font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                      {storeProducts.filter(p => p.stock <= 10 && p.stock > 5).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-red-400 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Stock critique</span>
                    <span className="text-red-400 font-semibold font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                      {storeProducts.filter(p => p.stock <= 5).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stock Details */}
            <div className="glass border border-white/20 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-white/10">
                    <tr>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Produit</th>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Catégorie</th>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Quantité</th>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Statut</th>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {storeProducts.map((product: any) => (
                      <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-white font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                              {product.name}
                            </p>
                            <p className="text-sm text-gray-400 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                              {product.sku || 'N/A'}
                            </p>
                          </div>
                        </td>
                        <td className="p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                          {product.category}
                        </td>
                        <td className="p-4 text-white font-semibold font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                          {product.stock}
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium font-inter ${
                            product.stock > 10 ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                            product.stock > 5 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                            'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`} style={{ fontFamily: 'var(--font-inter)' }}>
                            {product.stock > 10 ? 'Suffisant' : product.stock > 5 ? 'Bas' : 'Critique'}
                          </span>
                        </td>
                        <td className="p-4">
                          <button 
                            onClick={() => handleEditProduct(product)}
                            className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
                            title="Modifier le stock"
                          >
                            <Edit size={16} className="text-blue-400" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'employees':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                Employés du Magasin
              </h2>
              <p className="text-gray-400 mt-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                Consultez les employés assignés à votre magasin
              </p>
            </div>

            <div className="glass border border-white/20 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-white/10">
                    <tr>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Employé</th>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Email</th>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Rôle</th>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {storeEmployees.map((employee: any) => (
                      <tr key={employee.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                              <span className="text-white font-bold">{employee.firstName?.charAt(0) || employee.name?.charAt(0) || 'E'}</span>
                            </div>
                            <span className="text-white font-medium font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                              {employee.firstName} {employee.lastName}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                          {employee.email}
                        </td>
                        <td className="p-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                            {employee.role || 'Employé'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                            Actif
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'statistics':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                Statistiques
              </h2>
              <p className="text-gray-400 mt-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                Vue d'ensemble des performances de votre magasin
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass p-6 border border-white/20 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Package size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Total Produits</p>
                    <p className="text-white font-bold text-2xl font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                      {totalProducts}
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass p-6 border border-white/20 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                    <DollarSign size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Chiffre d'affaires</p>
                    <p className="text-white font-bold text-2xl font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                      {totalRevenue.toLocaleString()}€
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass p-6 border border-white/20 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <TrendingUp size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Ventes du jour</p>
                    <p className="text-white font-bold text-2xl font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                      {todaySales}
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass p-6 border border-white/20 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                    <Users size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Employés</p>
                    <p className="text-white font-bold text-2xl font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                      {storeEmployees.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sales History */}
            <div className="glass p-6 border border-white/20 rounded-lg">
              <h3 className="font-semibold text-lg mb-4 text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                Historique des Ventes
              </h3>
              <div className="space-y-4">
                {storeSales.slice(0, 15).map((sale: any) => (
                  <div key={sale.id} className="flex items-center justify-between pb-4 border-b border-white/10 last:border-0">
                    <div>
                      <p className="font-medium text-white font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                        {sale.productName}
                      </p>
                      <p className="text-sm text-gray-400 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                        {sale.quantity} unités • {sale.employeeName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-semibold font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                        {sale.totalAmount.toLocaleString()}€
                      </p>
                      <p className="text-gray-400 text-sm font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                        {formatTimeAgo(new Date(sale.timestamp))}
                      </p>
                    </div>
                  </div>
                ))}
                {storeSales.length === 0 && (
                  <p className="text-center text-gray-400 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                    Aucune vente enregistrée
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                Paramètres
              </h2>
              <p className="text-gray-400 mt-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                Gérez votre profil et vos préférences
              </p>
            </div>

            {/* Profile Settings */}
            <div className="glass p-6 border border-white/20 rounded-lg">
              <h3 className="font-semibold text-lg mb-4 text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                Profil Utilisateur
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={settingsForm.firstName}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-3 py-2 glass border border-white/20 rounded-lg text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                    Nom
                  </label>
                  <input
                    type="text"
                    value={settingsForm.lastName}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-3 py-2 glass border border-white/20 rounded-lg text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 glass border border-white/20 rounded-lg text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    value={settingsForm.currentPassword}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-3 py-2 glass border border-white/20 rounded-lg text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    value={settingsForm.newPassword}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-3 py-2 glass border border-white/20 rounded-lg text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    value={settingsForm.confirmPassword}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 glass border border-white/20 rounded-lg text-black"
                  />
                </div>
              </div>
              <button 
                onClick={handleSettingsSubmit}
                className="mt-4 bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-blue-700 transition-all font-medium font-poppins"
              >
                Sauvegarder les modifications
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen w-full relative">
      {/* Animated Background */}
      <div className="animated-bg fixed inset-0" />
      
      <div className="flex h-full w-full relative z-10">
        {/* Manager Sidebar */}
        <aside className="w-64 sidebar-glass border-r border-white/20 flex flex-col flex-shrink-0">
          <div className="p-6 border-b border-white/20">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <h1 className="font-bold text-xl text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                ElectroManager
              </h1>
              <p className="text-sm text-gray-400 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                Espace Gérant
              </p>
            </div>
          </div>

          <nav className="flex-1 p-4">
            {managerMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.section;

              return (
                <button
                  key={item.section}
                  onClick={() => setActiveSection(item.section)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all sidebar-item ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white neon-glow-blue"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-inter" style={{ fontFamily: 'var(--font-inter)' }}>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/20">
            <div className="glass p-4 rounded-lg border border-white/10">
              <p className="text-sm text-white font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                {currentUser?.firstName} {currentUser?.lastName}
              </p>
              <p className="text-xs text-gray-400 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                Gérant - Magasin {userStoreId || 1}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
            >
              <LogOut size={20} />
              <span className="font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Déconnexion</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Header */}
          <header className="glass border-b border-white/20 p-6 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                  {managerMenuItems.find(item => item.section === activeSection)?.label || "Dashboard"}
                </h1>
                <p className="text-gray-400 mt-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                  Gestion de votre magasin - Magasin {userStoreId || 1}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="glass px-4 py-2 rounded-lg border border-white/20">
                  <span className="text-sm text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                    Accès Gérant
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {renderContent()}
          </main>
        </div>
      </div>

      {/* Product Modal */}
      {productModalOpen && (
        <Modal
          title={editingProduct ? "Modifier un produit" : "Ajouter un produit"}
          isOpen={productModalOpen}
          onClose={() => {
            setProductModalOpen(false);
            setEditingProduct(null);
            setProductForm({
              name: '',
              category: '',
              price: 0,
              stock: 0,
              storeId: userStoreId || 1,
              description: '',
              sku: ''
            });
          }}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                  Nom du produit
                </label>
                <input
                  type="text"
                  value={productForm.name || ''}
                  onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 glass border border-white/20 rounded-lg text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                  Catégorie
                </label>
                <input
                  type="text"
                  value={productForm.category || ''}
                  onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 glass border border-white/20 rounded-lg text-black"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                  Prix
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={productForm.price || 0}
                  onChange={(e) => setProductForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 glass border border-white/20 rounded-lg text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                  Quantité en stock
                </label>
                <input
                  type="number"
                  min="0"
                  value={productForm.stock || 0}
                  onChange={(e) => setProductForm(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 glass border border-white/20 rounded-lg text-black"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                  SKU
                </label>
                <input
                  type="text"
                  value={productForm.sku || ''}
                  onChange={(e) => setProductForm(prev => ({ ...prev, sku: e.target.value }))}
                  className="w-full px-3 py-2 glass border border-white/20 rounded-lg text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                  Description
                </label>
                <textarea
                  value={productForm.description || ''}
                  onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 glass border border-white/20 rounded-lg text-black"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setProductModalOpen(false);
                  setEditingProduct(null);
                  setProductForm({
                    name: '',
                    category: '',
                    price: 0,
                    stock: 0,
                    storeId: userStoreId || 1,
                    description: '',
                    sku: ''
                  });
                }}
                className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10 text-gray-300 font-medium font-poppins"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                Annuler
              </button>
              <button
                onClick={handleProductSubmit}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 font-medium font-poppins"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                {editingProduct ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Sale Modal */}
      {saleModalOpen && (
        <Modal
          title="Nouvelle Vente"
          isOpen={saleModalOpen}
          onClose={() => setSaleModalOpen(false)}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                Sélectionner un produit
              </label>
              <select
                value={saleForm.productId}
                onChange={(e) => handleProductSelect(parseInt(e.target.value))}
                className="w-full px-3 py-2 glass border border-white/20 rounded-lg text-black"
              >
                <option value="">Choisir un produit...</option>
                {storeProducts.map((product: any) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {product.price}€ (Stock: {product.stock})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                Quantité
              </label>
              <input
                type="number"
                min="1"
                max={selectedProduct?.stock || 1}
                value={saleForm.quantity}
                onChange={(e) => setSaleForm(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                className="w-full px-3 py-2 glass border border-white/20 rounded-lg text-black"
                disabled={!selectedProduct}
              />
            </div>

            {selectedProduct && (
              <div className="p-4 glass border border-white/10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-600/20">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Total:</span>
                  <span className="text-xl font-bold text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                    {(selectedProduct.price * saleForm.quantity).toLocaleString()}€
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setSaleModalOpen(false)}
                className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10 text-gray-300 font-medium font-poppins"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                Annuler
              </button>
              <button
                onClick={handleSaleSubmit}
                disabled={!selectedProduct || saleForm.quantity < 1}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed font-medium font-poppins"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                Valider la vente
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <Modal
          title="Confirmer la suppression"
          isOpen={deleteConfirmOpen}
          onClose={() => {
            setDeleteConfirmOpen(false);
            setProductToDelete(null);
          }}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 glass border border-white/10 rounded-lg">
              <Trash2 size={24} className="text-red-400" />
              <div>
                <p className="text-white font-medium font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                  Êtes-vous sûr de vouloir supprimer ce produit ?
                </p>
                <p className="text-gray-400 text-sm font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                  {productToDelete?.name}
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setProductToDelete(null);
                }}
                className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10 text-gray-300 font-medium font-poppins"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                Annuler
              </button>
              <button
                onClick={confirmDeleteProduct}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium font-poppins"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                Supprimer
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Alert */}
      {alert && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <Alert 
            type={alert.type} 
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        </div>
      )}

      {/* Assistant IA */}
      <AssistantIA />
    </div>
  );
}

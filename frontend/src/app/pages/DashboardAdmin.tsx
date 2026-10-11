import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Home,
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  Settings,
  Store as StoreIcon,
  Search,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  DollarSign,
  ShoppingBag,
  AlertCircle,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import { StatsCard } from "../components/StatsCard";
import { useAuth } from "../hooks/useAuth";
import { useData, Store, User, Product, Sale } from "../hooks/useData";
import { Modal } from "../components/Modal";
import { Alert } from "../components/Alert";
import { AssistantIA } from "../components/AssistantIA";

export function DashboardAdmin() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; message: string } | null>(null);
  
  // Modals state
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Form states
  const [storeForm, setStoreForm] = useState<Partial<Store>>({
    name: '',
    address: '',
    phone: '',
    email: '',
    manager: '',
    status: 'active'
  });
  
  const [userForm, setUserForm] = useState<Partial<User>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'employe',
    storeId: undefined,
    status: 'active'
  });
  
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    category: '',
    price: 0,
    stock: 0,
    storeId: 1,
    description: '',
    sku: ''
  });

  // Settings states
  const [settingsForm, setSettingsForm] = useState({
    appName: 'ElectroManager',
    currency: 'EUR',
    stockAlertThreshold: 5,
    emailNotifications: true,
    pushNotifications: false
  });

  // Profile states
  const [profileForm, setProfileForm] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Sale recording states
  const [saleModalOpen, setSaleModalOpen] = useState(false);
  const [saleForm, setSaleForm] = useState({
    productId: 0,
    quantity: 1,
    searchTerm: ''
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [storeDetailId, setStoreDetailId] = useState<number | null>(null);

  // Data hook
  const {
    stores,
    users,
    products,
    sales,
    stockAlerts,
    addStore,
    updateStore,
    deleteStore,
    addUser,
    updateUser,
    deleteUser,
    addProduct,
    updateProduct,
    deleteProduct,
    addSale,
    getStoreById,
    getUserById,
    getProductById,
    getProductsByStore,
    getSalesByStore,
    getUsersByStore,
    getStockAlertsByStore
  } = useData();

  // Calculate real stats from data with safety checks
  const totalProducts = products?.length || 0;
  const totalStock = products?.reduce((sum, product) => sum + (product?.stock || 0), 0) || 0;
  const todaySales = sales?.filter(sale => {
    if (!sale?.timestamp) return false;
    const saleDate = new Date(sale.timestamp);
    const today = new Date();
    return saleDate.toDateString() === today.toDateString();
  })?.length || 0;
  const totalRevenue = sales?.reduce((sum, sale) => sum + (sale?.totalAmount || 0), 0) || 0;

  const globalStats = [
    { title: "Total Produits", value: totalProducts.toString(), icon: Package, color: "bg-gradient-to-br from-blue-500 to-blue-600", trend: "+11% ce mois", neonColor: 'blue' as const },
    { title: "Stock Total", value: totalStock.toString(), icon: ShoppingBag, color: "bg-gradient-to-br from-green-500 to-green-600", trend: "+5% ce mois", neonColor: 'indigo' as const },
    { title: "Ventes du Jour", value: todaySales.toString(), icon: TrendingUp, color: "bg-gradient-to-br from-purple-500 to-purple-600", trend: "+8% aujourd'hui", neonColor: 'purple' as const },
    { title: "Revenus", value: `${totalRevenue.toLocaleString()}€`, icon: DollarSign, color: "bg-gradient-to-br from-orange-500 to-orange-600", trend: "+14% ce mois", neonColor: 'blue' as const },
  ];

  // Helper function - MUST be defined before use
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

  // Global recent sales for administrators with safety checks
  const globalRecentSales = (sales || []).slice(0, 10).map(sale => ({
    ...sale,
    store: getStoreById(sale?.storeId || 0)?.name || 'Unknown',
    time: formatTimeAgo(new Date(sale?.timestamp || new Date()))
  }));

  // Global low stock products for administrators with safety checks
  const globalLowStockProducts = (stockAlerts || []).filter(alert => alert?.status !== 'normal').map(alert => ({
    name: alert?.productName || 'Unknown',
    stock: alert?.currentStock || 0,
    status: alert?.status === 'critical' ? 'critique' : 'bas',
    store: alert?.storeName || 'Unknown'
  }));

  // Admin menu items
  const adminMenuItems = [
    { path: "/admin", icon: Home, label: "Vue d'ensemble", section: 'overview' },
    { path: "/admin/stores", icon: StoreIcon, label: "Magasins", section: 'stores' },
    { path: "/admin/users", icon: Users, label: "Utilisateurs", section: 'users' },
    { path: "/admin/products", icon: Package, label: "Produits", section: 'products' },
    { path: "/admin/sales", icon: TrendingUp, label: "Ventes", section: 'sales' },
    { path: "/admin/stock", icon: ShoppingBag, label: "Stock", section: 'stock' },
    { path: "/admin/statistics", icon: BarChart3, label: "Statistiques", section: 'statistics' },
    { path: "/admin/settings", icon: Settings, label: "Paramètres", section: 'settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Alert handlers
  const showAlert = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  // Handlers for settings
  const handleSettingsUpdate = () => {
    // Save settings to localStorage
    localStorage.setItem('appSettings', JSON.stringify(settingsForm));
    setAlert({ type: 'success', message: 'Paramètres mis à jour avec succès' });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleProfileUpdate = () => {
    if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
      setAlert({ type: 'error', message: 'Les mots de passe ne correspondent pas' });
      setTimeout(() => setAlert(null), 3000);
      return;
    }
    
    // Update user profile (in real app, this would call an API)
    setAlert({ type: 'success', message: 'Profil mis à jour avec succès' });
    setTimeout(() => setAlert(null), 3000);
  };

  // Handlers for sales
  const handleOpenSaleModal = () => {
    setSaleModalOpen(true);
    setSaleForm({ productId: 0, quantity: 1, searchTerm: '' });
    setSelectedProduct(null);
  };

  const handleProductSearch = (term: string) => {
    setSaleForm(prev => ({ ...prev, searchTerm: term }));
    
    if (term.length > 2) {
      const found = products.find(p => 
        p.name.toLowerCase().includes(term.toLowerCase()) ||
        p.sku?.toLowerCase().includes(term.toLowerCase())
      );
      setSelectedProduct(found || null);
      if (found) {
        setSaleForm(prev => ({ ...prev, productId: found.id }));
      }
    } else {
      setSelectedProduct(null);
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

    // Create sale record
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

    // Update product stock
    updateProduct(selectedProduct.id, {
      ...selectedProduct,
      stock: selectedProduct.stock - saleForm.quantity
    });

    setAlert({ type: 'success', message: `Vente enregistrée: ${saleForm.quantity}x ${selectedProduct.name}` });
    setTimeout(() => setAlert(null), 3000);
    
    // Reset form
    setSaleModalOpen(false);
    setSaleForm({ productId: 0, quantity: 1, searchTerm: '' });
    setSelectedProduct(null);
  };

  // Handler for store detail view
  const handleViewStoreDetail = (storeId: number) => {
    setStoreDetailId(storeId);
  };

  const handleBackToStores = () => {
    setStoreDetailId(null);
  };

  // Store handlers
  const handleAddStore = () => {
    setEditingStore(null);
    setStoreForm({
      name: '',
      address: '',
      phone: '',
      email: '',
      manager: '',
      status: 'active'
    });
    setIsStoreModalOpen(true);
  };

  const handleEditStore = (store: Store) => {
    setEditingStore(store);
    setStoreForm(store);
    setIsStoreModalOpen(true);
  };

  const handleSaveStore = () => {
    try {
      if (!storeForm.name || !storeForm.address || !storeForm.phone || !storeForm.email || !storeForm.manager) {
        showAlert('error', 'Tous les champs sont obligatoires');
        return;
      }

      if (editingStore) {
        updateStore(editingStore.id, storeForm as Store);
        showAlert('success', 'Magasin mis à jour avec succès');
      } else {
        addStore(storeForm as Omit<Store, 'id'>);
        showAlert('success', 'Magasin ajouté avec succès');
      }

      setIsStoreModalOpen(false);
      setStoreForm({
        name: '',
        address: '',
        phone: '',
        email: '',
        manager: '',
        status: 'active'
      });
    } catch (error) {
      showAlert('error', 'Erreur lors de la sauvegarde du magasin');
    }
  };

  const handleDeleteStore = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce magasin ?')) {
      deleteStore(id);
      showAlert('success', 'Magasin supprimé avec succès');
    }
  };

  // User handlers
  const handleAddUser = () => {
    setEditingUser(null);
    setUserForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'employe',
      storeId: undefined,
      status: 'active'
    });
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm(user);
    setIsUserModalOpen(true);
  };

  const handleSaveUser = () => {
    try {
      if (!userForm.firstName || !userForm.lastName || !userForm.email || !userForm.phone) {
        showAlert('error', 'Tous les champs sont obligatoires');
        return;
      }

      if (editingUser) {
        updateUser(editingUser.id, userForm as User);
        showAlert('success', 'Utilisateur mis à jour avec succès');
      } else {
        addUser(userForm as Omit<User, 'id'>);
        showAlert('success', 'Utilisateur ajouté avec succès');
      }

      setIsUserModalOpen(false);
      setUserForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'employe',
        storeId: undefined,
        status: 'active'
      });
    } catch (error) {
      showAlert('error', 'Erreur lors de la sauvegarde de l\'utilisateur');
    }
  };

  const handleDeleteUser = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      deleteUser(id);
      showAlert('success', 'Utilisateur supprimé avec succès');
    }
  };

  // Product handlers
  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: '',
      price: 0,
      stock: 0,
      storeId: 1,
      description: '',
      sku: ''
    });
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm(product);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = () => {
    try {
      if (!productForm.name || !productForm.category || !productForm.price || !productForm.stock) {
        showAlert('error', 'Tous les champs sont obligatoires');
        return;
      }

      if (editingProduct) {
        updateProduct(editingProduct.id, productForm as Product);
        showAlert('success', 'Produit mis à jour avec succès');
      } else {
        addProduct(productForm as Omit<Product, 'id'>);
        showAlert('success', 'Produit ajouté avec succès');
      }

      setIsProductModalOpen(false);
      setProductForm({
        name: '',
        category: '',
        price: 0,
        stock: 0,
        storeId: 1,
        description: '',
        sku: ''
      });
    } catch (error) {
      showAlert('error', 'Erreur lors de la sauvegarde du produit');
    }
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      deleteProduct(id);
      showAlert('success', 'Produit supprimé avec succès');
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {globalStats.map((stat) => (
                <StatsCard key={stat.title} {...stat} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass p-6 border border-white/20">
                <h3 className="font-semibold text-lg mb-4 text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                  Ventes Récentes - Tous Magasins
                </h3>
                <div className="space-y-4">
                  {globalRecentSales.map((sale) => (
                    <div key={sale.id} className="flex items-center justify-between pb-4 border-b border-white/10 last:border-0">
                      <div>
                        <p className="font-medium text-white font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                          {sale.productName}
                        </p>
                        <p className="text-sm text-gray-400 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                          {sale.id} • {sale.time} • <span className="text-blue-400">{sale.store}</span>
                        </p>
                      </div>
                      <p className="font-semibold text-green-400 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                        {sale.totalAmount.toLocaleString()}€
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass p-6 border border-white/20">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle size={20} className="text-orange-400" />
                  <h3 className="font-semibold text-lg text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                    Alertes Stock Bas - Tous Magasins
                  </h3>
                </div>
                <div className="space-y-4">
                  {globalLowStockProducts.map((product) => (
                    <div key={product.name} className="flex items-center justify-between pb-4 border-b border-white/10 last:border-0">
                      <div>
                        <p className="font-medium text-white font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-400 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                          Stock: {product.stock} unités • <span className="text-blue-400">{product.store}</span>
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

      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                  Gestion des Utilisateurs
                </h2>
                <p className="text-gray-400 mt-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                  Gérez tous les utilisateurs et leurs rôles
                </p>
              </div>
              <button 
                onClick={handleAddUser}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium font-poppins"
              >
                <Plus size={20} />
                Ajouter un utilisateur
              </button>
            </div>

            <div className="glass border border-white/20 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-white/10">
                    <tr>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Utilisateur</th>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Email</th>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Rôle</th>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Magasin</th>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Statut</th>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(users || []).map((user) => (
                      <tr key={user?.id || 0} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                              <span className="text-white font-bold">{user?.firstName?.charAt(0) || 'U'}</span>
                            </div>
                            <span className="text-white font-medium font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                              {user?.firstName || ''} {user?.lastName || ''}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                          {user?.email || 'N/A'}
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium font-inter ${
                            user?.role === 'administrateur' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                            user?.role === 'gerant' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                            'bg-green-500/20 text-green-400 border border-green-500/30'
                          }`} style={{ fontFamily: 'var(--font-inter)' }}>
                            {user?.role === 'administrateur' ? 'Administrateur' : 
                             user?.role === 'gerant' ? 'Gérant' : 'Employé'}
                          </span>
                        </td>
                        <td className="p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                          {getStoreById(user?.storeId || 0)?.name || 'Non assigné'}
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium font-inter ${
                            user?.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                            'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                          }`} style={{ fontFamily: 'var(--font-inter)' }}>
                            {user?.status === 'active' ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEditUser(user)}
                              className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
                            >
                              <Edit size={16} className="text-blue-400" />
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
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

      case 'stores':
        // Show store detail view if a store is selected
        if (storeDetailId) {
          const store = stores.find(s => s.id === storeDetailId);
          if (!store) {
            return (
              <div className="glass p-8 border border-white/20 rounded-lg text-center">
                <h2 className="text-xl font-semibold text-white mb-2 font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                  Magasin non trouvé
                </h2>
                <button 
                  onClick={handleBackToStores}
                  className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium font-poppins"
                >
                  Retour à la liste
                </button>
              </div>
            );
          }

          const storeProducts = products.filter(p => p.storeId === store.id);
          const storeSales = sales.filter(s => s.storeId === store.id);
          const storeStockAlerts = stockAlerts.filter(a => a.storeId === store.id);
          const recentStoreSales = storeSales.slice(0, 10);

          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <button 
                    onClick={handleBackToStores}
                    className="flex items-center gap-2 text-gray-300 hover:text-white mb-4 transition-colors"
                  >
                    <ArrowLeft size={20} />
                    Retour aux magasins
                  </button>
                  <h2 className="text-2xl font-bold text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                    {store.name}
                  </h2>
                  <p className="text-gray-400 mt-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                    Détail du magasin
                  </p>
                </div>
              </div>

              {/* Store Info */}
              <div className="glass p-6 border border-white/20 rounded-lg">
                <h3 className="font-semibold text-lg mb-4 text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                  Informations du magasin
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Adresse</p>
                    <p className="text-white font-medium font-inter" style={{ fontFamily: 'var(--font-inter)' }}>{store.address}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Téléphone</p>
                    <p className="text-white font-medium font-inter" style={{ fontFamily: 'var(--font-inter)' }}>{store.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Email</p>
                    <p className="text-white font-medium font-inter" style={{ fontFamily: 'var(--font-inter)' }}>{store.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Responsable</p>
                    <p className="text-white font-medium font-inter" style={{ fontFamily: 'var(--font-inter)' }}>{store.manager}</p>
                  </div>
                </div>
              </div>

              {/* Store Products */}
              <div className="glass p-6 border border-white/20 rounded-lg">
                <h3 className="font-semibold text-lg mb-4 text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                  Produits du magasin ({storeProducts.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-white/10">
                      <tr>
                        <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Produit</th>
                        <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Catégorie</th>
                        <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Prix</th>
                        <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {storeProducts.map(product => (
                        <tr key={product.id} className="border-b border-white/5">
                          <td className="p-4 text-white font-medium font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                            {product.name}
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Stock Alerts */}
              {storeStockAlerts.length > 0 && (
                <div className="glass p-6 border border-white/20 rounded-lg">
                  <h3 className="font-semibold text-lg mb-4 text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                    Alertes de stock ({storeStockAlerts.length})
                  </h3>
                  <div className="space-y-3">
                    {storeStockAlerts.map(alert => (
                      <div key={alert.id} className="flex items-center justify-between p-3 glass border border-white/10 rounded-lg">
                        <div>
                          <p className="text-white font-medium font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                            {alert.productName}
                          </p>
                          <p className="text-gray-400 text-sm font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                            Stock actuel: {alert.currentStock} | Minimum: {alert.minStock}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium font-inter ${
                          alert.status === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        }`} style={{ fontFamily: 'var(--font-inter)' }}>
                          {alert.status === 'critical' ? 'Critique' : 'Bas'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Sales */}
              {recentStoreSales.length > 0 && (
                <div className="glass p-6 border border-white/20 rounded-lg">
                  <h3 className="font-semibold text-lg mb-4 text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                    Ventes récentes ({recentStoreSales.length})
                  </h3>
                  <div className="space-y-3">
                    {recentStoreSales.map(sale => (
                      <div key={sale.id} className="flex items-center justify-between p-3 glass border border-white/10 rounded-lg">
                        <div>
                          <p className="text-white font-medium font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
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
                            {new Date(sale.timestamp).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        }

        // Show store list
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                  Gestion des Magasins
                </h2>
                <p className="text-gray-400 mt-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                  Gérez tous les magasins de l'entreprise
                </p>
              </div>
              <button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium font-poppins">
                <Plus size={20} />
                Ajouter un magasin
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(stores || []).map((store) => (
                <div 
                  key={store?.id || 0} 
                  className="glass p-6 border border-white/20 rounded-lg hover:border-white/30 transition-colors cursor-pointer"
                  onClick={() => handleViewStoreDetail(store?.id || 0)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <StoreIcon size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                          {store?.name || 'Nom du magasin'}
                        </h3>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium font-inter ${
                          store?.status === "active"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                        }`} style={{ fontFamily: 'var(--font-inter)' }}>
                          {store?.status === "active" ? "Actif" : "Inactif"}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => {
                          const fullStore = stores?.find(s => s?.id === store?.id);
                          if (fullStore) {
                            handleEditStore(fullStore);
                          }
                        }}
                        className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
                      >
                        <Edit size={18} className="text-blue-400" />
                      </button>
                      <button 
                        onClick={() => handleDeleteStore(store?.id || 0)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} className="text-red-400" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <StoreIcon size={16} className="text-gray-400" />
                      <p className="text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>{store?.address || 'Adresse non spécifiée'}</p>
                    </div>
                    <div className="pt-2 border-t border-white/10">
                      <p className="text-gray-400 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Responsable</p>
                      <p className="font-medium text-white font-inter" style={{ fontFamily: 'var(--font-inter)' }}>{store?.manager || 'Non assigné'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'products':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                  Gestion des Produits
                </h2>
                <p className="text-gray-400 mt-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                  Gérez tous les produits de tous les magasins
                </p>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher un produit..."
                    className="pl-10 pr-4 py-2 glass border border-white/20 rounded-lg text-black"
                  />
                </div>
                <button 
                  onClick={handleAddProduct}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium font-poppins"
                >
                  <Plus size={20} />
                  Ajouter un produit
                </button>
              </div>
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
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Magasin</th>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>SKU</th>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products
                      .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((product) => (
                      <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <Package size={20} className="text-white" />
                            </div>
                            <div>
                              <span className="text-white font-medium font-inter block" style={{ fontFamily: 'var(--font-inter)' }}>
                                {product.name}
                              </span>
                              {product.description && (
                                <span className="text-gray-400 text-xs font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                                  {product.description}
                                </span>
                              )}
                            </div>
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
                          {getStoreById(product.storeId)?.name || 'Unknown'}
                        </td>
                        <td className="p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                          {product.sku || '-'}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEditProduct(product)}
                              className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
                            >
                              <Edit size={16} className="text-blue-400" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
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
                  Ventes - Tous Magasins
                </h2>
                <p className="text-gray-400 mt-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                  Consultez toutes les ventes de tous les magasins
                </p>
              </div>
              <button 
                onClick={handleOpenSaleModal}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-blue-700 transition-all font-medium font-poppins"
              >
                <Plus size={20} />
                Nouvelle Vente
              </button>
            </div>

            <div className="glass border border-white/20 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-white/10">
                    <tr>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>ID Vente</th>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Produit</th>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Quantité</th>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Total</th>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Magasin</th>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Employé</th>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map((sale) => (
                      <tr key={sale.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                          {sale.id}
                        </td>
                        <td className="p-4">
                          <div>
                            <span className="text-white font-medium font-inter block" style={{ fontFamily: 'var(--font-inter)' }}>
                              {sale.productName}
                            </span>
                            <span className="text-gray-400 text-xs font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                              {sale.unitPrice.toLocaleString()}€ / unité
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                          {sale.quantity}
                        </td>
                        <td className="p-4 text-green-400 font-semibold font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                          {sale.totalAmount.toLocaleString()}€
                        </td>
                        <td className="p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                          {getStoreById(sale.storeId)?.name || 'Unknown'}
                        </td>
                        <td className="p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                          {sale.employeeName}
                        </td>
                        <td className="p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                          {new Date(sale.timestamp).toLocaleDateString('fr-FR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'stock':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                  Gestion des Stocks
                </h2>
                <p className="text-gray-400 mt-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                  Consultez et gérez les stocks de tous les magasins
                </p>
              </div>
            </div>

            <div className="glass border border-white/20 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-white/10">
                    <tr>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Produit</th>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Magasin</th>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Stock Actuel</th>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Stock Min</th>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Statut</th>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockAlerts.map((alert) => (
                      <tr key={alert.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <Package size={20} className="text-white" />
                            </div>
                            <span className="text-white font-medium font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                              {alert.productName}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                          {alert.storeName}
                        </td>
                        <td className="p-4 text-white font-semibold font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                          {alert.currentStock}
                        </td>
                        <td className="p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                          {alert.minStock}
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium font-inter ${
                            alert.status === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            alert.status === 'low' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                            'bg-green-500/20 text-green-400 border border-green-500/30'
                          }`} style={{ fontFamily: 'var(--font-inter)' }}>
                            {alert.status === 'critical' ? 'Critique' : 
                             alert.status === 'low' ? 'Bas' : 'Normal'}
                          </span>
                        </td>
                        <td className="p-4">
                          <button 
                            onClick={() => {
                              const product = getProductById(alert.productId);
                              if (product) {
                                handleEditProduct(product);
                              }
                            }}
                            className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
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

      case 'statistics':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                  Statistiques Globales
                </h2>
                <p className="text-gray-400 mt-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                  Vue détaillée des performances de tous les magasins
                </p>
              </div>
            </div>

            {/* Revenue by Store */}
            <div className="glass p-6 border border-white/20 rounded-lg">
              <h3 className="font-semibold text-lg mb-4 text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                Revenus par Magasin
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stores.map(store => {
                  const storeRevenue = sales
                    .filter(sale => sale.storeId === store.id)
                    .reduce((sum, sale) => sum + sale.totalAmount, 0);
                  
                  return (
                    <div key={store.id} className="glass p-4 border border-white/10 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                          {store.name}
                        </span>
                        <span className="text-green-400 font-bold text-lg font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                          {storeRevenue.toLocaleString()}€
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                          style={{ width: `${Math.min((storeRevenue / Math.max(...stores.map(s => 
                            sales.filter(sale => sale.storeId === s.id)
                              .reduce((sum, sale) => sum + sale.totalAmount, 0)
                          ))) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Products */}
            <div className="glass p-6 border border-white/20 rounded-lg">
              <h3 className="font-semibold text-lg mb-4 text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                Produits les Plus Vendus
              </h3>
              <div className="space-y-3">
                {products
                  .map(product => {
                    const productSales = sales.filter(sale => sale.productId === product.id);
                    const totalQuantity = productSales.reduce((sum, sale) => sum + sale.quantity, 0);
                    const totalRevenue = productSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
                    
                    return {
                      ...product,
                      totalQuantity,
                      totalRevenue,
                      salesCount: productSales.length
                    };
                  })
                  .filter(product => product.totalQuantity > 0)
                  .sort((a, b) => b.totalQuantity - a.totalQuantity)
                  .slice(0, 5)
                  .map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between p-3 glass border border-white/10 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                        <div>
                          <p className="text-white font-medium font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                            {product.name}
                          </p>
                          <p className="text-gray-400 text-sm font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                            {product.totalQuantity} unités • {product.salesCount} ventes
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-semibold font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                          {product.totalRevenue.toLocaleString()}€
                        </p>
                        <p className="text-gray-400 text-sm font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                          {getStoreById(product.storeId)?.name}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Sales Trends */}
            <div className="glass p-6 border border-white/20 rounded-lg">
              <h3 className="font-semibold text-lg mb-4 text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                Tendances des Ventes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass p-4 border border-white/10 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp size={20} className="text-green-400" />
                    <span className="text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Ventes Aujourd'hui</span>
                  </div>
                  <p className="text-2xl font-bold text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                    {todaySales}
                  </p>
                  <p className="text-green-400 text-sm font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                    +8% vs hier
                  </p>
                </div>
                
                <div className="glass p-4 border border-white/10 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign size={20} className="text-blue-400" />
                    <span className="text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Panier Moyen</span>
                  </div>
                  <p className="text-2xl font-bold text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                    {sales.length > 0 ? Math.round(sales.reduce((sum, sale) => sum + sale.totalAmount, 0) / sales.length).toLocaleString() : 0}€
                  </p>
                  <p className="text-blue-400 text-sm font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                    +5% vs mois dernier
                  </p>
                </div>
                
                <div className="glass p-4 border border-white/10 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Package size={20} className="text-orange-400" />
                    <span className="text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Produits en Stock</span>
                  </div>
                  <p className="text-2xl font-bold text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                    {totalStock}
                  </p>
                  <p className="text-orange-400 text-sm font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                    {stockAlerts.filter(alert => alert.status === 'critical').length} critiques
                  </p>
                </div>
              </div>
            </div>

            {/* Store Performance */}
            <div className="glass p-6 border border-white/20 rounded-lg">
              <h3 className="font-semibold text-lg mb-4 text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                Performance par Magasin
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-white/10">
                    <tr>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Magasin</th>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Ventes</th>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Revenus</th>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Produits</th>
                      <th className="text-left p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stores.map(store => {
                      const storeSales = sales.filter(sale => sale.storeId === store.id);
                      const storeProducts = products.filter(product => product.storeId === store.id);
                      const storeStock = storeProducts.reduce((sum, product) => sum + product.stock, 0);
                      const storeRevenue = storeSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
                      
                      return (
                        <tr key={store.id} className="border-b border-white/5">
                          <td className="p-4 text-white font-medium font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                            {store.name}
                          </td>
                          <td className="p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                            {storeSales.length}
                          </td>
                          <td className="p-4 text-green-400 font-semibold font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                            {storeRevenue.toLocaleString()}€
                          </td>
                          <td className="p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                            {storeProducts.length}
                          </td>
                          <td className="p-4 text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                            {storeStock}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
                Gérez vos paramètres et préférences
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
                    value={profileForm.firstName}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-3 py-2 glass border border-white/20 rounded-lg text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                    Nom
                  </label>
                  <input
                    type="text"
                    value={profileForm.lastName}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-3 py-2 glass border border-white/20 rounded-lg text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 glass border border-white/20 rounded-lg text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    value={profileForm.currentPassword}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-3 py-2 glass border border-white/20 rounded-lg text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    value={profileForm.newPassword}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-3 py-2 glass border border-white/20 rounded-lg text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    value={profileForm.confirmPassword}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 glass border border-white/20 rounded-lg text-black"
                  />
                </div>
              </div>
              <button 
                onClick={handleProfileUpdate}
                className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium font-poppins"
              >
                Mettre à jour le profil
              </button>
            </div>

            {/* General Settings */}
            <div className="glass p-6 border border-white/20 rounded-lg">
              <h3 className="font-semibold text-lg mb-4 text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                Paramètres Généraux
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                    Nom de l'application
                  </label>
                  <input
                    type="text"
                    value={settingsForm.appName}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, appName: e.target.value }))}
                    className="w-full px-3 py-2 glass border border-white/20 rounded-lg text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                    Devise
                  </label>
                  <select
                    value={settingsForm.currency}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-full px-3 py-2 glass border border-white/20 rounded-lg text-black"
                  >
                    <option value="EUR">EUR (€)</option>
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                    Seuil d'alerte de stock bas
                  </label>
                  <input
                    type="number"
                    value={settingsForm.stockAlertThreshold}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, stockAlertThreshold: parseInt(e.target.value) || 5 }))}
                    className="w-full px-3 py-2 glass border border-white/20 rounded-lg text-black"
                  />
                </div>
              </div>
              <button 
                onClick={handleSettingsUpdate}
                className="mt-4 bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-blue-700 transition-all font-medium font-poppins"
              >
                Sauvegarder les paramètres
              </button>
            </div>

            {/* Notification Settings */}
            <div className="glass p-6 border border-white/20 rounded-lg">
              <h3 className="font-semibold text-lg mb-4 text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                Notifications
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settingsForm.emailNotifications}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                    Notifications par email pour les alertes de stock bas
                  </span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settingsForm.pushNotifications}
                    onChange={(e) => setSettingsForm(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                    Notifications push pour les nouvelles ventes
                  </span>
                </label>
              </div>
            </div>

            {/* Logout Button */}
            <div className="glass p-6 border border-white/20 rounded-lg">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium font-poppins"
              >
                <LogOut size={20} />
                Déconnexion
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="glass p-8 border border-white/20 rounded-lg text-center">
            <h2 className="text-xl font-semibold text-white mb-2 font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
              Section en développement
            </h2>
            <p className="text-gray-400 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
              Cette fonctionnalité sera bientôt disponible.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-full relative">
      {/* Animated Background */}
      <div className="animated-bg fixed inset-0" />
      
      <div className="flex h-full w-full relative z-10">
        {/* Admin Sidebar */}
        <aside className="w-64 sidebar-glass border-r border-white/20 flex flex-col flex-shrink-0">
          <div className="p-6 border-b border-white/20">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <h1 className="font-bold text-xl text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
                ElectroManager
              </h1>
              <p className="text-sm text-gray-400 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                Panneau Administrateur
              </p>
            </div>
          </div>

          <nav className="flex-1 p-4">
            {adminMenuItems.map((item) => {
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
            <div className="flex items-center gap-3 mb-4 p-3 glass rounded-lg">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold">{currentUser?.firstName?.charAt(0) || 'A'}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                  {currentUser?.firstName} {currentUser?.lastName}
                </p>
                <p className="text-xs text-gray-400 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                  Administrateur
                </p>
              </div>
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
                  {adminMenuItems.find(item => item.section === activeSection)?.label || "Dashboard"}
                </h1>
                <p className="text-gray-400 mt-1 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                  Vue globale de tous les magasins
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="glass px-4 py-2 rounded-lg border border-white/20">
                  <span className="text-sm text-gray-300 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                    Accès Administrateur
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

      {/* Modals */}
      <Modal 
        isOpen={isStoreModalOpen} 
        onClose={() => setIsStoreModalOpen(false)}
        title={editingStore ? "Modifier un magasin" : "Ajouter un magasin"}
      >
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSaveStore(); }}>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nom du magasin</label>
            <input
              type="text"
              value={storeForm.name}
              onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
              className="w-full p-3 glass border border-white/20 rounded-lg text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Adresse</label>
            <input
              type="text"
              value={storeForm.address}
              onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
              className="w-full p-3 glass border border-white/20 rounded-lg text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Téléphone</label>
            <input
              type="tel"
              value={storeForm.phone}
              onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })}
              className="w-full p-3 glass border border-white/20 rounded-lg text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={storeForm.email}
              onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
              className="w-full p-3 glass border border-white/20 rounded-lg text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Responsable</label>
            <input
              type="text"
              value={storeForm.manager}
              onChange={(e) => setStoreForm({ ...storeForm, manager: e.target.value })}
              className="w-full p-3 glass border border-white/20 rounded-lg text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Statut</label>
            <select
              value={storeForm.status}
              onChange={(e) => setStoreForm({ ...storeForm, status: e.target.value as 'active' | 'inactive' })}
              className="w-full p-3 glass border border-white/20 rounded-lg text-black"
            >
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium"
            >
              {editingStore ? "Modifier" : "Ajouter"}
            </button>
            <button
              type="button"
              onClick={() => setIsStoreModalOpen(false)}
              className="flex-1 bg-gray-500/20 text-gray-300 py-3 rounded-lg hover:bg-gray-500/30 transition-all font-medium"
            >
              Annuler
            </button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={isUserModalOpen} 
        onClose={() => setIsUserModalOpen(false)}
        title={editingUser ? "Modifier un utilisateur" : "Ajouter un utilisateur"}
      >
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSaveUser(); }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Prénom</label>
              <input
                type="text"
                value={userForm.firstName}
                onChange={(e) => setUserForm({ ...userForm, firstName: e.target.value })}
                className="w-full p-3 glass border border-white/20 rounded-lg text-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nom</label>
              <input
                type="text"
                value={userForm.lastName}
                onChange={(e) => setUserForm({ ...userForm, lastName: e.target.value })}
                className="w-full p-3 glass border border-white/20 rounded-lg text-black"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={userForm.email}
              onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
              className="w-full p-3 glass border border-white/20 rounded-lg text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Téléphone</label>
            <input
              type="tel"
              value={userForm.phone}
              onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
              className="w-full p-3 glass border border-white/20 rounded-lg text-black"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Rôle</label>
              <select
                value={userForm.role}
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value as 'administrateur' | 'gerant' | 'employe' })}
                className="w-full p-3 glass border border-white/20 rounded-lg text-black"
              >
                <option value="administrateur">Administrateur</option>
                <option value="gerant">Gérant</option>
                <option value="employe">Employé</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Magasin</label>
              <select
                value={userForm.storeId || ''}
                onChange={(e) => setUserForm({ ...userForm, storeId: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full p-3 glass border border-white/20 rounded-lg text-black"
              >
                <option value="">Non assigné</option>
                {stores.map(store => (
                  <option key={store.id} value={store.id}>{store.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Statut</label>
            <select
              value={userForm.status}
              onChange={(e) => setUserForm({ ...userForm, status: e.target.value as 'active' | 'inactive' })}
              className="w-full p-3 glass border border-white/20 rounded-lg text-black"
            >
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium"
            >
              {editingUser ? "Modifier" : "Ajouter"}
            </button>
            <button
              type="button"
              onClick={() => setIsUserModalOpen(false)}
              className="flex-1 bg-gray-500/20 text-gray-300 py-3 rounded-lg hover:bg-gray-500/30 transition-all font-medium"
            >
              Annuler
            </button>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={isProductModalOpen} 
        onClose={() => setIsProductModalOpen(false)}
        title={editingProduct ? "Modifier un produit" : "Ajouter un produit"}
      >
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSaveProduct(); }}>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nom du produit</label>
            <input
              type="text"
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              className="w-full p-3 glass border border-white/20 rounded-lg text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Catégorie</label>
            <input
              type="text"
              value={productForm.category}
              onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
              className="w-full p-3 glass border border-white/20 rounded-lg text-black"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Prix (€)</label>
              <input
                type="number"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                className="w-full p-3 glass border border-white/20 rounded-lg text-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Stock</label>
              <input
                type="number"
                value={productForm.stock}
                onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) || 0 })}
                className="w-full p-3 glass border border-white/20 rounded-lg text-black"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Magasin</label>
            <select
              value={productForm.storeId}
              onChange={(e) => setProductForm({ ...productForm, storeId: parseInt(e.target.value) })}
              className="w-full p-3 glass border border-white/20 rounded-lg text-black"
            >
              {stores.map(store => (
                <option key={store.id} value={store.id}>{store.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">SKU</label>
            <input
              type="text"
              value={productForm.sku}
              onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
              className="w-full p-3 glass border border-white/20 rounded-lg text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              className="w-full p-3 glass border border-white/20 rounded-lg text-black"
              rows={3}
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium"
            >
              {editingProduct ? "Modifier" : "Ajouter"}
            </button>
            <button
              type="button"
              onClick={() => setIsProductModalOpen(false)}
              className="flex-1 bg-gray-500/20 text-gray-300 py-3 rounded-lg hover:bg-gray-500/30 transition-all font-medium"
            >
              Annuler
            </button>
          </div>
        </form>
      </Modal>

      {/* Sale Modal */}
      {saleModalOpen && (
        <Modal
          title="Nouvelle Vente"
          isOpen={saleModalOpen}
          onClose={() => setSaleModalOpen(false)}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rechercher un produit</label>
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={saleForm.searchTerm}
                  onChange={(e) => handleProductSearch(e.target.value)}
                  placeholder="Nom du produit ou code SKU..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              {selectedProduct && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="font-medium text-green-800">{selectedProduct.name}</p>
                  <p className="text-sm text-green-600">Prix: {selectedProduct.price.toLocaleString()}€ | Stock: {selectedProduct.stock}</p>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
              <input
                type="number"
                min="1"
                max={selectedProduct?.stock || 1}
                value={saleForm.quantity}
                onChange={(e) => setSaleForm(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                disabled={!selectedProduct}
              />
            </div>

            {selectedProduct && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-blue-800">Total:</span>
                  <span className="text-xl font-bold text-blue-800">
                    {(selectedProduct.price * saleForm.quantity).toLocaleString()}€
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setSaleModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSaleSubmit}
                disabled={!selectedProduct || saleForm.quantity < 1}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Valider la vente
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

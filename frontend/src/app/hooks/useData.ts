import { useState, useEffect } from 'react';

// Types pour les données
export interface Store {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  manager: string;
  status: 'active' | 'inactive';
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'administrateur' | 'gerant' | 'employe';
  storeId?: number;
  status: 'active' | 'inactive';
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  storeId: number;
  description?: string;
  sku?: string;
}

export interface Sale {
  id: string;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  storeId: number;
  employeeId: number;
  employeeName: string;
  timestamp: string;
  paymentMethod: 'cash' | 'card' | 'mobile';
  customerEmail?: string;
}

export interface StockAlert {
  id: number;
  productId: number;
  productName: string;
  storeId: number;
  storeName: string;
  currentStock: number;
  minStock: number;
  status: 'critical' | 'low' | 'normal';
}

// Hook pour la gestion des données
export function useData() {
  const [stores, setStores] = useState<Store[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([]);

  // Initialiser les données depuis localStorage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Charger les magasins
    const storedStores = localStorage.getItem('electromanager_stores');
    if (storedStores) {
      setStores(JSON.parse(storedStores));
    } else {
      // Données initiales
      const initialStores: Store[] = [
        {
          id: 1,
          name: "Magasin Paris Centre",
          address: "123 Rue de Rivoli, 75001 Paris",
          phone: "+33 1 23 45 67 89",
          email: "paris@electromanager.com",
          manager: "Marie Dupont",
          status: "active"
        },
        {
          id: 2,
          name: "Magasin Lyon Part-Dieu",
          address: "45 Rue de la République, 69002 Lyon",
          phone: "+33 4 78 90 12 34",
          email: "lyon@electromanager.com",
          manager: "Pierre Martin",
          status: "active"
        },
        {
          id: 3,
          name: "Magasin Marseille Vieux-Port",
          address: "78 La Canebière, 13001 Marseille",
          phone: "+33 4 91 23 45 67",
          email: "marseille@electromanager.com",
          manager: "Sophie Bernard",
          status: "active"
        },
        {
          id: 4,
          name: "Magasin Toulouse Capitole",
          address: "12 Place du Capitole, 31000 Toulouse",
          phone: "+33 5 61 23 45 67",
          email: "toulouse@electromanager.com",
          manager: "Jean Dubois",
          status: "inactive"
        }
      ];
      setStores(initialStores);
      localStorage.setItem('electromanager_stores', JSON.stringify(initialStores));
    }

    // Charger les utilisateurs
    const storedUsers = localStorage.getItem('electromanager_users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      const initialUsers: User[] = [
        {
          id: 1,
          firstName: "Marie",
          lastName: "Dupont",
          email: "marie@electromanager.com",
          phone: "+33 6 12 34 56 78",
          role: "gerant",
          storeId: 1,
          status: "active"
        },
        {
          id: 2,
          firstName: "Pierre",
          lastName: "Martin",
          email: "pierre@electromanager.com",
          phone: "+33 6 23 45 67 89",
          role: "gerant",
          storeId: 2,
          status: "active"
        },
        {
          id: 3,
          firstName: "Sophie",
          lastName: "Bernard",
          email: "sophie@electromanager.com",
          phone: "+33 6 34 56 78 90",
          role: "employe",
          storeId: 1,
          status: "active"
        }
      ];
      setUsers(initialUsers);
      localStorage.setItem('electromanager_users', JSON.stringify(initialUsers));
    }

    // Charger les produits
    const storedProducts = localStorage.getItem('electromanager_products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      const initialProducts: Product[] = [
        {
          id: 1,
          name: "Laptop Dell XPS 15",
          category: "Ordinateurs",
          price: 1299,
          stock: 12,
          storeId: 1,
          sku: "DELL-XPS-15-001"
        },
        {
          id: 2,
          name: "iPhone 14 Pro",
          category: "Smartphones",
          price: 1199,
          stock: 8,
          storeId: 1,
          sku: "APPLE-IP14P-001"
        },
        {
          id: 3,
          name: "Samsung Galaxy S23",
          category: "Smartphones",
          price: 899,
          stock: 10,
          storeId: 2,
          sku: "SAMS-S23-001"
        },
        {
          id: 4,
          name: "MacBook Air M2",
          category: "Ordinateurs",
          price: 1499,
          stock: 6,
          storeId: 2,
          sku: "APPLE-MBA2-001"
        },
        {
          id: 5,
          name: "iPad Pro",
          category: "Tablettes",
          price: 1099,
          stock: 7,
          storeId: 3,
          sku: "APPLE-IPADP-001"
        }
      ];
      setProducts(initialProducts);
      localStorage.setItem('electromanager_products', JSON.stringify(initialProducts));
    }

    // Charger les ventes
    const storedSales = localStorage.getItem('electromanager_sales');
    if (storedSales) {
      setSales(JSON.parse(storedSales));
    } else {
      const initialSales: Sale[] = [
        {
          id: "VT-001",
          productId: 1,
          productName: "Laptop Dell XPS 15",
          quantity: 1,
          unitPrice: 1299,
          totalAmount: 1299,
          storeId: 1,
          employeeId: 3,
          employeeName: "Sophie Bernard",
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          paymentMethod: "card"
        },
        {
          id: "VT-002",
          productId: 2,
          productName: "iPhone 14 Pro",
          quantity: 1,
          unitPrice: 1199,
          totalAmount: 1199,
          storeId: 1,
          employeeId: 3,
          employeeName: "Sophie Bernard",
          timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
          paymentMethod: "mobile"
        }
      ];
      setSales(initialSales);
      localStorage.setItem('electromanager_sales', JSON.stringify(initialSales));
    }

    updateStockAlerts();
  };

  const updateStockAlerts = () => {
    const storedProducts = localStorage.getItem('electromanager_products');
    const storedStores = localStorage.getItem('electromanager_stores');
    
    if (storedProducts && storedStores) {
      const products: Product[] = JSON.parse(storedProducts);
      const stores: Store[] = JSON.parse(storedStores);
      
      const alerts: StockAlert[] = products.map(product => {
        const store = stores.find(s => s.id === product.storeId);
        const minStock = 10;
        let status: 'critical' | 'low' | 'normal' = 'normal';
        
        if (product.stock <= 5) {
          status = 'critical';
        } else if (product.stock <= 10) {
          status = 'low';
        }
        
        return {
          id: product.id,
          productId: product.id,
          productName: product.name,
          storeId: product.storeId,
          storeName: store?.name || 'Unknown',
          currentStock: product.stock,
          minStock,
          status
        };
      });
      
      setStockAlerts(alerts);
    }
  };

  // Fonctions CRUD pour les magasins
  const addStore = (store: Omit<Store, 'id'>) => {
    const newStore: Store = {
      ...store,
      id: Date.now()
    };
    const updatedStores = [...stores, newStore];
    setStores(updatedStores);
    localStorage.setItem('electromanager_stores', JSON.stringify(updatedStores));
    return newStore;
  };

  const updateStore = (id: number, updates: Partial<Store>) => {
    const updatedStores = stores.map(store => 
      store.id === id ? { ...store, ...updates } : store
    );
    setStores(updatedStores);
    localStorage.setItem('electromanager_stores', JSON.stringify(updatedStores));
  };

  const deleteStore = (id: number) => {
    const updatedStores = stores.filter(store => store.id !== id);
    setStores(updatedStores);
    localStorage.setItem('electromanager_stores', JSON.stringify(updatedStores));
  };

  // Fonctions CRUD pour les utilisateurs
  const addUser = (user: Omit<User, 'id'>) => {
    const newUser: User = {
      ...user,
      id: Date.now()
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('electromanager_users', JSON.stringify(updatedUsers));
    return newUser;
  };

  const updateUser = (id: number, updates: Partial<User>) => {
    const updatedUsers = users.map(user => 
      user.id === id ? { ...user, ...updates } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('electromanager_users', JSON.stringify(updatedUsers));
  };

  const deleteUser = (id: number) => {
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem('electromanager_users', JSON.stringify(updatedUsers));
  };

  // Fonctions CRUD pour les produits
  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now()
    };
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    localStorage.setItem('electromanager_products', JSON.stringify(updatedProducts));
    updateStockAlerts();
    return newProduct;
  };

  const updateProduct = (id: number, updates: Partial<Product>) => {
    const updatedProducts = products.map(product => 
      product.id === id ? { ...product, ...updates } : product
    );
    setProducts(updatedProducts);
    localStorage.setItem('electromanager_products', JSON.stringify(updatedProducts));
    updateStockAlerts();
  };

  const deleteProduct = (id: number) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('electromanager_products', JSON.stringify(updatedProducts));
    updateStockAlerts();
  };

  // Fonctions pour les ventes
  const addSale = (sale: Omit<Sale, 'id' | 'timestamp'>) => {
    const newSale: Sale = {
      ...sale,
      id: `VT-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    
    // Mettre à jour le stock du produit
    const product = products.find(p => p.id === sale.productId);
    if (product) {
      updateProduct(product.id, { stock: product.stock - sale.quantity });
    }
    
    const updatedSales = [...sales, newSale];
    setSales(updatedSales);
    localStorage.setItem('electromanager_sales', JSON.stringify(updatedSales));
    return newSale;
  };

  // Fonctions utilitaires
  const getStoreById = (id: number) => stores.find(store => store.id === id);
  const getUserById = (id: number) => users.find(user => user.id === id);
  const getProductById = (id: number) => products.find(product => product.id === id);
  const getProductsByStore = (storeId: number) => products.filter(product => product.storeId === storeId);
  const getSalesByStore = (storeId: number) => sales.filter(sale => sale.storeId === storeId);
  const getUsersByStore = (storeId: number) => users.filter(user => user.storeId === storeId);
  const getStockAlertsByStore = (storeId: number) => stockAlerts.filter(alert => alert.storeId === storeId);

  return {
    // Données
    stores,
    users,
    products,
    sales,
    stockAlerts,
    
    // Fonctions CRUD
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
    
    // Fonctions utilitaires
    getStoreById,
    getUserById,
    getProductById,
    getProductsByStore,
    getSalesByStore,
    getUsersByStore,
    getStockAlertsByStore,
    
    // Rechargement des données
    loadData,
    updateStockAlerts
  };
}

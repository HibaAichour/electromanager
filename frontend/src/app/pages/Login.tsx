import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Lock, Mail, User, Store as StoreIcon } from "lucide-react";
import { StoreLogo } from "../components/StoreLogo";
import { UserRole, Store } from "../types/auth";
import { useAuth as useAuthHook } from "../hooks/useAuth";

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuthHook();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "administrateur" as UserRole,
    storeId: "",
  });

  // Mock stores data - should come from the same source as Stores.tsx
  const stores: Store[] = [
    {
      id: 1,
      name: "Magasin Paris Centre",
      address: "123 Rue de Rivoli, 75001 Paris",
      phone: "+33 1 23 45 67 89",
      email: "paris@store.com",
      manager: "Marie Dupont",
      status: "active"
    },
    {
      id: 2,
      name: "Magasin Lyon Part-Dieu",
      address: "45 Rue de la République, 69002 Lyon",
      phone: "+33 4 78 90 12 34",
      email: "lyon@store.com",
      manager: "Pierre Martin",
      status: "active"
    },
    {
      id: 3,
      name: "Magasin Marseille Vieux-Port",
      address: "78 La Canebière, 13001 Marseille",
      phone: "+33 4 91 23 45 67",
      email: "marseille@store.com",
      manager: "Sophie Bernard",
      status: "active"
    },
    {
      id: 4,
      name: "Magasin Toulouse Capitole",
      address: "12 Place du Capitole, 31000 Toulouse",
      phone: "+33 5 61 23 45 67",
      email: "toulouse@store.com",
      manager: "Jean Dubois",
      status: "inactive"
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get registered users from localStorage
    const users = JSON.parse(localStorage.getItem('electromanager_users') || '[]');
    
    // Find user by email and password
    const user = users.find((u: any) => 
      u.email === formData.email && 
      u.password === formData.password &&
      u.role === formData.role
    );

    if (!user) {
      alert("Email, mot de passe ou rôle incorrect");
      return;
    }

    // Validate store selection for non-admin roles
    if ((formData.role === 'gerant' || formData.role === 'employe') && !formData.storeId) {
      alert("Veuillez sélectionner votre magasin assigné");
      return;
    }

    // Validate that the selected store matches the assigned store
    if ((formData.role === 'gerant' || formData.role === 'employe') && 
        user.storeId !== parseInt(formData.storeId)) {
      alert("Ce magasin ne vous est pas assigné");
      return;
    }

    // Login successful - create session
    login(user);
    
    // Redirect based on role
    switch (formData.role) {
      case 'administrateur':
        navigate("/admin");
        break;
      case 'gerant':
        navigate("/gerant");
        break;
      case 'employe':
        navigate("/employe");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <div className="flex h-screen relative">
      {/* Animated Background */}
      <div className="animated-bg" />
      
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="glass p-8 w-full max-w-md border border-white/20 card-3d">
          {/* Logo */}
          <div className="text-center mb-8">
            <StoreLogo />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                Email
              </label>
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 glass border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black font-inter"
                  style={{ fontFamily: 'var(--font-inter)' }}
                  placeholder="admin@electromanager.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                Mot de passe
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 glass border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black font-inter"
                  style={{ fontFamily: 'var(--font-inter)' }}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                Rôle
              </label>
              <div className="relative">
                <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 glass border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black font-inter appearance-none"
                  style={{ fontFamily: 'var(--font-inter)' }}
                  required
                >
                  <option value="administrateur">Administrateur</option>
                  <option value="gerant">Gérant</option>
                  <option value="employe">Employé/Caissier</option>
                </select>
              </div>
            </div>

            {(formData.role === 'gerant' || formData.role === 'employe') && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                  Magasin
                </label>
                <div className="relative">
                  <StoreIcon size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    name="storeId"
                    value={formData.storeId}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 glass border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black font-inter appearance-none"
                    style={{ fontFamily: 'var(--font-inter)' }}
                    required
                  >
                    <option value="">Sélectionner votre magasin</option>
                    {stores.filter(store => store.status === 'active').map((store) => (
                      <option key={store.id} value={store.id}>
                        {store.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium font-poppins transform hover:scale-105 neon-glow-blue"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Se connecter
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
            Vous n'avez pas de compte?{" "}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 hover:underline font-medium transition-colors">
              Créer un compte
            </Link>
          </p>

          <p className="text-center text-xs text-gray-500 mt-4 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
            Version 1.0 - ElectroManager Premium
          </p>
        </div>
      </div>
    </div>
  );
}

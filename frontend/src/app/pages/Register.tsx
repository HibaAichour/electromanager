import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Lock, Mail, User, Phone, Building, Store as StoreIcon } from "lucide-react";
import { StoreLogo } from "../components/StoreLogo";
import { UserRole, Store } from "../types/auth";

export function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    role: "administrateur" as UserRole,
    storeId: "",
    password: "",
    confirmPassword: "",
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

    // Validation
    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    if (formData.password.length < 8) {
      alert("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    // Validate store selection for non-admin roles
    if ((formData.role === 'gerant' || formData.role === 'employe') && !formData.storeId) {
      alert("Veuillez sélectionner un magasin pour ce rôle");
      return;
    }

    // Mock registration - Store user data in localStorage for demo
    const userData = {
      ...formData,
      id: Date.now().toString(),
      storeId: formData.role === 'administrateur' ? undefined : parseInt(formData.storeId)
    };
    
    // Store registered users (in real app, this would be API call)
    const existingUsers = JSON.parse(localStorage.getItem('electromanager_users') || '[]');
    existingUsers.push(userData);
    localStorage.setItem('electromanager_users', JSON.stringify(existingUsers));

    alert("Inscription réussie! Vous pouvez maintenant vous connecter.");
    navigate("/login");
  };

  return (
    <div className="flex h-screen relative">
      {/* Animated Background */}
      <div className="animated-bg" />
      
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="glass p-8 w-full max-w-4xl border border-white/20 card-3d">
          {/* Logo */}
          <div className="text-center mb-8">
            <StoreLogo />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                  Prénom
                </label>
                <div className="relative">
                  <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 glass border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black font-inter"
                    style={{ fontFamily: 'var(--font-inter)' }}
                    placeholder="Jean"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                  Nom
                </label>
                <div className="relative">
                  <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 glass border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black font-inter"
                    style={{ fontFamily: 'var(--font-inter)' }}
                    placeholder="Dupont"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email */}
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
                  placeholder="jean.dupont@electromanager.com"
                  required
                />
              </div>
            </div>

            {/* Phone & Company */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                  Téléphone
                </label>
                <div className="relative">
                  <Phone size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 glass border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black font-inter"
                    style={{ fontFamily: 'var(--font-inter)' }}
                    placeholder="+33 6 12 34 56 78"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                  Entreprise
                </label>
                <div className="relative">
                  <Building size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 glass border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black font-inter"
                    style={{ fontFamily: 'var(--font-inter)' }}
                    placeholder="Mon Entreprise"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Role Selection */}
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

            {/* Store Selection - Only show for non-admin roles */}
            {(formData.role === 'gerant' || formData.role === 'employe') && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                  Magasin assigné
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
                    <option value="">Sélectionner un magasin</option>
                    {stores.filter(store => store.status === 'active').map((store) => (
                      <option key={store.id} value={store.id}>
                        {store.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    minLength={8}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                  Confirmer mot de passe
                </label>
                <div className="relative">
                  <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 glass border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black font-inter"
                    style={{ fontFamily: 'var(--font-inter)' }}
                    placeholder="••••••••"
                    required
                    minLength={8}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium font-poppins transform hover:scale-105 neon-glow-blue"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Créer mon compte
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
            Vous avez déjà un compte?{" "}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 hover:underline font-medium transition-colors">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

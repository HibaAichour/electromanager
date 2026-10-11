import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { LayoutDashboard, Package, Warehouse, ShoppingCart, BarChart3, Store, LogOut, User } from "lucide-react";
import { StoreLogo } from "./StoreLogo";

export function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/stores", icon: Store, label: "Magasins" },
    { path: "/products", icon: Package, label: "Produits" },
    { path: "/stock", icon: Warehouse, label: "Stock" },
    { path: "/sales", icon: ShoppingCart, label: "Ventes" },
    { path: "/statistics", icon: BarChart3, label: "Statistiques" },
  ];

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="flex h-screen relative">
      {/* Animated Background */}
      <div className="animated-bg" />
      
      {/* Sidebar */}
      <aside className="sidebar-glass w-64 flex flex-col">
        <StoreLogo />

        <nav className="flex-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-item flex items-center gap-3 text-white hover:text-white transition-all ${
                  isActive ? "active" : ""
                }`}
              >
                <Icon size={20} className={isActive ? "neon-glow-blue" : ""} />
                <span className="font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="sidebar-item w-full flex items-center gap-3 text-white hover:text-red-400 transition-all"
          >
            <LogOut size={20} />
            <span className="font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
              Déconnexion
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="glass border-b border-white/20">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-xl font-semibold text-white font-poppins" style={{ fontFamily: 'var(--font-poppins)' }}>
              {menuItems.find((item) => item.path === location.pathname)?.label || "Dashboard"}
            </h2>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
                  <User size={20} className="text-white neon-glow-blue" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                    Admin User
                  </p>
                  <p className="text-xs text-gray-400 font-inter" style={{ fontFamily: 'var(--font-inter)' }}>
                    admin@store.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

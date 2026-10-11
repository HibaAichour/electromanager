import { createBrowserRouter, Navigate } from "react-router";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { LandingPage } from "./pages/LandingPage";
import { DashboardAdmin } from "./pages/DashboardAdmin";
import { DashboardGerant } from "./pages/DashboardGerant";
import { DashboardEmploye } from "./pages/DashboardEmploye";
import { Stores } from "./pages/Stores";
import { Products } from "./pages/Products";
import { Stock } from "./pages/Stock";
import { Sales } from "./pages/Sales";
import { Statistics } from "./pages/Statistics";

// Protected Route Component
function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole?: string }) {
  const authData = localStorage.getItem('electromanager_auth');
  
  if (!authData) {
    return <Navigate to="/login" replace />;
  }

  const session = JSON.parse(authData);
  
  if (allowedRole && session.user.role !== allowedRole) {
    // Redirect to appropriate dashboard based on role
    switch (session.user.role) {
      case 'administrateur':
        return <Navigate to="/admin" replace />;
      case 'gerant':
        return <Navigate to="/gerant" replace />;
      case 'employe':
        return <Navigate to="/employe" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  // Admin Dashboard Routes
  {
    path: "/admin",
    element: <ProtectedRoute allowedRole="administrateur"><DashboardAdmin /></ProtectedRoute>,
  },
  {
    path: "/admin/stores",
    element: <ProtectedRoute allowedRole="administrateur"><Stores /></ProtectedRoute>,
  },
  {
    path: "/admin/products",
    element: <ProtectedRoute allowedRole="administrateur"><Products /></ProtectedRoute>,
  },
  {
    path: "/admin/stock",
    element: <ProtectedRoute allowedRole="administrateur"><Stock /></ProtectedRoute>,
  },
  {
    path: "/admin/sales",
    element: <ProtectedRoute allowedRole="administrateur"><Sales /></ProtectedRoute>,
  },
  {
    path: "/admin/statistics",
    element: <ProtectedRoute allowedRole="administrateur"><Statistics /></ProtectedRoute>,
  },
  // Manager Dashboard Routes
  {
    path: "/gerant",
    element: <ProtectedRoute allowedRole="gerant"><DashboardGerant /></ProtectedRoute>,
  },
  {
    path: "/gerant/products",
    element: <ProtectedRoute allowedRole="gerant"><Products /></ProtectedRoute>,
  },
  {
    path: "/gerant/stock",
    element: <ProtectedRoute allowedRole="gerant"><Stock /></ProtectedRoute>,
  },
  {
    path: "/gerant/sales",
    element: <ProtectedRoute allowedRole="gerant"><Sales /></ProtectedRoute>,
  },
  {
    path: "/gerant/statistics",
    element: <ProtectedRoute allowedRole="gerant"><Statistics /></ProtectedRoute>,
  },
  // Employee Dashboard Routes
  {
    path: "/employe",
    element: <ProtectedRoute allowedRole="employe"><DashboardEmploye /></ProtectedRoute>,
  },
  {
    path: "/employe/products",
    element: <ProtectedRoute allowedRole="employe"><Products /></ProtectedRoute>,
  },
  {
    path: "/employe/stock",
    element: <ProtectedRoute allowedRole="employe"><Stock /></ProtectedRoute>,
  },
  {
    path: "/employe/sales",
    element: <ProtectedRoute allowedRole="employe"><Sales /></ProtectedRoute>,
  },
  // Landing page route
  {
    path: "/",
    Component: LandingPage,
  },
  // Fallback route - redirect to login
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);

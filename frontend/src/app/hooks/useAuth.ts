import { useState, useEffect } from 'react';
import { User, AuthSession, UserRole, getPermissionsByRole } from '../types/auth';

const STORAGE_KEY = 'electromanager_auth';

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const storedSession = localStorage.getItem(STORAGE_KEY);
    if (storedSession) {
      try {
        const parsedSession = JSON.parse(storedSession);
        setSession(parsedSession);
      } catch (error) {
        console.error('Failed to parse stored session:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = (user: User) => {
    const newSession: AuthSession = {
      user,
      isAuthenticated: true
    };
    setSession(newSession);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateUser = (updates: Partial<User>) => {
    if (session) {
      const updatedSession = {
        ...session,
        user: {
          ...session.user,
          ...updates
        }
      };
      setSession(updatedSession);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSession));
    }
  };

  const hasPermission = (permission: keyof ReturnType<typeof getPermissionsByRole>) => {
    if (!session) return false;
    const permissions = getPermissionsByRole(session.user.role);
    return permissions[permission];
  };

  const canAccessStore = (storeId: number) => {
    if (!session) return false;
    if (session.user.role === 'administrateur') return true;
    return session.user.storeId === storeId;
  };

  const getAccessibleStores = (allStores: any[]) => {
    if (!session) return [];
    if (session.user.role === 'administrateur') return allStores;
    return allStores.filter(store => store.id === session.user?.storeId);
  };

  return {
    session,
    loading,
    login,
    logout,
    updateUser,
    hasPermission,
    canAccessStore,
    getAccessibleStores,
    isAuthenticated: session?.isAuthenticated || false,
    currentUser: session?.user || null,
    userRole: session?.user.role || null,
    userStoreId: session?.user.storeId || null
  };
}

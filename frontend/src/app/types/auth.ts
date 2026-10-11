export type UserRole = 'administrateur' | 'gerant' | 'employe';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  role: UserRole;
  storeId?: number; // Only for gerant and employe
  password: string;
}

export interface AuthSession {
  user: User;
  isAuthenticated: boolean;
}

export interface Store {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  manager: string;
  status: "active" | "inactive";
}

export interface Permission {
  canViewAllStores: boolean;
  canViewStoreData: boolean;
  canManageProducts: boolean;
  canManageSales: boolean;
  canManageStock: boolean;
  canManageUsers: boolean;
  limitedAccess: boolean;
}

export function getPermissionsByRole(role: UserRole): Permission {
  switch (role) {
    case 'administrateur':
      return {
        canViewAllStores: true,
        canViewStoreData: true,
        canManageProducts: true,
        canManageSales: true,
        canManageStock: true,
        canManageUsers: true,
        limitedAccess: false
      };
    case 'gerant':
      return {
        canViewAllStores: false,
        canViewStoreData: true,
        canManageProducts: true,
        canManageSales: true,
        canManageStock: true,
        canManageUsers: false,
        limitedAccess: false
      };
    case 'employe':
      return {
        canViewAllStores: false,
        canViewStoreData: true,
        canManageProducts: false,
        canManageSales: true,
        canManageStock: true,
        canManageUsers: false,
        limitedAccess: true
      };
    default:
      return {
        canViewAllStores: false,
        canViewStoreData: false,
        canManageProducts: false,
        canManageSales: false,
        canManageStock: false,
        canManageUsers: false,
        limitedAccess: true
      };
  }
}

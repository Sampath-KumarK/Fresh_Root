export type UserRole = 'CUSTOMER' | 'FARMER' | 'ADMIN';

export interface AuthUser {
  token: string;
  id: number | string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  location?: string;
}

export interface Category {
  id: number | string;
  name: string;
  emoji?: string;
}

export interface Product {
  id: number | string;
  name: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  imageUrl?: string;
  categoryId: number | string;
  categoryName?: string;
  farmerId?: number | string;
  farmerName?: string;
  farmerLocation?: string;
  visible?: boolean;
}

export interface FarmerOrderItem {
  orderItemId: number | string;
  orderId: number | string;
  productName: string;
  quantity: number;
  price: number;
  status: 'PLACED' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED';
  customerName?: string;
  customerPhone?: string;
  address?: string;
  createdAt: string;
  farmerName?: string;
}

export interface CustomerOrderItem {
  productName: string;
  quantity: number;
  price: number;
  status: string;
  farmerName: string;
}

export interface CustomerOrder {
  orderId: number | string;
  createdAt: string;
  totalAmount: number;
  address: string;
  items: CustomerOrderItem[];
}

export interface AdminStats {
  totalFarmers: number;
  totalCustomers: number;
  totalProducts: number;
  totalOrders: number;
}

export interface AdminUser {
  id: number | string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  location?: string;
  createdAt?: string;
}

export interface FarmerProfile {
  id: number | string;
  name: string;
  farmName: string;
  location: string;
  experience: string;
  practice: string;
  bio: string;
  avatar: string;
  coverImage: string;
  specialties: string[];
  productCount: number;
  rating: number;
}

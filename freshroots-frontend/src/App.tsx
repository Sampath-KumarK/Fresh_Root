import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProtectedRoute } from './components/ProtectedRoute';

import { CustomerHome } from './pages/CustomerHome';
import { CartPage } from './pages/CartPage';
import { OrdersPage } from './pages/OrdersPage';
import { OurFarmers } from './pages/OurFarmers';
import { FarmerDashboard } from './pages/FarmerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { LoginCustomer } from './pages/LoginCustomer';
import { LoginFarmer } from './pages/LoginFarmer';
import { LoginAdmin } from './pages/LoginAdmin';
import { RegisterPage } from './pages/RegisterPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Public Customer Marketplace */}
            <Route path="/" element={<CustomerHome />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/farmers" element={<OurFarmers />} />

            {/* Customer Protected Route */}
            <Route
              path="/orders"
              element={
                <ProtectedRoute allowedRole="CUSTOMER">
                  <OrdersPage />
                </ProtectedRoute>
              }
            />

            {/* Farmer Protected Dashboard */}
            <Route
              path="/farmer"
              element={
                <ProtectedRoute allowedRole="FARMER">
                  <FarmerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Protected Dashboard */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRole="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Authentication Routes */}
            <Route path="/login" element={<LoginCustomer />} />
            <Route path="/farmer/login" element={<LoginFarmer />} />
            <Route path="/admin/login" element={<LoginAdmin />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

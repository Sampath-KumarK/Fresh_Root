import React, { useState, useEffect } from 'react';
import { api, getApiErrorMessage, API_BASE_URL } from '../config/api';
import { AdminStats, Product, AdminUser, CustomerOrder } from '../types';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { formatCurrency, getCategoryEmoji, getStatusBadgeClass } from '../utils/helpers';
import {
  ShieldCheck,
  Users,
  Tractor,
  Boxes,
  ShoppingBag,
  Eye,
  EyeOff,
  Trash2,
  RefreshCw,
  Search,
  CheckCircle,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'users' | 'orders'>('products');

  const [stats, setStats] = useState<AdminStats>({
    totalFarmers: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalOrders: 0,
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);

  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const showError = (msg: string) => {
    setErrorNotice(msg);
    setTimeout(() => setErrorNotice(null), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    setErrorNotice(null);
    try {
      const [statsRes, prodsRes, usersRes, ordersRes] = await Promise.allSettled([
        api.get<AdminStats>('/admin/stats'),
        api.get<Product[]>('/admin/products'),
        api.get<AdminUser[]>('/admin/users'),
        api.get<CustomerOrder[]>('/admin/orders'),
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.data) {
        setStats(statsRes.value.data);
      }
      if (prodsRes.status === 'fulfilled' && Array.isArray(prodsRes.value.data)) {
        setProducts(prodsRes.value.data);
      }
      if (usersRes.status === 'fulfilled' && Array.isArray(usersRes.value.data)) {
        setUsers(usersRes.value.data);
      }
      if (ordersRes.status === 'fulfilled' && Array.isArray(ordersRes.value.data)) {
        setOrders(ordersRes.value.data);
      }
    } catch (err: unknown) {
      console.error('Failed to load admin data', err);
      showError('Could not sync all admin records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Toggle Visibility
  const handleToggleVisibility = async (id: number | string, currentVisible?: boolean) => {
    const nextState = !currentVisible;
    try {
      await api.put(`/admin/products/${id}/visibility?visible=${nextState}`);

      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, visible: nextState } : p))
      );
      showNotice(`Produce is now ${nextState ? 'visible' : 'hidden'} on marketplace.`);
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'Could not update visibility setting.');
      showError(msg);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: number | string) => {
    try {
      await api.delete(`/admin/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setDeleteConfirmId(null);
      showNotice('Product permanently deleted.');
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'Could not delete product.');
      showError(msg);
    }
  };

  // Filtered lists
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (p.farmerName && p.farmerName.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      u.email.toLowerCase().includes(searchFilter.toLowerCase()) ||
      u.role.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAFAF5] flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1 w-full">
        {/* Notice alert */}
        {actionNotice && (
          <div className="mb-6 p-4 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 flex items-center gap-2 text-xs font-semibold shadow-xs">
            <CheckCircle className="w-4 h-4 text-purple-600" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Error alert */}
        {errorNotice && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2 text-xs font-semibold shadow-xs">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{errorNotice}</span>
          </div>
        )}

        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-200 uppercase tracking-wider">
                System Administration
              </span>
              <span className="text-xs text-stone-400">• Operational Overview</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1 flex items-center gap-2.5">
              <ShieldCheck className="w-7 h-7 text-purple-700" />
              <span>Freshroots Admin Console</span>
            </h1>
          </div>

          <button
            type="button"
            onClick={loadData}
            className="px-3.5 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh State</span>
          </button>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0">
              <Tractor className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-stone-500">Partner Farmers</p>
              <p className="text-2xl font-black text-stone-900">{stats.totalFarmers}</p>
              <span className="text-[10px] text-[#2E7D32] font-semibold">Active Growers</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-stone-500">Registered Customers</p>
              <p className="text-2xl font-black text-stone-900">{stats.totalCustomers}</p>
              <span className="text-[10px] text-[#2E7D32] font-semibold">Consumer Accounts</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Boxes className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-stone-500">Total Products</p>
              <p className="text-2xl font-black text-stone-900">{stats.totalProducts}</p>
              <span className="text-[10px] text-stone-400 font-semibold">Catalog Items</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-stone-500">Total Farm Orders</p>
              <p className="text-2xl font-black text-stone-900">{stats.totalOrders}</p>
              <span className="text-[10px] text-purple-600 font-semibold">Processed</span>
            </div>
          </div>
        </div>

        {/* Tabs & Search Navigation */}
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-stone-50/70 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('products')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'products'
                    ? 'bg-[#2E7D32] text-white shadow-xs'
                    : 'text-stone-600 hover:bg-stone-200/60'
                }`}
              >
                Products Directory ({products.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'users'
                    ? 'bg-[#2E7D32] text-white shadow-xs'
                    : 'text-stone-600 hover:bg-stone-200/60'
                }`}
              >
                Users ({users.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-[#2E7D32] text-white shadow-xs'
                    : 'text-stone-600 hover:bg-stone-200/60'
                }`}
              >
                Orders Audit ({orders.length})
              </button>
            </div>

            {/* Filter Search */}
            <div className="relative max-w-xs w-full">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter current view..."
                className="w-full bg-[#FAFAF5] text-xs text-stone-800 pl-8 pr-3 py-1.5 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
              />
            </div>
          </div>

          {/* TAB 1: Products */}
          {activeTab === 'products' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600">
                <thead className="bg-stone-50 text-[11px] uppercase tracking-wider text-stone-500 font-semibold border-b border-stone-200">
                  <tr>
                    <th className="py-3.5 px-4">Produce Name</th>
                    <th className="py-3.5 px-4">Farmer / Origin</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Stock</th>
                    <th className="py-3.5 px-4">Market Visibility</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredProducts.map((p) => {
                    const isVisible = p.visible !== false;
                    const emoji = getCategoryEmoji(p.categoryName, p.categoryId);

                    return (
                      <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-stone-100 border border-stone-200 overflow-hidden flex items-center justify-center shrink-0">
                              {p.id ? (
                                <img
                                  src={`${API_BASE_URL}/products/${p.id}/image`}
                                  alt={p.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <span>{emoji}</span>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-stone-900">{p.name}</p>
                              <span className="text-[10px] text-stone-400">ID: {p.id}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-stone-800">{p.farmerName || 'Local Grower'}</p>
                          <span className="text-[10px] text-stone-400">{p.farmerLocation}</span>
                        </td>

                        <td className="py-3.5 px-4 font-bold text-stone-900">
                          {formatCurrency(p.price)} / {p.unit}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-medium text-stone-700">
                            {p.stock} {p.unit}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleVisibility(p.id, isVisible)}
                            className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                              isVisible
                                ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9] hover:bg-[#C8E6C9]'
                                : 'bg-stone-100 text-stone-500 border-stone-300 hover:bg-stone-200'
                            }`}
                            title="Click to toggle marketplace visibility"
                          >
                            {isVisible ? (
                              <>
                                <Eye className="w-3.5 h-3.5 text-[#2E7D32]" />
                                <span>Visible</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-3.5 h-3.5 text-stone-400" />
                                <span>Hidden</span>
                              </>
                            )}
                          </button>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(p.id)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Produce"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: Users */}
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600">
                <thead className="bg-stone-50 text-[11px] uppercase tracking-wider text-stone-500 font-semibold border-b border-stone-200">
                  <tr>
                    <th className="py-3.5 px-4">User</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredUsers.map((u) => {
                    const roleColor =
                      u.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-900 border-purple-200'
                        : u.role === 'FARMER'
                        ? 'bg-amber-100 text-amber-900 border-amber-200'
                        : 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]';

                    return (
                      <tr key={u.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-stone-900">{u.name}</p>
                          <span className="text-[11px] text-stone-400 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {u.email}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${roleColor}`}>
                            {u.role}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          {u.phone ? (
                            <span className="flex items-center gap-1 text-stone-600 font-medium">
                              <Phone className="w-3 h-3 text-stone-400" />
                              {u.phone}
                            </span>
                          ) : (
                            <span className="text-stone-400">—</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="flex items-center gap-1 text-stone-600">
                            <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                            {u.location || 'Local Regional'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-stone-400 text-[11px]">
                          {u.createdAt || 'Registered'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: Orders Audit */}
          {activeTab === 'orders' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600">
                <thead className="bg-stone-50 text-[11px] uppercase tracking-wider text-stone-500 font-semibold border-b border-stone-200">
                  <tr>
                    <th className="py-3.5 px-4">Order ID</th>
                    <th className="py-3.5 px-4">Placed Date</th>
                    <th className="py-3.5 px-4">Delivery Address</th>
                    <th className="py-3.5 px-4">Items / Farmers</th>
                    <th className="py-3.5 px-4 text-right">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders.map((o) => {
                    const formattedDate = new Date(o.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <tr key={o.orderId} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-stone-900">
                          #{o.orderId}
                        </td>

                        <td className="py-3.5 px-4 text-stone-500 text-[11px]">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-stone-400" />
                            {formattedDate}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 max-w-xs truncate text-stone-700">
                          {o.address}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            {o.items.map((i, idx) => {
                              const badge = getStatusBadgeClass(i.status);
                              return (
                                <div key={idx} className="flex items-center gap-2 text-[11px]">
                                  <span className="font-semibold text-stone-800">
                                    {i.quantity}x {i.productName}
                                  </span>
                                  {i.farmerName && <span className="text-stone-400">({i.farmerName})</span>}
                                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${badge.bg} ${badge.text}`}>
                                    {i.status}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right font-black text-stone-900 text-sm">
                          {formatCurrency(o.totalAmount)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900 text-center">Confirm Platform Delete</h3>
            <p className="text-xs text-stone-500 text-center mt-1">
              Are you sure you want to permanently delete this produce item across the platform?
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

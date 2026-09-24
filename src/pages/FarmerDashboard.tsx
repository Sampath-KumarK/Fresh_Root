import React, { useState, useEffect } from 'react';
import { api, getApiErrorMessage } from '../config/api';
import { Product, FarmerOrderItem, Category } from '../types';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { formatCurrency, getCategoryEmoji, getStatusBadgeClass } from '../utils/helpers';
import {
  Tractor,
  Package,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  RefreshCw,
  Phone,
  MapPin,
  DollarSign,
  Boxes,
  X,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';

export const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Orders state
  const [orders, setOrders] = useState<FarmerOrderItem[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    unit: 'kg',
    stock: '',
    imageUrl: '',
    categoryId: '1',
  });
  const [savingProduct, setSavingProduct] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete confirm modal
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Feedback notifications
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const showError = (msg: string) => {
    setActionError(msg);
    setTimeout(() => setActionError(null), 4000);
  };

  // Fetch products
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await api.get<Product[]>('/farmer/products');
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (err: unknown) {
      console.error('Failed to load farmer products', err);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await api.get<FarmerOrderItem[]>('/farmer/orders');
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (err: unknown) {
      console.error('Failed to load farmer orders', err);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();

    // Fetch categories for modal dropdown
    api
      .get<Category[]>('/categories')
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        }
      })
      .catch((err) => console.warn('Could not load categories', err));
  }, []);

  // Open modal for new product
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      unit: 'kg',
      stock: '',
      imageUrl: '',
      categoryId: categories[0]?.id ? String(categories[0].id) : '1',
    });
    setFormError(null);
    setModalOpen(true);
  };

  // Open modal for editing product
  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      description: p.description || '',
      price: String(p.price),
      unit: p.unit || 'kg',
      stock: String(p.stock),
      imageUrl: p.imageUrl || '',
      categoryId: String(p.categoryId),
    });
    setFormError(null);
    setModalOpen(true);
  };

  // Save product (Add or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim() || !productForm.price) {
      setFormError('Please enter a valid product name and price.');
      return;
    }

    setSavingProduct(true);
    setFormError(null);

    const payload = {
      name: productForm.name.trim(),
      description: productForm.description.trim(),
      price: parseFloat(productForm.price),
      unit: productForm.unit.trim(),
      stock: parseInt(productForm.stock, 10) || 0,
      imageUrl: productForm.imageUrl.trim(),
      categoryId: Number(productForm.categoryId),
    };

    try {
      if (editingProduct) {
        await api.put(`/farmer/products/${editingProduct.id}`, payload);
        showSuccess(`Updated "${payload.name}" successfully!`);
      } else {
        await api.post('/farmer/products', payload);
        showSuccess(`Added "${payload.name}" to your farm listings!`);
      }

      setModalOpen(false);
      fetchProducts();
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'Failed to save produce.');
      setFormError(msg);
    } finally {
      setSavingProduct(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string | number) => {
    setDeleting(true);
    try {
      await api.delete(`/farmer/products/${id}`);
      showSuccess('Product removed from active listings.');
      setDeleteConfirmId(null);
      fetchProducts();
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'Failed to delete produce.');
      showError(msg);
    } finally {
      setDeleting(false);
    }
  };

  // Update order item status
  const handleStatusChange = async (
    orderItemId: string | number,
    newStatus: 'PLACED' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED'
  ) => {
    try {
      await api.put(`/farmer/order-items/${orderItemId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.orderItemId === orderItemId ? { ...o, status: newStatus } : o))
      );
      showSuccess(`Order #${orderItemId} status updated to ${newStatus}`);
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'Could not update status. Please try again.');
      showError(msg);
    }
  };

  // Stats calculation
  const totalStockItems = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'PLACED').length;
  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((acc, o) => acc + o.price * o.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FAFAF5] flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Success Alert */}
        {actionSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] flex items-center justify-between text-xs font-semibold shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#2E7D32] shrink-0" />
              <span>{actionSuccess}</span>
            </div>
            <button
              type="button"
              onClick={() => setActionSuccess(null)}
              className="text-[#2E7D32] hover:text-[#1B5E20] font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Error Alert */}
        {actionError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between text-xs font-semibold shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{actionError}</span>
            </div>
            <button
              type="button"
              onClick={() => setActionError(null)}
              className="text-rose-600 hover:text-rose-950 font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Farmer Header & Metrics */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] flex items-center justify-center shrink-0">
                <Tractor className="w-9 h-9" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] uppercase tracking-wider">
                    Farmer Partner Console
                  </span>
                  <span className="text-xs text-stone-400">• Verified Grower</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
                  {user?.name || 'Local Farm Producer'}
                </h1>
                <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{user?.location || 'Direct Farm Origin'}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="px-5 py-2.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-[#2E7D32]/20 flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Harvest</span>
              </button>
            </div>
          </div>

          {/* Quick Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-stone-100">
            <div className="p-4 rounded-2xl bg-[#FAFAF5] border border-stone-200 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0">
                <Boxes className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-500">Active Listings</p>
                <p className="text-xl font-black text-stone-900">
                  {products.length}{' '}
                  <span className="text-xs font-normal text-stone-400">({totalStockItems} total units)</span>
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAFAF5] border border-stone-200 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#FFF3E0] text-[#F57C00] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-500">Pending Orders</p>
                <p className="text-xl font-black text-stone-900">
                  {pendingOrdersCount}{' '}
                  <span className="text-xs font-normal text-stone-400">awaiting harvest</span>
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAFAF5] border border-stone-200 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-500">Gross Sales Value</p>
                <p className="text-xl font-black text-[#2E7D32]">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-stone-200 mb-6 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'products'
                ? 'border-[#2E7D32] text-[#2E7D32]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>My Products ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'orders'
                ? 'border-[#2E7D32] text-[#2E7D32]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Orders Received ({orders.length})</span>
            {pendingOrdersCount > 0 && (
              <span className="px-1.5 py-0.2 bg-[#F57C00] text-white text-[10px] rounded-full font-bold">
                {pendingOrdersCount}
              </span>
            )}
          </button>
        </div>

        {/* Tab 1: My Products */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-stone-50/70 border-b border-stone-200 flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Harvest Inventory Catalog
              </span>
              <button
                type="button"
                onClick={fetchProducts}
                className="text-xs text-stone-600 hover:text-[#2E7D32] flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingProducts ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {loadingProducts ? (
              <div className="p-8 text-center text-xs text-stone-400">Loading your farm produce...</div>
            ) : products.length === 0 ? (
              <div className="p-12 text-center">
                <Boxes className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-stone-800">No produce listed yet</h3>
                <p className="text-xs text-stone-500 mt-1">
                  Start adding vegetables, fruits, or greens to sell directly to consumers.
                </p>
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="mt-4 px-4 py-2 bg-[#2E7D32] text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-[#1B5E20]"
                >
                  Add First Product
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-600">
                  <thead className="bg-stone-50 text-[11px] uppercase tracking-wider text-stone-500 font-semibold border-b border-stone-200">
                    <tr>
                      <th className="py-3.5 px-4">Produce</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price / Unit</th>
                      <th className="py-3.5 px-4">Current Stock</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {products.map((p) => {
                      const emoji = getCategoryEmoji(p.categoryName, p.categoryId);
                      return (
                        <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-stone-100 border border-stone-200 overflow-hidden flex items-center justify-center shrink-0">
                                {p.imageUrl ? (
                                  <img
                                    src={p.imageUrl}
                                    alt={p.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.currentTarget as HTMLElement).style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <span className="text-xl">{emoji}</span>
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-stone-900">{p.name}</p>
                                <p className="text-[11px] text-stone-400 line-clamp-1 max-w-xs">
                                  {p.description || 'Fresh harvest item'}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-medium text-stone-700">
                            <span className="px-2 py-0.5 bg-[#E8F5E9] text-[#2E7D32] rounded-md text-[11px] font-semibold">
                              {p.categoryName || 'General'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-bold text-stone-900">
                            {formatCurrency(p.price)} <span className="text-stone-400 font-normal">/ {p.unit}</span>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                                p.stock > 10
                                  ? 'bg-[#E8F5E9] text-[#2E7D32]'
                                  : p.stock > 0
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {p.stock} {p.unit}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(p)}
                                className="p-1.5 text-stone-600 hover:text-[#2E7D32] hover:bg-[#E8F5E9] rounded-lg transition-colors cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(p.id)}
                                className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Orders Received */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-stone-50/70 border-b border-stone-200 flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Direct Customer Fulfillment Queue
              </span>
              <button
                type="button"
                onClick={fetchOrders}
                className="text-xs text-stone-600 hover:text-[#2E7D32] flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingOrders ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {loadingOrders ? (
              <div className="p-8 text-center text-xs text-stone-400">Loading incoming orders...</div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center">
                <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-stone-800">No orders received yet</h3>
                <p className="text-xs text-stone-500 mt-1">
                  Customer orders for your produce will appear here for harvesting and dispatch.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-600">
                  <thead className="bg-stone-50 text-[11px] uppercase tracking-wider text-stone-500 font-semibold border-b border-stone-200">
                    <tr>
                      <th className="py-3.5 px-4">Order / Date</th>
                      <th className="py-3.5 px-4">Produce Ordered</th>
                      <th className="py-3.5 px-4">Customer Details</th>
                      <th className="py-3.5 px-4">Payout</th>
                      <th className="py-3.5 px-4">Fulfillment Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {orders.map((o) => {
                      const badge = getStatusBadgeClass(o.status);
                      const formattedDate = new Date(o.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      });

                      return (
                        <tr key={o.orderItemId} className="hover:bg-stone-50/70 transition-colors">
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-stone-900">#{o.orderId}</span>
                            <div className="text-[10px] text-stone-400 mt-0.5">{formattedDate}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <p className="font-bold text-stone-900">{o.productName}</p>
                            <p className="text-[11px] text-stone-500">
                              Qty: <strong>{o.quantity}</strong> @ {formatCurrency(o.price)} each
                            </p>
                          </td>

                          <td className="py-3.5 px-4">
                            <p className="font-semibold text-stone-800">{o.customerName || 'Customer'}</p>
                            {o.customerPhone && (
                              <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                                <Phone className="w-3 h-3 text-stone-400" />
                                {o.customerPhone}
                              </p>
                            )}
                            {o.address && (
                              <p className="text-[11px] text-stone-400 truncate max-w-xs flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                                {o.address}
                              </p>
                            )}
                          </td>

                          <td className="py-3.5 px-4 font-bold text-[#2E7D32] text-sm">
                            {formatCurrency(o.price * o.quantity)}
                          </td>

                          <td className="py-3.5 px-4">
                            <select
                              value={o.status}
                              onChange={(e) =>
                                handleStatusChange(
                                  o.orderItemId,
                                  e.target.value as 'PLACED' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED'
                                )
                              }
                              className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2E7D32] ${badge.bg} ${badge.text} ${badge.border}`}
                            >
                              <option value="PLACED">PLACED (Pending Harvest)</option>
                              <option value="CONFIRMED">CONFIRMED (Harvested / Ready)</option>
                              <option value="DELIVERED">DELIVERED (Delivered)</option>
                              <option value="CANCELLED">CANCELLED (Cancelled)</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-lg font-bold text-stone-900">
                {editingProduct ? 'Edit Harvest Produce' : 'Add New Farm Produce'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-3 p-3 bg-rose-50 text-rose-800 rounded-xl text-xs border border-rose-200">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Produce Name *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Heirloom Carrots"
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] bg-[#FAFAF5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Freshly harvested, naturally grown..."
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] bg-[#FAFAF5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.1"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="3.50"
                    className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] bg-[#FAFAF5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Unit *
                  </label>
                  <select
                    value={productForm.unit}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                    className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] bg-white"
                  >
                    <option value="kg">kg</option>
                    <option value="bunch">bunch</option>
                    <option value="pack">pack</option>
                    <option value="dozen">dozen</option>
                    <option value="box">box</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Available Stock *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    placeholder="40"
                    className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] bg-[#FAFAF5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                    className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] bg-white"
                  >
                    {categories.length > 0 ? (
                      categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="1">Vegetables</option>
                        <option value="2">Fruits</option>
                        <option value="3">Leafy Greens</option>
                        <option value="4">Roots & Tubers</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/... (blank uses category emoji)"
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] bg-[#FAFAF5]"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="px-5 py-2.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-xs rounded-xl shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {savingProduct ? 'Saving...' : editingProduct ? 'Update Produce' : 'Publish Produce'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900 text-center">Confirm Deletion</h3>
            <p className="text-xs text-stone-500 text-center mt-1">
              Are you sure you want to remove this harvest item? It will no longer be visible on the public marketplace.
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
                disabled={deleting}
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

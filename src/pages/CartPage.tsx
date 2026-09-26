import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { API_BASE_URL } from '../config/api';
import { useAuth } from '../context/AuthContext';
import { api, getApiErrorMessage } from '../config/api';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { formatCurrency, getCategoryEmoji, getCategoryPlaceholderImage } from '../utils/helpers';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  MapPin,
  CheckCircle,
  AlertCircle,
  Leaf
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const { items, updateQuantity, removeFromCart, clearCart, totalAmount, totalCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState(user?.location || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/cart' } } });
      return;
    }

    if (user.role !== 'CUSTOMER') {
      setError(`Your current account has the "${user.role}" role. Only customers can place consumer orders. Please sign in with a Customer account.`);
      return;
    }

    if (!address.trim()) {
      setError('Please provide a valid delivery address.');
      return;
    }

    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload = {
      address: address.trim(),
      items: items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    };

    try {
      await api.post('/customer/orders', payload);
      clearCart();
      navigate('/orders');
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'Failed to place order with backend.');
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF5] flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1 w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2.5">
              <ShoppingBag className="w-7 h-7 text-[#2E7D32]" />
              <span>Your Fresh Harvest Cart</span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Review your direct-from-farm produce before placing your harvest order.
            </p>
          </div>

          <Link
            to="/"
            className="text-xs sm:text-sm font-semibold text-[#2E7D32] hover:underline flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-md mx-auto my-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-stone-900">Your basket is currently empty</h2>
            <p className="text-xs text-stone-500">
              Browse our farmer catalog to add farm-fresh vegetables, fruits, and leafy greens.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-sm rounded-xl transition-all shadow-sm"
            >
              <span>Explore Harvests</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Items List */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-4">
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                <div className="p-4 bg-stone-50/80 border-b border-stone-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Produce Items ({totalCount})
                  </span>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                <div className="divide-y divide-stone-100">
                  {items.map(({ product, quantity }) => {
                    const emoji = getCategoryEmoji(product.categoryName, product.categoryId);

                    return (
                      <div
                        key={product.id}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden flex items-center justify-center shrink-0">
                            <img
                              src={`${API_BASE_URL}/products/${product.id}/image`}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = getCategoryPlaceholderImage(product.categoryName, product.categoryId);
                              }}
                            />
                          </div>

                          <div>
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32]">
                              {product.categoryName || 'Farm Fresh'}
                            </span>
                            <h3 className="font-bold text-stone-900 text-sm mt-0.5">
                              {product.name}
                            </h3>
                            <p className="text-xs text-stone-500">
                              {formatCurrency(product.price)} / {product.unit || 'kg'}
                              {product.farmerName && ` · ${product.farmerName}`}
                            </p>
                          </div>
                        </div>

                        {/* Quantity and Actions */}
                        <div className="flex items-center justify-between sm:justify-end gap-6">
                          {/* Quantity Selector with Orange Accent */}
                          <div className="flex items-center bg-[#FFF3E0] border border-[#F57C00]/30 rounded-xl p-1">
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              className="w-7 h-7 rounded-lg bg-[#F57C00] hover:bg-[#E65100] text-white flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-bold text-xs text-stone-900">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              className="w-7 h-7 rounded-lg bg-[#F57C00] hover:bg-[#E65100] text-white flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Line Total */}
                          <div className="text-right min-w-[70px]">
                            <p className="font-bold text-stone-900 text-sm">
                              {formatCurrency(product.price * quantity)}
                            </p>
                            <span className="text-[10px] text-stone-400">
                              {quantity} {product.unit || 'kg'}
                            </span>
                          </div>

                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => removeFromCart(product.id)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Remove from cart"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Delivery Form */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-4">
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
                <h2 className="text-base font-bold text-stone-900 pb-3 border-b border-stone-100">
                  Order Summary
                </h2>

                {error && (
                  <div className="p-3.5 bg-rose-50 text-rose-800 rounded-xl text-xs flex items-start gap-2 border border-rose-200">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-2.5 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Items Subtotal ({totalCount} units)</span>
                    <span className="font-semibold text-stone-900">{formatCurrency(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Direct Farm Dispatch</span>
                    <span className="text-[#2E7D32] font-semibold">Free Delivery</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Packaging</span>
                    <span className="font-semibold text-stone-900">$0.00</span>
                  </div>
                  <div className="pt-3 border-t border-stone-100 flex justify-between text-sm font-extrabold text-stone-900">
                    <span>Total Amount</span>
                    <span className="text-lg text-[#2E7D32]">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>

                {/* Delivery Address & Place Order Form */}
                <form onSubmit={handleCheckout} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Delivery Address *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                      <textarea
                        rows={3}
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Apartment / Flat, Street Address, Landmark, City, Postal Code"
                        className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] bg-[#FAFAF5] text-stone-900 placeholder:text-stone-400"
                      />
                    </div>
                  </div>

                  {!user ? (
                    <div className="space-y-2">
                      <button
                        type="submit"
                        className="w-full py-3 px-4 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-[#2E7D32]/25 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Sign In to Place Order</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <p className="text-[11px] text-stone-400 text-center">
                        You will be asked to log in to finalize your farm order.
                      </p>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 px-4 bg-[#F57C00] hover:bg-[#E65100] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-[#F57C00]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? (
                        <span>Submitting Order to Farmers...</span>
                      ) : (
                        <>
                          <span>Confirm & Place Order</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </form>

                <div className="pt-2 border-t border-stone-100 flex items-center gap-2 text-[11px] text-stone-500">
                  <Leaf className="w-4 h-4 text-[#2E7D32] shrink-0" />
                  <span>Farm-to-Door direct delivery guaranteed fresh.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, getApiErrorMessage } from '../config/api';
import { CustomerOrder } from '../types';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { formatCurrency, getStatusBadgeClass } from '../utils/helpers';
import {
  Package,
  Calendar,
  MapPin,
  RefreshCw,
  ShoppingBag,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<CustomerOrder[]>('/customer/orders');
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'Failed to load your orders.');
      setError(msg);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF5] flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5E9] text-[#2E7D32] uppercase tracking-wider">
                Direct Farm Deliveries
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1 flex items-center gap-2.5">
              <Package className="w-7 h-7 text-[#2E7D32]" />
              <span>My Orders</span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Track fulfillment status of your farm harvests from grower fields to your kitchen.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchOrders}
            className="self-start sm:self-auto px-3.5 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#2E7D32]' : ''}`} />
            <span>Refresh Orders</span>
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Order status sync:</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 animate-pulse"
              >
                <div className="h-5 bg-stone-100 rounded w-1/4" />
                <div className="h-4 bg-stone-100 rounded w-1/2" />
                <div className="h-16 bg-stone-50 rounded-xl" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-md mx-auto my-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto">
              <Package className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-stone-900">No orders placed yet</h2>
            <p className="text-xs text-stone-500">
              When you purchase farm produce, your active shipments and delivery updates will appear here.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm"
            >
              <span>Start Shopping Fresh</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={order.orderId}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs"
                >
                  {/* Order Top Bar */}
                  <div className="p-4 sm:p-5 bg-stone-50/80 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center font-bold text-xs">
                        #{order.orderId}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-stone-900">
                          Order #{order.orderId}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-stone-400 mt-0.5">
                          <Calendar className="w-3 h-3 text-stone-400" />
                          <span>{formattedDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-stone-400">Total</span>
                        <p className="text-base font-black text-stone-900">
                          {formatCurrency(order.totalAmount)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  {order.address && (
                    <div className="px-4 sm:px-5 py-2.5 bg-[#FAFAF5]/70 border-b border-stone-100 flex items-center gap-2 text-xs text-stone-600">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="font-semibold text-stone-700">Delivery Address:</span>
                      <span className="truncate">{order.address}</span>
                    </div>
                  )}

                  {/* Order Items */}
                  <div className="divide-y divide-stone-100">
                    {order.items.map((item, idx) => {
                      const badge = getStatusBadgeClass(item.status);

                      return (
                        <div
                          key={idx}
                          className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/40 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-base">
                              🥦
                            </div>
                            <div>
                              <p className="font-bold text-stone-900 text-sm">
                                {item.productName}
                              </p>
                              <p className="text-xs text-stone-500">
                                {item.farmerName ? `Harvested by ${item.farmerName} · ` : ''}
                                Qty: <strong className="text-stone-800">{item.quantity}</strong> @ {formatCurrency(item.price)} each
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-4">
                            <span className="font-bold text-stone-900 text-sm">
                              {formatCurrency(item.price * item.quantity)}
                            </span>

                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold border ${badge.bg} ${badge.text} ${badge.border}`}
                            >
                              {item.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

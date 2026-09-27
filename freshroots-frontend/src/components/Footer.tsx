import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, Truck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-stone-200 mt-auto text-stone-600 font-sans">
      {/* Value highlights */}
      <div className="border-b border-stone-100 py-6 px-4 sm:px-6 lg:px-8 bg-[#FAFAF5]/60">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900">Direct From Farm</p>
              <p className="text-[11px] text-stone-500">Harvested fresh daily by certified local growers</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900">Fair Price Guarantee</p>
              <p className="text-[11px] text-stone-500">Transparent pricing with zero middleman markups</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900">Direct Delivery</p>
              <p className="text-[11px] text-stone-500">Straight from farm gate to your front door</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2E7D32] text-white flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base text-[#2E7D32] tracking-tight">Freshroots</span>
              <p className="text-[11px] text-stone-400">Connecting local growers to healthy homes</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-stone-600">
            <Link to="/" className="hover:text-[#2E7D32] transition-colors">
              Marketplace
            </Link>
            <Link to="/cart" className="hover:text-[#2E7D32] transition-colors">
              Cart
            </Link>
            <Link to="/orders" className="hover:text-[#2E7D32] transition-colors">
              Orders
            </Link>
            <Link to="/farmer/login" className="hover:text-[#2E7D32] transition-colors">
              Farmer Login
            </Link>
            <Link to="/admin/login" className="hover:text-purple-700 transition-colors">
              Admin Login
            </Link>
          </div>

          <div className="text-xs text-stone-400 text-center sm:text-right">
            <p>© {new Date().getFullYear()} Freshroots. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

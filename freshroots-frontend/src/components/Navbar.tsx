import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  Sprout,
  ShoppingCart,
  Package,
  LogOut,
  Tractor,
  ShieldCheck,
  Search,
  Menu,
  X,
  ChevronDown,
  UserCheck
} from 'lucide-react';

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ searchQuery, onSearchChange }) => {
  const { user, logout } = useAuth();
  const { totalCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isCustomerHome = location.pathname === '/';

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-[#2E7D32] flex items-center justify-center text-white shadow-sm shadow-[#2E7D32]/25 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#2E7D32] leading-none">
                Freshroots
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-500 mt-0.5">
                Farm to Home Marketplace
              </span>
            </div>
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery ?? ''}
                onChange={(e) => {
                  if (onSearchChange) {
                    onSearchChange(e.target.value);
                  } else if (!isCustomerHome) {
                    navigate(`/?search=${encodeURIComponent(e.target.value)}`);
                  }
                }}
                placeholder="Search fresh farm produce, fruits, vegetables..."
                className="w-full bg-[#FAFAF5] hover:bg-stone-50 focus:bg-white text-sm text-stone-900 pl-10 pr-4 py-2 rounded-full border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent transition-all placeholder:text-stone-400"
              />
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-semibold transition-colors ${
                location.pathname === '/' ? 'text-[#2E7D32]' : 'text-stone-600 hover:text-[#2E7D32]'
              }`}
            >
              Marketplace
            </Link>

            {user?.role === 'CUSTOMER' && (
              <Link
                to="/orders"
                className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  location.pathname === '/orders' ? 'text-[#2E7D32]' : 'text-stone-600 hover:text-[#2E7D32]'
                }`}
              >
                <Package className="w-4 h-4 text-stone-500" />
                <span>My Orders</span>
              </Link>
            )}

            {user?.role === 'FARMER' && (
              <Link
                to="/farmer"
                className="text-sm font-semibold text-[#2E7D32] bg-[#E8F5E9] px-3 py-1.5 rounded-lg border border-[#C8E6C9] hover:bg-[#C8E6C9] transition-colors flex items-center gap-1.5"
              >
                <Tractor className="w-4 h-4 text-[#2E7D32]" />
                <span>Farmer Dashboard</span>
              </Link>
            )}

            {user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                className="text-sm font-semibold text-purple-800 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-purple-700" />
                <span>Admin Console</span>
              </Link>
            )}
          </nav>

          {/* Right Actions: Cart & Auth */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            {user?.role !== 'FARMER' && (
              <Link
                to="/cart"
                className="relative p-2.5 rounded-full text-stone-700 hover:text-[#2E7D32] hover:bg-[#E8F5E9] transition-colors flex items-center justify-center border border-stone-200"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#F57C00] text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {totalCount > 99 ? '99+' : totalCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Profile / Login Buttons */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors border border-stone-200 text-left cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center font-bold text-xs uppercase">
                    {user.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <div className="hidden sm:block text-xs">
                    <p className="font-semibold text-stone-900 leading-tight truncate max-w-[110px]">
                      {user.name || user.email}
                    </p>
                    <span className="text-[10px] font-semibold text-[#2E7D32] uppercase tracking-wider">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2.5 border-b border-stone-100">
                      <p className="text-xs font-bold text-stone-900 truncate">{user.name}</p>
                      <p className="text-xs text-stone-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-[#E8F5E9] text-[10px] font-bold text-[#2E7D32] rounded-md uppercase">
                        {user.role}
                      </span>
                    </div>

                    {user.role === 'CUSTOMER' && (
                      <Link
                        to="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50"
                      >
                        <Package className="w-4 h-4 text-stone-400" />
                        <span>My Orders</span>
                      </Link>
                    )}

                    {user.role === 'FARMER' && (
                      <Link
                        to="/farmer"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#2E7D32] hover:bg-emerald-50"
                      >
                        <Tractor className="w-4 h-4 text-[#2E7D32]" />
                        <span>Farmer Dashboard</span>
                      </Link>
                    )}

                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-purple-700 hover:bg-purple-50"
                      >
                        <ShieldCheck className="w-4 h-4 text-purple-500" />
                        <span>Admin Console</span>
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 text-left border-t border-stone-100 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-stone-700 hover:text-[#2E7D32] hover:bg-stone-100 rounded-xl transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#2E7D32] hover:bg-[#1B5E20] rounded-xl transition-all shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search row */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery ?? ''}
              onChange={(e) => {
                if (onSearchChange) {
                  onSearchChange(e.target.value);
                } else if (!isCustomerHome) {
                  navigate(`/?search=${encodeURIComponent(e.target.value)}`);
                }
              }}
              placeholder="Search farm fresh produce..."
              className="w-full bg-[#FAFAF5] text-sm text-stone-900 pl-10 pr-4 py-2 rounded-full border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
            />
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold rounded-lg hover:bg-stone-100 text-stone-800"
            >
              Marketplace
            </Link>

            {user?.role === 'CUSTOMER' && (
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-semibold rounded-lg hover:bg-stone-100 text-stone-800 flex items-center gap-2"
              >
                <Package className="w-4 h-4 text-stone-500" />
                <span>My Orders</span>
              </Link>
            )}

            {user?.role === 'FARMER' && (
              <Link
                to="/farmer"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-semibold rounded-lg bg-[#E8F5E9] text-[#2E7D32] flex items-center gap-2"
              >
                <Tractor className="w-4 h-4 text-[#2E7D32]" />
                <span>Farmer Dashboard</span>
              </Link>
            )}

            {user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-semibold rounded-lg bg-purple-50 text-purple-800 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Admin Dashboard</span>
              </Link>
            )}

            <div className="pt-2 border-t border-stone-100 flex flex-col gap-1">
              <span className="text-[11px] uppercase font-bold text-stone-400 px-3">Portals</span>
              <Link
                to="/farmer/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-1.5 text-xs text-stone-600 hover:text-[#2E7D32]"
              >
                Farmer Login Portal
              </Link>
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-1.5 text-xs text-stone-600 hover:text-purple-700"
              >
                Admin Login Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

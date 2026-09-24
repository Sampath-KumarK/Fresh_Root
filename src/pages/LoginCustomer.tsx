import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ShoppingBag, ArrowRight, AlertCircle, Sprout } from 'lucide-react';

export const LoginCustomer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login(email.trim(), password.trim(), 'CUSTOMER');
      navigate(redirectPath);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'Customer sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF5] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#2E7D32] text-white flex items-center justify-center mx-auto shadow-md shadow-[#2E7D32]/25 mb-4">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold text-[#2E7D32] uppercase tracking-wider">
              Customer Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
              Welcome back
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Sign in to your customer account to enjoy farm-fresh harvests.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm">
            {error && (
              <div className="mb-4 p-3.5 bg-rose-50 text-rose-800 rounded-xl text-xs flex items-center gap-2 border border-rose-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent text-stone-900 bg-[#FAFAF5]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-stone-700">
                    Password
                  </label>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent text-stone-900 bg-[#FAFAF5]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-[#2E7D32]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <>
                    <span>Sign In to Customer Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-stone-100 text-center text-xs text-stone-500 space-y-2">
              <p>
                Don&apos;t have an account yet?{' '}
                <Link to="/register" className="font-bold text-[#2E7D32] hover:underline">
                  Create customer account
                </Link>
              </p>
              <div className="pt-2 flex items-center justify-center gap-3 text-stone-400">
                <Link to="/farmer/login" className="hover:text-[#2E7D32] text-[11px]">
                  Farmer Portal →
                </Link>
                <span>•</span>
                <Link to="/admin/login" className="hover:text-purple-700 text-[11px]">
                  Admin Portal →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

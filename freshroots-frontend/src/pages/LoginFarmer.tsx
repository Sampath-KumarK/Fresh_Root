import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Tractor, ArrowRight, AlertCircle } from 'lucide-react';

export const LoginFarmer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = (location.state as { from?: { pathname: string } })?.from?.pathname || '/farmer';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter your farm registered email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login(email.trim(), password.trim(), 'FARMER');
      navigate(redirectPath);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'Farmer authentication failed.');
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
              <Tractor className="w-7 h-7" />
            </div>
            <div className="inline-block px-3 py-0.5 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold mb-2">
              Farmer Partner Console
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Grower Sign In
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Manage your harvest catalog, monitor orders, and view earnings.
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
                  Registered Farm Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@example.com"
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent text-stone-900 bg-[#FAFAF5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Password
                </label>
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
                    <span>Accessing Farmer Console...</span>
                  </div>
                ) : (
                  <>
                    <span>Enter Farmer Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-stone-100 text-center text-xs text-stone-500 space-y-2">
              <p>
                Want to sell your harvest directly on Freshroots?{' '}
                <Link to="/register" className="font-bold text-[#2E7D32] hover:underline">
                  Register as a grower
                </Link>
              </p>
              <div className="pt-2 flex items-center justify-center gap-3 text-stone-400">
                <Link to="/login" className="hover:text-[#2E7D32] text-[11px]">
                  ← Customer Login
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

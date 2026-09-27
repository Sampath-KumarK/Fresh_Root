import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ShieldCheck, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export const LoginAdmin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter your administrator credentials.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login(email.trim(), password.trim(), 'ADMIN');
      navigate(redirectPath);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'Administrator authorization failed.');
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
            <div className="w-14 h-14 rounded-2xl bg-purple-700 text-white flex items-center justify-center mx-auto shadow-md shadow-purple-700/25 mb-4">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="inline-block px-3 py-0.5 rounded-full bg-purple-100 text-purple-900 text-xs font-bold mb-2">
              Internal Administration
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Platform Admin
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Authorized personnel only. Monitor users, products, and metrics.
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
                  Admin Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@freshroots.com"
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-stone-900 bg-[#FAFAF5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Security Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-stone-900 bg-[#FAFAF5]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-purple-700/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying clearance...</span>
                  </div>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Enter Admin Console</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-stone-100 text-center text-xs text-stone-400 space-y-2">
              <p className="text-[11px]">
                Administrative privileges are managed by operations.
              </p>
              <div className="pt-2 flex items-center justify-center gap-3 text-stone-400">
                <Link to="/login" className="hover:text-[#2E7D32] text-[11px]">
                  ← Customer Login
                </Link>
                <span>•</span>
                <Link to="/farmer/login" className="hover:text-[#2E7D32] text-[11px]">
                  Farmer Portal →
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

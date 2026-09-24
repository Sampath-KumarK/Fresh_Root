import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import {
  Sprout,
  ShoppingBag,
  Tractor,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Lock,
  User
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [role, setRole] = useState<'CUSTOMER' | 'FARMER'>('CUSTOMER');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Name, email, and password are required.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        phone: phone.trim() || undefined,
        location: location.trim() || undefined,
        role: role as UserRole,
      });

      setSuccess(`Account registered successfully as a ${role.toLowerCase()}! Redirecting to sign in...`);
      setTimeout(() => {
        if (role === 'FARMER') {
          navigate('/farmer/login');
        } else {
          navigate('/login');
        }
      }, 1500);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF5] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full space-y-6">
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#2E7D32] text-white flex items-center justify-center mx-auto shadow-md shadow-[#2E7D32]/25 mb-4">
              <Sprout className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Join Freshroots
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Select your role below to start trading directly without brokers.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm">
            {/* Role Toggle */}
            <div className="flex rounded-2xl bg-stone-100 p-1 mb-6 border border-stone-200">
              <button
                type="button"
                onClick={() => setRole('CUSTOMER')}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  role === 'CUSTOMER'
                    ? 'bg-white text-[#2E7D32] shadow-sm'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-[#2E7D32]" />
                <span>Customer (Buyer)</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('FARMER')}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  role === 'FARMER'
                    ? 'bg-white text-[#2E7D32] shadow-sm'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Tractor className="w-4 h-4 text-[#F57C00]" />
                <span>Farmer (Grower)</span>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3.5 bg-rose-50 text-rose-800 rounded-xl text-xs flex items-center gap-2 border border-rose-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3.5 bg-[#E8F5E9] text-[#2E7D32] rounded-xl text-xs flex items-center gap-2 border border-[#C8E6C9]">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2E7D32]" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {role === 'FARMER' ? 'Farm / Grower Name *' : 'Full Name *'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={role === 'FARMER' ? 'Green Valley Farmstead' : 'Full Name'}
                    className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] bg-[#FAFAF5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] bg-[#FAFAF5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] bg-[#FAFAF5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] bg-[#FAFAF5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {role === 'FARMER' ? 'Farm Location' : 'City / Location'}
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder={role === 'FARMER' ? 'Valley County, Farm 4' : 'Downtown District'}
                      className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] bg-[#FAFAF5]"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 bg-[#2E7D32] hover:bg-[#1B5E20] shadow-[#2E7D32]/25"
              >
                {loading ? (
                  <span>Registering...</span>
                ) : (
                  <>
                    <span>Create {role === 'FARMER' ? 'Farmer' : 'Customer'} Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-stone-100 text-center text-xs text-stone-500">
              Already have an account?{' '}
              <Link
                to={role === 'FARMER' ? '/farmer/login' : '/login'}
                className="font-bold text-[#2E7D32] hover:underline"
              >
                Sign in here
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

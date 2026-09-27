import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../config/api';
import { Product } from '../types';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import {
  Tractor,
  MapPin,
  Leaf,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  RefreshCw
} from 'lucide-react';

interface FarmerGroup {
  farmerName: string;
  farmerLocation: string;
  products: Product[];
}

export const OurFarmers: React.FC = () => {
  const [farmers, setFarmers] = useState<FarmerGroup[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFarmers = async () => {
    setLoading(true);
    try {
      const response = await api.get<Product[]>('/products');
      const products = Array.isArray(response.data) ? response.data : [];

      // Group products by farmer
      const grouped: { [key: string]: FarmerGroup } = {};
      products.forEach((p) => {
        const key = p.farmerName || 'Local Farm Producer';
        if (!grouped[key]) {
          grouped[key] = {
            farmerName: key,
            farmerLocation: p.farmerLocation || 'Local Farmstead',
            products: [],
          };
        }
        grouped[key].products.push(p);
      });

      setFarmers(Object.values(grouped));
    } catch (err) {
      console.warn('Failed to load farmer produce list', err);
      setFarmers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF5] flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1 w-full space-y-8">
        {/* Hero Banner: Light Green Gradient matching Stitch Theme */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#388E3C] text-white p-8 sm:p-12 shadow-sm">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-semibold text-emerald-100 border border-white/20">
              <Tractor className="w-3.5 h-3.5 text-emerald-300" />
              <span>Direct Farm Transparency</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Meet our partner growers
            </h1>

            <p className="text-sm sm:text-base text-emerald-50/90 leading-relaxed font-normal">
              Direct connection from farm to kitchen. Every harvest on Freshroots is traceable to its verified grower.
            </p>
          </div>
        </section>

        {/* Producers Directory */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-stone-900">
              Verified Farmers ({farmers.length})
            </h2>
            <button
              type="button"
              onClick={fetchFarmers}
              className="text-xs text-stone-600 hover:text-[#2E7D32] flex items-center gap-1 font-semibold cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3 animate-pulse"
                >
                  <div className="h-10 w-10 bg-stone-100 rounded-xl" />
                  <div className="h-5 bg-stone-100 rounded w-1/2" />
                  <div className="h-4 bg-stone-100 rounded w-1/3" />
                  <div className="h-12 bg-stone-50 rounded-xl" />
                </div>
              ))}
            </div>
          ) : farmers.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-md mx-auto my-8 space-y-3">
              <div className="w-14 h-14 bg-[#E8F5E9] text-[#2E7D32] rounded-2xl flex items-center justify-center mx-auto">
                <Tractor className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-stone-900">No growers listed yet</h3>
              <p className="text-xs text-stone-500">
                Registered farm producers and their seasonal harvests will appear here automatically.
              </p>
              <Link
                to="/farmer/login"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#2E7D32] text-white rounded-xl text-xs font-bold hover:bg-[#1B5E20] transition-colors"
              >
                <span>Grower Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {farmers.map((farmer, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] flex items-center justify-center shrink-0 font-bold">
                        <Tractor className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-stone-900 text-base">
                          {farmer.farmerName}
                        </h3>
                        <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                          <span>{farmer.farmerLocation}</span>
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-100">
                      <span className="text-[11px] uppercase font-bold text-stone-400">
                        Seasonal Produce Listed
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {farmer.products.map((p) => (
                          <span
                            key={p.id}
                            className="px-2.5 py-1 bg-[#FAFAF5] text-stone-700 text-xs font-medium rounded-lg border border-stone-200"
                          >
                            {p.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-stone-100">
                    <Link
                      to={`/?search=${encodeURIComponent(farmer.farmerName)}`}
                      className="w-full py-2.5 px-4 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>View Harvest Catalog ({farmer.products.length})</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

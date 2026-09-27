import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, getApiErrorMessage, API_BASE_URL } from '../config/api';
import { Product, Category } from '../types';
import { useCart } from '../context/CartContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { getCategoryEmoji, formatCurrency, getCategoryPlaceholderImage } from '../utils/helpers';
import {
  Plus,
  Minus,
  MapPin,
  RefreshCw,
  Search,
  AlertCircle,
  Sparkles,
  ShoppingBag,
  Leaf,
  Camera
} from 'lucide-react';

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'all', name: 'All' },
  { id: 1, name: 'Vegetables' },
  { id: 2, name: 'Fruits' },
  { id: 3, name: 'Leafy Greens' },
  { id: 4, name: 'Roots & Tubers' },
];

export const CustomerHome: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamQuery = searchParams.get('search') || '';

  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string | number>('all');
  const [searchQuery, setSearchQuery] = useState(searchParamQuery);
  const [debouncedSearch, setDebouncedSearch] = useState(searchParamQuery);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { items: cartItems, addToCart, updateQuantity } = useCart();

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      if (searchQuery.trim()) {
        setSearchParams({ search: searchQuery });
      } else {
        setSearchParams({});
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery, setSearchParams]);

  // Fetch categories from /categories
  useEffect(() => {
    api
      .get<Category[]>('/categories')
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          // Prepend 'All'
          setCategories([{ id: 'all', name: 'All' }, ...res.data]);
        }
      })
      .catch((err) => {
        console.warn('Could not load categories from backend, using default categories.', err);
      });
  }, []);

  // Fetch products from /products?categoryId=&search=
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') {
        params.append('categoryId', String(selectedCategory));
      }
      if (debouncedSearch.trim()) {
        params.append('search', debouncedSearch.trim());
      }

      const queryString = params.toString();
      const endpoint = queryString ? `/products?${queryString}` : '/products';
      const response = await api.get<Product[]>(endpoint);
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Failed to fetch fresh produce from the market.');
      setError(msg);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, debouncedSearch]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Get item quantity in cart helper
  const getProductQuantity = (productId: number | string) => {
    const item = cartItems.find((i) => String(i.product.id) === String(productId));
    return item ? item.quantity : 0;
  };

  return (
    <div className="min-h-screen bg-[#FAFAF5] flex flex-col font-sans">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full space-y-8">
        {/* HERO BANNER: Rounded green gradient card */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1B5E20] via-[#2E7D32] to-[#388E3C] text-white p-8 sm:p-12 shadow-sm">
          {/* Subtle background decorative shapes */}
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute right-1/4 -bottom-16 w-80 h-80 bg-[#388E3C]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-semibold text-emerald-100 border border-white/20">
              <Leaf className="w-3.5 h-3.5 text-emerald-300" />
              <span>Direct From Certified Local Growers</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight font-sans">
              Fresh from farmers, straight to your home
            </h1>

            <p className="text-sm sm:text-base text-emerald-50/90 leading-relaxed font-normal">
              Eliminate middlemen and support local sustainable agriculture. Enjoy crisp greens, seasonal fruits, and harvest-day vegetables delivered at honest prices.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="#marketplace-grid"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#2E7D32] font-bold text-xs sm:text-sm hover:bg-emerald-50 transition-colors shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shop Today&apos;s Harvest</span>
              </a>
              <span className="text-xs text-emerald-100 font-medium">
                • 100% Farm-Gate Transparency
              </span>
            </div>
          </div>
        </section>

        {/* CATEGORY CHIPS ROW: All, Vegetables, Fruits, Leafy Greens, Roots & Tubers */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Browse by Category
            </h2>
            {selectedCategory !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className="text-xs font-semibold text-[#2E7D32] hover:underline cursor-pointer"
              >
                Reset filter
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-[#2E7D32] text-white shadow-sm shadow-[#2E7D32]/25 font-bold'
                      : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* PRODUCT GRID SECTION */}
        <section id="marketplace-grid" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 tracking-tight">
                Available Produce
              </h2>
              <span className="text-xs text-stone-400 font-medium">
                ({products.length} {products.length === 1 ? 'item' : 'items'})
              </span>
            </div>

            <button
              type="button"
              onClick={fetchProducts}
              className="text-xs text-stone-600 hover:text-[#2E7D32] flex items-center gap-1 font-semibold cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Catalog</span>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Notice from marketplace service:</p>
                  <p className="mt-0.5">{error}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={fetchProducts}
                className="px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 shrink-0 cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-8">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden p-4 space-y-3 animate-pulse"
                >
                  <div className="h-44 bg-stone-100 rounded-xl" />
                  <div className="h-4 bg-stone-100 rounded w-1/3" />
                  <div className="h-5 bg-stone-100 rounded w-2/3" />
                  <div className="h-4 bg-stone-100 rounded w-1/2" />
                  <div className="h-9 bg-stone-100 rounded-xl mt-4" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-3 max-w-md mx-auto my-8">
              <div className="w-14 h-14 bg-[#E8F5E9] text-[#2E7D32] rounded-2xl flex items-center justify-center mx-auto">
                <Leaf className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-stone-900">No produce found</h3>
              <p className="text-xs text-stone-500">
                {searchQuery
                  ? `No harvest matching "${searchQuery}". Try clearing search or choosing another category.`
                  : 'No active harvests listed under this category right now. Check back soon!'}
              </p>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-[#2E7D32] text-white text-xs font-bold rounded-xl hover:bg-[#1B5E20] transition-colors cursor-pointer"
                >
                  Clear Search Filter
                </button>
              )}
            </div>
          ) : (
            /* 4 COLUMNS DESKTOP PRODUCT GRID */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => {
                const currentQty = getProductQuantity(product.id);
                const emoji = getCategoryEmoji(product.categoryName, product.categoryId);

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between group"
                  >
                    {/* Top: Image / Photo */}
                    <div>
                      <div className="relative h-48 w-full bg-stone-100 overflow-hidden flex items-center justify-center">
                        <img
                          src={`${API_BASE_URL}/products/${product.id}/image`}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = getCategoryPlaceholderImage(product.categoryName, product.categoryId);
                          }}
                        />

                        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-stone-950/55 to-transparent px-3 pb-3 pt-10">
                          <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold text-stone-700 shadow-sm">
                            <Camera className="h-3 w-3 text-[#2E7D32]" />
                            Farm photo
                          </span>
                        </div>

                        {/* Stock status pill if low */}
                        {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
                          <span className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                            Only {product.stock} left
                          </span>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="p-4 space-y-2">
                        {/* Small category tag */}
                        <div className="flex items-center justify-between">
                          <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#E8F5E9] text-[#2E7D32]">
                            {product.categoryName || 'Fresh Harvest'}
                          </span>
                          <span className="text-xs font-semibold text-stone-400">
                            {product.stock !== undefined ? `${product.stock} ${product.unit || 'kg'} in stock` : ''}
                          </span>
                        </div>

                        {/* Produce Name */}
                        <h3 className="font-bold text-stone-900 text-base leading-snug line-clamp-1">
                          {product.name}
                        </h3>

                        {/* Farmer Name and Location */}
                        <div className="text-xs text-stone-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span className="truncate">
                            {product.farmerName || 'Direct Local Farmer'}
                            {product.farmerLocation ? ` · ${product.farmerLocation}` : ''}
                          </span>
                        </div>

                        <p className="text-xs leading-relaxed text-stone-500 line-clamp-2 min-h-8">
                          {product.description || 'Freshly harvested from a local Tamil Nadu farm.'}
                        </p>

                        {/* Price per kg */}
                        <div className="pt-1">
                          <p className="text-lg font-black text-stone-900">
                            {formatCurrency(product.price)}{' '}
                            <span className="text-xs font-normal text-stone-500">
                              / {product.unit || 'kg'}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action: ORANGE (#F57C00) "Add" Button or Quantity Selector */}
                    <div className="p-4 pt-0">
                      {currentQty === 0 ? (
                        <button
                          type="button"
                          onClick={() => addToCart(product, 1)}
                          className="w-full bg-[#F57C00] hover:bg-[#E65100] active:scale-[0.98] text-white font-bold text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add</span>
                        </button>
                      ) : (
                        <div className="flex items-center justify-between w-full bg-[#FFF3E0] border border-[#F57C00]/30 rounded-xl p-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, currentQty - 1)}
                            className="w-8 h-8 rounded-lg bg-[#F57C00] hover:bg-[#E65100] active:scale-95 text-white flex items-center justify-center font-bold text-sm transition-all cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <div className="flex items-center gap-1 text-stone-900 font-bold text-xs sm:text-sm">
                            <span>{currentQty}</span>
                            <span className="text-[10px] text-stone-500 font-normal">
                              {product.unit || 'kg'}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, currentQty + 1)}
                            className="w-8 h-8 rounded-lg bg-[#F57C00] hover:bg-[#E65100] active:scale-95 text-white flex items-center justify-center font-bold text-sm transition-all cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export function getCategoryEmoji(categoryName?: string, categoryId?: number | string): string {
  if (!categoryName && !categoryId) return '🌱';
  const name = (categoryName || '').toLowerCase();
  const id = String(categoryId || '');

  if (name.includes('veg') || id === '1') return '🥬';
  if (name.includes('fruit') || id === '2') return '🥭';
  if (name.includes('leaf') || name.includes('salad') || name.includes('spinach') || id === '3') return '🥗';
  if (name.includes('root') || name.includes('tuber') || name.includes('potato') || id === '4') return '🥔';
  if (name.includes('herb') || name.includes('micro') || id === '5') return '🌿';
  return '🌱';
}

export function getCategoryPlaceholderImage(categoryName?: string, categoryId?: number | string): string {
  const name = (categoryName || '').toLowerCase();
  const id = String(categoryId || '');

  if (name.includes('veg') || id === '1') return 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=500&q=80';
  if (name.includes('fruit') || id === '2') return 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=500&q=80';
  if (name.includes('leaf') || name.includes('salad') || name.includes('spinach') || id === '3') return 'https://images.unsplash.com/photo-1573246123716-6b1782bfc499?auto=format&fit=crop&w=500&q=80';
  if (name.includes('root') || name.includes('tuber') || name.includes('potato') || id === '4') return 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=500&q=80';
  if (name.includes('herb') || name.includes('micro') || id === '5') return 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=80';
  
  return 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=500&q=80';
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function getStatusBadgeClass(status: string): { bg: string; text: string; border: string } {
  switch (status.toUpperCase()) {
    case 'PLACED':
      return { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' };
    case 'CONFIRMED':
      return { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' };
    case 'DELIVERED':
      return { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' };
    case 'CANCELLED':
      return { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' };
    default:
      return { bg: 'bg-stone-50', text: 'text-stone-700', border: 'border-stone-200' };
  }
}

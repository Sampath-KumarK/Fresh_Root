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

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
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

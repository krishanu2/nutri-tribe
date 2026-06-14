export type StockStatus = 'in' | 'low' | 'out';

export interface Product {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  mainCategory: string;
  color: string;
  price: number;
  weights: string[];
  description: string;
  features: string[];
  badge?: string | null;
  image: string;
  images: string[];
  stockQuantity: number;
  lowStockThreshold: number;
}

export function getStockStatus(qty: number, threshold: number): StockStatus {
  if (qty <= 0) return 'out';
  if (qty <= threshold) return 'low';
  return 'in';
}

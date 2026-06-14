import { db } from '@/lib/db';
import ProductsPageClient from './ProductsPageClient';

export const revalidate = 60;

export default async function ProductsPage() {
  const products = await db.product.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { sortOrder: 'asc' },
  }).catch(() => []);

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  return <ProductsPageClient products={products} categories={categories} />;
}

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '../../_components/ProductForm';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  if (Number.isNaN(id)) return notFound();

  const product = await db.product.findUnique({ where: { id } });
  if (!product) return notFound();

  return (
    <div className="p-8">
      <Link href="/admin/products"
        className="inline-flex items-center gap-2 font-body text-sm text-[#7d3627]/50 hover:text-[#f3a213] transition-colors mb-6">
        <ArrowLeft size={14} />
        Back to Products
      </Link>

      <h1 className="font-display font-bold text-3xl text-[#7d3627] mb-6">Edit Product</h1>

      <ProductForm product={product} />
    </div>
  );
}

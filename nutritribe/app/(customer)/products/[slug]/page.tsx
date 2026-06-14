import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import ProductDetailClient from './ProductDetailClient';

export const revalidate = 60;

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await db.product.findUnique({ where: { slug: params.slug } }).catch(() => null);
  if (!product) {
    return { title: 'Product Not Found | NutriTribe' };
  }

  const title = `${product.name} | Buy ${product.mainCategory === 'Makhana (Fox Nuts)' ? 'Premium Roasted Makhana' : 'Premium Cookies'} Online — NutriTribe`;

  return {
    title,
    description: `${product.description} ${product.features.join(', ')}.`,
    openGraph: {
      title,
      description: product.description,
      images: [{ url: product.image }],
      type: 'website',
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await db.product.findUnique({ where: { slug: params.slug } }).catch(() => null);
  if (!product || product.status !== 'PUBLISHED') return notFound();

  const relatedProducts = await db.product.findMany({
    where: { category: product.category, slug: { not: product.slug }, status: 'PUBLISHED' },
    orderBy: { sortOrder: 'asc' },
    take: 4,
  }).catch(() => []);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: 'NutriTribe',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}

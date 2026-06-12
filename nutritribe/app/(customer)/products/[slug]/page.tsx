import { Metadata } from 'next';
import { getProductBySlug } from '@/lib/products';
import ProductDetailClient from './ProductDetailClient';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = getProductBySlug(params.slug);
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

export default function ProductDetailPage({ params }: PageProps) {
  const product = getProductBySlug(params.slug);

  const jsonLd = product
    ? {
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
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetailClient params={params} />
    </>
  );
}

import type { MetadataRoute } from 'next';
import { db } from '@/lib/db';

const BASE_URL = 'https://www.nutritribe.shop';

const STATIC_ROUTES = [
  '',
  '/products',
  '/our-story',
  '/contact',
  '/b2b',
  '/corporate-gifting',
  '/blog',
  '/recipes',
  '/privacy-policy',
  '/terms-and-conditions',
  '/refund-policy',
  '/shipping-policy',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }));

  try {
    const [products, posts, recipes] = await Promise.all([
      db.product.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } }),
      db.blogPost.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } }),
      db.recipe.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } }),
    ]);

    const dynamicEntries: MetadataRoute.Sitemap = [
      ...products.map((p) => ({ url: `${BASE_URL}/products/${p.slug}`, lastModified: p.updatedAt })),
      ...posts.map((p) => ({ url: `${BASE_URL}/blog/${p.slug}`, lastModified: p.updatedAt })),
      ...recipes.map((r) => ({ url: `${BASE_URL}/recipes/${r.slug}`, lastModified: r.updatedAt })),
    ];

    return [...staticEntries, ...dynamicEntries];
  } catch {
    return staticEntries;
  }
}

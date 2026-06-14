import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/products';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? '';

  if (q.length < 2) {
    return NextResponse.json({ products: [], posts: [], recipes: [] });
  }

  const needle = q.toLowerCase();

  const matchedProducts = products
    .filter((p) =>
      p.name.toLowerCase().includes(needle) ||
      p.tagline.toLowerCase().includes(needle) ||
      p.category.toLowerCase().includes(needle) ||
      p.description.toLowerCase().includes(needle)
    )
    .slice(0, 6)
    .map((p) => ({ slug: p.slug, title: p.name, subtitle: p.tagline, color: p.color }));

  const [posts, recipes] = await Promise.all([
    db.blogPost.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { excerpt: { contains: q, mode: 'insensitive' } },
        ],
      },
      select: { slug: true, title: true, excerpt: true },
      take: 5,
    }).catch(() => []),
    db.recipe.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      },
      select: { slug: true, title: true, description: true },
      take: 5,
    }).catch(() => []),
  ]);

  return NextResponse.json({
    products: matchedProducts,
    posts: posts.map((p) => ({ slug: p.slug, title: p.title, subtitle: p.excerpt })),
    recipes: recipes.map((r) => ({ slug: r.slug, title: r.title, subtitle: r.description })),
  });
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? '';

  if (q.length < 2) {
    return NextResponse.json({ products: [], posts: [], recipes: [] });
  }

  const [matchedProductRows, posts, recipes] = await Promise.all([
    db.product.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { tagline: { contains: q, mode: 'insensitive' } },
          { category: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      },
      take: 6,
    }).catch(() => []),
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
    products: matchedProductRows.map((p) => ({ slug: p.slug, title: p.name, subtitle: p.tagline, color: p.color })),
    posts: posts.map((p) => ({ slug: p.slug, title: p.title, subtitle: p.excerpt })),
    recipes: recipes.map((r) => ({ slug: r.slug, title: r.title, subtitle: r.description })),
  });
}

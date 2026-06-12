import { db } from '@/lib/db';
import { PostStatus } from '@prisma/client';
import Link from 'next/link';
import PostStatusBadge from '../_components/PostStatusBadge';
import { ChefHat, Plus } from 'lucide-react';

const STATUS_TABS: { label: string; value: string }[] = [
  { label: 'All',       value: '' },
  { label: 'Draft',     value: 'DRAFT' },
  { label: 'Published', value: 'PUBLISHED' },
];

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: { status?: string; page?: string };
}

export default async function AdminRecipesPage({ searchParams }: PageProps) {
  const statusFilter = (searchParams.status ?? '') as PostStatus | '';
  const page  = Math.max(1, parseInt(searchParams.page ?? '1'));
  const limit = 20;

  const where = {
    ...(statusFilter ? { status: statusFilter } : {}),
  };

  const [recipes, total] = await db.$transaction([
    db.recipe.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.recipe.count({ where }),
  ]);

  const pages = Math.ceil(total / limit);

  const buildHref = (overrides: { status?: string; page?: number }) => {
    const params = new URLSearchParams();
    const s = overrides.status !== undefined ? overrides.status : statusFilter;
    const p = overrides.page ?? page;
    if (s) params.set('status', s);
    if (p > 1) params.set('page', String(p));
    const qs = params.toString();
    return `/admin/recipes${qs ? `?${qs}` : ''}`;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-bold text-3xl text-[#7d3627]">Recipes</h1>
          <p className="font-body text-sm text-[#7d3627]/50 mt-1">{total} recipe{total !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/admin/recipes/new"
          className="inline-flex items-center gap-2 font-body font-semibold text-sm px-4 py-2.5 rounded-xl bg-[#f3a213] text-[#050100] hover:brightness-110 transition-all"
        >
          <Plus size={15} />
          New Recipe
        </Link>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_TABS.map(tab => {
          const active = statusFilter === tab.value;
          return (
            <Link
              key={tab.value}
              href={buildHref({ status: tab.value, page: 1 })}
              className={`font-body font-semibold text-xs px-4 py-2 rounded-full transition-all ${
                active
                  ? 'bg-[#7d3627] text-white'
                  : 'bg-white text-[#7d3627]/60 border border-[#7d3627]/12 hover:border-[#7d3627]/30'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#7d3627]/8 overflow-hidden">
        {recipes.length === 0 ? (
          <div className="py-20 text-center">
            <ChefHat size={44} className="text-[#7d3627]/15 mx-auto mb-3" />
            <p className="font-body text-sm text-[#7d3627]/40">No recipes found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#7d3627]/6 bg-[#7d3627]/2">
                  {['Title', 'Slug', 'Prep Time', 'Servings', 'Status', 'Date', 'Action'].map(h => (
                    <th key={h} className="px-5 py-3 text-left font-body text-[11px] font-semibold tracking-widest uppercase text-[#7d3627]/40">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recipes.map((r, i) => (
                  <tr key={r.id}
                    className={`border-b border-[#7d3627]/5 hover:bg-[#f3a213]/4 transition-colors ${
                      i === recipes.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="px-5 py-3.5 font-body font-bold text-xs text-[#7d3627] whitespace-nowrap max-w-xs truncate">
                      {r.title}
                    </td>
                    <td className="px-5 py-3.5 font-body text-xs text-[#7d3627]/55 whitespace-nowrap">
                      /{r.slug}
                    </td>
                    <td className="px-5 py-3.5 font-body text-xs text-[#7d3627]/55 whitespace-nowrap">
                      {r.prepTime}
                    </td>
                    <td className="px-5 py-3.5 font-body text-xs text-[#7d3627]/55 whitespace-nowrap">
                      {r.servings}
                    </td>
                    <td className="px-5 py-3.5">
                      <PostStatusBadge status={r.status} />
                    </td>
                    <td className="px-5 py-3.5 font-body text-xs text-[#7d3627]/45 whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/recipes/${r.id}`}
                        className="inline-flex items-center gap-1 font-body text-xs font-semibold text-[#f3a213] hover:underline whitespace-nowrap">
                        Edit →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="font-body text-xs text-[#7d3627]/45">
            Page {page} of {pages} · {total} recipes
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={buildHref({ page: page - 1 })}
                className="font-body text-xs font-semibold px-4 py-2 rounded-lg bg-white border border-[#7d3627]/12 text-[#7d3627]/70 hover:border-[#f3a213]/40 transition-all"
              >
                ← Prev
              </Link>
            )}
            {page < pages && (
              <Link
                href={buildHref({ page: page + 1 })}
                className="font-body text-xs font-semibold px-4 py-2 rounded-lg bg-[#f3a213] text-[#050100] hover:brightness-110 transition-all"
              >
                Next →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

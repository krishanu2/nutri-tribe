'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Search, X, ArrowRight, Loader2 } from 'lucide-react';
import { useSearch } from '@/lib/searchContext';

interface ResultItem {
  slug: string;
  title: string;
  subtitle: string;
  color?: string;
}

interface Results {
  products: ResultItem[];
  posts: ResultItem[];
  recipes: ResultItem[];
}

export default function SearchOverlay() {
  const { isOpen, closeSearch } = useSearch();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults(null);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
        .then((r) => r.json())
        .then((data) => setResults(data))
        .catch(() => setResults({ products: [], posts: [], recipes: [] }))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const hasResults = results && (results.products.length || results.posts.length || results.recipes.length);
  const showEmpty = results && !hasResults && query.trim().length >= 2 && !loading;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[990]"
            style={{ background: 'rgba(5,1,0,0.7)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeSearch}
          />

          <motion.div
            className="fixed top-0 left-0 right-0 z-[995] max-h-[85vh] overflow-y-auto"
            style={{ background: '#fdfbf7', borderBottom: '1px solid rgba(122,58,39,0.1)' }}
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            <div className="max-w-3xl mx-auto px-6 pt-10 pb-12">
              {/* Input */}
              <div className="flex items-center gap-3 border-b-2 border-earthen-rust/15 pb-4">
                <Search size={22} className="text-earthen-rust/40 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, recipes, journal..."
                  className="flex-1 bg-transparent font-display text-2xl md:text-3xl text-earthen-rust placeholder:text-earthen-rust/30 focus:outline-none"
                />
                {loading && <Loader2 size={20} className="animate-spin text-sun-harvest shrink-0" />}
                <button onClick={closeSearch} className="shrink-0 p-2 rounded-full hover:bg-earthen-rust/5 transition-colors">
                  <X size={20} className="text-earthen-rust/50" />
                </button>
              </div>

              {/* Results */}
              <div className="mt-6 space-y-8">
                {!results && query.trim().length < 2 && (
                  <p className="font-body text-sm text-earthen-rust/40 text-center py-8">
                    Start typing to search the full NutriTribe collection.
                  </p>
                )}

                {showEmpty && (
                  <p className="font-body text-sm text-earthen-rust/40 text-center py-8">
                    No results for &ldquo;{query}&rdquo;. Try a different term.
                  </p>
                )}

                {results && results.products.length > 0 && (
                  <ResultGroup title="Products">
                    {results.products.map((item) => (
                      <ResultLink key={item.slug} href={`/products/${item.slug}`} item={item} onClick={closeSearch} />
                    ))}
                  </ResultGroup>
                )}

                {results && results.recipes.length > 0 && (
                  <ResultGroup title="Recipes">
                    {results.recipes.map((item) => (
                      <ResultLink key={item.slug} href={`/recipes/${item.slug}`} item={item} onClick={closeSearch} />
                    ))}
                  </ResultGroup>
                )}

                {results && results.posts.length > 0 && (
                  <ResultGroup title="Journal">
                    {results.posts.map((item) => (
                      <ResultLink key={item.slug} href={`/blog/${item.slug}`} item={item} onClick={closeSearch} />
                    ))}
                  </ResultGroup>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ResultGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-body font-bold text-[10px] tracking-[0.3em] uppercase text-sun-harvest mb-3">{title}</p>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

function ResultLink({ href, item, onClick }: { href: string; item: ResultItem; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="group flex items-center justify-between gap-4 p-3 rounded-xl hover:bg-earthen-rust/5 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        {item.color && (
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
        )}
        <div className="min-w-0">
          <p className="font-display font-bold text-base text-earthen-rust truncate">{item.title}</p>
          <p className="font-body text-xs text-earthen-rust/50 truncate">{item.subtitle}</p>
        </div>
      </div>
      <ArrowRight size={16} className="text-earthen-rust/30 group-hover:text-sun-harvest group-hover:translate-x-1 transition-all shrink-0" />
    </Link>
  );
}

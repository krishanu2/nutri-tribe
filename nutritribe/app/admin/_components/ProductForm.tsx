'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2, Save, Plus } from 'lucide-react';
import type { Product } from '@prisma/client';
import ImageUploadField from './ImageUploadField';
import TagListField from './TagListField';
import CategorySelect from './CategorySelect';
import StockBadge from '@/components/ui/StockBadge';
import { getStockStatus } from '@/lib/products';

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

interface Props {
  product?: Product;
}

export default function ProductForm({ product }: Props) {
  const router = useRouter();
  const isEdit = !!product;

  const [name, setName] = useState(product?.name ?? '');
  const [slug, setSlug] = useState(product?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [tagline, setTagline] = useState(product?.tagline ?? '');
  const [category, setCategory] = useState(product?.category ?? '');
  const [mainCategory, setMainCategory] = useState(product?.mainCategory ?? '');
  const [color, setColor] = useState(product?.color ?? '#7a4dff');
  const [price, setPrice] = useState(product?.price ?? 0);
  const [weights, setWeights] = useState<string[]>(product?.weights ?? []);
  const [description, setDescription] = useState(product?.description ?? '');
  const [features, setFeatures] = useState<string[]>(product?.features ?? []);
  const [badge, setBadge] = useState(product?.badge ?? '');
  const [image, setImage] = useState(product?.image ?? '');
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [stockQuantity, setStockQuantity] = useState(product?.stockQuantity ?? 0);
  const [lowStockThreshold, setLowStockThreshold] = useState(product?.lowStockThreshold ?? 10);
  const [sortOrder, setSortOrder] = useState(product?.sortOrder ?? 0);
  const [status, setStatus] = useState(product?.status ?? 'PUBLISHED');

  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [mainCategoryOptions, setMainCategoryOptions] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/products/meta')
      .then(r => r.json())
      .then(data => {
        setCategoryOptions(data.categories ?? []);
        setMainCategoryOptions(data.mainCategories ?? []);
      })
      .catch(() => {});
  }, []);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const body = {
      name, slug, tagline, category, mainCategory, color,
      price: Number(price), weights, description, features,
      badge: badge.trim() || null,
      image, images,
      stockQuantity: Number(stockQuantity),
      lowStockThreshold: Number(lowStockThreshold),
      sortOrder: Number(sortOrder),
      status,
    };

    try {
      const res = await fetch(isEdit ? `/api/admin/products/${product!.id}` : '/api/admin/products', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save product');
      }
      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    if (!confirm(`Delete "${product.name}" permanently? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      router.push('/admin/products');
      router.refresh();
    } catch {
      setError('Failed to delete product');
      setDeleting(false);
    }
  };

  const stockPreview = getStockStatus(Number(stockQuantity) || 0, Number(lowStockThreshold) || 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
      {/* Basic info */}
      <div className="bg-white rounded-2xl border border-[#7d3627]/8 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#7d3627]/8">
          <h2 className="font-display font-bold text-lg text-[#7d3627]">Product Details</h2>
        </div>
        <div className="px-6 py-5 space-y-4">
          <Field label="Product Name" required hint="Shown as the main title on the product page and cards">
            <input
              type="text"
              required
              value={name}
              onChange={e => handleNameChange(e.target.value)}
              className="w-full font-body text-sm text-[#7d3627] bg-[#fdfbf7] border-2 border-[#7d3627]/15 rounded-xl px-4 py-2.5 outline-none focus:border-[#f3a213] transition-all"
            />
          </Field>

          <Field label="Slug" required hint="Used in the URL: /products/your-slug">
            <input
              type="text"
              required
              value={slug}
              onChange={e => { setSlug(slugify(e.target.value)); setSlugTouched(true); }}
              className="w-full font-body text-sm text-[#7d3627] bg-[#fdfbf7] border-2 border-[#7d3627]/15 rounded-xl px-4 py-2.5 outline-none focus:border-[#f3a213] transition-all"
            />
          </Field>

          <Field label="Tagline" required hint="A short catchy phrase shown under the product name, e.g. 'Pure. Natural. Timeless.'">
            <input
              type="text"
              required
              value={tagline}
              onChange={e => setTagline(e.target.value)}
              className="w-full font-body text-sm text-[#7d3627] bg-[#fdfbf7] border-2 border-[#7d3627]/15 rounded-xl px-4 py-2.5 outline-none focus:border-[#f3a213] transition-all"
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CategorySelect
              label="Category"
              value={category}
              onChange={setCategory}
              options={categoryOptions}
              hint="Used for filtering on the shop page, e.g. 'Roasted Flavours'"
            />
            <CategorySelect
              label="Main Category"
              value={mainCategory}
              onChange={setMainCategory}
              options={mainCategoryOptions}
              hint="Broad grouping, e.g. 'Makhana (Fox Nuts)'"
            />
          </div>

          <Field label="Brand Colour" required hint="Used as the accent colour for this product's cards and pages">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={e => setColor(e.target.value)}
                className="w-12 h-11 rounded-xl border-2 border-[#7d3627]/15 cursor-pointer bg-[#fdfbf7]"
              />
              <input
                type="text"
                required
                value={color}
                onChange={e => setColor(e.target.value)}
                className="flex-1 font-body text-sm text-[#7d3627] bg-[#fdfbf7] border-2 border-[#7d3627]/15 rounded-xl px-4 py-2.5 outline-none focus:border-[#f3a213] transition-all"
              />
            </div>
          </Field>

          <Field label="Price (₹)" required hint="Shown to customers as the selling price">
            <input
              type="number"
              required
              min={0}
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
              className="w-full font-body text-sm text-[#7d3627] bg-[#fdfbf7] border-2 border-[#7d3627]/15 rounded-xl px-4 py-2.5 outline-none focus:border-[#f3a213] transition-all"
            />
          </Field>

          <TagListField
            label="Available Pack Sizes"
            values={weights}
            onChange={setWeights}
            placeholder="e.g. 50g — press Enter"
            hint="The pack sizes customers can choose from, e.g. 50g, 90g"
          />

          <Field label="Description" required hint="The main product description shown on the product page">
            <textarea
              required
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full font-body text-sm text-[#7d3627] bg-[#fdfbf7] border-2 border-[#7d3627]/15 rounded-xl px-4 py-2.5 outline-none focus:border-[#f3a213] transition-all resize-y"
            />
          </Field>

          <TagListField
            label="Features"
            values={features}
            onChange={setFeatures}
            placeholder="e.g. Gluten Free — press Enter"
            hint="Short highlights shown as tags on the product page"
          />

          <Field label="Badge (optional)" hint="A small label shown on the product card, e.g. 'BESTSELLER', 'NEW'. Leave blank for none.">
            <input
              type="text"
              value={badge}
              onChange={e => setBadge(e.target.value)}
              className="w-full font-body text-sm text-[#7d3627] bg-[#fdfbf7] border-2 border-[#7d3627]/15 rounded-xl px-4 py-2.5 outline-none focus:border-[#f3a213] transition-all"
            />
          </Field>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-2xl border border-[#7d3627]/8 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#7d3627]/8">
          <h2 className="font-display font-bold text-lg text-[#7d3627]">Photos</h2>
        </div>
        <div className="px-6 py-5 space-y-5">
          <ImageUploadField
            label="Main Photo"
            value={image}
            onChange={setImage}
            hint="The primary image shown on product cards and as the first photo on the product page"
          />

          <div>
            <label className="block font-body text-xs font-semibold tracking-widest uppercase text-[#7d3627]/50 mb-2">
              Additional Photos
            </label>
            <div className="flex flex-wrap gap-4">
              {images.map((img, i) => (
                <div key={i} className="relative">
                  <ImageUploadField
                    value={img}
                    onChange={(url) => {
                      if (!url) {
                        setImages(images.filter((_, idx) => idx !== i));
                      } else {
                        setImages(images.map((im, idx) => idx === i ? url : im));
                      }
                    }}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => setImages([...images, ''])}
                className="w-full max-w-[180px] aspect-square rounded-xl border-2 border-dashed border-[#7d3627]/20 bg-[#fdfbf7] flex flex-col items-center justify-center gap-2 font-body text-xs text-[#7d3627]/40 hover:text-[#7d3627]/60 transition-colors"
              >
                <Plus size={22} />
                Add photo
              </button>
            </div>
            <p className="font-body text-[11px] text-[#7d3627]/35 mt-1.5">
              Extra photos shown in the gallery on the product page
            </p>
          </div>
        </div>
      </div>

      {/* Inventory */}
      <div className="bg-white rounded-2xl border border-[#7d3627]/8 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#7d3627]/8">
          <h2 className="font-display font-bold text-lg text-[#7d3627]">Stock & Availability</h2>
        </div>
        <div className="px-6 py-5 space-y-4">
          <Field label="How many do you have in stock?" required hint="The total number of units currently available to sell">
            <input
              type="number"
              required
              min={0}
              value={stockQuantity}
              onChange={e => setStockQuantity(Number(e.target.value))}
              className="w-full font-body text-sm text-[#7d3627] bg-[#fdfbf7] border-2 border-[#7d3627]/15 rounded-xl px-4 py-2.5 outline-none focus:border-[#f3a213] transition-all"
            />
          </Field>

          <Field label="Warn me when stock drops below" required hint="When stock falls to or below this number, the product is marked 'Only Few Left' to shoppers">
            <input
              type="number"
              required
              min={0}
              value={lowStockThreshold}
              onChange={e => setLowStockThreshold(Number(e.target.value))}
              className="w-full font-body text-sm text-[#7d3627] bg-[#fdfbf7] border-2 border-[#7d3627]/15 rounded-xl px-4 py-2.5 outline-none focus:border-[#f3a213] transition-all"
            />
          </Field>

          <div>
            <p className="font-body text-xs font-semibold tracking-widest uppercase text-[#7d3627]/50 mb-2">
              Shoppers will see
            </p>
            <StockBadge stock={stockPreview} />
          </div>
        </div>
      </div>

      {/* Visibility */}
      <div className="bg-white rounded-2xl border border-[#7d3627]/8 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#7d3627]/8">
          <h2 className="font-display font-bold text-lg text-[#7d3627]">Visibility</h2>
        </div>
        <div className="px-6 py-5 space-y-4">
          <Field label="Status" hint="Draft = hidden from the shop. Published = visible to customers.">
            <div className="flex gap-2">
              {(['DRAFT', 'PUBLISHED'] as const).map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setStatus(opt)}
                  className={`font-body font-semibold text-xs px-4 py-2 rounded-full transition-all ${
                    status === opt
                      ? 'bg-[#f3a213] text-[#050100]'
                      : 'bg-[#7d3627]/6 text-[#7d3627]/60 hover:bg-[#7d3627]/12'
                  }`}
                >
                  {opt === 'DRAFT' ? 'Draft (hidden)' : 'Published (visible)'}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Display Order" hint="Products with a lower number show first in the shop. Use 0 if you don't mind the order.">
            <input
              type="number"
              value={sortOrder}
              onChange={e => setSortOrder(Number(e.target.value))}
              className="w-full font-body text-sm text-[#7d3627] bg-[#fdfbf7] border-2 border-[#7d3627]/15 rounded-xl px-4 py-2.5 outline-none focus:border-[#f3a213] transition-all"
            />
          </Field>
        </div>
      </div>

      {error && (
        <p className="font-body text-xs text-red-500 bg-red-50 px-4 py-3 rounded-xl">{error}</p>
      )}

      <div className="flex items-center justify-between gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 font-body font-semibold text-sm px-5 py-3 rounded-xl bg-[#f3a213] text-[#050100] hover:brightness-110 transition-all disabled:opacity-60"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {isEdit ? 'Save Changes' : 'Create Product'}
        </button>

        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 font-body font-semibold text-sm px-5 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all disabled:opacity-60"
          >
            {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
            Delete Product
          </button>
        )}
      </div>
    </form>
  );
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-body text-xs font-semibold tracking-widest uppercase text-[#7d3627]/50 mb-2">
        {label} {required && <span className="text-[#f3a213]">*</span>}
      </label>
      {children}
      {hint && <p className="font-body text-[11px] text-[#7d3627]/35 mt-1.5">{hint}</p>}
    </div>
  );
}

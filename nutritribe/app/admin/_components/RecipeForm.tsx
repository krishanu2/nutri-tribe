'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2, Save } from 'lucide-react';
import type { Recipe } from '@prisma/client';
import ImageUploadField from './ImageUploadField';

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

interface Props {
  recipe?: Recipe;
}

export default function RecipeForm({ recipe }: Props) {
  const router = useRouter();
  const isEdit = !!recipe;

  const [title, setTitle] = useState(recipe?.title ?? '');
  const [slug, setSlug] = useState(recipe?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [description, setDescription] = useState(recipe?.description ?? '');
  const [coverImage, setCoverImage] = useState(recipe?.coverImage ?? '');
  const [prepTime, setPrepTime] = useState(recipe?.prepTime ?? '');
  const [servings, setServings] = useState(recipe?.servings ?? '');
  const [ingredients, setIngredients] = useState((recipe?.ingredients ?? []).join('\n'));
  const [steps, setSteps] = useState((recipe?.steps ?? []).join('\n'));
  const [relatedSlugs, setRelatedSlugs] = useState((recipe?.relatedSlugs ?? []).join(', '));
  const [status, setStatus] = useState(recipe?.status ?? 'DRAFT');

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const body = {
      title,
      slug,
      description,
      coverImage,
      prepTime,
      servings,
      ingredients: ingredients.split('\n').map(s => s.trim()).filter(Boolean),
      steps: steps.split('\n').map(s => s.trim()).filter(Boolean),
      relatedSlugs: relatedSlugs.split(',').map(s => s.trim()).filter(Boolean),
      status,
    };

    try {
      const res = await fetch(isEdit ? `/api/admin/recipes/${recipe!.id}` : '/api/admin/recipes', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save recipe');
      }
      router.push('/admin/recipes');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save recipe');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!recipe) return;
    if (!confirm('Delete this recipe permanently? This cannot be undone.')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/recipes/${recipe.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      router.push('/admin/recipes');
      router.refresh();
    } catch {
      setError('Failed to delete recipe');
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
      <div className="bg-white rounded-2xl border border-[#7d3627]/8 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#7d3627]/8">
          <h2 className="font-display font-bold text-lg text-[#7d3627]">Recipe Details</h2>
        </div>
        <div className="px-6 py-5 space-y-4">
          <Field label="Title" required>
            <input
              type="text"
              required
              value={title}
              onChange={e => handleTitleChange(e.target.value)}
              className="w-full font-body text-sm text-[#7d3627] bg-[#fdfbf7] border-2 border-[#7d3627]/15 rounded-xl px-4 py-2.5 outline-none focus:border-[#f3a213] transition-all"
            />
          </Field>

          <Field label="Slug" required hint="Used in the URL: /recipes/your-slug">
            <input
              type="text"
              required
              value={slug}
              onChange={e => { setSlug(slugify(e.target.value)); setSlugTouched(true); }}
              className="w-full font-body text-sm text-[#7d3627] bg-[#fdfbf7] border-2 border-[#7d3627]/15 rounded-xl px-4 py-2.5 outline-none focus:border-[#f3a213] transition-all"
            />
          </Field>

          <Field label="Description" required hint="Short summary shown on the recipe listing page">
            <textarea
              required
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full font-body text-sm text-[#7d3627] bg-[#fdfbf7] border-2 border-[#7d3627]/15 rounded-xl px-4 py-2.5 outline-none focus:border-[#f3a213] transition-all resize-none"
            />
          </Field>

          <ImageUploadField
            label="Cover Photo"
            value={coverImage}
            onChange={setCoverImage}
            hint="The hero image shown at the top of the recipe page and on the recipe listing"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Prep Time" required hint="e.g. 30 mins">
              <input
                type="text"
                required
                value={prepTime}
                onChange={e => setPrepTime(e.target.value)}
                className="w-full font-body text-sm text-[#7d3627] bg-[#fdfbf7] border-2 border-[#7d3627]/15 rounded-xl px-4 py-2.5 outline-none focus:border-[#f3a213] transition-all"
              />
            </Field>
            <Field label="Servings" required hint="e.g. 4">
              <input
                type="text"
                required
                value={servings}
                onChange={e => setServings(e.target.value)}
                className="w-full font-body text-sm text-[#7d3627] bg-[#fdfbf7] border-2 border-[#7d3627]/15 rounded-xl px-4 py-2.5 outline-none focus:border-[#f3a213] transition-all"
              />
            </Field>
          </div>

          <Field label="Ingredients" hint="One ingredient per line">
            <textarea
              rows={6}
              value={ingredients}
              onChange={e => setIngredients(e.target.value)}
              className="w-full font-body text-sm text-[#7d3627] bg-[#fdfbf7] border-2 border-[#7d3627]/15 rounded-xl px-4 py-2.5 outline-none focus:border-[#f3a213] transition-all resize-y"
            />
          </Field>

          <Field label="Steps" hint="One step per line">
            <textarea
              rows={8}
              value={steps}
              onChange={e => setSteps(e.target.value)}
              className="w-full font-body text-sm text-[#7d3627] bg-[#fdfbf7] border-2 border-[#7d3627]/15 rounded-xl px-4 py-2.5 outline-none focus:border-[#f3a213] transition-all resize-y"
            />
          </Field>

          <Field label="Related Product Slugs" hint="Comma separated product slugs from the shop, e.g. plain-makhana, salt-pepper-makhana">
            <input
              type="text"
              value={relatedSlugs}
              onChange={e => setRelatedSlugs(e.target.value)}
              className="w-full font-body text-sm text-[#7d3627] bg-[#fdfbf7] border-2 border-[#7d3627]/15 rounded-xl px-4 py-2.5 outline-none focus:border-[#f3a213] transition-all"
            />
          </Field>

          <Field label="Status">
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
                  {opt === 'DRAFT' ? 'Draft' : 'Published'}
                </button>
              ))}
            </div>
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
          {isEdit ? 'Save Changes' : 'Create Recipe'}
        </button>

        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 font-body font-semibold text-sm px-5 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all disabled:opacity-60"
          >
            {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
            Delete Recipe
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

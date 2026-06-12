'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2, Save } from 'lucide-react';
import type { BlogPost } from '@prisma/client';

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

interface Props {
  post?: BlogPost;
}

export default function BlogPostForm({ post }: Props) {
  const router = useRouter();
  const isEdit = !!post;

  const [title, setTitle] = useState(post?.title ?? '');
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '');
  const [content, setContent] = useState(post?.content ?? '');
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? '');
  const [tags, setTags] = useState((post?.tags ?? []).join(', '));
  const [status, setStatus] = useState(post?.status ?? 'DRAFT');

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
      excerpt,
      content,
      coverImage,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      status,
    };

    try {
      const res = await fetch(isEdit ? `/api/admin/blog/${post!.id}` : '/api/admin/blog', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save post');
      }
      router.push('/admin/blog');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!post) return;
    if (!confirm('Delete this post permanently? This cannot be undone.')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/blog/${post.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      router.push('/admin/blog');
      router.refresh();
    } catch {
      setError('Failed to delete post');
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
      <div className="bg-white rounded-2xl border border-[#7d3627]/8 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#7d3627]/8">
          <h2 className="font-display font-bold text-lg text-[#7d3627]">Post Details</h2>
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

          <Field label="Slug" required hint="Used in the URL: /blog/your-slug">
            <input
              type="text"
              required
              value={slug}
              onChange={e => { setSlug(slugify(e.target.value)); setSlugTouched(true); }}
              className="w-full font-body text-sm text-[#7d3627] bg-[#fdfbf7] border-2 border-[#7d3627]/15 rounded-xl px-4 py-2.5 outline-none focus:border-[#f3a213] transition-all"
            />
          </Field>

          <Field label="Excerpt" required hint="Short summary shown on the blog listing page">
            <textarea
              required
              rows={2}
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              className="w-full font-body text-sm text-[#7d3627] bg-[#fdfbf7] border-2 border-[#7d3627]/15 rounded-xl px-4 py-2.5 outline-none focus:border-[#f3a213] transition-all resize-none"
            />
          </Field>

          <Field label="Content" required hint="Separate paragraphs with a blank line">
            <textarea
              required
              rows={12}
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full font-body text-sm text-[#7d3627] bg-[#fdfbf7] border-2 border-[#7d3627]/15 rounded-xl px-4 py-2.5 outline-none focus:border-[#f3a213] transition-all resize-y"
            />
          </Field>

          <Field label="Cover Image URL" required>
            <input
              type="text"
              required
              value={coverImage}
              onChange={e => setCoverImage(e.target.value)}
              placeholder="https://..."
              className="w-full font-body text-sm text-[#7d3627] bg-[#fdfbf7] border-2 border-[#7d3627]/15 rounded-xl px-4 py-2.5 outline-none focus:border-[#f3a213] transition-all"
            />
          </Field>

          <Field label="Tags" hint="Comma separated, e.g. Health, Makhana, Nutrition">
            <input
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
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
          {isEdit ? 'Save Changes' : 'Create Post'}
        </button>

        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 font-body font-semibold text-sm px-5 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all disabled:opacity-60"
          >
            {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
            Delete Post
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

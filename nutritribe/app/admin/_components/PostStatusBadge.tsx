import { PostStatus } from '@prisma/client';

const CONFIG: Record<PostStatus, { label: string; bg: string; text: string; dot: string }> = {
  DRAFT:     { label: 'Draft',     bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  PUBLISHED: { label: 'Published', bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-400' },
};

export default function PostStatusBadge({ status }: { status: PostStatus }) {
  const { label, bg, text, dot } = CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold font-body ${bg} ${text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

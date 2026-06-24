import type { ReactNode } from 'react';

/* ── Lite-markdown renderer for admin-editable legal policy content ──
   Supported syntax (kept intentionally small so it's easy for a
   non-technical admin to write):
     blank line        -> new block
     "## Heading"      -> <h2>
     "### Heading"     -> <h3>
     "- item"          -> consecutive lines become one <ul><li>
     "> line"          -> consecutive lines become one <address> (line breaks between)
     "**bold**"        -> <strong>
     "[text](url)"     -> <a> (opens in a new tab for external links)
     anything else     -> <p>, single newlines inside the block become <br/>
   ──────────────────────────────────────────────────────────────────── */

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text))) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    if (match[1] !== undefined) {
      nodes.push(<strong key={key++}>{match[1]}</strong>);
    } else {
      const isExternal = match[3].startsWith('http');
      nodes.push(
        <a key={key++} href={match[3]} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noopener noreferrer' : undefined}>
          {match[2]}
        </a>
      );
    }
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

function renderLines(lines: string[]): ReactNode[] {
  return lines.map((line, i) => (
    <span key={i}>
      {renderInline(line)}
      {i < lines.length - 1 && <br />}
    </span>
  ));
}

export function PolicyContent({ content }: { content: string }) {
  const blocks = content.split(/\n\s*\n/).filter(Boolean);

  return (
    <div className="prose-legal">
      {blocks.map((block, i) => {
        const lines = block.split('\n');
        const first = lines[0];

        if (first.startsWith('## ')) {
          return <h2 key={i}>{renderInline(first.slice(3))}</h2>;
        }
        if (first.startsWith('### ')) {
          return <h3 key={i}>{renderInline(first.slice(4))}</h3>;
        }
        if (lines.every(l => l.startsWith('- '))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => <li key={j}>{renderInline(l.slice(2))}</li>)}
            </ul>
          );
        }
        if (lines.every(l => l.startsWith('> '))) {
          return <address key={i}>{renderLines(lines.map(l => l.slice(2)))}</address>;
        }
        return <p key={i}>{renderLines(lines)}</p>;
      })}
    </div>
  );
}

export default PolicyContent;

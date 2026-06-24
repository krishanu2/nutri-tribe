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

/* Line-by-line state machine instead of blank-line block splitting — a
   heading/bullet/address prefix always flushes & switches the current
   block on its own, so a missing blank line between e.g. a bullet list
   and the next heading can never silently swallow content or leak a
   literal "## " into the page. */
export function PolicyContent({ content }: { content: string }) {
  const elements: ReactNode[] = [];
  let mode: 'none' | 'p' | 'ul' | 'address' = 'none';
  let buffer: string[] = [];
  let key = 0;

  const flush = () => {
    if (buffer.length > 0) {
      if (mode === 'ul') {
        elements.push(<ul key={key++}>{buffer.map((l, j) => <li key={j}>{renderInline(l)}</li>)}</ul>);
      } else if (mode === 'address') {
        elements.push(<address key={key++}>{renderLines(buffer)}</address>);
      } else if (mode === 'p') {
        elements.push(<p key={key++}>{renderLines(buffer)}</p>);
      }
    }
    buffer = [];
    mode = 'none';
  };

  for (const line of content.split('\n')) {
    if (line.trim() === '') { flush(); continue; }

    if (line.startsWith('## ')) {
      flush();
      elements.push(<h2 key={key++}>{renderInline(line.slice(3))}</h2>);
      continue;
    }
    if (line.startsWith('### ')) {
      flush();
      elements.push(<h3 key={key++}>{renderInline(line.slice(4))}</h3>);
      continue;
    }
    if (line.startsWith('- ')) {
      if (mode !== 'ul') flush();
      mode = 'ul';
      buffer.push(line.slice(2));
      continue;
    }
    if (line.startsWith('> ')) {
      if (mode !== 'address') flush();
      mode = 'address';
      buffer.push(line.slice(2));
      continue;
    }
    if (mode !== 'p') flush();
    mode = 'p';
    buffer.push(line);
  }
  flush();

  return <div className="prose-legal">{elements}</div>;
}

export default PolicyContent;

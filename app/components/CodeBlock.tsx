'use client';

import React, { useState } from 'react';
import { Copy, Check, Terminal, FileCode } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

const formatCode = (raw: string): string => {
  if (!raw) return '';
  let formatted = raw.trim();

  // If code is already multi-line, preserve existing lines
  if (formatted.includes('\n')) {
    return formatted;
  }

  // Handle collapsed comments
  if (formatted.startsWith('--')) {
    formatted = formatted.replace(/^(--[^\n]*?)\s+(local\b|if\b|function\b|redis\.call)/, '$1\n$2');
  } else if (formatted.startsWith('//')) {
    formatted = formatted.replace(/^(\/\/[^\n]*?)\s+(const\b|let\b|var\b|function\b|import\b|if\b)/, '$1\n$2');
  } else if (formatted.startsWith('#')) {
    formatted = formatted.replace(/^(#[^\n]*?)\s+(def\b|import\b|class\b|if\b)/, '$1\n$2');
  }

  // Break statements onto new lines if flattened
  formatted = formatted
    .replace(/;\s*/g, ';\n')
    .replace(/\s+(local\s+[a-zA-Z_0-9]+)/g, '\n$1')
    .replace(/\s+(if\s+)/g, '\n$1')
    .replace(/\s+(then)\s+/g, ' $1\n  ')
    .replace(/\s+(else)\s+/g, '\n$1\n  ')
    .replace(/\s+(end)\b/g, '\n$1')
    .replace(/\s+(return\s+)/g, '\n$1')
    .replace(/\s+(redis\.call\()/g, '\n$1');

  const lines = formatted.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
  let indentLevel = 0;
  const indentedLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith('end') || line.startsWith('}') || line.startsWith('else')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
    indentedLines.push('  '.repeat(indentLevel) + line);
    if (line.endsWith('then') || line.startsWith('else') || line.endsWith('{') || (line.startsWith('function') && !line.endsWith('end'))) {
      indentLevel++;
    }
  }

  return indentedLines.join('\n');
};

const highlightSyntax = (rawCode: string, lang: string): React.ReactNode[] => {
  const formattedCode = formatCode(rawCode);
  const lines = formattedCode.split('\n');

  return lines.map((line, lineIndex) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('--') || trimmed.startsWith('//') || trimmed.startsWith('#')) {
      return (
        <div key={lineIndex} className="table-row">
          <span className="table-cell pr-4 text-zinc-500 select-none text-right w-8 text-[11px]">
            {lineIndex + 1}
          </span>
          <span className="table-cell text-zinc-400 italic">
            {line}
          </span>
        </div>
      );
    }

    const tokens = line.split(/(".*?"|'.*?'|\b(?:local|if|then|else|elseif|end|return|function|const|let|var|import|export|from|async|await|select|from|where|not|and|or|true|false|KEYS|ARGV)\b|\b\d+\b)/g);

    return (
      <div key={lineIndex} className="table-row">
        <span className="table-cell pr-4 text-zinc-500 select-none text-right w-8 text-[11px]">
          {lineIndex + 1}
        </span>
        <span className="table-cell">
          {tokens.map((token, tokenIndex) => {
            if (!token) return null;

            if (token.startsWith('"') || token.startsWith("'")) {
              return (
                <span key={tokenIndex} className="text-emerald-400 font-medium">
                  {token}
                </span>
              );
            }

            if (/^(local|if|then|else|elseif|end|return|function|const|let|var|import|export|from|async|await|select|where|not|and|or)$/i.test(token)) {
              return (
                <span key={tokenIndex} className="text-indigo-400 font-semibold">
                  {token}
                </span>
              );
            }

            if (/^(KEYS|ARGV)$/.test(token)) {
              return (
                <span key={tokenIndex} className="text-purple-300 font-bold">
                  {token}
                </span>
              );
            }

            if (/^(true|false)$/.test(token)) {
              return (
                <span key={tokenIndex} className="text-rose-400 font-semibold">
                  {token}
                </span>
              );
            }

            if (/^\d+$/.test(token)) {
              return (
                <span key={tokenIndex} className="text-amber-400 font-semibold">
                  {token}
                </span>
              );
            }

            if (token.includes('redis.call')) {
              const parts = token.split('redis.call');
              return (
                <span key={tokenIndex}>
                  {parts[0]}
                  <span className="text-sky-300 font-bold">redis.call</span>
                  {parts.slice(1).join('redis.call')}
                </span>
              );
            }

            return <span key={tokenIndex} className="text-zinc-200">{token}</span>;
          })}
        </span>
      </div>
    );
  });
};

const detectLanguage = (code: string, explicitLang?: string): string => {
  if (explicitLang && explicitLang !== 'auto') {
    return explicitLang;
  }
  const lower = code.toLowerCase();
  if (lower.includes('redis.call') || lower.includes('-- redis') || lower.includes('keys[') || (lower.includes('local ') && lower.includes('end'))) {
    return 'Lua / Redis';
  }
  if (lower.includes('import ') || lower.includes('export ') || lower.includes('const ') || lower.includes('interface ')) {
    return 'TypeScript';
  }
  if (lower.includes('select ') && lower.includes('from ')) {
    return 'SQL';
  }
  if (lower.includes('def ') || lower.includes('elif:')) {
    return 'Python';
  }
  return 'Code Snippet';
};

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, filename }) => {
  const [copied, setCopied] = useState(false);
  const detected = detectLanguage(code, language);

  const handleCopy = async () => {
    try {
      const formatted = formatCode(code);
      await navigator.clipboard.writeText(formatted);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-100 overflow-hidden shadow-md my-2 text-xs">
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800 text-[11px]">
        <div className="flex items-center gap-2 text-zinc-400 font-medium">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-semibold text-zinc-300">{filename || detected}</span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-zinc-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="p-4 overflow-x-auto font-mono leading-relaxed select-text">
        <div className="table w-full">
          {highlightSyntax(code, detected)}
        </div>
      </div>
    </div>
  );
};

export const FormattedContent: React.FC<{ content: string; className?: string }> = ({ content, className = '' }) => {
  if (!content) return null;

  if (content.includes('```')) {
    const segments = content.split(/(```[\s\S]*?```)/g);

    return (
      <div className={`space-y-2 ${className}`}>
        {segments.map((segment, idx) => {
          if (segment.startsWith('```') && segment.endsWith('```')) {
            const lines = segment.slice(3, -3).trim().split('\n');
            const firstLine = lines[0].trim();
            const hasLang = /^[a-zA-Z0-9_-]+$/.test(firstLine);
            const lang = hasLang ? firstLine : undefined;
            const code = hasLang ? lines.slice(1).join('\n') : lines.join('\n');
            return <CodeBlock key={idx} code={code} language={lang} />;
          }

          return (
            <p key={idx} className="whitespace-pre-wrap leading-relaxed">
              {segment}
            </p>
          );
        })}
      </div>
    );
  }

  const isCodeLikely =
    content.includes('\n') &&
    (content.trim().startsWith('--') ||
     content.trim().startsWith('//') ||
     content.trim().startsWith('#') ||
     content.includes('redis.call') ||
     content.includes('const ') ||
     content.includes('function ') ||
     content.includes('local '));

  if (isCodeLikely) {
    return <CodeBlock code={content.trim()} />;
  }

  return (
    <p className={`whitespace-pre-wrap leading-relaxed ${className}`}>
      {content}
    </p>
  );
};

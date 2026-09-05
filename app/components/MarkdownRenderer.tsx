'use client';

import React, { useMemo } from 'react';
import katex from 'katex';
import { CodeBlock } from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const renderMathAndText = (text: string) => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    const mathRegex = /(\$\$[\s\S]*?\$\$|\$[^$\n]+\$)/g;
    let match;

    let keyCounter = 0;
    while ((match = mathRegex.exec(text)) !== null) {
      const matchStart = match.index;
      const matchEnd = match.index + match[0].length;

      if (matchStart > lastIndex) {
        parts.push(renderFormattedInline(text.substring(lastIndex, matchStart), `txt-${keyCounter++}`));
      }

      const rawMath = match[0];
      const isBlock = rawMath.startsWith('$$') && rawMath.endsWith('$$');
      const mathContent = isBlock ? rawMath.slice(2, -2).trim() : rawMath.slice(1, -1).trim();

      try {
        const html = katex.renderToString(mathContent, {
          displayMode: isBlock,
          throwOnError: false
        });

        if (isBlock) {
          parts.push(
            <div
              key={`math-block-${keyCounter++}`}
              className="my-3 p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 text-center overflow-x-auto text-sm sm:text-base font-serif"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } else {
          parts.push(
            <span
              key={`math-inline-${keyCounter++}`}
              className="inline-block px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 font-serif"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }
      } catch {
        parts.push(<code key={`math-err-${keyCounter++}`} className="text-amber-500 text-xs">{rawMath}</code>);
      }

      lastIndex = matchEnd;
    }

    if (lastIndex < text.length) {
      parts.push(renderFormattedInline(text.substring(lastIndex), `txt-${keyCounter++}`));
    }

    return parts.length > 0 ? parts : text;
  };

  const renderFormattedInline = (inlineText: string, baseKey: string): React.ReactNode => {
    const inlineRegex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
    const pieces: React.ReactNode[] = [];
    let lastIdx = 0;
    let match;
    let count = 0;

    while ((match = inlineRegex.exec(inlineText)) !== null) {
      const start = match.index;
      const end = match.index + match[0].length;

      if (start > lastIdx) {
        pieces.push(inlineText.substring(lastIdx, start));
      }

      const token = match[0];
      if (token.startsWith('**') && token.endsWith('**')) {
        pieces.push(
          <strong key={`${baseKey}-b-${count++}`} className="font-bold text-zinc-900 dark:text-zinc-100">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith('*') && token.endsWith('*')) {
        pieces.push(
          <em key={`${baseKey}-i-${count++}`} className="italic text-zinc-800 dark:text-zinc-200">
            {token.slice(1, -1)}
          </em>
        );
      } else if (token.startsWith('`') && token.endsWith('`')) {
        pieces.push(
          <code key={`${baseKey}-c-${count++}`} className="px-1.5 py-0.5 rounded-lg bg-zinc-200/80 dark:bg-zinc-800 text-[11px] text-indigo-600 dark:text-indigo-300 border border-zinc-300/40 dark:border-zinc-700/50">
            {token.slice(1, -1)}
          </code>
        );
      } else if (token.startsWith('[') && token.includes('](')) {
        const linkText = token.substring(1, token.indexOf(']('));
        const linkUrl = token.substring(token.indexOf('](') + 2, token.length - 1);
        pieces.push(
          <a
            key={`${baseKey}-a-${count++}`}
            href={linkUrl}
            target="_blank"
            rel="noreferrer"
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium inline-flex items-center gap-0.5"
          >
            {linkText}
          </a>
        );
      }

      lastIdx = end;
    }

    if (lastIdx < inlineText.length) {
      pieces.push(inlineText.substring(lastIdx));
    }

    return <React.Fragment key={baseKey}>{pieces}</React.Fragment>;
  };

  const blocks = useMemo(() => {
    const lines = content.split('\n');
    const result: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLanguage = '';
    let codeBuffer: string[] = [];
    let blockIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.trim().startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.trim().slice(3).trim() || 'text';
          codeBuffer = [];
        } else {
          inCodeBlock = false;
          const fullCode = codeBuffer.join('\n');
          const currIdx = blockIndex++;
          result.push(
            <CodeBlock
              key={`code-block-${currIdx}`}
              code={fullCode}
              language={codeLanguage}
            />
          );
        }
        continue;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        continue;
      }

      if (line.startsWith('### ')) {
        result.push(
          <h3 key={`h3-${blockIndex++}`} className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 mt-3 mb-1">
            {renderMathAndText(line.slice(4))}
          </h3>
        );
        continue;
      }
      if (line.startsWith('## ')) {
        result.push(
          <h2 key={`h2-${blockIndex++}`} className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-4 mb-1.5 border-b border-zinc-200/60 dark:border-zinc-800 pb-1">
            {renderMathAndText(line.slice(3))}
          </h2>
        );
        continue;
      }
      if (line.startsWith('# ')) {
        result.push(
          <h1 key={`h1-${blockIndex++}`} className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-4 mb-2">
            {renderMathAndText(line.slice(2))}
          </h1>
        );
        continue;
      }

      if (line.startsWith('> ')) {
        result.push(
          <blockquote key={`quote-${blockIndex++}`} className="my-2 pl-3.5 py-1.5 border-l-2 border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 text-xs italic text-zinc-700 dark:text-zinc-300 rounded-r-xl">
            {renderMathAndText(line.slice(2))}
          </blockquote>
        );
        continue;
      }

      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        result.push(
          <div key={`li-${blockIndex++}`} className="flex items-start gap-2.5 my-1 text-xs text-zinc-700 dark:text-zinc-300 pl-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
            <div className="flex-1 leading-relaxed">
              {renderMathAndText(line.trim().slice(2))}
            </div>
          </div>
        );
        continue;
      }

      const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        result.push(
          <div key={`num-${blockIndex++}`} className="flex items-start gap-2 my-1 text-xs text-zinc-700 dark:text-zinc-300 pl-1">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 shrink-0 text-[11px]">{numMatch[1]}.</span>
            <div className="flex-1 leading-relaxed">
              {renderMathAndText(numMatch[2])}
            </div>
          </div>
        );
        continue;
      }

      if (!line.trim()) {
        continue;
      }

      result.push(
        <p key={`p-${blockIndex++}`} className="my-1.5 leading-relaxed text-xs sm:text-[13px] text-zinc-700 dark:text-zinc-300">
          {renderMathAndText(line)}
        </p>
      );
    }

    return result;
  }, [content]);

  return <div className={`space-y-1 font-sans ${className}`}>{blocks}</div>;
};

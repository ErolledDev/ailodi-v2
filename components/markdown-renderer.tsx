'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className="prose prose-lg max-w-none"
      components={{
        code(props) {
          const { children, className, ...rest } = props;
          const match = /language-(\w+)/.exec(className || '');
          return match ? (
            <SyntaxHighlighter
              PreTag="div"
              language={match[1]}
              style={oneDark}
              customStyle={{
                borderRadius: '0.5rem',
                padding: '1.5rem',
                margin: '1.5rem 0',
              }}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code {...rest} className={className}>
              {children}
            </code>
          );
        },
        h1: ({ children }) => (
          <h1 className="text-4xl font-bold text-foreground mb-6 leading-tight">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-3xl font-semibold text-foreground mb-4 mt-8 leading-tight">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-2xl font-semibold text-foreground mb-3 mt-6 leading-tight">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            {children}
          </p>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary pl-6 italic text-muted-foreground my-6 bg-primary/5 py-4 rounded-r-lg">
            {children}
          </blockquote>
        ),
        ul: ({ children }) => (
          <ul className="list-disc pl-6 mb-6 space-y-2">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-6 mb-6 space-y-2">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="text-lg text-muted-foreground leading-relaxed">
            {children}
          </li>
        ),
        a: ({ children, href }) => (
          <a
            href={href}
            className="text-primary hover:text-primary/80 underline font-medium"
            target={href?.startsWith('http') ? '_blank' : undefined}
            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {children}
          </a>
        ),
        img: ({ src, alt }) => (
          <img
            src={src}
            alt={alt}
            className="rounded-lg my-6 shadow-md w-full"
            loading="lazy"
            width="800"
            height="450"
            style={{ aspectRatio: '16/9', objectFit: 'cover' }}
          />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
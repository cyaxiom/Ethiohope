import React from 'react';
import { clsx } from 'clsx';
import { hasRichTextContent } from '../../lib/html';

interface RichTextContentProps {
  html?: string | null;
  className?: string;
  fallback?: string;
}

/** Renders stored rich-text HTML safely for display. */
export const RichTextContent: React.FC<RichTextContentProps> = ({
  html,
  className,
  fallback,
}) => {
  if (!hasRichTextContent(html)) {
    if (!fallback) return null;
    return <p className={className}>{fallback}</p>;
  }

  return (
    <div
      className={clsx('rich-text-content', className)}
      dangerouslySetInnerHTML={{ __html: html as string }}
    />
  );
};

export default RichTextContent;

/** Strip HTML tags for previews / validation. */
export const stripHtml = (html?: string | null): string => {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim();
};

/** True when TipTap content has meaningful text (not just empty tags). */
export const hasRichTextContent = (html?: string | null): boolean =>
  stripHtml(html).length > 0;

import DOMPurify from 'dompurify';

export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'h1', 'h2', 'h3', 
      'ul', 'ol', 'li', 'a', 'span'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  });
};

export const isHtmlContent = (text: string): boolean => {
  // Check if the text contains HTML tags
  const htmlTagRegex = /<[^>]*>/;
  return htmlTagRegex.test(text);
};

export const renderSafeHtml = (content: string): { __html: string } => {
  // If it's HTML content, sanitize it
  if (isHtmlContent(content)) {
    return { __html: sanitizeHtml(content) };
  }
  
  // If it's plain text, convert line breaks to <br> tags
  const htmlContent = content.replace(/\n/g, '<br>');
  return { __html: sanitizeHtml(htmlContent) };
};
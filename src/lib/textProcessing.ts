export interface TextSegment {
  text: string;
  isLink: boolean;
  url?: string;
  startIndex: number;
  endIndex: number;
}

export const processMarkdownSegments = (text: string): TextSegment[] => {
  const segments: TextSegment[] = [];
  let lastIndex = 0;
  let charCount = 0;

  const sanitizedText = text.normalize('NFC');
  const pattern = /\[((?:[^\]]|\\\])*)\]\(((?:[^)]|\\\))*)\)/g;
  const matches = Array.from(sanitizedText.matchAll(pattern));

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const [fullMatch, linkText, url] = match;
    const matchIndex = match.index!;

    if (matchIndex > lastIndex) {
      const beforeText = text.slice(lastIndex, matchIndex);
      if (beforeText.length > 0) {
        const beforeChars = Array.from(beforeText);
        segments.push({
          text: beforeText,
          isLink: false,
          startIndex: charCount,
          endIndex: charCount + beforeChars.length
        });
        charCount += beforeChars.length;
      }
    }

    if (linkText.length > 0) {
      const decodedText = linkText.replace(/\\(.)/g, '$1');
      const decodedUrl = url.replace(/\\(.)/g, '$1');
      const linkChars = Array.from(decodedText);
      segments.push({
        text: decodedText,
        isLink: true,
        url: decodedUrl,
        startIndex: charCount,
        endIndex: charCount + linkChars.length
      });
      charCount += linkChars.length;
    }

    lastIndex = matchIndex + fullMatch.length;
  }

  if (lastIndex < text.length) {
    const remainingText = text.slice(lastIndex);
    const remainingChars = Array.from(remainingText);
    if (remainingChars.length > 0) {
      segments.push({
        text: remainingText,
        isLink: false,
        startIndex: charCount,
        endIndex: charCount + remainingChars.length
      });
    }
  }

  return segments;
};

export const processMarkdown = (text: string, visibleChars: number): string => {
  const segments = processMarkdownSegments(text);
  let result = '';
  let currentPos = 0;

  for (const segment of segments) {
    if (currentPos >= visibleChars) break;

    const chars = Array.from(segment.text.normalize('NFC'));
    const remainingChars = visibleChars - currentPos;
    const visibleCount = Math.min(chars.length, remainingChars);

    if (visibleCount <= 0) continue;

    const visibleText = chars.slice(0, visibleCount).join('');

    if (segment.isLink) {
      result += visibleText;

      if (visibleCount === chars.length) {
        const encoded = encodeURI(segment.url || '');
        result = result.slice(0, -(visibleText.length)) +
          `<a href="${encoded}" class="inline-block">${visibleText}</a>`;
      }
    } else {
      result += visibleText;
    }

    currentPos += visibleCount;
  }

  return result;
};

interface PortableTextBlock {
  _type: string;
  children?: Array<{ _type: string; text?: string }>;
}

export function calculateReadingTime(blocks: PortableTextBlock[] | undefined): number {
  if (!blocks || !Array.isArray(blocks)) return 0;

  // 1. Extract all raw text from the Portable Text blocks
  const plainText = blocks
    .filter((block) => block._type === 'block')
    .map((block) => block.children?.map((child) => child.text || '').join('') || '')
    .join(' ');

  // 2. Count the words by splitting white spaces
  const words = plainText.trim().split(/\s+/).filter(Boolean).length;

  // 3. Calculate reading time (200 words per minute average)
  const wordsPerMinute = 200;
  const minutes = Math.ceil(words / wordsPerMinute);

  return minutes;
}
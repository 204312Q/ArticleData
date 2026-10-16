export type PostCategory =
  | 'Nutrition'
  | 'Recovery'
  | 'Breastfeeding'
  | 'Wellbeing'
  | 'Planning'
  | string;

export type PostImageAsset = {
  src: string;
  alt: string;
  objectPosition?: string;
  maxWidth?: number;
  displayHeight?: number;
  fit?: 'cover' | 'contain';
};

export type PostContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string; size?: 'small' | 'medium' | 'large'; uppercase?: boolean; fontWeight?: number; letterSpacing?: number | string; }
  | { type: 'standardHeading'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'practiceTable'; headers: string[]; rows: { cells: { text: string; colSpan?: number; bold?: boolean; }[];}[];}
  | { type: 'comparisonTable'; title: string; pros: { title: string; text: string }[];cons: { title: string; text: string }[];}
  | { type: 'pinkHeading'; text: string }
  | { type: 'spacedHeading'; text: string; number?: string }
  | { type: 'callout'; title: string; text: string }
  | { type: 'list'; items: string[]; style?: 'bullet' | 'number' | 'none'; links?: { text: string; url: string }[];}
  | { type: 'image'; image: PostImageAsset; caption?: string }
  | { type: 'promoLink'; before: string; linkText: string; after: string; url: string;}
  | { type: 'steriliserTable' ; title: string;rows: {name: string;description: string;image: PostImageAsset;pros?: string;cons?: string;}[];}
  | { type: 'table'; rows: {birth: string; avoid: string; eat: string;}[];}
  | { type: 'gallery'; images: PostImageAsset[]; caption?: string };
   

export type PostItemData = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: PostCategory;
  tags: string[];
  coverUrl: string;
  createdAt: string;
  reference?: string | string[];
  blocks: PostContentBlock[];
};

export const POST_SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
] as const;

export type PostSortValue = (typeof POST_SORT_OPTIONS)[number]['value'];

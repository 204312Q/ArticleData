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
};

export type PostContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string; size?: 'small' | 'medium' | 'large'; uppercase?: boolean; }
  | { type: 'quote'; text: string }
  | { type: 'pinkHeading'; text: string }
  | { type: 'callout'; title: string; text: string }
  | { type: 'list'; items: string[]; style?: 'bullet' | 'number' | 'none';}
  | { type: 'image'; image: PostImageAsset; caption?: string }
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

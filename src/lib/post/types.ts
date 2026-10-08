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
};

export type PostContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'callout'; title: string; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'image'; image: PostImageAsset; caption?: string }
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
  reference?: string;
  blocks: PostContentBlock[];
};

export const POST_SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
] as const;

export type PostSortValue = (typeof POST_SORT_OPTIONS)[number]['value'];

type filter = 'popular' | 'latest' | 'default';

export const commentsOptions: { label: string; value: filter }[] = [
  { label: 'Default', value: 'default' },
  { label: 'Popular', value: 'popular' },
  { label: 'Latest', value: 'latest' },
];

export const postOptions: { label: string; value: filter | 'top' }[] = [
  ...commentsOptions,
  { label: 'Top', value: 'top' },
];

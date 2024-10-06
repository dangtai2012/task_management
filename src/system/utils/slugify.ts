import slugify from 'slugify';

export function Slugify(
  input: string,
  options?: {
    replacement?: string;
    remove?: RegExp;
    lower?: boolean;
    strict?: boolean;
    locale?: string;
    trim?: boolean;
  },
) {
  return slugify(input, {
    lower: true,
    strict: true,
    trim: true,
    locale: 'vi',
    ...options,
  });
}

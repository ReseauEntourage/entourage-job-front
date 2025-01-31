const dev = process.env.NODE_ENV !== 'production';

export const addPrefix = (path: string) => {
  if (
    !dev &&
    path &&
    !path.includes('http://') &&
    !path.includes('https://') &&
    path.includes('/static')
  ) {
    const index = path.indexOf('/static');
    return `${process.env.NEXT_PUBLIC_CDN_URL || ''}${path.substring(index)}`;
  }
  return path;
};

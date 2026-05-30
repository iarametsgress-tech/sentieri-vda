import blurMap from '@/data/image-blur.json';

/** Base64 blur placeholder for static images under /public (see npm run blur). */
export function getBlurDataURL(imagePath: string): string | undefined {
  if (!imagePath.startsWith('/')) return undefined;
  return blurMap[imagePath as keyof typeof blurMap];
}

export function isRemoteImage(src: string): boolean {
  return src.startsWith('http://') || src.startsWith('https://');
}

/** Props for next/image on local trail assets (blur + no unoptimized). */
export function trailImageBlurProps(src: string): {
  placeholder?: 'blur';
  blurDataURL?: string;
  unoptimized?: boolean;
} {
  if (isRemoteImage(src)) {
    return { unoptimized: true };
  }
  const blurDataURL = getBlurDataURL(src);
  if (blurDataURL) {
    return { placeholder: 'blur', blurDataURL };
  }
  return {};
}

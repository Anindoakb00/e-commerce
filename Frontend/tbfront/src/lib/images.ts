import { BACKEND_ORIGIN } from './config'


const LOCAL_PLACEHOLDER = '/file.svg'

export function normalizeImageUrl(src?: string | null) {
  // If src is missing or not a primitive string, return the local placeholder
  if (!src || typeof src !== 'string') return LOCAL_PLACEHOLDER;

  try {
    const u = new URL(src);
    return u.href;
  } catch (e) {
    // If it's a root-absolute path to a known local public asset, serve as-is
    if (src === LOCAL_PLACEHOLDER || src.startsWith('/_next') || src.startsWith('/favicon')) {
      return src;
    }

    // If it's a backend media path like '/media/...', prepend backend origin
    if (src.startsWith('/media/')) return `${BACKEND_ORIGIN}${src}`;

    // If it's a relative media path like 'media/foo.png', normalize to backend
    if (src.startsWith('media/')) return `${BACKEND_ORIGIN}/${src}`;

    // For any other root-absolute path, assume it's intended for backend
    if (src.startsWith('/')) return `${BACKEND_ORIGIN}${src}`;

    // Finally, default to backend relative
    return `${BACKEND_ORIGIN}/${src}`;
  }
}

/**
 * The app is served under https://mbatravelsgoa.com/taxi-services/ so it can
 * replace only that page of the WordPress site (see README → Deployment).
 * Used by next.config.ts and anywhere Next.js doesn't add it automatically
 * (next/image `src`, fetch URLs, form actions, absolute metadata URLs).
 */
export const basePath = "/taxi-services";

export const asset = (path: string) => `${basePath}${path}`;

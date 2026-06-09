import { useEffect } from 'react';

const SITE_NAME = 'VoiceyPro';
const BASE_URL = 'https://voiceypro.bolt.host';
export const DEFAULT_DESCRIPTION =
  'Discover professional ElevenLabs voice talent with verified Professional Voice Clone shared links. Browse, filter, and connect with voice actors worldwide.';
const OG_IMAGE = `${BASE_URL}/og-image.png`;

function setMeta(selector: string, attrName: string, attrValue: string, content: string) {
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(path: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = `${BASE_URL}${path}`;
}

export function useSEO({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical = '/',
  noindex = false,
  image = OG_IMAGE,
}: {
  title: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
  image?: string;
}) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    const canonicalUrl = `${BASE_URL}${canonical}`;

    document.title = fullTitle;

    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[name="robots"]', 'name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMeta('meta[property="og:image"]', 'property', 'og:image', image);
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', SITE_NAME);

    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', image);

    setCanonical(canonical);

    return () => {
      document.title = SITE_NAME;
    };
  }, [title, description, canonical, noindex, image]);
}

export function useJsonLd(schema: object) {
  useEffect(() => {
    const id = 'json-ld-schema';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(schema);
    return () => {
      document.getElementById(id)?.remove();
    };
  }, [schema]);
}

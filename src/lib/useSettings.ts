import { useEffect, useState } from 'react';
import { getWithRetry } from './api';

export type AppSettings = {
  appStoreUrl?: string | null;
  privacyUrl?: string | null;
  termsUrl?: string | null;
  supportUrl?: string | null;
};

// Sensible fallbacks so external links work even before/without a network read.
const DEFAULTS: AppSettings = {
  appStoreUrl: 'https://apps.apple.com/app/id6773434191',
  privacyUrl: 'https://jetfax-nextjs.vercel.app/privacy',
  termsUrl: 'https://jetfax-nextjs.vercel.app/terms',
  supportUrl: 'https://jetfax-nextjs.vercel.app/support',
};

let cache: AppSettings | null = null;

export async function fetchSettings(): Promise<AppSettings> {
  if (cache) return cache;
  const res = await getWithRetry<{ settings: AppSettings }>('/api/settings');
  cache = { ...DEFAULTS, ...(res?.settings ?? {}) };
  return cache;
}

export function useSettings(): AppSettings {
  const [settings, setSettings] = useState<AppSettings>(cache ?? DEFAULTS);
  useEffect(() => {
    let mounted = true;
    fetchSettings().then((s) => {
      if (mounted) setSettings(s);
    });
    return () => {
      mounted = false;
    };
  }, []);
  return settings;
}

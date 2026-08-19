// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://bewegtcreative.com',
  trailingSlash: 'ignore',
  build: {
    // Legacy site serves /photography.html etc. (not clean /photography/) —
    // 'file' format keeps every existing URL byte-identical, zero redirects needed.
    format: 'file',
  },
  adapter: cloudflare({
    // Assets are already pre-optimized .webp at build time (see Phase I) — the
    // 'compile' service avoids provisioning the paid Cloudflare Images binding.
    imageService: 'compile',
  }),
  // No server-side session data anywhere on this site (no auth, no cart) — keeps
  // the SSR bundle smaller and skips auto-provisioning a Cloudflare KV namespace.
  session: false,
});
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://minibioweb.com',
  trailingSlash: 'always',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404/'),
      changefreq: 'weekly',
      priority: 0.7,
      serialize(item) {
        item.lastmod = new Date().toISOString();
        if (item.url === 'https://minibioweb.com/') {
          item.priority = 1.0;
        } else if (item.url.includes('/product/')) {
          item.priority = 0.8;
        }
        return item;
      },
    }),
  ],
});

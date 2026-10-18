import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

// Link previews: every page gets the picture in its own language (public/og/, made by
// `npm run og-images`), and the two home pages are marked as a website rather than an article.
export const onRequest = defineRouteMiddleware((context) => {
  const route = context.locals.starlightRoute;
  const lang = route.locale === 'ru' ? 'ru' : 'en';
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  const image = new URL(`${base}og/og-${lang}.jpg`, context.site).href;
  const alt =
    lang === 'ru'
      ? 'Карта системного дизайна: от основ до собеседования. 58 тем, 14 разобранных задач и карта навыков.'
      : 'System Design Map: from the basics to the interview. 58 topics, 14 solved problems and a skill map.';

  route.head.push(
    { tag: 'meta', attrs: { property: 'og:image', content: image } },
    { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
    { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
    { tag: 'meta', attrs: { property: 'og:image:alt', content: alt } },
    { tag: 'meta', attrs: { name: 'twitter:image', content: image } },
  );

  const home = context.url.pathname === base || context.url.pathname === `${base}ru/`;
  if (home) {
    const type = route.head.find((entry) => entry.attrs?.property === 'og:type');
    if (type?.attrs) type.attrs.content = 'website';
  }
});

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

type JsonLdProps = {
  data: Record<string, unknown>;
};

/**
 * Renders schema.org structured data. `<` is escaped so text inside the data
 * can never close the script tag early.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

// ----------------------------------------------------------------------

/** "Home > {name}" breadcrumb trail for a top-level page. */
export function breadcrumbJsonLd(name: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: CONFIG.siteUrl },
      { '@type': 'ListItem', position: 2, name, item: `${CONFIG.siteUrl}${path}` },
    ],
  };
}

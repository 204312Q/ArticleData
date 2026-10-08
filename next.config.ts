import type { NextConfig } from 'next';

// ----------------------------------------------------------------------

/**
 * Static Exports in Next.js
 *
 * 1. Set `isStaticExport = true` in `next.config.{mjs|ts}`.
 * 2. This allows `generateStaticParams()` to pre-render dynamic routes at build time.
 *
 * For more details, see:
 * https://nextjs.org/docs/app/building-your-application/deploying/static-exports
 *
 * NOTE: Remove all "generateStaticParams()" functions if not using static exports.
 */
const isStaticExport = false;
// `next build` always sets NODE_ENV=production, even for Vercel Preview and
// custom (e.g. "dev") environments — so NODE_ENV alone can't tell a real
// production deployment apart from those. VERCEL_TARGET_ENV reports the
// actual target ("production" / "preview" / "development" / a custom
// environment's own name), so prefer it whenever it's set; NODE_ENV remains
// the fallback for non-Vercel builds.
const vercelTargetEnv = process.env.VERCEL_TARGET_ENV;
const isProduction = vercelTargetEnv
  ? vercelTargetEnv === 'production'
  : process.env.NODE_ENV === 'production';
const cspMode = process.env.SECURITY_CSP_MODE ?? (isProduction ? 'enforce' : 'report-only');
const cspConnectOrigins = parseOrigins(process.env.SECURITY_CSP_CONNECT_ORIGINS);
const cspImageOrigins = parseOrigins(process.env.SECURITY_CSP_IMAGE_ORIGINS);

// CyberSource Microform SDK — sandbox + production both whitelisted
const CYBERSOURCE_ORIGINS = ['https://testup.cybersource.com', 'https://flex.cybersource.com'];
// Cardinal Commerce — CyberSource 3DS authentication frames
const CARDINAL_ORIGINS = [
  'https://cas.client.cardinaltrusted.com',
  'https://*.sa.cybersource.com',
  'https://centinelapistag.cardinalcommerce.com',
];
// Google Pay — pay.js and the payment sheet frame come from pay.google.com,
// the button artwork from gstatic. Without these the wallet silently never
// appears, which reads exactly like a broken integration.
const GOOGLE_PAY_ORIGINS = ['https://pay.google.com', 'https://www.gstatic.com'];
// Microsoft Entra ID sign-in. The NextAuth sign-in form posts same-origin, but that
// route immediately redirects to Microsoft — and browsers apply `form-action` across
// redirects, so the final hop has to be listed or the login button does nothing.
const ENTRA_ORIGINS = ['https://login.microsoftonline.com'];
// Google Analytics (GA4) — only enabled when NEXT_PUBLIC_GA_MEASUREMENT_ID is set.
// gtag.js itself loads from googletagmanager.com; the hits it sends (`/g/collect`)
// go to google-analytics.com and its regional subdomains.
const GA_ENABLED = Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
const GOOGLE_ANALYTICS_SCRIPT_ORIGINS = GA_ENABLED ? ['https://www.googletagmanager.com'] : [];
const GOOGLE_ANALYTICS_CONNECT_ORIGINS = GA_ENABLED
  ? [
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
      'https://*.google-analytics.com',
    ]
  : [];
// Origins allowed to call the Payment Request API. Google Pay and Apple Pay both
// need it; `payment=()` disables it outright for everyone, including us.
const PAYMENT_POLICY_ORIGINS = ['self', ...CYBERSOURCE_ORIGINS.map((origin) => `"${origin}"`)].join(
  ' '
);
const cspReportUri = process.env.SECURITY_CSP_REPORT_URI?.trim();

function parseOrigins(value?: string) {
  if (!value) return [];

  return Array.from(
    new Set(
      value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    )
  );
}

function buildCsp() {
  const directives: Array<[string, string[]]> = [
    ['default-src', ["'self'"]],
    ['base-uri', ["'self'"]],
    [
      'connect-src',
      [
        "'self'",
        ...CYBERSOURCE_ORIGINS,
        ...CARDINAL_ORIGINS,
        ...GOOGLE_PAY_ORIGINS,
        ...GOOGLE_ANALYTICS_CONNECT_ORIGINS,
        ...cspConnectOrigins,
      ],
    ],
    ['font-src', ["'self'", 'data:']],
    ['form-action', ["'self'", ...ENTRA_ORIGINS]],
    ['frame-ancestors', ["'none'"]],
    [
      'frame-src',
      [
        ...CYBERSOURCE_ORIGINS,
        ...CARDINAL_ORIGINS,
        ...GOOGLE_PAY_ORIGINS,
        // Vercel's preview toolbar (comments/feedback) opens itself in an iframe
        // on non-production deployments — same gate as the vercel.live script-src
        // entry below.
        ...(!isProduction ? ['https://vercel.live'] : []),
      ],
    ],
    ['img-src', ["'self'", 'data:', 'blob:', ...GOOGLE_PAY_ORIGINS, ...cspImageOrigins]],
    ['manifest-src', ["'self'"]],
    ['media-src', ["'self'", ...cspImageOrigins]],
    ['object-src', ["'none'"]],
    [
      'script-src',
      [
        "'self'",
        "'unsafe-inline'",
        ...CYBERSOURCE_ORIGINS,
        ...CARDINAL_ORIGINS,
        ...GOOGLE_PAY_ORIGINS,
        ...GOOGLE_ANALYTICS_SCRIPT_ORIGINS,
        ...(!isProduction ? ['https://vercel.live'] : []),
      ],
    ],
    ['style-src', ["'self'", "'unsafe-inline'"]],
    ['worker-src', ["'self'", 'blob:']],
  ];

  if (isProduction) {
    directives.push(['upgrade-insecure-requests', []]);
  }

  if (cspReportUri) {
    directives.push(['report-uri', [cspReportUri]]);
  }

  return directives.map(([name, values]) => `${name} ${values.join(' ')}`.trim()).join('; ');
}

function buildSwaggerCsp() {
  const directives: Array<[string, string[]]> = [
    ['default-src', ["'self'"]],
    ['base-uri', ["'self'"]],
    ['connect-src', ["'self'", 'https://unpkg.com', ...cspConnectOrigins]],
    ['font-src', ["'self'", 'data:']],
    ['form-action', ["'self'"]],
    ['frame-ancestors', ["'self'"]],
    ['frame-src', ["'self'"]],
    ['img-src', ["'self'", 'data:', 'blob:', ...cspImageOrigins]],
    ['manifest-src', ["'self'"]],
    ['media-src', ["'self'", ...cspImageOrigins]],
    ['object-src', ["'none'"]],
    ['script-src', ["'self'", "'unsafe-inline'", 'https://unpkg.com']],
    ['style-src', ["'self'", "'unsafe-inline'", 'https://unpkg.com']],
    ['worker-src', ["'self'", 'blob:']],
  ];

  if (isProduction) {
    directives.push(['upgrade-insecure-requests', []]);
  }

  if (cspReportUri) {
    directives.push(['report-uri', [cspReportUri]]);
  }

  return directives.map(([name, values]) => `${name} ${values.join(' ')}`.trim()).join('; ');
}

function buildImageRemotePatterns() {
  return cspImageOrigins
    .filter((origin) => origin.startsWith('http://') || origin.startsWith('https://'))
    .map((origin) => {
      const url = new URL(origin);

      return {
        protocol: url.protocol.replace(':', '') as 'http' | 'https',
        hostname: url.hostname,
        port: url.port,
        pathname: '/**',
      };
    });
}

const cspHeader =
  cspMode === 'enforce'
    ? { key: 'Content-Security-Policy', value: buildCsp() }
    : cspMode === 'off'
      ? null
      : { key: 'Content-Security-Policy-Report-Only', value: buildCsp() };

const securityHeaders = [
  ...(cspHeader ? [cspHeader] : []),
  { key: 'X-DNS-Prefetch-Control', value: 'off' },
  { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  {
    key: 'Permissions-Policy',
    value: `camera=(), geolocation=(), microphone=(), payment=(${PAYMENT_POLICY_ORIGINS}), usb=(), browsing-topics=()`,
  },
  // Google Pay hands off to a popup window and needs to keep the opener reference;
  // a bare `same-origin` severs it.
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
  ...(isProduction
    ? [
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
      ]
    : []),
];

// ----------------------------------------------------------------------

const nextConfig: NextConfig = {
  trailingSlash: false,
  poweredByHeader: false,
  output: isStaticExport ? 'export' : undefined,
  env: {
    BUILD_STATIC_EXPORT: JSON.stringify(isStaticExport),
  },
  images: {
    remotePatterns: buildImageRemotePatterns(),
  },
  // Without --turbopack (next dev)
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  // With --turbopack (next dev --turbopack)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  async redirects() {
    return [
      // --- Specific, high-traffic old URLs (from current Google sitelinks) ---
      {
        source: '/collections/confinement-food',
        destination: '/product',
        permanent: true,
      },
      {
        source: '/pages/menu',
        destination: '/menu',
        permanent: true,
      },
      {
        source: '/products/trial-meal',
        destination: '/product',
        permanent: true,
      },
      {
        source: '/apps/help-center',
        destination: '/faqs',
        permanent: true,
      },
      {
        source: '/products/28-days-dual-meal-package',
        destination: '/product',
        permanent: true,
      },
      {
        source: '/collections/all',
        destination: '/product',
        permanent: true,
      },
 
      // --- Specific old URLs found in Search Console's 404 report ---
      // (no matching new page/article exists, so these need an
      // explicit destination rather than relying on a generic rule)
      {
        source: '/pages/promotions',
        destination: '/',
        permanent: true,
      },
      {
        source: '/blogs/confinement-tips/how-much-dom-to-drink-during-confinement',
        destination: '/post',
        permanent: true,
      },
      {
        source: '/blogs/confinement-tips/ensuring-your-babys-safety-a-guide-to-sterilisers-for-moms',
        destination: '/post',
        permanent: true,
      },
      {
        source: '/blogs/confinement-tips/what-is-the-benefit-of-pig-trotter',
        destination: '/post',
        permanent: true,
      },
 
      // --- Generic fallback for any other old /pages/xxx URLs ---
      // e.g. /pages/about-us -> /about-us, /pages/faqs -> /faqs
      // (must come AFTER the specific /pages/promotions rule above)
      {
        source: '/pages/:slug*',
        destination: '/:slug*',
        permanent: true,
      },
 
      // --- Generic fallback for any other old blog articles ---
      {
        source: '/blogs/:path*',
        destination: '/post',
        permanent: true,
      },
 
      // --- Generic fallback for any other old product/collection URLs ---
      // (covers individual products or collections not listed above,
      // including nested ones like /collections/all/products/xyz)
      {
        source: '/products/:path*',
        destination: '/product',
        permanent: true,
      },
      {
        source: '/collections/:path*',
        destination: '/product',
        permanent: true,
      },
 
      // --- Generic fallback for old Shopify account pages ---
      {
        source: '/account/:path*',
        destination: '/',
        permanent: true,
      },
 
      // --- Generic fallback for old Shopify app pages (reviews, etc.) ---
      {
        source: '/apps/:path*',
        destination: '/',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        source: '/cpnr-order-swagger.html',
        headers: [
          ...(cspMode === 'enforce'
            ? [{ key: 'Content-Security-Policy', value: buildSwaggerCsp() }]
            : cspMode === 'off'
              ? []
              : [{ key: 'Content-Security-Policy-Report-Only', value: buildSwaggerCsp() }]),
          ...securityHeaders.filter(
            (header) =>
              header.key !== 'Content-Security-Policy' &&
              header.key !== 'Content-Security-Policy-Report-Only'
          ),
        ],
      },
    ];
  },
};

export default nextConfig;

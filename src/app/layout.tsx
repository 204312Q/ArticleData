import 'src/global.css';

import type { Metadata, Viewport } from 'next';

import { GoogleAnalytics } from '@next/third-parties/google';

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import { CONFIG } from 'src/global-config';
import { companyInfo, socialLinks } from 'src/layouts/main/data';
import { themeConfig, ThemeProvider, primary as primaryColor } from 'src/theme';

import { ProgressBar } from 'src/components/progress-bar';
import { BootSplash } from 'src/components/loading-screen';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { defaultSettings, SettingsProvider } from 'src/components/settings';

// ----------------------------------------------------------------------

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: primaryColor.main,
};

const SITE_TITLE = `${CONFIG.appName} | Confinement Food Delivery Singapore`;
const SITE_DESCRIPTION =
  'Chinese confinement meal delivery in Singapore. Nutritious lunch and dinner sets for new mums, prepared low in sodium and MSG-free, delivered daily in thermal packaging with no reheating or replating needed.';
const SITE_OG_IMAGE = '/banners/Confinement_Banner_1.jpg';

export const metadata: Metadata = {
  metadataBase: new URL(CONFIG.siteUrl),
  title: {
    default: SITE_TITLE,
    template: `%s | ${CONFIG.appName}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    locale: 'en_SG',
    siteName: CONFIG.appName,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: SITE_OG_IMAGE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE],
  },
  icons: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      url: `${CONFIG.assetsDir}/favicon.ico`,
    },
  ],
};

const addressMatch = companyInfo.address.match(/^(.*),\s*Singapore\s*(\d{6})$/);

const foodEstablishmentJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FoodEstablishment',
  name: companyInfo.name,
  image: `${CONFIG.siteUrl}${companyInfo.affiliateLogo}`,
  url: CONFIG.siteUrl,
  telephone: `+65 ${companyInfo.phone}`,
  email: companyInfo.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: addressMatch?.[1] ?? companyInfo.address,
    addressLocality: 'Singapore',
    postalCode: addressMatch?.[2] ?? '',
    addressCountry: 'SG',
  },
  areaServed: 'SG',
  sameAs: socialLinks.map((link) => link.href),
};

// ----------------------------------------------------------------------

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" dir={defaultSettings.direction} suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(foodEstablishmentJsonLd) }}
        />

        <InitColorSchemeScript
          modeStorageKey={themeConfig.modeStorageKey}
          attribute={themeConfig.cssVariables.colorSchemeSelector}
          defaultMode={themeConfig.defaultMode}
        />

        <SettingsProvider defaultSettings={defaultSettings}>
          <AppRouterCacheProvider options={{ key: 'css' }}>
            <ThemeProvider
              modeStorageKey={themeConfig.modeStorageKey}
              defaultMode={themeConfig.defaultMode}
            >
              <MotionLazy>
                <BootSplash />
                <ProgressBar />
                {children}
              </MotionLazy>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </SettingsProvider>

        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  );
}

import Image from 'next/image';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';

import {
  companyInfo,
  socialLinks,
  hotlineHours,
  paymentTypes,
  comfortForMum,
  behindTheBrand,
} from './data';

// ----------------------------------------------------------------------

export function MainFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <FooterRoot>
      <Divider />

      <Container
        maxWidth="lg"
        sx={{
          pb: 5,
          pt: 10,
          textAlign: { xs: 'center', md: 'unset' },
        }}
      >
        <Box
          sx={{
            mt: 1,
            display: 'grid',
            gap: 5,
            alignItems: 'flex-start',
            justifyContent: 'center',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 4fr) minmax(0, 8fr)' },
          }}
        >
          <Box sx={{ color: 'primary.main' }}>
            <Logo isSingle={false} sx={{ width: 150, height: 54 }} />

            <Typography
              variant="body2"
              sx={{
                mx: { xs: 'auto', md: 0 },
                mt: 2,
                maxWidth: 280,
              }}
            >
              {companyInfo.address}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mx: { xs: 'auto', md: 0 },
                mt: 1,
                maxWidth: 280,
              }}
            >
              Phone: {companyInfo.phone}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mx: { xs: 'auto', md: 0 },
                maxWidth: 280,
              }}
            >
              Email: {companyInfo.email}
            </Typography>

            <Box
              sx={{
                mt: 3,
                mb: { xs: 5, md: 0 },
                display: 'flex',
                justifyContent: { xs: 'center', md: 'flex-start' },
              }}
            >
              {socialLinks.map((social) => (
                <IconButton
                  key={social.label}
                  component="a"
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                >
                  <SocialIcon value={social.value} />
                </IconButton>
              ))}
            </Box>

            <Box
              sx={{
                mt: 3,
                mb: { xs: 5, md: 0 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: { xs: 'center', md: 'flex-start' },
                justifyContent: 'center',
              }}
            >
              <Typography component="div" variant="h6" sx={{ color: 'primary.main' }}>
                Affiliates
              </Typography>

              <Image
                src={companyInfo.affiliateLogo}
                alt="Chilli Padi Nonya Catering"
                width={80}
                height={120}
                style={{ objectFit: 'contain' }}
              />
            </Box>
          </Box>

          <Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                gap: 4,
              }}
            >
              <FooterLinkColumn groups={behindTheBrand} />
              <FooterLinkColumn groups={comfortForMum} />

              <Box sx={{ flex: 1 }}>
                <Box
                  sx={{
                    gap: 2,
                    display: 'flex',
                    alignItems: { xs: 'center', md: 'flex-start' },
                    flexDirection: 'column',
                  }}
                >
                  <Typography component="div" variant="h6" sx={{ color: 'primary.main' }}>
                    Information
                  </Typography>

                  <Typography variant="body2" color="inherit" sx={{ mb: 1 }}>
                    Hotline/Messenger Hours:
                    {hotlineHours.map((item) => (
                      <Box key={item} component="span" sx={{ display: 'block' }}>
                        {item}
                      </Box>
                    ))}
                  </Typography>

                  <Box
                    sx={{
                      mb: { xs: 5, md: 0 },
                      display: 'flex',
                      gap: 2,
                      justifyContent: { xs: 'center', md: 'flex-start' },
                    }}
                  >
                    {paymentTypes.map((payment) => (
                      <Image
                        key={payment.id}
                        src={payment.image}
                        alt={payment.value}
                        width={40}
                        height={40}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <Typography variant="body2" sx={{ mt: 10 }}>
          © {currentYear}{' '}
          <Link href="/" rel="noopener" color="inherit" underline="always">
            Confinement Food Delivery | Chilli Padi Confinement
          </Link>{' '}
          All Rights Reserved.
        </Typography>

        <Box
          sx={{
            mt: 1,
            display: 'flex',
            gap: 2,
            justifyContent: { xs: 'center', md: 'flex-start' },
          }}
        >
          <Link component={RouterLink} href={paths.termsOfUse} color="inherit" variant="body2" underline="always">
            Terms of Use
          </Link>
          <Link
            component={RouterLink}
            href={paths.dataProtectionNotice}
            color="inherit"
            variant="body2"
            underline="always"
          >
            Data Protection Notice
          </Link>
        </Box>
      </Container>
    </FooterRoot>
  );
}

// ----------------------------------------------------------------------

function FooterLinkColumn({
  groups,
}: {
  groups: {
    headline: string;
    children: {
      name: string;
      href: string;
    }[];
  }[];
}) {
  return (
    <Box sx={{ flex: 1 }}>
      {groups.map((group) => (
        <Box
          key={group.headline}
          sx={{
            display: 'flex',
            alignItems: { xs: 'center', md: 'flex-start' },
            flexDirection: 'column',
          }}
        >
          <Typography component="div" variant="h6" sx={{ color: 'primary.main', mb: 2 }}>
            {group.headline}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              alignItems: { xs: 'center', md: 'flex-start' },
            }}
          >
            {group.children.map((link) => (
              <Link
                key={link.name}
                component={RouterLink}
                href={link.href}
                color="inherit"
                variant="body2"
                underline="none"
              >
                {link.name}
              </Link>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

function SocialIcon({ value }: { value: 'facebook' | 'instagram' | 'tiktok' }) {
  if (value === 'facebook') {
    return <Iconify icon="socials:facebook" width={22} />;
  }

  if (value === 'instagram') {
    return <Iconify icon="socials:instagram" width={22} />;
  }

  return (
    <Box
      component="svg"
      viewBox="0 0 24 24"
      sx={{ width: 22, height: 22, display: 'block', fill: 'currentColor' }}
    >
      <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.73h-3.177l-.005 12.85a2.723 2.723 0 0 1-2.721 2.719a2.723 2.723 0 0 1-2.722-2.72a2.723 2.723 0 0 1 2.722-2.72c.226 0 .445.034.653.09V8.931a5.923 5.923 0 0 0-.653-.038A5.92 5.92 0 0 0 4 14.806A5.92 5.92 0 0 0 9.916 20.72a5.92 5.92 0 0 0 5.915-5.914V8.293a7.96 7.96 0 0 0 4.759 1.574V6.686Z" />
    </Box>
  );
}

const FooterRoot = Box;

'use client';

import Image from 'next/image';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';
import { PageHero } from 'src/components/page-hero';

import { RecoveryFaq } from './recovery-faq';
import { RecoveryIcon } from './recovery-icons';
import {
  RECOVERY_MEALS,
  RECOVERY_STEPS,
  RECOVERY_NOTICE,
  RECOVERY_BENEFITS,
  RECOVERY_CHECKLIST,
  RECOVERY_MEALS_NOTE,
  RECOVERY_STEPS_NOTE,
  RECOVERY_WHATSAPP_URL,
  RECOVERY_CHECKLIST_TITLE,
} from './recovery-data';

// ----------------------------------------------------------------------

// Sampled from the hero photo's empty left side so the fade blends into it.
const HERO_BG = '#FEEDF2';
const HERO_BG_RGB = '254, 237, 242';
const PANEL_BG = '#FDE8EC';

const sectionSx = { py: { xs: 4, md: 5 } } as const;

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <Stack spacing={1} alignItems="center" sx={{ textAlign: 'center', mb: { xs: 3, md: 4 } }}>
      <Typography variant="h3" component="h2" sx={{ textWrap: 'balance' }}>
        {title}
      </Typography>
      <Box sx={{ width: 28, height: 3, borderRadius: 1, bgcolor: 'primary.main' }} />
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Stack>
  );
}

// ----------------------------------------------------------------------

function RecoveryHero() {
  return (
    <PageHero
      alt="Steamed fish, soup and greens"
      image="/banners/Recovery-Meals/Asian Recovery Meal Table Setting.png"
      imagePosition="65% center"
      mobileOverlap={56}
      background={HERO_BG}
      backgroundRgb={HERO_BG_RGB}
    >
        <Stack spacing={2.5} alignItems="flex-start" sx={{ maxWidth: { md: 520 } }}>
          <Typography
            variant="overline"
            sx={{ color: 'primary.main', letterSpacing: 1.5, fontWeight: 700 }}
          >
            Post-surgery &amp; recovery meals
          </Typography>

          <Typography
            variant="h1"
            component="h1"
            sx={{ fontSize: { xs: '2.25rem', sm: '2.75rem', md: '3.25rem' }, lineHeight: 1.1 }}
          >
            <Box component="span" sx={{ color: 'primary.main', display: 'block' }}>
              Meals taken care of.
            </Box>
            <Box component="span" sx={{ color: 'grey.800', display: 'block' }}>
              More time to rest.
            </Box>
          </Typography>

          <Typography color="text.secondary" sx={{ fontSize: '1.1rem' }}>
            Explore meal delivery for your time recovering at home.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ width: { xs: 1, sm: 'auto' } }}>
            <Button
              size="large"
              variant="contained"
              color="primary"
              href={RECOVERY_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              endIcon={<Iconify icon="eva:arrow-forward-fill" />}
              sx={{ color: 'common.white', borderRadius: 999 }}
            >
              Speak to Our Team
            </Button>
            <Button
              size="large"
              variant="outlined"
              color="primary"
              href={paths.menu}
              sx={{ borderRadius: 999, bgcolor: 'rgba(255,255,255,0.6)' }}
            >
              Explore Meal Options
            </Button>
          </Stack>
        </Stack>
    </PageHero>
  );
}

// ----------------------------------------------------------------------

function ChecklistBanner() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        spacing={{ xs: 2, md: 3 }}
        sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, bgcolor: PANEL_BG }}
      >
        <Stack direction="row" alignItems="center" spacing={3} sx={{ flexGrow: 1 }}>
          <RecoveryIcon name="checklist" sx={{ width: 56, height: 56, color: 'primary.main' }} />
          <Box sx={{ pl: 3, borderLeft: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h4" component="h2">
              Getting ready to recover at home?
            </Typography>
            <Typography color="text.secondary">
              A practical checklist to help you and your family plan ahead.
            </Typography>
          </Box>
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ width: { xs: 1, md: 'auto' } }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(true)}
            sx={{ color: 'common.white', borderRadius: 999, px: 3 }}
          >
            View Preparation Checklist
          </Button>
        </Stack>
      </Stack>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{RECOVERY_CHECKLIST_TITLE}</DialogTitle>
        <DialogContent>
          <Stack component="ul" spacing={1.5} sx={{ m: 0, pl: 2.5 }}>
            {RECOVERY_CHECKLIST.map((item) => (
              <Typography key={item} component="li" color="text.secondary">
                {item}
              </Typography>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// ----------------------------------------------------------------------

export function RecoveryView() {
  return (
    <>
      <RecoveryHero />

      <Container sx={{ py: { xs: 2, md: 3 } }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={1.5}
          sx={{ px: 3, py: 1.5, borderRadius: 2, bgcolor: PANEL_BG }}
        >
          <RecoveryIcon name="info" sx={{ color: 'primary.main', flexShrink: 0 }} />
          <Typography variant="body2">{RECOVERY_NOTICE}</Typography>
        </Stack>

        <Box component="section" sx={sectionSx}>
          <SectionTitle title="A little less to manage" />
          <Box
            sx={{
              display: 'grid',
              gap: { xs: 3, md: 0 },
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            }}
          >
            {RECOVERY_BENEFITS.map((item, index) => (
              <Stack
                key={item.title}
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{
                  px: { md: 3 },
                  ...(index > 0 && {
                    borderLeft: { md: '1px solid' },
                    borderColor: { md: 'divider' },
                  }),
                }}
              >
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    bgcolor: PANEL_BG,
                    color: 'primary.main',
                  }}
                >
                  <RecoveryIcon name={item.icon} sx={{ width: 34, height: 34 }} />
                </Box>
                <Box>
                  <Typography variant="subtitle1">{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Box>
        </Box>

        <Box component="section" sx={sectionSx}>
          <SectionTitle title="Explore the meals" subtitle={RECOVERY_MEALS_NOTE} />
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            }}
          >
            {RECOVERY_MEALS.map((meal) => (
              <Box
                key={meal.name}
                sx={{ borderRadius: 2, overflow: 'hidden', bgcolor: PANEL_BG }}
              >
                <Box sx={{ position: 'relative', aspectRatio: '16 / 10' }}>
                  <Image
                    fill
                    alt={meal.name}
                    src={meal.image}
                    sizes="(max-width: 600px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                </Box>
                <Typography variant="subtitle2" sx={{ py: 1.5, textAlign: 'center' }}>
                  {meal.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box component="section" sx={sectionSx}>
          <SectionTitle title="Before arranging your meals" />
          <Box
            sx={{
              display: 'grid',
              gap: { xs: 3, md: 0 },
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            }}
          >
            {RECOVERY_STEPS.map((step, index) => (
              <Stack
                key={step.title}
                direction="row"
                spacing={2}
                alignItems="flex-start"
                sx={{
                  px: { md: 3 },
                  ...(index > 0 && {
                    borderLeft: { md: '1px solid' },
                    borderColor: { md: 'divider' },
                  }),
                }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    bgcolor: PANEL_BG,
                    color: 'primary.main',
                    typography: 'h4',
                  }}
                >
                  {index + 1}
                </Box>
                <Box>
                  <Typography variant="subtitle1">{step.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.description}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', textAlign: 'center', mt: 3 }}
          >
            {RECOVERY_STEPS_NOTE}
          </Typography>
        </Box>

        <Box component="section" sx={sectionSx}>
          <ChecklistBanner />
        </Box>

        <Box component="section" sx={sectionSx}>
          <RecoveryFaq />
        </Box>
      </Container>

      <Box component="section" sx={{ bgcolor: PANEL_BG, py: { xs: 4, md: 5 } }}>
        <Container>
          <Stack spacing={2} alignItems="center" sx={{ textAlign: 'center' }}>
            <Typography variant="h4" component="h2">
              Let’s talk about your meal arrangements
            </Typography>
            <Box sx={{ width: 28, height: 3, borderRadius: 1, bgcolor: 'primary.main' }} />
            <Button
              variant="contained"
              color="primary"
              href={RECOVERY_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              endIcon={<Iconify icon="eva:arrow-forward-fill" />}
              sx={{ color: 'common.white', borderRadius: 999, px: 4 }}
            >
              Speak to Our Team
            </Button>
          </Stack>
        </Container>
      </Box>
    </>
  );
}

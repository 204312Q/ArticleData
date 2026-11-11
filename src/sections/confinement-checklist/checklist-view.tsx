'use client';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';
import { PageHero } from 'src/components/page-hero';

import { CompareBanner } from '../compare-packages/compare-banner';
import {
  CHECKLIST_SECTIONS,
  CHECKLIST_ITEM_COUNT,
  CHECKLIST_HERO_IMAGE,
  CHECKLIST_DOWNLOAD_PATH,
} from './checklist-data';

// ----------------------------------------------------------------------

const HERO_BG = '#FDEDF1';
const HERO_BG_RGB = '253, 237, 241';
const PANEL_BG = '#FDE8EC';

const STORAGE_KEY = 'confinement-checklist-v1';
const PDF_FILENAME = 'confinement-checklist.pdf';

type ChecklistState = {
  done: boolean[];
};

// ----------------------------------------------------------------------
// PDF: the ticks are POSTed to build it. The last result is cached so Share
// can run straight inside the tap — mobile browsers only allow sharing during
// a fresh user gesture.

let cachedPdf: { key: string; blob: Blob } | null = null;

async function fetchPdf(state: ChecklistState): Promise<Blob> {
  const key = JSON.stringify(state);
  if (cachedPdf?.key === key) return cachedPdf.blob;

  const response = await fetch(CHECKLIST_DOWNLOAD_PATH, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state),
  });
  if (!response.ok) throw new Error('PDF request failed');

  const blob = await response.blob();
  cachedPdf = { key, blob };
  return blob;
}

function saveBlob(blob: Blob) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = PDF_FILENAME;
  anchor.click();
  URL.revokeObjectURL(url);
}

function useChecklistPdf(state: ChecklistState) {
  const [busy, setBusy] = useState<'download' | 'share' | null>(null);
  const [notice, setNotice] = useState('');

  const download = async () => {
    setBusy('download');
    setNotice('');
    try {
      saveBlob(await fetchPdf(state));
    } catch {
      window.location.assign(CHECKLIST_DOWNLOAD_PATH); // blank PDF fallback
    } finally {
      setBusy(null);
    }
  };

  // Phones: opens the share sheet with the PDF attached (pick WhatsApp).
  // Desktop browsers can't attach files to WhatsApp, so save the PDF instead.
  const share = async () => {
    setBusy('share');
    setNotice('');
    try {
      const blob = await fetchPdf(state);
      const file = new File([blob], PDF_FILENAME, { type: 'application/pdf' });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Getting ready for baby',
          text: 'My birth and confinement preparation checklist.',
        });
      } else {
        saveBlob(blob);
        setNotice('PDF saved to your device. Attach it in WhatsApp to share.');
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        setNotice('Sorry, we couldn’t prepare the PDF. Please try again.');
      }
    } finally {
      setBusy(null);
    }
  };

  return { busy, notice, download, share };
}

function ChecklistActions({ state }: { state: ChecklistState }) {
  const { busy, notice, download, share } = useChecklistPdf(state);

  return (
    <Stack spacing={1} alignItems="flex-start">
      <Stack direction="row" alignItems="center" flexWrap="wrap" sx={{ gap: 1.5 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={download}
          disabled={busy !== null}
          startIcon={<Iconify icon="solar:file-text-bold" />}
          sx={{ color: 'common.white', borderRadius: 999 }}
        >
          {busy === 'download' ? 'Preparing PDF...' : 'Download Printable Checklist'}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={share}
          disabled={busy !== null}
          startIcon={<Iconify icon="mdi:whatsapp" width={20} />}
          sx={{ borderRadius: 999, bgcolor: 'rgba(255,255,255,0.6)' }}
        >
          {busy === 'share' ? 'Preparing PDF...' : 'Share on WhatsApp'}
        </Button>
      </Stack>
      {notice && (
        <Typography variant="caption" color="text.secondary" role="status">
          {notice}
        </Typography>
      )}
    </Stack>
  );
}

function ShareCard({ state }: { state: ChecklistState }) {
  const { busy, notice, share } = useChecklistPdf(state);

  return (
    <Box sx={{ p: 3, borderRadius: 2, bgcolor: PANEL_BG }}>
      <Typography variant="h4" component="h2" sx={{ mb: 1 }}>
        Planning together?
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Share this checklist with your partner or family and decide who will handle each task.
      </Typography>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={share}
        disabled={busy !== null}
        startIcon={<Iconify icon="mdi:whatsapp" width={20} />}
        sx={{ color: 'common.white', borderRadius: 999 }}
      >
        {busy === 'share' ? 'Preparing PDF...' : 'Share on WhatsApp'}
      </Button>
      {notice && (
        <Typography variant="caption" color="text.secondary" role="status" sx={{ display: 'block', mt: 1 }}>
          {notice}
        </Typography>
      )}
    </Box>
  );
}

function ChecklistHero({ state }: { state: ChecklistState }) {
  return (
    <PageHero
      alt="Getting ready for baby"
      image={CHECKLIST_HERO_IMAGE}
      imagePosition="right center"
      mobileOverlap={56}
      background={HERO_BG}
      backgroundRgb={HERO_BG_RGB}
    >
      <Stack spacing={2} alignItems="flex-start" sx={{ maxWidth: { md: 520 } }}>
        <Typography
          variant="overline"
          sx={{ color: 'primary.main', letterSpacing: 1.5, fontWeight: 700 }}
        >
          Free planning resource
        </Typography>
        <Typography
          variant="h1"
          sx={{ color: 'grey.800', textWrap: 'balance', fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}
        >
          Confinement Checklist: Getting Ready for Baby
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: '1.1rem' }}>
          Your birth and confinement preparation checklist. A little planning now, one less thing to
          think about later.
        </Typography>
        <ChecklistActions state={state} />
        <Typography variant="caption" color="text.secondary">
          Read, save or share. No email required.
        </Typography>
      </Stack>
    </PageHero>
  );
}

// ----------------------------------------------------------------------

export function ChecklistView() {
  const [done, setDone] = useState<boolean[]>(() => Array<boolean>(CHECKLIST_ITEM_COUNT).fill(false));
  const [loaded, setLoaded] = useState(false);

  // Restore on mount (not in initial state, to keep server and client HTML
  // identical). Ticks live only in this browser.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
      if (Array.isArray(saved?.done)) {
        setDone(Array.from({ length: CHECKLIST_ITEM_COUNT }, (_, i) => saved.done[i] === true));
      }
    } catch {
      // Storage unavailable or corrupt: start blank.
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ done }));
    } catch {
      // Ignore: saving is a convenience only.
    }
  }, [done, loaded]);

  const state: ChecklistState = { done };

  // Build the PDF shortly after each change so Share can use it instantly.
  useEffect(() => {
    if (!loaded) return undefined;
    const timer = setTimeout(() => {
      fetchPdf({ done }).catch(() => {});
    }, 500);
    return () => clearTimeout(timer);
  }, [done, loaded]);

  const doneCount = done.filter(Boolean).length;

  const toggleItem = (index: number) =>
    setDone((prev) => prev.map((value, i) => (i === index ? !value : value)));

  // Flat index of each section's first item.
  const sectionOffsets = CHECKLIST_SECTIONS.map((_, i) =>
    CHECKLIST_SECTIONS.slice(0, i).reduce((sum, section) => sum + section.items.length, 0)
  );

  return (
    <>
      <ChecklistHero state={state} />

      <Container sx={{ py: { xs: 4, md: 6 } }}>
        <Box
          sx={{
            display: 'grid',
            gap: { xs: 4, md: 5 },
            alignItems: 'start',
            gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          }}
        >
          <Box>
            <Typography variant="h3" component="h2">
              Your before-baby checklist
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              For expecting parents and the people supporting them.
              {doneCount > 0 && ` ${doneCount} of ${CHECKLIST_ITEM_COUNT} done.`}
            </Typography>

            <Stack spacing={2}>
              {CHECKLIST_SECTIONS.map((section, index) => (
                <Box
                  key={section.title}
                  component="section"
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1.5,
                    overflow: 'hidden',
                    breakInside: 'avoid',
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    sx={{ px: 2, py: 1.25, bgcolor: PANEL_BG }}
                  >
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        color: 'common.white',
                        typography: 'caption',
                        fontWeight: 700,
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Typography variant="subtitle1" component="h3">
                      {section.title}
                    </Typography>
                  </Stack>

                  <Stack sx={{ px: 2, py: 1 }}>
                    {section.items.map((item, itemIndex) => (
                      <FormControlLabel
                        key={item}
                        control={
                          <Checkbox
                            size="small"
                            color="primary"
                            checked={done[sectionOffsets[index] + itemIndex] ?? false}
                            onChange={() => toggleItem(sectionOffsets[index] + itemIndex)}
                          />
                        }
                        label={<Typography variant="body2">{item}</Typography>}
                      />
                    ))}
                  </Stack>
                </Box>
              ))}
            </Stack>

            <Box sx={{ mt: 3 }}>
              <ChecklistActions state={state} />
            </Box>
          </Box>

          <Stack spacing={3}>
            <ShareCard state={state} />

            <Box sx={{ p: 3, borderRadius: 2, bgcolor: PANEL_BG }}>
              <Typography variant="h4" component="h2" sx={{ mb: 1 }}>
                One step at a time
              </Typography>
              <Typography color="text.secondary">
                You don’t need to have everything perfect. Start with the essentials and ask for
                help.
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Container>

      <Box sx={{ pb: { xs: 5, md: 8 } }}>
        <CompareBanner
          title="Have your confinement meals taken care of"
          description="Explore our trial meal and meal packages while you plan ahead."
          image="/dishes/OneDrive_2_9-24-2026/TrialMeal.jpg"
          imageAlt="Confinement trial meal set"
          action={{ label: 'Explore Trial Meal', href: paths.trialMeal }}
          secondaryAction={{ label: 'Compare Packages', href: paths.comparePackages }}
        />
      </Box>
    </>
  );
}

'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import { RECOVERY_FAQS } from './recovery-data';

// ----------------------------------------------------------------------

// Question cards use the same look as the main FAQ page
// (src/sections/faqs/faqs-view.tsx), without the category bar.
const BORDER = alpha('#1f2937', 0.08);

export function RecoveryFaq() {
  const [openQuestion, setOpenQuestion] = useState<string | false>(false);

  return (
    <Box sx={{ mx: 'auto', maxWidth: 860 }}>
      <Typography
        variant="h2"
        component="h2"
        sx={{ mb: { xs: 3, md: 4 }, color: 'primary.main', textAlign: 'center' }}
      >
        Frequently asked questions
      </Typography>

      <Box sx={{ display: 'grid', gap: 0.85 }}>
        {RECOVERY_FAQS.map((faq) => {
          const isOpen = openQuestion === faq.question;

          return (
            <Accordion
              key={faq.question}
              disableGutters
              expanded={isOpen}
              onChange={(_, expanded) => setOpenQuestion(expanded ? faq.question : false)}
              sx={{
                borderRadius: '12px !important',
                border: '1px solid',
                borderColor: BORDER,
                backgroundColor: '#ffffff',
                boxShadow: isOpen ? '0 8px 18px rgba(15, 23, 42, 0.05)' : 'none',
                '&::before': { display: 'none' },
              }}
            >
              <AccordionSummary
                expandIcon={null}
                sx={{
                  px: 0,
                  minHeight: 56,
                  '&.Mui-expanded': { minHeight: 56 },
                  '& .MuiAccordionSummary-content': {
                    my: 0,
                    width: '100%',
                    '&.Mui-expanded': { my: 0 },
                  },
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    pl: { xs: 2, md: 2.25 },
                    pr: { xs: 1.75, md: 2 },
                    py: 1.35,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                      fontSize: { xs: '0.98rem', md: '1rem' },
                      lineHeight: 1.45,
                    }}
                  >
                    {faq.question}
                  </Typography>

                  <ExpandMoreIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                </Box>
              </AccordionSummary>

              <AccordionDetails sx={{ p: 0 }}>
                <Box sx={{ px: { xs: 2, md: 2.25 }, pt: 0, pb: 2.25 }}>
                  <Typography
                    color="text.secondary"
                    sx={{ lineHeight: 1.8, fontSize: { xs: '0.98rem', md: '1rem' } }}
                  >
                    {faq.answer}
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    </Box>
  );
}

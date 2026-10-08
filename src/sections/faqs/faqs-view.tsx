'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { alpha } from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import { faqCategories } from './faqs-data';

// ----------------------------------------------------------------------

const CATEGORY_BG = '#f7c1cc';

export function FaqsView() {
  const [expandedCategory, setExpandedCategory] = useState<string | false>(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, string | false>>(() =>
    Object.fromEntries(faqCategories.map((category) => [category.category, false]))
  );

  return (
    <Box component="section" sx={{ py: { xs: 6, md: 7 }, backgroundColor: '#ffffff' }}>
      <Container maxWidth="lg">
        <Box sx={{ mx: 'auto', maxWidth: 860 }}>
          <Typography
            variant="h2"
            sx={{ mb: { xs: 3, md: 4 }, color: 'primary.main', textAlign: 'center' }}
          >
            Frequently asked questions
          </Typography>

          <Box sx={{ display: 'grid', gap: 1.25 }}>
            {faqCategories.map((category) => {
              const isExpanded = expandedCategory === category.category;

              return (
                <Accordion
                  key={category.id}
                  disableGutters
                  expanded={isExpanded}
                  onChange={(_, expanded) =>
                    setExpandedCategory(expanded ? category.category : false)
                  }
                  sx={{
                    borderRadius: '12px !important',
                    overflow: 'hidden',
                    boxShadow: 'none',
                    border: 'none',
                    backgroundColor: 'transparent',
                    '&::before': { display: 'none' },
                  }}
                >
                  <AccordionSummary
                    expandIcon={null}
                    aria-controls={`faq-category-${category.id}-content`}
                    id={`faq-category-${category.id}-header`}
                    sx={{
                      px: 0,
                      minHeight: { xs: 40, md: 44 },
                      borderRadius: 2.5,
                      backgroundColor: CATEGORY_BG,
                      '&.Mui-expanded': {
                        minHeight: { xs: 40, md: 44 },
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                      },
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
                        pl: { xs: 3, md: 3.5 },
                        pr: { xs: 2.25, md: 2.75 },
                        py: { xs: 0.9, md: 1.05 },
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: 'text.primary',
                          fontSize: { xs: '0.96rem', md: '1rem' },
                        }}
                      >
                        {category.category}
                      </Typography>

                      <ExpandMoreIcon sx={{ color: 'text.primary', fontSize: 22 }} />
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails sx={{ p: 0, backgroundColor: 'transparent' }}>
                    <Box
                      sx={{
                        p: { xs: 1.25, md: 1.35 },
                        border: '1px solid',
                        borderColor: alpha('#1f2937', 0.08),
                        borderTop: 'none',
                        borderBottomLeftRadius: 2.5,
                        borderBottomRightRadius: 2.5,
                        backgroundColor: 'common.white',
                        boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)',
                      }}
                    >
                      <Box sx={{ display: 'grid', gap: 0.85 }}>
                        {category.questions.map((question) => (
                          <Accordion
                            key={question.id}
                            disableGutters
                            expanded={expandedQuestions[category.category] === question.id}
                            onChange={(_, expanded) =>
                              setExpandedQuestions((prev) => ({
                                ...prev,
                                [category.category]: expanded ? question.id : false,
                              }))
                            }
                            sx={{
                              borderRadius: '12px !important',
                              border: '1px solid',
                              borderColor: alpha('#1f2937', 0.08),
                              backgroundColor: '#ffffff',
                              boxShadow:
                                expandedQuestions[category.category] === question.id
                                  ? '0 8px 18px rgba(15, 23, 42, 0.05)'
                                  : 'none',
                              '&::before': { display: 'none' },
                            }}
                          >
                            <AccordionSummary
                              expandIcon={null}
                              aria-controls={`${question.value}-content`}
                              id={`${question.value}-header`}
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
                                  {question.heading}
                                </Typography>

                                <ExpandMoreIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                              </Box>
                            </AccordionSummary>

                            <AccordionDetails sx={{ p: 0 }}>
                              <Box sx={{ px: { xs: 2, md: 2.25 }, pt: 0, pb: 2.25 }}>
                                {question.detailLink ? (
                                  <Box>
                                    <Typography
                                      color="text.secondary"
                                      sx={{
                                        lineHeight: 1.8,
                                        whiteSpace: 'pre-line',
                                        fontSize: { xs: '0.98rem', md: '1rem' },
                                      }}
                                    >
                                      {question.detail}
                                    </Typography>
                                    <Link
                                      href={question.detailLink.href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      underline="none"
                                      sx={{
                                        mt: 1.25,
                                        display: 'inline-flex',
                                        color: 'primary.main',
                                        fontWeight: 700,
                                      }}
                                    >
                                      {question.detailLink.label}
                                    </Link>
                                  </Box>
                                ) : (
                                question.detail ? (
                                  <Typography
                                    color="text.secondary"
                                    sx={{
                                      lineHeight: 1.8,
                                      whiteSpace: 'pre-line',
                                      fontSize: { xs: '0.98rem', md: '1rem' },
                                    }}
                                  >
                                    {question.detail}
                                  </Typography>
                                ) : null
                                )}
                              </Box>
                            </AccordionDetails>
                          </Accordion>
                        ))}
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

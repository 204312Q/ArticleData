import type { LegalDocument } from './legal-data';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export function LegalDocumentView({ doc }: { doc: LegalDocument }) {
  return (
    <Box component="section" sx={{ py: { xs: 6, md: 7 }, backgroundColor: '#ffffff' }}>
      <Container maxWidth="lg">
        <Box sx={{ mx: 'auto', maxWidth: 860 }}>
          <Typography variant="h2" sx={{ mb: 3, color: 'primary.main', textAlign: 'center' }}>
            {doc.title}
          </Typography>

          {doc.intro.map((paragraph, index) => (
            <Typography
              key={index}
              variant="body1"
              sx={{ mb: 3, color: 'text.secondary', lineHeight: 1.8, whiteSpace: 'pre-line' }}
            >
              {paragraph}
            </Typography>
          ))}

          {doc.sections.map((section) => (
            <Box key={section.heading} sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 1.5, color: 'primary.main' }}>
                {section.heading}
              </Typography>

              <Box
                component="ol"
                sx={{ m: 0, pl: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}
              >
                {section.items.map((item, index) => (
                  <Box component="li" key={index} sx={{ color: 'text.secondary' }}>
                    <Typography
                      component="span"
                      variant="body1"
                      sx={{ lineHeight: 1.8, whiteSpace: 'pre-line' }}
                    >
                      {item.text}
                    </Typography>

                    {item.subItems && (
                      <Box
                        component="ol"
                        sx={{
                          m: 0,
                          mt: 1,
                          pl: 3,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                          listStyleType: 'lower-alpha',
                        }}
                      >
                        {item.subItems.map((subItem, subIndex) => (
                          <Box component="li" key={subIndex}>
                            <Typography component="span" variant="body1" sx={{ lineHeight: 1.8 }}>
                              {subItem}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          ))}

          <Typography variant="body2" sx={{ color: 'text.disabled' }}>
            {doc.effectiveDate && (
              <>
                Effective date: {doc.effectiveDate}
                <br />
              </>
            )}
            Last updated: {doc.lastUpdated}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

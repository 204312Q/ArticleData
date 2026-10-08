import Image from 'next/image';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { BackToTopButton } from 'src/components/animate/back-to-top-button';

import { HomeHero } from './home-hero';
import { SectionHeading } from './section-heading';
import { HomeBenefitCarousel } from './home-benefit-carousel';
import { HomeFeatureCarousel } from './home-feature-carousel';
import { HomePackageCarousel } from './home-package-carousel';
import { HomePopularDishesCarousel } from './home-popular-dishes-carousel';
import {
  heroBanners,
  packageCards,
  benefitCards,
  featureCards,
  partnerLogos,
  popularDishes,
  orderStepImages,
  HERO_GUTTER_COLOR,
} from './home-data';

// ----------------------------------------------------------------------

export function HomeView() {
  return (
    <>
      <HomeHero data={heroBanners} />

      <Box
        sx={{
          // Starts fully opaque at HERO_GUTTER_COLOR — the exact color
          // HomeHero fills its own gutters with — so the two sections meet
          // with no visible seam, then fades to white.
          background: `linear-gradient(180deg, ${HERO_GUTTER_COLOR} 0%, rgba(255, 255, 255, 0.96) 16%, rgba(255, 255, 255, 1) 36%)`,
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 7, md: 10 } }}>
          <Stack spacing={{ xs: 8, md: 10 }}>
            <Box component="section">
              <SectionHeading
                title="Top 3 Selling Packages"
                description="Choose from our best-loved meal packages designed to support different recovery timelines and routines."
              />

              <HomePackageCarousel items={packageCards} />

              <Box
                sx={{
                  mt: 5,
                  gap: 3,
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  display: { xs: 'none', md: 'grid' },
                }}
              >
                {packageCards.map((item) => (
                  <Card key={item.id} sx={{ p: 1.5, borderRadius: 4 }}>
                    <Box sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden', aspectRatio: '1 / 1' }}>
                      <Image fill alt={item.alt} src={item.image} style={{ objectFit: 'cover' }} />
                    </Box>

                    <Stack spacing={1} sx={{ p: 2.5, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                      <Typography variant="h5">{item.name}</Typography>
                      <Typography variant="body1" color="text.secondary">
                        {item.price}
                      </Typography>
                    </Stack>
                  </Card>
                ))}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <Button
                  variant="contained"
                  href={paths.product.root}
                  sx={{ minWidth: 240, color: 'common.white' }}
                >
                  Order Now
                </Button>
              </Box>
            </Box>

            <Box component="section">
              <SectionHeading
                title="Why Choose Us?"
                description="From nutrition to delivery reliability, every meal is prepared to give new mums one less thing to worry about."
              />

              <HomeBenefitCarousel items={benefitCards} />

              <Box
                sx={{
                  mt: 5,
                  gap: 3,
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gridAutoRows: '1fr',
                  display: { xs: 'none', md: 'grid' },
                }}
              >
                {benefitCards.map((item, index) => {
                  const isFeatured = index === 0;

                  return (
                    <Card
                      key={item.id}
                      sx={{
                        p: 1.5,
                        borderRadius: 4,
                        display: 'flex',
                        flexDirection: isFeatured ? 'column' : 'row',
                        alignItems: 'stretch',
                        gap: isFeatured ? 0 : 2.5,
                        ...(isFeatured && { gridRow: 'span 2' }),
                      }}
                    >
                      <Box
                        sx={{
                          position: 'relative',
                          flexShrink: 0,
                          borderRadius: 3,
                          overflow: 'hidden',
                          backgroundColor: 'grey.100',
                          // Non-featured cards share one fixed square ratio (rather than
                          // each item's own imageWidth/imageHeight) so the two stacked
                          // cards' image columns line up instead of each sizing to its
                          // own photo; sized slightly smaller than the row so it doesn't
                          // touch the card's top/bottom edges.
                          aspectRatio: isFeatured ? `${item.imageWidth} / ${item.imageHeight}` : '1 / 1',
                          ...(isFeatured
                            ? { width: '100%' }
                            : { height: '92%', alignSelf: 'center' }),
                        }}
                      >
                        <Image fill alt={item.alt} src={item.image} style={{ objectFit: 'cover' }} />
                      </Box>

                      <Stack spacing={1.5} sx={{ p: isFeatured ? 2.5 : 0, flex: isFeatured ? undefined : 1 }}>
                        <Typography variant="h5">{item.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.description}
                        </Typography>
                      </Stack>
                    </Card>
                  );
                })}
              </Box>

            </Box>
            <Box component="section">
              <SectionHeading title="Partners" />


              <Box
                sx={{
                  display: 'grid',
                  gap: 3,
                  mt: 5,
                  mb: 4,
                  alignItems: 'center',
                  justifyItems: 'center',
                  gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
                }}
              >
                {partnerLogos.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      position: 'relative',
                      width: { xs: 120, sm: 140, md: 160 },
                      height: { xs: 72, sm: 84, md: 96 },
                    }}
                  >
                    <Image fill alt={item.alt} src={item.src} style={{ objectFit: 'contain' }} />
                  </Box>
                ))}
              </Box>
            </Box>

            <Box component="section">
              <Box
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 5,
                  minHeight: { xs: 320, md: 460 },
                }}
              >
                <Image
                  fill
                  alt="Confinement menu"
                  src="/assets/background/Confinement_menu.jpg"
                  style={{ objectFit: 'cover' }}
                />

                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(90deg, rgba(44, 45, 47, 0.55) 0%, rgba(44, 45, 47, 0.18) 60%, rgba(44, 45, 47, 0.08) 100%)',
                  }}
                />

                <Stack
                  spacing={2}
                  sx={{
                    position: 'absolute',
                    left: { xs: 24, md: 40 },
                    bottom: { xs: 24, md: 40 },
                    maxWidth: 440,
                    color: 'common.white',
                  }}
                >
                  <Typography variant="overline" sx={{ color: 'common.white' }}>
                    Weekly Menu
                  </Typography>
                  <Typography variant="h2" sx={{ color: 'common.white' }}>
                    Explore the dishes mums look forward to every day.
                  </Typography>
                  <Button
                    variant="contained"
                    href={paths.menu}
                    sx={{ width: 'fit-content', color: 'common.white' }}
                  >
                    View Menu
                  </Button>
                </Stack>
              </Box>
            </Box>

            <Box component="section">
              <SectionHeading
                title="More For Mum & Family"
                description="Beyond meals, we also bring together services and gifting options that make the postpartum season easier to manage."
              />

              <HomeFeatureCarousel items={featureCards} />

              <Box
                sx={{
                  mt: 5,
                  gap: 3,
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  display: { xs: 'none', md: 'grid' },
                }}
              >
                {featureCards.map((item) => (
                  <Card key={item.id} sx={{ p: 1.5, display: 'flex', flexDirection: 'column', borderRadius: 4 }}>
                    <Box sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden', aspectRatio: '1 / 1' }}>
                      <Image fill alt={item.alt} src={item.image} style={{ objectFit: 'cover' }} />
                    </Box>

                    <Stack spacing={1.5} sx={{ p: 2.5, flex: '1 1 auto' }}>
                      <Typography variant="h5">{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ flex: '1 1 auto' }}>
                        {item.description}
                      </Typography>
                      <Button
                        variant="contained"
                        href={item.url}
                        sx={{ alignSelf: 'center', minWidth: 220, color: 'common.white' }}
                      >
                        View More
                      </Button>
                    </Stack>
                  </Card>
                ))}
              </Box>
            </Box>

            <Box component="section">
              <SectionHeading
                title="Our Popular Dishes"
                description="A look at the nourishing favourites that make our confinement menu both comforting and practical for recovery."
              />

              <HomePopularDishesCarousel items={popularDishes} />

              <Box
                sx={{
                  mt: 5,
                  gap: 3,
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  display: { xs: 'none', md: 'grid' },
                }}
              >
                {popularDishes.map((item) => (
                  <Card key={item.id} sx={{ overflow: 'hidden', borderRadius: 4 }}>
                    <Box sx={{ position: 'relative', aspectRatio: '1 / 1' }}>
                      <Image fill alt={item.alt} src={item.image} style={{ objectFit: 'cover' }} />
                    </Box>

                    <Stack spacing={1.25} sx={{ p: 2.5 }}>
                      <Typography variant="h5">{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                      <Typography variant="subtitle2" color="primary.main">
                        {item.chineseName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.chineseDescription}
                      </Typography>
                    </Stack>
                  </Card>
                ))}
              </Box>
            </Box>

            <Box component="section">
              <SectionHeading
                title="What's the next step?"
              />

              <Box
                sx={{
                  mt: 5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: { xs: 3, md: 0 },
                }}
              >
                {orderStepImages.map((image, index) => (
                  <Box
                    key={image}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      flexDirection: { xs: 'column', md: 'row' },
                    }}
                  >
                    <Card
                      sx={{
                        p: 1,
                        borderRadius: 4,
                        boxShadow: '0 24px 44px rgba(109, 110, 113, 0.12)',
                      }}
                    >
                      <Box
                        sx={{
                          position: 'relative',
                          width: { xs: 270, md: 310 },
                          aspectRatio: '4 / 5',
                        }}
                      >
                        <Image fill alt={`Step ${index + 1}`} src={image} style={{ objectFit: 'cover' }} />
                      </Box>
                    </Card>

                    {index < orderStepImages.length - 1 && (
                      <Box
                        sx={{
                          width: { xs: 6, md: 88 },
                          height: { xs: 44, md: 6 },
                          backgroundColor: 'primary.main',
                          borderRadius: 999,
                        }}
                      />
                    )}
                  </Box>
                ))}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8, mb: { xs: 5, md: 5 } }}>
                <Button
                  variant="contained"
                  href={paths.product.root}
                  sx={{ minWidth: 240, color: 'common.white' }}
                >
                  Order Now
                </Button>
              </Box>
            </Box>
          </Stack>
        </Container>
      </Box>

      <BackToTopButton color="primary" />
    </>
  );
}

'use client';

import type { BenefitArticle, BenefitIngredient } from './benefits-data';

import Image from 'next/image';
import { useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Container from '@mui/material/Container';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

import { BenefitsHero } from './benefits-hero';
import { BenefitIcon } from './benefits-icons';
import { benefitCategories } from './benefits-data';

// ----------------------------------------------------------------------

function ViewMenuButton() {
  return (
    <Button
      variant="contained"
      color="primary"
      href={paths.menu}
      endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
      sx={{ color: 'common.white', borderRadius: 999, width: 'fit-content' }}
    >
      View Full Menu
    </Button>
  );
}

function IngredientTiles({
  ingredients,
  size,
}: {
  ingredients: BenefitIngredient[];
  size: number;
}) {
  return (
    <Stack direction="row" flexWrap="wrap" gap={{ xs: 1.5, md: 2 }}>
      {ingredients.map((item) => (
        <Stack key={item.name} spacing={0.75} alignItems="center" sx={{ width: size }}>
          <Box
            sx={{
              width: size,
              height: size,
              position: 'relative',
              borderRadius: 1.5,
              overflow: 'hidden',
              bgcolor: 'common.white',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Image
              fill
              alt={item.name}
              src={item.image}
              sizes={`${size}px`}
              style={{ objectFit: 'cover' }}
            />
          </Box>
          <Typography variant="caption" sx={{ textAlign: 'center', lineHeight: 1.2 }}>
            {item.name}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

function ArticleLinks({ articles }: { articles: BenefitArticle[] }) {
  return (
    <Stack spacing={0.75}>
      <Typography variant="subtitle2">Related reading</Typography>
      {articles.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          color="primary"
          underline="always"
          sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, typography: 'body2' }}
        >
          <BenefitIcon name="article" sx={{ width: 18, height: 18, flexShrink: 0 }} />
          {item.label}
        </Link>
      ))}
    </Stack>
  );
}

export function BenefitsView() {
  const [activeId, setActiveId] = useState(benefitCategories[0].id);
  const panelRef = useRef<HTMLDivElement>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const active = benefitCategories.find((c) => c.id === activeId) ?? benefitCategories[0];
  const others = benefitCategories.filter((c) => c.id !== activeId);

  return (
    <>
      <BenefitsHero />

      {/* Category picker */}
      <Container sx={{ py: { xs: 5, md: 7 } }}>
        <Typography variant="h3" sx={{ textAlign: 'center', mb: 3 }}>
          What would you like to explore?
        </Typography>

        <Box
          role="tablist"
          sx={{
            gap: { xs: 1.5, sm: 2 },
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          }}
        >
          {benefitCategories.map((cat) => {
            const selected = cat.id === activeId;
            return (
              <ButtonBase
                key={cat.id}
                role="tab"
                aria-selected={selected}
                onClick={() => {
                  setActiveId(cat.id);
                  // Phones: bring the chosen category's content into view so the tap has a visible result.
                  if (window.matchMedia('(max-width: 599.95px)').matches) {
                    panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                sx={{
                  gap: { xs: 1, sm: 2 },
                  py: { xs: 1.5, sm: 2 },
                  px: { xs: 1.5, sm: 3 },
                  borderRadius: 1.5,
                  border: '1px solid',
                  borderColor: 'primary.main',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'flex-start',
                  textAlign: { xs: 'center', sm: 'left' },
                  typography: { xs: 'subtitle2', sm: 'subtitle1' },
                  color: selected ? 'common.white' : 'primary.main',
                  bgcolor: selected ? 'primary.main' : 'common.white',
                }}
              >
                <BenefitIcon
                  name={cat.icon}
                  sx={{ width: { xs: 30, sm: 32 }, height: { xs: 30, sm: 32 }, flexShrink: 0 }}
                />
                {cat.title}
              </ButtonBase>
            );
          })}
        </Box>

        {/* Active category panel */}
        <Box
          ref={panelRef}
          role="tabpanel"
          sx={{
            mt: 4,
            p: { xs: 2, md: 3 },
            borderRadius: 3,
            bgcolor: '#FDE8EC',
            scrollMarginTop: { xs: 80, md: 0 },
          }}
        >
          <Box
            sx={{
              gap: 3,
              mb: 3,
              display: 'grid',
              alignItems: 'center',
              gridTemplateColumns: { xs: '1fr', md: '1.4fr 1fr' },
            }}
          >
            <Stack direction="row" spacing={2.5} alignItems="center">
              <BenefitIcon
                name={active.icon}
                sx={{ width: 64, height: 64, color: 'primary.main', flexShrink: 0 }}
              />
              <Stack spacing={1}>
                <Typography variant="h3" sx={{ color: 'primary.main' }}>
                  {active.title}
                </Typography>
                <Typography color="text.secondary">{active.summary}</Typography>
              </Stack>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="subtitle2">Key ingredients in this category</Typography>
              <IngredientTiles ingredients={active.ingredients} size={88} />
            </Stack>
          </Box>

          <Box
            sx={{
              gap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            }}
          >
            {active.dishes.map((dish) => (
              <Card
                key={dish.name}
                sx={{
                  p: 1,
                  gap: 2,
                  display: 'flex',
                  borderRadius: 2,
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    flexShrink: 0,
                    borderRadius: 1.5,
                    overflow: 'hidden',
                    width: { xs: 1, sm: 200 },
                    aspectRatio: { xs: '4 / 3', sm: '1 / 1' },
                  }}
                >
                  <Image
                    fill
                    alt={dish.name}
                    src={dish.image}
                    sizes="(max-width: 600px) 100vw, 200px"
                    style={{ objectFit: 'cover' }}
                  />
                </Box>
                <Stack spacing={1} justifyContent="center" sx={{ p: 1 }}>
                  <Typography variant="h6">{dish.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dish.description}
                  </Typography>
                </Stack>
              </Card>
            ))}
          </Box>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
            justifyContent="space-between"
            sx={{ mt: 3 }}
          >
            <ArticleLinks articles={active.articles} />
            <ViewMenuButton />
          </Stack>
        </Box>

        {/* Other categories */}
        <Typography variant="h4" sx={{ mt: 6, mb: 2 }}>
          Discover more ways to nourish
        </Typography>

        <Stack spacing={1.5}>
          {others.map((cat) => {
            const open = openId === cat.id;
            return (
              <Box
                key={cat.id}
                sx={{
                  borderRadius: 1.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  overflow: 'hidden',
                }}
              >
                <ButtonBase
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? null : cat.id)}
                  sx={{ p: 2, gap: 2, width: 1, textAlign: 'left', justifyContent: 'flex-start' }}
                >
                  <BenefitIcon
                    name={cat.icon}
                    sx={{ width: 28, height: 28, color: 'primary.main', flexShrink: 0 }}
                  />
                  <Typography variant="subtitle1" sx={{ minWidth: { md: 240 } }}>
                    {cat.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' } }}
                  >
                    {cat.summary}
                  </Typography>
                  <Iconify
                    icon="eva:arrow-ios-downward-fill"
                    sx={{
                      ml: 'auto',
                      color: 'primary.main',
                      flexShrink: 0,
                      transition: 'transform 0.2s',
                      transform: open ? 'rotate(180deg)' : 'none',
                    }}
                  />
                </ButtonBase>

                <Collapse in={open} unmountOnExit>
                  <Stack spacing={2} sx={{ px: 2, pb: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: { md: 'none' } }}
                    >
                      {cat.summary}
                    </Typography>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2">Key ingredients</Typography>
                      <IngredientTiles ingredients={cat.ingredients} size={56} />
                    </Stack>
                    <ArticleLinks articles={cat.articles} />
                    <Button
                      size="small"
                      color="primary"
                      sx={{ alignSelf: 'flex-start' }}
                      onClick={() => {
                        setActiveId(cat.id);
                        setOpenId(null);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      See dishes
                    </Button>
                  </Stack>
                </Collapse>
              </Box>
            );
          })}
        </Stack>
      </Container>

      {/* CTA */}
      <Container sx={{ pb: { xs: 5, md: 8 } }}>
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 3,
            bgcolor: '#F9D0DB',
            display: 'flex',
            flexDirection: 'column',
            minHeight: { md: 300 },
          }}
        >
          <Box
            sx={{
              order: 2,
              position: { xs: 'relative', md: 'absolute' },
              inset: { md: 0 },
              height: { xs: 180, sm: 240, md: 'auto' },
            }}
          >
            <Image
              fill
              alt="Fried noodles in a bowl"
              src="/banners/Benefits/Pink Gradient Noodle Bowl Banner.png"
              sizes="(max-width: 1200px) 100vw, 1200px"
              style={{ objectFit: 'cover', objectPosition: '75% center' }}
            />
            <Box
              sx={{
                display: { md: 'none' },
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '45%',
                pointerEvents: 'none',
                background: 'linear-gradient(to bottom, #F9D0DB, rgba(249, 208, 219, 0))',
              }}
            />
          </Box>

          <Stack
            spacing={2}
            alignItems="flex-start"
            justifyContent="center"
            sx={{
              p: { xs: 3, md: 6 },
              zIndex: 1,
              position: 'relative',
              maxWidth: { md: 520 },
              flexGrow: { md: 1 },
            }}
          >
            <Typography
              variant="h2"
              sx={{ color: 'primary.main', fontSize: { xs: '1.75rem', md: '2.5rem' }, textWrap: 'balance' }}
            >
              One less thing to plan
            </Typography>
            <Typography color="text.secondary">
              Let us take care of the meals, so you have more time to rest.
            </Typography>
            <ViewMenuButton />
          </Stack>
        </Box>

        {/* <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mt: 3, textAlign: 'center' }}
        >
          {BENEFITS_DISCLAIMER}
        </Typography> */}
      </Container>
    </>
  );
}

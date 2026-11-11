import type { ComparePackageColumn } from './compare-packages-data';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { PageHero } from 'src/components/page-hero';

import { CompareBanner } from './compare-banner';
import { formatPrice, formatPricePerMeal } from './compare-packages-data';

// ----------------------------------------------------------------------

const HEADER_BG = '#FDE8EC';
const ZEBRA_BG = '#FEF4F6';

type CellProps = {
  children?: React.ReactNode;
  bgcolor?: string;
  header?: boolean;
};

function Cell({ children, bgcolor, header }: CellProps) {
  return (
    <Box
      role={header ? 'columnheader' : 'cell'}
      sx={{
        px: { xs: 0.5, sm: 2 },
        py: { xs: 1.5, sm: 1.75 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        bgcolor,
        typography: { xs: 'body2', sm: 'body1' },
        ...(header && { typography: 'h6', color: 'primary.main' }),
      }}
    >
      {children}
    </Box>
  );
}

type CompareTableProps = {
  columns: ComparePackageColumn[];
};

function CompareTable({ columns }: CompareTableProps) {
  // `short*` variants are shown on phones so every row fits on one line.
  const rows = [
    {
      label: 'Meals per day',
      shortLabel: 'Meals/day',
      values: columns.map(() => 'Lunch + dinner'),
      shortValues: columns.map(() => '2 meals'),
    },
    { label: 'Total meals', values: columns.map((col) => String(col.totalMeals)) },
    {
      label: 'Package price',
      shortLabel: 'Package',
      values: columns.map((col) => formatPrice(col.price)),
    },
    {
      label: 'Price per meal',
      shortLabel: 'Per meal',
      values: columns.map((col) => formatPricePerMeal(col.pricePerMeal)),
    },
  ];

  const responsive = (full: string, short?: string) =>
    short ? (
      <>
        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
          {full}
        </Box>
        <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
          {short}
        </Box>
      </>
    ) : (
      full
    );

  return (
    <Box
      role="table"
      aria-label="Dual meal package comparison"
      sx={{
        display: 'grid',
        gridTemplateColumns: `minmax(84px, 1.1fr) repeat(${columns.length}, 1fr)`,
        borderRadius: 3,
        overflow: 'hidden',
        bgcolor: 'common.white',
        boxShadow: '0 8px 24px rgba(145, 158, 171, 0.16)',
        '& > [role="cell"], & > [role="columnheader"], & > [role="rowheader"]': {
          borderLeft: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Cell header bgcolor={HEADER_BG} />
      {columns.map((col) => (
        <Cell key={col.id} header bgcolor={HEADER_BG}>
          {col.label}
        </Cell>
      ))}

      {rows.map((row, index) => {
        const bg = index % 2 === 1 ? ZEBRA_BG : 'common.white';

        return [
          <Box
            key={`${row.label}-label`}
            role="rowheader"
            sx={{
              px: { xs: 1, sm: 3 },
              py: { xs: 1.5, sm: 1.75 },
              display: 'flex',
              alignItems: 'center',
              bgcolor: bg,
              typography: { xs: 'subtitle2', sm: 'subtitle1' },
              fontWeight: 500,
              borderLeft: 'none !important',
            }}
          >
            {responsive(row.label, row.shortLabel)}
          </Box>,
          ...row.values.map((value, colIndex) => (
            <Cell key={`${row.label}-${columns[colIndex].id}`} bgcolor={bg}>
              {responsive(value, row.shortValues?.[colIndex])}
            </Cell>
          )),
        ];
      })}

      <Box role="cell" sx={{ borderLeft: 'none !important' }} />
      {columns.map((col) => (
        <Box
          key={`${col.id}-order`}
          role="cell"
          sx={{ p: { xs: 0.75, sm: 2 }, display: 'flex', alignItems: 'center' }}
        >
          <Button
            fullWidth
            variant="contained"
            color="primary"
            href={paths.product.root}
            aria-label={`Order ${col.label} dual meal package`}
            sx={{
              color: 'common.white',
              borderRadius: 1.5,
              px: { xs: 0.5, sm: 2 },
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            }}
          >
            Order Now
          </Button>
        </Box>
      ))}
    </Box>
  );
}

type ComparePackagesViewProps = {
  columns: ComparePackageColumn[];
};

export function ComparePackagesView({ columns }: ComparePackagesViewProps) {
  return (
    <>
      <PageHero
        alt="Confinement dishes"
        image="/banners/Compare-Packages/Pastel Blossom Feast with Traditional Bowls.png"
        imagePosition="right center"
        mobileOverlap={56}
        background="#FDEBF2"
        backgroundRgb="253, 235, 242"
      >
        <Stack spacing={2} alignItems="flex-start" sx={{ maxWidth: { md: 460 } }}>
          <Typography
            variant="h1"
            sx={{ color: 'grey.800', textWrap: 'balance', fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}
          >
            Find the right meal plan for you
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: '1.1rem' }}>
            Compare our packages at a glance.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            href={paths.product.root}
            sx={{ color: 'common.white', borderRadius: 999 }}
          >
            Order Now
          </Button>
        </Stack>
      </PageHero>

      <Container sx={{ py: { xs: 5, md: 8 } }}>
        <Stack spacing={1} sx={{ textAlign: 'center', mb: { xs: 3, md: 5 } }}>
          <Typography variant="h3" component="h2">
            Compare dual meal packages
          </Typography>
          <Typography color="text.secondary">Lunch and dinner, delivered daily.</Typography>
        </Stack>

        {columns.length > 0 ? (
          <CompareTable columns={columns} />
        ) : (
          <Typography color="text.secondary" sx={{ textAlign: 'center' }}>
            Package prices are unavailable right now. Please view our{' '}
            <a href={paths.product.root}>meal packages</a> instead.
          </Typography>
        )}

        <Stack spacing={1.5} alignItems="center" sx={{ textAlign: 'center', mt: { xs: 5, md: 7 } }}>
          <Typography variant="h4" component="h2">
            Need help before you order?
          </Typography>
          <Typography color="text.secondary">
            Find answers about starting your meals, delivery and dietary requests.
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            href={paths.faqs}
            sx={{ borderRadius: 999, px: 4 }}
          >
            View FAQs
          </Button>
        </Stack>
      </Container>

      <Stack spacing={{ xs: 3, md: 5 }} sx={{ pb: { xs: 5, md: 8 } }}>
      <CompareBanner
        title="Not ready to choose a package?"
        description="Try our meals first. Enjoy the same nourishing recipes and quality ingredients in a smaller set to experience our cuisine."
        image="/dishes/OneDrive_2_9-24-2026/TrialMeal.jpg"
        imageAlt="Trial meal set"
        action={{ label: 'Explore Trial Meal', href: paths.trialMeal }}
      />

      <CompareBanner
        title="Ready to plan your meals?"
        description="Choose a package and let us take care of your confinement meals."
        image="/dishes/OneDrive_3_9-24-2026/Group Shot_2.jpg"
        imageAlt="Confinement meal spread"
        imagePosition="50% 70%"
        reverse
        blend
        background="#F9D0DB"
        backgroundRgb="249, 208, 219"
        action={{ label: 'Order Now', href: paths.product.root }}
      />
      </Stack>
    </>
  );
}

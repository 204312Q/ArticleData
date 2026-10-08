import type { ProductBundle, PackageCategory } from './product-data';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { companyInfo } from 'src/layouts/main/data';

const DELIVERY_NOTES = ['Lunch: 10:00AM to 1:00PM', 'Dinner: 4:00PM to 7:00PM'];

const DELIVERY_EXCEPTIONS = ['Christmas Day', 'Eve, 1st and 2nd Day of Chinese New Year'];

const ACTIVATION_NOTES = [
  "We would need 1 working day's notice (before 2PM) on weekdays.",
  "We would need 2 working day's notice (before 2PM) on weekends.",
  "Any orders or activations after operating hours would require 2 working day's notice.",
];

const TRIAL_MEAL = [
  "Pig's Trotters with Black Vinegar, Ginger and Egg",
  'Stir-Fried Spinach with Sea Cucumber topped with Wolfberries',
  'Sesame Kampung Chicken with Omelette',
  'Red Bean, Burdock Pork Rib Soup',
  'Steamed Fragrant White Rice',
  'Longan with Red Dates Tea',
];

const BMB_MEAL = [
  '28-Day Dual Meal from Chilli Padi Confinement',
  '10 Sessions of Signature 2-in-1 Postnatal Massage (TCM + Javanese) 60min',
];

const BMB_MEAL_EXTRAS = [
  'Chilli Padi Nonya Restaurant voucher (worth $50)',
  '20min Baby massage (U.P. $79)',
  'BMB Gift Voucher (worth $100, Redeem from BMB)',
];

const POSTNATAL_TRANSPORT = [
  'Customer may opt for home service for single sessions or first-trial sessions with a top-up of $50 for the transportation fee',
  'With the exception of Sentosa',
];

const QUEEN_PREMIER_NOTES = ['2D1N', 'Welcome gift from MyQueen', '6 Month Personal Accident Coverage*'];

const OASIA_TNC_NOTES = [
  '3:00PM check-in, 1:00PM check-out',
  'This is a purchase of a voucher. Call +65 8028 8186 to book your slots.',
  'Please take note that this is subject to availability. Do book in advance.',
  'A separate T&C applies for the 6-month Personal Accident Coverage.',
];

const MESSENGER_URL = 'https://www.facebook.com/messages/t/412974612448347';

type ProductNotesProps = {
  selectedCategory: PackageCategory | null;
  selectedBundles: ProductBundle[];
};

export function ProductNotes({ selectedCategory, selectedBundles }: ProductNotesProps) {
  const categoryName = selectedCategory?.name;
  const bundleNames = selectedBundles.map((bundle) => bundle.name.toLowerCase());

  const showDeliveryTimes =
    categoryName === 'Dual Meal' || categoryName === 'Single Meal' || categoryName === 'Trial Meal';
  const showDiscountNote = categoryName !== 'Trial Meal';
  const showActivationNotes = categoryName !== 'Trial Meal';
  const showTrialMealNotes = categoryName === 'Trial Meal';

  const bundleNotes = getBundleNotes(bundleNames);

  return (
    <Card sx={{ borderRadius: 5 }}>
      <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
        <Typography variant="h5" sx={{ color: 'primary.main', typography: { xs: 'h6', md: 'h5' } }}>
          Important Notes
        </Typography>

        <Stack spacing={2} sx={{ mt: 2 }}>
          {showTrialMealNotes && (
            <HighlightSection title="Trial Meal Package Includes:" items={TRIAL_MEAL} />
          )}

          {!!bundleNotes && (
            <HighlightSection
              title={bundleNotes.title}
              items={bundleNotes.items}
              additionalSections={bundleNotes.additionalSections}
            />
          )}

          {showActivationNotes && (
            <NoteSection
              title="For E.D.D selection/new orders/next day activation:"
              items={ACTIVATION_NOTES}
            />
          )}

          {showDeliveryTimes && (
            <Box>
              <Typography variant="body2" sx={{ mb: 0.75 }}>
                Delivery time range between:
              </Typography>
              <BulletList items={DELIVERY_NOTES} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, fontStyle: 'italic' }}>
                For delivery to Sentosa additional $20 per trip.
              </Typography>
            </Box>
          )}

          <Box>
            <Typography variant="body2" sx={{ mb: 0.75 }}>
              Please note that there are no meal deliveries for the following days:
            </Typography>
            <BulletList items={DELIVERY_EXCEPTIONS} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, fontStyle: 'italic' }}>
              The meals will be replaced, customers would still receive the full amount of days/meals they have paid for.
            </Typography>
          </Box>

          {showDiscountNote && (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              Discounted price is only applicable for orders made at least 30 days before estimated due date.
            </Typography>
          )}

          <Box sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider', textAlign: { xs: 'left', sm: 'center' } }}>
            <Typography variant="caption" sx={{ fontStyle: 'italic', wordBreak: 'break-word' }}>
              For more information or special arrangements, please contact us at{' '}
              <Link href={`tel:${companyInfo.phone.replace(/\s+/g, '')}`} underline="always" color="inherit">
                {companyInfo.phone}
              </Link>{' '}
              | email us at{' '}
              <Link href={`mailto:${companyInfo.email}`} underline="always" color="inherit">
                {companyInfo.email}
              </Link>{' '}
              | chat with us on{' '}
              <Link href={MESSENGER_URL} target="_blank" rel="noopener noreferrer" underline="always" color="inherit">
                Messenger
              </Link>
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function getBundleNotes(bundleNames: string[]) {
  if (bundleNames.some((name) => name.includes('bmb') || name.includes('massage'))) {
    return {
      title: 'BMB Massage Package Includes:',
      items: [...BMB_MEAL, ...BMB_MEAL_EXTRAS],
      additionalSections: [
        {
          title: 'Terms & Conditions:',
          items: POSTNATAL_TRANSPORT,
        },
      ],
    };
  }

  if (bundleNames.some((name) => name.includes('queen') || name.includes('staycay'))) {
    return {
      title: 'MyQueen Staycay Package Includes:',
      items: QUEEN_PREMIER_NOTES,
      additionalSections: [
        {
          title: 'Terms & Conditions:',
          items: OASIA_TNC_NOTES,
        },
      ],
    };
  }

  return null;
}

function HighlightSection({
  title,
  items,
  additionalSections,
}: {
  title: string;
  items: string[];
  additionalSections?: Array<{ title: string; items: string[] }>;
}) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: 'rgba(242, 124, 150, 0.08)',
        border: '1px solid',
        borderColor: 'rgba(242, 124, 150, 0.5)',
      }}
    >
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 700, color: 'primary.main' }}>
        {title}
      </Typography>
      <BulletList items={items} />

      {additionalSections?.map((section) => (
        <Box key={section.title} sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 700, color: 'primary.main' }}>
            {section.title}
          </Typography>
          <BulletList items={section.items} />
        </Box>
      ))}
    </Box>
  );
}

function NoteSection({ title, items }: { title: string; items: string[] }) {
  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 0.75 }}>
        {title}
      </Typography>
      <BulletList items={items} />
    </Box>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <Stack spacing={0.5}>
      {items.map((item) => (
        <Stack key={item} direction="row" spacing={1} alignItems="flex-start">
          <Box
            sx={{
              width: 5,
              height: 5,
              mt: 0.875,
              borderRadius: '50%',
              bgcolor: 'text.secondary',
              flexShrink: 0,
            }}
          />
          <Typography variant="body2" color="text.secondary">
            {item}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

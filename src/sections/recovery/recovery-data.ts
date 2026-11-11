import type { RecoveryIconName } from './recovery-icons';

// ----------------------------------------------------------------------
// NOTE: copy below follows the mockup. Wording is a draft and needs the
// team's review before launch (recovery / dietary statements especially).

const WHATSAPP_NUMBER = '6587257099';
const WHATSAPP_MESSAGE = "Hi, I'd like to ask about your post-surgery recovery meals.";

export const RECOVERY_WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE
)}`;

export const RECOVERY_NOTICE =
  'Your care team’s dietary instructions come first. Speak with us to check what we can accommodate.';

export const RECOVERY_BENEFITS: { icon: RecoveryIconName; title: string; description: string }[] = [
  {
    icon: 'cooking',
    title: 'Less planning and cooking',
    description: 'Let us take care of your meals so you can focus on resting and recovering at home.',
  },
  {
    icon: 'delivery',
    title: 'Meals delivered to your door',
    description: 'Nutritious, home-style meals delivered fresh to your home at your convenience.',
  },
  {
    icon: 'family',
    title: 'Support for family caregivers',
    description: 'Save time and ease mealtime arrangements for your loved ones.',
  },
];

export const RECOVERY_MEALS_NOTE = 'Illustrative dishes. Recovery menu to be confirmed.';

export const RECOVERY_MEALS: { name: string; image: string }[] = [
  { name: 'Fish soup', image: '/dishes/OneDrive_3_9-24-2026/Papaya Fish Soup.jpg' },
  { name: 'Chicken soup', image: '/dishes/OneDrive_3_9-24-2026/Lemongrass Chicken Soup.jpg' },
  { name: 'Cooked vegetables', image: '/dishes/OneDrive_2_9-24-2026/Veggie.jpg' },
];

export const RECOVERY_STEPS: { title: string; description: string }[] = [
  {
    title: 'Check your discharge diet',
    description:
      'Follow your doctor or dietitian’s advice and understand any dietary requirements.',
  },
  {
    title: 'Discuss your requirements with us',
    description:
      'Let us know your preferences and any dietary restrictions so we can advise on suitable options.',
  },
  {
    title: 'Confirm delivery arrangements',
    description: 'We will finalise your meal options, delivery schedule and other details with you.',
  },
];

export const RECOVERY_STEPS_NOTE = 'Menu availability and dietary requests are subject to confirmation.';

export const RECOVERY_CHECKLIST_TITLE = 'Preparation checklist';
export const RECOVERY_CHECKLIST: string[] = [
  'Note down the diet instructions from your doctor or dietitian',
  'List any allergies, food restrictions or textures to avoid',
  'Decide who will receive the meals and their delivery address',
  'Choose a start date for your meals',
  'Speak with our team to confirm suitable meal options',
];

export const RECOVERY_FAQS: { question: string; answer: string }[] = [
  {
    question: 'Can I have these meals after any operation?',
    answer:
      'Dietary needs vary. Follow your doctor or dietitian’s advice and contact our team before ordering.',
  },
  {
    question: 'Can you accommodate dietary restrictions?',
    answer:
      'Tell us about your restrictions and we will let you know what we can and cannot accommodate. Your care team’s instructions always come first.',
  },
  {
    question: 'Can I arrange meals for a family member?',
    answer:
      'Yes. You can arrange meals for a family member. Contact our team with their details and delivery address.',
  },
];

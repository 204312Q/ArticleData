import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export type MainNavItem = {
  title: string;
  path: string;
};

export type FooterLinkItem = {
  name: string;
  href: string;
};

export type FooterLinkGroup = {
  headline: string;
  children: FooterLinkItem[];
};

export type SocialLink = {
  value: 'facebook' | 'instagram' | 'tiktok';
  label: string;
  href: string;
};

export type PaymentType = {
  id: number;
  value: string;
  image: string;
};

export const mainNavItems: MainNavItem[] = [
  { title: 'About Us', path: paths.about },
  { title: 'Confinement Menu', path: paths.menu },
  { title: 'Articles', path: paths.post.root },
  { title: 'FAQ', path: paths.faqs },
  {title: 'Baby Gift Set', path: paths.babyFullMonthGiftSet},

];

export const behindTheBrand: FooterLinkGroup[] = [
  {
    headline: 'Behind The Brand',
    children: [
      { name: 'Home', href: paths.home },
      { name: 'About us', href: paths.about },
      { name: 'Articles', href: paths.post.root },
      { name: 'Testimonials', href: `${paths.about}#testimonials` },
    ],
  },
];

export const comfortForMum: FooterLinkGroup[] = [
  {
    headline: 'Comfort For Mum',
    children: [
      { name: 'View Weekly Menu', href: paths.menu },
      { name: 'Confinement Packages', href: paths.product.root },
      { name: 'Baby Shower Celebration', href: 'https://chilliapi.com.sg/catering/menu/baby-shower-buffet' },
      { name: 'FAQs', href: paths.faqs },
    ],
  },
];

export const hotlineHours = [
  'Mon - Fri 9:00AM to 6:00PM',
  'Sat: 9:00AM to 12:30PM',
  'Sun, PH Closed',
];

export const socialLinks: SocialLink[] = [
  {
    value: 'facebook',
    label: 'Facebook',
    href: 'https://www.facebook.com/chillipadiconfinement/',
  },
  {
    value: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/chillipadiconfinement/',
  },
  {
    value: 'tiktok',
    label: 'TikTok',
    href: 'https://www.tiktok.com/@cpconfinement?is_from_webapp=1&sender_device=pc',
  },
];

export const paymentTypes: PaymentType[] = [
  {
    id: 1,
    value: 'Visa',
    image: '/payment/visa.svg',
  },
  {
    id: 2,
    value: 'Mastercard',
    image: '/payment/mastercard.svg',
  },
];

export const companyInfo = {
  name: 'Chilli Padi Confinement',
  address: '3015 Bedok North Street 5, Shimei East Kitchen, #04-21, Singapore 486350',
  phone: '6914 9900',
  email: 'confinement@chillipadi.com.sg',
  affiliateLogo: '/logo/Chilli_padi_logo.png',
};

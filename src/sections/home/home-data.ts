import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

// Shared by HomeHero (its own gutter background) and HomeView (the gradient
// right below it, which starts at this same color so the two sections meet
// with no visible seam). Lives here rather than in home-hero.tsx because that
// file is 'use client' — a plain value exported from a Client Component
// module can't be read from a Server Component like HomeView; importing it
// silently renders a throwing proxy function instead of the color string.
export const HERO_GUTTER_COLOR = '#FBD7DE';

export type HeroStat = {
  label: string;
  value: string;
};

export type HeroBanner = {
  id: number;
  title: string;
  image: string;
};

export type PackageCard = {
  id: number;
  name: string;
  image: string;
  alt: string;
  description: string;
  price: string;
};

export type BenefitCard = {
  id: number;
  name: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  alt: string;
  description: string;
};

export type FeatureCard = {
  id: number;
  name: string;
  image: string;
  alt: string;
  description: string;
  url: string;
};

export type DishCard = {
  id: number;
  name: string;
  image: string;
  alt: string;
  description: string;
  chineseName: string;
  chineseDescription: string;
};

export const heroStats: HeroStat[] = [
  { label: 'Packages from', value: '$38' },
  { label: 'Delivery', value: 'Islandwide' },
  { label: 'Meals', value: 'MSG-Free' },
];

export const heroBanners: HeroBanner[] = [
  {
    id: 1,
    title: 'Chilli Padi Confinement Banner 1',
    image: '/banners/ConfinementBanner_1.png',
  },
  {
    id: 2,
    title: 'Chilli Padi Confinement Banner 2',
    image: '/banners/ConfinementBanner_4.png',
  }
];

export const packageCards: PackageCard[] = [
  {
    id: 1,
    name: '28 Days Dual Meal',
    image: '/menu/HakkaYellowWineChickenwithBlackFungus_360x.webp',
    alt: '28 Days Dual Meal',
    description: 'Lunch and Dinner | $32.64/meal',
    price: '$1,828.00',
  },
  {
    id: 2,
    name: '14 Days Dual Meal',
    image: '/menu/Pigs_Trotter_with_Ginger_Vinegar_and_Egg.webp',
    alt: '14 Days Dual Meal',
    description: 'Lunch and Dinner | $35.29/meal',
    price: '$988.00',
  },
  {
    id: 3,
    name: '7 Days Dual Meal',
    image: '/menu/product-2.webp',
    alt: '7 Days Dual Meal',
    description: 'Lunch and Dinner | $37.71/meal',
    price: '$528.00',
  },
];

export const benefitCards: BenefitCard[] = [

  {
    id: 1,
    name: 'Convenience & Quality',
    image: '/aboutUs/confinementPackage.avif',
    imageWidth: 1920,
    imageHeight: 1920,
    alt: 'Convenience & Quality',
    description:
    `Our unique thermal wares ensure that warm and nutritious meals are delivered to your doorstep timely. Skip the hassle on meal planning, grocery shopping, cooking or washing dishes. Indulge in the luxury of spending quality time with your newborn and family.`
  },
    {
    id: 2,
    name: 'Alchemy Fibre For Healthier Mum',
    image: '/assets/benefitsImage/Benefit-3.webp',
    imageWidth: 720,
    imageHeight: 605,
    alt: 'Alchemy Fibre for healthier mum',
    description:
`At Chilli Padi Confinement, we enhance our Fragrant White Rice with Alchemy Fibre™ for Rice, providing a healthier choice for new mothers. This revolutionary blend of low GI, high fibre, and prebiotics transforms white rice, significantly increasing its fibre content without compromising taste or texture.`
  },
  {
    id: 3,
    name: 'Meals Crafted For Recovery',
    image: '/assets/benefitsImage/Benefit-2.webp',
    imageWidth: 540,
    imageHeight: 518,
    alt: 'Meals crafted for your recovery',
    description:
    `Our meals are prepared low in sodium and MSG-free without compromising the taste. These essential nutrients and traditional herbs improve digestion, support healthy lactation and restore the body's core energy.`
  }
  
];

export const featureCards: FeatureCard[] = [
  {
    id: 1,
    name: 'BMB Packages',
    image: '/assets/feature/feature-1.webp',
    alt: 'BMB Packages',
    description:
      `BMB's team of certified professionals specializes in both Traditional Chinese Massage (TCM) and Javanese methods. Their proprietary massage strokes combine Javanese techniques and Meridian points, effectively decreasing swelling, relieving pain, and regulating hormones.

`,
    url: paths.product.root,
  },
  {
    id: 2,
    name: 'Baby Shower Catering',
    image: '/assets/feature/feature-2.webp',
    alt: 'Baby Shower Catering',
    description: `Our catering services go beyond just great food. We also offer thematic set-ups at an additional cost to make your baby shower even more special and memorable. Our team of experienced and professional caterers will work closely with you to ensure that your event is a success and that your guests are thoroughly impressed.
`,
    url: 'https://chilliapi.com.sg/catering/menu/baby-shower-buffet',
  },
  {
    id: 3,
    name: 'Baby Full Month Gift Set',
    image: '/assets/feature/feature-3.webp',
    alt: 'Baby Full Month Gift Set',
    description:
    `Celebrate the arrival of your newborn! Full Month Gift Sets are typically given to friends and relatives to announce the birth of a baby. A time-honoured tradition in Chinese culture, these symbolic gift sets, also known as Full Moon Gift Boxes (满月礼盒), typically contain red eggs, ang ku kueh, and cake.

`,
    url: paths.babyFullMonthGiftSet,
  },
];

export const popularDishes: DishCard[] = [
  {
    id: 1,
    name: "Pig's Trotter with Ginger, Vinegar and Egg",
    image: '/assets/popularDish/pigtrotters_flatlay 1.webp',
    alt: "Pig's Trotter with Ginger, Vinegar and Egg",
    description:
      'Pig trotters are often consumed during confinement as they are rich in collagen. When combined with vinegar, pig trotters can help to alleviate joint pain, improve skin conditions and have a warming effect on the body.',
    chineseName: '猪脚醋',
    chineseDescription:
      '猪脚醋是坐月子必备的滋补美食。猪脚醋富含胶原蛋白，养颜美肤，并且可以帮助缓解关节疼痛以及驱寒祛风',
  },
  {
    id: 2,
    name: 'Milk Boosting Fish and Papaya Soup',
    image: '/assets/popularDish/Milk Boosting Fish and Papaya Soup.webp',
    alt: 'Milk Boosting Fish and Papaya Soup',
    description:
      'Papaya fish soup is a traditional dish highly recommended for confinement mothers. The combination of papaya and fish helps to enhance the healing process, support lactation and improve digestion.',
    chineseName: '木瓜鱼汤',
    chineseDescription:
      '木瓜鱼汤是一道非常适合产后妈妈的传统菜肴。木瓜鱼汤有助于愈合过程、促进催 乳以及促进消化',
  },
  {
    id: 3,
    name: 'Wok Fried Huai Shan Noodle with Egg',
    image: '/assets/popularDish/Wok Fried Huai Shan Noodle with Egg.webp',
    alt: 'Wok Fried Huai Shan Noodle with Egg',
    description:
      'Wok Fried Huai Shan Noodle with Egg is a popular dish during confinement. It is believed that the dish helps to restore energy and strength after childbirth, while also providing essential nutrients for recovery.',
    chineseName: '蛋炒淮山面',
    chineseDescription:
      '在这个重要的月子期间，吃得好是恢复体力的关键。鱼有助于修复受损细胞，防止肌肉质量的退化',
  },
];

export const orderStepImages = [
  '/assets/OrderSteps/OrderStep-1.webp',
  '/assets/OrderSteps/OrderStep-2.webp',
  '/assets/OrderSteps/OrderStep-3.webp',
];

export const partnerLogos = [
  { id: 1, src: '/assets/partners/partner-1.avif', alt: 'Beauty Mum & Babies' },
  { id: 2, src: '/assets/partners/partner-2.avif', alt: 'Mount Alvernia Hospital' },
  { id: 3, src: '/assets/partners/partner-3.avif', alt: 'Mummies Club' },
  { id: 4, src: '/assets/partners/partner-4.avif', alt: 'Queen' },
];

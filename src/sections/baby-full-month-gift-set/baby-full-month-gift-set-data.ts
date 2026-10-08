export type GiftSetFoodItemChoiceOption = {
  id: string;
  label: string;
};

export type GiftSetFoodItemChoice = {
  id: string;
  label: string;
  options: GiftSetFoodItemChoiceOption[];
};

export type GiftSetFoodItem = {
  name: string;
  description?: string;
  quantity?: string;
  choices?: GiftSetFoodItemChoice[];
};

export type GiftSetVariant = {
  id: string;
  name: string;
  price?: number;
  bcNumber?: string;
  choices?: GiftSetFoodItemChoice[];
  items: GiftSetFoodItem[];
};

export type GiftSetProduct = {
  id: string;
  name: string;
  category: 'Kebaya Gift Box' | 'Tingkat Set' | 'Savoury Box';
  price: number;
  bcNumber?: string;
  image: string;
  alt: string;
  imagePosition: string;
  description: string;
  contents?: string[];
  items?: GiftSetFoodItem[];
  rank: number;
  minQty?: number;
  choices?: GiftSetFoodItemChoice[];
  variants?: GiftSetVariant[];
};

const cardChoice: GiftSetFoodItemChoice = {
  id: 'card',
  label: 'Card Message',
  options: [
    { id: 'its-a-girl', label: "It's a Girl" },
    { id: 'its-a-boy', label: "It's a Boy" },
    { id: 'hello-baby', label: 'Hello Baby' },
    { id: 'personalised', label: 'Personalised' },
  ],
};

const angKuKuehShapeChoice: GiftSetFoodItemChoice = {
  id: 'angKuKuehShape',
  label: 'Ang Ku Kueh Shape',
  options: [
    { id: 'pointed', label: 'Pointed — Ang Ku Kueh' },
    { id: 'round', label: 'Round — Ang Ku Kueh' },
  ],
};

const angKuKuehTypeChoice: GiftSetFoodItemChoice = {
  id: 'angKuKuehType',
  label: 'Choice of Ang Ku Kueh',
  options: [
    { id: 'gold-dust', label: 'Gold Dust Ang Ku Kueh' },
    { id: 'gold-dust-charcoal', label: 'Gold Dust Charcoal Ang Ku Kueh' },
  ],
};

const choiceOfTreatChoice: GiftSetFoodItemChoice = {
  id: 'choiceOfTreat',
  label: 'Choice of Treat',
  options: [
    { id: 'kueh-salat', label: 'Handcrafted Round Kueh Salat (4 inch)' },
    { id: 'rainbow-lapis', label: 'Handcrafted Rainbow Lapis (4 inch)' },
    { id: 'pandan-swiss-roll', label: 'Pandan Swiss Roll' },
    { id: 'dark-cherry-red-velvet', label: 'Dark Cherry Red Velvet Cake' },
    { id: 'fruit-cake', label: 'Fruit Cake' },
    { id: 'walnut-cake', label: 'Walnut Cake' },
  ],
};

const cakeOptions: GiftSetFoodItemChoiceOption[] = [
  { id: 'pandan-swiss-roll', label: 'Pandan Swiss Roll' },
  { id: 'dark-cherry-red-velvet', label: 'Dark Cherry Red Velvet Cake' },
  { id: 'fruit-cake', label: 'Fruit Cake' },
  { id: 'walnut-cake', label: 'Walnut Cake' },
];

const choiceOf1stTreatChoice: GiftSetFoodItemChoice = {
  id: 'choiceOf1stTreat',
  label: 'Choice of 1st Treat',
  options: [
    { id: 'kueh-salat', label: 'Handcrafted Round Kueh Salat (4 inch)' },
    { id: 'rainbow-lapis', label: 'Handcrafted Rainbow Lapis (4 inch)' },
  ],
};

const choiceOf2ndTreatChoice: GiftSetFoodItemChoice = {
  id: 'choiceOf2ndTreat',
  label: 'Choice of 2nd Treat',
  options: cakeOptions,
};

const choiceOf3rdTreatChoice: GiftSetFoodItemChoice = {
  id: 'choiceOf3rdTreat',
  label: 'Choice of 3rd Treat',
  options: cakeOptions,
};

const kuehItem: GiftSetFoodItem = {
  name: 'Gold Dust Charcoal Ku Kueh 金粉黑龟粿（2个）',
  description:
    'Delicious glutinous rice flour cakes with sweet filling. Each Gold Dust Charcoal Ku Kueh is handmade and prepared fresh in our pastry kitchens. Choice of Round (for baby girls) or Pointed (for baby boys).',
   quantity: '2 pcs',
};

export const giftSetProducts: GiftSetProduct[] = [
  {
    id: 'baby-bliss',
    name: 'Baby Bliss (Kebaya Gift Box)',
    category: 'Kebaya Gift Box',
    price: 8.5,
    image: '/assets/giftset/BabyBliss.png',
    alt: 'Baby Bliss kebaya gift box',
    imagePosition: 'center center',
    description: 'A compact full month favour with three classic treats in a kebaya gift box.',
    contents: ['3 treat choices', 'Kebaya gift box', 'Individual guest portion'],
    rank: 1,
    minQty: 20,
    variants: [
      {
        id: 'baby-bliss-a',
        name: 'Baby Bliss A',
        price: 8.5,
        bcNumber: 'CFM-GFT-BBA',
        choices: [angKuKuehShapeChoice, cardChoice],
        items: [
          { name: 'Gold Dust Ang Ku Kueh 金粉红龟粿（2个）', description: 'Delicious glutinous rice flour cakes with sweet filling. Each Gold Dust Ang Ku Kueh is handmade and prepared fresh, made-to-order, in our pastry kitchens. Choice of Round (for baby girls) or Pointed (for baby boys).', quantity: '2 pcs' },
          { name: 'Good Luck Red Eggs 好运红鸡蛋（2个）', description: 'Hard boiled eggs dipped in red food dye. Red symbolises luck and happiness. The roundedness of the eggs symbolises harmony, unity and new life.', quantity: '2 pcs' },
        ],
      },
      {
        id: 'baby-bliss-b',
        name: 'Baby Bliss B',
        price: 8.5,
        bcNumber: 'CFM-GFT-BBB',
        choices: [cardChoice],
        items: [
          { name: 'Good Luck Red Eggs 好运红鸡蛋（2个）', description: 'Hard boiled eggs dipped in red food dye. Red symbolises luck and happiness. The roundedness of the eggs symbolises harmony, unity and new life.', quantity: '2 pcs' },
          { name: 'Sticky Rice 粘米', description: 'Studded with sliced shiitake mushrooms, crisp peanuts, scallions and dried shrimp. A hearty savoury dish to celebrate the birth of your bundle of joy.', quantity: '1 box' },
        ],
      },
      {
        id: 'baby-bliss-c',
        name: 'Baby Bliss C',
        price: 9.59,
        bcNumber: 'CFM-GFT-BBC',
        choices: [angKuKuehShapeChoice, cardChoice],
        items: [
          { name: 'Gold Dust Ang Ku Kueh 金粉红龟粿（2个）', description: 'Delicious glutinous rice flour cakes with sweet filling. Each Gold Dust Ang Ku Kueh is handmade and prepared fresh, made-to-order, in our pastry kitchens. Choice of Round (for baby girls) or Pointed (for baby boys).', quantity: '2 pcs' },
          { name: 'Sticky Rice 粘米', description: 'Studded with sliced shiitake mushrooms, crisp peanuts, scallions and dried shrimp. A hearty savoury dish to celebrate the birth of your bundle of joy.', quantity: '1 box' },
        ],
      },
    ],
  },
  {
    id: 'kueh-kisses',
    name: 'Kueh Kisses (Kebaya Gift Box)',
    category: 'Kebaya Gift Box',
    price: 15.04,
    bcNumber: 'CFM-GFT-KKS',
    image: '/assets/giftset/KuehKisses.png',
    alt: 'Kueh Kisses kebaya gift box',
    imagePosition: 'center center',
    description: 'A sweet kueh-led gift set for sharing the baby full month celebration.',
    items: [
      { name: 'Gold Dust Ang Ku Kueh', quantity: '2 pcs' },
      { name: 'Kueh Salat', quantity: '2 pcs' },
      { name: 'Rainbow Lapis', quantity: '2 pcs' },
      { name: 'Baked Ubi', quantity: '2 pcs' },
    ],
    rank: 2,
    minQty: 15,
    choices: [angKuKuehShapeChoice, cardChoice],
  },
  {
    id: 'savoury-cheer',
    name: 'Savoury Cheer - 2 Choices',
    category: 'Savoury Box',
    price: 15.04,
    image: '/assets/giftset/SavouryCheer.png',
    alt: 'Savoury Cheer gift set',
    imagePosition: 'center center',
    description:
      'This traditional yet tasty set offers you the customary items typically gifted to announce the arrival of a baby. Choose from 2 set choices.',
    contents: ['2 savoury choices', 'Gift box packing', 'Guest-friendly serving'],
    rank: 3,
    minQty: 15,
    variants: [
      {
        id: 'savoury-cheer-a',
        name: 'Savoury Cheer Set A',
        price: 15.04,
        bcNumber: 'CFM-GFT-SCA',
        choices: [angKuKuehShapeChoice, cardChoice],
        items: [
          {
            name: 'Good Luck Red Eggs 红鸡蛋（2个）',
            description:
              'Hard boiled eggs dipped in red food dye. Red symbolises luck and happiness. The rounded shape of the eggs symbolises harmony, unity and new life.',
            quantity: '2 pcs',
          },
          kuehItem,
          {
            name: 'Sticky Rice 糯米',
            description:
              'Studded with sliced shiitake mushrooms, crisp peanuts, scallions and dried shrimp. A hearty savoury dish to celebrate the birth of your bundle of joy.',
            quantity: '1 box',
          },
        ],
      },
      {
        id: 'savoury-cheer-b',
        name: 'Savoury Cheer Set B',
        price: 20.49,
        bcNumber: 'CFM-GFT-SCB',
        choices: [angKuKuehShapeChoice, cardChoice],
        items: [
          {
            name: 'Good Luck Red Eggs 红鸡蛋（2个）',
            description:
              'Hard boiled eggs dipped in red food dye. Red symbolises luck and happiness. The rounded shape of the eggs symbolises harmony, unity and new life.',
            quantity: '2 pcs',
          },
          kuehItem,
          {
            name: 'Sticky Rice 糯米',
            description:
              'Studded with sliced shiitake mushrooms, crisp peanuts, scallions and dried shrimp. A hearty savoury dish to celebrate the birth of your bundle of joy.',
            quantity: '1 box',
          },
          {
            name: 'Pandan Swiss Roll 班兰瑞士卷',
            description: 'Fragrant and light pandan swiss roll cake is always a favourite for gifting.',
            quantity: '1 piece',
          },
          {
            name: 'Dark Cherry Red Velvet Cup Cake',
            description:
              'Our Dark Cherry Red Velvet Cup Cake is both moist and delicious. It offers a modern take on red which symbolises luck and happiness.',
            quantity: '1 piece',
          },
        ],
      },
    ],
  },
  {
    id: 'miracle1',
    name: 'Miracle (2 Tier Tingkat Set)',
    category: 'Tingkat Set',
    price: 24.85,
    bcNumber: 'CFM-GFT-MIR',
    image: '/assets/giftset/Miracle_2(1).png',
    alt: 'Miracle two tier tingkat gift set',
    imagePosition: 'center center',
    description: 'A two-tier tingkat gift set with a stronger traditional presentation.',
    contents: ['2-tier tingkat', 'Gold Dust/Gold Dust Charcoal Ang Ku Kueh', 'Good Luck Red Eggs', '1 Additional Treat'],
    rank: 4,
    minQty: 10,
    choices: [angKuKuehTypeChoice, angKuKuehShapeChoice, choiceOfTreatChoice, cardChoice],
  },
  {
    id: 'delight',
    name: 'Delight (4 Tier Tingkat Set)',
    category: 'Tingkat Set',
    price: 39.02,
    bcNumber: 'CFM-GFT-DEL',
    image: '/assets/giftset/Delight_4(1).png',
    alt: 'Delight four tier tingkat gift set',
    imagePosition: 'center center',
    description: 'The largest tingkat-style gift set for a fuller, more generous celebration.',
    contents: ['4-tier tingkat', 'Gold Dust/Gold Dust Charcoal Ang Ku Kueh', 'Good Luck Red Eggs', '3 Additional Treats'],
    rank: 5,
    minQty: 8,
    choices: [
      angKuKuehTypeChoice,
      angKuKuehShapeChoice,
      choiceOf1stTreatChoice,
      choiceOf2ndTreatChoice,
      choiceOf3rdTreatChoice,
      cardChoice,
    ],
  },
];

export type GiftSetNoteSection = {
  heading: string;
  items: string[];
};

export const giftSetImportantNotes: GiftSetNoteSection[] = [
  {
    heading: 'Personalised Message Card',
    items: [
      'A blank Standard Message Card is included with every set, with a choice of cover design.',
      "For a complimentary Personalised Message Card (baby's photo, name, D.O.B, a short message and parent's name), email confinement@chillipadi.com.sg at least 5 to 7 working days before delivery.",
    ],
  },
  {
    heading: 'Lead Time',
    items: [
      'Orders must be placed at least 2 working days in advance.',
      'For Personalised Message Card customisations or other special requests, order at least 5 working days in advance.',
      'For urgent orders, email confinement@chillipadi.com.sg.',
    ],
  },
  {
    heading: 'Delivery',
    items: [
      'Delivery time range is between 10.00am and 2.00pm.',
      'Complimentary delivery to 1 location with a minimum spend of $300 (after discount).',
      'A $20 fee applies for orders below $300.',
      'A $12 fee per location applies for delivery to multiple locations — our customer service officer will contact you for delivery details after the order is placed.',
      'Delivery is to residential addresses only. Email confinement@chillipadi.com.sg for other locations.',
    ],
  },
  {
    heading: 'Confinement Customer Exclusive',
    items: [
      'Existing Chilli Padi Confinement customers are entitled to a 15% discount on Baby Full Month Gift Sets.',
      'Limited to customers who have purchased 28 Day, 21 Day, 14 Day or 7 Day Meal Packages.',
      'Contact the Customer Service Officer managing your confinement package to find out how to redeem your discount.',
    ],
  },
];

export const giftSetImportantNotesFootnote =
  'Kindly note that the exact design of the Kebaya Gift Box may differ from photos shown. Email confinement@chillipadi.com.sg should you have any queries.';

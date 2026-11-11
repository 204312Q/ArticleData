import type { BenefitIconName } from './benefits-icons';

import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export type BenefitDish = {
  name: string;
  description: string;
  image: string;
};

export type BenefitIngredient = {
  name: string;
  image: string;
};

export type BenefitArticle = {
  label: string;
  href: string;
};

export type BenefitCategory = {
  id: string;
  title: string;
  icon: BenefitIconName;
  summary: string;
  ingredients: BenefitIngredient[];
  dishes: BenefitDish[];
  articles: BenefitArticle[];
};

const article = (slug: string, label: string): BenefitArticle => ({
  label,
  href: paths.post.details(slug),
});

const ingredient = (name: string, file: string): BenefitIngredient => ({
  name,
  image: `/dishes/Benefits/${file}.png`,
});

const DISH_DIR = '/dishes/OneDrive_3_9-24-2026';

export const benefitCategories: BenefitCategory[] = [
  {
    id: 'breastfeeding',
    title: 'Breastfeeding Nourishment',
    icon: 'breastfeeding',
    summary:
      'Regular meals, nourishing soups and varied ingredients for your breastfeeding journey.',
    ingredients: [
      ingredient('Papaya', 'Vibrant Papaya with Glossy Seeds'),
      ingredient('Fish', 'Raw Fish Fillets on White'),
      ingredient('Spinach', 'Fresh Dewy Spinach Leaves'),
    ],
    dishes: [
      {
        name: 'Papaya Fish Soup',
        description:
          'A comforting soup with papaya, fish and red dates, simmered to bring out natural flavours.',
        image: `${DISH_DIR}/Papaya Fish Soup.jpg`,
      },
      {
        name: 'Grilled Salmon with Apple Mirin Sauce',
        description:
          'Tender grilled salmon served with a light apple mirin sauce, paired with seasonal vegetables for a balanced meal.',
        image: `${DISH_DIR}/Grilled Salmon With Apple Mirin Sauce.jpg`,
      },
    ],
    articles: [
      article('how-to-produce-more-breastmilk', 'How to Produce More Breastmilk'),
      article('snacks-for-confinement-and-breastfeeding-munchies', 'Snacks for Confinement and Breastfeeding Munchies'),
      article('why-papaya-fish-soup-is-good-for-confinement-mothers', 'Why Papaya Fish Soup Is Good For Confinement Mothers'),
    ],
  },
  {
    id: 'postpartum-recovery',
    title: 'Postpartum Recovery',
    icon: 'recovery',
    summary: 'Wholesome ingredients and balanced meals to support your recovery after birth.',
    ingredients: [
      ingredient('Ginger', 'Fresh Ginger Root with Sliced Pieces'),
      ingredient('Red dates', 'Glossy Red Jujubes with Cut Half'),
      ingredient('Black fungus', 'Glossy Black Wood Ear Mushrooms'),
    ],
    dishes: [
      {
        name: 'Pig’s Trotter with Ginger, Vinegar & Egg',
        description: 'A traditional confinement dish prepared with ginger and black vinegar.',
        image: `${DISH_DIR}/Pigs_Trotter_with_Ginger_Vinegar_and_Egg.jpg`,
      },
      {
        name: 'Baked Herbal Chicken',
        description: 'Tender chicken baked with herbs for a warm, satisfying meal.',
        image: `${DISH_DIR}/Baked Herbal Chicken.jpg`,
      },
    ],
    articles: [
      article('the-science-behind-confinement-food', 'The Science Behind Confinement Food: How It Can Improve Your Postpartum Recovery'),
      article('your-first-week-of-confinement-tips-for-new-moms', 'Your First Week of Confinement: Tips for New Moms'),
      article('confinement-food-planning-natural-vs-c-section-births', 'Confinement Food Planning: Natural vs. C-Section Births'),
    ],
  },
  {
    id: 'daily-energy',
    title: 'Daily Energy & Nourishment',
    icon: 'energy',
    summary:
      'Nutritious and satisfying meals to help you stay energised throughout your confinement.',
    ingredients: [
      ingredient('Chicken', 'Raw Chicken Breast Fillets on White'),
      ingredient('Walnut', 'Golden Walnut Kernels on White'),
      ingredient('Black beans', 'Glossy Black Bean Mound'),
    ],
    dishes: [
      {
        name: 'Mind Boosting Walnut Black Bean Pork Ribs Soup',
        description: 'A hearty soup simmered with walnuts, black beans and pork ribs.',
        image: `${DISH_DIR}/Mind Boosting Walnut Black Bean Pork Ribs Soup.jpg`,
      },
      {
        name: 'Noodles',
        description: 'Wok-fried noodles with vegetables, a filling meal for busy days.',
        image: `${DISH_DIR}/Noodles.jpg`,
      },
    ],
    articles: [
      article('5-tasty-chinese-confinement-meals-to-boost-your-energy', '5 Tasty Chinese Confinement Meals to Boost Your Energy'),
      article('five-tips-for-a-smooth-confinement', 'Five Tips for a Smooth Confinement'),
    ],
  },
  {
    id: 'digestive-wellbeing',
    title: 'Digestive Wellbeing',
    icon: 'digestive',
    summary: 'Gentle, easy-to-digest dishes to support a happy and comfortable tummy.',
    ingredients: [
      ingredient('Ginger', 'Fresh Ginger Root with Sliced Pieces'),
      ingredient('Lemongrass', 'Fresh Lemongrass Bundle and Slices'),
      ingredient('Vegetables', 'Fresh Vegetable Still Life'),
    ],
    dishes: [
      {
        name: 'Lemongrass Chicken Soup',
        description: 'A light, fragrant soup that is gentle on the stomach.',
        image: `${DISH_DIR}/Lemongrass Chicken Soup.jpg`,
      },
      {
        name: 'Seasonal Vegetables',
        description: 'Lightly cooked greens with ginger, served alongside your main meal.',
        image: '/dishes/OneDrive_2_9-24-2026/Veggie.jpg',
      },
    ],
    articles: [
      article('why-we-add-alchmey-fibre-for-rice-to-our-fragrant-white-rice', 'Why do we add Alchemy Fibre™ for Rice to our Fragrant White Rice?'),
      article('food-to-avoid-during-confinement', 'Food to Avoid During Confinement'),
    ],
  },
  {
    id: 'soups-hydration',
    title: 'Soups & Hydration',
    icon: 'soups',
    summary: 'Nourishing soups and hydrating drinks to keep you well-nourished.',
    ingredients: [
      ingredient('Red dates', 'Glossy Red Jujubes with Cut Half'),
      ingredient('Cordyceps', 'Golden Cordyceps Fungi Pile'),
      ingredient('Black chicken', 'Raw Black Silkie Chicken Close-Up'),
    ],
    dishes: [
      {
        name: 'Nourishing & Beautifying Black Chicken Soup',
        description: 'A slow-simmered black chicken soup with traditional ingredients.',
        image: `${DISH_DIR}/Nourishing_and_Beautifying_Black_Chicken_Soup.jpg`,
      },
      {
        name: 'Red Date Tea',
        description: 'A warm, lightly sweet tea to sip throughout the day.',
        image: `${DISH_DIR}/Red Date Tea.jpg`,
      },
    ],
    articles: [
      article('revitalise-your-body-with-28-days-of-confinement-soup', 'Revitalise Your Body with 28 Days of Confinement Soup'),
      article('benefits-of-red-dates-tea-for-confinement-mothers', 'What Are The Benefits of Red Dates Tea for Confinement Mothers'),
      article('how-much-dom-to-drink-during-confinement', 'How Much DOM to Drink During Confinement'),
    ],
  },
  {
    id: 'traditional',
    title: 'Traditional Confinement Nourishment',
    icon: 'traditional',
    summary: 'Time-honoured ingredients and dishes inspired by traditional confinement practices.',
    ingredients: [
      ingredient('Ginseng', 'Ginseng Roots and Sliced Discs'),
      ingredient('He shou wu', 'He Shou Wu Root Slices'),
      ingredient('Sesame oil', 'Sesame Oil and Seeds Still Life'),
    ],
    dishes: [
      {
        name: 'He Shou Wu Pork Rib Soup',
        description: 'A traditional herbal soup prepared the classic way.',
        image: `${DISH_DIR}/He Shou Wu Pork Rib Soup.jpg`,
      },
      {
        name: 'Immunity Boosting Cordyceps Militaris Chicken Soup',
        description: 'Chicken soup simmered with cordyceps militaris.',
        image: `${DISH_DIR}/Immunity Boosting Cordyceps Militaris Chicken Soup.jpg`,
      },
    ],
    articles: [
      article('traditional-chinese-confinement-practices', 'Traditional Chinese Confinement Practices'),
      article('exploring-the-role-of-tcm-in-confinement', 'Exploring the Role of TCM (Traditional Chinese Medicine) in Confinement'),
      article('what-is-the-benefit-of-pig-trotter', 'What is the Benefit of Pig Trotter'),
    ],
  },
];

import type { PostItemData, PostImageAsset, PostContentBlock } from 'src/lib/post/types';

const ARTICLE_IMAGES = {
  tcm: [
    { src: '/banners/Confinement_Menu_Banner.avif', alt: 'Confinement meal spread' },
    { src: '/assets/background/confinement_group_shot.avif', alt: 'Confinement support team' },
  ],
  meals: [
    { src: '/assets/background/Confinement_menu.jpg', alt: 'Chinese confinement menu selection' },
    { src: '/menu/HakkaYellowWineChickenwithBlackFungus_360x.webp', alt: 'Hakka yellow wine chicken' },
  ],
  wellbeing: [
    { src: '/assets/background/confinement_group_shot.avif', alt: 'Supportive postpartum care environment' },
    { src: '/addons/Addon_ComfortingSet.webp', alt: 'Comforting postpartum add-on set' },
  ],
  science: [
    { src: '/banners/Confinement_Banner_1.jpg', alt: 'Confinement food hero image' },
    { src: '/menu/product-2.webp', alt: 'Prepared confinement dish' },
  ],
  papaya: [
    {
      src: '/assets/popularDish/Milk Boosting Fish and Papaya Soup.webp',
      alt: 'Papaya fish soup for confinement',
    },
    { src: '/addons/Addon_PapayaFishSoup.webp', alt: 'Papaya fish soup product image' },
  ],
  delivery: [
    { src: '/aboutUs/confinementPackage.avif', alt: 'Confinement package overview' },
    { src: '/addons/Addon_BirdNest.webp', alt: 'Bird nest add-on for postpartum meals' },
  ],
  snacks: [
    {
      src: '/assets/popularDish/Wok Fried Huai Shan Noodle with Egg.webp',
      alt: 'Nourishing confinement noodle dish',
    },
    { src: '/addons/Addon_BirdNest.webp', alt: 'Confinement snack add-on option' },
  ],
  planning: [
    { src: '/banners/Confinement_Banner_2.png', alt: 'Postpartum planning hero image' },
    { src: '/addons/Addon_ComfortingSet.webp', alt: 'Comforting set for recovery planning' },
  ],
  tea: [
    { src: '/banners/Confinement_Banner_3.jpg', alt: 'Warm recovery drink banner' },
    { src: '/addons/Addon_ThermalWare.webp', alt: 'Thermal ware for warm drinks' },
  ],
} as const;

const paragraph = (text: string): PostContentBlock => ({ type: 'paragraph', text });

const heading = (text: string): PostContentBlock => ({ type: 'heading', text });

const quote = (text: string): PostContentBlock => ({ type: 'quote', text });

const callout = (title: string, text: string): PostContentBlock => ({
  type: 'callout',
  title,
  text,
});

const list = (items: string[]): PostContentBlock => ({ type: 'list', items });

const image = (imageAsset: PostImageAsset, caption?: string): PostContentBlock => ({
  type: 'image',
  image: imageAsset,
  caption,
});

const gallery = (images: readonly PostImageAsset[], caption?: string): PostContentBlock => ({
  type: 'gallery',
  images: [...images],
  caption,
});


export const mockPosts: PostItemData[] = [
  {
    id: 'post-1',
    slug: 'exploring-the-role-of-tcm-in-confinement',
    title: 'Exploring the Role of TCM (Traditional Chinese Medicine) in Confinement',
    excerpt:
      'Adapted from the previous Chilli Padi blog, this piece looks at how TCM is often used alongside rest, warm meals, and guided recovery during the confinement period.',
    category: 'Recovery',
    tags: ['confinement food', 'confinement period', 'mental health', 'postpartum recovery'],
    coverUrl: ARTICLE_IMAGES.tcm[0].src,
    createdAt: '2026-04-03T09:00:00+08:00',
    reference:
      'https://chillipadiconfinement.com/blogs/confinement-tips/exploring-the-role-of-tcm-traditional-chinese-medicine-in-confinement',
    blocks: [
      heading('Why TCM still appears in modern confinement planning'),
      paragraph(
        'This article is based on the earlier site content about how Traditional Chinese Medicine is commonly layered into confinement support. The main idea is not that TCM replaces medical care, but that some families value it as a complementary approach for warmth, rest, circulation, and routine.'
      ),
      callout(
        'A practical lens',
        'The value is not in following every traditional rule. It is in choosing rituals that make recovery feel calmer, warmer, and easier to sustain.'
      ),
      gallery(ARTICLE_IMAGES.tcm, 'Images from the current project used to support the TCM recovery theme.'),
      paragraph(
        'In practical terms, the article connects TCM with familiar confinement habits such as warming foods, herbal broths, postnatal massage, and a slower recovery rhythm. That framing matches what many mothers are actually looking for: support that feels structured without becoming overwhelming.'
      ),
      quote(
        'The strongest confinement plan respects tradition without turning recovery into a rulebook.'
      ),
      paragraph(
        'The key takeaway is balance. A thoughtful confinement plan can respect tradition while still making space for informed decisions, personal comfort, and advice from qualified practitioners when needed.'
      ),
    ],
  },
  {
    id: 'post-2',
    slug: '5-tasty-chinese-confinement-meals-to-boost-your-energy',
    title: '5 Tasty Chinese Confinement Meals to Boost Your Energy',
    excerpt:
      'Inspired by the previous project blog, this article focuses on comforting Chinese confinement dishes that help mothers feel nourished without making meals feel repetitive.',
    category: 'Nutrition',
    tags: ['confinement', 'confinement food', 'confinement period', 'nourishing food', 'postpartum recovery'],
    coverUrl: ARTICLE_IMAGES.meals[0].src,
    createdAt: '2026-04-01T09:00:00+08:00',
    reference:
      'https://chillipadiconfinement.com/blogs/confinement-tips/5-tasty-chinese-confinement-meals-to-boost-your-energy',
    blocks: [
      paragraph(
        'The reference article highlights that confinement meals need to do two jobs at once: support recovery and remain enjoyable enough to eat day after day. Energy-building dishes work best when they combine warmth, protein, broth, and ingredients that feel familiar rather than overly heavy.'
      ),
      image(ARTICLE_IMAGES.meals[1], 'A familiar dish can make confinement meals feel comforting instead of clinical.'),
      heading('What makes a confinement menu feel sustainable'),
      list([
        'Reliable warmth and broth-based dishes',
        'Enough protein to support recovery and energy',
        'Rotation that avoids repetition fatigue',
        'Meals that still feel enjoyable on low-appetite days',
      ]),
      paragraph(
        'Chinese confinement menus often rotate soups, braised dishes, ginger-forward recipes, and nutrient-dense staples so that mothers get variety without losing the recovery focus. That variety matters because appetite changes quickly in the postpartum weeks.'
      ),
      callout(
        'Menu planning principle',
        'For a meal programme, the real value is not one hero dish. It is the consistency of receiving balanced, comforting meals that reduce planning stress while still keeping taste and texture interesting.'
      ),
    ],
  },
  {
    id: 'post-3',
    slug: 'overcoming-baby-blues-a-guide-for-new-moms-to-thrive-during-confinement',
    title: 'Overcoming Baby Blues: A Guide for New Moms to Thrive During Confinement',
    excerpt:
      'Drawn from the old blog content, this article centres on emotional support during confinement and the small routines that help mothers feel steadier in the early weeks.',
    category: 'Wellbeing',
    tags: [
      'confinement food',
      'confinement period',
      'healthy eating',
      'mental health',
      'nourishing food',
      'postpartum recovery',
    ],
    coverUrl: ARTICLE_IMAGES.wellbeing[0].src,
    createdAt: '2026-03-29T09:00:00+08:00',
    reference:
      'https://chillipadiconfinement.com/blogs/confinement-tips/battling-postpartum-blues-understanding-and-overcoming-postpartum-depression',
    blocks: [
      heading('Emotional recovery deserves structure too'),
      paragraph(
        'This piece takes its direction from the previous Chilli Padi article about baby blues and the emotional reality of postpartum adjustment. The message is that low mood, overwhelm, and mental fatigue can sit alongside physical recovery, and both deserve attention.'
      ),
      quote('Food is only one part of the picture, but routine can make a hard week feel less chaotic.'),
      paragraph(
        'Regular mealtimes, enough hydration, and dependable support at home can reduce friction in a period that already feels unpredictable. The emotional benefit is often practical rather than dramatic: fewer decisions, fewer missed meals, and more moments of steadiness.'
      ),
      gallery(ARTICLE_IMAGES.wellbeing, 'Postpartum support works best when nutrition and practical care move together.'),
      paragraph(
        'The article ultimately points mothers back to support systems: rest where possible, share the workload, speak up early, and treat emotional recovery as a real part of confinement rather than an afterthought.'
      ),
    ],
  },
  {
    id: 'post-4',
    slug: 'the-science-behind-confinement-food',
    title: 'The Science Behind Confinement Food: How It Can Improve Your Postpartum Recovery',
    excerpt:
      'Based on the earlier confinement-food article, this post reframes traditional meal planning through digestion, hydration, warmth, and day-to-day recovery support.',
    category: 'Recovery',
    tags: [
      'confinement food',
      'confinement period',
      'confinement snacks',
      'mental health',
      'nourishing food',
      'postpartum recovery',
    ],
    coverUrl: ARTICLE_IMAGES.science[0].src,
    createdAt: '2026-03-25T09:00:00+08:00',
    reference:
      'https://chillipadiconfinement.com/blogs/confinement-tips/the-science-behind-confinement-food-how-it-can-improve-your-postpartum-recovery',
    blocks: [
      paragraph(
        'The original article explains confinement food in practical terms rather than purely cultural ones. Meals are designed to feel easier to digest, provide steady energy, and support the everyday work of healing after childbirth.'
      ),
      heading('Why the food logic still matters'),
      list([
        'Warm meals are easier to build into daily routines',
        'Protein and broth support sustained recovery',
        'Structured menus reduce mental load',
        'Stage-based planning helps meals evolve with the month',
      ]),
      image(ARTICLE_IMAGES.science[1], 'A structured meal plan works because it simplifies daily recovery decisions.'),
      paragraph(
        'Warm soups, balanced proteins, vegetables, and staged meal planning all contribute to that logic. Instead of treating confinement food as a strict list of dos and donts, the article frames it as an organised recovery system.'
      ),
      callout(
        'What modern mothers usually care about',
        'Less meal stress, more consistency, and a diet that supports recovery without being complicated to follow.'
      ),
    ],
  },
  {
    id: 'post-5',
    slug: 'why-papaya-fish-soup-is-good-for-confinement-mothers',
    title: 'Why Papaya Fish Soup Is Good For Confinement Mothers',
    excerpt:
      'Referenced from the previous site, this article looks at why papaya fish soup remains a popular confinement choice for mothers seeking a warm and nourishing dish.',
    category: 'Breastfeeding',
    tags: ['confinement food', 'confinement period', 'healthy eating', 'nourishing food', 'postpartum recovery'],
    coverUrl: ARTICLE_IMAGES.papaya[0].src,
    createdAt: '2026-03-20T09:00:00+08:00',
    reference:
      'https://chillipadiconfinement.com/blogs/confinement-tips/why-papaya-fish-soup-is-good-for-confinement-mothers',
    blocks: [
      paragraph(
        'Papaya fish soup appears in many confinement menus because it feels light, warm, and nourishing at the same time. The earlier blog positioned it as a practical dish for mothers who want comfort without an overly rich meal.'
      ),
      gallery(ARTICLE_IMAGES.papaya, 'Papaya fish soup remains one of the most recognisable confinement dishes.'),
      heading('Why it stays popular'),
      list([
        'Easy to eat on lower-appetite days',
        'Warm and soup-based, which supports hydration',
        'Simple to pair with a wider meal set',
        'Associated with breastfeeding support in many households',
      ]),
      paragraph(
        'Its appeal also comes from routine. Soups are easy to portion, easy to pair with other dishes, and often easier to finish during periods when appetite is uneven. That makes them useful in real postpartum schedules, not just in theory.'
      ),
      quote(
        'Whether families choose it for tradition, hydration, or breastfeeding support, the bigger point is consistency.'
      ),
    ],
  },
  {
    id: 'post-6',
    slug: '10-reasons-why-confinement-food-delivery-services-are-essential-for-postpartum-recovery',
    title: '10 Reasons Why Confinement Food Delivery Services Are Essential For Postpartum Recovery',
    excerpt:
      'This updated local version takes cues from the older blog article and focuses on why meal delivery matters operationally, not just nutritionally, during confinement.',
    category: 'Planning',
    tags: ['confinement food', 'confinement period', 'healthy eating', 'nourishing food', 'postpartum recovery'],
    coverUrl: ARTICLE_IMAGES.delivery[0].src,
    createdAt: '2026-03-16T09:00:00+08:00',
    reference:
      'https://chillipadiconfinement.com/blogs/confinement-tips/10-reasons-why-confinement-food-delivery-services-are-essential-for-postpartum-recovery',
    blocks: [
      heading('Why delivery support is more than convenience'),
      paragraph(
        'The reference article argues that confinement delivery is valuable because it removes planning, shopping, prep, and clean-up from a period when families already have too much to manage. That reduction in mental load is one of the biggest advantages of a meal programme.'
      ),
      gallery(ARTICLE_IMAGES.delivery, 'Delivery services matter when they protect time and energy, not just appetite.'),
      list([
        'Meals arrive without grocery planning',
        'Families spend less time cooking and cleaning',
        'The recovery routine becomes more predictable',
        'Mothers can conserve energy for rest and feeding',
      ]),
      paragraph(
        'A delivery service also brings consistency. Mothers do not need to decide every day whether food will be warm enough, suitable enough, or ready on time. The routine itself becomes part of the support system.'
      ),
      callout(
        'The real benchmark',
        'The strongest services combine reliable logistics with menus that still feel varied and recovery-aware.'
      ),
    ],
  },
  {
    id: 'post-7',
    slug: 'snacks-for-confinement-and-breastfeeding-munchies',
    title: 'Snacks for Confinement and Breastfeeding Munchies',
    excerpt:
      'Using the earlier article as reference, this post covers snack choices that feel realistic for mothers who need quick energy between meals during confinement and breastfeeding.',
    category: 'Breastfeeding',
    tags: [
      'confinement food',
      'confinement period',
      'confinement snacks',
      'healthy eating',
      'nourishing food',
      'postpartum recovery',
    ],
    coverUrl: ARTICLE_IMAGES.snacks[0].src,
    createdAt: '2026-03-11T09:00:00+08:00',
    reference:
      'https://chillipadiconfinement.com/blogs/confinement-tips/snacks-for-confinement-and-breastfeeding-munchies',
    blocks: [
      paragraph(
        'The older blog framed snacking as a practical need rather than a guilty habit. During confinement and breastfeeding, hunger often appears at irregular times, so having quick options available helps mothers avoid long stretches without food.'
      ),
      heading('The best snack choices are usually the simplest ones'),
      list([
        'Easy to reach for while caring for baby',
        'Warm or gentle enough for postpartum comfort',
        'Supportive of the wider meal routine',
        'Flexible enough for uneven feeding schedules',
      ]),
      image(ARTICLE_IMAGES.snacks[0], 'Simple, nourishing dishes work well when mothers need quick energy between meals.'),
      paragraph(
        'Useful snacks are the ones that are easy to reach for, gentle on the stomach, and consistent with the broader meal plan. That usually means warm drinks, simple nourishing bites, and options that complement rather than replace proper meals.'
      ),
      quote(
        'The point is not to snack constantly. It is to make energy support more flexible on unpredictable days.'
      ),
    ],
  },
  {
    id: 'post-8',
    slug: 'confinement-food-planning-natural-vs-c-section-births',
    title: 'Confinement Food Planning: Natural vs. C-Section Births',
    excerpt:
      'Adapted from the previous article archive, this piece compares how meal planning may need to shift depending on delivery type and recovery pace.',
    category: 'Planning',
    tags: ['confinement food', 'confinement period', 'healthy eating', 'nourishing food', 'postpartum recovery'],
    coverUrl: ARTICLE_IMAGES.planning[0].src,
    createdAt: '2026-03-07T09:00:00+08:00',
    reference:
      'https://chillipadiconfinement.com/blogs/confinement-tips/confinement-food-planning-natural-vs-c-section-births',
    blocks: [
      heading('Recovery plans should flex with the birth experience'),
      paragraph(
        'The source article uses a straightforward planning lens: recovery needs are not identical after every birth, so meal pacing and expectations should account for that. A c-section recovery may call for different practical support than an uncomplicated vaginal delivery.'
      ),
      callout(
        'What stays constant',
        'The core goals still include warmth, hydration, manageable digestion, and reliable nourishment.'
      ),
      gallery(ARTICLE_IMAGES.planning, 'Planning works best when the menu supports the real pace of recovery.'),
      paragraph(
        "That does not mean completely different food philosophies. What changes is how carefully the plan is adjusted to the mother's condition and comfort."
      ),
      paragraph(
        'A better confinement menu is therefore flexible rather than rigid. It gives families enough structure to feel supported while still leaving room for real recovery timelines and medical advice.'
      ),
    ],
  },
  {
    id: 'post-9',
    slug: 'benefits-of-red-dates-tea-for-confinement-mothers',
    title: 'What Are The Benefits of Red Dates Tea for Confinement Mothers',
    excerpt:
      'This article takes reference from the previous blog and explains why red dates tea is often included in confinement routines as a warming hydration option.',
    category: 'Nutrition',
    tags: ['confinement', 'confinement food', 'confinement period', 'nourishing food', 'red dates tea with longan'],
    coverUrl: ARTICLE_IMAGES.tea[0].src,
    createdAt: '2026-03-03T09:00:00+08:00',
    reference:
      'https://chillipadiconfinement.com/blogs/confinement-tips/what-are-the-benefits-of-red-dates-tea-for-confinement-mothers',
    blocks: [
      paragraph(
        'The earlier site article positioned red dates tea as more than a traditional add-on. It was presented as a practical way to encourage warm fluid intake during confinement, especially for mothers who prefer something gentler than plain water.'
      ),
      image(ARTICLE_IMAGES.tea[1], 'Warm drink routines are easier to maintain when thermal ware keeps beverages accessible.'),
      heading('Why the ritual matters'),
      list([
        'Encourages regular warm fluid intake',
        'Fits naturally between lunch and dinner',
        'Feels gentler than forcing large amounts of cold water',
        'Adds a repeatable recovery ritual to the day',
      ]),
      quote(
        'As with many confinement foods, the value is cumulative. One tea does not define recovery, but small rituals can make nourishment easier to maintain.'
      ),
      paragraph(
        'Its popularity also comes from habit and routine. A warm drink can be an easy anchor throughout the day, particularly when meals arrive at set times and the rest of the schedule feels less predictable.'
      ),
    ],
  },
];

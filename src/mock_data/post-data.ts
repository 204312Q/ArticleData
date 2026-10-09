import type { PostItemData, PostImageAsset, PostContentBlock } from 'src/lib/post/types';
import { it } from 'zod/v4/locales';

const ARTICLE_IMAGES = {
  tcm: [
    { src: '/banners/Confinement_Menu_Banner.png', alt: 'Confinement meal spread' },
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
      'Hey there! Are you curious to know how Traditional Chinese Medicine (TCM) can play a significant role in the confinement period? Well, you\'ve come to the right place! In this article, we\'ll delve into the world of TCM and explore its benefits, challenges, and tradeoffs when it comes to postnatal care and recovery.',
    category: 'Recovery',
    tags: ['confinement food', 'confinement period', 'mental health', 'postpartum recovery'],
    coverUrl: ARTICLE_IMAGES.tcm[0].src,
    createdAt: '2026-04-03T09:00:00+08:00',
    reference:
      'https://chillipadiconfinement.com/blogs/confinement-tips/exploring-the-role-of-tcm-traditional-chinese-medicine-in-confinement',
    blocks: [
      heading('Traditional Chinese Medicine and Confinement: A Perfect Pairing?'),
      paragraph(
        ' Whether you\'re a new mom or someone interested in the wonders of TCM, this article will provide you with valuable insights and tips to strike the perfect balance between tradition and modernity. So, grab a cuppa and let\'s get started!'
      ),
      callout(
        'A practical lens',
        'The value is not in following every traditional rule. It is in choosing rituals that make recovery feel calmer, warmer, and easier to sustain.'
      ),
      gallery(ARTICLE_IMAGES.tcm, 'Images from the current project used to support the TCM recovery theme.'),
      paragraph(
        'Confinement, deeply rooted in traditional cultures, encompasses various practices aimed at facilitating postpartum recovery. TCM, with its centuries-old wisdom and natural approaches, aligns harmoniously with the principles of confinement. Let\'s explore how TCM complements confinement practices:'
      ),
      list([
        '1. **Restoring Qi (Life Energy)**: TCM believes that childbirth depletes a mother\'s Qi. Through the use of acupuncture, herbal remedies, and dietary adjustments, TCM aims to replenish and restore the body\'s vital energy, fostering overall well-being.',
        '2. **Enhancing Blood Circulation**: Blood circulation plays a crucial role in the healing process after childbirth. TCM methods such as postnatal massages and herbal baths can help improve blood flow, reduce swelling, and relieve pain, aiding in a faster recovery.',
        '3. **Balancing Hormones**: TCM recognizes the importance of hormone balance during the confinement period. Herbal medicines and dietary recommendations are tailored to regulate hormone levels, reducing the chances of postpartum mood swings and other related issues',
      ]),
      quote(
        'The strongest confinement plan respects tradition without turning recovery into a rulebook.'
      ),
      heading('Nurturing the Body and Mind'),
      paragraph(
        'Aside from physical recovery, TCM also emphasizes the importance of nurturing the mind and emotional well-being during confinement. Here\'s how TCM can lend a helping hand'
      ),
      list([
        '1. **Restoring Balance**: TCM views the body as an interconnected system, and childbirth disrupts this delicate balance. TCM treatments, such as acupuncture and herbal remedies, aim to restore harmony, promote healing, and enhance overall well-being.',
        '2. **Nourishing the Body**: TCM recognizes the importance of proper nutrition and the use of specific herbs and tonics to replenish vital energy and support postpartum recovery. These nourishing practices can help address fatigue, boost immunity, and promote healthy milk production.',
        '3. **Emotional Support**: The postpartum period can bring about a whirlwind of emotions. TCM offers various techniques, including herbal remedies and mind-body practices like meditation and qigong, to support emotional well-being and reduce stress and anxiety.',
      ]),
      paragraph(
        'The key takeaway is balance. A thoughtful confinement plan can respect tradition while still making space for informed decisions, personal comfort, and advice from qualified practitioners when needed.'
      ),
      heading('Challenges and Tradeoffs In Incorporating TCM'),
      list([
        '1. **Limited Scientific Evidence:** While TCM has a rich historical background, the scientific evidence supporting its effectiveness in postpartum recovery is still evolving. It\'s important to approach TCM as a complementary approach, supplementing it with evidence-based practices and consulting healthcare professionals to make informed decisions. ',
        '2. **Individual Variations:** Every person is unique, and what works for one may not work for another. TCM treatments are highly personalized, taking into account individual characteristics, symptoms, and medical history. It\'s crucial to consult with a qualified TCM practitioner who can tailor treatments to your specific needs. ',
        '3. **Safety Considerations:** TCM encompasses a vast array of herbal remedies, and some herbs may have potential interactions with medications or specific health conditions. Open communication with your healthcare provider and a qualified TCM practitioner is vital to ensure a safe and effective experience.',
      ]),
      heading('FAQs about TCM in Confinement'),
      
      list([
        '**Q: Can I use TCM alongside Western medicine during confinement?**',
        'A: Yes, many women find that combining TCM with Western medicine can provide comprehensive care. However, it\'s important to inform both your healthcare provider and TCM practitioner about all treatments you are receiving to avoid any potential interactions.',
        '**Q: Are there any specific TCM practices to avoid during confinement?**',
        'A: Certain TCM practices, such as intense detoxification methods or certain herbal remedies, may not be suitable during the postpartum period. It\'s important to work with a qualified TCM practitioner who specializes in postpartum care to create a tailored treatment plan that aligns with your specific needs.',
        '**Q: Can TCM help with postpartum depression?**',
        'A: TCM takes a holistic approach to address emotional well-being, including postpartum depression. Herbal remedies, acupuncture, and mind-body practices prescribed by a qualified TCM practitioner can provide support and complement other forms of treatment.',
      ]),

      heading('Conclusion'),
      paragraph('Incorporating Traditional Chinese Medicine (TCM) into the practice of confinement offers a potential path to holistic postpartum recovery. It emphasises restoring balance, nourishing the body, and supporting emotional well-being.'),
      paragraph('However, it\'s important to balance the benefits with the tradeoffs and challenges associated with TCM, such as limited scientific evidence and individual variations. By making informed decisions, consulting qualified practitioners, and maintaining open communication with healthcare providers, you can navigate the world of TCM in confinement with confidence.'),
      paragraph('Remember, every journey is unique, and finding the right balance is key to your well-being. Wishing you a fulfilling and rejuvenating postpartum experience!')
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
      paragraph('Giving birth is a beautiful and transformative experience, but it can also be exhausting and challenging for new mothers. Your body goes through a lot during pregnancy and childbirth, and it needs time to recover and heal. One way to support your postpartum recovery is by eating nutritious and healing meals, especially during the confinement period.'
      ),
      paragraph('Chinese confinement meals are a popular tradition that has been passed down from generation to generation. These meals are designed to nourish the body and promote healing, and they are packed with essential nutrients that can help boost your energy levels'
      ),
      paragraph('In this article, we\'ve put together a list of 5 delicious Chinese confinement meals that are perfect for new mothers who need an energy boost.'
      ),
      heading('Top 5 Chinese Confinement Meals To Boost Your Energy'),
      
      image(
        {
          src: '/dishes/OneDrive_1_9-24-2026/IMG_0170_Chicken Soup.jpg',
          alt: 'Confinement dish',
          objectPosition: 'center 70%',
        },
      ),
      {type:'pinkHeading',
         text:'Black Chicken Ginseng Soup',
      },
      paragraph(
        'Black Chicken Ginseng Soup is rich in essential nutrients, including protein, vitamins, and minerals, that can help to boost energy levels, promote healing, and nourish the body. It is particularly beneficial for confinement mothers as it helps to replenish lost nutrients during childbirth and breastfeeding.'
      ),

      list([ 
        '**Ingredients:**',
        '**•** 1 whole black chicken (around 1.2kg)',
        '**•** 30g ginseng root',
        '**•** 10 red dates',
        '**•** 5g wolfberries',
        '**•** 5g dried longan',
        '**•** 3 slices of ginger',
        '**•** 2 cloves of garlic',
        '**•** 2 tbsp rice wine',
        '**•** 10 cups of water'
      ]),

      list([
        '**Preparation:**',
        '1. Soak the ginseng root in cold water for 30 minutes to an hour. This will help to soften the root and make it easier to handle.',
        '2. Rinse the black chicken and remove any excess fat. Then, blanch the chicken in boiling water for 5 minutes to remove any impurities.',
        '3. Rinse the red dates, wolfberries, and dried longan in cold water.',
        '4. Peel and slice the ginger and garlic.'
      ]),

      list([
        '**Cooking Method:**',
        '1. In a large pot, add the blanched chicken, soaked ginseng root, red dates, wolfberries, dried longan, ginger, and garlic.',
        '2. Pour in 10 cups of water and bring the pot to a boil over high heat.',
        '3. Once the water is boiling, reduce the heat to low and simmer the soup for 2 to 3 hours, until the chicken is tender and the soup is flavorful.',
        '4. Halfway through cooking, add 2 tbsp of rice wine to the pot to enhance the flavor of the soup.',
        '5. Once the soup is done, turn off the heat and let it cool slightly.',
        '6. Strain the soup and discard the solids.',
        '7. Serve the soup hot with some steamed rice or on its own.'
      ]),

      list([
        '**Q: Can I use a regular chicken instead of a black chicken?**',
        'A: While you can use a regular chicken to make this soup, a black chicken is preferred as it has a richer and more intense flavor.',
        '**Q: How long can I keep the soup in the fridge?**',
        'A: You can keep the soup in the fridge for up to 3 days. To reheat, simply bring the soup to a boil over low heat.',
      ]),

      {type:'pinkHeading', text: 'Black Bean Pork Ribs Soup'},

      paragraph('A nourishing and flavourful dish, this soup is rich in protein, vitamins, and minerals, making it an excellent choice for new moms who need to replenish their bodies after childbirth.'
      ),

      list([
        '**Ingredients:**',
        '**•** 500g pork ribs',
        '**•** 1 cup dried black beans',
        '**•** 2-3 slices of ginger',
        '**•** 1 tablespoon Shaoxing wine',
        '**•** 1 tablespoon soy sauce',
        '**•** 1 teaspoon salt',
        '**•** 8 cups water',
        '**•** Optional: 2-3 dried red dates, 2-3 dried shiitake mushrooms'
      ]),

      list([
        '**Directions:**',
        '**1.** Soak the black beans in water for at least 2 hours or overnight. Drain and set aside.',
        '**2.** In a large pot, blanch the pork ribs in boiling water for 3-5 minutes to remove any impurities. Rinse and set aside.',
        '**3.** In the same pot, sauté the ginger until fragrant. Add the pork ribs and stir-fry until lightly browned.',
        '**4.** Add the black beans, Shaoxing wine, soy sauce, salt, and water to the pot. Bring to a boil, then reduce heat and simmer for 2-3 hours, or until the pork ribs are tender and the beans are soft.',
        '**5.** Optional: Add dried red dates and shiitake mushrooms during the last 30 minutes of cooking.',
        '**6.** Serve hot and enjoy!'
      ]),

      list([
        '**Tips and Tricks:**',
        '**•** Soaking the black beans in advance helps them cook faster and more evenly.',
        '**•** Blanching the pork ribs before cooking removes any impurities and improves the flavor of the soup.',
        '**•** Adding dried red dates and shiitake mushrooms can enhance the flavor and nutritional value of the soup.',
        '**•** Adjust the salt and soy sauce to taste.'
      ]),

      {type:'pinkHeading', 
      text: 'Steamed Threadfin with Black Fungus and Ginger'
     },

     paragraph('Steamed threadfin with black fungus and ginger is a popular dish for confinement mothers because of its health benefits. Here are some of the benefits of this nutritious dish:'
      ),

      list([
        '1. **Rich in protein** - Threadfin is a good source of protein, which is essential for muscle repair and growth',
        '2. **Boosts immunity** - Black fungus contains beta-glucans, a type of carbohydrate that can boost the immune system and fight off infections.',
        '3. **Anti-inflammatory** - Ginger has anti-inflammatory properties that can help reduce inflammation and swelling, making it an ideal ingredient for postpartum recovery.',
        '4. **Helps with digestion** - Sesame oil is high in antioxidants and can help promote healthy digestion.'
      ]),

      list([
        '**Ingredients:**',
        '**•** 1 medium-sized threadfin (about 500g)',
        '**•** 20g black fungus',
        '**•** 20g ginger, julienned',
        '**•** 2 tablespoons light soy sauce',
        '**•** 1 tablespoon sesame oil',
        '**•** 1 tablespoon Shaoxing wine',
        '**•** 1 teaspoon sugar',
        '**•** 1 tablespoon vegetable oil',
        '**•** 2 stalks scallions, chopped',
        '**•** 1 red chili, sliced (optional)'
      ]),

      list([
        '**Instructions:**',
        '1. Soak the black fungus in water for 30 minutes or until softened. Drain and cut into smaller pieces.',
        '2. Clean the threadfin and pat dry with paper towels. Make 3-4 shallow cuts on each side of the fish.',
        '3. In a bowl, mix together the light soy sauce, sesame oil, Shaoxing wine, and sugar. Set aside.',
        '4. In a wok or frying pan, heat the vegetable oil over medium heat. Add the ginger and stir-fry for 1-2 minutes until fragrant.',
        '5. Add the black fungus and stir-fry for another 2-3 minutes.',
        '6. Pour the soy sauce mixture into the wok and bring to a boil.',
        '7. Place the threadfin on a heatproof plate and pour the ginger and black fungus mixture over it.',
        '8. Steam the fish over high heat for 10-12 minutes or until fully cooked.',
        '9. Garnish with chopped scallions and sliced red chili (optional).'
      ]),

      {type:'pinkHeading', 
      'text': 'Stir-Fried Kai Lan with Pork Kidney'
     },
      paragraph('Pork kidney is a good source of protein, vitamin B12, and iron, all of which are important for postpartum recovery. Kai lan is also packed with vitamins A, C, and K, as well as calcium and fiber.'
      ),
      
      list([
        '**Ingredients:**',
        '**•** 500g kai lan (Chinese broccoli)',
        '**•** 2 cloves of garlic, chopped',
        '**•** 1 tablespoon of ginger, grated',
        '**•** 1 tablespoon of light soy sauce',
        '**•** 1 teaspoon of sesame oil',
        '**•** 1 tablespoon of vegetable oil',
        '**•** Salt and pepper to taste'
      ]),

      list([
        '**Instructions:**',
        '1. Preparing the pork kidney: Rinse the pork kidney thoroughly under running water and cut into thin slices. Soak the slices in cold water for 30 minutes to remove any impurities and excess blood. Drain and pat dry with a paper towel.',
        '2. Preparing the kai lan: Wash the kai lan thoroughly under running water and chop into bite-sized pieces, separating the leaves from the stems.',
        '3. In a wok or frying pan, heat up the vegetable oil over high heat. Add the garlic and ginger and stir-fry for 30 seconds until fragrant.',
        '4. Add the pork kidney slices and stir-fry for 3-4 minutes until they turn golden brown.',
        '5. Add the kai lan stems and continue to stir-fry for another 2-3 minutes until they are tender.',
        '6. Finally, add the kai lan leaves, light soy sauce, and sesame oil, and stir-fry for another 1-2 minutes until the leaves are wilted but still bright green.',
        '7. Season with salt and pepper to taste and serve hot.'
      ]),

      list([
        '**Q: Can I use other types of meat instead of pork kidney?**',
        'A: Yes, you can use chicken or beef if you prefer. However, pork kidney is a traditional ingredient in this dish and is particularly beneficial for postpartum recovery.',
        '**Q: Can I substitute kai lan with other vegetables?**',
        'A: Yes, you can use other leafy greens such as bok choy or choy sum if kai lan is not available.',
      ]),
      
      callout(
        'Menu planning principle',
        'For a meal programme, the real value is not one hero dish. It is the consistency of receiving balanced, comforting meals that reduce planning stress while still keeping taste and texture interesting.'
      ),

      {type: 'pinkHeading', text: 'Dang Gui Herbal Chicken Soup'},
      paragraph('Dang Gui, also known as Chinese Angelica Root, is a popular herb used in traditional Chinese medicine. It\'s known for its ability to promote blood circulation, regulate menstruation, and nourish the blood.'
      ),
      paragraph('When combined with other nourishing ingredients such as dried longan, goji berries, and red dates, Dang Gui Herbal Chicken Soup becomes a powerful dish that aids in postpartum recovery. The soup is believed to:'
      ),

      list([
        '**•** Help with blood circulation and promote healing',
        '**•** Nourish the blood and boost energy levels',
        '**•** Aid in digestion and relieve constipation',
        '**•** Improve the immune system and fight against infections',
      ]),

      list([
        '**Ingredients**',
        '  **•** 1 whole chicken (about 1k g)',
          '**•** 50g Dang Gui (Chinese Angelica Root)' ,
          '**•** 20g Dried Longan', 
          '**•** 10g Goji Berries' ,
          '**•** 20g Red Dates' ,
          '**•** 2 slices of ginger' ,
          '**•** 10 cups of water',
          '**•** Salt to taste',
      ]),

      list([
        '**Instructions**',
        '1. Rinse the chicken and remove any excess fat or organs. Place it in a pot of boiling water for 5 minutes to remove any impurities. Remove and set aside.',
        '2. Rinse all the herbs and dried fruits.',
        '3. In a clean pot, add 10 cups of water and bring it to a boil.',
        '4. Add the chicken, Dang Gui, dried longan, goji berries, red dates, and ginger to the pot.',
        '5. Bring the soup to a boil again, then reduce the heat to low and let it simmer for 2 hours.',
        '6. Add salt to taste and serve hot.',
      ]),

      paragraph ('There you have it! These 5 Chinese confinement meals offer a delicious and nutritious way to support your postpartum recovery journey. Incorporate them into your diet, along with plenty of rest and relaxation, and you\'ll be on your way to feeling energised and healthy in no time.'
      ),

      heading('FAQS FOR CHINESE CONFINEMENT MEALS'),
      
      list([
        '**Are these confinement meals suitable for everyone?**',
        'While these meals are traditionally eaten by new mothers during their postpartum period, they can be enjoyed by anyone looking to improve their health and wellbeing. ',
        '**Can I eat these meals if I am not of Chinese descent**?',
        'Yes, these meals can be enjoyed by people of all ethnic backgrounds. They are simply traditional Chinese dishes that have been used for centuries to promote postpartum recovery and general health.',
        '**Can I make substitutions or changes to the recipes?**',
        'Absolutely! These recipes can be adapted to suit your personal preferences or dietary restrictions. For example, you can substitute pork for chicken, or use a different type of fish.',
        '**How long should I continue to eat these confinement meals?**',
        'The length of the postpartum confinement period varies among cultures and individuals. It is typically recommended to continue to eat these meals for at least the first month after childbirth, but it is important to consult with your healthcare provider for guidance on the appropriate length of time for your specific situation.'
      ]),
      
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

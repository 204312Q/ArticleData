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
    { src: '/assets/background/confinement_group_shot.png', alt: 'Overcoming Baby Blues' },
    { src: '/addons/Addon_ComfortingSet.webp', alt: 'Comforting postpartum add-on set' },
  ],
  science: [
    { src: '/banners/Confinement_Banner_1.png', alt: 'Science behind Confinement food' },
    { src: '/menu/product-2.jpg', alt: 'Prepared confinement dish' },
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
      src: '/assets/popularDish/Snacks_for_Confinement_and_Breastfeeding_Munchies.png',
      alt: 'Snacks for Confinement and Breastfeeding',
    },
    { src: '/assets/popularDish/Avoid_during_Confinement_and_Breastfeeding.png', 
      alt: 'Snacks to Avoid during Confinement and Breastfeeding' 
    },
  ],
  planning: [
    { src: '/banners/Confinment_Meal.png', alt: 'Postpartum planning hero image' },
    { src: '/addons/Addon_ComfortingSet.webp', alt: 'Comforting set for recovery planning' },
  ],
  tea: [
    { src: '/banners/Confinement_Banner_3.jpg', alt: 'Warm recovery drink banner' },
    { src: '/addons/Addon_ThermalWare.webp', alt: 'Thermal ware for warm drinks' },
  ],
  anxiety: [
    { src: '/banners/Anxiety.png', alt: 'Overcoming Anxiety and Stress'}
  ],
  postpartum: [
  { src: '/banners/Postpartum_Expectations_Versus_Reality.png' , alt: 'Post Partum Expectations Vs Reality' }
  ],
  weightLoss: [
    { src: '/banners/Weight_Loss.png' , alt: 'Tips to Lose Weight Safely'},
    { src: '/banners/safe_exercise.png' , alt: 'Safe Exercises'},
    { src: '/banners/massage.png' , alt: 'PostNatal Massage'},
  ],
  babysleep: [
    { src: '/banners/baby_sleep_tips.png' , alt: 'Establishing Healthy Sleep Patterns for Your Little One'},
  ],
  swelling: [
    { src: '/banners/Soothe_Swell_Pregnancy.png' , alt: 'Soothe Swelling During Pregnancy'}
  ]


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

const table = (
  rows: {
    birth: string;
    avoid: string;
    eat: string;
  }[]
): PostContentBlock => ({
  type: 'table',
  rows,
});

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
          objectPosition: 'center 75%'
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
      'As a new mother, you may have heard of the term "baby blues." It\'s a common condition that many new mothers experience after giving birth. It is estimated that up to 80% of new mothers experience some form of baby blues, making it a normal and expected part of the postpartum period.',
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
      paragraph('However, it is important for new mothers and their loved ones to be aware of the symptoms and to know how to manage them in order to prevent them from developing into more serious forms of postpartum depression.'),
      heading('What is baby blues?'),
      paragraph('Baby blues is a mild and transient form of postpartum depression that typically begins within the first few days after giving birth and lasts for up to two weeks.'),
      paragraph('The symptoms of baby blues can range from mild to moderate and include:'),
      list([
        '**•** Mood swings',
        '**•** Feelings of sadness, anxiety, or irritability',
        '**•** Crying spells for no apparent reason',
        '**•** Difficulty sleeping or sleeping too much',
        '**•** Loss of appetite or overeating',
        '**•** Fatigue and lack of energy',
        '**•** Difficulty concentrating or making decisions',
        '**•** Feelings of guilt or worthlessness',
        '**•** Reduced interest in activities that were previously enjoyed',
      ]),
      gallery(ARTICLE_IMAGES.wellbeing, 'Postpartum support works best when nutrition and practical care move together.'),
      heading('WHAT CAUSES BABY BLUES?'),
      paragraph('The exact cause of baby blues is not fully understood, but it is believed to be caused by a combination of hormonal changes, physical exhaustion, and the emotional adjustment to motherhood.'),
      paragraph('During pregnancy, the levels of estrogen and progesterone in a woman\'s body increase significantly, and after giving birth, these levels drop rapidly. This sudden hormonal shift can lead to mood swings and other emotional changes.'),
      paragraph('In addition to hormonal changes, the physical demands of childbirth and caring for a newborn can be exhausting, leading to fatigue and difficulty sleeping.'),
      paragraph('All these factors and the emotional adjustment to motherhood can also be challenging, as new mothers are faced with a range of new responsibilities, worries, and anxieties.'),
      quote('Food is only one part of the picture, but routine can make a hard week feel less chaotic.'),
      heading('HOW LONG DOES BABY BLUES LAST?'),
      paragraph('Baby blues typically begins within the first few days after giving birth and lasts for up to two weeks. During this time, new mothers may experience a range of emotional and physical symptoms that are generally mild and transient.'),
      paragraph('If the symptoms persist or worsen after two weeks, it may be a sign of postpartum depression and should be addressed with a healthcare provider.'),

      heading('HOW TO MANAGE BABY BLUES?'),
      paragraph('Fortunately, there are several things that new mothers can do to manage the symptoms of baby blues and help prevent them from developing into more serious forms of postpartum depression.'),
      list([
        'Here are some strategies that may be helpful:',
        '',
        '**Rest and sleep:** Getting adequate rest and sleep is important for new mothers, as it can help alleviate fatigue and improve mood. It may be helpful to nap when the baby naps, or to enlist the help of a partner or loved one to take care of the baby so that the mother can rest.',
        '**Eat a healthy diet:** Eating a healthy and balanced diet can help support overall health and wellbeing, and may also improve mood. It may be helpful to plan and prepare healthy meals and snacks in advance, or to ask for help from loved ones.',
        '**Exercise:** Exercise can help alleviate stress and improve mood, and may also provide an opportunity for social interaction. Start with gentle exercises, such as walking or yoga, and gradually increase intensity as strength and energy levels allow.',
        '**Seek support:** It is important for new mothers to seek support from loved ones, healthcare providers, or support groups. Talking to other mothers who have experienced baby blues or postpartum depression can be particularly helpful, as they may have tips and advice for managing symptoms and coping with the challenges of motherhood.',
        '',
        ' Support groups or therapy sessions can also provide a safe space for new mothers to discuss their feelings and concerns.',
        '',
        '**Practice self-care**: Taking time for self-care can help new mothers feel refreshed and rejuvenated. This can include activities such as taking a warm bath, reading a book, or spending time outdoors.',
        '**Stay connected**: Feeling isolated or disconnected from others can contribute to feelings of sadness and anxiety. Stay connected with family and friends, either in person or through phone calls or video chats.',
        ' Joining a new mother\'s group or attending classes with other new parents can also provide opportunities for social interaction and support.',
        '',
        ' Dealing with baby blues is a common experience for many new mothers, but it doesn\'t have to define your postpartum journey. By recognising the symptoms, understanding the causes, and implementing effective strategies for managing and overcoming baby blues, you can navigate this emotional period with confidence and resilience.',
        '',
        ' Remember, you are not alone in this journey. Reach out to your support system, whether it\'s your partner, family, or friends, and don\'t hesitate to seek professional help if needed',
      ]),
      paragraph(
        'This piece takes its direction from the previous Chilli Padi article about baby blues and the emotional reality of postpartum adjustment. The message is that low mood, overwhelm, and mental fatigue can sit alongside physical recovery, and both deserve attention.'
      ),
      quote('Give yourself grace, embrace the journey, and remember that you deserve love, rest, and healing, too.'),
      paragraph(
        'Our confinement meal packages offer a wide selection of confinement dishes that nourish and replenish body. Check out our confinement food packages to now!'
      ),
    ],
  },

  {
    id: 'post-4',
    slug: 'the-science-behind-confinement-food',
    title: 'The Science Behind Confinement Food: How It Can Improve Your Postpartum Recovery',
    excerpt:
      'Being a new mom can be overwhelming, and the confinement period can make things more challenging. Your body is recovering from childbirth, and you\'re learning to care for a newborn.',
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
      paragraph('It\'s crucial to prioritise your well-being during this time, including your mental health. While the benefits of confinement food have been widely acknowledged, research suggests that it can also positively impact mental health during the postpartum period.'),
      
      heading('Boost Energy Level'),
      paragraph('According to a study published in the Journal of Women\'s Health, women who consumed a higher intake of iron and protein had improved postpartum physical functioning, including better energy levels.'),
      paragraph('Confinement diet is rich in essential nutrients such as protein, iron, and complex carbohydrates that are crucial for postpartum recovery. Protein aids in repairing tissues, including the uterus, which undergoes significant changes during pregnancy and childbirth.'),
      paragraph('Iron is necessary for red blood cell production and preventing anemia, which can lead to fatigue and weakness.'),
      paragraph('Complex carbohydrates, such as brown rice and whole-grain bread, provide sustained energy, which is essential for new mothers who are often sleep-deprived.'),
      
      image({
        src: '/menu/product-2.jpg',
        alt: 'Herbal Red Tea',
        objectPosition: 'center 25%'
      }),
      
      heading('Reduce Stress Level'),
      paragraph('Ginger and turmeric are two spices commonly used to treat various ailments, including inflammation. Both spices contain bioactive compounds such as gingerol and curcumin, respectively, which have been shown to have anti-inflammatory effects.'),
      paragraph('Inflammation has been linked to various mental health conditions, including depression and anxiety. Therefore, consuming ginger and turmeric may help reduce inflammation, which, in turn, may help alleviate stress and anxiety.'),
      paragraph('Another dietary ingredient that has been shown to have mood-boosting effects is omega-3 fatty acids. Omega-3s are a type of polyunsaturated fatty acid found in oily fish such as salmon, mackerel, and sardines.'),
      paragraph('These fatty acids play a crucial role in maintaining brain function and are essential for the development and function of the nervous system.'),
      paragraph('A study published in the Journal of Affective Disorders investigated the effect of omega-3 supplementation on postpartum depression and anxiety. The study found that women who received omega-3 supplementation had a significant reduction in symptoms of depression and anxiety compared to those who received a placebo.'),
      
       callout(
        'How confinement food supports recovery',
        'Nutrient-rich meals provide protein, iron, and essential vitamins that help replenish nutrients, support healing, and restore energy after childbirth.'
      ),

      heading('Enhance Sleep Quality'),
      paragraph('Some of the foods included in confinement meals are known to promote relaxation and better sleep quality. Take warm milk and chamomile tea, for example. These ingredients are often added to the diet as they contain sleep-promoting compounds that can help you catch some much-needed zzz\'s.'),
      paragraph('And that\'s not all! Consuming whole-grain carbohydrates, like brown rice, can also improve sleep quality. A study published in the Journal of Sleep Research found that eating more dietary fiber, including whole-grain carbs, was linked to better sleep quality in adults.'),
      
      heading('Support Breast Feeding'),
      paragraph('Many new mothers struggle with milk production, and low milk supply is one of the most common reasons for supplementing with formula or giving up breastfeeding altogether.'),
      paragraph('Confinement food can support breastfeeding by including ingredients that are known to boost milk production.'),
      paragraph('For example, oats are rich in beta-glucan, a type of soluble fiber that has been shown to increase the production of prolactin, the hormone responsible for milk production. Fenugreek and fennel are other commonly used ingredients in confinement food that are believed to help boost lactation.'),

      heading('Conclusion'),
      paragraph('Consuming a healthy and balanced diet, such as confinement food, can help ensure that the mother\'s nutritional needs are met, which can help support her overall well-being and mental health.'),
      paragraph("Confinement food also often incorporates cooking methods that are gentle on the digestive system, such as boiling and steaming, which can help ease digestive discomfort that new mothers may experience."),
      paragraph('This is particularly important as the body undergoes many changes during the postpartum period, and the digestive system may be more sensitive than usual.'),
   
    ],
  },

  {
    id: 'post-5',
    slug: 'why-papaya-fish-soup-is-good-for-confinement-mothers',
    title: 'Why Papaya Fish Soup Is Good For Confinement Mothers',
    excerpt:
      'Papaya fish soup is a traditional dish that is highly recommended for confinement mothers. This nourishing soup is rich in essential nutrients that are vital for postpartum recovery. The combination of papaya and fish provides a wide range of health benefits that can help to enhance the healing process and promote good health in confinement mothers.',
    category: 'Breastfeeding',
    tags: ['confinement food', 'confinement period', 'healthy eating', 'nourishing food', 'postpartum recovery'],
    coverUrl: ARTICLE_IMAGES.papaya[0].src,
    createdAt: '2026-03-20T09:00:00+08:00',
    reference:
      'https://chillipadiconfinement.com/blogs/confinement-tips/why-papaya-fish-soup-is-good-for-confinement-mothers',
    blocks: [
      heading('Benefits of Papaya Fish Soup For Confinement Mothers'),
      list([
        '**Promotes Healing**',
        '',
        'During childbirth, the body undergoes a lot of stress and trauma. Papaya fish soup contains high levels of collagen, which can help to speed up the healing process and repair damaged tissue. It is also rich in vitamins A and C, which are essential for wound healing and tissue repair.',
       '',
        '**Nourishes the Body**',
        '',
        'Papaya fish soup is an excellent source of protein, which is essential for building and repairing tissues in the body. It also contains a variety of vitamins and minerals, including vitamin B12, iron, and calcium, which are important for overall health and wellbeing.',
        '',
        '**Boosts Breast Milk Production**',
        '',
        'Breastfeeding is an important part of postpartum recovery, and papaya fish soup is believed to help boost milk production. Papaya contains enzymes that can help to increase milk supply, while fish is rich in omega-3 fatty acids, which are important for the development of the baby\'s brain.',
        '',
        '**Provides Energy**',
       '',
        'New mothers often feel tired and exhausted during the confinement period. Papaya fish soup is a great source of energy, thanks to its high protein content and complex carbohydrates. It can help to keep you feeling full and energized throughout the day.',
        '',
        '**Improves Digestion**',
        '',
        'Many new mothers experience digestive issues during the postpartum period, such as constipation and bloating. Papaya fish soup contains enzymes that can help to improve digestion and reduce bloating. It is also a great source of fiber, which can help to promote regular bowel movements.',
       '',
        '**Boosts Immunity**',
       '',
        'The confinement period is a time when new mothers are more susceptible to infections and illnesses. Papaya fish soup is rich in antioxidants, which can help to boost the immune system and protect against infections. It is also a great source of vitamin C, which is essential for immune function.',
        '',
      ]),

      gallery(ARTICLE_IMAGES.papaya, 'Papaya fish soup remains one of the most recognisable confinement dishes.'),
      paragraph(
        'Papaya fish soup appears in many confinement menus because it feels light, warm, and nourishing at the same time. The earlier blog positioned it as a practical dish for mothers who want comfort without an overly rich meal.'
      ),
      
      heading('How to Prepare Papaya Fish Soup'),
      list([
        '**Ingredients:**',
        '**•** 1 papaya, peeled and chopped',
        '**•** 500g fish (such as cod or snapper), cut into chunks',
        '**•** 1 inch ginger, sliced',
        '**•** 3 cloves garlic, minced',
        '**•** 1 onion, chopped',
        '**•** 2 stalks spring onion, chopped',
        '**•** 2-3 red dates',
        '**•** 1 tablespoon cooking oil',
        '**•** Salt and pepper to taste',
        '**•** Water',
      ]),

      list([
        '**Instructions:**',
        '1. Heat up the cooking oil in a pot.',
        '2. Add the garlic, onion, and ginger and sauté until fragrant.',
        '3. Add the fish and cook for a few minutes.',
        '4. Add the chopped papaya, red dates, and enough water to cover the ingredients. Bring to a boil.',
        '5. Reduce heat and simmer for 20-30 minutes, or until the papaya is soft and the fish is cooked through.',
        '6. Add salt and pepper to taste.',
        '7. Garnish with chopped spring onions before serving.',
        '',
        'It can be consumed as a standalone meal or served as a side dish with rice or noodles. It is also important to consume a variety of other nutrient-dense foods such as fruits, vegetables, lean proteins, and whole grains to ensure optimal postpartum recovery.',
        '',
        'It is important to note that fish should be thoroughly cooked to avoid food poisoning. Raw or undercooked fish can contain harmful bacteria and parasites that can cause foodborne illnesses. Confinement mothers should ensure that the fish is cooked to an internal temperature of 145°F (63°C) and avoid consuming fish that has a strong odor or unusual color.',
        '',
        'In conclusion, papaya fish soup is a nutritious and delicious dish that offers a range of health benefits for confinement mothers. By incorporating this soup into their diets, confinement mothers can improve their nutrient intake, boost their immunity, and support their postpartum recovery. ',
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
      paragraph(
        'The reference article argues that confinement delivery is valuable because it removes planning, shopping, prep, and clean-up from a period when families already have too much to manage. That reduction in mental load is one of the biggest advantages of a meal programme.'
      ),
      gallery(ARTICLE_IMAGES.delivery, 'Delivery services matter when they protect time and energy, not just appetite.'),
      heading('10 REASONS WHY CONFINEMENT FOOD DELIVERY SERVICES ARE ESSENTIAL'),
      
      heading('1. Convenience'),
      paragraph('After surgery, patients may experience fatigue and limited mobility. The thought of cooking and preparing meals may seem overwhelming. This is where meal delivery services can help. By subscribing to a meal delivery service, patients can receive nutritious and healthy meals right to their doorstep. This saves them the hassle of grocery shopping and cooking.'),
      
      heading('2. Nutritious Meals'),
      paragraph('Recovering patients require a balanced diet with the right nutrients to support their healing process. Meal delivery services can provide a balanced diet that is rich in vitamins and minerals. The meals are designed to meet the specific dietary requirements of the patient.'),
      paragraph('For example, if the patient has undergone weight loss surgery, the meals may be low in calories and high in protein'),
      
      heading('3. Customisable Menus'),
      paragraph('Meal delivery services offer customisable menus that cater to the specific needs of the patient. Patients can choose meals based on their dietary restrictions and preferences.'),
      paragraph('For example, if the patient is vegetarian or gluten-free, they can choose meals that fit their dietary requirements. This ensures that the patient receives meals that they enjoy and are suitable for their recovery process.'),
      
      heading('4. Time-Saving'),
      paragraph('Recovering patients may have limited energy and time to spend on meal preparation. Meal delivery services can save them time by providing pre-made meals that require minimal preparation. This allows the patient to focus on their recovery process and rest.'),

      heading('5. Eliminates the Need for Grocery Shopping'),
      paragraph('After surgery, patients may not have the energy or ability to go grocery shopping. Meal delivery services eliminate the need for grocery shopping. The meals are delivered right to the patient\'s doorstep, saving them the hassle of going to the grocery store.'),

      heading('6. Helps with Portion Control'),
      paragraph('Portion control is crucial for recovering patients. Overeating can slow down the recovery process and cause discomfort. Meal delivery services provide pre-portioned meals that ensure the patient consumes the right amount of food. This helps with portion control and ensures that the patient receives the right amount of nutrients.'),

      heading('7. Provides Variety'),
      paragraph('Eating the same meals every day can be boring and unappetizing. Meal delivery services offer a variety of meals that cater to different tastes and preferences. This ensures that the patient receives a diverse range of meals that are delicious and enjoyable to eat.'),

      heading('8. Cost-Effective'),
      paragraph('Cooking meals from scratch can be expensive, especially if the patient requires specialized diets. Meal delivery services offer cost-effective solutions by providing pre-made meals that are affordable. This saves the patient money on groceries and reduces food waste.'),

      heading('9. Reduces Stress'),
      paragraph('Recovering from surgery can be stressful, both physically and emotionally. Meal delivery services can reduce the stress associated with meal preparation.'),
      paragraph('Patients can rest easy knowing that they will receive nutritious and healthy meals right to their doorstep. This allows them to focus on their recovery process and reduce stress levels.'),

      heading('10. Offers Peace of Mind'),
      paragraph('Meal delivery services offer peace of mind to the patient and their loved ones. They know that the patient is receiving healthy and nutritious meals that are designed to support their recovery process. This gives them one less thing to worry about and ensures that the patient receives the care they need.'),

      heading('Conclusion'),
      paragraph('Meal delivery services offer several benefits for post-surgery recovery. They provide convenience, nutritious meals, customizable menus, time-saving solutions, eliminate the need for grocery shopping, help with portion control, provide variety, are cost-effective, reduce stress, and offer peace of mind.'),

      paragraph(
        'A delivery service also brings consistency. Mothers do not need to decide every day whether food will be warm enough, suitable enough, or ready on time. The routine itself becomes part of the support system.'
      ),
      callout(
        'The real benchmark',
        'The strongest services combine reliable logistics with menus that still feel varied and recovery-aware.'
      ),
      paragraph('Ready to order confinement meals? Order our confinement food delivery service now to enjoy the discounted price!'),
    ],
  },
  {
    id: 'post-7',
    slug: 'snacks-for-confinement-and-breastfeeding-munchies',
    title: 'Snacks for Confinement and Breastfeeding Munchies',
    excerpt: 'Who doesn\'t sometimes crave sweet snacks? However, since you\'ll likely be undergoing confinement after delivery, you may wonder how you can still satisfy your cravings.',
    category: 'Breastfeeding.',
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
      heading('NUTRITIOUS SNACKS FOR CONFINEMENT MOTHERS'),
      paragraph(
        'If you\'re relying solely on confinement meals all the time to replenish your body nutrients, you might feel like snacking between meals. Here are some suggestions you could try to curb your cravings.'
      ),
      paragraph('Confinement and breastfeeding mothers require a nutrient-dense diet for energy and optimal healing. Snacks rich in iron, calcium, protein, and other essential nutrients are necessary to support the demands of breastfeeding. Nutritious snack options include fruits, nuts, yogurt, and whole-grain crackers. These food provide the necessary fuel to keep you going throughout the day without causing any energy crashes.'),
      paragraph('On the other hand, processed and sugary snacks should be avoided as they can cause inflammation in the body. It\'s advisable to prepare healthy snacks ahead of time so that you have them readily available when hunger strikes during the postpartum period.'),

      heading('Baked Sweet Potato Fries'),
      paragraph('Sweet potatoes are a rich source of vitamins, minerals, and fiber that can help with postpartum recovery. Baking the sweet potato fries instead of frying them makes them a healthier snack option, without sacrificing taste'),
      paragraph('Preparing sweet potato fries at home is also easy and can be seasoned with different herbs and spices for added flavor. Eating nutritious snacks like baked sweet potato fries can also help keep energy levels up during breastfeeding, making it an ideal snack choice for new mothers.'),

      heading('Greek Yogurt with Berries and Honey'),
      paragraph('A nutritious snack for confinement mothers that is both satisfying and easy to prepare is Greek yogurt with berries and honey. Greek yogurt is packed with protein, which can help keep you feeling full and energized.'),
      paragraph('Berries are a great addition to any snack as they are loaded with antioxidants and vitamins. Drizzle some honey on top for sweetness while also taking advantage of its antibacterial properties that may boost your immune system.'),

      image(ARTICLE_IMAGES.snacks[0], 'Simple, nourishing dishes work well when mothers need quick energy between meals.'),
      
      heading('Boiled Edamame with Sea Salt'),
      paragraph('Boiled edamame with sea salt is another great option as it is high in protein and fiber, providing necessary nutrients. Edamame also contains essential vitamins and minerals that are important for postpartum recovery. Adding sea salt to the boiled edamame gives an extra burst of flavour.'),
      paragraph('This snack is easy to make and can be enjoyed hot or cold. Additionally, it\'s a great option for breastfeeding mothers as edamame can help increase milk production.'),

      heading('Energy Bites with Oats and Dates'),
      paragraph('Energy bites made with oats and dates are a great choice as they provide a range of essential nutrients. Oats are a fantastic source of fiber that can help regulate digestion during the postpartum period. Dates are also packed with essential nutrients like iron and potassium, which can help boost energy levels.'),
      paragraph('Energy bites can be made ahead of time and stored in the fridge or freezer for quick and easy snacking. Other nutritious ingredients such as nuts, seeds, and dried fruits can be added to these bites to increase their nutritional value'),

      quote(
        'The point is not to snack constantly. It is to make energy support more flexible on unpredictable days.'
      ),

      heading('Trail Mix with Almonds and Dried Apricots'),
      paragraph('Almonds provide a good source of protein, fiber, and healthy fats that can help keep you full and satisfied. Meanwhile, dried apricots are rich in essential vitamins and minerals such as iron and potassium which are important for postpartum recovery.'),
      paragraph('Trail mix is also customizable to your taste preferences, making it a versatile snack option.'),

      heading('Baby Carrots with Peanut Butter'),
      paragraph('For busy moms during the postpartum period, baby carrots with peanut butter make for an easy and nutritious snack. The combination of baby carrots and peanut butter is a good source of protein and healthy fats that can help boost milk production during breastfeeding. Additionally, the vitamins and fiber in carrots can aid in digestion and promote overall health.'),
      paragraph('It\'s important to choose natural peanut butter without added sugars or hydrogenated oils for optimal health benefits. This delicious snack provides sustained energy throughout the day, making it a perfect choice for new mothers looking for a convenient and healthy snack option.'),

      heading('Whole-Grain Crackers with Cheese'),
      paragraph('It can be difficult to find healthy snack options that provide essential nutrients and fiber. Whole-grain crackers are a great option as they are easy to find at local stores and come in a variety of flavours. Pairing them with cheese adds protein and calcium to the snack, which is beneficial for breastfeeding mothers'),
      paragraph('To make this snack even more nutritious, whole-grain crackers can be paired with other healthy toppings like avocado or hummus.'),

      heading("SNACKS TO AVOID DURING CONFINEMENT AND BREASTFEEDING"),
      image(ARTICLE_IMAGES.snacks[1] , 'Snacks to avoid during Confinement and Breastfeeding'),
      paragraph('Snacks high in sugar or salt, and excessive caffeine should be avoided as they may harm the baby\'s health. Spicy and greasy foods can cause digestive discomfort and are best avoided. Alcohol consumption during breastfeeding can also transfer harmful substances to the baby through breast milk.'),
      paragraph('Furthermore, food allergies and intolerances should be considered as they can affect both the mother and the baby. While it may be tempting to indulge in unhealthy snacks, choosing healthy alternatives such as fruits or nuts will provide necessary nutrients to help with recovery after childbirth.'),

      heading('Processed Food'),
      paragraph('Processed snacks are often high in sodium, sugar, and unhealthy fats, which can negatively affect the health of both mother and baby. Common examples of these include potato chips, candy bars, and packaged cookies.'),
     
      heading('High Sugar Snacks'),
      paragraph('High-sugar snacks, such as candy or sweet pastries, can lead to weight gain and may negatively impact milk production. In addition, these types of snacks can cause blood sugar spikes, leading to crashes and leaving you feeling more tired and lethargic.'),
      paragraph('Instead of sugary snacks, opt for whole foods like fresh fruit or veggies with hummus. These types of snacks provide sustained energy without the crash associated with high-sugar options.'),

      heading('Caffeinated Beverages'),
      paragraph('Caffeinated beverages such as coffee and tea should be limited or avoided altogether, as they can interfere with sleep for both the mother and baby.Additionally, high caffeine intake can cause jitteriness, irritability, and even affect milk production.'),
      paragraph('Energy drinks should be avoided completely as they contain high levels of caffeine and other stimulants that can be harmful to both the mother and baby. Instead, opt for decaffeinated beverages or herbal teas that are safe during breastfeeding if you need a pick-me-up.'),

      quote("Choosing what to avoid is just as important as choosing what to nourish — every mindful bite supports a mother’s recovery and her breastfeeding journey." ),

      paragraph('Ready to order confinement meals? Order our confinement meal plans now to enjoy the discounted price!'),
    ],
  },
  {
    id: 'post-8',
    slug: 'confinement-food-planning-natural-vs-c-section-births',
    title: 'Confinement Food Planning: Natural vs. C-Section Births',
    excerpt:
      'Congratulations on welcoming your little one into the world! As a new mother, you are probably concerned about your postpartum recovery and ensuring that you get all the nutrition you need.',
    category: 'Planning',
    tags: ['confinement food', 'confinement period', 'healthy eating', 'nourishing food', 'postpartum recovery'],
    coverUrl: ARTICLE_IMAGES.planning[0].src,
    createdAt: '2026-03-07T09:00:00+08:00',
    reference:
      'https://chillipadiconfinement.com/blogs/confinement-tips/confinement-food-planning-natural-vs-c-section-births',
    blocks: [
      paragraph('After childbirth, a confinement diet is an important part of postpartum care for both natural and C-section births. However, there are differences in the dietary requirements for each type of birth.'),
      paragraph('For natural birth mothers, their confinement diet focuses on boosting energy and increasing milk supply through warm and nourishing foods. They can consume more raw and cooling foods as compared to C-section mothers.'),
      paragraph('On the other hand, C-section mothers require a diet that helps promote healing and reduces inflammation. Their diet should include foods that are rich in nutrients such as iron and vitamin C, which aid in recovery. It’s imperative to avoid consuming raw and cooling foods as they can slow down the healing process of wounds.'),
      paragraph('Therefore, it\'s essential to plan your confinement diet ahead of time based on your type of birth to ensure proper postpartum recovery.'),
      paragraph(
        'The source article uses a straightforward planning lens: recovery needs are not identical after every birth, so meal pacing and expectations should account for that. A c-section recovery may call for different practical support than an uncomplicated vaginal delivery.'
      ),
      callout(
        'What stays constant',
        'The core goals still include warmth, hydration, manageable digestion, and reliable nourishment.'
      ),
      gallery(ARTICLE_IMAGES.planning, 'Planning works best when the menu supports the real pace of recovery.'),

      table([{
        birth: 'Natural',
        avoid: 'Spicy and greasy food, caffeine, and alcohol',
        eat: 'Lean meats, dark leafy greens, citrus fruits, soups, and broths. Drink plenty of water to stay hydrated.',
      },{
        birth: 'C-Section', 
        avoid: 'Foods that may cause constipation or gas, such as beans, raw vegetables, spicy food, and carbonated drinks',
        eat: 'Protein-rich foods like chicken, fish, and eggs. Include vitamin C-rich foods, whole grains, and vegetables to support recovery.',
      },
    ]),
    
      heading('WHAT PROTEIN SOURCES ARE ESSENTIAL FOR POSTPARTUM RECOVERY?'),
      paragraph(
        'Lean meats, poultry, fish, eggs, dairy products, beans, and legumes are all great sources of protein. Those who follow a vegetarian or vegan lifestyle can opt for plant-based proteins like tofu, tempeh, or quinoa.'
      ),
      
      heading('Importance of Incorporating Vegetables and Fruits in Your Confinement Diet'),
      paragraph('Incorporating vegetables and fruits in your confinement diet after giving birth is essential for postpartum recovery. They are rich in vitamins, minerals, and antioxidants which help boost immunity and prevent illnesses. Fruits and vegetables also provide fiber that promotes digestion and prevents constipation that new mothers often experience.'),
      paragraph('It\'s important to include a variety of colorful fruits and vegetables in your diet to make it more nutritious and flavorful. So whether you\'ve had a natural or C-section birth, don\'t forget to add fresh fruits and vegetables to your confinement food planning.'),

      heading('Best Carbohydrates Sources for Postpartum Recovery'),
      paragraph('Whole grains such as brown rice, quinoa, and oats are excellent sources of fiber and essential nutrients. Root vegetables like sweet potatoes and carrots provide slow-digesting carbohydrates to sustain energy levels throughout the day. Fruits like berries and citrus are packed with vitamins and antioxidants that can help speed up the healing process.'),
      paragraph('Legumes like lentils and chickpeas are also great sources of protein and complex carbohydrates, helping new moms maintain their energy levels for longer periods. Incorporating healthy fats like avocado or nuts into your diet can aid nutrient absorption and hormone regulation.'),
      paragraph('However, it\'s important to avoid processed carbohydrates such as white bread or sugary snacks as they can spike blood sugar levels and lead to crashes'),
      paragraph('Overall, a balanced diet that includes a variety of carbohydrates is essential for postpartum recovery no matter how you delivered your little one.'),

      heading('Conclusion'),
      paragraph('It\’s important to remember that postpartum recovery is a delicate time for new mothers. Whether you\'ve had a natural birth or a C-section, the right confinement diet can ensure optimal healing and recovery. It\'s essential to avoid certain foods and include others in your diet to help your body heal and regain strength.'),
      paragraph('Consult with your doctor or a qualified nutritionist to determine what\'s best for you. If you prefer convenience, consider hiring a confinement food delivery service that specialises in preparing healthy and nutritious meals for new mothers.'),

      quote("Nourishment after birth isn't just about feeding the body; it's a quiet ritual of rebuilding strength from the inside out." ),

      paragraph('For more information on our confinement meal, check out our menu.'),
    ],
  },

  {
    id: 'post-9',
    slug: 'benefits-of-red-dates-tea-for-confinement-mothers',
    title: 'What Are The Benefits of Red Dates Tea for Confinement Mothers',
    excerpt:
      'In traditional Chinese practice, new mothers are encouraged to drink special soup and tea to hydrate themselves instead of water. Contrary to popular belief, plain water should be consumed during confinement. Studies have shown that staying hydrated is important, especially if you are breastfeeding, and drinking water is fine as long as it is warm.',
    category: 'Nutrition',
    tags: ['confinement', 'confinement food', 'confinement period', 'nourishing food', 'red dates tea with longan'],
    coverUrl: ARTICLE_IMAGES.science[1].src,
    createdAt: '2026-03-03T09:00:00+08:00',
    reference:
      'https://chillipadiconfinement.com/blogs/confinement-tips/what-are-the-benefits-of-red-dates-tea-for-confinement-mothers',
    blocks: [
      paragraph('One way to supplement warm water during your postpartum recovery period is with confinement tea and soup. In most Chinese households, red dates tea is a popular choice during confinement.'),
      paragraph('When red dates and longan are cooked together, they not only taste delicious but also provide numerous health benefits. This confinement tea has a warming effect, which is essential for postpartum recovery.'),
      image(ARTICLE_IMAGES.tea[1], 'Warm drink routines are easier to maintain when thermal ware keeps beverages accessible.'),
      heading('What are the benefits of red dates tea for confinement?'),
      list([
        '**Nourishment:** Red dates are a rich source of vitamins, minerals, and antioxidants, which can help to nourish and strengthen the body during the postpartum period. It is also believed to help replenish blood and boost energy levels.',
        '**Blood circulation:** Red dates are believed to have properties that help to improve blood circulation, which can be beneficial for new mothers who may experience blood loss during delivery.',
        '**Digestion:** Red dates are also believed to have a soothing effect on the digestive system and can help to alleviate constipation, which is a common issue for new mothers during confinement.',
        '**Immune system:** Red dates are high in vitamin C, which is essential for a healthy immune system. Consuming red date tea during confinement may help to boost the immune system and prevent illnesses.',
      ]),
      paragraph('Red date tea can be made by simmering red dates in water for several minutes until the liquid turns reddish-brown. Some recipes also call for adding other ingredients, such as ginger, goji berries, or dried longan, to enhance the flavor and nutritional value of the tea.'),
      quote(
        'As with many confinement foods, the value is cumulative. One tea does not define recovery, but small rituals can make nourishment easier to maintain.'
      ),
      paragraph(
        'Its popularity also comes from habit and routine. A warm drink can be an easy anchor throughout the day, particularly when meals arrive at set times and the rest of the schedule feels less predictable.'
      ),

      paragraph('**Ingredients**'),
      paragraph('Here\'s a recipe to make red dates tea with longan for confinement'),
      paragraph('Ingredients'),
      paragraph('50g dried red dates'),
      paragraph('25g dried longan'),
      paragraph('1.5L water'),
      paragraph('Rock sugar to taste (optional)'),

      paragraph('**Instructions**'),
      list([
        '**•** Rinse the red dates and dried longan with water and drain',
        '**•** In a pot, add the red dates, dried longan, and water',
        '**•** Bring the water to a boil over high heat',
        '**•** Once the water is boiling, lower the heat to medium-low and let it simmer for about 45 minutes to an hour',
        '**•** Stir occasionally to prevent the ingredients from sticking to the bottom of the pot',
        '**•** After 45 minutes to an hour, the water should have reduced to about half',
        '**•** If you want the tea to be sweeter, you can add rock sugar to taste',
        '**•** Stir until the sugar is dissolved',
        '**•** Turn off the heat and let the tea cool down for a few minutes',
        '**•** Strain the tea and serve hot',
      ]),
      paragraph('Red dates tea with longan is best consumed warm, as it is believed to have better therapeutic effects when consumed warm. You can drink this tea daily during confinement to help nourish and replenish your body.'),
      quote("A quiet cup of red dates tea is a gentle reminder to slow down, steep in the moment, and let warmth fill the spaces in between"),
      paragraph('In addition to the red dates longan tea, our confinement meal packages offer a selection of confinement herbal soups. Check out our confinement food packages to see more! '),
      
    ],
  },
   {
    id: 'post-10',
    slug:'overcoming-anxiety-and-stress-during-confinement-for-mothers',
    title: 'Overcoming Anxiety and Stress During Confinement For Mothers',
    excerpt: 'Being a mother is a full-time job that can be challenging even in the best of times. However, when confinement is added to the mix, things can become even more difficult.',
    category: 'Recovery',
    tags: ['confinement',  'confinement period', 'postpartum recovery', 'mental health'],
    coverUrl: ARTICLE_IMAGES.anxiety[0].src,
    createdAt: '2026-09-10T09:00:00+08:00',
    reference: 'https://chillipadiconfinement.com/blogs/confinement-tips/overcoming-anxiety-and-stress-during-confinement-for-mothers',
    blocks: [
      paragraph('Confinement mothers may feel isolated, stressed, and anxious due to the lack of social interaction and the additional responsibilities of taking care of their children and household.'),
      paragraph('However, don\'t worry, because there are plenty of things you can do to overcome anxiety and stress during confinement.'),
      heading('Create a Routine'),
      paragraph('Establishing a daily routine can help confinement mothers feel more in control of their day-to-day activities. Set regular times for waking up, eating meals, and engaging in activities with children. This can help reduce stress and anxiety by providing a sense of structure and predictability.'),
      heading('Take Breaks'),
      paragraph('It\'s important for mothers to take regular breaks throughout the day, even if it\'s just for a few minutes. This can help relieve stress and prevent burnout. Taking a few deep breaths, going for a walk, or reading a book can all help provide a much-needed break from the demands of motherhood.'),
      heading('Connect With Others'),
      paragraph('Although physical distancing measures may limit opportunities for social interaction, it\'s still important to connect with others. Video calls, social media, and online support groups can all provide a sense of community and connection during confinement.'),
      heading('Practice Self-Care'),
      paragraph('Taking care of oneself is essential for managing anxiety and stress. This can include activities such as meditation, yoga, or taking a hot bath. Make time for activities that bring joy and relaxation, even if it\'s just for a few minutes each day.'),
      heading('Set Realistic Expectations'),
      paragraph('It\'s important to set realistic expectations for oneself during confinement. Recognise that it\'s okay to have bad days and that perfection is not attainable. Accepting imperfection can help reduce stress and anxiety by relieving pressure to constantly perform at a high level.'),
      heading('Exercise'),
      paragraph('Exercise is a great way to reduce stress and anxiety. It releases endorphins, which are natural mood-boosters, and can help improve sleep quality. Find an exercise routine that works for you, whether it\'s yoga, running, or simply taking a brisk walk outside.'),
      heading('Practice Mindfulness'),
      paragraph('Mindfulness is the practice of being present in the moment and focusing on your thoughts, feelings, and surroundings without judgment. Mindfulness meditation can help reduce stress and anxiety by promoting relaxation and inner peace.'),
      paragraph('There are many apps available that offer guided mindfulness meditations, or you can simply sit quietly and focus on your breath for a few minutes each day.'),
      heading('Prioritise Sleep'),
      paragraph('Getting enough sleep is essential for managing stress and anxiety. Set a regular bedtime routine and stick to it as much as possible. Avoid using electronic devices in bed and create a calm and comfortable sleeping environment.'),
      heading('Reduce Exposure to News and Social Media'),
      paragraph('News and social media can be a source of stress and anxiety, especially during times of crisis. Limit your exposure to news and social media, and make sure to fact-check any information before sharing it with others.'),
      heading('Connect with Nature'),
      paragraph('Spending time in nature can help reduce stress and anxiety. Whether it\'s taking a walk in the park, gardening, or simply sitting outside and enjoying the fresh air, being in nature can help promote relaxation and a sense of well-being.'),
      heading('Practice Gratitude'),
      paragraph('Gratitude is the practice of focusing on the positive things in your life and expressing appreciation for them. Keeping a gratitude journal or simply taking a few minutes each day to reflect on the things you are thankful for can help shift your focus away from stress and anxiety and toward positive emotions.'),
      paragraph('Being a mother can be both thrilling and anxiety-inducing for women. However, it doesn\'t have to be a daunting experience. By implementing some of the strategies we\'ve discussed, you can help alleviate stress and anxiety.'),
      paragraph('Remember, taking care of your mental health is just as important as taking care of your physical health, so make sure to prioritise it. Stay strong, mamas!'),
    ],
  },

   {
    id: 'post-11',
    slug:'post-partum-expectations-versus-reality',
    title: 'Post Partum Expectations Versus Reality',
    excerpt: 'The postpartum period can be both exciting and overwhelming for new parents. Before the arrival of the baby, many parents have expectations of what their life will be like after the birth.',
    category: 'Comparison',
    tags: ['confinement', 'confinement period', 'postpartum recovery'],
    coverUrl: ARTICLE_IMAGES.postpartum[0].src,
    createdAt: '2026-09-10T09:00:00+08:00',
    reference: 'https://chillipadiconfinement.com/blogs/confinement-tips/post-partum-expectations-versus-reality',
    blocks: [
      paragraph('However, the reality of the postpartum period can often be very different from what they expected. From sleepless nights to unexpected physical and emotional changes, the postpartum period can be a challenging time.'),
      paragraph('In this topic, we\'ll explore some common postpartum expectations versus reality and offer tips on how to navigate this period as a new parent'),
      paragraph('**Expectation: Many parents believe that they will immediately bond with their baby when they see them for the first time.**'),
      paragraph('**Reality:** Bonding takes time. It\'s a process that happens over the first few weeks and months of being a parent. Sometimes, new parents might not feel an instant bond, and that\'s okay!'),
      paragraph('Attachment is a two-way street, and it takes time for both you and your baby to get to know each other. Skin-to-skin contact right after birth is great for bonding, but if you miss out on that, it doesn\'t mean your relationship with your baby is doomed. Just give it time, and focus on making your baby feel safe, loved, and cared for.'),
      paragraph('Attachment happens naturally over time, and it\'s different for everyone. So don\'t stress if you don\'t feel an instant connection with your baby. It will come!'),
      paragraph('**Expectation: Once I deliver my baby, my body will go back to its pre-pregnancy state, and I will feel like myself again.**'),
      paragraph('**Reality:** After giving birth, many women are surprised by how their body looks and feels. It\'s normal for your belly to still look swollen, and you may need to wear loose clothing or maternity clothes for a while.'),
      paragraph('You might also have swollen hands, legs, and feet from the fluids given to you during labor. It takes time for your body to heal and go back to its normal state, so don\'t expect to fit into your pre-pregnancy clothes right away.'),
      paragraph('Postpartum bleeding, or lochia, is also common and can last up to four weeks. You\'ll need to wear large pads or diapers during this time, and make sure not to overexert yourself to prevent excessive bleeding. It\'s also normal to experience soreness in your body, including your breasts as your milk comes in.'),
      paragraph('Talk to your healthcare provider if you\'re experiencing a lot of pain, and they can recommend ways to help you feel more comfortable.'),
      paragraph('Remember that you just did something incredible by giving birth to a new life, so be patient with yourself and give your body time to recover.'),
      paragraph('**Expectation: I can handle being tired since I\'m already used to it. Plus, when the baby naps, I\'ll catch some z\'s too!**'),
      paragraph('**Reality:** Let\'s face it, every parent expects to be tired after their baby is born. But being a new parent can take exhaustion to a whole new level.'),
      paragraph('On average, new parents get less than 6 hours of sleep each night, and it\'s usually interrupted by frequent wake-ups. This lack of sleep can cause problems such as marital stress, anxiety, breastfeeding issues, postpartum depression, illness, car accidents, and even overweight babies and mothers.'),
      paragraph('In the first few months, you may have to prioritize and let some things slide, like leaving the house untidy or ordering takeout instead of cooking. It\'s important to avoid burnout, which can negatively affect your parenting.'),
      paragraph('Many parents feel pressured to do everything perfectly, which can lead to exhaustion and mistakes. Don\'t fall into this trap!'),
      paragraph('Seek help if you feel overwhelmed or exhausted, and don\'t wait until you reach your breaking point. Reach out to health and child services professionals and be honest about how you feel. The more parents ask for help, the more normalized it will become.'),
      paragraph('**Expectation: We got this! Me and my partner are responsible adults who can handle anything that comes our way, and we don\'t need any extra help.**'),
      paragraph('**Reality:** In the past, people used to raise children together as a community, with grandmas, aunties, cousins, and other relatives taking turns to care for the baby.'),
      paragraph('But now, many modern parents feel like they have to do it all alone, which can be overwhelming and lead to exhaustion.'),
      paragraph('Research has shown that it\'s important to remember your identity as an individual and balance your own needs with those of your child. It\'s impossible to do everything perfectly all the time, so it\'s okay to prioritize and make time for self-care.'),
      paragraph('Your baby\'s needs are simpler than you might think: they need to eat, sleep, and calm their crying. Try to plan some time for yourself and your partner, even if it\'s just a stay-at-home date.'),
      paragraph('By taking care of yourself, you\'ll be better equipped to take care of your baby.'),
      
      heading('Conclusion'),
      paragraph('It\'s totally normal to have high expectations for the postpartum period, but let\'s be real, the reality can be a whole lot different. Don\'t beat yourself up if things don\'t go as planned, new parenthood is a challenging time for everyone.'),
      paragraph('So cut yourself some slack, moms and dads, and remember that you can handle whatever comes your way!'),

      image(
        {
          src: '/banners/banner.png',
          alt: 'https://www.chillipadiconfinement.com/product',
          maxWidth: 650,
          displayHeight: 57.
        }
      ),
    ],
  },

   {
    id: 'post-12',
    slug:'tips-to-lose-weight-safely-during-confinement',
    title: 'Tips to Lose Weight Safely During Confinement',
    excerpt: 'Pregnancy and childbirth are beautiful experiences that come with their own set of challenges. One such challenge is postpartum weight gain. The pressure to lose weight quickly can be overwhelming, but it is essential to do it safely and in a way that does not affect the mother\'s health or her ability to care for her newborn.',
    category: 'Weight',
    tags: ['confinement', 'confinement period', 'healthy eating', 'weight loss'],
    coverUrl: ARTICLE_IMAGES.weightLoss[0].src,
    createdAt: '2026-09-10T09:00:00+08:00',
    reference: 'https://chillipadiconfinement.com/blogs/confinement-tips/tips-to-lose-weight-safely-during-confinement',
    blocks:[
      heading('BALANCING NUTRIENT INTAKE WHILE LOSING WEIGHT'),
      paragraph('When trying to lose weight during confinement, it is important to balance your nutrient intake. Focus on consuming whole, nutrient-dense food that provide your body with necessary vitamins and minerals. Incorporate a variety of fruits and vegetables into your meals to increase fiber intake.'),
      paragraph('It\'s essential to stay hydrated by drinking plenty of water throughout the day as dehydration can slow down metabolism. Avoid extreme calorie restriction or crash diets as they can be harmful to your health, and it\'s difficult to maintain them in the long run.'),
      paragraph('**a. Choosing the Right Food for a Confinement Diet**'),
      paragraph('Choosing the right food for a confinement diet will keep you feeling full and satisfied while still providing your body with the nutrients it needs. Whole food like fruits, vegetables, lean proteins, and whole grains should be prioritized over processed and packaged snacks. It\'s also important to avoid sugary drinks and opt for water or unsweetened tea as your main beverage.'),
      paragraph('In addition to choosing nutrient-dense food, paying attention to portion sizes and practicing mindful eating can prevent overeating and support healthy weight loss.'),
      paragraph('Remember that portion control and mindful eating habits are also key when trying to lose weight. By focusing on a balanced nutrient intake, you can achieve safe weight loss during this challenging time.'),

      heading('SAFE EXERCISE FOR POSTPARTUM MOTHERS'),
      image(
        {
          src: ARTICLE_IMAGES.weightLoss[1].src,
          alt: 'Safety Exercises',
          objectPosition: 'center 30%',
        },
      ),
      paragraph('When it comes to losing weight safely during confinement, it\'s important to consider safe exercise routines for postpartum mothers. After giving birth, new mothers need to be careful when starting an exercise routine and should opt for low-impact exercises such as walking, yoga, and swimming.'),
      paragraph('Pelvic floor exercises can also be helpful in strengthening the muscles around the bladder, uterus, and rectum.'),
      paragraph('Additionally, make sure you stay hydrated and get enough rest to support your weight loss efforts and overall health during confinement.'),
      paragraph("**a. Low-Impact Exercise for Safe and Effective Weight Loss**"),
      paragraph('Postpartum mothers who are looking to lose weight safely during confinement can benefit from low-impact exercises such as walking, swimming, and yoga.'),
      paragraph('These exercises not only help in promoting weight loss, but also improve cardiovascular health, muscle tone, and flexibility.'),
      paragraph('Low-impact exercises are gentle on the joints and reduce the risk of injury or strain. They can be done at home or in a gym with proper guidance from a certified trainer.'),
      paragraph('**b. Incorporating Pelvic Floor Exercises for Faster Recovery**'),
      paragraph('Incorporating pelvic floor exercises into their exercise routine can aid in faster recovery and prevent complications such as urinary incontinence. These exercises involve contracting and relaxing the muscles of the pelvic floor, which can improve overall fitness and well-being.'),
      paragraph('To ensure safety and effectiveness, it\'s important to start slowly and gradually increase the intensity of these exercises over time.'),
      paragraph('With these tips in mind, losing weight safely during confinement is achievable for new moms who want to prioritize their health and well-being.'),
      paragraph('**Conclusion**'),
      paragraph('In conclusion, safe weight loss during confinement requires a balanced approach that prioritizes your health and recovery. It is important to understand the confinement diet and its benefits, choose the right food, and balance nutrient intake while losing weight.'),
      paragraph('Safe exercise, such as low-impact exercise and pelvic floor exercises, should also be incorporated into your routine.'),

      image(
        {
          src: '/banners/banner.png',
          alt: 'https://www.chillipadiconfinement.com/product',
          maxWidth: 650,
          displayHeight: 57,
        }
      ),
    ],
  },

  {
    id: 'post-13',
    slug:'what-is-a-postnatal-massage-and-how-does-it-benefit-mothers',
    title: 'What is a Postnatal Massage and How Does It Benefit Mothers?',
    excerpt: 'While much attention is often given to pregnancy care during the nine months leading up to childbirth, the importance of postpartum care cannot be overlooked. The postpartum period, which begins immediately after the baby is born, is a critical time when a new mother undergoes numerous physical and emotional changes. A postnatal massage can be instrumental in aiding recovery and boosting a mother\’s confidence as she navigates the demands of caring for a newborn.',
    category: 'Massage',
    tags: ['confinement', 'confinement period', 'weight loss', 'postpartum recovery'],
    coverUrl: ARTICLE_IMAGES.weightLoss[2].src,
    createdAt: '2026-09-10T09:00:00+08:00',
    reference: 'https://chillipadiconfinement.com/blogs/confinement-tips/what-is-a-postnatal-massage-and-how-does-it-benefit-mothers',
    blocks: [
      paragraph('**What is a Postnatal Massage?**'),
      paragraph('A postnatal massage is a therapeutic practice designed to support new mothers during the recovery period after childbirth. This massage can be initiated anytime between the fifth day and three months post-delivery for mothers who had a normal delivery. In cases where a caesarean section was performed, it is advisable to wait until the incision has properly healed—typically about 2 to 4 weeks after delivery—before commencing with the postnatal massage. However, even before the incision heals, new mothers can still benefit from massages on other parts of the body to alleviate aches and pains and relieve water retention, all without disturbing the fresh wound on the abdomen.'),

      paragraph('**Benefits of Postnatal Massage**'),

      list([
        '1. **Relief from Neck and Shoulder Pain:** The constant carrying and breastfeeding of the baby can strain the neck and shoulders, leading to discomfort. Postnatal massage helps to relieve this pain, allowing mothers to care for their newborns more comfortably.',
        '2. **Helps to Restore the Uterus to Its Original State:** Postnatal massage can aid in the natural process of shrinking the uterus back to its original state, promoting faster recovery.',
        '3. **Reduction of Excess Fluids:** During pregnancy, the body tends to retain excess fluids. Postnatal massage helps in the elimination of these fluids, reducing water retention and contributing to overall comfort.',
        '4. **Weight Loss Support:** Regular postnatal massage can assist in weight loss by stimulating the body\’s metabolism and encouraging the breakdown of fat.',
        '5. **Improved Blood Circulation:** Enhanced blood circulation is one of the key benefits of postnatal massage. This not only helps in faster healing but also boosts energy levels, which is crucial for new mothers who need to be at their best for their baby.'
      ]),

      image ({
        src: '/banners/PostNatal_Massage.png',
        alt: 'Massage',
        objectPosition: 'center 30%'
      }),

      paragraph('In conclusion, while the journey of motherhood is rewarding, it comes with its challenges, especially during the postpartum period. Incorporating postnatal massage into a new mother’s routine can significantly ease the physical and emotional strains, promoting a quicker recovery and enabling mothers to fully enjoy their new role with confidence.'),
      paragraph('For a relaxing confinement experience, choose our 28-Day Dual Meal X BMB package, which features freshly cooked confinement meals delivered to your doorstep along with postnatal massage sessions. We are currently offering a sale on this package, so don’t miss out. Find out more here.'),
      
    ],
  },

   {
    id: 'post-14',
    slug:'baby-sleep-tips-establishing-healthy-sleep-patterns-for-your-little-one',
    title: 'Baby Sleep Tips: Establishing Healthy Sleep Patterns for Your Little One',
    excerpt: 'Before we dive into the tips and tricks, let\'s take a moment to appreciate why sleep is so crucial for your baby\'s well-being. Sleep plays a vital role in their growth and development, both physically and mentally. It helps consolidate their memories, supports brain development, and enhances their immune system. Plus, let\'s not forget that a well-rested baby equals a happier and more alert baby during the day. So, ensuring your little munchkin gets enough quality sleep is a top priority.',
    category: 'Sleep',
    tags: ['confinement', 'confinement period', 'mental health', 'postpartum recovery'],
    coverUrl: ARTICLE_IMAGES.babysleep[0].src,
    createdAt: '2026-09-10T09:00:00+08:00',
    reference: ['https://pmc.ncbi.nlm.nih.gov/articles/PMC6587181/','https://www.verywellfamily.com/the-ferber-method-dr-ferbers-sleep-book-2634262' , 'https://chillipadiconfinement.com/blogs/confinement-tips/baby-sleep-tips-establishing-healthy-sleep-patterns-for-your-little-one' ],
    blocks: [
      heading('The Magic of Sleep Cycles and Circadian Rhythms'),
      paragraph('Did you know that infants have shorter sleep cycles than adults? Understanding these cycles and their impact on your little one\'s sleep patterns is crucial. Infants go through active sleep (REM) and quiet sleep (non-REM) phases, with REM sleep playing a significant role in brain development.'),
      paragraph('Additionally, babies\' sleep is influenced by their circadian rhythms, the internal clocks that regulate their sleep-wake cycles. By aligning your baby\'s routine with their natural rhythms, you can encourage healthier sleep patterns.'),

      heading('The Role of Melatonin in Baby Sleep'),
      paragraph('Ever wondered why your baby seems more active at night? Well, it\'s all about melatonin—the hormone responsible for regulating sleep. In infants, melatonin production takes time to develop fully. This means their sleep patterns might be initially erratic. However, there are strategies you can implement to support melatonin production and gradually establish a more consistent sleep routine. '),

      heading('Creating a Soothing Sleep Environment'),
      paragraph('Imagine trying to doze off in a noisy, brightly lit room with uncomfortable bedding. Not very appealing, right? Well, the same goes for your baby. Creating a sleep-friendly environment is key to encouraging healthy sleep patterns. Here are a few tips to set the stage for a peaceful slumber:'),
      
      paragraph('**Soft Lighting and White Noise**'),
      paragraph('Dim the lights in the evening to signal to your baby that it\'s bedtime. Consider using a nightlight or a dimmer switch to create a calm ambiance. Additionally, white noise machines or apps can work wonders in drowning out disruptive sounds and providing a soothing background hum for your little one.'),
      
      paragraph('**Comfortable Bedding**'),
      paragraph('Investing in a good-quality crib mattress and breathable bedding is essential. Opt for materials that promote airflow and regulate temperature, helping your baby stay cosy without overheating. Remember, comfort is key!'),

      paragraph('**Room Temperature**'),
      paragraph('Maintaining a comfortable room temperature is crucial for your baby\'s sleep. Aim for a mild and consistent temperature, around 20-22°C, to ensure they neither feel too hot nor too cold. Dress them in appropriate clothing for the current season and use lightweight blankets if needed.'),

      heading('Establishing a Bedtime Routine'),
      paragraph('Humans are creatures of habit, and babies are no exception. Implementing a consistent bedtime routine can work wonders in preparing your little one for a restful night\'s sleep. Let\'s explore some elements to incorporate into their pre-bedtime ritual:'),

      paragraph('**Calming Activities**'),
      paragraph('Engage in relaxing activities such as reading a bedtime story, gentle baby massage, or singing lullabies. These calming interactions help signal to your baby that it\'s time to wind down and get ready for sleep.'),

      paragraph('**Bath Time**'),
      paragraph('A warm bath before bed can work like magic in soothing your baby\'s tired body. The water\'s gentle touch and the rhythmic nature of bathing create a serene atmosphere, preparing them for slumber.'),

      paragraph('**Dimmed Lights**'),
      paragraph('As mentioned earlier, dimming the lights helps set a tranquil mood. During the bedtime routine, gradually reduce the intensity of the lighting to create a soothing environment that encourages sleep.'),

      heading('Navigating the World of Sleep Training Methods'),
      paragraph('**The Ferber Method**'),
      paragraph('Developed by Dr. Richard Ferber, this method involves gradually increasing the time between parental check-ins during nighttime awakenings. The goal is to teach your baby to self-soothe and fall back to sleep independently.'),
      paragraph('**The Gentle Sleep Training Approach**'),
      paragraph('For parents who prefer a gentler approach, techniques like the "pick-up, put-down" method or the "bedtime fading" method can be effective. These methods involve offering comfort and reassurance to your baby without leaving them to cry for extended periods.'),
      heading('Managing Sleep Regression and Developmental Milestons'),
      paragraph('Just when you think you\'ve cracked the code and established a perfect sleep routine, bam! Sleep regression hits, leaving you scratching your sleep-deprived head. But fret not, it\'s a normal part of your baby\'s development. Here are a few tips to navigate this challenging phase:'),
      paragraph('**Stick to the Routine**'),
      paragraph('During sleep regressions, it\'s crucial to stay consistent with your baby\'s sleep routine. While their sleep patterns may temporarily be disrupted, following the established bedtime routine will help them adjust more smoothly.'),
      paragraph('**Offer Comfort and Reassurance**'),
      paragraph('Sleep regressions can be tough on both babies and parents. Providing extra comfort, such as extra cuddles or a reassuring voice, can help ease your little one through this phase.'),
      heading('Conclusion'),
      paragraph('From creating a soothing sleep environment to implementing a consistent bedtime routine and navigating sleep regressions, you now have a toolkit of strategies to help your little one snooze soundly. Remember, every baby is unique, so feel free to experiment and adjust these tips to suit your baby\'s needs. May sweet dreams and peaceful slumber be your new companions on this beautiful journey of parenthood!'),

      image(
        {
          src: '/banners/banner.png',
          alt: 'https://www.chillipadiconfinement.com/product',
          maxWidth: 650,
          displayHeight: 57,
        }
      ),

    ],
  },

   {
    id: 'post-15',
    slug:'10-tips-to-soothe-swelling-during-pregnancy',
    title: '10 Tricks to Soothe Swelling During Pregnancy',
    excerpt: 'Swelling, also known as edema, is a common occurrence during pregnancy. It\'s mainly caused by your body\'s natural response to increased blood volume and hormonal changes. As your body retains more fluids, the extra fluid can accumulate in your tissues, resulting in swelling. Here are some factors that contribute to swelling during pregnancy:',
    category: 'Pregnancy',
    tags: ['beauty and skincare', 'pregnancy'],
    coverUrl: ARTICLE_IMAGES.swelling[0].src,
    createdAt: '2026-09-10T09:00:00+08:00',
    reference: [ 'https://chillipadiconfinement.com/blogs/confinement-tips/10-tips-to-soothe-swelling-during-pregnancy', 'https://americanpregnancy.org/pregnancy-health/swelling-during-pregnancy/' , 'https://www.acog.org/womens-health/faqs/prenatal-nutrition' , 'https://www.nhs.uk/conditions/pregnancy-and-baby/swollen-ankles-feet-pregnant/'],
    blocks: [
      heading('The Causes of Swelling During Pregnancy: Understanding the Bloat'),
      paragraph('**Increased Blood Volume: More Fluids, More Swelling**'),
      paragraph('During pregnancy, your blood volume increases significantly to support your growing baby. This increased blood volume helps transport nutrients and oxygen to both you and your baby but can also lead to fluid retention, causing swelling in your legs, feet, and hands.'),
      paragraph('**Hormonal Changes: The Culprits Behind the Bloat**'),
      paragraph('Hormones play a significant role in pregnancy, but they can also contribute to swelling. Hormonal changes, particularly an increase in progesterone, can cause your blood vessels to relax and expand, making it easier for fluid to seep into surrounding tissues.'),
      paragraph('**Pressure from the Uterus: Squeezing the Fluids**'),
      paragraph('As your baby grows, your uterus expands and puts pressure on your pelvic veins, slowing down the blood flow from your legs and feet back to your heart. This sluggish circulation can lead to fluid buildup and swelling in the lower extremities.'),
      paragraph('**Gravity at Play: The Pull of Swelling**'),
      paragraph('Gravity is not your best friend when it comes to swelling. When you stand or sit for prolonged periods, gravity can make it harder for your body to return fluids to your heart. This can result in swelling, especially in your lower legs and feet.'),
      paragraph('Now that we\'ve explored the causes, let\'s dive into some expert tips to help you find relief from swelling during pregnancy.'),

      heading('Tips to Reduce Swelling During Pregnancy'),
      paragraph('**Stay Hydrated: Guzzle that Water!**'),
      paragraph('First things first, hydration is key! Staying hydrated actually helps flush out excess fluids, reducing the risk of swelling. Aim for a minimum of eight glasses of water a day. If plain water doesn\'t tickle your taste buds, infuse it with a splash of lemon or cucumber for a refreshing twist.'),
      paragraph('**Kick Up Those Feet: Elevate and Relax**'),
      paragraph('When it comes to battling the swelling monster, elevation is your secret weapon. Kick off those shoes, put your feet up, and let gravity do its magic. Elevating your feet above heart level helps improve circulation and decrease fluid retention.'),
      paragraph('**Compression Socks: Fashion Meets Function**'),
      paragraph('Whoever said compression socks were only for grandmas clearly hasn\'t experienced the magic they work during pregnancy. These babies are a game-changer! Compression socks gently squeeze your legs, promoting blood flow and reducing swelling. Plus, they come in all sorts of funky patterns, so you can rock those legs in style!'),
      paragraph('**Move It, Mama: Get Your Blood Pumping**'),
      paragraph('Exercise might be the last thing on your mind when you\'re feeling bloated, but trust me, it\'s worth it! Gentle exercise, like prenatal yoga or walking, gets your blood flowing, reducing fluid buildup in your extremities. Additionally, regular exercise helps maintain a healthy weight, which can minimise swelling. '),
      paragraph('**Embrace a Low-Sodium Lifestyle**'),
      paragraph('We all love a little flavour in our lives, but excessive salt intake can be a sneaky culprit behind swelling. High levels of sodium lead to water retention, exacerbating bloating. Opt for low-sodium alternatives or experiment with flavorful herbs and spices to season your meals.'),
      paragraph('**Choose Nutrient-Packed Foods**'),
      paragraph('Eating a balanced diet is not only crucial for your baby\'s development but can also help combat swelling. Incorporate foods rich in potassium, such as bananas, spinach, and avocados, as they help regulate fluid balance in your body. Additionally, indulge in foods high in vitamin C, like oranges and strawberries, which aid collagen production and support blood vessel health.'),
      paragraph('**Stay Cool: Beat the Heat**'),
      paragraph('Hot weather can be a swelling catalyst, so beat the heat to keep the bloat at bay. Seek refuge in air-conditioned spaces, take cool showers, and wear loose, breathable clothing. Embrace your inner fashionista with flowy dresses and comfy sandals. '),
      paragraph('**Sleep Like a Baby: Snooze Soundly**'),
      paragraph('As an expecting mama, a good night\'s sleep is pure gold. But did you know it can also help alleviate swelling? When you\'re well-rested, your body functions more efficiently, including fluid regulation. Invest in a supportive pillow, create a calming bedtime routine, and bid farewell to sleepless nights and swollen ankles.'),
      paragraph('**Reduce Sweet Temptations**'),
      paragraph('Sugar might be your pregnancy craving kryptonite, but it can exacerbate inflammation and fluid retention. Opt for healthier alternatives like fresh fruit or natural sweeteners.'),
      paragraph('**Seek Expert Advice**'),
      paragraph('Remember, every pregnancy is unique, and what works for one mama might not work for another. If you\'re concerned about swelling, always reach out to your trusted OB-GYN for personalised guidance. They can evaluate your specific situation, offer tailored recommendations, and ensure a smooth and healthy pregnancy journey.'),

    ],
  },

]


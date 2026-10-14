import { Param } from '@prisma/client/runtime/client';
import type { PostItemData, PostImageAsset, PostContentBlock } from 'src/lib/post/types';
import { ar, it } from 'zod/v4/locales';

const ARTICLE_IMAGES = {
  tcm: [
    { src: '/banners/Confinement_Menu_Banner.png', alt: 'Confinement meal spread' },
    { src: '/assets/background/confinement_group_shot.avif', alt: 'Confinement support team' },
  ],
  meals: [
    { src: '/assets/background/Confinement_menu.jpg', alt: 'Chinese confinement menu selection' },
    { src: '/menu/HakkaYellowWineChickenwithBlackFungus_360x.webp', alt: 'Hakka yellow wine chicken' },
    { src: '/banners/CPC_9Dishes_Stacked.png', alt: 'Tingkat Meals'},
    { src: '/banners/What_is_the_Benefit_of_Pig_Trotter.png', alt: 'Pig Trotter'},
  ],
  wellbeing: [
    { src: '/assets/background/confinement_group_shot.png', alt: 'Overcoming Baby Blues' },
    { src: '/addons/Addon_ComfortingSet.webp', alt: 'Comforting postpartum add-on set' },
    { src: '/banners/Food_in_Plastic_Containers.png' , alt: 'Food in Plastic Containers'}
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
    { src: '/banners/Anxiety.png', alt: 'Overcoming Anxiety and Stress'},
    { src: '/banners/Mindfulness_Techniques_for_Postpartum_Anxiety_Calming_Your_Mind_and_Body.png' , alt: 'Mindfulness Techniques'}
  ],
  postpartum: [
  { src: '/banners/Postpartum_Expectations_Versus_Reality.png' , 
    alt: 'Post Partum Expectations Vs Reality' },
  { src: '/banners/How_Husbands_Can_Support_Their_Wife_During_The_Postpartum_Period.png' ,
    alt: 'How Husbands can Support their wife'
  }
  ],
  weightLoss: [
    { src: '/banners/Weight_Loss.png' , alt: 'Tips to Lose Weight Safely'},
    { src: '/banners/safe_exercise.png' , alt: 'Safe Exercises'},
    { src: '/banners/massage.png' , alt: 'PostNatal Massage'},
  ],
  babysleep: [
    { src: '/banners/baby_sleep_tips.png' , 
      alt: 'Establishing Healthy Sleep Patterns for Your Little One'},
  ],
  swelling: [
    { src: '/banners/Soothe_Swell_Pregnancy.png' , 
      alt: 'Soothe Swelling During Pregnancy'}
  ],
  stretchMarks: [
    { src: '/banners/Stretch_Marks.png' , 
      alt: 'Effective Prevention Tips for Stretch Marks'}
  ],
  depression: [
    { src: '/banners/Postpartum_Depression.png' ,
      alt: 'Overcoming Postpartum Depression'
    }
  ],
  essentials: [
    { src: '/banners/essentials_needed.png',
      alt: '10 Must Have Essentials for Expectant Moms'
    }
  ],
  sterilisers: [
    { src: '/banners/Cilli Padi Baby Sterilizer Collection.png', alt: 'Advice for sterilisers'},
    { src: '/banners/Bbyeol_steriliser.png' , alt: 'Bbyeol_steriliser'},
    { src: '/banners/philips_microwave_steriliser.png' , alt: 'philips microwave steriliser'},
    { src: '/banners/Steam_steriliser.png' , alt: 'Steam steriliser'},
    { src: '/banners/boiling_methodf.webp' , alt:'Boiling of baby equipment'}
  ],
  alchemyFibre: [
    { src: '/banners/alchemy_fibre_rice.png' , alt: 'Cover page for Alchemy Fibre'},
    { src: '/banners/alchemy_fibre_1.png' , alt: 'Poster for Alchemy Fibre'},
    { src: '/banners/heart_2.png', alt: 'Heartbeat photo'},
    { src: '/banners/sugar_cube.png' , alt: 'Sugar Cube Decreasing'},
    { src: '/banners/weight.png' , alt: 'Weighing Scale'},
    { src: '/banners/digestion.png' , alt: 'Digestion'}
  ],
  skinCare: [
    { src: '/banners/10_Skincare_Tips_to_Nurture_Your_Glow_After_Childbirth.png' ,
      alt: 'Skincare Tips to Nurture Your Glow'}
  ],
  wildFood: [
    { src: '/banners/Tips_on_Surviving_the_Wild_Food_Adventure_of_Pregnancy.png' , 
      alt: 'Surviving the Wild Food of Pregnancy'}
  ],
  battlingAcne: [
    { src: '/banners/Battling_Postpartum_Acne.png' , 
      alt: 'Battling Postpartum Acne'
    }
  ],
  tips: [
    { src:'/banners/Your_First_Week_of_Confinement_Tips_for_New_Moms.png', 
      alt: 'First Week of Confinement Tips for New Moms'
    },
    { src: '/banners/How_to_Produce_More_Breastmilk.png' ,
      alt: 'How to produce more breastmilk'
    }
  ],
  nanny: [
    { src: '/banners/Is_Confinement_Nanny_Necessary.png',
      alt: 'Is Confinement Nanny Necessary?'
    }
  ],
  massage: [
    { src: '/banners/Postnatal_Massage.png',
      alt: 'Why a Postpartum Massage is Essential'
    }
  ],
  myths:[
    { src: '/banners/Confinement_Myths.png',
      alt: 'Confinement myths every mother should know'
    }
  ],
  DOM: [
    { src: '/banners/How_Much_DOM_to_Drink_During_Confinement.png' ,
      alt: 'How much DOM should you drink?'
    }
  ],
  Miscarriage: [
    { src: '/banners/What_to_Eat_After_a_Miscarriage.png', 
      alt: 'What to eat after a miscarriage'
    }
  ],
  foodtoAvoid: [
    { src: '/banners/Foods_to_Avoid_During_Confinement.png' , 
      alt: 'Foods to Avoid During Confinement'
    }
  ],
  soup: [
    { src: '/banners/Ginseng_Black_Chicken_Soup .png', alt: 'Ginseng Black Chicken Soup'},
    { src: '/banners/Papaya_Fish_Soup_Black_Bean_Pork_Ribs_Soup.png', alt: 'Papaya Fish Soup and Black Bean Pork Ribs Soup'}
  ],
  fiveTips: [
    { src: '/banners/Five_Tips_for_a_Smooth_Confinement_540x.png' , alt: 'Five Tips for a Smooth Confinement'},
    { src: '/banners/postpartumcare.png' , alt: 'Meme 1'},
    { src: '/banners/babymeme.png' , alt:'Baby Meme'},
  ],
  fiveTips2: [
    { src: '/banners/Stir-Fried_Spinach_with_Sea_Cucumber_topped_with_Wolfberries.png' , alt: 'Stir fried spinach'},
    { src: '/banners/CPC-ChickenwEgg.png' , alt: 'Chicken With Egg'}
  ],
  kuhlbarra: [
    { src: '/banners/Why_we_use_Kuhlbarra_Barramundi_in_our_dishes.png',
      alt: 'Why we use Kuhlbarra Barramundi in our dishes'
    }
  ],
  chineseWine: [
    { src: '/banners/Chilli_Padi_Confinement_-_Sesame_Rice_Wine_Ginger_Slices.jpg', alt: 'Chinese Wine'},
    { src: '/banners/Cover_Page_For_Traditional_Chinese_Practices.png', alt: 'Cover Page'}
  ]


} as const;

const paragraph = (text: string): PostContentBlock => ({ type: 'paragraph', text });

const heading = (text: string): PostContentBlock => ({ type: 'standardHeading', text });

const quote = (text: string): PostContentBlock => ({ type: 'quote', text });

const callout = (title: string, text: string): PostContentBlock => ({
  type: 'callout',
  title,
  text,
});


const list = (
  items: string[],
  style: 'bullet' | 'number' | 'none' = 'bullet'
): PostContentBlock => ({
  type: 'list',
  items,
  style,
});


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
        ' **Restoring Qi (Life Energy)**: TCM believes that childbirth depletes a mother\'s Qi. Through the use of acupuncture, herbal remedies, and dietary adjustments, TCM aims to replenish and restore the body\'s vital energy, fostering overall well-being.',
        ' **Enhancing Blood Circulation**: Blood circulation plays a crucial role in the healing process after childbirth. TCM methods such as postnatal massages and herbal baths can help improve blood flow, reduce swelling, and relieve pain, aiding in a faster recovery.',
        ' **Balancing Hormones**: TCM recognizes the importance of hormone balance during the confinement period. Herbal medicines and dietary recommendations are tailored to regulate hormone levels, reducing the chances of postpartum mood swings and other related issues',
      ], 'number' ),
      quote(
        'The strongest confinement plan respects tradition without turning recovery into a rulebook.'
      ),
      heading('Nurturing the Body and Mind'),
      paragraph(
        'Aside from physical recovery, TCM also emphasizes the importance of nurturing the mind and emotional well-being during confinement. Here\'s how TCM can lend a helping hand'
      ),
      list([
        ' **Restoring Balance**: TCM views the body as an interconnected system, and childbirth disrupts this delicate balance. TCM treatments, such as acupuncture and herbal remedies, aim to restore harmony, promote healing, and enhance overall well-being.',
        ' **Nourishing the Body**: TCM recognizes the importance of proper nutrition and the use of specific herbs and tonics to replenish vital energy and support postpartum recovery. These nourishing practices can help address fatigue, boost immunity, and promote healthy milk production.',
        ' **Emotional Support**: The postpartum period can bring about a whirlwind of emotions. TCM offers various techniques, including herbal remedies and mind-body practices like meditation and qigong, to support emotional well-being and reduce stress and anxiety.',
      ], 'number' ),
      paragraph(
        'The key takeaway is balance. A thoughtful confinement plan can respect tradition while still making space for informed decisions, personal comfort, and advice from qualified practitioners when needed.'
      ),
      heading('Challenges and Tradeoffs In Incorporating TCM'),
      list([
        ' **Limited Scientific Evidence:** While TCM has a rich historical background, the scientific evidence supporting its effectiveness in postpartum recovery is still evolving. It\'s important to approach TCM as a complementary approach, supplementing it with evidence-based practices and consulting healthcare professionals to make informed decisions. ',
        ' **Individual Variations:** Every person is unique, and what works for one may not work for another. TCM treatments are highly personalized, taking into account individual characteristics, symptoms, and medical history. It\'s crucial to consult with a qualified TCM practitioner who can tailor treatments to your specific needs. ',
        ' **Safety Considerations:** TCM encompasses a vast array of herbal remedies, and some herbs may have potential interactions with medications or specific health conditions. Open communication with your healthcare provider and a qualified TCM practitioner is vital to ensure a safe and effective experience.',
      ], 'number'),
      heading('FAQs about TCM in Confinement'),
      
      list([
        '**Q: Can I use TCM alongside Western medicine during confinement?**',
        'A: Yes, many women find that combining TCM with Western medicine can provide comprehensive care. However, it\'s important to inform both your healthcare provider and TCM practitioner about all treatments you are receiving to avoid any potential interactions.',
        '**Q: Are there any specific TCM practices to avoid during confinement?**',
        'A: Certain TCM practices, such as intense detoxification methods or certain herbal remedies, may not be suitable during the postpartum period. It\'s important to work with a qualified TCM practitioner who specializes in postpartum care to create a tailored treatment plan that aligns with your specific needs.',
        '**Q: Can TCM help with postpartum depression?**',
        'A: TCM takes a holistic approach to address emotional well-being, including postpartum depression. Herbal remedies, acupuncture, and mind-body practices prescribed by a qualified TCM practitioner can provide support and complement other forms of treatment.',
      ], 'none'),

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

      paragraph('**Ingredients:**'),
      list([ 
        ' 1 whole black chicken (around 1.2kg)',
        ' 30g ginseng root',
        ' 10 red dates',
        ' 5g wolfberries',
        ' 5g dried longan',
        ' 3 slices of ginger',
        ' 2 cloves of garlic',
        ' 2 tbsp rice wine',
        ' 10 cups of water'
      ]),

      paragraph('**Preparation**'),
      list([
        ' Soak the ginseng root in cold water for 30 minutes to an hour. This will help to soften the root and make it easier to handle.',
        ' Rinse the black chicken and remove any excess fat. Then, blanch the chicken in boiling water for 5 minutes to remove any impurities.',
        ' Rinse the red dates, wolfberries, and dried longan in cold water.',
        ' Peel and slice the ginger and garlic.'
      ], 'number'),

      paragraph('**Cooking Method:**'),
      list([
        ' In a large pot, add the blanched chicken, soaked ginseng root, red dates, wolfberries, dried longan, ginger, and garlic.',
        ' Pour in 10 cups of water and bring the pot to a boil over high heat.',
        ' Once the water is boiling, reduce the heat to low and simmer the soup for 2 to 3 hours, until the chicken is tender and the soup is flavorful.',
        ' Halfway through cooking, add 2 tbsp of rice wine to the pot to enhance the flavor of the soup.',
        ' Once the soup is done, turn off the heat and let it cool slightly.',
        ' Strain the soup and discard the solids.',
        ' Serve the soup hot with some steamed rice or on its own.'
      ], 'number'),

      list([
        '**Q: Can I use a regular chicken instead of a black chicken?**',
        'A: While you can use a regular chicken to make this soup, a black chicken is preferred as it has a richer and more intense flavor.',
        '**Q: How long can I keep the soup in the fridge?**',
        'A: You can keep the soup in the fridge for up to 3 days. To reheat, simply bring the soup to a boil over low heat.',
      ], 'none'),

      {type:'pinkHeading', text: 'Black Bean Pork Ribs Soup'},

      paragraph('A nourishing and flavourful dish, this soup is rich in protein, vitamins, and minerals, making it an excellent choice for new moms who need to replenish their bodies after childbirth.'
      ),

      paragraph('**Ingredients:**'),
      list([
        ' 500g pork ribs',
        ' 1 cup dried black beans',
        ' 2-3 slices of ginger',
        ' 1 tablespoon Shaoxing wine',
        ' 1 tablespoon soy sauce',
        ' 1 teaspoon salt',
        ' 8 cups water',
        ' Optional: 2-3 dried red dates, 2-3 dried shiitake mushrooms'
      ]),

      paragraph('**Directions:**'),
      list([
        ' Soak the black beans in water for at least 2 hours or overnight. Drain and set aside.',
        ' n a large pot, blanch the pork ribs in boiling water for 3-5 minutes to remove any impurities. Rinse and set aside.',
        ' In the same pot, sauté the ginger until fragrant. Add the pork ribs and stir-fry until lightly browned.',
        ' Add the black beans, Shaoxing wine, soy sauce, salt, and water to the pot. Bring to a boil, then reduce heat and simmer for 2-3 hours, or until the pork ribs are tender and the beans are soft.',
        ' Optional: Add dried red dates and shiitake mushrooms during the last 30 minutes of cooking.',
        ' Serve hot and enjoy!'
      ], 'number'),

      paragraph('**Tips and Tricks:**'),
      list([
        ' Soaking the black beans in advance helps them cook faster and more evenly.',
        ' Blanching the pork ribs before cooking removes any impurities and improves the flavor of the soup.',
        ' Adding dried red dates and shiitake mushrooms can enhance the flavor and nutritional value of the soup.',
        ' Adjust the salt and soy sauce to taste.'
      ]),

      {type:'pinkHeading', 
      text: 'Steamed Threadfin with Black Fungus and Ginger'
     },

     paragraph('Steamed threadfin with black fungus and ginger is a popular dish for confinement mothers because of its health benefits. Here are some of the benefits of this nutritious dish:'
      ),

      list([
        ' **Rich in protein** - Threadfin is a good source of protein, which is essential for muscle repair and growth',
        ' **Boosts immunity** - Black fungus contains beta-glucans, a type of carbohydrate that can boost the immune system and fight off infections.',
        ' **Anti-inflammatory** - Ginger has anti-inflammatory properties that can help reduce inflammation and swelling, making it an ideal ingredient for postpartum recovery.',
        ' **Helps with digestion** - Sesame oil is high in antioxidants and can help promote healthy digestion.'
      ], 'number'),

      paragraph('**Ingredients:**'),
      list([
        ' 1 small-sized threadfin (about 500g)',
        ' 20g black fungus',
        ' 20g ginger, julienned',
        ' 2 tablespoons light soy sauce',
        ' 1 tablespoon sesame oil',
        ' 1 tablespoon Shaoxing wine',
        ' 1 teaspoon sugar',
        ' 1 tablespoon vegetable oil',
        ' 2 stalks scallions, chopped',
        ' 1 red chili, sliced (optional)'
      ]),

      paragraph('**Instructions:**'),
      list([
        ' Soak the black fungus in water for 30 minutes or until softened. Drain and cut into smaller pieces.',
        ' Clean the threadfin and pat dry with paper towels. Make 3-4 shallow cuts on each side of the fish.',
        ' In a bowl, mix together the light soy sauce, sesame oil, Shaoxing wine, and sugar. Set aside.',
        ' In a wok or frying pan, heat the vegetable oil over small heat. Add the ginger and stir-fry for 1-2 minutes until fragrant.',
        ' Add the black fungus and stir-fry for another 2-3 minutes.',
        ' Pour the soy sauce mixture into the wok and bring to a boil.',
        ' Place the threadfin on a heatproof plate and pour the ginger and black fungus mixture over it.',
        ' Steam the fish over high heat for 10-12 minutes or until fully cooked.',
        ' Garnish with chopped scallions and sliced red chili (optional).'
      ], 'number'),

      {type:'pinkHeading', 
      'text': 'Stir-Fried Kai Lan with Pork Kidney'
     },
      paragraph('Pork kidney is a good source of protein, vitamin B12, and iron, all of which are important for postpartum recovery. Kai lan is also packed with vitamins A, C, and K, as well as calcium and fiber.'
      ),
      
      paragraph('**Ingredients:**'),
      list([
        ' 500g kai lan (Chinese broccoli)',
        ' 2 cloves of garlic, chopped',
        ' 1 tablespoon of ginger, grated',
        ' 1 tablespoon of light soy sauce',
        ' 1 teaspoon of sesame oil',
        ' 1 tablespoon of vegetable oil',
        ' Salt and pepper to taste'
      ]),

      paragraph('**Instructions:**'),
      list([
        ' Preparing the pork kidney: Rinse the pork kidney thoroughly under running water and cut into thin slices. Soak the slices in cold water for 30 minutes to remove any impurities and excess blood. Drain and pat dry with a paper towel.',
        ' Preparing the kai lan: Wash the kai lan thoroughly under running water and chop into bite-sized pieces, separating the leaves from the stems.',
        ' In a wok or frying pan, heat up the vegetable oil over high heat. Add the garlic and ginger and stir-fry for 30 seconds until fragrant.',
        ' Add the pork kidney slices and stir-fry for 3-4 minutes until they turn golden brown.',
        ' Add the kai lan stems and continue to stir-fry for another 2-3 minutes until they are tender.',
        ' Finally, add the kai lan leaves, light soy sauce, and sesame oil, and stir-fry for another 1-2 minutes until the leaves are wilted but still bright green.',
        ' Season with salt and pepper to taste and serve hot.'
      ], 'number'),

      list([
        '**Q: Can I use other types of meat instead of pork kidney?**',
        'A: Yes, you can use chicken or beef if you prefer. However, pork kidney is a traditional ingredient in this dish and is particularly beneficial for postpartum recovery.',
        '**Q: Can I substitute kai lan with other vegetables?**',
        'A: Yes, you can use other leafy greens such as bok choy or choy sum if kai lan is not available.',
      ], 'none'),

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
        ' Help with blood circulation and promote healing',
        ' Nourish the blood and boost energy levels',
        ' Aid in digestion and relieve constipation',
        ' Improve the immune system and fight against infections',
      ]),

      paragraph('**Ingredients**'),
      list([
          ' 1 whole chicken (about 1k g)',
          ' 50g Dang Gui (Chinese Angelica Root)' ,
          ' 20g Dried Longan', 
          ' 10g Goji Berries' ,
          ' 20g Red Dates' ,
          ' 2 slices of ginger' ,
          ' 10 cups of water',
          ' Salt to taste',
      ]),

      paragraph('**Instructions**'),
      list([
        ' Rinse the chicken and remove any excess fat or organs. Place it in a pot of boiling water for 5 minutes to remove any impurities. Remove and set aside.',
        ' Rinse all the herbs and dried fruits.',
        ' In a clean pot, add 10 cups of water and bring it to a boil.',
        ' Add the chicken, Dang Gui, dried longan, goji berries, red dates, and ginger to the pot.',
        ' Bring the soup to a boil again, then reduce the heat to low and let it simmer for 2 hours.',
        ' Add salt to taste and serve hot.',
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
      ], 'none'),
      
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
        ' Mood swings',
        ' Feelings of sadness, anxiety, or irritability',
        ' Crying spells for no apparent reason',
        ' Difficulty sleeping or sleeping too much',
        ' Loss of appetite or overeating',
        ' Fatigue and lack of energy',
        ' Difficulty concentrating or making decisions',
        ' Feelings of guilt or worthlessness',
        ' Reduced interest in activities that were previously enjoyed',
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
        
        '**Rest and sleep:** Getting adequate rest and sleep is important for new mothers, as it can help alleviate fatigue and improve mood. It may be helpful to nap when the baby naps, or to enlist the help of a partner or loved one to take care of the baby so that the mother can rest.',
        '**Eat a healthy diet:** Eating a healthy and balanced diet can help support overall health and wellbeing, and may also improve mood. It may be helpful to plan and prepare healthy meals and snacks in advance, or to ask for help from loved ones.',
        '**Exercise:** Exercise can help alleviate stress and improve mood, and may also provide an opportunity for social interaction. Start with gentle exercises, such as walking or yoga, and gradually increase intensity as strength and energy levels allow.',
        '**Seek support:** It is important for new mothers to seek support from loved ones, healthcare providers, or support groups. Talking to other mothers who have experienced baby blues or postpartum depression can be particularly helpful, as they may have tips and advice for managing symptoms and coping with the challenges of motherhood.',
        
        ' Support groups or therapy sessions can also provide a safe space for new mothers to discuss their feelings and concerns.',
        
        '**Practice self-care**: Taking time for self-care can help new mothers feel refreshed and rejuvenated. This can include activities such as taking a warm bath, reading a book, or spending time outdoors.',
        '**Stay connected**: Feeling isolated or disconnected from others can contribute to feelings of sadness and anxiety. Stay connected with family and friends, either in person or through phone calls or video chats.',
        ' Joining a new mother\'s group or attending classes with other new parents can also provide opportunities for social interaction and support.',
        
        ' Dealing with baby blues is a common experience for many new mothers, but it doesn\'t have to define your postpartum journey. By recognising the symptoms, understanding the causes, and implementing effective strategies for managing and overcoming baby blues, you can navigate this emotional period with confidence and resilience.',
        
        ' Remember, you are not alone in this journey. Reach out to your support system, whether it\'s your partner, family, or friends, and don\'t hesitate to seek professional help if needed',
      ], 'none'),
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
        
        'During childbirth, the body undergoes a lot of stress and trauma. Papaya fish soup contains high levels of collagen, which can help to speed up the healing process and repair damaged tissue. It is also rich in vitamins A and C, which are essential for wound healing and tissue repair.',
       
        '**Nourishes the Body**',
        
        'Papaya fish soup is an excellent source of protein, which is essential for building and repairing tissues in the body. It also contains a variety of vitamins and minerals, including vitamin B12, iron, and calcium, which are important for overall health and wellbeing.',
        
        '**Boosts Breast Milk Production**',
        
        'Breastfeeding is an important part of postpartum recovery, and papaya fish soup is believed to help boost milk production. Papaya contains enzymes that can help to increase milk supply, while fish is rich in omega-3 fatty acids, which are important for the development of the baby\'s brain.',
        
        '**Provides Energy**',
       
        'New mothers often feel tired and exhausted during the confinement period. Papaya fish soup is a great source of energy, thanks to its high protein content and complex carbohydrates. It can help to keep you feeling full and energized throughout the day.',
        
        '**Improves Digestion**',
        
        'Many new mothers experience digestive issues during the postpartum period, such as constipation and bloating. Papaya fish soup contains enzymes that can help to improve digestion and reduce bloating. It is also a great source of fiber, which can help to promote regular bowel movements.',
       
        '**Boosts Immunity**',
       
        'The confinement period is a time when new mothers are more susceptible to infections and illnesses. Papaya fish soup is rich in antioxidants, which can help to boost the immune system and protect against infections. It is also a great source of vitamin C, which is essential for immune function.',
        
      ], 'none'),

      gallery(ARTICLE_IMAGES.papaya, 'Papaya fish soup remains one of the most recognisable confinement dishes.'),
      paragraph(
        'Papaya fish soup appears in many confinement menus because it feels light, warm, and nourishing at the same time. The earlier blog positioned it as a practical dish for mothers who want comfort without an overly rich meal.'
      ),
      
      heading('How to Prepare Papaya Fish Soup'),
      paragraph('**Ingredients:**'),
      list([
        ' 1 papaya, peeled and chopped',
        ' 500g fish (such as cod or snapper), cut into chunks',
        ' 1 inch ginger, sliced',
        ' 3 cloves garlic, minced',
        ' 1 onion, chopped',
        ' 2 stalks spring onion, chopped',
        ' 2-3 red dates',
        ' 1 tablespoon cooking oil',
        ' Salt and pepper to taste',
        ' Water',
      ]),

      paragraph('**Instructions:**'),
      list([
        ' Heat up the cooking oil in a pot.',
        ' Add the garlic, onion, and ginger and sauté until fragrant.',
        ' Add the fish and cook for a few minutes.',
        ' Add the chopped papaya, red dates, and enough water to cover the ingredients. Bring to a boil.',
        ' Reduce heat and simmer for 20-30 minutes, or until the papaya is soft and the fish is cooked through.',
        ' Add salt and pepper to taste.',
        ' Garnish with chopped spring onions before serving.',
      ], 'number'),

      paragraph('It can be consumed as a standalone meal or served as a side dish with rice or noodles. It is also important to consume a variety of other nutrient-dense foods such as fruits, vegetables, lean proteins, and whole grains to ensure optimal postpartum recovery.'),
      paragraph('It is important to note that fish should be thoroughly cooked to avoid food poisoning. Raw or undercooked fish can contain harmful bacteria and parasites that can cause foodborne illnesses. Confinement mothers should ensure that the fish is cooked to an internal temperature of 145°F (63°C) and avoid consuming fish that has a strong odor or unusual color.'),
      paragraph('In conclusion, papaya fish soup is a nutritious and delicious dish that offers a range of health benefits for confinement mothers. By incorporating this soup into their diets, confinement mothers can improve their nutrient intake, boost their immunity, and support their postpartum recovery. '),
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
      paragraph('**Ingredients:**'),
      list([
        '50g dried red dates',
        '25g dried longan',
        '1.5L water',
        'Rock sugar to taste (optional)',
      ], 'none'),

      paragraph('**Instructions**'),
      list([
        ' Rinse the red dates and dried longan with water and drain',
        ' In a pot, add the red dates, dried longan, and water',
        ' Bring the water to a boil over high heat',
        ' Once the water is boiling, lower the heat to small-low and let it simmer for about 45 minutes to an hour',
        ' Stir occasionally to prevent the ingredients from sticking to the bottom of the pot',
        ' After 45 minutes to an hour, the water should have reduced to about half',
        ' If you want the tea to be sweeter, you can add rock sugar to taste',
        ' Stir until the sugar is dissolved',
        ' Turn off the heat and let the tea cool down for a few minutes',
        ' Strain the tea and serve hot',
      ]),
      paragraph('Red dates tea with longan is best consumed warm, as it is believed to have better therapeutic effects when consumed warm. You can drink this tea daily during confinement to help nourish and replenish your body.'),
      quote("A quiet cup of red dates tea is a gentle reminder to slow down, steep in the moment, and let warmth fill the spaces in between"),
      image(
        {
          src: '/banners/banner.png',
          alt: 'https://www.chillipadiconfinement.com/product',
          maxWidth: 650,
          displayHeight: 57,
        }
      ),
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
        ' **Relief from Neck and Shoulder Pain:** The constant carrying and breastfeeding of the baby can strain the neck and shoulders, leading to discomfort. Postnatal massage helps to relieve this pain, allowing mothers to care for their newborns more comfortably.',
        ' **Helps to Restore the Uterus to Its Original State:** Postnatal massage can aid in the natural process of shrinking the uterus back to its original state, promoting faster recovery.',
        ' **Reduction of Excess Fluids:** During pregnancy, the body tends to retain excess fluids. Postnatal massage helps in the elimination of these fluids, reducing water retention and contributing to overall comfort.',
        ' **Weight Loss Support:** Regular postnatal massage can assist in weight loss by stimulating the body\’s metabolism and encouraging the breakdown of fat.',
        ' **Improved Blood Circulation:** Enhanced blood circulation is one of the key benefits of postnatal massage. This not only helps in faster healing but also boosts energy levels, which is crucial for new mothers who need to be at their best for their baby.'
      ], 'number' ),

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
    id: 'post-16',
    slug:'say-goodbye-to-stretch-marks-after-childbirth-effective-prevention-tips',
    title: 'Say Goodbye to Stretch Marks After Childbirth: Effective Prevention Tips',
    excerpt: 'Motherhood is an exciting and fulfilling time in your life, but it can also be stressful. You may be worried about your body and how it has changed during pregnancy, and one common concern is the appearance of stretch marks.',
    category: 'Stretch Marks',
    tags: ['beauty and skincare' , 'postpartum recovery' ],
    coverUrl: ARTICLE_IMAGES.stretchMarks[0].src,
    createdAt: '2026-09-10T09:00:00+08:00',
    reference: ['https://chillipadiconfinement.com/blogs/confinement-tips/say-goodbye-to-stretch-marks-after-childbirth-effective-prevention-tips', 'https://www.aad.org/public/cosmetic/scars-stretch-marks/stretch-marks-why-appear' , 'https://www.mayoclinic.org/diseases-conditions/stretch-marks/symptoms-causes/syc-20351139' ],
    blocks:[
      paragraph('Stretch marks can be a source of insecurity for many new moms, but the good news is that there are steps you can take to prevent them from appearing or reduce their appearance.'),
      {type: 'heading', text: 'Understanding Stretch Marks', size: 'large'}, 
      paragraph('Stretch marks, also known as striae gravidarum, occur when the skin\'s elastic fibers are stretched beyond their limit, causing the underlying collagen and elastin to rupture. They commonly appear as streaks or bands of discolored skin, ranging from pink to purple or silver. Stretch marks can occur on the abdomen, breasts, thighs, hips, and buttocks, areas most affected by pregnancy-related changes.'),
      paragraph('**FACTORS INFLUENCING STRETCH MARK FORMATION**'),
      paragraph('Various factors contribute to the development of stretch marks after childbirth. Understanding these factors can help you make informed decisions in preventing and managing them.'),
      {type: 'heading', text: '1. Genetic Predisposition', size: 'small'},
      list([
        ' Genetic factors play a role in determining your susceptibility to stretch marks. If your mother or other close relatives experienced them during pregnancy, you may have a higher likelihood of developing them too.',]),
      {type: 'heading', text: '2. Weight Gain', size: 'small'},
      list([
        ' Rapid weight gain during pregnancy can strain the elasticity of your skin, leading to the formation of stretch marks. Gradual and healthy weight gain, guided by your healthcare provider, can help minimise the risk.',]),
      {type: 'heading', text: '3. Hormonal Changes', size: 'small'},
      list([
        'Hormonal fluctuations during pregnancy can affect the production of collagen and elastin, essential proteins responsible for skin elasticity. Reduced levels of these proteins can make your skin more prone to stretch marks.'
      ]),
      {type: 'heading', text: '4. Hydration', size: 'small'},
      list([
        'Proper hydration is crucial for maintaining skin elasticity. Adequate water intake can promote skin health and reduce the likelihood of stretch marks.'
      ]),
      {type: 'heading', text: 'Effective Strategies for Preventing Stretch Marks', size: 'large'}, 
      paragraph('Now that we understand the factors involved, let\'s explore practical strategies to help prevent stretch marks after childbirth:'),
      list([
        '**Moisturise Regularly**'
      ]),
      paragraph('Keep your skin well-hydrated by applying a nourishing, moisturizing cream or oil. Look for products containing ingredients like cocoa butter, shea butter, almond oil, or vitamin E, which can help improve skin elasticity. Massage the moisturizer gently into the areas prone to stretch marks.'),
      list([
        '**Stay Hydrated**'
      ]),
      paragraph('Hydrating your body from within is equally important. Aim to drink at least eight glasses of water daily to maintain optimal skin hydration and support its natural elasticity.'),
      list([
        '**Eat a Nutrient-rich Diet**'
      ]),
      paragraph('Consuming a balanced diet rich in vitamins A, C, E, and zinc can promote skin health. These nutrients help support collagen production and overall skin elasticity. Include fruits, vegetables, lean proteins, and whole grains in your meals.'),
      list([
        "**Gradual Weight Gain**"
      ]),
      paragraph('Work closely with your healthcare provider to ensure a healthy and gradual weight gain during pregnancy. Avoid rapid weight gain, which can strain your skin and increase the chances of stretch marks.'),
      list([
        '**Gentle Exercise**'
      ]),
      paragraph('Engage in gentle exercises recommended by your healthcare provider to maintain muscle tone and improve circulation. Exercise can help with overall skin health and elasticity.'),
      list([
        '**Use Sunscreen**'
      ]),
      paragraph('Protect your skin from harmful UV rays by applying a broad-spectrum sunscreen with a high SPF when spending time outdoors. Sun damage can make stretch marks more prominent.'),
      
      {type: 'heading' , text: 'FAQs', size: 'large'},
      paragraph('**Q: Are there any specific creams or oils that can prevent stretch marks?**'),
      paragraph('A: While no cream or oil can guarantee complete prevention, products containing ingredients like cocoa butter, shea butter, almond oil, or vitamin E can help improve skin elasticity and minimize the appearance of stretch marks.'),
      paragraph('**Q: Can I use exfoliation to prevent stretch marks?**'),
      paragraph('A: Exfoliation can be beneficial for improving skin texture but should be done with caution during pregnancy. Consult with your healthcare provider or a skincare professional to determine the safest approach.'),
      paragraph('**Q: Can stretch marks disappear completely?**'),
      paragraph('A: While stretch marks may fade over time, they typically do not disappear completely. However, following prevention strategies and adopting a healthy skincare routine can help minimise their appearance.'),
      paragraph('**Conclusion**'),
      paragraph('Preventing stretch marks after childbirth requires a proactive approach that balances different factors, such as genetics, weight gain, and skincare practices.'),
      paragraph('By moisturising regularly, staying hydrated, eating a nutrient-rich diet, managing weight gain, and engaging in gentle exercise, you can significantly reduce the likelihood and appearance of stretch marks.'),
      paragraph('Remember, embracing your body\'s natural changes during this incredible journey is just as important as maintaining skin health.'),
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
    id: 'post-17',
    slug:'battling-postpartum-blues-understanding-and-overcoming-postpartum-depression',
    title: 'Battling Postpartum Blues: Understanding and Overcoming Postpartum Depression',
    excerpt: 'Picture this: you\'ve just welcomed your little bundle of joy into the world, and you expected to be floating on cloud nine. Instead, you\'re feeling more like a stormy sea, with waves of emotions crashing over you. That\'s where the baby blues come in, leaving you feeling a little down in the dumps. It\'s like a temporary rain shower on your parade.',
    category: 'Postpartum',
    tags: [ 'confinement period', 'mental health', 'postpartum recovery'],
    coverUrl: ARTICLE_IMAGES.depression[0].src,
    createdAt: '2026-09-10T09:00:00+08:00',
    reference: [ 'https://www.apa.org/topics/postpartum-depression' , 'https://www.mayoclinic.org/diseases-conditions/postpartum-depression/symptoms-causes/syc-20376617'],
    blocks: [
      heading('WHAT IS POSTPARTUM DEPRESSION (PPD)?'),
      paragraph('Postpartum depression, also known as postnatal depression, is a type of mood disorder that can affect parents after the birth of a child. Unlike the commonly experienced baby blues, which usually last for a few days and are relatively mild, postpartum depression is more intense and persistent. It can cast a dark shadow over what should be a joyful time in a parent\'s life.'),
      heading('SYMPTOMS OF POSTPARTUM DEPRESSION'),
      paragraph('Postpartum depression manifests in various ways and can vary from person to person. Here are some common symptoms to watch out for:'),
      list([
        '**Persistent Sadness:** Feeling an overwhelming sense of sadness or hopelessness that persists throughout the day, lasting for weeks or even months. It\'s as if a dark cloud is hanging over you, making it difficult to find joy in everyday activities.',
        '**Loss of Interest:** Experiencing a diminished interest in activities that were once enjoyable, including hobbies, socialising, and even caring for the newborn. You may find yourself going through the motions without feeling any genuine pleasure or connection.',
        '**Fatigue and Lack of Energy:** Feeling constantly drained and exhausted, both physically and mentally, regardless of adequate rest. It\'s like running on empty, struggling to find the energy to perform even the simplest tasks.',
        '**Disturbed Sleep Patterns:** Experiencing trouble falling asleep, staying asleep, or sleeping excessively, even when the baby is resting peacefully. Sleep becomes elusive, leaving you feeling even more exhausted and emotionally fragile.',
        '**Changes in Appetite:** Having an increased or decreased appetite, leading to significant weight gain or loss. Food may lose its appeal, or you may find yourself seeking solace in unhealthy eating habits.',
        '**Irritability and Anger:** Feeling irritable, agitated, or angry, often without a clear reason, and snapping at loved ones or displaying unusual aggression. The littlest things can set off intense emotional reactions, leaving you feeling guilty and out of control.',
        '**Difficulty Bonding with the Baby:** Struggling to form a connection with the newborn or experiencing feelings of detachment or indifference. You may feel disconnected from your role as a parent, which can further contribute to feelings of guilt and inadequacy.'
      ], 'number'),

      heading('WHAT CAUSES POSTPARTUM DEPRESSION?'),
      paragraph('Postpartum depression is not caused by a single factor but rather results from a combination of physical, emotional, and environmental elements. Let\'s explore some of the common factors associated with this condition:'),
      list([
        '**Hormonal Imbalance:** After childbirth, there is a rapid decline in estrogen and progesterone levels, which can disrupt the delicate balance of brain chemicals and contribute to mood swings. It\'s like a roller coaster ride for your emotions, with sudden drops and unpredictable twists.',
        '**History of Mental Health Conditions:** Individuals with a history of depression, anxiety, or other mental health disorders are more susceptible to developing postpartum depression. It\'s as if there\'s a predisposition that makes the journey into parenthood even more challenging.',
        '**Lack of Support:** Limited emotional and practical support from partners, family members, or friends can increase the risk of postpartum depression. Feeling isolated or overwhelmed can intensify feelings of sadness and hopelessness. It\'s like trying to navigate a stormy sea without a life raft.',
        '**Sleep Deprivation:** The demanding schedule of caring for a newborn often leads to disrupted sleep patterns, which can exacerbate emotional distress and contribute to the development of postpartum depression. It\'s like trying to function on autopilot while sleep-deprived, which takes a toll on your mental well-being.',
        '**Life Stressors:** Significant life events, such as financial problems, relationship difficulties, or the loss of a loved one, can amplify the emotional challenges of adjusting to parenthood and increase the risk of postpartum depression. It\'s like carrying the weight of the world on your shoulders while trying to nurture and care for a newborn.'
      ]),

      heading('HOW TO TREAT POSTPARTUM DEPRESSION?'),
      paragraph('The good news is that postpartum depression is a highly treatable condition. Seeking support and professional help is crucial in overcoming this challenging phase. Here are some effective treatment options:'),
      list([
        '**Therapy and Counseling:** Individual therapy or group counseling sessions can provide a safe space to express your emotions, learn coping strategies, and gain valuable insights from experienced professionals. It\'s like having a guiding light to help you navigate through the darkness and find your way back to yourself. Cognitive-behavioral therapy (CBT) has shown particular efficacy in treating postpartum depression.',
        '**Medication:** In some cases, healthcare providers may prescribe antidepressant medications to help alleviate the symptoms of postpartum depression. It\'s essential to consult with your healthcare provider to assess the risks and benefits, especially if you are breastfeeding. Remember, taking medication doesn\'t mean you\'ve failed—it\'s a tool to support you on your journey to recovery.',
        '**Lifestyle Changes:** Incorporating self-care practices into your daily routine can have a profound impact on your mental well-being. Engage in activities that promote relaxation, such as meditation, exercise, or spending time in nature. Additionally, prioritise proper nutrition, and ensure you get sufficient sleep whenever possible. It\'s like nourishing your body and soul, allowing yourself the time and space to heal.',
        '**Social Support:** Reach out to your support network, whether it\'s your partner, family, or close friends. Sharing your feelings and experiences with trusted individuals can provide emotional comfort and practical assistance, lessening the burden of postpartum depression. Remember, you don\'t have to face this journey alone—there are people who care and want to help.',
        '**Joining Support Groups:** Connecting with other parents who have experienced or are currently experiencing postpartum depression can be immensely helpful. Support groups offer a sense of community, validation, and the opportunity to exchange advice and coping strategies. It\'s like finding a tribe that understands your journey and provides unconditional support.'
      ], 'number'),

      heading('CHALLENGES AND TRADEOFFS'),
      paragraph('It\'s important to acknowledge that the road to recovery from postpartum depression can be challenging and unique to each individual. Balancing the demands of caring for a newborn, seeking professional help, and implementing self-care practices may present certain tradeoffs. Here are a few challenges you may encounter:'),
      list([
        "**Time Constraints:** Juggling the responsibilities of parenthood alongside therapy sessions, support groups, and self-care practices can feel overwhelming. Finding a schedule that accommodates your needs and commitments may require creative time management. It's like trying to fit the pieces of a puzzle together, rearranging your daily routine to prioritize your well-being.",
        "**Stigma and Shame:** Societal stigma surrounding mental health issues can make it difficult to seek help or discuss postpartum depression openly. However, it's crucial to remember that seeking support is a sign of strength and a step towards recovery. Let go of any shame or guilt—your well-being matters, and reaching out for help is a courageous act.",
        "**Medication Considerations:** While antidepressant medication can be effective in treating postpartum depression, there may be concerns about potential side effects, particularly for breastfeeding mothers. Consulting with a healthcare provider can help address these concerns and explore alternative options, if necessary. Remember, healthcare professionals can guide you in making informed decisions that prioritize both your mental health and your baby's well-being."
      ]),
      quote ('Healing from postpartum depression takes time, support, and profound self-compassion. Remember: you are not failing, you are healing, and you do not have to walk through the dark alone.') ,
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
    id: 'post-18',
    slug:'10-must-have-essentials-for-expectant-moms-what-every-pregnant-woman-needs',
    title: '10 Must-Have Essentials for Expectant Moms: What Every Pregnant Woman Needs',
    excerpt: 'Pregnancy is a unique and transformative experience, and being well-prepared can alleviate any unnecessary stress along the way. By investing in the right essentials, you can focus on nurturing yourself and your growing baby, fostering a positive environment for both of you.',
    category: 'Essentials',
    tags: [ 'mental health', 'pregnancy'],
    coverUrl: ARTICLE_IMAGES.essentials[0].src,
    createdAt: '2026-09-10T09:00:00+08:00',
    reference: [ 'https://chillipadiconfinement.com/blogs/confinement-tips/' ],
    blocks: [
      paragraph('So, whether you\'re seeking guidance on maternity clothing, prenatal vitamins, or baby essentials, keep reading as we unveil the must-haves for every expectant mother. Let\'s dive into the top 10 essentials to ensure your journey to motherhood is as smooth, enjoyable, and memorable as possible.'),
      {type: 'heading' , text: 'Maternity Clothing: Dressing for Comfort and Style', size: 'small', uppercase:true},
      paragraph('During pregnancy, your body goes through significant changes, and finding comfortable and stylish clothing becomes essential. Maternity clothing is designed to accommodate your growing belly, provide support, and ensure you feel confident throughout your pregnancy.'),
      paragraph('Look for stretchy fabrics, adjustable waistbands, and styles that flatter your changing silhouette. Embrace your beautiful bump and enjoy expressing your personal style through maternity fashion.'),
      {type: 'heading' , text: 'Supportive Maternity Bras: The Foundation of Comfort', size: 'small', uppercase:true},
      paragraph('As your breasts undergo changes during pregnancy, investing in supportive maternity bras is crucial. A well-fitted maternity bra offers the necessary support and prevents discomfort. Look for bras with adjustable straps, wider bands, and breathable fabrics. Consider getting fitted by a professional to find the right size and choose different styles to accommodate the changes in your breast size throughout pregnancy and beyond.'),
      {type: 'heading' , text: 'Prenatal Vitamins: Nourishing You and Your Baby', size: 'small', uppercase:true},
      paragraph('Prenatal vitamins are specially formulated to provide essential nutrients that support your health and the development of your baby. They supplement your diet with key vitamins and minerals like folic acid, iron, calcium, and omega-3 fatty acids.'),
      paragraph('Consult with your healthcare provider to determine the right prenatal vitamin for you, as different women have varying nutritional needs during pregnancy. Remember, prenatal vitamins are not a substitute for a healthy diet but rather an important complement to ensure optimal nourishment.'),
      {type: 'heading' , text: 'Body Pillows: Restful Nights and Relaxed Days', size: 'small', uppercase:true},
      paragraph('As your baby bump grows, finding a comfortable sleeping position can become challenging. Body pillows offer support and help alleviate discomfort, especially in the back, hips, and legs. Whether you choose a full-body pillow or a smaller one to place strategically, these pillows provide relief and promote better sleep quality. Experiment with different positions and pillow arrangements until you find what works best for you.'),
      {type: 'heading' , text: 'Pregnancy Books: Empowering Knowledge at Your Fingertips', size: 'small', uppercase:true},
      paragraph('Pregnancy is a journey full of questions and uncertainties. Pregnancy books can be a valuable resource, providing you with information, advice, and guidance. From understanding the stages of pregnancy to learning about labor and childbirth, these books empower you with knowledge.'),
      paragraph('Look for reputable authors and seek recommendations from other moms or healthcare professionals to find the most informative and reliable pregnancy books. Some popular recommendations include "What to Expect When You\'re Expecting" by Heidi Murkoff, Ina May\'s Guide to Childbirth by Ina May Gaskin, and The Mayo Clinic Guide to a Healthy Pregnancy by the Mayo Clinic.'),
      {type: 'heading' , text: 'Belly Balms and Oils: Pampering Your Growing Bump', size: 'small', uppercase:true},
      paragraph('Taking care of your skin during pregnancy is not only important for your comfort but also for preventing stretch marks and maintaining elasticity. Belly balms and oils are specifically formulated to nourish and moisturize your growing belly.'),
      paragraph('They help soothe itching, promote skin elasticity, and create a bonding ritual between you and your baby bump. Look for products with natural ingredients like cocoa butter, shea butter, and vitamin E for the best results.'),
      {type: 'heading' , text: 'Supportive Footwear: Happy Feet, Happy Mama', size: 'small', uppercase:true},
      paragraph('During pregnancy, many women experience foot and leg swelling and may develop foot pain or discomfort. Wearing supportive footwear can make a significant difference in your comfort levels.'),
      paragraph('Opt for shoes with good arch support, cushioning, and a roomy toe box. Avoid high heels and opt for flats or low-heeled shoes to reduce strain on your feet.'),
      paragraph('Remember, happy feet lead to a happier you!'),
      {type: 'heading' , text: 'Pregnancy Journal: Cherishing Precious Memories', size: 'small', uppercase:true},
      paragraph('Documenting your pregnancy journey in a journal is a beautiful way to capture the precious moments and memories. Whether it\'s jotting down your thoughts, milestones, or even pasting ultrasound pictures, a pregnancy journal becomes a cherished keepsake.'),
      paragraph('Start by choosing a journal that resonates with you and find moments each day to reflect on your experiences, emotions, and the excitement of becoming a mother.'),
      {type: 'heading' , text: 'Baby Essentials: Preparing for the Arrival', size: 'small', uppercase:true},
      paragraph('As you prepare for the arrival of your little one, it\'s important to gather the essential items your baby will need. From diapers and clothing to a safe crib and baby care products, make a checklist and start organizing early.'),
      paragraph('Seek advice from experienced parents, attend parenting classes, and consult reliable sources to ensure you have everything ready to welcome your bundle of joy.'),
      {type: 'heading' , text: 'Emotional Support: Surrounding Yourself with Love', size: 'small', uppercase:true},
      paragraph('Pregnancy can be an emotional rollercoaster, and having a strong support system in place is crucial. Surround yourself with loved ones who can provide emotional support, understanding, and encouragement. Join online communities or local pregnancy support groups to connect with other expectant moms who can relate to your experiences.'),
      paragraph('If needed, don\'t hesitate to seek professional help from therapists or counselors who specialise in maternal mental health.'),
      paragraph('Remember, taking care of your emotional well-being is just as important as taking care of your physical health during pregnancy.'),
      {type: 'heading' , text: 'Conclusion', size: 'small', uppercase:true},
      paragraph('Being well-prepared and equipped with the right essentials can significantly enhance your pregnancy journey. From maternity clothing and supportive bras to prenatal vitamins and emotional support, each item plays a crucial role in ensuring your comfort, well-being, and enjoyment during this special time.'),
      paragraph('Embrace the changes, cherish the memories, and savor every moment of this incredible journey into motherhood. Remember, every pregnancy is unique, so listen to your body, trust your instincts, and enjoy this incredible chapter of your life.'),
      
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
    id: 'post-19',
    slug:'ensuring-your-babys-safety-a-guide-to-sterilisers-for-moms',
    title: 'Ensuring Your Baby\'s Safety: A Guide to Sterilisers for Moms',
    excerpt: 'Becoming a new mom is a beautiful journey filled with decisions aimed at keeping your baby safe. One key task is sterilising baby bottles, pacifiers, and feeding equipment. Improper sterilisation can expose your baby to harmful bacteria, causing upset stomachs or infections. With modern technology, sterilisers now make this process easier and more efficient.',
    category: 'Sterilisers',
    tags: [ 'mental health', 'pregnancy', 'confinement' , 'food safety'],
    coverUrl: ARTICLE_IMAGES.sterilisers[0].src,
    createdAt: '2026-09-10T09:00:00+08:00',
    reference: [ 'https://www.nhs.uk/conditions/baby/breastfeeding-and-bottle-feeding/bottle-feeding/sterilising-baby-bottles/' , 'https://www.babycentre.co.uk/a562825/buying-a-steriliser' , 'https://www.philips.com.au/consumerfiles/pageitems/locales/en_GB/CONSUMER/categorypages/AventFeeding/assets/download/11762-Prep%20for%20feeding_article_GB.pdf'],
    blocks: [
      heading('Why sterilisation is Important'),
      paragraph('Bacteria from tap water, milk residue, or unwashed hands can cause infections in babies, whose immune systems are still developing. Adults may fend off such germs, but babies are more vulnerable. Sterilising feeding equipment and practicing good hygiene helps prevent illness. Once your baby turns one, their immune system will be stronger, and sterilisation may no longer be needed.'),
      heading('Benefits of using sterilisers'),
      list([
        '**Eliminates Harmful Germs:** Sterilisers help remove bacteria, viruses, and other harmful pathogens from baby bottles, pacifiers, breast pump parts, and other feeding equipment, reducing the risk of infections in babies with underdeveloped immune systems.',
        '**Saves Time:** Compared to traditional methods like boiling water, using a steriliser is much more efficient and convenient. With a larger capacity, it can sterilise multiple items at once, freeing up time for mums and allowing them to focus on other tasks.',
        '**Ensures Thorough Sterilisation:** Sterilisers offer consistent, thorough sterilisation, making sure that all surfaces of feeding equipment are properly sanitised, which is harder to achieve with manual cleaning.',
        '**Chemical-Free:** Steam sterilisers, in particular, do not require any harsh chemicals, making them a safe and eco-friendly option for cleaning baby gear.',
        '**Portable Options:** Some sterilisers are compact and portable, which is convenient for travelling. This allows mums to sterilise items on the go while ensuring baby products stay clean wherever you are.',
        '**Multi-Use:** Many modern sterilisers can also be used for other items such as toys and teethers, making them versatile tools in a busy mum’s routine.',
        '**Peace of Mind:** Knowing that feeding equipment is properly sterilised helps reduce worry about infections, allowing mums to focus more on bonding with their baby.'
      ], 'number'),

      {
        type: 'steriliserTable',
        title: 'Methods to sterilise equipment',
        rows: [
          {
          name: 'Boiling Method',
          description: 'Heating water to 100°C for 20 minutes kills most bacteria. This method is simple but time-consuming and requires constant supervision.',
          image: { src: ARTICLE_IMAGES.sterilisers[4].src , alt: 'Baby feeding equipment being boiled in a pot',},
          pros: 'Easy, cost-effective.', cons: 'Time-consuming, requires supervision, not suitable for all materials.', 
          },
          {
            name: 'Microwave Sterilisers',
            description: 'Microwave sterilisers use steam to sterilise baby feeding equipment. Follow the manufacturer’s instructions.',
            image: {  src: ARTICLE_IMAGES.sterilisers[2].src, alt: 'Microwave steriliser for baby feeding equipment', }, 
            pros: 'Quick and fairly inexpensive.', cons: 'Not suitable for all materials; requires a suitable microwave.', 
          },
          {
            name: 'Electric Steam Sterilisers',
            description: 'These plug-in devices use steam, requiring no chemicals or rinsing. They are highly effective and can keep items sterile for up to 24 hours with the lid closed. Some models even include an integrated dryer.',
            image: { src: ARTICLE_IMAGES.sterilisers[3].src , alt: 'Electric Steam Sterilisers', },
            pros: 'Non-toxic, large capacity, fast (8-15 minutes)' , cons: 'Can degrade plastics over time, requires maintenance.'
          },
          {
            name: 'UV Sterilisers',
            description: 'UV sterilisers use ultraviolet light, making them water-free and ideal for tech-savvy parents. However, they may be less effective on items with complex shapes and generally have smaller capacities. ',
            image: { src: ARTICLE_IMAGES.sterilisers[1].src , alt: 'UV Sterilisers'},
            pros: 'Portable, convenient, fast (10 minutes)' , cons: 'Small capacity, less effective on irregularly shaped items, requires maintenance.',
          }
        ],
       },   
      ],
     },

      {
    id: 'post-20',
    slug:'why-we-add-alchmey-fibre-for-rice-to-our-fragrant-white-rice',
    title: 'Why do we add Alchemy Fibre™ for Rice to our Fragrant White Rice?',
    excerpt: 'Alchemy Fibre™ for Rice is a powdered blend comprising of low glycemic index (GI), high fibre, high prebiotics plant-based dietary fibres. The infusion alters the dynamics of white rice, resulting in a lower GI while providing 10 times more fibre content yet without compromising on taste, texture, or appearance. Here at Chilli Padi Confinement, we incorporate Alchemy Fibre™ for Rice to our Fragrant White Rice to create a healthier option for postnatal mothers.',
    category: 'Health',
    tags: [ 'healthy eating', 'weight loss', 'confinement' , 'postpartum recovery'],
    coverUrl: ARTICLE_IMAGES.alchemyFibre[0].src,
    createdAt: '2026-09-10T09:00:00+08:00',
    reference: [ 'https://chillipadiconfinement.com/blogs/confinement-tips/' ],
    blocks: [
      {type: 'heading' , text: 'Benefits for Postnatal Mother:' , size: 'large'},
      paragraph('**Reduces Risk of Developing Type 2 Diabetes**'),
      image ({
        src: ARTICLE_IMAGES.alchemyFibre[3].src,
        alt: 'Sugar Cube'
      }),
      paragraph('Pregnancy can increase a woman\'s risk of developing gestational diabetes, a temporary condition that raises the risk of developing type 2 diabetes after delivery. Maintaining stable blood sugar levels is crucial for preventing this. Alchemy Fibre™ for Rice helps regulate blood sugar by promoting a controlled release of glucose, preventing the sharp spikes and crashes associated with high-GI foods.'),
      paragraph('**Weight Management**'),
      image ({
        src: ARTICLE_IMAGES.alchemyFibre[4].src,
        alt: 'Weighing Scale'
      }),
      paragraph('The increased fibre content in Alchemy Fibre™ for Rice promotes feelings of fullness, potentially aiding in weight management for mothers concerned about postpartum weight retention.'),
      paragraph('**Promotes Healthy Digestion**'),
      image ({
        src: ARTICLE_IMAGES.alchemyFibre[5].src,
        alt: 'Digestion'
      }),
      paragraph('Fibre plays a crucial role in maintaining digestive health by promoting regular bowel movements and preventing constipation, a common issue during the postpartum period.'),
      paragraph('**Strengthen Heart Health**'),
      image ({
        src: ARTICLE_IMAGES.alchemyFibre[2].src,
        alt: 'Heart Health'
      }),
      paragraph('Soluble fibre helps lower total blood cholesterol levels by reducing low-density lipoprotein, or "bad" cholesterol levels. Additionally, high-fibre foods reduce blood pressure, inflammation, and the risk of cardiovascular heart disease.'),

      { type: 'promoLink',
        before: 'Enjoy a healthier rice option with delicious confinement dishes!',
        linkText: 'Choos a meal plan here.',
        after: '',
        url: 'https://www.chillipadiconfinement.com/menu',
      },

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
    id: 'post-21',
    slug:'10-skincare-tips-to-nurture-your-glow-after-childbirth',
    title: '10 Skincare Tips to Nurture Your Glow After Childbirth',
    excerpt: 'While the arrival of your little one brings immense joy, it\'s important to take care of yourself too, including your skin. After childbirth, your skin may undergo various changes due to hormonal fluctuations and the demands of motherhood.',
    category: 'Health',
    tags: [ 'mental health', 'beauty and skincare', 'confinement' , 'postpartum recovery' , 'confinement period'],
    coverUrl: ARTICLE_IMAGES.skinCare[0].src,
    createdAt: '2026-09-10T09:00:00+08:00',
    reference: [ 'https://chillipadiconfinement.com/blogs/confinement-tips/' ],
    blocks: [
      paragraph('That\'s why we\'re here to provide you with essential skincare tips to help you nurture your skin and restore its natural radiance.'),
      paragraph('From simple yet effective practices to targeted skincare routines, we\'ve got you covered. So, let\'s dive into the world of postpartum skincare and discover the secrets to embracing your glow from within.'),
      {type:'pinkHeading', text:'HYDRATION: THE FOUNDATION OF GLOWING SKIN', },
      list([
        '**Drink Up, Glow On!**'
      ], ),
      paragraph('Hydration is essential for healthy, glowing skin. Drink plenty of water throughout the day to keep your skin plump and moisturised. Aim for at least 8 glasses a day and carry a water bottle with you wherever you go. Hydration is the secret ingredient to unlock your skin\'s natural radiance!'),
      list([
        ' **Nourish Your Skin from Within**'
      ], ),
      paragraph('A well-balanced diet packed with vitamins and minerals is a game-changer for your skin. Include fruits, vegetables, whole grains, and lean proteins in your meals to provide your skin with essential nutrients.'),
      paragraph('Foods rich in antioxidants, like berries and leafy greens, can help fight free radicals and promote a healthy complexion. Remember, your skin reflects what you put inside your body!'),
      list([
        '**Indulge in Skincare Luxuries**'
      ]),
      paragraph('Treating yourself to a little skincare pampering can do wonders for your postpartum glow. Invest in a gentle cleanser, moisturiser, and sunscreen suitable for your skin type. Don\'t forget the importance of regular exfoliation and face masks to reveal fresh, rejuvenated skin. '),
      {type: 'pinkHeading' , text: 'Be mindful of hormonal changes', },
      list([
        '**Adjust Your Skincare Routine**'
      ]),
      paragraph('Postpartum hormonal changes can bring about shifts in your skin\'s needs. Be mindful of any new concerns like dryness, oiliness, or sensitivity. Consider incorporating products specifically formulated for postpartum skin or seek advice from a skincare professional. Your skin is unique, and it deserves personalised attention!'),

      list([
        '**Combat Postpartum Acne**'
      ]),
      paragraph('Postpartum hormonal fluctuations can trigger acne breakouts. Opt for gentle, non-comedogenic skincare products to prevent clogged pores. Incorporate ingredients like salicylic acid or tea tree oil to help fight blemishes. Remember to resist the urge to pick or squeeze—gentle care is key.'),
      list([
        '**Embrace Stretch Mark Care**'
      ]),
      paragraph('Stretch marks are beautiful reminders of the miraculous journey your body went through. While they may fade over time, you can show your skin some extra love by applying moisturising oils or creams. Look for products containing ingredients like cocoa butter or shea butter, known for their nourishing properties. '),
      {type: 'pinkHeading', text: 'Protect your skin from the sun'},
      list([
        '**Shield Your Skin with SPF**'
      ]),
      paragraph('Sun protection is a non-negotiable step in your skincare routine. Apply a broad-spectrum sunscreen with an SPF of 30 or higher daily, even on cloudy days. Shielding your skin from harmful UV rays helps prevent sun damage, premature aging, and pigmentation. '),
      list([
        '**Rock That Hat and Shades**'
      ]),
      paragraph('In addition to sunscreen, accessorise with wide-brimmed hats and sunglasses to provide extra protection to your face and delicate eye area. Not only will you look fabulous, but you\'ll also keep those harmful rays at bay. '),
      {type: 'pinkHeading' , text: 'Sleep and self-care for radiant skin'},
      list([
        '**Beauty Rest: It\'s Real!**'
      ]),
      paragraph('Getting enough sleep is a beauty secret that should not be overlooked. When you\'re well-rested, your skin can rejuvenate and repair itself. Establish a consistent sleep routine, create a relaxing bedtime ritual, and make sleep a priority. Let your skin and body recharge during those precious moments of rest.'),
      list([
        '**Find Time for Self-Care**'
      ]),
      paragraph('Self-care isn\'t selfish—it\'s essential for your overall well-being and radiant skin. Set aside time for activities that bring you joy and relaxation, whether it\'s taking a bubble bath, reading a book, or practicing mindfulness. '),
      paragraph('**Conclusion**'),
      paragraph('Taking care of your skin after childbirth is a beautiful act of self-love. By following these top 10 skincare tips, you\'ll nourish your skin, embrace your postpartum glow, and feel confident in your own skin. Remember to be patient with yourself and celebrate the journey of motherhood. You\'re amazing and your radiant skin is a testament to the incredible journey you\'ve been through. Shine on!'),
      
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
    id: 'post-22',
    slug:'tips-on-surviving-the-wild-food-adventure-of-pregnancy',
    title: 'Tips on Surviving the Wild Food Adventure of Pregnancy',
    excerpt: 'Pregnancy brings an abundance of excitement, anticipation, and, let\'s be honest, some unforeseen shifts in your appetite. From peculiar cravings to sudden dislikes, your taste buds are about to embark on a thrilling ride! However, fret not, as this article aims to provide you with the essential advice and strategies necessary to navigate this adventurous culinary experience successfully.',
    category: 'Food',
    tags: [ 'healthy eating', 'mental health', 'pregnancy' , 'nourishing food'],
    coverUrl: ARTICLE_IMAGES.wildFood[0].src,
    createdAt: '2026-09-10T09:00:00+08:00',
    reference: [ 'https://www.acog.org/womens-health/faqs/nutrition-during-pregnancy' , 'https://www.nhs.uk/start4life/pregnancy/healthy-eating-pregnancy' ],
    blocks: [
      {type: 'heading' , text: 'Understanding Appetite Changes during Pregnancy', size: 'large'},
      paragraph('Appetite changes during pregnancy are like a culinary magic show, and several factors contribute to this phenomenon. Hormonal fluctuations, especially the rise in estrogen and progesterone, take the center stage and influence your taste buds and cravings. These hormones can turn previously mundane foods into delectable treats or make you want to avoid them altogether. The changes in blood flow and metabolism also play a role in your appetite, making it a true feast of factors that shape your culinary desires.'),

      {type: 'heading' , text: 'Hormones: The culprits behind your crazy cravings!', size: 'small', uppercase:true},

      paragraph('When it comes to cravings during pregnancy, hormones take the blame! Estrogen, the superstar hormone of pregnancy, has a way of turning your taste buds into adventurous explorers. It can make you yearn for pickles and ice cream, or maybe even a peculiar combination like chocolate-covered potato chips.'),
      paragraph('Progesterone, on the other hand, can stir up some digestive drama, leading to heartburn or bloating that may influence your food choices. The interplay of these hormones creates the perfect storm for those delightful and sometimes peculiar cravings.'),
      
      {type: 'heading' , text: 'Appetite Mayhem: Common Changes and What They Mean!', size: 'small', uppercase:true},

      paragraph('During pregnancy, your appetite can go through some wild changes. For some lucky moms-to-be, the appetite goes into overdrive, and they find themselves feeling like they could eat a horse!'),
      paragraph('Others may experience aversions, where foods they used to love suddenly become as appealing as a plate of brussels sprouts to a toddler. And let\'s not forget those peculiar cravings that make you wonder if your taste buds have gone on vacation. These changes can have implications for your nutrition and weight gain during pregnancy, so it\'s important to strike a balance between indulging those cravings and maintaining a healthy diet for you and your baby.'),
      
      {type: 'heading' , text: 'Coping Strategies for Satisfying Cravings and Conquering Aversions', size: 'large'},

      paragraph('When cravings strike, it\'s all about finding that perfect harmony between satisfying your taste buds and nourishing your body. You don\'t have to deny yourself the foods you crave, but it\'s essential to make mindful choices. Incorporate nutrient-rich options into your diet, such as whole grains, lean proteins, and colorful fruits and vegetables.'),
      paragraph('If you\'re craving something sweet, try satisfying your sweet tooth with a juicy piece of fruit or a small portion of dark chocolate. Get creative in the kitchen and experiment with healthier alternatives or modifications to your favorite recipes.'),
      paragraph('You might be surprised at how satisfying and nutritious your cravings can be!'),

      {type: 'heading' , text: 'Listen to Your Belly: The Power of Intuitive Eating', size: 'small', uppercase:true},

      paragraph('Your body is your best guide during pregnancy, and listening to its cues is key.'),
      paragraph('Pay attention to your hunger and fullness signals to ensure you\'re meeting your nutritional needs without overeating. When you feel hungry, choose wholesome snacks that provide sustained energy, such as a handful of nuts, yogurt, or a veggie and hummus combo.'),
      paragraph('Avoid mindless munching by savoring each bite and enjoying the flavors and textures of your food. Practice mindful eating, focusing on the present moment and engaging all your senses.'),
      paragraph('By tuning in to your body\'s signals and eating intuitively, you can strike a balance between enjoying your cravings and nourishing yourself and your baby.'),

      {type: 'heading' , text: 'Stay Active and Appetite-Smart: The Tasty Connection of Exercise', size: 'small', uppercase:true},

      paragraph('Physical activity during pregnancy not only benefits your overall health but can also help manage your appetite. Engage in safe exercises recommended by your healthcare provider to support a healthy appetite. Physical activity stimulates the release of endorphins, those feel-good chemicals in your brain, which can positively impact your mood and help regulate cravings.'),
      paragraph('Plus, staying active promotes a sense of well-being, reducing the likelihood of turning to food for emotional comfort. '),

      {type: 'heading' , text: 'Feast on Emotions: Navigating the Ups and Downs of Cravings', size: 'small', uppercase:true},

      paragraph('Pregnancy is a time of heightened emotions, and these feelings can influence your appetite. Recognize your emotional triggers and find healthier alternatives to cope with stress or mood swings.'),
      paragraph('Engage in activities that bring you joy and help you relax, such as yoga, meditation, or spending quality time with loved ones. If you find yourself reaching for food as an emotional crutch, consider seeking support from a therapist or counselor who specialises in pregnancy-related concerns.'),
      paragraph('Remember, emotions and food are a complex dance, but with the right steps, you can navigate through the ups and downs with grace and deliciousness!'),

      {type: 'heading' , text: 'Frequently Asked Questions ', size: 'large'},

      paragraph('**Can Appetite Changes Affect Baby\'s Development?**'),
      paragraph('Rest assured, normal appetite changes during pregnancy typically do not harm your baby\'s development. Your body has innate mechanisms to prioritise the nutritional needs of your growing baby, ensuring they receive the necessary nutrients even if your appetite fluctuates.'),
      paragraph('However, it\'s important to maintain a balanced diet to provide optimal nutrition for both you and your baby. If you have concerns or specific questions about your appetite changes and their impact on your baby, consult with your healthcare provider for personalised guidance and reassurance.'),

      paragraph('**Coping with Aversions to Healthy Foods**'),
      paragraph('If you\'re experiencing aversions to healthy foods, it can be challenging to ensure a well-rounded diet. Fear not! There are creative ways to work around these aversions and still obtain essential nutrients.'),
      paragraph('Try incorporating alternative options that provide similar nutrients. For example, if you\'re averse to leafy greens, consider adding more colorful vegetables like carrots or bell peppers to your meals. You can also explore different cooking methods or seasonings to make these foods more appealing.'),
      paragraph('If your aversions persist and you\'re concerned about your nutrient intake, consult with your healthcare provider or a registered dietitian for personalised advice and support.'),

      paragraph('**Are Intense Food Desires Normal?**'),
      paragraph('Absolutely! It\'s important to indulge in your cravings occasionally, but remember to maintain a balanced diet overall.'),
      paragraph('If your cravings are for unhealthy foods, try to find healthier alternatives or satisfy them in moderation. For example, if you\'re craving ice cream, opt for a small portion of a lower-sugar or dairy-free alternative.'),
      paragraph('Remember, the key is to enjoy your cravings while still nourishing yourself and your baby with a variety of nutrient-dense foods.'),

      paragraph('**Battling the Beast of Excessive Hunger**'),
      paragraph('Feeling hungry all the time during pregnancy is not uncommon. Your body is working hard to support the growth and development of your baby, which requires extra energy. To manage excessive hunger, focus on eating frequent, balanced meals and snacks throughout the day.'),
      paragraph('Incorporate protein-rich foods, healthy fats, and fiber to help keep you feeling satisfied for longer periods. Opt for nutrient-dense options that provide sustained energy, such as whole grains, lean proteins, fruits, and vegetables.'),
      paragraph('Drinking plenty of water can also help curb excessive hunger. If you\'re concerned about your hunger levels, consult with your healthcare provider to ensure you\'re meeting your nutritional needs.'),

      paragraph('**What if the Pounds keep Piling on?**'),
      paragraph('Weight gain during pregnancy is a natural and necessary part of the process. However, it\'s important to monitor your weight gain and ensure it stays within the healthy range. Excessive weight gain can lead to complications and make it more challenging to lose the weight postpartum.'),
      paragraph('Focus on maintaining a balanced diet, staying active, and listening to your body\'s hunger and fullness cues. Avoid strict dieting or restricting calories, as it can deprive both you and your baby of essential nutrients. '),

      paragraph('**Conclusion**'),
      paragraph('Dealing with appetite changes during pregnancy may feel like a wild ride, but armed with these fun strategies, you\'ll rock it like a true food adventurer.'),
      paragraph('Remember, strike that balance, listen to your cravings, and nourish both yourself and your little one. If you ever need some extra support or guidance, don\'t hesitate to reach out to your healthcare provider.'),
      paragraph('Please note that this article is intended for informational purposes only. Always consult with your healthcare provider for personalised advice during pregnancy.'),

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
    id: 'post-23',
    slug:'battling-postpartum-acne-a-complete-guide-to-reclaiming-your-glow',
    title: 'Battling Postpartum Acne: A Complete Guide to Reclaiming Your Glow',
    excerpt: 'Hey there, new mama! While motherhood brings incredible joy, it can also bring a few unexpected surprises, like postpartum acne.',
    category: 'Skincare',
    tags: [ 'confinement', 'mental health', 'confinement period' , 'beauty and skincare', 'postpartum recovery', 'healthy eating'],
    coverUrl: ARTICLE_IMAGES.battlingAcne[0].src,
    createdAt: '2026-09-10T09:00:00+08:00',
    reference: [ 'https://chillipadiconfinement.com/blogs/confinement-tips/battling-postpartum-acne-a-complete-guide-to-reclaiming-your-glow' ],
    blocks: [
      paragraph('Don\'t worry; you\'re not alone! Many new moms experience this pesky skin condition due to fluctuating hormones.'),
      paragraph('In this comprehensive guide, we\'ll dive into the causes of postpartum acne and equip you with the knowledge and tools to tackle it head-on. Say goodbye to those unwelcome blemishes and hello to your radiant glow!'),
      {type: 'heading' , text: 'Understanding Postpartum Acne: Why Is It Happening?' , size: 'large'},

      {type: 'heading' , text: 'Hormonal Rollercoaster: The Culprit Behind Postpartum Acne', size: 'small', uppercase:true},
      paragraph('Postpartum acne is primarily caused by hormonal fluctuations. During pregnancy, your body experiences a surge in hormones, especially progesterone. These hormones work together to support the growth and development of your baby, but they can also lead to increased sebum production in your skin.'),
      paragraph('Excessive sebum, coupled with dead skin cells, can clog your pores, paving the way for acne breakouts. As your hormone levels gradually return to normal after giving birth, your skin may take some time to readjust, causing postpartum acne to rear its head.'),

      {type: 'heading' , text: 'Stress and Lack of Sleep: Partners in Crime', size: 'small', uppercase:true},
      paragraph('Being a new mom comes with its fair share of stressors and sleepless nights. We all know that stress and lack of sleep are often intertwined during this phase. Unfortunately, they can wreak havoc on your skin.'),
      paragraph('Stress triggers the release of cortisol, a hormone that stimulates oil production, while sleep deprivation impairs your skin\'s natural healing process. Together, they create a perfect storm for postpartum acne.'),
      paragraph('So, mama, it\'s essential to take care of yourself and find ways to manage stress and catch up on those Zzz\'s.'),

      {type: 'heading' , text: 'Banishing Postpartum Acne: Practical Tips and Tricks' , size: 'large'},

      {type: 'heading' , text: 'Establishing a Gentle Skincare Routine: Less Is More', size: 'small', uppercase:true},
      paragraph('When it comes to postpartum acne, the key is to be gentle with your skin. Harsh cleansers and aggressive exfoliation can further irritate your already sensitive complexion. Opt for mild, fragrance-free cleansers specifically formulated for acne-prone skin.'),
      paragraph('Wash your face twice a day with lukewarm water, using your fingertips in gentle circular motions. Pat your skin dry with a clean towel—no scrubbing, please! Remember, less is more, so resist the temptation to pile on multiple skincare products. Keep it simple and let your skin breathe.'),

      {type: 'heading' , text: 'Hello, Hydration: The Power of Moisturising' , size: 'small', uppercase:true},
      paragraph('Contrary to popular belief, moisturising is crucial even if you have oily skin or acne. Hydration helps maintain your skin\'s natural barrier, preventing excessive oil production and keeping acne at bay.'),
      paragraph('Look for oil-free, non-comedogenic moisturisers to lock in moisture without clogging your pores. Apply a pea-sized amount of moisturiser to your clean, dry face every morning and evening. Don\'t forget your neck and décolletage too!'),
      paragraph('Hydrated skin is happy skin, mama.'),

      {type: 'heading' , text: 'Kick Acne to the Curb: Natural Remedies' , size: 'small', uppercase:true},
      paragraph('Nature has some fantastic remedies up her sleeve to combat postpartum acne. Here are a few tried-and-true favorites:'),
      list([
        '**Tea Tree Oil:** This essential oil has antibacterial properties that can help fight acne-causing bacteria. Dilute a few drops of tea tree oil with a carrier oil like jojoba or coconut oil and apply it to your acne-prone areas. Be cautious not to use undiluted tea tree oil directly on your skin, as it may cause irritation.',
        '**Witch Hazel:** Known for its astringent properties, witch hazel can help reduce inflammation and soothe irritated skin. Apply witch hazel to a cotton pad and gently dab it onto your face after cleansing. It\'s a refreshing and natural way to calm your skin.',
        '**Aloe Vera:** This magical plant is known for its healing properties. Apply pure aloe vera gel directly to your acne spots or use it as a moisturiser. It can help reduce redness and inflammation while keeping your skin hydrated.',
        '**Green Tea:** Sip on a cup of green tea for more than just a caffeine boost. Green tea is packed with antioxidants that can help fight acne-causing bacteria and reduce inflammation. You can also brew a cup, let it cool, and use it as a toner by applying it to your skin with a cotton ball.',
      ]),

      {type: 'heading' , text: 'Lifestyle Adjustments: Taking Care of Yourself' , size: 'large'},
      paragraph('While skincare plays a significant role in managing postpartum acne, don\'t forget to address your overall lifestyle and well-being. Here are some lifestyle adjustments that can positively impact your skin:'),
      list([
        '**Healthy Diet:** Opt for a balanced diet rich in fruits, vegetables, lean proteins, and whole grains. Avoid excessive sugar and processed foods, as they can contribute to inflammation and exacerbate acne. Remember, you are what you eat, mama!',
        '**Stay Hydrated:** Hydration is key, not just for your skin but for your overall health. Drink plenty of water throughout the day to keep your skin hydrated and help flush out toxins. It\'s the simplest and most effective beauty secret!',
        '**Get Moving:** Regular exercise improves blood circulation, reduces stress levels, and promotes a healthy glow. Engage in activities you enjoy, whether it\'s a brisk walk, yoga, or dancing around the living room with your little one. Find what makes you happy and get moving!',
        '**Self-Care:** Take time for yourself, mama. Whether it\'s a bubble bath, reading a book, or indulging in a face mask, prioritise self-care. When you feel good, your skin will reflect that inner glow.'
      ], 'number'),

      {type: 'heading' , text: 'FAQs for Battling Postpartum Acne' , size: 'large'},
      paragraph('**Q: Can I use my regular acne-fighting products while dealing with postpartum acne?**'),
      paragraph('A: It\'s best to consult with your dermatologist before using any new products or continuing your pre-pregnancy skincare routine. Some acne-fighting ingredients may not be suitable during breastfeeding or may interact with hormonal changes.'),

      paragraph('**Q: How long does postpartum acne typically last?**'),
      paragraph('A: Postpartum acne duration varies from person to person. It can last anywhere from a few weeks to several months. Be patient with your skin and consistent with your skincare routine.'),

      paragraph('**Q: Can postpartum acne be prevented?**'),
      paragraph('A: While it\'s not always possible to prevent postpartum acne completely, following a gentle skincare routine, practicing good hygiene, and adopting a healthy lifestyle can minimise the likelihood and severity of breakouts.'),

      paragraph('**Q: When should I seek professional help for my postpartum acne?**'),
      paragraph('A: If your acne is severe, painful, or impacting your self-esteem, it\'s a good idea to consult with a dermatologist. They can evaluate your skin condition and recommend appropriate treatments.'),
      paragraph('You\'ve got this, mama! With patience, self-care, and a touch of skincare magic, you\'ll bid farewell to postpartum acne and welcome back your radiant, glowing skin. Enjoy this precious time with your little one, and don\'t forget to take care of yourself along the way.'),
      paragraph('Now, go forth and conquer those postpartum skin challenges with confidence and a smile. You\'re a superhero, and your skin will shine just as brightly as your love for your baby.'),

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
    id: 'post-24',
    slug:'your-first-week-of-confinement-tips-for-new-moms',
    title: 'Your First Week of Confinement: Tips for New Moms',
    excerpt: 'Bringing a new life into the world is a beautiful, transformative experience, but it\'s not without its challenges. As a new mom, you\'ll be adjusting to a lot of changes, both physical and emotional, during your first week of confinement.',
    category: 'Tips',
    tags: [ 'confinement', 'mental health', 'confinement period' , 'postpartum recovery'],
    coverUrl: ARTICLE_IMAGES.tips[0].src,
    createdAt: '2026-09-10T09:00:00+08:00',
    reference: [ 'https://chillipadiconfinement.com/blogs/confinement-tips/your-first-week-of-confinement-tips-for-new-moms' ],
    blocks: [
      paragraph('From the sleepless nights to the never-ending feedings, it can feel like you\'re on a rollercoaster ride. But don\'t worry - you\'re not alone.'),
      paragraph('Many new moms feel overwhelmed and unsure during this time. With a little bit of preparation and support, you can get through this first week with ease.'),
      {type: 'heading' , text: 'What to Expect During Your First Week of Confinement?' , size: 'large'},
      {type: 'heading' , text: 'Physical Changes' , size: 'small', uppercase:true},
      paragraph('During the first week of confinement, your body will be going through a lot of changes as it heals from childbirth. Here are some things to expect:'),
      list([
        '**Vaginal bleeding:** It\'s normal to experience bleeding and discharge after giving birth. This is known as lochia and can last for several weeks. Make sure to use pads instead of tampons to avoid the risk of infection.',
        '**Breast engorgement:** As your milk comes in, your breasts may become swollen, tender, and painful. Applying cold compresses and breastfeeding or pumping frequently can help alleviate the discomfort.',
        '**Postpartum cramping:** Your uterus will be contracting as it shrinks back to its pre-pregnancy size, which can cause cramping. Taking pain relievers and using a heating pad can help.',
        '**Fatigue:** Giving birth is a physically demanding experience, and it\'s normal to feel exhausted during your first week of confinement. You\'ll likely be getting up frequently to care for your baby, which can make it hard to get the rest you need. Try to take naps when your baby sleeps, and don\'t be afraid to ask for help from family and friends.',
      ]),

      {type: 'heading' , text: 'Emotional Changes' , size: 'small', uppercase:true},
      paragraph('In addition to the physical changes, you\'ll also be experiencing a range of emotions during your first week of confinement. Here are some common feelings new moms have:'),
      list([
        '**Baby blues:** It\'s not uncommon to experience a range of emotions during your first week of confinement. You may feel elated and overjoyed one moment, and then overwhelmed and weepy the next. These feelings are known as the baby blues, and they\'re normal.',
        '**Bonding with your baby:** Some moms feel an immediate connection with their newborns, while others may need more time to develop that bond. Don\'t worry if you don\'t feel an instant attachment - it can take time.',
        '**Mood swings:** Hormonal changes can cause mood swings and irritability. Be patient with yourself and try to communicate your feelings with your partner or a trusted friend.',
        '**Anxiety:** Many new moms experience anxiety during their first week of confinement. You may worry about your baby\'s health, or feel anxious about your ability to care for them. To manage anxiety, try to take breaks when you need them and practice deep breathing or other relaxation techniques.'
      ]),

      {type: 'heading' , text: 'FAQs About Your First Week of Confinement' , size: 'large'},
      {type: 'heading' , text: 'How Long Does Confinement Last?' , size: 'small', uppercase:true},
      paragraph('The length of your confinement period will depend on a variety of factors, including your personal preferences and your doctor\'s recommendations. In general, confinement lasts between 30 and 40 days.'),
      {type: 'heading' , text: 'Can I Leave the House During Confinement?' , size: 'small', uppercase:true},
      paragraph('It\'s generally recommended that you stay at home during your confinement period to allow your body to heal and reduce the risk of infection. However, it\'s okay to go outside for short walks or to attend doctor\'s appointments.'),
      {type: 'heading' , text: 'How Can I Make My First Week of Confinement Easier?' , size: 'small', uppercase:true},
      paragraph('There are a number of things you can do to make your first week of confinement easier:'),
      list([
        '**Prepare ahead of time:** Stock up on essentials like groceries, diapers, and baby supplies before your due date to avoid having to run errands during your confinement period.',
        '**Accept help:** Don\'t be afraid to ask family and friends for help with household chores or caring for your baby. Having support can make all the difference.',
        '**Prioritise rest:** Try to take naps when your baby sleeps, and don\'t feel guilty about taking it easy during your confinement period. Your body needs time to heal.',
        '**Practice self-care:** Take a warm bath, read a book, or watch a movie to help you relax and unwind.',
        '**Connect with other new moms:** Join a new mom support group or connect with other moms online to share experiences and get advice.'
      ], 'number'),
      paragraph('**Conclusion**'),
      paragraph('Your first week of confinement is a time of major physical and emotional changes, but with the right preparation and support, you can get through it with ease.'),
      paragraph('Remember to prioritise rest, seek help when you need it, and be kind to yourself as you adjust to your new role as a mom. If you\'re struggling, don\'t hesitate to reach out to your doctor or a mental health professional for support'),
      paragraph('With time, you\'ll settle into a routine that works for you and your baby, and the joys of motherhood will far outweigh any challenges you may face during your first week of confinement.'),

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
    id: 'post-25',
    slug:'mindfulness-techniques-for-postpartum-anxiety-calming-your-mind-and-body',
    title: 'Mindfulness Techniques for Postpartum Anxiety: Calming Your Mind and Body',
    excerpt: 'Welcoming a new life into the world can be both exciting and overwhelming. As a new mother, you\'re likely to experience a range of emotions, from joy and excitement to fear and anxiety. It\'s perfectly normal to feel anxious during the postpartum period, as you adjust to the demands of motherhood and cope with the physical and emotional changes that come with childbirth.',
    category: 'Anxiety',
    tags: [ 'confinement', 'mental health', 'confinement period' , 'postpartum recovery'],
    coverUrl: ARTICLE_IMAGES.anxiety[1].src,
    createdAt: '2026-09-10T09:00:00+08:00',
    reference: [ 'https://chillipadiconfinement.com/blogs/confinement-tips/mindfulness-techniques-for-postpartum-anxiety-calming-your-mind-and-body' ],
    blocks: [
      paragraph('However, if your anxiety becomes overwhelming or starts to interfere with your daily life, it\'s important to seek help'),
      paragraph('Mindfulness techniques can be a powerful tool in managing postpartum anxiety, helping you to calm your mind and body and find a sense of peace amidst the challenges of motherhood.'),
      {type: 'heading' , text: 'What is Postpartum Anxiety?' , size: 'small', uppercase:true},
      paragraph('Postpartum anxiety is a condition that affects many new mothers. It is characterized by excessive worry, fear, and nervousness that can interfere with a mother\'s ability to care for her baby and herself.'),
      paragraph('Symptoms of postpartum anxiety can include:'),
      list([
        'Constant worry or fear',
        'Racing thoughts',
        'Difficulty sleeping',
        'Physical symptoms such as heart palpitations, headaches, and nausea',
        'Avoidance of certain situations',
        'Difficulty focusing or concentrating',
      ]),
      {type: 'heading' , text: 'How Mindfulness Can Help with Postpartum Anxiety?' , size: 'small', uppercase:true},
      paragraph('Mindfulness is the practice of being present and fully engaged in the current moment. It involves paying attention to your thoughts, feelings, and sensations without judgment. Mindfulness can help with postpartum anxiety in several ways:'),
      list([
        'It can help you become more aware of your anxious thoughts and feelings, allowing you to acknowledge them without becoming overwhelmed by them.',
        'It can help you manage physical symptoms of anxiety, such as heart palpitations and muscle tension.',
        'It can help you develop a sense of calm and relaxation, which can reduce feelings of anxiety.',
      ]),
      {type: 'heading' , text: 'Mindfulness Techniques for Postpartum Anxiety' , size: 'small', uppercase:true},
      paragraph('**Body Scan Meditation**'),
      paragraph('Body scan meditation involves focusing your attention on different parts of your body, one at a time. This can help you become more aware of physical sensations and relax your body.'),
      paragraph('To practice body scan meditation:'),
      list([
        'Find a quiet, comfortable place to sit or lie down.',
        'Close your eyes and take a few deep breaths.',
        'Begin by focusing on your toes. Notice any sensations you feel in your toes, such as tingling or warmth. Hold your attention on your toes for a few moments, then move on to your feet.',
        'Continue this process, moving up your body one part at a time, until you reach the top of your head.',
      ]),
      paragraph('**Mindful Breathing**'),
      paragraph('Mindful breathing involves paying attention to your breath and focusing on the present moment. This can help you calm your mind and reduce feelings of anxiety.'),
      paragraph('To practice mindful breathing:'),
      list([
        'Find a quiet, comfortable place to sit or lie down.',
        'Close your eyes and take a few deep breaths.',
        'Begin to pay attention to your breath. Notice the sensation of the air moving in and out of your body.',
        'If your mind wanders, gently bring your attention back to your breath. You can also try counting your breaths or repeating a calming phrase to help focus your mind.',
      ]),
      paragraph('**Mindful Movement**'),
      paragraph('Mindful movement involves engaging in physical activity while being fully present and aware of your body and surroundings. This can help reduce stress and anxiety and promote a sense of relaxation.'),
      paragraph('To practice mindful movement:'),
      list([
        'Choose an activity that you enjoy, such as yoga, walking, or dancing.',
        'As you engage in the activity, focus on the sensations in your body and the movements you are making.',
        'Pay attention to your breath and try to synchronize your movements with your breath.',
        'If your mind begins to wander, gently bring your attention back to the present moment and your body.',
      ]),
      paragraph('**Loving-Kindness Meditation**'),
      paragraph('Loving-kindness meditation involves focusing on feelings of love, kindness, and compassion toward yourself and others. This can help promote positive emotions and reduce feelings of anxiety and stress.'),
      paragraph('To practice loving-kindness meditation:'),
      list([
        'Find a quiet, comfortable place to sit or lie down.',
        'Close your eyes and take a few deep breaths.',
        'Begin by focusing on feelings of love and kindness toward yourself.',
        'Repeat a phrase such as "May I be happy, healthy, and at peace" or "May I be kind and compassionate to myself."',
        'After a few minutes, shift your focus to others, repeating similar phrases for loved ones, acquaintances, and even those who may be difficult to love.',
      ]),
      {type: 'heading' , text: 'Other Mindfulness Practices That Can Help with Postpartum Anxiety' , size: 'small', uppercase:true},
      list([
        '1. **Mindful Parenting**'
      ], 'none'),
      paragraph('Mindful parenting involves bringing awareness to the present moment while caring for your child. '),
      paragraph('To practice mindful parenting:'),
      paragraph('Focus on the present moment while interacting with your child. Listen to your child without judgment or distraction. Engage in activities with your child, such as playing or reading, with full attention and presence. Practice self-compassion and forgiveness when mistakes are made.'),

      list([
        '2. **Gratitude Practice**'
      ], 'none'),
      paragraph('Gratitude practice involves focusing on the things you are thankful for in your life. This can help shift your focus from negative thoughts and reduce symptoms of anxiety.'),
      paragraph('To practice gratitude:'),
      paragraph('Take a few minutes each day to reflect on things you are thankful for, such as your health, family, or home. Write down these things in a gratitude journal. Express gratitude towards others by thanking them for their support and kindness.'),

      list([
        '3. **Mindful Self-Compassion**'
      ], 'none'),
      paragraph('Mindful self-compassion involves being kind and compassionate towards oneself in moments of difficulty or stress. This can help reduce feelings of self-criticism and promote self-care.'),
      paragraph('To practice mindful self-compassion:'),
      paragraph('Acknowledge and validate your feelings without judgment. Speak to yourself in a kind and understanding tone. Practice self-care activities, such as taking a relaxing bath or going for a walk.'),

      {type: 'heading' , text: 'Frequently Asked Questions about Mindfulness Techniques for Postpartum Anxiety' , size: 'large'},
      list([
        '1. **What is the best mindfulness technique for postpartum anxiety?**'
      ], 'none'),
      paragraph('There is no one "best" mindfulness technique for postpartum anxiety, as everyone\'s experience is unique. It is recommended to try different techniques and find what works best for you. '),

      list([
        '2. **How long do I need to practice mindfulness before seeing results?**'
      ], 'none'),
      paragraph('The amount of time it takes to see results from mindfulness practice can vary from person to person. However, many people begin to feel the benefits within a few weeks of regular practice. Consistency is key, so make sure to incorporate mindfulness techniques into your daily routine and be patient with yourself.'),

      list([
        '3. **Can mindfulness replace medication for postpartum anxiety?**'
      ], 'none'),
      paragraph('While mindfulness techniques can be an effective addition to other treatments for postpartum anxiety, such as medication and therapy, they may not replace these treatments entirely. It\'s essential to talk to your healthcare provider about the best treatment options for you'),
      paragraph('Postpartum anxiety can be a challenging condition to manage, but with mindfulness techniques, you can reduce your symptoms and promote relaxation and calm.'),
      paragraph('By practicing techniques such as body scan meditation, mindful breathing, and loving-kindness meditation, and incorporating other mindfulness practices such as mindful parenting, gratitude, and self-compassion, you can begin to manage postpartum anxiety and lead a more peaceful life.'),
      paragraph('Remember to be patient and consistent in your practice, and always seek help from a healthcare professional if you experience symptoms of postpartum anxiety.'),

       image(
        {
          src: '/banners/banner.png',
          alt: 'https://www.chillipadiconfinement.com/product',
          maxWidth: 650,
          displayHeight: 57,
        }
      ),

    ]
  },

   {
    id: 'post-26',
    slug:'is-confinement-nanny-necessary',
    title: 'Is Confinement Nanny Necessary',
    excerpt: 'Bringing a newborn into the world is a life-changing event that can be overwhelming for both new mothers and fathers. The first few weeks after birth are often filled with sleepless nights, round-the-clock feeding, and adjusting to the new addition to the family.',
    category: 'Anxiety',
    tags: [ 'confinement food', 'mental health', 'confinement period' , 'postpartum recovery', 'nourishing food'],
    coverUrl: ARTICLE_IMAGES.nanny[0].src,
    createdAt: '2026-09-10T09:00:00+08:00',
    blocks: [
      paragraph('In Singapore, many families turn to confinement nannies to help ease the transition and provide much-needed support during this challenging period. '),
      paragraph('In this article, we\'ll explore the benefits and drawbacks of engaging a confinement nanny and provide alternatives for families who prefer to go it alone.'),
      {type: 'heading' , text: 'What is a confinement Nanny?' , size: 'small', uppercase:true},
      paragraph('A confinement nanny is a trained professional who provides postpartum care for new mothers and their babies. The primary purpose of engaging a confinement nanny is to ease the transition for new mothers during the postpartum period. '),
      paragraph('Confinement nannies are typically experienced in postpartum care and offer a range of services such as preparing confinement meals, helping with breastfeeding, and caring for the newborn.'),
      paragraph('The specific responsibilities of a confinement nanny can vary depending on the package selected, but typically include the following:'),
      list([
        '**Preparing confinement meals:** A confinement nanny is responsible for preparing nutritious and balanced meals for the new mother, which are essential for postpartum recovery. They may also recommend traditional Chinese medicine dishes, which are believed to aid in postpartum recovery.',
        '**Caring for the newborn:** A confinement nanny is responsible for caring for the newborn, including feeding, bathing, and changing diapers. They may also provide guidance on newborn care, such as how to swaddle a baby and establish a sleep routine.',
        '**Assisting with breastfeeding:** A confinement nanny can provide support and advice on breastfeeding, which can be challenging for new mothers. They can also help to position the baby correctly during feeding and offer tips to increase milk production.',
        '**Providing postpartum care:** A confinement nanny can provide support and advice on postpartum recovery, including tips on how to care for the perineum and how to manage postpartum bleeding.',
        '**Cleaning the house:** Some confinement nannies may also offer additional services such as cleaning the house, doing laundry, and cooking for the rest of the family.'
      ]),
      {type: 'heading', text: 'How Much Does Confinement Nanny Charge?' , size: 'small', uppercase:true},
      paragraph('The cost of hiring can vary depending on factors such as their experience, qualifications, the services included in the package, and the duration of the confinement period.'),
      paragraph('On average, a confinement nanny can cost anywhere from $2,500 to $4,000 or even more per month, with prices increasing for highly experienced nannies or those with additional qualifications such as TCM certification. The cost may also be higher for shorter confinement periods or if additional services are requested.'),
      paragraph('Prices for confinement nanny services may not always be readily available on agency websites, so it\'s best to call and inquire directly. Costs can vary based on specific requirements and factors such as the number of babies, with higher rates during festive seasons like Chinese New Year.'),

      {type: 'heading', text: 'Where To Find Confinement Nanny?' , size: 'medium', uppercase:true},
      list([
        '**Through agencies:** There are many confinement nanny agencies in Singapore that provide a range of services, including finding and hiring confinement nannies. These agencies can help match you with a nanny based on your preferences and requirements. Some examples are ^^Confinement Angels^^ and ^^PEM Confinement Nanny Agency^^.',
        '**Referrals:** You can ask for recommendations from friends, family, or acquaintances who have previously engaged the services of a confinement nanny. They can provide valuable insights and recommendations based on their personal experiences.',
        '**Online platforms:** There are several online platforms where you can find confinement nannies in Singapore. These platforms allow you to browse through a list of available nannies, read their profiles, and reviews from other clients. ^^Caregiver Asia^^ and ^^NannySOS^^ is worth checking out.'
      ]),
      {
        type: 'comparisonTable',
        title: 'PROS AND CONS OF HIRING CONFINEMENT NANNY',
        pros: [
          {
            title: 'Experienced care:',
            text: 'A confinement nanny can provide valuable support and guidance',
          },
          {
            title: 'Customised care:',
            text: 'Confinement nannies can tailor their services to meet the needs',
          },
          {
            title: 'Nutritious meals:',
            text: 'A confinement nanny can prepare healthy and nutritious meals',
          },
          {
            title: 'Peace of mind:',
            text: 'Engaging a confinement nanny can provide peace of mind',
          },
          {
            title: 'Assistance with breastfeeding:',
            text: 'A confinement nanny can provide valuable support and guidance in breastfeeding',
          },
          {
            title: 'Help with newborn care:',
            text: 'A confinement nanny can help new parents learn how to care for their newborn',
          },
          {
            title: 'Additional household help:',
            text: 'Some confinement nannies offer additional help with household chores, such as cleaning',
          },
        ],
        cons: [
          {
            title: 'Cost:',
            text: 'Engaging a confinement nanny can be expensive, especially for longer periods',
          },
          {
            title: 'Personality clash:',
            text: 'The confinement nanny and the mother may not get along',
          },
          {
            title: 'Loss of control:',
            text: 'The mother may feel like she has lost control over her household',
          },
          {
            title: 'Intrusion of privacy:',
            text: 'Having someone constantly in the home can be invasive and uncomfortable',
          },
          {
            title: 'Difficulty adjusting:',
            text: 'Having someone take over daily tasks can be a challenge for mothers who are used to being in control',
          },
          {
            title: 'Dependency:',
            text: 'Some mothers may become overly reliant on their confinement nanny and struggle to care for their newborn without them',
          },
          {
            title: 'Cultural differences:',
            text: 'Confinement nannies may come from a different cultural background, which can lead to misunderstandings',
          },
        ],
      },
      paragraph('In conclusion, hiring a confinement nanny can be a beneficial option for new parents who require additional support during the postpartum period.'),
      paragraph('However, the decision to engage a confinement nanny should be made based on individual circumstances and budget considerations.'),
      paragraph('For those who may not be able to afford a confinement nanny or prefer to go without one, there are alternatives available. These include seeking support from family and friends, hiring a part-time helper for household chores, and ordering confinement meal delivery.'),
      paragraph('It is important to remember that every family\'s needs are unique, and there is no one-size-fits-all solution to postpartum care. Ultimately, the most important thing is to prioritise the health and well-being of both the mother and newborn.'),
      image(
        {
          src: '/banners/banner.png',
          alt: 'https://www.chillipadiconfinement.com/product',
          maxWidth: 650,
          displayHeight: 57,
        }
      ),
      { type: 'promoLink',
        before: 'Ready to order confinement meals? Order our',
        linkText: 'confinement food delivery service',
        after: 'now to enjoy the discounted price!',
        url: 'https://www.chillipadiconfinement.com/product',
      },
    ],
  },

   {
    id: 'post-27',
    slug:'why-a-postpartum-massage-is-essential-during-your-confinement-period',
    title: 'Why a Postpartum Massage is Essential During Your Confinement Period',
    excerpt: 'Congratulations on the arrival of your little bundle of joy! As a new mother, you may find that your body has undergone some significant changes during pregnancy and childbirth.',
    category: 'Massage',
    tags: [ 'mental health', 'confinement period' , 'postpartum recovery', 'confinement'],
    coverUrl: ARTICLE_IMAGES.massage[0].src,
    createdAt: '2026-09-10T09:00:00+08:00',
    blocks: [
      paragraph('It\'s not uncommon to feel exhausted, sore, and overwhelmed during the postpartum period. That\'s why a postpartum massage can be a game-changer for your physical and mental well-being.'),
      {type: 'heading', text: 'What is a Postpartum Massage?' , size: 'large'},
      paragraph('A postpartum massage is a specialised massage that is designed to help new mothers recover after childbirth. It is a gentle and nurturing massage that focuses on the areas of the body that are most affected by childbirth, such as the lower back, hips, abdomen, and shoulders. '),
      paragraph('Whether you choose to have the massage done in the comfort of your own home or at a spa, the primary goal is to provide you with a deeply relaxing and rejuvenating experience.'),
      {type: 'heading', text: 'The Benefits of a Postpartum Massage During Your Confinement Period' , size: 'medium', uppercase:true},
      list([
        '**Alleviates Postpartum Pain and Discomfort:** The postpartum period often brings various physical discomforts, such as sore muscles, back pain, and overall body aches. A postpartum massage can work wonders in relieving these discomforts, promoting faster healing, and aiding in the restoration of your body\'s strength.',
        '**Enhances Postpartum Recovery:** The gentle techniques employed during a postpartum massage stimulate blood circulation and lymphatic flow, expediting the healing process. This enhanced circulation helps in reducing swelling, promoting tissue repair, and restoring vitality to your body.',
        '**Reduces Stress and Anxiety:** Being a new mother can be overwhelming, with a multitude of responsibilities and adjustments. A postpartum massage serves as a soothing therapy that eases stress, anxiety, and tension. It creates a calming atmosphere that helps you relax, rejuvenate, and find emotional balance during this transformative period.',
        '**Promotes Breastfeeding:** Breast engorgement and milk flow issues are common concerns for new mothers. A postpartum massage can provide relief by stimulating lymphatic drainage, improving blood flow to the breasts, and reducing any discomfort associated with breastfeeding. It can also help prevent clogged milk ducts and promote a healthy milk supply.',
        '**Supports Postpartum Mental Health:** The postpartum period can sometimes trigger emotional challenges, including postpartum depression and anxiety. Regular postpartum massages have been shown to have a positive impact on mental health by reducing stress hormones, increasing serotonin and dopamine levels, and promoting an overall sense of well-being.',
      ], 'number'),
      {type: 'heading', text: 'Frequently Asked Questions About Postpartum Massage' , size: 'medium', uppercase:true},
      paragraph('**Q: When is the best time to get a postpartum massage?**'),
      paragraph('A: The ideal time to get a postpartum massage is during the first six weeks after childbirth. This is the time when your body is going through the most changes, and massage can help with the physical and emotional demands of this period.'),
      
      paragraph('**Q: How long does a postpartum massage last?**'),
      paragraph('A: The duration of a postpartum massage session can vary, but it usually ranges from 60 to 90 minutes. However, shorter sessions can also be beneficial depending on your preferences and needs.'),

      paragraph ('**Q: Can I get a postpartum massage if I had a c-section?**'),
      paragraph('A: Yes, you can get a postpartum massage after a c-section. However, you should wait until your incision has fully healed and your doctor has given you clearance to resume normal activities.'),

      paragraph('**Q: How often should I get a postpartum massage?**'),
      paragraph('A: It\'s recommended to get a postpartum massage once a week for the first six weeks after childbirth. After that, you can decrease the frequency to once every two weeks or once a month, depending on your needs.'),

      paragraph('**Q: Can I get a postpartum massage at home?**'),
      paragraph('A: If you prefer the comfort and convenience of performing a postpartum massage in the privacy of your own home, you can certainly do so.'),
      paragraph('Here are some simple and effective massage techniques that you can try:'),

      paragraph('**Back and Shoulder Massage:**'),
      list([
        'Sit comfortably on a chair or lie on your side on a bed.',
        'Use a massage oil or lotion to lubricate your hands.',
        'Start by placing your hands on your partner\'s upper back and apply gentle pressure with your palms, moving in circular motions.',
        'Gradually work your way down to the lower back, using your fingertips or knuckles to apply more focused pressure on any tense areas.',
        'Repeat these movements for several minutes, focusing on areas that feel particularly tight or sore.',
        'For the shoulders, use your thumbs to apply firm pressure on the muscles, moving in upward strokes towards the neck.',
      ]),
      paragraph('**Leg and Foot Massage:**'),
      list([
        'Have your partner lie down comfortably with their legs extended.',
        'Apply some massage oil or lotion to your hands.',
        'Start with gentle strokes from the ankles up to the thighs, using both hands in a sweeping motion.',
        'Use your thumbs or the palms of your hands to apply circular pressure on the calf muscles, focusing on any areas of tightness.',
        'Move on to the feet, using your fingers to apply pressure on the soles and heels. You can also use your thumbs to knead the arches of the feet in circular motions.',
        'Pay attention to your partner\'s feedback and adjust the pressure accordingly.',
      ]),
      paragraph('**Abdominal Massage:**'),
      list([
        'Ensure that your partner is lying down comfortably with their knees bent.',
        'Apply a small amount of massage oil or lotion to your hands.',
        'Place your hands gently on the lower abdomen and use slow, circular motions to massage the area in a clockwise direction.',
        'Gradually move your hands upwards, continuing the circular motions. Be mindful of the level of pressure and adjust as needed.',
        'This massage technique can help to promote healing and reduce discomfort in the abdominal area.',
      ]),
      paragraph('**Scalp and Head Massage:**'),
      list([
        'Have your partner sit comfortably with their head slightly tilted forward.',
        'Use your fingertips to gently massage the scalp in circular motions. Start from the base of the skull and work your way up towards the crown.',
        'Apply gentle pressure to release any tension or tightness in the scalp muscles.',
        'Move your fingers in a kneading motion, applying slight pressure on different areas of the scalp.',
        'Finish by using your fingertips to massage the temples in circular motions.',
      ]),
      paragraph('The postpartum period is a time of immense change and adjustment for new mothers. Incorporating a postpartum massage into your confinement period can provide a myriad of benefits, including pain relief, enhanced recovery, reduced stress, and support for mental well-being.'),
      paragraph('Whether you choose to visit a professional massage therapist or perform self-massage at home, make sure to communicate your needs, preferences, and any specific concerns with your healthcare provider or a qualified massage therapist.'),
      paragraph('Remember, every new mother deserves care, relaxation, and support during this transformative phase. Embrace the soothing and rejuvenating power of a postpartum massage, allowing it to contribute to your overall well-being as you embark on this beautiful journey of motherhood.'),

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
    id: 'post-28',
    slug:'confinement-myths-every-mother-should-know',
    title: 'Confinement Myths Every Mother Should Know',
    excerpt: 'It\'s no secret that childbirth can be extremely taxing on the body. It is a common practice in Asia for mothers to undergo confinement period to properly recover. Many Asian mothers, in particular, are familiar with many practices surrounding confinement, and while some have been tried and tested, others are simply myths — at least from a medical standpoint.',
    category: 'Myths',
    tags: [ 'confinement food', 'confinement period' , 'postpartum recovery', 'confinement'],
    coverUrl: ARTICLE_IMAGES.myths[0].src,
    createdAt: '2026-09-10T09:00:00+08:00',
    blocks: [
      paragraph('There are several food-related confinement myths that have been passed down through generations or spread through misinformation. Here are some beliefs about confinement that you may have heard before, as well as how they stack up against modern medical knowledge.'),
      {type: 'heading', text: '"You shouldn\'t eat spicy food during confinement."' , size: 'medium', fontWeight: 600},
      paragraph('This is a common myth in many cultures that is not supported by any scientific evidence. Eating spicy food during confinement does not affect the baby in any way. In fact, some spicy foods can have health benefits such as reducing inflammation.'),
      {type: 'heading', text: '"You should avoid seafood during confinement."' , size: 'medium', fontWeight: 600},
      paragraph('Seafood is an excellent source of protein and omega-3 fatty acids, which are important for the development of the baby\'s brain and nervous system. However, pregnant women should avoid certain types of fish such as shark, swordfish, and king mackerel, which contain high levels of mercury.'),
      {type: 'heading', text: '"You need to eat for two during confinement."' , size: 'medium', fontWeight: 600},
      paragraph('Pregnant women only need to consume about 300 extra calories per day during confinement. Eating too much can lead to excessive weight gain, which can cause health problems for both the mother and the baby.'),
      {type: 'heading', text: '"You should avoid cold foods and drinks during confinement."' , size: 'medium', fontWeight: 600},
      paragraph('There is no scientific evidence to support the claim that cold foods and drinks are harmful during confinement. However, pregnant women should avoid unpasteurized or raw foods, which can increase the risk of foodborne illness.'),
      {type: 'heading', text: '"You should only eat certain types of food during confinement."' , size: 'medium', fontWeight: 600},
      paragraph('Pregnant women should aim for a balanced diet that includes a variety of foods from all food groups. This will ensure that both the mother and the baby are getting all the nutrients they need for optimal health.'),

      image(
        {
          src: '/banners/banner.png',
          alt: 'https://www.chillipadiconfinement.com/product',
          maxWidth: 650,
          displayHeight: 57,
        }
      ),

      {type: 'promoLink',
        before: 'Our confinement meal packages offer a wide selection of confinement dishes that nourish and replenish body. Check out our',
        linkText: 'confinement food packages',
        after: 'to see more!',
        url: 'https://www.chillipadiconfinement.com/product',
      },
    ],
  },

  {
    id: 'post-29',
    slug:'how-much-dom-to-drink-during-confinement',
    title: 'How Much DOM to Drink During Confinement',
    excerpt: 'DOM is used in baking and cooking, as it helps to add sweetness and texture to recipes. It is also used in the production of pharmaceuticals, as it helps to bind ingredients together. DOM is a versatile sweetener that can be used in a variety of ways to add sweetness to food and drinks.',
    category: 'DOM',
    tags: [ 'dom benedictine', 'confinement period' , 'confinement'],
    coverUrl: ARTICLE_IMAGES.DOM[0].src,
    createdAt: '2026-09-10T09:00:00+08:00',
    blocks: [
      {type: 'heading', text: 'What is DOM?' , size: 'medium', fontWeight: 600},
      paragraph('DOM, also known as dextrose monohydrate, is a white crystalline powder made up of 100% natural cornstarch. It is most often used as a sweetener in food and drinks, such as soft drinks and candy. Unlike other artificial sweeteners, DOM is calorie-free and can help to add sweetness without adding extra calories.'),
      paragraph('This makes it an important part of keeping weight gain to a minimum during rest and recovery periods. Secondly, DOM provides essential vitamins and minerals. This is important because access to a complete diet may be limited during confinement. Lastly, DOM can provide energy and mental clarity during times of ill health or inactivity.'),
      paragraph('In addition, DOM can help to reduce stress and anxiety levels during confinement. The natural sweetness of DOM can help to boost mood and provide a sense of comfort and relaxation. Furthermore, DOM can help to reduce inflammation and improve overall health, which can be beneficial during periods of rest and recovery.'),

      {type: 'heading', text: 'How to Choose the Right DOM for You' , size: 'medium', fontWeight: 600},
      paragraph('When selecting DOM for consumption during confinement, the variety of options can be daunting. The best choice depends on individual preferences regarding flavor, as well as needs in terms of required vitamins and minerals. It’s important to choose one that meets the dietary needs and allows for a safe, healthy recovery. Special consideration should be given to DOM with added vitamins or minerals, as this variety can provide additional nutrients needed during recuperation.'),
      paragraph('When selecting DOM, it is important to read the label carefully to ensure that the product contains the necessary vitamins and minerals. Additionally, it is important to consider the amount of sugar and fat in the product, as these can have an impact on overall health. Finally, it is important to consider the cost of the product, as some DOM can be more expensive than others.'),

      {type: 'heading', text: 'Tips for Drinking DOM During Confinement' , size: 'medium', fontWeight: 600},
      paragraph('Consuming DOM can be a safe and beneficial part of a wellness routine during confinement. However, it’s important to take into account such factors as medical conditions and special dietary needs when determining how much DOM to consume.'),
      paragraph('In addition, as DOM contains essential carbohydrates, it’s important to monitor intake carefully to ensure that it’s consumed in appropriate quantities over the course of the day. For those without medical concerns or dietary restrictions, the recommended amount is between 10 and 30 grams per day.'),
      paragraph('It\'s also important to remember that DOM should be consumed in moderation. Too much DOM can lead to an increase in blood sugar levels, which can be dangerous for those with diabetes or other medical conditions. Additionally, DOM should not be consumed by pregnant women or those with kidney disease.'),

      {type: 'heading', text: 'Possible Side Effects of Drinking Too Much DOM' , size: 'medium', fontWeight: 600},
      paragraph('Drinking too much DOM can have various negative side effects. Consuming more than 30 grams per day may lead to weight gain and increase the risk of developing diabetes and other chronic illnesses. In addition, those taking medications may experience reduced effectiveness due to the high sugar content of DOM. Lastly, DOM has been associated with an increased risk of abdominal pain, cramps, diarrhea, and headaches.'),

      {type: 'heading', text: 'What Else to Consider When Drinking DOM During Confinement' , size: 'medium', fontWeight: 600},
      paragraph('Drinking DOM may also affect other aspects of daily life, such as digestion and sleep quality. Those already prone to heartburn or indigestion should limit their intake of sweetened drinks, especially those containing DOM. Similarly, due to DOM’s ability to raise blood sugar levels, those prone to sleeplessness should watch their intake of sweetened drinks and limit their consumption in the evening.'),

      {type: 'heading', text: 'Summary and Conclusion' , size: 'medium', fontWeight: 600},
      paragraph('DOM is an artificial sweetener derived from natural sources that can offer several benefits when consumed in moderation during confinement. These benefits include providing essential vitamins and minerals, boosting energy levels, aiding in digestion, and helping to reduce weight gain.'),
      paragraph('While there are potentially negative side effects associated with drinking too much DOM, these can be avoided by limiting daily intake to less than 30 grams.'),

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
    id: 'post-30',
    slug:'what-to-eat-after-a-miscarriage',
    title: 'What to Eat After a Miscarriage',
    excerpt: 'Grieving the loss of a baby from a miscarriage can be a daunting and challenging process. Physically, your body needs to heal and it can take a month or more for your body to restore itself.',
    category: 'Food',
    tags: [ 'food for miscarriage', 'miscarriage' , 'nourishing food'],
    coverUrl: ARTICLE_IMAGES.Miscarriage[0].src,
    createdAt: '2026-09-10T09:00:00+08:00',
    reference: [ 'https://chillipadiconfinement.com/blogs/confinement-tips/what-to-eat-after-a-miscarriage' ],
    blocks: [
      paragraph('Emotionally your mental health needs to endure this difficult experience and regain balance. One way to facilitate the healing journey is to be mindful of what you consume. Paying attention to your diet after a miscarriage can support the healing process both mentally and physically.'),
      {type: 'heading', text: 'What happens to your body after a miscarriage?' , size: 'medium', fontWeight: 600},
      paragraph('After a miscarriage, you will encounter a range of hormonal and physiological changes, such as tiredness, lack of appetite, and difficulty concentrating. Eating specific foods, like oranges and lentils, can help to boost vitamin and mineral stores and speed up the healing process.'),
      paragraph('Furthermore, it\'s recommended to drink eight or more glasses of water per day to remain hydrated. In addition to physical wellbeing, dealing with the emotional effects of a miscarriage is essential.'),
      paragraph('You might experience a range of emotions such as shock, guilt, depression, or even anger. Eating snacks like nuts and dark chocolate might help provide comfort and some emotional relief.'),
      {type: 'heading', text: 'Miscarriage recovery food' , size: 'medium', fontWeight: 600},
      image ({
        src: ARTICLE_IMAGES.Miscarriage[0].src,
        alt: 'Miscarriage Recovery Food',
        objectPosition: 'center 30%'
      }),
      paragraph('**Fluids:** In order to help the healing process after miscarriage, try to drink plenty of fluids such as water, detox water or juices to replace lost fluid and absorb iron.'),
      paragraph('**Protein Rich Diet:** Your body needs protein to repair and rebuild tissue. Consuming a protein-rich diet, such as milk, cheese, eggs, legumes, lentils, grains and other proteins is important to help rebuild damaged cells.'),
      paragraph('**Iron Rich Foods:** Miscarriages can lead to blood loss, which may cause iron deficiency anemia. Iron-rich foods like red meat, spinach, and lentils can help replenish your iron levels.'),
      paragraph('**Healthy Fats:** Healthy fats like those found in salmon, avocado, and nuts can help reduce inflammation and promote healing.'),
      paragraph('**Vitamin C Rich Foods:** Iron and vitamin C both are vital components in aiding recovery after a miscarriage. Vitamin C helps with a speedy recovery and contributes to better absorption of iron in our body which is beneficial for adults. Include foods such as raisins, dates, papaya, beans, oranges and fish in your diet to ensure a sufficient intake of both iron and vitamin C.'),
      paragraph('**Calcium and Magnesium Rich Foods:** Various research has shown that a lack of magnesium can result in depression. Eating magnesium-rich foods can help alleviate depression and anxiety, which can become symptomatic due to the effects of a miscarriage. Such foods include dark chocolate, leafy greens, and wholegrains. In order to ensure optimal calcium intake, adults should also consider adding dairy products to their diet.'),
      paragraph('Loss of a baby through miscarriage can be a significant source of emotional and physical stress for women. A healthy diet, emotional support from family and friends, and feeling positive can help them to cope better with their loss.'),
      paragraph('With the advice of their general practitioner and the inclusion of certain nutritious foods, they should be able to make a quicker recovery.'),

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
    id: 'post-31',
    slug:'how-to-produce-more-breastmilk',
    title: 'How to Produce More Breastmilk',
    excerpt: 'Many mothers worry about a low milk supply, but in most cases your body produces exactly what your baby needs, even if you don\'t realise it. Although this fear is common, there are few mothers who are truly unable to produce enough breast milk. If your breast milk supply is too low, it can usually be increased naturally with a few simple measures.',
    category: 'BreastMilk',
    tags: [ 'confinement', 'confinement period' , 'postpartum recovery' , 'healthy eating'],
    coverUrl: ARTICLE_IMAGES.tips[1].src,
    createdAt: '2026-09-10T09:00:00+08:00',
    blocks: [
      paragraph('There are also other ways to build up a strong and healthy supply of breast milk or to increase your milk supply naturally. Try these before looking into alternative treatments such as herbs or medicines'),
      list([
        '**Frequent and effective breastfeeding:** Breastfeeding frequently and ensuring a good latch can help increase milk production. Aim to breastfeed your baby at least 8-12 times in 24 hours.',
        '**Pumping:** Using a breast pump after or between feedings can help stimulate milk production and increase milk supply. Consider using a double electric breast pump for maximum efficiency.',
        '**Proper hydration:** Staying well hydrated is important for milk production. Drink plenty of fluids, such as water, milk, and natural fruit juices.',
        '**Avoid things that decrease milk supply:** Many things can get in the way of the establishment of a healthy breast milk supply. Starting birth control pills during the first six weeks after your baby is born, especially a method that contains estrogen, can make it more difficult to make breast milk. Other factors such as consuming too much caffeine, drinking alcohol, or smoking can also interfere with the amount of breast milk that you\'ll be able to make.',
        '**Balanced diet:** Eating a healthy and balanced diet that includes whole grains, fruits, vegetables, lean proteins, and healthy fats can help promote milk production.',
        '**Rest and relaxation:** Getting enough sleep and reducing stress levels can help promote milk production. Try to rest and relax as much as possible.',
        '**Skin-to-skin contact:** Holding your baby skin-to-skin can help stimulate milk production and promote bonding.',
      ]),
      paragraph('Don\'t let doubts get in the way of your confidence - most mums can assemble and maintain a good source of breast milk for their little one, and you can too!'),
      paragraph('Just make sure you breastfeed often and your baby looks like they are getting enough milk, and you\'ll be just fine. Believe in yourself!'),

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
    id: 'post-32',
    slug:'food-to-avoid-during-confinement',
    title: 'Food to Avoid During Confinement',
    excerpt: 'You might be wondering why there is a need to follow a diet plan after childbirth. Now that the pregnancy is over, surely you can eat all the food that you have avoided, right? The truth is this. Many changes occur after childbirth and the body needs to heal.',
    category: 'Food',
    tags: [ 'confinement food', 'confinement period' , 'confinement', 'healthy eating' , 'postpartum recovery'],
    coverUrl: ARTICLE_IMAGES.foodtoAvoid[0].src,
    createdAt: '2026-09-10T09:00:00+08:00',
    blocks: [
      paragraph('Adhering to a diet that provides the necessary nutrients to promote healing and recovery for the mother is therefore essential. Furthermore, taking care of a newborn can be exhausting, and a healthy diet can provide the energy and stamina needed to care for the baby.'),
      paragraph('Not forgetting that breast milk can transfer whatever you eat to your child, mother should therefore continue to carefully control your confinement diet even after giving birth.'),
      paragraph('Here is a list of food to avoid during confinement period:'),
      list([
        '**Raw or cold food:** Raw or undercooked food, especially meats, poultry, seafood, and eggs, can contain harmful bacteria or viruses that can cause foodborne illness, such as Salmonella, E. coli, and Listeria. These pathogens can cause symptoms such as vomiting, diarrhoea, fever, and dehydration, which can be especially dangerous for individuals with weakened immune systems.',
        '**Spicy or pungent food:** Spicy or pungent food are considered "heaty" and may cause symptoms such as heartburn, indigestion, discomfort, or constipation, which can be uncomfortable or even harmful during the postpartum period.',
        '**Seafood:** Seafood, especially shellfish, is believed to be cold and difficult to digest, which can cause bloating, gas and diarrhoea. Some seafood contains high levels of mercury that can affect brain and nervous system development in babies. Therefore, try to stay away from seafood for best safety.',
        '**Processed food:** Processed food are often high in calories and low in nutrients, which can lead to overconsumption and weight gain. Moreover, processed food can also lead to digestive issues such as bloating, constipation, and discomfort. This is because processed food often lack fibre and other essential nutrients that are necessary for proper digestion and gut health. In postpartum confinement, a diet consisting of primarily processed food can be especially harmful as the body is recovering from childbirth and needs proper nutrition to heal and support lactation.',
        '**Caffeine and alcohol:** Caffeine and alcohol can be dehydrating and can affect milk production. Caffeine does leak into breast milk and can affect the central nervous system, which may interfere with sleep patterns and cause restlessness in babies. Alcohol can be dehydrating and may interfere with the body\'s natural healing and recovery processes. For postpartum women, alcohol consumption can also affect the quality and quantity of breast milk.'
      ]),
      paragraph('The key is to act sensibly and consume food in moderation. As long as a balanced diet is maintained throughout your confinement period, the claimed "negative effects" should be minimal and safe for you and your baby.'),
      image(
        {
          src: '/banners/banner.png',
          alt: 'https://www.chillipadiconfinement.com/product',
          maxWidth: 650,
          displayHeight: 57,
        }
      ),
      {type: 'promoLink',
        before: 'Order nutritious confinement food that promotes faster healing and recovery for mothers. Check out our',
        linkText: 'confinement food packages',
        after: 'to see more!',
        url: 'https://www.chillipadiconfinement.com/product',
      },
    ],
  },
  {
    id: 'post-33',
    slug:'are-plastic-containers-safe',
    title: 'Are Plastic Containers Safe',
    excerpt: 'Storing food in plastic containers can be a convenient way to keep food fresh and easily accessible. However, there are also potential risks and harms associated with storing food in plastic containers, especially if they are not used correctly.',
    category: 'Plastic',
    tags: [ 'confinement food', 'food safety', 'healthy eating'],
    coverUrl: ARTICLE_IMAGES.wellbeing[2].src,
    createdAt: '2026-09-10T09:00:00+08:00',
    blocks: [
      paragraph('Even for containers labelled “safe” for the microwave and dishwasher, experts caution that heat and plastic don\'t mix well. Besides harmful effects on your health and the environment, some of the harmful effects of storing food in plastic containers include:'),
      list([
        '**Chemical leaching:** Some plastic containers may contain chemicals like BPA and phthalates that can leach into your food and cause health problems like hormonal imbalances, developmental problems, and cancer.',
        '**Microplastic contamination:** Over time, plastic containers can break down and release small particles called microplastics into your food. These particles can be harmful if ingested and may cause digestive problems.',
        '**Cross-contamination:** If plastic containers are not cleaned properly, they can harbour bacteria and other contaminants that can contaminate your food and cause food poisoning.',
        '**Environmental pollution:** Plastic containers contribute to environmental pollution by taking up space in landfills and releasing harmful chemicals when they break down.'
      ]),
      paragraph('To reduce the harmful effects of storing food in plastic containers, you can use glass, stainless steel, or silicone containers instead. These materials are safer and more eco-friendly alternatives to plastic.'),
      paragraph('If you must use plastic containers, look for ones that are labeled BPA-free and avoid heating them in the microwave or dishwasher, as this can cause the plastic to break down and release harmful chemicals.'),
      {type: 'heading' , text:'Chilli Padi Confinement uses Tingkat' , size:'medium' , uppercase:true},
      image({
        src: ARTICLE_IMAGES.meals[2].src,
        alt: 'Tingkat Meals',
        maxWidth: 650,
        displayHeight: 57,
        objectPosition: 'center 10%'
      }),
      paragraph('We store food in Tingkat or metal containers in all of our meals before delivering it to you. The Tingkat containers are typically made of stainless steel or aluminium and are designed to be lightweight and easy to carry.'),
      paragraph('They are stackable, so multiple containers can be transported at once, and they come in different sizes to accommodate different types of dishes'),
      paragraph('There are several benefits to storing confinement food in metal containers:'),

      list([
        '**Airtight seal:** Metal containers are typically airtight, which can help prevent air, moisture, and other contaminants from getting in and spoiling the food. This can help keep the food fresher for longer.',
        '**Odour containment:** Strong foods can have pungent odours that can affect other foods stored nearby. Metal containers can help contain these odours and prevent them from spreading throughout your pantry or refrigerator.',
        '**Durability:** Metal containers are often very durable and can withstand rough handling or extreme temperatures. This can be especially important for foods that need to be stored for long periods of time or transported over long distances.',
        '**Protection from light:** Some foods, such as spices and herbs, can be sensitive to light and can lose their flavour or potency if exposed to too much light. Metal containers can help protect these foods from light and help them maintain their quality.',
        '**Recyclable:** Many metal containers are recyclable, which can help reduce waste and support sustainable practices.'
      ]),
      paragraph('Overall, storing strong food in metal containers can help protect the food from spoilage, maintain its quality, and reduce waste.'),
      paragraph('In addition, it is important to ensure that food is stored at a safe temperature to prevent the growth of harmful bacteria. Hot food should be kept at a temperature of 140°F (60°C) or higher to prevent bacterial growth.'),
      paragraph('It is recommended to use a food thermometer to check the temperature of the food before serving, and to discard any food that has been left at room temperature for more than four hours.'),

      image(
        {
          src: '/banners/banner.png',
          alt: 'https://www.chillipadiconfinement.com/product',
          maxWidth: 650,
          displayHeight: 57,
        }
      ),
      {type: 'promoLink',
        before: 'Order confinement food that\'s nutritious, healthy and safe for consumption today!',
        linkText: 'Choose your confinement food catering package',
        after: 'here!',
        url: 'https://www.chillipadiconfinement.com/product',
      },
    ],
  },
  {
    id: 'post-34',
    slug:'what-is-the-benefit-of-pig-trotter',
    title: 'What is the Benefit of Pig Trotter',
    excerpt: 'After giving birth, a woman\'s body undergoes significant changes, including hormonal shifts, tissue repair, and blood loss. This can leave the body depleted of essential nutrients and in need of nourishment to support recovery during confinement.',
    category: 'Food',
    tags: [ 'confinement food', 'pig trotter', 'confinement period' , 'postpartum recovery', 'confinement'],
    coverUrl: ARTICLE_IMAGES.meals[3].src,
    createdAt: '2026-09-10T09:00:00+08:00',
    reference: [ 'https://chillipadiconfinement.com/blogs/confinement-tips/what-is-the-benefit-of-pig-trotter' ],
    blocks: [
      paragraph('A strict diet is often observed during the confinement period to promote healing, restore energy levels, and support breastfeeding.'),
      {type: 'heading' , text:'Pig trotters are rich in protein and iron' , size:'small' , uppercase:true},
      paragraph('It\'s important to eat nourishing food during the confinement period that can help support postpartum recovery. Pig trotters are often consumed during confinement or postpartum recovery because they are believed to have certain nutritional and health benefits that can aid in recovery after childbirth.'),
      paragraph('Pig trotters are also believed to be rich in iron, which can help restore a new mother\'s iron levels after childbirth, which may be depleted due to blood loss during delivery.'),
      paragraph('Additionally, pig trotters are often cooked in soups or stews, which can be easy to digest and provide nourishment for the new mother during confinement. They are also often paired with other ingredients such as ginger, vinegar, and black fungus, which are believed to have additional health benefits.'),
      {type: 'heading' , text:'Power food for new mothers' , size:'small' , uppercase:true},
      paragraph('Combined with vinegar, pig trotters have several benefits for postpartum recovery, including:'),
      list([
        '**Helps with digestion:** Vinegar is known to stimulate the production of digestive enzymes, which can aid in the digestion of foods. This can be especially beneficial for postpartum women who may experience digestive issues after giving birth.',
        '**Rich in collagen:** Pig\'s trotters are a good source of collagen, which is important for maintaining healthy skin, hair, and nails. Collagen also supports joint health and can help to alleviate joint pain.',
        '**Boosts energy:** Pig\'s trotters are high in protein and iron, which can help to boost energy levels and combat fatigue for the new mother during confinement.',
        '**Warming:** In Traditional Chinese Medicine, pig trotter is believed to have a warming effect on the body, which can help to support postpartum recovery and prevent illness.',
        '**Easy to digest:** Pig trotter is a soft and easily digestible food, which can be beneficial for new mothers who may have digestive issues or a weakened digestive system after childbirth.',
        '**Supports lactation:** The vinegar in the dish is believed to help promote milk production, which can be beneficial for breastfeeding mothers.'
      ]),
      paragraph('Overall, pig\'s trotters in vinegar is considered a nourishing and restorative dish that can help the new mother during confinement to support postpartum recovery.'),

      image(
        {
          src: '/banners/banner.png',
          alt: 'https://www.chillipadiconfinement.com/product',
          maxWidth: 650,
          displayHeight: 57,
        }
      ),
      {type: 'promoLink',
        before: 'Incorporate the benefits of pig trotter into your confinement diet now!',
        linkText: 'Choose a meal plan',
        after: 'today!',
        url: 'https://www.chillipadiconfinement.com/menu',
      },
    ],
  },
  {
    id: 'post-35',
    slug:'revitalise-your-body-with-28-days-of-confinement-soup',
    title: 'Revitalise Your Body with 28 Days of Confinement Soup',
    excerpt: 'Drinking confinement soup is a traditional practice believed to help new mothers recover from childbirth and boost overall health. It is typically made with chicken, ginger, and herbs. However, it can also be prepared with vegetarian or vegan ingredients by using alternative protein sources and vegetables. To extract the maximum amount of nutrients and flavours from the ingredients, confinement soup is typically cooked for long periods of time.',
    category: 'Soup',
    tags: [ 'confinement food', 'confinement', 'confinement period' , 'postpartum recovery', 'nourishing food'],
    coverUrl: ARTICLE_IMAGES.soup[1].src,
    createdAt: '2026-09-10T09:00:00+08:00',
    reference: [ 'https://chillipadiconfinement.com/blogs/confinement-tips/revitalise-your-body-with-28-days-of-confinement-soup' ],
    blocks: [
      paragraph('There are various types of confinement soups that include ginger-based soups, herbal soups, bone broth soups, vegetable soups, and fish-based soups.'),
      paragraph('Ginger-based soups are known to boost immunity while reducing inflammation. Herbal soups often include Chinese herbs like goji berries and red dates that have multiple health benefits. Bone broth soups are rich in nutrients and easily digestible, making them a popular choice for postpartum confinement.'),
      paragraph('Vegetable soups include nutrient-dense ingredients like spinach, kale, and broccoli to aid in postpartum recovery. Fish-based soups are an excellent addition to confinement diets as they contain omega-3 fatty acids and protein, which support overall health and wellbeing.'),

      paragraph('**Black Chicken Herbal Soup**'),
      paragraph('One of the most popular confinement soups in traditional Chinese medicine is Black Chicken Herbal Soup. This soup contains several ingredients such as black chicken, goji berries, and Chinese yam, which are believed to promote postpartum healing and nourishment.'),
      paragraph('Black chicken is a great source of protein and amino acids while goji berries are known for their antioxidant properties. Additionally, Chinese yam is high in fiber and can help regulate digestion.'),

      paragraph('**Pig Trotter and Black Vinegar Soup**'),
      paragraph('This soup is made with pig trotters, black vinegar, ginger, and garlic, among other ingredients.'),
      paragraph('Black vinegar is believed to help improve blood circulation and boost energy levels, while pig trotters are a rich source of collagen that can help improve skin elasticity and promote joint health. Additionally, this soup is a great source of nutrients such as protein and iron.'),

      paragraph('**Fish Head Soup with Papaya**'),
      paragraph('Fish heads are a particularly beneficial ingredient as they are rich in collagen and omega-3 fatty acids that can improve skin health and brain function.'),
      paragraph('Papaya contains enzymes that aid digestion and can help reduce inflammation, while ginger is known for its anti-inflammatory properties and can ease nausea and vomiting.'),

      paragraph('**Lotus Root and Peanut Soup**'),
      paragraph('This popular soup is believed to have several health benefits for new mothers or those recovering from illness, including promoting lactation, reducing inflammation, and improving digestion. Lotus root is rich in vitamin C, fiber, and antioxidants while peanuts provide protein, healthy fats, and vitamins.'),
      paragraph('To enhance its nutritional value and flavor, this soup can also be made with other ingredients such as pork ribs or chicken. It\'s recommended to consume this soup during the postpartum period or whenever you need a boost in nutrient intake or faster recovery.'),

      paragraph('**Ginger Wine Chicken Soup**'),
      paragraph('Ginger Wine Chicken Soup is made with chicken, ginger, and rice or Shaoxing wine. Ginger is known for its anti-inflammatory and immune-boosting properties while the wine adds warmth to the body. This delicious and easy-to-make soup is not only nourishing but also helps new moms heal after childbirth.'),
      paragraph('Other types of confinement soups include black bean soup, lotus root soup, and pork rib soup.'),
      paragraph('Each of these soups has its own unique benefits and can contribute to overall wellness during the confinement period. Incorporating these soups into a regular diet can help revitalize the body and promote recovery after childbirth.'),

      {type: 'heading' , text:'Benefits of Drinking Confinement Soup' , size:'medium' , uppercase:true},

      image({
        src: ARTICLE_IMAGES.soup[0].src,
        alt:'Benefits Of Drinking Confinement Soup',
        objectPosition: 'center 10%'
      }),
      paragraph('Confinement soup is a traditional Chinese remedy that has been used for centuries to aid in postpartum recovery. This soup is packed with nutrient-rich ingredients such as ginger, chicken, and goji berries that promote healing and boost the immune system. Drinking confinement soup can also aid in digestion, promote better sleep, and improve overall well-being.'),
      paragraph('The benefits of confinement soup are not limited to new mothers. Anyone can enjoy this soup to revitalize their body and reap its many health benefits. Whether you\'re recovering from an illness or looking to enhance your immune system, confinement soup is an excellent choice'),
      paragraph('**Boosts Postpartum Recovery**'),
      paragraph('One of the main benefits of drinking confinement soup is its ability to boost postpartum recovery by aiding digestion, reducing inflammation, and improving blood circulation.'),
      paragraph('The ingredients used in confinement soup are carefully selected for their healing properties and are believed to promote overall well-being. Drinking this soup on a regular basis can help new mothers recover faster, feel more energized, and improve their overall health.'),
      paragraph('**Helps with Lactation**'),
      paragraph('Confinement soup\'s ingredients are carefully selected for their nutritional and healing properties, including herbs and ingredients that have been used for centuries to support breastfeeding and milk production.'),
      paragraph('Aside from promoting lactation, drinking confinement soup can also help replenish nutrients lost during childbirth and support overall postpartum recovery.'),
      paragraph('**Replenishes Nutrients in the Body**'),
      paragraph('One of the main benefits of drinking confinement soup is its ability to replenish the body\'s nutrients, including protein. This makes it an excellent source of nutrition for women recovering from childbirth or illness. Additionally, confinement soup can help boost the immune system and improve digestion due to its high nutrient content.'),
      paragraph('Overall, drinking confinement soup is a delicious and healthy way to nourish your body from the inside out.'),
      {type: 'heading' , text:'Frequently Asked Questions about Confinement Soup' , size:'medium' , uppercase:true},
      paragraph('**Can I Drink Confinement Soup if I Had a C-Section?**'),
      paragraph('One frequently asked question about confinement soup is whether it is safe to consume after a C-section. While confinement soup can be beneficial for new mothers who have had a C-section, it is important to consult with your doctor or healthcare provider before consuming it.'),
      paragraph('Certain ingredients in the soup, such as ginger and Chinese herbs, may have healing properties that can aid in recovery. However, it is important to exercise caution when consuming any new foods or beverages after surgery and to follow your doctor\'s recommendations.'),
      paragraph('By consulting with your healthcare provider and using caution, you can safely enjoy the benefits of confinement soup and help revitalize your body after pregnancy.'),

      paragraph('**Can I Drink Confinement Soup if I am Vegetarian?**'),
      paragraph('If you are a vegetarian, you can still enjoy the benefits of confinement soup. There are several vegetarian-friendly recipes available that include ingredients like mushrooms, tofu, and various vegetables. Additionally, you can customize your own recipe by choosing vegetables and herbs that suit your taste and dietary needs.'),
      paragraph('Vegetarian confinement soups can provide the same nourishing benefits as traditional meat-based soups, such as boosting immunity, improving digestion, and aiding in postpartum recovery. However, it is important to consult with a healthcare professional before starting any new diet or nutrition plan to ensure that it is safe for you.'),

      {type: 'heading' , text:'Where to Get Confinement Soup' , size:'medium' , uppercase:true},

      paragraph('**Preparing Confinement Soup at Home**'),
      paragraph('If you\'re looking to try 30 days of confinement soup, preparing it at home can be a great option. This allows you to save money and customize the ingredients to your liking. To make the soup, you will need a slow cooker or a large pot and some basic ingredients such as meat, vegetables, herbs, and spices. You can find many confinement soup recipes online that cater to different dietary needs and preferences.'),
      paragraph('It\'s important to follow food safety guidelines when preparing and storing the soup, especially if you plan on freezing it for later use. If you don\'t have time to make the soup from scratch, pre-made confinement soups are available for purchase from specialty stores or online retailers.'),
      paragraph('**Buying from a Confinement Meal Delivery Service**'),
      paragraph('If you are looking for a convenient way to get freshly cooked confinement soup delivered to your doorstep, a confinement meal delivery service may be the right solution for you. These services often use high-quality ingredients and follow traditional recipes to ensure the best possible flavor and nutritional value. When choosing a confinement meal delivery service, it\'s important to consider factors such as menu variety, pricing, and delivery options.'),
      paragraph('Additionally, some services may also offer additional dishes and snacks that are specifically designed for postpartum recovery. This can include items like lactation cookies or soups with specific herbs and ingredients that support healing after childbirth. By using a confinement meal delivery service, you can save time and energy while still enjoying the benefits of delicious and nutritious confinement soup tailored to your postpartum needs.'),

      image(
        {
          src: '/banners/banner.png',
          alt: 'https://www.chillipadiconfinement.com/product',
          maxWidth: 650,
          displayHeight: 57,
        }
      ),
      {type: 'promoLink',
        before: 'Ready to try some yourself? We are currently having a sale with our 28 days meal plan. Find out all about it ',
        linkText: 'here.',
        after: '',
        url: 'https://www.chillipadiconfinement.com/menu',
      },
    ],
  },
  {
    id: 'post-36',
    slug:'how-husbands-can-support-their-wife-during-the-postpartum-period',
    title: 'How Husbands Can Support Their Wife During The Postpartum Period',
    excerpt: 'Welcoming a newborn into the family is an exciting step for any father. But with all the attention turned towards the baby, your wife may be feeling a little neglected or under-appreciated',
    category: 'Support',
    tags: [ 'mental health', 'confinement period' , 'postpartum recovery', 'confinement'],
    coverUrl: ARTICLE_IMAGES.postpartum[1].src,
    createdAt: '2026-09-10T09:00:00+08:00',
    reference: [ 'https://chillipadiconfinement.com/blogs/confinement-tips/how-husbands-can-support-their-wife-during-the-postpartum-period' ],
    blocks: [
      paragraph('The changes after pregnancy and childbirth can be overwhelming. Fulfilling mummy duties while still finding the time to take care of herself might seem impossible. '),
      paragraph('Your wife will need your help. So roll up your sleeves and get ready to learn.'),
      {type: 'heading' , text:'What’s Going to Happen' , size:'large' , fontWeight:800},
      {type: 'heading' , text:'Postnatal blues' , size:'large'},
      paragraph('Your wife may be weak, tired, and even upset. Pregnancy is a long and laborious nine months. Delivery, whether vaginal or cesarean, will have placed strain on your wife’s body. '),
      paragraph('Due to hormonal changes, many women experience a ‘sad’ or ‘depressed mood’ in the one to two weeks after childbirth. Brace yourself for cries and tears. They may not just be from the baby!'),
      paragraph('Postnatal blues, also known as ‘Baby Blues’, is common. However, some women may develop Postpartum Depression (PPD). Watch out for red flags. Excessive crying and mood swings lasting for more than two weeks may be a sign of PPD. For more information consult your healthcare provider.'),
      paragraph('**Major shake-ups in her routine**'),
      paragraph('Nap time, feeding time, diaper changes, nursing, pumping schedules!'),
      paragraph('Especially for a first-time mother, caring for a newborn can be overwhelming. For working women on maternity leave, suddenly being alone at home with a newborn may feel disorienting or isolating. '),
      paragraph('Did you know? You can take time off work to accompany your wife and newborn. Fathers are entitled to **government-paid paternity leave** for all births if you fulfil the eligibility criteria:'),
      list([
        'Your baby is a Singapore citizen',
        'You’re lawfully-married to your baby’s mother between conception and birth',
        'You’ve been with your employer for a continuous period of at least three months before the birth of your baby.',
      ], 'number'),
      paragraph('Whether you’re working or staying home, both your wife and yourself should expect sleepless nights. Most babies don’t start sleeping through the night until they are about three months old. Unlike adults, babies spend less time in rapid eye movement (REM) sleep and have short sleep cycles.'),
      paragraph('**The confinement period**'),
      paragraph('With all these changes, the four to six week period right after childbirth is especially important for both mummy and baby. '),
      paragraph('Confinement is a crucial phase for your wife’s body to recuperate, repair, and restore its natural reserves. In some traditions, the confinement period can last for up to three months after childbirth.'),
      paragraph('In Western cultures, the confinement period is referred to as ‘lying-in’ as it requires a long period of bedrest during and after pregnancy even if there were no medical complications during childbirth. '),
      paragraph('In Asian cultures, emphasis is placed on diet. As a general rule of thumb, traditional Chinese, Malay and Indian confinement practices emphasise the consumption of ‘warming’ foods and beverages. '),

      {type: 'heading' , text:'What you should avoid' , size:'medium' , uppercase:true},

      paragraph('**Acting like nothing has changed**'),
      paragraph('Welcoming a newborn into the family is a massive change. Especially for first-time parents. So that’s rule number one, don’t act as though nothing has changed. Simple right?'),
      paragraph('Postpone your boys nights to clubs or pubs. Forget about late-nights watching EPL or UFC matches live. Parenthood isn’t just a mother’s duty, but yours too. Be there as much as you can. Remember your priorities.'),

      paragraph('**Trying to ‘fix’ your wife**'),
      paragraph('Don’t be solution-focused or try to ‘fix’ her. Birth brings about many changes to a mother, but in no way should you treat her as though anything needs to be ‘fixed’. Instead, focus on helping her recover healthy and supporting her throughout.'),

      {type: 'heading' , text:'What you can do' , size:'medium' , uppercase:true},

      paragraph('**Throw Her A Baby Shower**'),
      paragraph('Baby showers are not limited to the pregnancy period. In several Asian cultures, it is customary to have ‘Full Month’ or ‘Whole Month’(满月 mǎn yuè) celebrations, the first month of your newborn’s life.'),
      paragraph('Another milestone that has become popular among young Singaporean parents is their baby’s **100** Day birthday. Having a **100 Day** instead of a **Full Month** celebration gives you more time to prepare and more time for your wife to recover.'),
      paragraph('As Dr Christopher Ng, gynaecology specialist at GynaeMD Clinic, points out, new mums may face issues such as breast engorgement, pain from a C-section wound, urinary incontinence and haemorrhoids. It may take eight weeks or more for your wife to feel fully herself again'),
      paragraph('Whether your family prefers an elaborate themed party or intimate gathering over a meal, it might be best to wait until your wife has recovered and is ready. Plan surprise parties at your own risk!'),

      paragraph('**Engage A Confinement Caterer**'),
      paragraph('Eating right is crucial for a smooth confinement period. Consuming the right herbs, soups and teas will make a difference in your wife’s postpartum recovery. What’s more, the right type of diet evolves during the different stages of confinement. '),
      paragraph('In traditional Chinese practices, it is believed that consuming Sheng Hua Tonics is crucial during the initial stage of confinement to dispel wind and discharge lochia and placental fragments from the womb effectively. '),
      paragraph('Can’t cook and don’t have time to research recipes? Confinement catering services are available. '),
      paragraph('Postpartum meal services are usually priced as single-meal (lunch or dinner) or dual-meal (lunch and dinner) packages lasting from one week to twenty-eight days. '),

      paragraph('**Pamper Her**'),
      paragraph('Lactation cookies, postnatal massages, mummy-and-baby photoshoots...there are plenty of ways you can pamper your wife post-pregnancy. '),
      paragraph('If your wife has a sweet tooth, consider ordering lactation bakes for her. These treats are gaining popularity among breastfeeding mums. Some women even report an increase of up to 50% after consuming lactation cookies. '),

      {type: 'heading' , text:'Be Patient With Parenthood' , size:'medium' , uppercase:true},

      paragraph('Parenthood is a team effort all the way. With your wife having to focus on taking care of her child as well as her own recovery, there’s only so much she can handle. So ease the load for her, find places to help wherever you can! Clean up the house, take-over on baby duty, and (most importantly) get her food. '),
      paragraph('Be patient. Parenthood is as new to her as it is to you, and mothers often worry if they’re doing things right. Reassure her when she needs it, and acknowledge her efforts, it’ll make all the difference. '),

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
    id: 'post-37',
    slug:'five-tips-for-a-smooth-confinement',
    title: 'Five Tips for a Smooth Confinement',
    excerpt: 'Pregnancy is one of the most significant experiences in a woman’s life. However, equally important is the postpartum confinement period. The six to eight week time-window after childbirth is crucial for both the mother and newborn.',
    category: 'Tips',
    tags: [ 'confinement' , 'confinement period' , 'postpartum recovery'],
    coverUrl: ARTICLE_IMAGES.fiveTips[0].src,
    createdAt: '2026-09-10T09:00:00+08:00',
    blocks: [
      paragraph('Conceiving and carrying a baby to term is very demanding on your body. Reserves of essential nutrients such as folate, calcium and vitamin B6 are depleted. Whether you gave birth vaginally or you had a cesarean delivery, your body will need extra care to recover properly.'),
      {type: 'spacedHeading' , number: '1' , text: 'Pay Attention to Your Body'},
      paragraph('After giving birth, your newborn might be the centre of your focus. But don’t forget to pay attention to your body and monitor your recovery.'),
      image({
        src: ARTICLE_IMAGES.fiveTips[2].src,
        alt: 'Baby Meme',
        fit: 'contain'
      }),
      paragraph('If you are experiencing severe **pain, bleeding, swelling, fever, headache**, contact your doctor as soon as possible. These could be signs of **complications** such as postpartum haemorrhage, deep vein thrombosis or heart problems.'),
      {type: 'spacedHeading' , number: '2' , text: 'Eat Well'},
      paragraph('Did you know? The average blood loss for a vaginal birth is roughly 480ml - more than one can of your average soft drink! Blood loss with a cesarean delivery can be close to one litre. Regardless of the method of delivery, there will be blood loss and eating the right foods can help you to replenish it. '),
      paragraph('A good diet is essential for restoring your body’s natural stores of vitamins and minerals. Eating food rich in **iron, vitamin A, B** and **C** will help with **increasing** your energy levels and **repairing** your body. '),
      gallery(ARTICLE_IMAGES.fiveTips2 , 'Stir-Fried Spinach with Sea Cucumber topped with WolfBerries and Chicken with Egg topped with WolfBerries'),
      paragraph('Drink **eight glasses** of water a day whether you are breastfeeding or not. It is important to replenish the fluids you have lost from the process of giving birth and staying hydrated will help bring your blood volume levels back to normal.'),
      paragraph('For breastfeeding mothers, foods like **dark green** and **yellow vegetables, fenugreek, oatmeal, lean meat** and **poultry, goji berries** and **papaya**, can help with **regulating** the production of milk and **increasing** milk flow.'),
      paragraph('^^Lactation cookies^^ and other treats like ^^lactation nougats^^ are great to have on hand as they make great snacks and contain beneficial power foods for lactation like flax, yeast and oatmeal.'),
      list([
        'Flaxseeds - have oestrogenic properties that can help nursing moms produce more milk and provides healthy fats that are a healthy component of breast milk to promote a child\'s brain development.',
        'Yeast - known for its highly digestible protein levels, minerals, vitamin B, key amino acids and chromium which supports healthy milk supply for breastfeeding mothers. Not only that, it also elevates the energy levels and mood of postnatal mums.',
        'Oatmeal - contain plant oestrogens, which have been associated with the stimulation of milk glands. It also has a fiber called Beta-glucan, which can increase the levels of prolactin (a hormone that is responsible for producing milk) in the bloodstream.',
      ]),
      {type: 'spacedHeading' , number: '3' , text: 'Watch out for emotional red flags'},
      paragraph('The sudden decrease of hormones after childbirth might trigger an emotional response in new mothers. **‘Baby Blues’** are common and you may experience symptoms like irritability, crying, mood swings, appetite problems or reduced concentration. These symptoms should **go away within the first two weeks**.'),
      paragraph('A more severe emotional complication is **postnatal depression (PND)**. PND may cause mothers to have:'),
      list([
        'panic attacks',
        'uncontrollable mood swings',
        'feelings of emptiness, shame or guilt',
        'thoughts of harming themself or their baby',
      ]),
      paragraph('If you notice any of these red flags, contact a mental health professional as soon as possible.'),
      {type: 'spacedHeading' , number: '4' , text: 'Prioritise Self-Care'},
      paragraph('Have plenty of rest and avoid strenuous or mentally-draining activities. It is important to recharge both physically and mentally. Watch a movie, read a magazine, or do some online shopping. **Anything that helps you destress should be prioritised.** '),
      image({
        src: ARTICLE_IMAGES.fiveTips[1].src,
        alt: 'Meme 1'
      }),
      paragraph('Accept help from family members offering to assist with cooking and doing housework. Is your husband terrible at cooking? Engage a **confinement caterer** instead. Lunch and dinner are prepared with the optimal mix of herbs and ingredients for your recovery. Meals are delivered to your doorstep so you have more time to focus on yourself and to spend with family.'),
      paragraph('If it feels right for your body, consider **postnatal massages.** Massage may help relieve water retention, muscle soreness and breast engorgement, and tone your body. There are also in-home sessions available so you won’t even have to step out your door. '),
      {type: 'spacedHeading' , number: '5' , text: 'Don\'t be too hard on yourself' },
      paragraph('Having a child is a beautiful experience but it is not easy being a mother. Don’t put too much pressure on yourself. Despite what you may see on social media, never stress about fitting society’s standards of a “perfect mother”. '),
      quote('Remember, happy mum equals happy baby. '),
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
    id: 'post-38',
    slug:'why-we-use-kuhlbarra-barramundi-in-our-dishes',
    title: 'Why we use Kühlbarra Barramundi in our dishes',
    excerpt: 'Kühlbarra’s Barramundi complements our confinement meals as its flesh is sweet and has a refreshing taste. Most of all, Barramundi has been tested to be higher in Omega-3 & Omega-6 as compared to most other edible fish species. This greatly benefits postnatal mothers whose bodies’ own store of nutrients have been depleted due to breast-feeding.',
    category: 'Dish',
    tags: ['Kuhlbarra Barramundi' , 'confinement'],
    coverUrl: ARTICLE_IMAGES.kuhlbarra[0].src,
    createdAt: '2026-09-10T09:00:00+08:00',
    blocks: [
      paragraph('Since October 2019, ^^Chilli Padi Confinement^^ has been using ^^Kühlbarra’s Barramundi^^ for our confinement food!'),
      paragraph('Kühlbarra is certified with the Highest Rating of 4 Stars by ^^Best Aquaculture Practice (BAP)^^.'),
      paragraph('BAP is a seafood-specific accreditation that is only conferred to producers who follow optimal practices to deliver farmed seafood safely and responsibly. The BAP evaluates four key areas of sustainability —environmental, social, food safety, and animal health & welfare— at each step of the aquaculture production chain.'),
      paragraph('Kühlbarra is 1 of 5 farms in the world, and the only farm in Singapore with this 4-star rating.'),
      paragraph('Kühlbarra farm their barramundi in pristine ocean waters located on the south side of Singapore. The fish are bred in spacious pens offering sufficient frolicking space and where tides bring in oxygen-rich waters while effectively dispersing waste. The water environment is rigorously monitored at 10-minute intervals. There are also dedicated divers checking on the health of the fish and pen conditions daily.'),
      paragraph('Kühlbarra’s barramundi is rigorously tested by Singapore Food Agency (formerly Agri-Food and Veterinary Authority), according to standards even more stringent than the European Union Standards for Food Safety.'),
      paragraph('Furthermore, Kühlbarra’s Barramundi is only fed with a specially formulated feed of 70% plant-based proteins, free of antibiotics & hormones, and tested safe from mercury.'),
      paragraph('This greatly benefits postnatal mothers whose bodies’ own store of nutrients have been depleted due to breast-feeding.'),

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
    id: 'post-39',
    slug:'traditional-chinese-confinement-practices',
    title: 'Traditional Chinese Confinement Practices',
    excerpt: 'The tradition of Chinese confinement postpartum practices can be traced back to the early Qin Dynasty (221 B.C to 206 B.C) where it was recorded in 礼记内则 (Li Ji Nei Ze): a collection of records, over 2000 years old, detailing the rules regarding a women’s seclusion after delivering.',
    category: 'Traditions',
    tags: [],
    coverUrl: ARTICLE_IMAGES.chineseWine[1].src,
    createdAt: '2026-09-10T09:00:00+08:00',
    blocks: [
      paragraph('Postpartum Confinement is also known as 坐月子 (zuò yuè zi). The confinement practices were passed down verbally from one generation to the next, and the practices vary between regions.'),
      paragraph('Ginger, Sesame Oil, and Rice Wine are major staples in confinement dietary practices. As Sesame Oils are used as the base for most of the dishes and soups, many new mothers find the look of these dishes unappetising as the resulting dishes look greasier.'),
      paragraph('‘Heating’ ingredients are mainly used to prepare postpartum meals as these are considered ‘hot’ and help nourish and rebalance the mother’s body which would be in a \'cold\' state due to childbirth. Ingredients that are considered ‘cooling’ should not be taken during this period'),
      image({
        src: ARTICLE_IMAGES.chineseWine[0].src,
        alt: 'Chinese Wine'
      }),
      paragraph('**The different confinement practices**'),
      paragraph('Confinement practices are commonplace throughout Asia, although the cultures and beliefs differ between regions. For instance, confinement periods may last from 30 to 100 days depending on the cultural practice.'),
      paragraph('Postpartum Confinement is not only practiced by the Chinese -- in Japan it is known as “Sango no hidachi”, In Korea, it is known as “Samchilil”, and in India it is known as “Jaappa”. The common belief is that these practices would greatly benefit a new mother’s physical, mental and emotional state and wellbeing.'),
      paragraph('^^An article on the Ministry of Social and Family Development’s website^^ shows a breakdown of the different postpartum dietary practices between the 3 major races in Singapore:'),
      
{
  type: 'practiceTable',
  headers: [
    '',
    'CHINESE PRACTICES',
    'MALAY PRACTICES',
    'INDIAN PRACTICES',
  ],
  rows: [
    {
      cells: [
        { text: 'Confinement Period', bold: true },
        { text: '30 days' },
        { text: '44 days' },
        { text: '40 days' },
      ],
    },
    {
      cells: [
        { text: 'Dietary Requirements', bold: true },
        {
          text: '• To purge out the “wind” in the body after delivery, promote “blood circulation”, strengthen the joints and promote milk supply.\n• To avoid “cooling” foods.',
          colSpan: 3,
        },
      ],
    },
    {
      cells: [
        { text: '' },
        {
          text: 'Traditionally, they use a lot of ginger, wines and sesame oil in their diet. Common dishes include pigs’ trotters cooked with ginger and vinegar, fish soup, chicken cooked in sesame oil and a traditional tonic brewed from 10 herbs. Fish soup boiled with papaya is believed to be beneficial for milk production.\n\nIt is also recommended that plain water consumption is avoided during this period to reduce the risk of water retention. Instead, specially prepared drinks from a mixture of herbs and preserved dates are recommended.',
        },
        {
          text: 'During confinement, a woman follows a special diet in which heating foods are encouraged and cooling foods avoided to restore the balance upset by the birth.\n\nSome Malay mothers who have just delivered often take a special drink called “jamu”. It is believed that the pores on the body are opened during labor and “jamu” has properties that can keep the body warm.',
        },
        {
          text: 'The Indians take garlic milk to prevent “wind”. Like the Chinese and Malays, “cooling” foods are avoided, especially tomatoes, cucumbers, coconut milk, and mutton.\n\nOnly chicken and shark fish cooked with herbs are allowed while other seafood is not allowed.\n\nChilli is not allowed.\n\nPlenty of garlic fried without oil is encouraged. Cooking is done with gingelly oil.\n\nOral intake of herbs or D.O.M. is encouraged to keep the body warm.\n\nThere is a restriction on fluids/fruits/vegetable intake as well as cold drinks and food.',
        },
        ],
       },
       {
        // Row 1: Left-side heading + introductory text
        cells: [{ 
          text: 'Other Practices', bold: true },
          { text: 'The basis for such practices is to protect the new mother from future ill health, restore her strength and to protect the family from ritual pollution.', 
            colSpan: 3, 
          },
        ],
      },
      { // Row 2: Long text, separated into three cultural columns
       cells: [{ text: '' },
        { text: 'The Chinese believe in staying indoors throughout the confinement period to avoid outdoor pollution. Strenuous physical activities are discouraged to prevent further “muscle-weakening”.\n\nSome would hire a confinement nanny to help with the housework and caring for the baby.\n\nOther practices may include:\n\n• Not washing the body or hair during the month; especially avoiding contact with cold water.\n• Not going outside for the entire month (or at least avoid wind).\n• Not eating raw or “cooling” foods or foods cooked the previous day.\n• Eat chicken, especially chicken cooked in sesame oil; pork liver and kidney are also good; eat five or six meals daily and rinse the rice bowl with scalding water.\n• Avoid all wind, fans and air conditioning.\n• Avoid walking or moving about; the ideal is lying on the back in bed.\n• Do not go into another person’s home.\n• Do not get sick.\n• Do not read or cry.\n• Do not have sex.\n• Do not eat with family members.\n• Do not burn incense or visit a temple or altar.',},
        { text: 'Traditionally, childbirth is in the mother’s home attended by a bidan (Malay midwife) and the umbilical stump dusted with a mixture of spices. Fortunately, this has been replaced by hospital births that reduce complications and infection rates.\n\nBoth mother and child should be bathed immediately in heated water filled with herbs after birth.\n\nThe mother will “keep warm” through various traditional methods. These may include sitting near to or lying above a heated source or warming the abdomen by applying a heated stone over it.\n\nDuring this confinement period, a female masseuse is engaged to help the mother regain her figure or at least to keep her extended tummy trim. The practice of tightly binding the tummy is called berbengkong, and is believed to help in maintaining the body shape.\n\nSex is also strictly prohibited during the confinement period.',},
        { text: 'Indian mothers are also discouraged from leaving their homes during their confinement period.\n\nBathing is discouraged and if done, it should be performed with special herbal preparations and turmeric powder.\n\nBathing is only allowed between 11 am and 2 pm when the temperature is at its highest.\n\nDaily body massages with oil are also encouraged.\n\nOther practices may include:\n\n• Not allowed to enter the prayer altar room.\n• Splashing of warm water on the abdomen during bathing to expel clots from the uterus.\n• Washing of hair is done on odd days i.e. day 3,5,7… during the first two weeks. Dry hair after washing with incense smoke.\n• Place incense smoke in between legs to dry episiotomy wound.\n• Binding of the tummy with six feet cloth.\n• Sex is strictly prohibited.', },
        ],
       },
      ],
     },
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
  ]


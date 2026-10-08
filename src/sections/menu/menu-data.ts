import type { DishCard } from '../home/home-data';

import { popularDishes, orderStepImages } from '../home/home-data';

// ----------------------------------------------------------------------

export type MenuDish = {
  english: string;
  chinese: string;
};

export type MenuDaySet = {
  day: number;
  lunchDishes: MenuDish[];
  dinnerDishes: MenuDish[];
};

export type MenuPool = Record<number, MenuDaySet>;

export type MenuWeekOption = {
  id: number;
  stage: 'Recovery' | 'Nourish';
};

export const MENU_WEEK_OPTIONS: MenuWeekOption[] = [
  { id: 1, stage: 'Recovery' },
  { id: 2, stage: 'Nourish' },
  { id: 3, stage: 'Nourish' },
  { id: 4, stage: 'Nourish' },
];

export const EMPTY_MENU_DAY_SET: MenuDaySet = {
  day: 0,
  lunchDishes: [],
  dinnerDishes: [],
};

export const nonOperatingDays: string[] = [];

export const menuPopularDishes: DishCard[] = popularDishes;

export const menuOrderStepImages = orderStepImages;

export type DishHotspot = {
  // Position of the click-to-reveal dot, eyeballed against each photo's
  // dish position; nudge as needed once seen live.
  top: string;
  left: string;
  englishName: string;
  chineseName: string;
  // Draft copy based on the dish name alone — please have the kitchen/
  // nutrition team confirm or rewrite before this goes live.
  description: string;
};

export type GalleryTile = {
  id: number;
  image: string;
  alt: string;
  // One dot per dish visible in the photo — most tiles show a single dish,
  // but a photo with several dishes on the table can carry one hotspot per
  // dish rather than being limited to one.
  hotspots: DishHotspot[];
  // How many grid tracks this tile spans — most tiles are 1x1; a few are
  // widened or enlarged to break up the grid into the mixed-size "collage"
  // look (some cells bigger, one wide banner), like a magazine photo wall
  // rather than a uniform grid. The grid packs with `grid-auto-flow: dense`,
  // so these don't need to add up to a clean rectangle — gaps auto-fill.
  span?: { cols?: number; rows?: number };
};

// Styled lifestyle photography (wooden octagonal tray on a marble table),
// shot for the dish gallery — sourced from public/dishes/OneDrive_3_9-24-2026.
// Rendered as a static collage grid; each tile shows click-to-reveal dots
// (dish name popover) rather than a permanent caption — see
// menu-dish-gallery.tsx.
export const dishGalleryTiles: GalleryTile[] = [
  {
    id: 1,
    image: '/dishes/OneDrive_3_9-24-2026/Immunity Boosting Cordyceps Militaris Chicken Soup.jpg',
    alt: 'Immunity Boosting Cordyceps Militaris Chicken Soup',
    span: { rows: 2 },
    hotspots: [
      {
        top: '60%',
        left: '60%',
        englishName: 'Immunity Boosting Cordyceps Militaris Chicken Soup',
        chineseName: '增强免疫力虫草花鸡汤',
        description:
          'Strengthens immunity and supports overall vitality during recovery.',
      },
    ],
  },
  {
    id: 2,
    image: '/dishes/OneDrive_2_9-24-2026/Veggie.jpg',
    alt: 'Stir Fried Spinach with Black Fungus and Wolfberry',
    hotspots: [
      {
        top: '55%',
        left: '50%',
        englishName: 'Stir Fried Spinach with Black Fungus and Wolfberry',
        chineseName: '菠菜炒黑木耳，枸杞',
        description:
          'Replenishes iron and blood, supporting post-birth recovery.',
      },
    ],
  },
  {
    id: 3,
    image: '/dishes/OneDrive_3_9-24-2026/Mind Boosting Walnut Black Bean Pork Ribs Soup.jpg',
    alt: 'Mind Boosting Walnut Black Bean Pork Rib Soup',
    hotspots: [
      {
        top: '60%',
        left: '50%',
        englishName: 'Mind Boosting Walnut Black Bean Pork Rib Soup',
        chineseName: '黑豆核桃排骨汤',
        description:
          'Nourishes the brain and kidneys, believed to aid mental clarity and energy.',
      },
    ],
  },
  {
    id: 4,
    image: '/dishes/OneDrive_2_9-24-2026/PigTrotters.jpg',
    alt: "Pig's Trotter with Ginger, Vinegar and Egg",
    span: { rows: 2 },
    hotspots: [
      {
        top: '55%',
        left: '45%',
        englishName: "Pig's Trotter with Ginger, Vinegar and Egg",
        chineseName: '猪脚醋',
        description:
          'Warms the body and is traditionally believed to support healing and milk flow.',
      },
    ],
  },
  {
    id: 5,
    image: '/dishes/OneDrive_3_9-24-2026/Papaya Fish Soup.jpg',
    alt: 'Papaya Fish Soup',
    hotspots: [
      {
        top: '60%',
        left: '50%',
        englishName: 'Papaya Fish Soup',
        chineseName: '芦巴青木瓜鱼',
        description:
          'Promotes lactation and milk supply for breastfeeding mothers.',
      },
    ],
  },
  {
    id: 6,
    image: '/dishes/OneDrive_4_9-24-2026/Chicken.jpg',
    alt: 'Mei Kuei Lu Chicken with Egg',
    span: { cols: 2 },
    hotspots: [
      {
        top: '55%',
        left: '45%',
        englishName: 'Mei Kuei Lu Chicken with Egg',
        chineseName: '炖玫瑰露鸡与蛋',
        description:
          'Warms the body and helps dispel wind, aiding postpartum recovery.',
      },
    ],
  },
  {
    id: 7,
    image: '/dishes/OneDrive_2_9-24-2026/12Dishes.jpg',
    alt: 'Stir-fried Lean Meat with Liver, Ginger and D.O.M + Red Wine Stewed Chicken',
    span: { rows: 2 },
    // This photo shows two different dishes stacked in one frame (not the
    // single "Lemongrass Chicken Soup" it was labelled with before) — a
    // second hotspot for the bottom dish. Both names below are a visual
    // best guess (no soup visible in either bowl) — please confirm/replace.
    hotspots: [
      {
        top: '22%',
        left: '50%',
        englishName: 'Stir-fried Lean Meat with Liver, Ginger and D.O.M',
        chineseName: '黑木耳百合干炒瘦肉',
        description:
          'Replenishes blood and iron, supporting recovery from blood loss.',
      },
      {
        top: '75%',
        left: '50%',
        englishName: 'Red Wine Stewed Chicken',
        chineseName: '法式红酒焗鸡',
        description:
          'Promotes blood circulation and warms the body during confinement.',
      },
    ],
  },
  {
    id: 8,
    image: '/dishes/OneDrive_3_9-24-2026/Baked Herbal Chicken.jpg',
    alt: 'Baked Herbal Chicken',
    hotspots: [
      {
        top: '63%',
        left: '51%',
        englishName: 'Baked Herbal Chicken',
        chineseName: '烤药材鸡',
        description:
          'Restores energy (Qi) and strengthens the body with warming herbs.',
      },
    ],
  },
  {
    id: 9,
    image: '/dishes/OneDrive_4_9-24-2026/Fish Soup.jpg',
    alt: 'Six Combination Nourishing Herbal Fish Soup',
    span: { rows: 2 },
    hotspots: [
      {
        top: '60%',
        left: '50%',
        englishName: 'Six Combination Nourishing Herbal Fish Soup',
        chineseName: '六味润肤鱼汤',
        description:
          'Nourishes the body broadly, supporting skin, energy and overall recovery.',
      },
    ],
  },
  {
    id: 10,
    image: '/dishes/OneDrive_3_9-24-2026/Nourishing_and_Beautifying_Black_Chicken_Soup.jpg',
    alt: 'Double Strength Ba Zhen Black Chicken Soup',
    hotspots: [
      {
        top: '60%',
        left: '50%',
        englishName: 'Double Strength Ba Zhen Black Chicken Soup',
        chineseName: '上品八珍黑鸡汤',
        description:
          'Deeply tonifies Qi and Blood for faster, fuller postpartum recovery.',
      },
    ],
  },
  {
    id: 11,
    image: '/dishes/OneDrive_3_9-24-2026/Red Date Tea.jpg',
    alt: 'Longan Red Date Tea',
    hotspots: [
      {
        top: '60%',
        left: '50%',
        englishName: 'Longan Red Date Tea',
        chineseName: '龙眼红枣茶',
        description:
          'Boosts energy and replenishes blood with natural sweetness.',
      },
    ],
  },
  {
    id: 12,
    image: '/dishes/OneDrive_3_9-24-2026/Group Shot.jpg',
    alt: 'Stir Fried HK Kai Lan With Superior Soya Sauce',
    span: { cols: 2 },
    hotspots: [
      {
        top: '60%',
        left: '50%',
        englishName: 'Stir Fried HK Kai Lan With Superior Soya Sauce',
        chineseName: '酱油汁炒香港芥兰',
        description:
          'Provides fibre and vitamins to support digestion during recovery.',
      },
    ],
  },
  {
    id: 13,
    image: '/dishes/OneDrive_3_9-24-2026/Grilled Salmon With Apple Mirin Sauce.jpg',
    alt: 'Grilled Salmon With Apple Mirin Sauce',
    hotspots: [
      {
        top: '60%',
        left: '50%',
        englishName: 'Grilled Salmon With Apple Mirin Sauce',
        chineseName: '烤三文鱼与苹果味醂',
        description:
          'Rich in omega-3s, supporting healing and reducing inflammation.',
      },
    ],
  },
  {
    id: 14,
    image: '/dishes/OneDrive_1_9-24-2026/IMG_0174_Noodle.jpg',
    alt: 'Wok Fried Huai Shan Noodle with Egg',
    hotspots: [
      {
        top: '60%',
        left: '50%',
        englishName: 'Wok Fried Huai Shan Noodle with Egg',
        chineseName: '锅炒淮山面与蛋',
        description:
          'Chinese yam strengthens digestion and supports energy recovery.',
      },
    ],
  },
  {
    id: 15,
    image: '/dishes/OneDrive_2_9-24-2026/ChickenwithEgg.jpg',
    alt: 'Sesame Kampong Chicken with Omelette and Ginger',
    span: { rows: 2 },
    hotspots: [
      {
        top: '60%',
        left: '50%',
        englishName: 'Sesame Kampong Chicken with Omelette and Ginger',
        chineseName: '麻油甘榜鸡与煎鸡蛋和姜',
        description:
          'Sesame oil and ginger warm the body and support post-birth recovery.',
      },
    ],
  }
];

export const nourishMenuPool: MenuPool = {
  0: {
    day: 8,
    lunchDishes: [
      { english: "Pig's Trotter with Ginger, Vinegar and Egg", chinese: '猪脚醋' },
      { english: 'Sheng Yu Fillet with Red and Green Capscium', chinese: '生鱼片炒青红椒' },
      { english: 'Stir Fried Nai Pa with Abalone Mushroom', chinese: '奶白与鲍鱼菇' },
      { english: 'Fragrant White Rice', chinese: '白米饭' },
    ],
    dinnerDishes: [
      { english: 'Nutritious Carrot and Corn Pork Rib Soup', chinese: '罗宋排骨汤' },
      {
        english: 'Braised Yellow Wine Chicken with Black Fungus and Wolfberry',
        chinese: '黄酒鸡与黑木耳枸杞',
      },
      { english: 'Stir Fried Lotus With Sweet Peas and Ginkgo Nut', chinese: '莲藕炒甜豆与白果' },
      { english: 'Mixed Five Grain Rice', chinese: '五谷米' },
    ],
  },
  1: {
    day: 9,
    lunchDishes: [
      {
        english: 'Herbal Bak Kut Teh Pork Rib Soup with Beancurd Skin',
        chinese: '药材肉骨茶与豆腐皮',
      },
      {
        english: "Stir Fried Lean Meat with Pig's Kidney with Ginger and D.O.M",
        chinese: '炒瘦肉猪腰',
      },
      { english: 'Stir Fried HK Kai Lan with Shimeji Mushroom', chinese: '香港芥兰与鸿喜菇' },
      { english: 'Fragrant White Rice', chinese: '白米饭' },
    ],
    dinnerDishes: [
      { english: 'Milk Boosting Fish and Papaya Soup', chinese: '木瓜鱼汤' },
      { english: 'Three Cup Chicken with Glutinous Rice Wine', chinese: '三杯鸡' },
      { english: 'Stir Fried Lady Finger with Tumeric and Egg', chinese: '秋葵炒肉碎蛋，黄姜' },
      { english: 'Wok Fried Huai Shan Noodle with Egg', chinese: '锅炒淮山面与蛋' },
    ],
  },
  2: {
    day: 10,
    lunchDishes: [
      { english: 'Amaranth Green with XO Fish Fillet Soup', chinese: '苋菜XO鱼片汤' },
      { english: 'Baked Herbal Chicken', chinese: '烤药材鸡' },
      { english: 'Home Made Beancurd with Minced Pork Sauce', chinese: '自制豆腐与肉碎酱汁' },
      { english: 'Stir Fried Rice Vermicelli with Egg and Ginger', chinese: '炒米粉与蛋，姜丝' },
    ],
    dinnerDishes: [
      { english: 'Nourishing and Beautifying Black Chicken Soup', chinese: '人参黑鸡汤' },
      { english: 'Lean Meat with Sesame Sauce and Egg Omelette', chinese: '麻油瘦肉，煎蛋' },
      { english: 'Stir Fried Broccoli with Fishmaw', chinese: '鱼鳔炒青菜花与红萝卜' },
      { english: 'Mixed Brown Rice', chinese: '糙米饭' },
    ],
  },
  3: {
    day: 11,
    lunchDishes: [
      { english: 'Snow Fungus, Mushroom Chicken Soup', chinese: '银耳香菇鸡汤' },
      { english: 'Grilled Salmon with Apple Mirin Sauce', chinese: '烤三文鱼与苹果味啉酱' },
      { english: 'Lou Han Vegetables', chinese: '罗汉菜' },
      { english: 'Japanese Rice', chinese: '日本米饭' },
    ],
    dinnerDishes: [
      {
        english: 'Collagen Fishmaw, Hou Tou Gu Pork Rib Soup',
        chinese: '胶原蛋白鱼肚猴头排骨汤',
      },
      {
        english: 'Pan Fried Minced Meat Chinese Yam Tofu Patty',
        chinese: '香煎山药肉茸豆腐饼',
      },
      {
        english: 'Roasted Pumpkin with Capsicum and Olive Oil',
        chinese: '烤南瓜与青红椒橄榄油',
      },
      { english: 'Fragrant White Rice', chinese: '白米饭' },
    ],
  },
  4: {
    day: 12,
    lunchDishes: [
      {
        english: "Pork Rib, Pig's Stomach with Lotus Seed Ginkgo Peppercorn Soup",
        chinese: '白果莲子猪肚排骨汤',
      },
      {
        english: 'Pan Fried Barramundi Fillet with Shredded Ginger',
        chinese: '煎鱼片姜丝',
      },
      { english: 'Stir Fried Shanghai Green with Scallop', chinese: '炒上海青与干贝' },
      { english: 'Mixed Five Grain Rice', chinese: '五谷米' },
    ],
    dinnerDishes: [
      { english: 'Tonify Bei Sha Shen, Yu Zhu Pork Rib Soup', chinese: '北沙参玉竹排骨汤' },
      { english: 'Braised Fu Zhou Rice Wine Chicken', chinese: '福州红糟鸡' },
      {
        english: 'Stir Fried Spinach with Black Fungus and Wolfberry',
        chinese: '菠菜炒黑木耳，枸杞',
      },
      { english: 'Stir Fried Pumpkin Noodle with Egg', chinese: '炒金瓜面与蛋' },
    ],
  },
  5: {
    day: 13,
    lunchDishes: [
      { english: 'Si Shen Pork Rib Soup', chinese: '四神排骨汤' },
      { english: 'Mei Kuei Lu Chicken with Tau Kwa', chinese: '玫瑰露鸡与豆干' },
      {
        english: 'Stir Fried King Oyster Mushroom with Basil Leaves',
        chinese: '杏鲍菇炒九层塔叶',
      },
      { english: 'Ginger Egg Fried Rice', chinese: '姜丝蛋炒饭' },
    ],
    dinnerDishes: [
      { english: "Pig's Trotter with Ginger, Vinegar and Egg", chinese: '猪脚醋' },
      {
        english: 'Steamed Thread Fin with Black Fungus and Tomato',
        chinese: '蒸午鱼与黑木耳',
      },
      {
        english: 'HK Chye Sim with Shredded Ginger and Wolfberries',
        chinese: '香港菜心与姜丝枸杞',
      },
      { english: 'Stir Fried Mee Sua with Egg', chinese: '炒面线与蛋' },
    ],
  },
  6: {
    day: 14,
    lunchDishes: [
      { english: 'Fenugreek Papaya Fish Soup', chinese: '芦巴青木瓜鱼' },
      { english: 'Stewed Cordyceps Militaris Chicken', chinese: '冬虫草花炖鸡' },
      { english: 'Stir Fried HK Kai Lan Miao', chinese: '清炒芥兰苗' },
      { english: 'Fragrant White Rice', chinese: '白米饭' },
    ],
    dinnerDishes: [
      { english: 'Double Strength Ba Zhen Black Chicken Soup', chinese: '上品八珍黑鸡汤' },
      { english: 'Pan-Fried Ikan Chuan Chuan', chinese: '娘惹煎鱼' },
      { english: 'Long Bean Egg Omelette', chinese: '长豆煎蛋' },
      { english: 'Mixed Five Grain Rice', chinese: '五谷米' },
    ],
  },
  7: {
    day: 15,
    lunchDishes: [
      {
        english: 'Herbal Bak Kut Teh Pork Rib Soup with Beancurd Skin',
        chinese: '药材肉骨茶与豆腐皮',
      },
      { english: 'Sweet & Sour Fish Top with Capsicum', chinese: '酸甜鱼与青红椒' },
      {
        english: 'Stir Fried Snow Peas with Chinese Yam and Black Fungus',
        chinese: '荷兰豆炒山药黑木耳',
      },
      { english: 'Mixed Brown Rice', chinese: '糙米饭' },
    ],
    dinnerDishes: [
      {
        english: 'Immunity Boosting Cordyceps Militaris Chicken Soup',
        chinese: '增强免疫力虫草花鸡汤',
      },
      { english: 'Braised Beancurd with Tomato Minced Meat', chinese: '番茄炒肉碎豆腐' },
      { english: 'Stir Fried Nai Bai with Scallop', chinese: '干贝炒奶白' },
      { english: 'Turmeric Fried Rice with Long Bean', chinese: '黄姜长豆炒饭' },
    ],
  },
  8: {
    day: 16,
    lunchDishes: [
      { english: 'Milk Boosting Fish and Papaya Soup', chinese: '木瓜鱼汤' },
      {
        english: 'Sesame Kampong Chicken with Egg Omelette and Ginger',
        chinese: '麻油甘榜鸡与煎鸡蛋',
      },
      { english: "Stir Fried Kai Lan with Pig's Liver", chinese: '猪肝炒本地芥兰' },
      { english: 'Mixed Five Grain Rice', chinese: '五谷饭' },
    ],
    dinnerDishes: [
      { english: 'Double Boiled Black Chicken D.O.M Soup', chinese: '法国廊酒炖黑鸡汤' },
      { english: 'Stir Fried Lean Meat with Red and Green Capsicum', chinese: '青红椒炒瘦肉' },
      {
        english: 'Stir Fried Chayote with Fishmaw and Black Mushroom',
        chinese: '佛手瓜炒鱼鳔',
      },
      { english: 'Mixed Brown Rice', chinese: '糙米饭' },
    ],
  },
  9: {
    day: 17,
    lunchDishes: [
      { english: "Pig's Trotter with Ginger, Vinegar and Egg", chinese: '猪脚醋' },
      {
        english: 'HK Style Steamed Golden Snapper in Superior Soya Sauce',
        chinese: '港式蒸鱼片',
      },
      {
        english: 'Stir Fried Amaranth Green with Crispy Silverfish',
        chinese: '苋菜与银鱼',
      },
      { english: 'Fragrant White Rice', chinese: '白米饭' },
    ],
    dinnerDishes: [
      {
        english: 'Double Boiled Lotus Root, Peanut & Dried Tangerine Peel Pork Rib Soup',
        chinese: '莲藕花生排骨汤',
      },
      { english: 'Steamed Herbal Chicken with Black Fungus', chinese: '蒸药材鸡与黑木耳' },
      { english: 'Stir Fried Garlic Pea Shoot with Wolfberry', chinese: '清炒豆苗与枸杞子' },
      { english: 'Egg Fried Rice', chinese: '蛋炒饭' },
    ],
  },
  10: {
    day: 18,
    lunchDishes: [
      { english: 'Chinese Yam Carrot Chicken Soup', chinese: '山药红萝卜鸡汤' },
      {
        english: 'Grilled Teriyaki Salmon With Shiitake Mushroom',
        chinese: '日式烤三文鱼与鲜香菇',
      },
      {
        english: 'Stir Fried French Bean with Garlic and Minced Meat',
        chinese: '肉碎炒四季豆',
      },
      { english: 'Japanese Rice', chinese: '日本米饭' },
    ],
    dinnerDishes: [
      { english: 'He Shou Wu Pork Rib Soup', chinese: '何首乌排骨汤' },
      { english: 'Red Wine Stewed Chicken', chinese: '法式红酒烩鸡' },
      {
        english: 'Braised Egg Beancurd with Fishmaw and Sweet Pea',
        chinese: '蛋豆腐与鱼鳔甜豆',
      },
      { english: 'Mixed Five Grain Rice', chinese: '五谷米' },
    ],
  },
  11: {
    day: 19,
    lunchDishes: [
      { english: 'Mind Boosting Walnut Black Bean Pork Rib Soup', chinese: '黑豆核桃排骨汤' },
      { english: 'Baked Herbal Foil Wrapped Chicken', chinese: '药材纸包鸡' },
      { english: 'Stir Fried Long Bean with Lean Meat', chinese: '长豆炒瘦肉' },
      { english: 'Egg Fried Rice', chinese: '蛋炒饭' },
    ],
    dinnerDishes: [
      { english: 'Four Herbs Snow Fungus Chicken Soup', chinese: '四物银耳鸡汤' },
      { english: 'Braised Fu Zhou Rice Wine Fish Fillet', chinese: '福州红糟鱼片' },
      {
        english: 'Stir-Fried Cauliflower with Shimeiji Mushroom, Black Fungus',
        chinese: '白菜花炒鸿喜菇，黑木耳',
      },
      { english: 'Fragrant White Rice', chinese: '白米饭' },
    ],
  },
  12: {
    day: 20,
    lunchDishes: [
      { english: 'Eucommia Bark Pork Rib Soup', chinese: '杜仲补腰排骨汤' },
      {
        english: 'Stir Fried Sheng Yu Fish Fillet with Spring Onion and Ginger',
        chinese: '青葱姜丝炒生鱼片',
      },
      { english: 'Stir Fried Sweet Peas with Sea Cucumber', chinese: '甜豆炒海参' },
      { english: 'Fragrant White Rice', chinese: '白米饭' },
    ],
    dinnerDishes: [
      { english: 'X.O Fishsoup with Shanghai Green', chinese: 'X.O 上海青鱼片汤' },
      { english: 'Steamed Royal Chicken with Ginger Garlic Sauce', chinese: '姜葱鸡' },
      { english: 'HK Chye Sim With Superior Soya Sauce', chinese: '酱油香港菜心' },
      { english: 'Wok Fried Carrot Noodle with Egg', chinese: '锅炒萝卜面与蛋' },
    ],
  },
  13: {
    day: 21,
    lunchDishes: [
      {
        english: 'Red Bean Burdock Tangerine Peel Pork Rib Soup',
        chinese: '养身牛蒡红豆橘皮排骨汤',
      },
      { english: 'Chicken Stew with Black Mushroom and Chestnut', chinese: '鸡肉炒板栗黑香菇' },
      { english: 'Stir Fried HK Kai Lan with Superior Soya Sauce', chinese: '酱油汁炒香港芥兰' },
      { english: 'Mixed Brown Rice', chinese: '糙米饭' },
    ],
    dinnerDishes: [
      { english: 'Nourishing & Beautifying Black Chicken Soup', chinese: '人参黑鸡汤' },
      { english: 'Salmon Tofu Patty', chinese: '煎三文鱼豆腐饼' },
      {
        english: 'Stir-Fried Broccoli with Hou Tou Gu and Carrot',
        chinese: '西兰花与猴头菇与红萝卜',
      },
      { english: 'Fragrant White Rice', chinese: '白米饭' },
    ],
  },
  14: {
    day: 22,
    lunchDishes: [
      {
        english: 'Collagen Fish Maw, Hou Tou Gu Pork Rib Soup',
        chinese: '胶原蛋白鱼肚猴头菇排骨汤',
      },
      {
        english: 'Sheng Yu Fillet with Herbal Chuan Xiong Sauce',
        chinese: '川穹药材炒生鱼片',
      },
      { english: 'Stir Fried Snow Peas with Lotus and Ginkgo Nut', chinese: '荷兰豆炒莲藕白果' },
      { english: 'Mixed Brown Rice', chinese: '糙米饭' },
    ],
    dinnerDishes: [
      { english: 'Nutritious Carrot and Corn Pork Rib Soup', chinese: '罗宋排骨汤' },
      {
        english: 'Braised Yellow Wine Kampong Chicken with Black Fungus',
        chinese: '黄酒鸡与黑木耳',
      },
      { english: 'HK Chye Sim with Superior Soya Sauce', chinese: '酱汁香港菜心' },
      { english: 'Wok Fried Huai Shan Noodle with Egg', chinese: '锅炒淮山鸡蛋面' },
    ],
  },
  15: {
    day: 23,
    lunchDishes: [
      { english: 'Milk Boosting Fish and Papaya Soup', chinese: '木瓜鱼汤' },
      {
        english: 'Sesame Kampong Chicken with Egg Omelette and Ginger',
        chinese: '麻油甘榜鸡与煎鸡蛋',
      },
      { english: 'Stir Fried Chayote with Black Mushroom', chinese: '香菇炒佛手瓜' },
      {
        english: "Stir Fried Rice Vermicelli with Kai Lan and Pig's Liver",
        chinese: '芥兰猪肝炒米粉',
      },
    ],
    dinnerDishes: [
      { english: 'Double Strength Ba Zhen Black Chicken Soup', chinese: '上品八珍黑鸡汤' },
      {
        english: 'Baked Barramundi Fillet with Potato and Shimeji Mushroom',
        chinese: '烤鳕鱼片,日本小菇与土豆',
      },
      { english: 'Stir Fried Lady Finger with Tumeric and Egg', chinese: '黄姜炒秋葵与蛋' },
      { english: 'Fragrant White Rice', chinese: '白米饭' },
    ],
  },
  16: {
    day: 24,
    lunchDishes: [
      { english: "Pig's Trotter with Ginger, Vinegar and Egg", chinese: '猪脚醋' },
      { english: 'Steamed Threadfin with Black Fungus and Tomato', chinese: '番茄黑木耳蒸午鱼' },
      { english: 'Sitr Fried Amarath Green with Sliver Fish', chinese: '炒苋菜与脆银鱼' },
      { english: 'Japanese Rice', chinese: '日本米饭' },
    ],
    dinnerDishes: [
      { english: 'Tea Tree Mushroom Chicken Soup', chinese: '茶树菇鸡汤' },
      { english: "Stir Fried Lean Meat with Pig's Kidney", chinese: '瘦肉炒猪腰' },
      {
        english: 'Stir Fried French Bean with Fungus and Ginkgo Nut',
        chinese: '四季豆炒木耳与白果',
      },
      { english: 'Mixed Five Grain Rice', chinese: '五谷米' },
    ],
  },
  17: {
    day: 25,
    lunchDishes: [
      { english: 'Pumpkin, Red Bean Lean Meat Soup', chinese: '金瓜红豆瘦肉汤' },
      { english: 'Three Cup Chicken with Glutinous Rice Wine', chinese: '九层叶三杯鸡' },
      { english: 'Home Made Beancurd with Minced Meat Sauce', chinese: '自制豆腐与肉碎' },
      { english: 'Fragrant White Rice', chinese: '白米饭' },
    ],
    dinnerDishes: [
      { english: 'Six Combination Nourishing Herbal Fish Soup', chinese: '六味焖鱼汤' },
      {
        english: 'Mirin Sauce Pork Belly Shabu with Shimeji Mushroom',
        chinese: '味啉日本小菇五花肉',
      },
      { english: 'Stir Fried Broccoli with Scallop', chinese: '西兰花炒干贝' },
      { english: 'Egg Fried Rice with Ginger', chinese: '姜，蛋炒饭' },
    ],
  },
  18: {
    day: 26,
    lunchDishes: [
      { english: "Pig's Stomach with Chicken Peppercorn Soup", chinese: '猪肚鸡肉胡椒汤' },
      {
        english: 'Baked Salmon Top with Ginger & Soya Sauce',
        chinese: '三文鱼搭姜丝与酱清',
      },
      { english: 'Stir Fried Shanghai Green with Egg Beancurd', chinese: '蛋豆腐炒上海青' },
      { english: 'Spinach Noodle with Egg', chinese: '菠菜面与蛋' },
    ],
    dinnerDishes: [
      {
        english: 'Cordyceps Militaris Chinese Yam Lean Meat Soup',
        chinese: '虫草山药瘦肉汤',
      },
      { english: 'Braised Chicken with Fu Zhou Rice Wine', chinese: '福州红糟鸡' },
      {
        english: 'Stir Fried Spinach with Black Fungus and Wolfberry',
        chinese: '黑木耳枸杞炒菠菜',
      },
      { english: 'Mixed Brown Rice', chinese: '糙米饭' },
    ],
  },
  19: {
    day: 27,
    lunchDishes: [
      { english: 'Ginseng Barramundi Fillet Soup', chinese: '人参鱼片汤' },
      { english: 'Mei Kuei Lu Chicken with Tau Kwa', chinese: '玫瑰露小鸡翅豆干' },
      { english: 'Luo Han Vegetables', chinese: '罗汉斋' },
      { english: 'Fragrant White Rice', chinese: '白米饭' },
    ],
    dinnerDishes: [
      { english: 'Huang Qi Dang Shen Chicken Soup', chinese: '黄芪党参鸡汤' },
      {
        english: 'HK Style Steamed Snapper in Superior Soya Sauce',
        chinese: '港式蒸鱼片',
      },
      {
        english: 'Braised Tofu with Enoki Mushroom, Snow Pea and Fish Maw',
        chinese: '焖豆腐,金针菇,甜豆与鱼鳔',
      },
      { english: 'Egg Fried Rice with Ginger', chinese: '姜炒蛋饭' },
    ],
  },
  20: {
    day: 28,
    lunchDishes: [
      { english: 'Amaranth Green with X.O Fish Fillet Soup', chinese: '苋菜X.O鱼片汤' },
      { english: 'Nonya Braised Chicken with Potato and Black Mushroom', chinese: '娘惹豆酱鸡' },
      { english: 'Spinach Mushroom Tomato Omelette', chinese: '菠菜香菇番茄煎蛋' },
      { english: 'Mixed Five Grain Rice', chinese: '五谷米' },
    ],
    dinnerDishes: [
      {
        english: 'Lotus Root, Peanut Dried Tangerine Peel Pork Rib Soup',
        chinese: '莲偶花生陈皮排骨汤',
      },
      { english: 'Sweet & Sour Fish Fillet with Capsicum', chinese: '青红椒酸甜鱼' },
      {
        english: 'Stir Fried Garlic Peas Shoot with Garlic and Wolfberry',
        chinese: '清炒豆苗与枸杞',
      },
      { english: 'Fragrant White Rice', chinese: '白米饭' },
    ],
  },
};

export const recoveryMenuPool: MenuPool = {
  0: {
    day: 1,
    lunchDishes: [
      { english: 'Lemongrass Pork Rib Soup (Wind Dispelling)', chinese: '祛风香茅排骨汤' },
      { english: 'Sheng Yu Fillet with Spring Onion and Ginger', chinese: '葱姜炒生鱼片' },
      {
        english: 'Stir Fried Snow Peas with Chinese Yam and Black Fungus',
        chinese: '山药黑木耳炒荷兰豆',
      },
      { english: 'Mixed Brown Rice', chinese: '糙米饭' },
    ],
    dinnerDishes: [
      { english: 'Herbal Si Shen Chicken Soup', chinese: '四神鸡汤' },
      {
        english: 'Stir-Fried Lean Meat with Black Fungus, Dried Lily Flower and D.O.M',
        chinese: '黑木耳百合干炒瘦肉',
      },
      { english: 'Stir Fried Nai Bai with Hou Tou Gu & Wolfberries', chinese: '猴头菇炒奶白枸杞' },
      { english: 'Mixed Five Grain Rice', chinese: '五谷米' },
    ],
  },
  1: {
    day: 2,
    lunchDishes: [
      { english: 'Milk Boosting Fish and Papaya Soup', chinese: '木瓜鱼汤' },
      {
        english: 'Sesame Kampong Chicken with Omelette and Ginger',
        chinese: '麻油甘榜鸡与煎鸡蛋和姜',
      },
      { english: "Stir Fried Kai Lan with Pig's Liver and Wolfberry", chinese: '猪肝炒本地芥蓝' },
      { english: 'Fragrant White Rice', chinese: '白米饭' },
    ],
    dinnerDishes: [
      {
        english: 'Immunity Boosting Cordyceps Militaris Chicken Soup',
        chinese: '增强免疫力虫草花鸡汤',
      },
      { english: 'Braised Pork Rib with Tofu & Shimeji Mushroom', chinese: '豆腐焖排骨,日本菇' },
      {
        english: 'Stir Fried Hairy Gourd with Tang Hoon & Sliced Mushroom',
        chinese: '冬粉蘑菇片炒毛瓜',
      },
      { english: 'Stir Fried Pumpkin Noodle with Egg', chinese: '鸡蛋炒南瓜面' },
    ],
  },
  2: {
    day: 3,
    lunchDishes: [
      {
        english: 'Double Boiled Lotus Peanut & Dried Tangerine Peel Pork Rib Soup',
        chinese: '莲藕花生陈皮炖排骨汤',
      },
      {
        english: 'Steamed Threadfin With Black Fungus and Tomato',
        chinese: '番茄黑木耳姜片蒸鱼片',
      },
      { english: 'Stir Fried Broccoli with Sea Cucumber', chinese: '海参炒西兰花' },
      { english: 'Flavour Turmeric Fried Rice with Long Bean', chinese: '黄姜长豆炒饭' },
    ],
    dinnerDishes: [
      { english: 'Pig Stomach with Ginkgo Nut Peppercorn Soup', chinese: '白果猪肚汤' },
      { english: 'Steamed Royal Chicken With Ginger Garlic Sauce', chinese: '姜蒜酱蒸宫廷鸡腿' },
      { english: 'Stir Fried Mushroom Deluxe', chinese: '炒杂菇' },
      { english: 'Mixed Brown Rice', chinese: '糙米饭' },
    ],
  },
  3: {
    day: 4,
    lunchDishes: [
      { english: 'Lemongrass Chicken Soup (Wind Dispelling)', chinese: '祛风香茅鸡汤' },
      { english: 'Pan Seared Salmon with Teriyaki Mirin Sauce', chinese: '香煎三文鱼配照烧味醂酱' },
      { english: 'Stir Fried French Bean with Shiitake Mushroom', chinese: '香菇炒四季豆' },
      { english: 'Japanese Rice', chinese: '日本米饭' },
    ],
    dinnerDishes: [
      {
        english: 'Collagen Fishmaw & Hou Tou Gu Pork Rib Soup',
        chinese: '胶原蛋白鱼肚猴头菇排骨汤',
      },
      {
        english: 'Pan Fried Minced Meat Chinese Yam Tofu Patty',
        chinese: '香煎山药肉茸豆腐饼',
      },
      { english: 'Roasted Pumpkin with Capsicum and Olive Oil', chinese: '烤南瓜与青红椒橄榄油' },
      { english: 'Fragrant White Rice', chinese: '白米饭' },
    ],
  },
  4: {
    day: 5,
    lunchDishes: [
      { english: 'Mind Boosting Walnut Black Bean Pork Rib Soup', chinese: '黑豆核桃排骨汤' },
      {
        english: 'HK Style Steamed Golden Snapper in Superior Soya Sauce',
        chinese: '港式蒸鱼片',
      },
      { english: 'Stir Fried Shanghai Green with Egg Beancurd', chinese: '炒上海青与豆腐蛋' },
      { english: 'Egg Fried Rice', chinese: '蛋炒饭' },
    ],
    dinnerDishes: [
      { english: 'Spinach Pig Liver Tofu Soup', chinese: '菠菜猪肝豆腐汤' },
      { english: 'Baked Herbal Foil Wrapped Chicken', chinese: '药材纸包鸡' },
      { english: 'Sweet and Sour Fish Top With Capsicum', chinese: '酸甜鱼柳与红青椒' },
      { english: 'Fragrant White Rice', chinese: '白米饭' },
    ],
  },
  5: {
    day: 6,
    lunchDishes: [
      { english: 'Six Combination Nourishing Herbal Fish Soup', chinese: '六味润肤鱼汤' },
      { english: 'Mei Kuei Lu Chicken With Egg', chinese: '炖玫瑰露鸡与蛋' },
      {
        english: 'HK Style Chye Sim with Shredded Ginger and Wolfberry',
        chinese: '香港菜心与姜丝枸杞',
      },
      { english: 'Spinach Noodle with Garlic & Egg', chinese: '蒜蓉蛋菠菜面' },
    ],
    dinnerDishes: [
      { english: 'White Fungus Red Carrot Chicken Soup', chinese: '白木耳红罗卜鸡汤' },
      {
        english: 'Mirin Sauce Pork Belly Shabu with Shimeiji Mushroom',
        chinese: '味醂日本小菇与五花肉',
      },
      {
        english: 'Stir Fried Sweet Peas top with Mock Kidney, Black Fungus and Wolfberries',
        chinese: '甜豆炒斋腰枸杞',
      },
      { english: 'Fragrant White Rice', chinese: '白米饭' },
    ],
  },
  6: {
    day: 7,
    lunchDishes: [
      {
        english: 'Red Bean, Burdock Tangerine Peel Pork Rib Soup',
        chinese: '养身牛蒡红豆橘皮排骨汤',
      },
      {
        english: 'Steamed Chawanmushi with Ginkgo Nut and Shittake Mushroom',
        chinese: '茶碗蒸与白果香菇片',
      },
      { english: 'Nonya Braised Chicken with Potato and Black Mushroom', chinese: '娘惹豆酱鸡' },
      { english: 'Fragrant White Rice', chinese: '白米饭' },
    ],
    dinnerDishes: [
      { english: 'Tea Tree Mushroom Chicken Soup', chinese: '茶树菇鸡汤' },
      { english: 'Salmon Tofu Patty', chinese: '煎三文鱼豆腐饼' },
      { english: 'Stir Fried Garlic Pea Shoot with Wolfberry', chinese: '清炒豆苗与枸杞' },
      { english: 'Mixed Five Grain Rice', chinese: '五谷米' },
    ],
  },
};

export type ProductBundle = {
  id: string;
  name: string;
  price: number;
  description?: string;
  notes?: string[];
  /**
   * Business Central item number for this bundle (e.g. 'CFM-BND-001').
   * When set, `getProductCatalog` overlays the live BC unit price and drops the
   * bundle if BC marks the item as blocked. Leave undefined to keep the static price.
   */
  bcNumber?: string;
};

export type PackageOption = {
  id: string;
  label: string;
  durationDays: number;
  price: number;
  /**
   * Business Central item number for this package option (e.g. 'CFM-PCP-001').
   * When set, `getProductCatalog` overlays the live BC unit price and hides the
   * option if BC marks the item as blocked. Leave undefined to keep using the
   * static `price` above.
   */
  bcNumber?: string;
  bundles?: ProductBundle[];
};

export type PackageCategory = {
  id: string;
  name: string;
  description: string;
  image: string;
  note?: string;
  options: PackageOption[];
};

export type AddOnOption = {
  id: string;
  label: string;
  qty: number;
  price: number;
  /**
   * Business Central item number for this add-on serving (e.g. 'CFM-ADN-001').
   * When set, `getProductCatalog` overlays the live BC unit price and hides the
   * option if BC marks the item as blocked. Leave undefined to keep the static price.
   */
  bcNumber?: string;
};

export type AddOnGroup = {
  id: string;
  name: string;
  description: string;
  image: string;
  type: 'single' | 'multi';
  options: AddOnOption[];
};

export type PromoCode = {
  code: string;
  type: 'amount' | 'percent';
  value: number;
  minSubtotal?: number;
  description: string;
  conditions?: string[];
  /**
   * When true, this code is applied automatically for eligible selections
   * (see `conditions`) instead of requiring the customer to type it in.
   */
  autoApply?: boolean;
  /**
   * When true, auto-apply skips the "wait for delivery.phone" gate and
   * validates as soon as the selection qualifies. Only safe for codes with
   * no per-phone/email redemption limit — otherwise the discount can flash
   * "applied" before the phone-aware check has actually run.
   */
  autoApplyImmediately?: boolean;
};

export type SpecialRequestOption = {
  id: string;
  label: string;
};

export type ProductCatalog = {
  packageCategories: PackageCategory[];
  addOnGroups: AddOnGroup[];
  specialRequestOptions: SpecialRequestOption[];
  promoCodes: PromoCode[];
};

export const packageCategories: PackageCategory[] = [
  {
    id: 'dual-meal',
    name: 'Dual Meal',
    description: 'Lunch And Dinner',
    image: '/menu/HakkaYellowWineChickenwithBlackFungus_360x.webp',
    note: 'Best fit for mums who want both daily meals fully covered.',
    options: [
      {
        id: 'dual-28',
        label: '28 Days',
        durationDays: 28,
        price: 1828,
        bcNumber: 'CFM-PCP-001',
        bundles: [
          {
            id: 'bundle-bmb-28',
            name: 'BMB Massage Package',
            price: 1440.6,
            bcNumber: 'CFM-BND-001',
            description: 'Postnatal Massage Benefits:',
            notes: [
              'Relieve neck and shoulder pain from carrying and breastfeeding baby',
              'Help to restore the uterus to its original state',
              'Help to eliminate excess body fluids and reduce fluid retention',
              'Help in weight loss',
              'Increase blood circulation',
            ],
          },
        ],
      },
      {
        id: 'dual-21',
        label: '21 Days',
        durationDays: 21,
        price: 1378,
        bcNumber: 'CFM-PCP-003',
      },
      {
        id: 'dual-14',
        label: '14 Days',
        durationDays: 14,
        price: 988,
        bcNumber: 'CFM-PCP-005',
      },
      { id: 'dual-7', label: '7 Days', durationDays: 7, price: 528, bcNumber: 'CFM-PCP-007' },
    ],
  },
  {
    id: 'single-meal',
    name: 'Single Meal',
    description: 'Lunch Or Dinner',
    image: '/menu/Pigs_Trotter_with_Ginger_Vinegar_and_Egg.webp',
    note: 'Useful for families who want daily support with a smaller commitment.',
    options: [
      { id: 'single-28', label: '28 Days', durationDays: 28, price: 988, bcNumber: 'CFM-PCP-002' },
      { id: 'single-21', label: '21 Days', durationDays: 21, price: 738, bcNumber: 'CFM-PCP-004' },
      { id: 'single-14', label: '14 Days', durationDays: 14, price: 528, bcNumber: 'CFM-PCP-006' },
    ],
  },
  {
    id: 'trial-meal',
    name: 'Trial Meal',
    description: 'Lunch Or Dinner',
    image: '/menu/product-2.webp',
    note: 'Best for families who want to test the menu and delivery process first.',
    options: [
      {
        id: 'trial-1',
        label: '1 Day Trial',
        durationDays: 1,
        price: 38,
        bcNumber: 'CFM-PCP-008',
        bundles: [
          {
            id: 'bundle-mq-staycay',
            name: 'MQ StayCay Bundle',
            price: 361,
            bcNumber: 'CFM-BND-002',
          },
        ],
      },
    ],
  },
];

export const addOnGroups: AddOnGroup[] = [
  {
    id: 'pig-trotter',
    name: "Pig's Trotter with Ginger and Vinegar",
    description: 'A traditional dish made with pork trotters, vinegar, and spices.',
    image: '/addons/Addon_PigTrotter.webp',
    type: 'multi',
    options: [
      { id: 'pig-trotter-1', label: '1 serving', qty: 1, price: 12, bcNumber: 'CFM-ADN-001' },
      { id: 'pig-trotter-3', label: '3 servings', qty: 3, price: 35, bcNumber: 'CFM-ADN-002' },
      { id: 'pig-trotter-5', label: '5 servings', qty: 5, price: 55, bcNumber: 'CFM-ADN-003' },
    ],
  },
  {
    id: 'papaya-fish',
    name: 'Milk Boosting Fish and Papaya Soup',
    description:
      'A nutritious soup made with fish and papaya, known for its milk-boosting properties.',
    image: '/addons/Addon_PapayaFishSoup.webp',
    type: 'multi',
    options: [
      { id: 'papaya-fish-1', label: '1 serving', qty: 1, price: 7, bcNumber: 'CFM-ADN-004' },
      { id: 'papaya-fish-3', label: '3 servings', qty: 3, price: 20, bcNumber: 'CFM-ADN-005' },
      { id: 'papaya-fish-5', label: '5 servings', qty: 5, price: 32, bcNumber: 'CFM-ADN-006' },
    ],
  },
  {
    id: 'homemade-birds-nest',
    name: "Homemade Bird's Nest",
    description: "A delicate dessert made from bird's nest, known for its health benefits.",
    image: '/addons/Addon_BirdNest.webp',
    type: 'multi',
    options: [
      { id: 'birds-nest-1', label: '1 serving', qty: 1, price: 15, bcNumber: 'CFM-ADN-007' },
      { id: 'birds-nest-3', label: '3 servings', qty: 3, price: 42, bcNumber: 'CFM-ADN-008' },
      { id: 'birds-nest-5', label: '5 servings', qty: 5, price: 66, bcNumber: 'CFM-ADN-009' },
    ],
  },
  {
    id: 'comforting-set',
    name: 'Comforting Set',
    description:
      "All 3 Combo: Pig's Trotter, Milk Booting Fish & Papaya Soup and Homemade Bird's Nest.",
    image: '/addons/Addon_ComfortingSet.webp',
    type: 'single',
    options: [{ id: 'comforting-set-3', label: '3 servings', qty: 3, price: 32, bcNumber: 'CFM-ADN-010' }],
  },
  {
    id: 'thermal-flask',
    name: 'Thermal Flask',
    description: '600ml Stainless Steel Thermal Flask.',
    image: '/addons/Addon_ThermalWare.webp',
    type: 'single',
    options: [{ id: 'thermal-flask-1', label: '1 unit', qty: 1, price: 10, bcNumber: 'CFM-ADN-011' }],
  },
  {
    id: 'solaris-uv-sterilizer',
    name: 'Solaris UV Sterilizer',
    description: 'UV sterilizer for baby bottles, pacifiers, and accessories.',
    image: '/addons/Solaris.jpg',
    type: 'single',
    options: [{ id: 'solaris-uv-sterilizer-1', label: '1 unit', qty: 1, price: 299, bcNumber: 'CFM-PPD-001' }],
  },
];

export const specialRequestOptions: SpecialRequestOption[] = [
  { id: 'no-pork-innards', label: 'No Pork Innards' },
  { id: 'no-pig-trotter', label: "No Pig's Trotter" },
  { id: 'no-papaya-fish', label: 'No Papaya Fish Soup' },
  { id: 'no-salmon', label: 'No Salmon' },
  { id: 'less-sugar-tea', label: 'Less Sugar in Red Dates Tea' },
];

export const promoCodes: PromoCode[] = [
  {
    code: 'EB5OFF',
    type: 'percent',
    value: 5,
    minSubtotal: 500,
    description: 'Early Bird Special 5% Off for selected packages only',
    conditions: ['dual-28', 'dual-21', 'dual-14', 'single-28'],
    autoApply: true,
    autoApplyImmediately: true,
  },
];

export const defaultProductCatalog: ProductCatalog = {
  packageCategories,
  addOnGroups,
  specialRequestOptions,
  promoCodes,
};

export const importantNotes = {
  deliveryWindows: ['Lunch: 10:00AM to 1:00PM', 'Dinner: 4:00PM to 7:00PM'],
  leadTime: [
    "Weekday activations generally require 1 working day's notice before 2PM.",
    "Weekend activations generally require 2 working days' notice before 2PM.",
  ],
  holidayExceptions: ['Christmas Day', 'Eve, 1st and 2nd Day of Chinese New Year'],
};

export type FaqQuestion = {
  id: string;
  value: string;
  heading: string;
  detail?: string;
  detailLink?: {
    label: string;
    href: string;
  };
};

export type FaqCategory = {
  id: number;
  category: string;
  questions: FaqQuestion[];
};

export const faqCategories: FaqCategory[] = [
  {
    id: 1,
    category: 'Confinement Meals',
    questions: [
      {
        id: 'cm-1',
        value: 'panel-cm-1',
        heading: 'What is Confinement food?',
        detail:
          "The emphasis of confinement food is to ensure that mothers gain the essential nutrients during their postnatal recovery. Consuming the right food cooked in the right manner would help revitalize your body's immune system, expel 'wind' from the body, strengthen your joints and support healthy lactation and improve blood circulation.\n\nAt Chilli Padi, we seek not just to maintain the Chinese confinement food tradition but also to innovate and create fusion dishes to satisfy the taste buds of modern mummies!",
      },
      {
        id: 'cm-2',
        value: 'panel-cm-2',
        heading: 'Are your confinement meals Halal?',
        detail: 'Apologies, our confinement meals are not halal.',
      },
      {
        id: 'cm-3',
        value: 'panel-cm-3',
        heading: 'How long is the Confinement period and are the dishes different each week?',
        detail:
          "A typical confinement period would last 4 weeks and our meals are designed to cater to your dietary requirements through this period.\n\nRecovery Stage Day 1 - 7 confinement meals' purpose is to expel the 'wind' in the body and also has detoxification effect especially to drive out the stale blood from the body.\n\nNourish Stage Day 8 - 28 confinement meals are to replenish your 'Qi', regulate and balance the bodily functions as well as boost the immune system for postnatal recovery.",
      },
      {
        id: 'cm-4',
        value: 'panel-cm-4',
        heading:
          'I intend to breastfeed my child, does your food promote lactation and how it benefits me?',
        detail:
          "We have incorporated ingredients that promote lactation into our confinement menu such as green papaya, spinach and salmon.\n\nGreen papaya is popular as a galactagogue as it increases the production of oxytocin hormones which helps regulate the production of milk and is also rich in vitamins. It is a must-have super food for lactating moms.\n\nAs for spinach, it is rich in iron and is effective in replenishing your iron levels. Studies have shown that low iron levels are associated with low milk supply. Hence, our confinement meals are deftly crafted to replenish your nutrients and to balance your body.\n\nFish such as salmon are a great source of Omega-3 (DHA) which is vital for healthy brain development and function in babies. While breastfeeding, the mummy's own supply of Omega-3 will diminish, hence this ensures mummies will get their intake of Omega-3.",
      },
      {
        id: 'cm-5',
        value: 'panel-cm-5',
        heading: 'What should I avoid?',
        detail:
          "Post-partum meals place emphasis on keeping the body warm. Traditional beliefs are that post-partum mothers should avoid cooling foods, such as melons and shellfish in general.\n\nIt is advisable to consume dishes which have wine, old ginger and sesame oil as these help 'heat' the body.\n\nThese ingredients have been incorporated into the dishes we provide for our confinement meals.",
      },
      {
        id: 'cm-6',
        value: 'panel-cm-6',
        heading: 'Does ginger cause jaundice in babies?',
        detail:
          'There has been no evidence that ginger consumed by breastfeeding mothers would cause a baby to be jaundiced. Ginger can be taken during confinement and breastfeeding.',
      },
      {
        id: 'cm-7',
        value: 'panel-cm-7',
        heading:
          'How important is it to incorporate soups into the diet of mothers going through Confinement?',
        detail:
          'Most soups provided with our meals are double boiled. The double boiling technique is a slow and gentle process which better extracts the flavour, essence and nutrients of the ingredients and offers maximum benefit to post-partum mums for their recovery.\n\nFish and Papaya Soup are also incorporated into the confinement meals we provide, and are beneficial for mummies who intend to breastfeed.',
      },
    ],
  },
  {
    id: 2,
    category: 'Service Fulfillment',
    questions: [
      {
        id: 'sf-1',
        value: 'panel-sf-1',
        heading: 'What time is the Confinement Meal Delivery?',
        detail:
          'Our Confinement Food Delivery Timing is:\n\nLunch: Between 10.00AM to 1.00PM\nDinner: Between 4.00PM to 7.00PM\n\nThere is no confinement meal delivery on Christmas Day, CNY Eve, CNY Day 1 and Day 2. Meals would be replaced.\n\nWe are unable to guarantee meal delivery at a specific timing as many factors are to be considered such as traffic and weather conditions.',
      },
      {
        id: 'sf-2',
        value: 'panel-sf-2',
        heading: 'Where do we deliver?',
        detail:
          'We deliver island wide (strictly to residential address only regardless of trial meal or package meal) except Tuas areas.\n\nFor delivery to Sentosa, additional $20 per trip.',
      },
      {
        id: 'sf-3',
        value: 'panel-sf-3',
        heading: 'How will Chilli Padi Confinement Meal be delivered?',
        detail:
          'Our meals are served using thermal containers (High Quality Tingkat).\n\nFor trial meal and the very last meal of the package, microwavable containers will be used for the meal delivery.',
      },
      {
        id: 'sf-4',
        value: 'panel-sf-4',
        heading: 'As my due date is only an estimate. What if I deliver much earlier or later?',
        detail:
          'Once your booking is confirmed, we will deliver the meal upon request even if it is earlier or later. All you would have to do is to inform us 1 working day in advance before 2:00PM (for delivery on weekdays) or 2 working days in advance before 2:00PM (for delivery on weekends and PH) for your confinement meal delivery to commence.',
      },
      {
        id: 'sf-5',
        value: 'panel-sf-5',
        heading: 'I do not take certain ingredients; can I request to remove or replace the dish?',
        detail:
          'This will be subjected to availability. Do inform us on the ingredients or dishes that you do not consume, we will try our best to accommodate your request.\n\nAs to what the dish will be replaced with, it will be decided by our Chef on the day itself and we will not be able to provide a menu for this.',
      },
      {
        id: 'sf-6',
        value: 'panel-sf-6',
        heading: 'Can I upgrade my package?',
        detail:
          'Customers may upgrade their package by informing us 3 working days in advance by 2:00PM, before the last day of the package.\n\nCustomers would have to top up the difference in package price and payment can be done by bank transfer.',
      },
      {
        id: 'sf-7',
        value: 'panel-sf-7',
        heading: 'How do I commence or postpone my meals?',
        detail:
          'Customer may call us at 6914 9900, email us (confinement@chillipadi.com.sg) or chat with us on Messenger.\n\nCommencing meal deliveries:\n- Customers would have to inform us 1 working day in advance before 2:00PM (for delivery on weekdays) or 2 working days in advance before 2:00PM (for delivery on weekends and PH) for the commencement of your confinement delivery.\n- Remainder payment of package would have to be made by the 3rd day of meal delivery, failing which Chilli Padi Confinement reserves the right to terminate the service.\n\nMeal postponement:\n- Customers would have to inform us 1 working day in advance before 2:00PM (for delivery on weekdays) or 2 working days in advance before 2:00PM (for delivery on weekends and PH). The meal will be replaced.\n- In the event that the meal has to be cancelled without sufficient notice provided, there will be no meal replacements and refunds.',
      },
      {
        id: 'sf-8',
        value: 'panel-sf-8',
        heading: 'Can I change my delivery address?',
        detail:
          'Yes you may. Customers would have to inform us 1 working day in advance before 2:00PM (for delivery on weekdays) or 2 working days in advance before 2:00PM (for delivery on weekends and PH) in order for us to make the necessary arrangements.',
      },
    ],
  },
  {
    id: 3,
    category: 'Cancellation & Refunds',
    questions: [
      {
        id: 'cr-1',
        value: 'panel-cr-1',
        heading: 'What is your cancellation and refund policy?',
        detail:
          "Cancellation of service:\n- Cancellation requests for purchased packages are generally not permitted and will only be considered in exceptional circumstances, strictly on a case-by-case basis.\n- Once a package is cancelled, it cannot be reinstated.\n\nRefunds:\n- Refunds for purchased packages are strictly not offered. In exceptional cases, a refund may be granted at management's sole discretion, assessed on a case-by-case basis.",
      },
    ],
  },
  {
    id: 4,
    category: 'Add-Ons',
    questions: [
      {
        id: 'ao-1',
        value: 'panel-ao-1',
        heading: 'Add-Ons Products',
        detail:
          'Add-Ons are only available with the purchase of any confinement meal packages. They are not available for ala carte orders.',
      },
    ],
  },
  {
    id: 5,
    category: 'BMB Postnatal Massage Services',
    questions: [
      {
        id: 'bmb-1',
        value: 'panel-bmb-1',
        heading: 'When should I begin Postnatal Massages?',
        detail:
          'For natural delivery, massage sessions will begin after 7 days.\n\nFor caesarean section (C-section), BMB recommend beginning sessions after 3 weeks or with the recommendation of your gynae. Before then, mummies can still be massaged on other parts of their body to soothe body aches and also relieve water retention without disturbing the fresh wound on the tummy.',
      },
      {
        id: 'bmb-2',
        value: 'panel-bmb-2',
        heading: 'How do I start my massage sessions?',
        detail:
          'Upon ordering the bundle package through the Chilli Padi Confinement website, BMB will reach out to you to arrange your postnatal massage sessions.',
      },
      {
        id: 'bmb-3',
        value: 'panel-bmb-3',
        heading: 'Are products used in massages and facials safe for pregnant mums?',
        detail: 'All products used are safe for pregnant mums.',
      },
      {
        id: 'bmb-4',
        value: 'panel-bmb-4',
        heading: 'Can I change my therapist mid-treatment?',
        detail:
          'A change of therapist can be fulfilled upon request, at no additional cost. If you encounter issues, please contact BMB at 6235 0688 or email them at enquiry@beautymumsbabies.com.',
      },
      {
        id: 'bmb-5',
        value: 'panel-bmb-5',
        heading: 'How do I cancel my session?',
        detail:
          'All cancellations must be communicated to BMB 3 hours in advance, otherwise 1 session may be chargeable.',
      },
      {
        id: 'bmb-6',
        value: 'panel-bmb-6',
        heading: 'What is your cancellation / refund policy?',
        detail: 'For the full T&C, please refer to the official terms and conditions.',
        detailLink: {
          label: 'View full T&C',
          href: 'https://beautymumsbabies.com/terms-and-conditions/',
        },
      },
    ],
  },
];

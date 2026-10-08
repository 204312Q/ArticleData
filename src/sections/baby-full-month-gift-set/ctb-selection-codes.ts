// Translates this catalog's internal choice/option ids into the fixed group
// and value codes CT Backend's option groups actually use (confirmed against
// its live DB — see the 7 option groups and their per-giftbox required-groups
// list). CT Backend only recognizes these exact codes; sending our own
// internal ids/labels (e.g. "angKuKuehShape"/"pointed") would go unrecognized.

// choice.id -> CT Backend option group code
export const CHOICE_ID_TO_BC_GROUP: Record<string, string> = {
  card: 'CARDMSG',
  angKuKuehShape: 'ANGKUSHAPE',
  angKuKuehType: 'ANGKUCHOICE',
  choiceOfTreat: 'TREATC_6',
  choiceOf1stTreat: 'TREATA_2',
  choiceOf2ndTreat: 'TREATB_41',
  choiceOf3rdTreat: 'TREATB_42',
};

// option.id -> CT Backend value code (globally unique across every choice, so
// one flat map is safe — no two choices share an option id).
export const OPTION_ID_TO_BC_VALUE: Record<string, string> = {
  pointed: 'POINTED',
  round: 'ROUND',
  'gold-dust': 'GOLD',
  'gold-dust-charcoal': 'CHARCOAL',
  'its-a-girl': 'GIRL',
  'its-a-boy': 'BOY',
  'hello-baby': 'HELLO',
  personalised: 'PERSONALISED',
  'kueh-salat': 'KSALAT',
  'rainbow-lapis': 'RLAPIS',
  'pandan-swiss-roll': 'PSROLL',
  'dark-cherry-red-velvet': 'RVCAKE',
  'fruit-cake': 'FCAKE',
  'walnut-cake': 'WCAKE',
};

// The one BC group whose value can be "PERSONALISED" — when it is, the
// customer's actual typed message travels in a sibling `${group}_TEXT` key
// (e.g. CARDMSG_TEXT) alongside the code, since CARDMSG itself is a fixed
// enum with no room for free text.
export const PERSONALISED_OPTION_ID = 'personalised';

export type ChoiceSelectionEntry = {
  choiceId: string;
  optionId: string;
  displayValue: string;
};

// Translates a cart line's resolved choices into the exact
// group-code/value-code pairs CT Backend expects, e.g.
// { CARDMSG: "PERSONALISED", CARDMSG_TEXT: "Welcome, Baby Emma!" }.
// A choice/option id with no known BC mapping is skipped rather than sent
// verbatim, since an unrecognized code would be worse than a missing one.
export function buildCtbSelections(
  entries: ChoiceSelectionEntry[]
): Record<string, string> | undefined {
  const result = Object.fromEntries(
    entries.flatMap(({ choiceId, optionId, displayValue }) => {
      const group = CHOICE_ID_TO_BC_GROUP[choiceId];
      const value = OPTION_ID_TO_BC_VALUE[optionId];
      if (!group || !value) return [];

      return optionId === PERSONALISED_OPTION_ID
        ? [[group, value], [`${group}_TEXT`, displayValue]]
        : [[group, value]];
    })
  );

  return Object.keys(result).length > 0 ? result : undefined;
}

import { it, expect, describe } from 'vitest';

import { buildCtbSelections } from './ctb-selection-codes';

describe('buildCtbSelections', () => {
  it('translates a shape choice into its BC group/value codes', () => {
    expect(
      buildCtbSelections([
        { choiceId: 'angKuKuehShape', optionId: 'pointed', displayValue: 'Pointed — Ang Ku Kueh' },
      ])
    ).toEqual({ ANGKUSHAPE: 'POINTED' });
  });

  it('does not mix up the two similarly-named ang ku kueh type options', () => {
    expect(
      buildCtbSelections([{ choiceId: 'angKuKuehType', optionId: 'gold-dust', displayValue: 'Gold Dust Ang Ku Kueh' }])
    ).toEqual({ ANGKUCHOICE: 'GOLD' });

    expect(
      buildCtbSelections([
        {
          choiceId: 'angKuKuehType',
          optionId: 'gold-dust-charcoal',
          displayValue: 'Gold Dust Charcoal Ang Ku Kueh',
        },
      ])
    ).toEqual({ ANGKUCHOICE: 'CHARCOAL' });
  });

  it('adds a sibling _TEXT key with the free-text message for a personalised card', () => {
    expect(
      buildCtbSelections([
        { choiceId: 'card', optionId: 'personalised', displayValue: 'Welcome, Baby Emma!' },
      ])
    ).toEqual({ CARDMSG: 'PERSONALISED', CARDMSG_TEXT: 'Welcome, Baby Emma!' });
  });

  it('does not add a _TEXT key for a non-personalised card message', () => {
    expect(buildCtbSelections([{ choiceId: 'card', optionId: 'its-a-girl', displayValue: "It's a Girl" }])).toEqual({
      CARDMSG: 'GIRL',
    });
  });

  it('combines multiple choices for a fully-loaded item like Miracle (2 Tier Tingkat Set)', () => {
    expect(
      buildCtbSelections([
        { choiceId: 'angKuKuehType', optionId: 'gold-dust', displayValue: 'Gold Dust Ang Ku Kueh' },
        { choiceId: 'angKuKuehShape', optionId: 'round', displayValue: 'Round — Ang Ku Kueh' },
        { choiceId: 'card', optionId: 'its-a-boy', displayValue: "It's a Boy" },
        { choiceId: 'choiceOfTreat', optionId: 'kueh-salat', displayValue: 'Handcrafted Round Kueh Salat (4 inch)' },
      ])
    ).toEqual({
      ANGKUCHOICE: 'GOLD',
      ANGKUSHAPE: 'ROUND',
      CARDMSG: 'BOY',
      TREATC_6: 'KSALAT',
    });
  });

  it("covers every one of Delight's three distinct treat picks under their own group codes", () => {
    expect(
      buildCtbSelections([
        { choiceId: 'choiceOf1stTreat', optionId: 'rainbow-lapis', displayValue: 'Handcrafted Rainbow Lapis (4 inch)' },
        { choiceId: 'choiceOf2ndTreat', optionId: 'fruit-cake', displayValue: 'Fruit Cake' },
        { choiceId: 'choiceOf3rdTreat', optionId: 'walnut-cake', displayValue: 'Walnut Cake' },
      ])
    ).toEqual({
      TREATA_2: 'RLAPIS',
      TREATB_41: 'FCAKE',
      TREATB_42: 'WCAKE',
    });
  });

  it('returns undefined for an empty entry list', () => {
    expect(buildCtbSelections([])).toBeUndefined();
  });

  it('skips an entry whose choice/option id has no known BC mapping, rather than sending it verbatim', () => {
    expect(buildCtbSelections([{ choiceId: 'size', optionId: 'medium', displayValue: 'M' }])).toBeUndefined();
  });

  it('drops only the unmapped entries, keeping the ones that do map', () => {
    expect(
      buildCtbSelections([
        { choiceId: 'card', optionId: 'hello-baby', displayValue: 'Hello Baby' },
        { choiceId: 'size', optionId: 'medium', displayValue: 'M' },
      ])
    ).toEqual({ CARDMSG: 'HELLO' });
  });
});

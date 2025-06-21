import { ProbabilisticDeck } from '../util';

// Test suite for ProbabilisticDeck class
// Tests initialization, selection, millicards handling, and scoring
describe('ProbabilisticDeck', () => {
  type TestVariant = [number, number];
  let variants: { variant: TestVariant; millicards: number }[];
  let maxScorePerVariant: number;
  let deck: ProbabilisticDeck<TestVariant>;

  beforeEach(() => {
    variants = [
      { variant: [1, 0], millicards: 1000 },
      { variant: [0, 0], millicards: 1000 },
      { variant: [1, 1], millicards: 1000 }
    ];
    maxScorePerVariant = 1000;
    deck = new ProbabilisticDeck(variants, maxScorePerVariant);
  });

  // Tests for proper initialization of variants with millicards
  test('should initialize correctly', () => {
    expect(deck.variants).toEqual(variants);
    expect(deck.variantsMap.size).toBe(variants.length);

    variants.forEach(variant => {
      const data = deck.variantsMap.get(variant.variant);
      expect(data).toBeDefined();
      expect(data!.maxMillicards).toBe(variant.millicards);
      expect(data!.millicards).toBe(variant.millicards);
    });
  });

  test('pickVariant should return a valid variant', () => {
    const picked = deck.pickVariant();
    expect(variants.map(v => v.variant)).toContainEqual(picked);
  });

  test('remaining should calculate correct remaining millicards', () => {
    const variant = variants[0].variant;
    expect(deck.remaining(variant)).toBe(1000);

    deck.markSuccess(variant);
    expect(deck.remaining(variant)).toBe(0);

    // Can't call markSuccess again since millicards are now 0
    expect(() => deck.markSuccess(variant)).toThrow('Cannot mark success on a variant with 0 or negative millicards');
    expect(deck.remaining(variant)).toBe(0);
  });

  test('markSuccess should reduce millicards by 1000', () => {
    const variant = variants[0].variant;
    deck.markSuccess(variant);
    expect(deck.variantsMap.get(variant)!.millicards).toBe(0);
  });

  test('markFailure should reset millicards to maxMillicards', () => {
    const variant = variants[0].variant;
    deck.markSuccess(variant);
    expect(deck.variantsMap.get(variant)!.millicards).toBe(0);
    deck.markFailure(variant);
    expect(deck.variantsMap.get(variant)!.millicards).toBe(1000);
  });

  test('score should return total millicards removed', () => {
    deck.markSuccess(variants[0].variant); // -1000 millicards
    deck.markSuccess(variants[1].variant); // -1000 millicards
    expect(deck.score()).toBe(2000); // 1000 + 1000 = 2000
    deck.markFailure(variants[0].variant); // reset to max, undoing -1000
    expect(deck.score()).toBe(1000); // 0 + 1000 = 1000
  });

  test('maxScore should return total maximum millicards', () => {
    expect(deck.maxScore()).toBe(3000); // 1000 + 1000 + 1000
  });

  test('getTotalMillicards should calculate correctly', () => {
    expect(deck['getTotalMillicards']()).toBe(3000);
    deck.markSuccess(variants[0].variant);
    expect(deck['getTotalMillicards']()).toBe(2000);
    deck.markSuccess(variants[1].variant);
    expect(deck['getTotalMillicards']()).toBe(1000);
    deck.markSuccess(variants[2].variant);
    expect(deck['getTotalMillicards']()).toBe(0);
  });

  test('pickVariant should respect total millicards', () => {
    // Calculate total full cards from millicards (1000 millicards = 1 card)
    type StringVariant = string;
    const stringVariants = [
      { variant: 'A' as StringVariant, millicards: 1000 },  // 1 card
      { variant: 'B' as StringVariant, millicards: 500 },   // 0.5 card
      { variant: 'C' as StringVariant, millicards: 500 }    // 0.5 card
    ];
    const customDeck = new ProbabilisticDeck<StringVariant>(stringVariants, maxScorePerVariant);
    // Remove 2000 millicards (2 full cards worth)
    for (let i = 0; i < 2; i++) {
      const pick = customDeck.pickVariant();
      customDeck.markSuccess(pick);
    }

    // Should throw error when no more cards are available
    expect(() => customDeck.pickVariant()).toThrow('No more variants available to pick from');
  });

  test('pickVariant should draw all cards based on their millicards weighting', () => {
    const numTrials = 1000;
    const firstPickCounts: Record<string, number> = { 'A': 0, 'B': 0, 'C': 0 };
    const totalDrawCounts: Record<string, number> = { 'A': 0, 'B': 0, 'C': 0 };

    // For each trial, we'll record which cards are drawn and how many times
    for (let trial = 0; trial < numTrials; trial++) {
      // Create deck with a 2000-millicard variant and two 500-millicard variants
      const stringVariants = [
        { variant: 'A', millicards: 2000 },  // 2 full cards
        { variant: 'B', millicards: 500 },   // 0.5 card
        { variant: 'C', millicards: 500 }    // 0.5 card
      ];
      const customDeck = new ProbabilisticDeck<string>(stringVariants, 2000);

      // Track which cards are drawn in this trial
      const drawnInThisTrial: Record<string, number> = { 'A': 0, 'B': 0, 'C': 0 };

      // First pick
      const firstPick = customDeck.pickVariant();
      firstPickCounts[firstPick]++;
      drawnInThisTrial[firstPick]++;
      customDeck.markSuccess(firstPick);

      // Second pick
      const secondPick = customDeck.pickVariant();
      drawnInThisTrial[secondPick]++;
      customDeck.markSuccess(secondPick);

      // Third pick
      const thirdPick = customDeck.pickVariant();
      drawnInThisTrial[thirdPick]++;
      customDeck.markSuccess(thirdPick);

      // We shouldn't be able to make a fourth pick
      expect(() => customDeck.pickVariant()).toThrow('No more variants available to pick from');

      // Update overall counts
      totalDrawCounts['A'] += drawnInThisTrial['A'];
      totalDrawCounts['B'] += drawnInThisTrial['B'];
      totalDrawCounts['C'] += drawnInThisTrial['C'];
    }

    // Verify millicards are proportional to draws across all trials
    // We set up millicards as A: 2000, B: 500, C: 500
    // So A should be drawn exactly 2 times per trial (2000 millicards),
    // and B and C should each be drawn with 50% probability (total of 1 card between them)

    // Over numTrials trials, A should be drawn exactly 2*numTrials times total
    expect(totalDrawCounts['A']).toBe(2 * numTrials);

    // B and C should each be drawn approximately numTrials/2 times
    // (allowing for some variance due to randomness)
    expect(totalDrawCounts['B'] + totalDrawCounts['C']).toBe(numTrials);

    const expectNear = (actual: number, expected: number, delta: number) => {
      expect(actual).toBeLessThan(expected + delta);
      expect(actual).toBeGreaterThan(expected - delta);
    };

    expectNear(totalDrawCounts['B'], numTrials / 2, 50);
    expectNear(totalDrawCounts['C'], numTrials / 2, 50);

    expectNear(firstPickCounts['A'], numTrials * (2/3), 50);
    expectNear(firstPickCounts['B'], numTrials * (1/6), 50);
    expectNear(firstPickCounts['C'], numTrials * (1/6), 50);
  });

  test('pickVariant handles the case of two cards with 500 millicards each', () => {
    const variants = [
      { variant: 'A', millicards: 500 },
      { variant: 'B', millicards: 500 }
    ];
    const deck = new ProbabilisticDeck<string>(variants, 1000);
    // We should be able to draw one card
    const pick = deck.pickVariant();
    deck.markSuccess(pick);
    // But trying to draw again should throw an error
    expect(() => deck.pickVariant()).toThrow('No more variants available to pick from');
  });

  test('pickVariant should ignore negative millicards and draw from positive millicards proportionally', () => {
    const numTrials = 1000;
    const drawCounts: Record<string, number> = { 'A': 0, 'B': 0, 'C': 0, 'D': 0 };

    // For each trial, create a deck with 4 variants: -500, 500, 500, 500 millicards
    // Variant A has negative millicards and should be ignored
    // Total millicards = 1000 (1 card worth)
    for (let trial = 0; trial < numTrials; trial++) {
      const variants = [
        { variant: 'A', millicards: -500 },  // Should be ignored
        { variant: 'B', millicards: 500 },
        { variant: 'C', millicards: 500 },
        { variant: 'D', millicards: 500 }
      ];
      const deck = new ProbabilisticDeck<string>(variants, 2000);

      // We should only be able to draw 1 card
      const pick = deck.pickVariant();
      drawCounts[pick]++;
      deck.markSuccess(pick);

      // After one pick, we should not be able to make another pick
      expect(() => deck.pickVariant()).toThrow('No more variants available to pick from');
    }

    // Verify that variant A (with negative millicards) was never picked
    expect(drawCounts['A']).toBe(0);

    // The total draws should be equal to numTrials (one pick per trial)
    const totalDraws = drawCounts['B'] + drawCounts['C'] + drawCounts['D'];
    expect(totalDraws).toBe(numTrials);

    // Variants B, C, and D should be drawn with roughly equal probability
    // since they have the same millicards (500 each)
    const expectedDrawsPerVariant = numTrials / 3;
    const allowableDelta = expectedDrawsPerVariant * 0.15; // Allow 15% variance

    expect(drawCounts['B']).toBeGreaterThan(expectedDrawsPerVariant - allowableDelta);
    expect(drawCounts['B']).toBeLessThan(expectedDrawsPerVariant + allowableDelta);

    expect(drawCounts['C']).toBeGreaterThan(expectedDrawsPerVariant - allowableDelta);
    expect(drawCounts['C']).toBeLessThan(expectedDrawsPerVariant + allowableDelta);

    expect(drawCounts['D']).toBeGreaterThan(expectedDrawsPerVariant - allowableDelta);
    expect(drawCounts['D']).toBeLessThan(expectedDrawsPerVariant + allowableDelta);
  });

  test('pickVariant should select guaranteed cards when they equal total cards in the deck', () => {
    const variants1 = [
      { variant: 'A', millicards: -999 },
      { variant: 'B', millicards: 1000 },
      { variant: 'C', millicards: 999 }
    ];
    const deck1 = new ProbabilisticDeck<string>(variants1, 1000);

    const pick1 = deck1.pickVariant();
    expect(pick1).toBe('B');
    deck1.markSuccess(pick1);

    expect(() => deck1.pickVariant()).toThrow('No more variants available to pick from');

    const variants2 = [
      { variant: 'A', millicards: -500 },
      { variant: 'B', millicards: 1000 },
      { variant: 'C', millicards: 1000 },
      { variant: 'D', millicards: 500 }
    ];
    const deck2 = new ProbabilisticDeck<string>(variants2, 1000);

    const firstPick = deck2.pickVariant();
    expect(['B', 'C']).toContain(firstPick);
    deck2.markSuccess(firstPick);

    const secondPick = deck2.pickVariant();
    expect(['B', 'C']).toContain(secondPick);
    expect(secondPick).not.toBe(firstPick);
    deck2.markSuccess(secondPick);

    expect(() => deck2.pickVariant()).toThrow('No more variants available to pick from');
  });

  test('markSuccess should throw error on variants with 0 or negative millicards', () => {
    const variants = [
      { variant: 'A', millicards: 0 },
      { variant: 'B', millicards: -100 },
      { variant: 'C', millicards: 500 }
    ];
    const deck = new ProbabilisticDeck<string>(variants, 1000);

    expect(() => deck.markSuccess('A')).toThrow('Cannot mark success on a variant with 0 or negative millicards');
    expect(() => deck.markSuccess('B')).toThrow('Cannot mark success on a variant with 0 or negative millicards');
    expect(() => deck.markSuccess('C')).not.toThrow();
  });

  test('constructor and markSuccess should validate deck state', () => {
    expect(() => {
      new ProbabilisticDeck<string>([
        { variant: 'A', millicards: -1000 },
        { variant: 'B', millicards: 1000 },
        { variant: 'C', millicards: 1000 },
        { variant: 'D', millicards: 1000 }
      ], 1000);
    }).toThrow('Invalid deck state: more guaranteed cards than total cards');

    const variants = [
      { variant: 'A', millicards: 0 },
      { variant: 'B', millicards: 1000 },
      { variant: 'C', millicards: 1000 }
    ];
    const deck = new ProbabilisticDeck<string>(variants, 1000);

    const pick = deck.pickVariant();
    deck.markSuccess(pick);

    const secondPick = deck.pickVariant();
    expect(() => deck.markSuccess(secondPick)).not.toThrow();
  });

  test('constructor should throw when maxMillicardsPerVariant is less than any variant millicards', () => {
    expect(() => {
      new ProbabilisticDeck<string>([
        { variant: 'A', millicards: 1000 },
        { variant: 'B', millicards: 2000 },
        { variant: 'C', millicards: 500 }
      ], 1500);
    }).toThrow('maxMillicardsPerVariant (1500) cannot be less than variant millicards (2000)');

    expect(() => {
      new ProbabilisticDeck<string>([
        { variant: 'A', millicards: 100 },
        { variant: 'B', millicards: 50 }
      ], 10);
    }).toThrow('maxMillicardsPerVariant (10) cannot be less than variant millicards (100)');
  });

  test('failure then immediate success should keep all cards in deck', () => {
    const variants = [
      { variant: 'A', millicards: 1000 },
      { variant: 'B', millicards: 1000 },
      { variant: 'C', millicards: 1000 }
    ];

    const deck = new ProbabilisticDeck<string>(variants, 2000);
    expect(deck['getTotalMillicards']()).toBe(3000);

    const firstPick = 'A';
    deck.markFailure(firstPick);
    expect(deck['getTotalMillicards']()).toBe(4000);

    // Once a card is failed, the only possible action is to either continue failing that card
    // or to mark it successful. Another card cannot be dealt with.
    expect(() => deck.markSuccess('B')).toThrow();
    expect(() => deck.markFailure('B')).toThrow();

    deck.markSuccess(firstPick);
    expect(deck['getTotalMillicards']()).toBe(4000);

    deck.markSuccess(firstPick);
    expect(deck['getTotalMillicards']()).toBe(3000);

    const secondPick = 'B';
    deck.markSuccess(secondPick);
    expect(deck['getTotalMillicards']()).toBe(2000);

    const thirdPick = 'C';
    deck.markSuccess(thirdPick);
    expect(deck['getTotalMillicards']()).toBe(1000);

    const lastPick = deck.pickVariant();
    expect(lastPick).toBe('A');
  });
});

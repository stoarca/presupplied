const { VariantList } = require('../util');

/**
 * Test suite for VariantList class
 * Tests initialization, selection, scoring, and weight handling
 */
describe('VariantList', () => {
  let variants;
  let maxScorePerVariant;
  let variantList;

  beforeEach(() => {
    variants = [
      { variant: [1, 0], millicards: 1000 },
      { variant: [0, 0], millicards: 1000 },
      { variant: [1, 1], millicards: 1000 }
    ];
    maxScorePerVariant = 2;
    variantList = new VariantList(variants, maxScorePerVariant);
  });

  /**
   * Tests for proper initialization of variants with weights
   */
  test('should initialize correctly', () => {
    expect(variantList.variants).toEqual(variants);
    expect(variantList.variantsMap.size).toBe(variants.length);

    variants.forEach(variant => {
      const data = variantList.variantsMap.get(variant.variant);
      expect(data).toBeDefined();
      expect(data.maxScore).toBe(Math.ceil(maxScorePerVariant * (variant.millicards / 1000)));
      expect(data.score).toBe(0);
    });
  });

  test('pickVariant should return a valid variant', () => {
    const picked = variantList.pickVariant();
    expect(variants.map(v => v.variant)).toContain(picked);
  });

  test('remaining should calculate correct remaining attempts', () => {
    const variant = variants[0].variant;
    expect(variantList.remaining(variant)).toBe(maxScorePerVariant);

    variantList.markSuccess(variant);
    expect(variantList.remaining(variant)).toBe(maxScorePerVariant - 1);

    variantList.markSuccess(variant);
    expect(variantList.remaining(variant)).toBe(0);
  });

  test('markSuccess should increment score', () => {
    const variant = variants[0].variant;
    variantList.markSuccess(variant);
    expect(variantList.variantsMap.get(variant).score).toBe(1);
  });

  test('markFailure should set score to -1', () => {
    const variant = variants[0].variant;
    variantList.markFailure(variant);
    expect(variantList.variantsMap.get(variant).score).toBe(-1);
  });

  test('score should return total current score', () => {
    variantList.markSuccess(variants[0].variant); // +1
    variantList.markSuccess(variants[1].variant); // +1
    expect(variantList.score()).toBe(2); // 1 + 1 = 2
    variantList.markFailure(variants[2].variant); // -1
    expect(variantList.score()).toBe(1); // 1 + 1 - 1 = 1
  });

  test('maxScore should return total maximum possible score', () => {
    expect(variantList.maxScore()).toBe(maxScorePerVariant * variants.length);
  });

  /**
   * Verifies weighted selection probabilities
   * Variants with higher weights should be selected more often
   */

  test('should handle variant cards correctly', () => {

    variants.forEach(variant => {
      const data = variantList.variantsMap.get(variant.variant);
      expect(data.maxScore).toBe(Math.ceil(maxScorePerVariant * (variant.millicards / 1000)));
      expect(data.millicards).toBe(variant.millicards);
    });
  });

  test('pickVariant should respect total millicards', () => {
    // Calculate total cards from millicards (1000 millicards = 1 card)
    const variants = [
      { variant: 'A', millicards: 1000 },  // 1 card
      { variant: 'B', millicards: 500 },   // 0.5 card
      { variant: 'C', millicards: 500 }    // 0.5 card
    ];
    const customVariantList = new VariantList(variants, maxScorePerVariant);
    const totalCards = variants.reduce((sum, v) => sum + v.millicards / 1000, 0);
    console.log('Total cards:', totalCards);
    // Make picks equal to total cards available
    for (let i = 0; i < totalCards; i++) {
      const pick = customVariantList.pickVariant();
      customVariantList.markSuccess(pick);
      expect(customVariantList.totalCards).toBe(totalCards);
    }

    // Should throw error when no more cards are available
    expect(() => customVariantList.pickVariant()).toThrow('No more variants available to pick from');
  });

  test('pickVariant should respect number of cards in deck', () => {
    const numTrials = 1000;
    const allPicks = []; // Track all picks across trials

    for (let trial = 0; trial < numTrials; trial++) {
      const customVariants = [
        { variant: [1, 1], millicards: 1000 },  // 1 full card
        { variant: [1, 0], millicards: 500 },   // 0.5 card
        { variant: [0, 0], millicards: 500 }    // 0.5 card
      ];
      const customVariantList = new VariantList(customVariants, maxScorePerVariant);
      // console.log(customVariantList)
      // Make 2 picks per trial
      for (let i = 0; i < 2; i++) {
        const pick = customVariantList.pickVariant();
        allPicks.push(pick);
        customVariantList.markSuccess(pick);
        // console.log(pick);
      }
    }

    // Count total appearances of each variant
    const counts = {
      '[1,1]': 0,
      '[1,0]': 0,
      '[0,0]': 0
    };

    allPicks.forEach(pick => {
      counts[JSON.stringify(pick)]++;
    });
    // console.log(counts);
    const remainingPicks = numTrials;
    const expectedPerVariant = remainingPicks / 2;
    const margin = 25; // Allow ±25 variance for randomness
    expect(counts['[1,1]']).toBeGreaterThanOrEqual(numTrials - margin);
    expect(counts['[1,1]']).toBeLessThanOrEqual(numTrials + margin);
    expect(counts['[1,0]']).toBeGreaterThanOrEqual(expectedPerVariant - margin);
    expect(counts['[1,0]']).toBeLessThanOrEqual(expectedPerVariant + margin);
    expect(counts['[0,0]']).toBeGreaterThanOrEqual(expectedPerVariant - margin);
    expect(counts['[0,0]']).toBeLessThanOrEqual(expectedPerVariant + margin);
  });
});
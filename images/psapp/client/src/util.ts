export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface GenRandPointOptions {
  width?: number;
  height?: number;
  paddingFromEdge?: number;
  farAwayFrom?: { point: Point; dist: number }[];
}

export let genRandPoint = ({
  width = window.innerWidth,
  height = window.innerHeight,
  paddingFromEdge = 0,
  farAwayFrom = [],
}: GenRandPointOptions): Point => {
  const p = paddingFromEdge;
  let ret: Point;
  let i = 0;
  do {
    i++;
    ret = {
      x: p + Math.random() * (width - 2 * p),
      y: p + Math.random() * (height - 2 * p),
    };
    if (i === 1000) { break; }
  } while (!farAwayFrom.every(x => dist(x.point, ret) > x.dist));
  return ret!;
};

interface GenRandPointsOptions {
  width?: number;
  height?: number;
  paddingFromEdge?: number;
  paddingFromEachOther?: number;
}

export let genRandPoints = (
  n: number,
  {
    width = window.innerWidth,
    height = window.innerHeight,
    paddingFromEdge = 0,
    paddingFromEachOther = 0,
  }: GenRandPointsOptions
): Point[] => {
  const ret: Point[] = [];
  for (let i = 0; i < n; i++) {
    ret.push(
      genRandPoint({
        width,
        height,
        paddingFromEdge,
        farAwayFrom: ret.map(x => ({ point: x, dist: paddingFromEachOther })),
      })
    );
  }
  return ret;
};

interface PickFromBagOptions {
  withReplacement: boolean;
}

export let pickFromBag = <T>(
  bag: readonly T[],
  n: number,
  { withReplacement }: PickFromBagOptions
): T[] => {
  const selected: T[] = [];
  for (let i = 0; i < n; i++) {
    let item = bag[Math.floor(Math.random() * bag.length)];
    if (!withReplacement) {
      while (selected.includes(item)) {
        item = bag[Math.floor(Math.random() * bag.length)];
      }
    }
    selected.push(item);
  }
  return selected;
};

export let shuffle = <T>(arr: T[]): T[] => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/**
 * ProbabilisticDeck handles selection of variant cards based on their millicards weighting.
 *
 * Key concepts and nuances:
 *
 * 1. Millicards:
 *    - 1000 millicards = 1 full card
 *    - <1000 millicards = partial/probabilistic card
 *    - ≥1000 millicards = guaranteed card(s)
 *    - Millicards can be negative (after drawing a partial card)
 *
 * 2. Total cards in deck:
 *    - Calculated as Math.floor(totalMillicards / 1000)
 *    - Includes both positive and negative millicards in the calculation
 *
 * 3. Selection logic:
 *    - When total guaranteed cards equals total cards in deck, only guaranteed cards are selected
 *      Example: If there's 1 card in deck and 1 variant with ≥1000 millicards, it must be chosen
 *    - Otherwise, variants are selected based on their positive millicards weighting
 *    - Variants with negative millicards are never selected
 *
 * 4. Marking success:
 *    - Always removes exactly 1000 millicards from the selected variant
 *    - Can result in negative millicards for that variant
 */
export class ProbabilisticDeck<T> {
  variants: readonly { variant: T; millicards: number }[];
  variantsMap: Map<T, { maxMillicards: number; millicards: number }>;

  constructor(
    variants: readonly { variant: T; millicards: number }[],
    maxMillicardsPerVariant: number
  ) {
    this.variants = variants;
    this.variantsMap = new Map();

    for (let { variant, millicards } of variants) {
      const maxMillicards = millicards;
      this.variantsMap.set(variant, {
        maxMillicards,
        millicards,
      });
    }

    this.validateState();
  }

  private getTotalMillicards(): number {
    return Array.from(this.variantsMap.values()).reduce(
      (sum, v) => sum + v.millicards,
      0
    );
  }

  private validateState(): void {
    // Calculate totalMillicards first since we need it for both cases
    const totalMillicards = this.getTotalMillicards();
    const totalCards = Math.max(0, Math.floor(totalMillicards / 1000));
    let guaranteedCards = 0;

    for (const data of this.variantsMap.values()) {
      if (data.millicards >= 1000) {
        guaranteedCards += Math.floor(data.millicards / 1000);
      }
    }

    if (guaranteedCards > totalCards) {
      throw new Error('Invalid deck state: more guaranteed cards than total cards');
    }
  }

  /**
   * Selects a variant from the deck based on millicards weighting.
   *
   * The algorithm works as follows:
   * 1. Calculate total millicards in the deck (including negative millicards)
   * 2. If total millicards ≤ 0, there are no cards left to draw
   * 3. Calculate the total number of whole cards in the deck (totalMillicards / 1000)
   * 4. Count guaranteed cards (variants with ≥1000 millicards)
   * 5. If guaranteed cards equals total cards, only select from guaranteed variants
   *    - This handles cases where there are exactly enough guaranteed cards to account for
   *      all the whole cards in the deck
   * 6. Otherwise, select based on proportional positive millicards
   *    - Only variants with positive millicards are considered
   *    - Probability is proportional to millicards value
   *
   * Examples:
   * - Deck with -500, 500, 500, 500 millicards:
   *   - Total millicards = 1000 (1 card)
   *   - No guaranteed cards
   *   - Each positive variant has 1/3 chance of selection
   *
   * - Deck with -999, 1000, 999 millicards:
   *   - Total millicards = 1000 (1 card)
   *   - 1 guaranteed card
   *   - Must select the variant with 1000 millicards
   *
   * @returns The selected variant
   * @throws Error if no variants are available to pick from
   */
  pickVariant(): T {
    const totalMillicards = this.getTotalMillicards();
    if (totalMillicards <= 0) {
      throw new Error('No more variants available to pick from');
    }

    // Get the total number of whole cards in the deck (round down)
    const totalCards = Math.floor(totalMillicards / 1000);

    // Identify all guaranteed variant cards (with ≥1000 millicards)
    const guaranteedVariants: T[] = [];
    let totalGuaranteedCards = 0;

    for (const [variant, data] of this.variantsMap.entries()) {
      if (data.millicards >= 1000) {
        // Count how many whole cards this variant has
        const wholeCards = Math.floor(data.millicards / 1000);
        totalGuaranteedCards += wholeCards;

        // Add the variant to our guaranteed list (multiple times if it has multiple cards)
        for (let i = 0; i < wholeCards; i++) {
          guaranteedVariants.push(variant);
        }
      }
    }

    // If the number of guaranteed cards equals the total number of cards in the deck,
    // then we must select one of those guaranteed cards
    if (totalGuaranteedCards === totalCards && totalCards > 0) {
      // Randomly select one of the guaranteed variants
      const randomIndex = Math.floor(Math.random() * guaranteedVariants.length);
      return guaranteedVariants[randomIndex];
    }

    // Otherwise, select variants based on their positive millicards weighting
    let totalPositiveMillicards = 0;
    for (const data of this.variantsMap.values()) {
      if (data.millicards > 0) {
        totalPositiveMillicards += data.millicards;
      }
    }

    // The probability of drawing any variant is proportional to its positive millicards
    let r = Math.random() * totalPositiveMillicards;
    for (const [variant, data] of this.variantsMap.entries()) {
      if (data.millicards > 0) {
        r -= data.millicards;
        if (r <= 0) {
          return variant;
        }
      }
    }

    // If we get here, something went wrong with our calculation
    throw new Error('No more variants available to pick from');
  }

  markSuccess(variant: T) {
    const variantData = this.variantsMap.get(variant)!;

    if (variantData.millicards <= 0) {
      throw new Error('Cannot mark success on a variant with 0 or negative millicards');
    }

    variantData.millicards -= 1000;

    this.validateState();
  }

  markFailure(variant: T) {
    const variantData = this.variantsMap.get(variant)!;
    variantData.millicards = variantData.maxMillicards;
    this.validateState();
  }

  remaining(variant: T): number {
    // If total deck millicards is 0 or negative, everything is empty
    if (this.getTotalMillicards() <= 0) {
      return 0;
    }

    const v = this.variantsMap.get(variant)!;
    return Math.max(0, v.millicards);
  }

  // Calculate total millicards removed from the deck
  score(): number {
    // Sum of all millicards removed
    const removed = Array.from(this.variantsMap.values()).reduce(
      (sum, v) => sum + (v.maxMillicards - v.millicards),
      0
    );
    return removed;
  }

  maxScore(): number {
    return Array.from(this.variantsMap.values()).reduce(
      (sum, v) => sum + v.maxMillicards,
      0
    );
  }
}

export let pointInRect = (p: Point, r: Rect) => {
  return p.x >= r.x && p.x < r.x + r.w && p.y >= r.y && p.y < r.y + r.h;
};

export let colinear = (a: Point, b: Point, c: Point): boolean => {
  let crossProduct = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  return crossProduct === 0;
};

export let angleBetweenVectors = (u: Point, v: Point): number => {
  let dotProduct = u.x * v.x + u.y * v.y;
  let uMag = Math.sqrt(u.x * u.x + u.y * u.y);
  let vMag = Math.sqrt(v.x * v.x + v.y * v.y);
  return Math.acos(dotProduct / (uMag * vMag));
};

export let projectPointToLine = (p: Point, l: [Point, Point]): Point => {
  if (colinear(p, l[0], l[1])) {
    return p;
  }
  let v = { x: l[1].x - l[0].x, y: l[1].y - l[0].y };
  let w = { x: p.x - l[0].x, y: p.y - l[0].y };
  let dotProduct = v.x * w.x + v.y * w.y;
  let vMagnitudeSquared = v.x * v.x + v.y * v.y;
  let projScalar = dotProduct / vMagnitudeSquared;
  let projVector = { x: v.x * projScalar, y: v.y * projScalar };
  return { x: l[0].x + projVector.x, y: l[0].y + projVector.y };
};

export let rotate = (p: Point, origin: Point, angle: number): Point => {
  let op = { x: p.x - origin.x, y: p.y - origin.y };
  let s = Math.sin(angle);
  let c = Math.cos(angle);
  return {
    x: op.x * c - op.y * s + origin.x,
    y: op.x * s + op.y * c + origin.y,
  };
};

export let clamp = (n: number, min: number, max: number): number => {
  return Math.min(Math.max(n, min), max);
};
export let dist = (a: Point, b: Point): number => {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
};
export let diff = (a: Point, b: Point): Point => {
  return { x: a.x - b.x, y: b.y - a.y };
};

export let midpoint = (a: Point, b: Point) => {
  return {
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  };
};

export let sum = (arr: number[]) => {
  return arr.reduce((partialSum, b) => partialSum + b, 0);
};

export let range = (n: number): number[] => {
  return Array(n).fill(1).map((x, i) => i);
};

// Unit square has side length 2 (perfectly inscribes unit circle)
export let getPointOnUnitSquare = (angle: number): Point => {
  let x = Math.cos(angle);
  let y = Math.sin(angle);
  if (Math.abs(x) > Math.abs(y)) {
    return {
      x: x / Math.abs(x),
      y: y / Math.abs(x),
    };
  } else {
    return {
      x: x / Math.abs(y),
      y: y / Math.abs(y),
    };
  }
};

interface MyDomRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export let visibleViewBoxSize = (viewBox: ViewBox, pixelBox: MyDomRect) => {
  let aspectRatio = pixelBox.width / pixelBox.height;
  let w = viewBox.w;
  let h = viewBox.h;
  if (aspectRatio > 1) {
    h = w / aspectRatio;
  } else {
    w = h * aspectRatio;
  }
  return {
    w: w,
    h: h,
  };
};

export let pixelToViewBoxDist = (
  pixelCoord: Point, viewBox: ViewBox, pixelBox: MyDomRect,
): Point => {
  let { w, h } = visibleViewBoxSize(viewBox, pixelBox);
  return {
    x: (pixelCoord.x - pixelBox.x) / pixelBox.width * w,
    y: (pixelCoord.y - pixelBox.y) / pixelBox.height * h,
  };
};

export let pixelToViewBoxPos = (
  pixelCoord: Point, viewBox: ViewBox, pixelBox: MyDomRect
): Point => {
  let ret = pixelToViewBoxDist(pixelCoord, viewBox, pixelBox);
  return {
    x: ret.x + viewBox.x,
    y: ret.y + viewBox.y,
  };
};

// TODO: need to verify that each object has a picture and sound
export let SIMPLE_OBJECT_NAMES = [
  'apple',
  'banana',
  'watermelon',
  'strawberry',
  'chair',
  'table',
  'sofa',
  'bed',
  'microwave',
  'fridge',
  'tv',
  'lamp',
  'cow',
  'sheep',
  'horse',
  'donkey',
  'ant',
  'dog',
  'cat',
  'bee',
  'duck',
  'owl',
  'mouse',
  'car',
  'truck',
  'doll',
  'house',
  'tent',
  'tree',
  'flower',
  'cup',
  'potty',
  'shoes',
  'socks',
  'pants',
  'shirt',
  'shorts',
  'hat',
  'mittens',
  'man',
  'woman',
  'boy',
  'girl',
  'baby',
  'hand',
  'foot',
  'circle',
  'square',
  'triangle',
  'rectangle',
  'star',
  'oval',
];

export let SIMPLE_OBJECTS = SIMPLE_OBJECT_NAMES.map(x => ({
  name: x,
  image: `/static/images/objects/svg/${x}.svg`,
}));

export let PRONUNCIATIONS = {
  '0': 'zero',
  '1': 'one',
  '2': 'two',
  '3': 'three',
  '4': 'four',
  '5': 'five',
  '6': 'six',
  '7': 'seven',
  '8': 'eight',
  '9': 'nine',
  'a': 'eh',
  'b': 'bee',
  'c': 'see',
  'd': 'dee',
  'e': 'ee',
  'f': 'ef',
  'g': 'gee',
  'h': 'h',
  'i': 'aye',
  'j': 'jay',
  'k': 'kay',
  'l': 'el',
  'm': 'em',
  'n': 'en',
  'o': 'oh',
  'p': 'pee',
  'q': 'cue',
  'r': 'arre',
  's': 'ess',
  't': 'tee',
  'u': 'you',
  'v': 'vee',
  'w': 'double you',
  'x': 'ex',
  'y': 'why',
  'z': 'zee',
};

export let withAbort = async <T>(fn: () => Promise<T>, signal: AbortSignal): Promise<T | null> => {
  if (signal.aborted) {
    return null;
  }
  const result = await fn();
  if (signal.aborted) {
    return null;
  }
  return result;
};

export let mapObject = <T, U>(
  obj: Record<string, T>,
  fn: (x: [string, T]) => [string, U]
): Record<string, U> => {
  return Object.fromEntries(Object.entries(obj).map(x => fn(x)));
};

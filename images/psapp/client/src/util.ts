export interface Point {
  x: number,
  y: number,
}
export interface Rect {
  x: number,
  y: number,
  w: number,
  h: number,
}
export interface ViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface GenRandPointOptions {
  width?: number,
  height?: number,
  paddingFromEdge?: number,
  farAwayFrom?: {point: Point, dist: number}[],
}

export let genRandPoint = ({
  width = window.innerWidth,
  height = window.innerHeight,
  paddingFromEdge = 0,
  farAwayFrom = [],
}: GenRandPointOptions): Point => {
  let p = paddingFromEdge;
  let ret: Point;
  let i = 0;
  do {
    i += 1;
    // TODO: inefficient
    ret = {
      x: p + Math.random() * (width - 2 * p),
      y: p + Math.random() * (height - 2 * p),
    };
    if (i === 1000) {
      break;
    }
  } while (!farAwayFrom.every(x => dist(x.point, ret) > x.dist))
  return ret;
};

interface GenRandPointsOptions {
  width?: number,
  height?: number,
  paddingFromEdge?: number,
  paddingFromEachOther?: number,
}

export let genRandPoints = (n: number, {
  width = window.innerWidth,
  height = window.innerHeight,
  paddingFromEdge = 0,
  paddingFromEachOther = 0,
}: GenRandPointsOptions): Point[] => {
  let ret: Point[] = [];
  for (let i = 0; i < n; ++i) {
    ret.push(genRandPoint({
      width: width,
      height: height,
      paddingFromEdge: paddingFromEdge,
      farAwayFrom: ret.map(x => ({point: x, dist: paddingFromEachOther})),
    }));
  }
  return ret;
};

interface PickFromBagOptions {
  withReplacement: boolean,
}

export let pickFromBag = <T>(bag: readonly T[], n: number, {
  withReplacement,
}: PickFromBagOptions): T[] => {
  let selected: T[] = [];
  for (let i = 0; i < n; ++i) {
    let item = bag[Math.floor(Math.random() * bag.length)];
    if (!withReplacement) {
      // TODO: inefficient
      while (selected.includes(item)) {
        item = bag[Math.floor(Math.random() * bag.length)];
      }
    }
    selected.push(item);
  }
  return selected;
};

export let shuffle = <T>(arr: T[]) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export class VariantList<T> {
  variants: readonly T[];
  variantsMap: Map<T, {maxScore: number, score: number}>;
  constructor(variants: readonly T[], maxScore: number) {
    this.variants = variants;
    this.variantsMap = new Map();
    for (let i = 0; i < variants.length; ++i) {
      this.variantsMap.set(variants[i], {
        maxScore: maxScore,
        score: 0,
      });
    }
  }
  remaining(variant: T) {
    let v = this.variantsMap.get(variant)!;
    return Math.max(v.maxScore - v.score, 0);
  }
  pickVariant(): T {
    let variants = this.variants;
    let variantsMap = this.variantsMap;
    let total = sum(Array.from(this.variantsMap.keys()).map(
      x => this.remaining(x)
    ));
    if (total === 0) {
      return variants[0];
    }
    let randIndex = Math.floor(Math.random() * total);
    let variantIndex = 0;
    while (randIndex >= this.remaining(variants[variantIndex])) {
      randIndex -= this.remaining(variants[variantIndex]);
      variantIndex += 1;
    }
    return variants[variantIndex];
  }
  markSuccess(variant: T) {
    this.variantsMap.get(variant)!.score += 1;
  }
  markFailure(variant: T) {
    let val = this.variantsMap.get(variant)!;
    val.score = -1;
  }
  score() {
    return sum(Array.from(this.variantsMap.values()).map(x => x.score));
  }
  maxScore() {
    return sum(Array.from(this.variantsMap.values()).map(x => x.maxScore));
  }
}

let exerciseId = 0;
export let buildExercise = <T>(exercise: T): T & {id: number} => {
  return {
    id: exerciseId++,
    ...exercise,
  };
};

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
  let v = {x: l[1].x - l[0].x, y: l[1].y - l[0].y};
  let w = {x: p.x - l[0].x, y: p.y - l[0].y};
  let dotProduct = v.x * w.x + v.y * w.y;
  let vMagnitudeSquared = v.x * v.x + v.y * v.y;
  let projScalar = dotProduct / vMagnitudeSquared;
  let projVector = {x: v.x * projScalar, y: v.y * projScalar};
  return {x: l[0].x + projVector.x, y: l[0].y + projVector.y};
};

export let rotate = (p: Point, origin: Point, angle: number): Point => {
  let op = {x: p.x - origin.x, y: p.y - origin.y};
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
  return {x: a.x - b.x, y: a.y - b.y};
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
}

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
}

export let pixelToViewBoxDist = (
  pixelCoord: Point, viewBox: ViewBox, pixelBox: MyDomRect,
): Point => {
  let {w, h} = visibleViewBoxSize(viewBox, pixelBox);
  return {
    x: (pixelCoord.x - pixelBox.x) / pixelBox.width * w,
    y: (pixelCoord.y - pixelBox.y) / pixelBox.height * h,
  };
}

export let pixelToViewBoxPos = (
  pixelCoord: Point, viewBox: ViewBox, pixelBox: DOMRect
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
  try {
    const result = await fn();
    if (signal.aborted) {
      return null;
    }
    return result;
  } catch (e) {
    // Handle or rethrow the error
    throw e;
  }
};

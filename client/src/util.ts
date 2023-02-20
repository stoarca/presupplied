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

export let pickFromBag = <T>(bag: T[], n: number, {
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

export class VariantList<T> {
  variants: T[];
  variantsMap: Map<T, {howMany: number}>;
  constructor(variants: T[], howMany: number) {
    this.variants = variants;
    this.variantsMap = new Map();
    for (let i = 0; i < variants.length; ++i) {
      this.variantsMap.set(variants[i], {
        howMany: howMany,
      });
    }
  }
  pickVariant(): T {
    let variants = this.variants;
    let variantsMap = this.variantsMap;
    let total = sum(Array.from(this.variantsMap.values()).map(x => x.howMany));
    let randIndex = Math.floor(Math.random() * total);
    let variantIndex = 0;
    while (randIndex > variantsMap.get(variants[variantIndex])!.howMany) {
      randIndex -= variantsMap.get(variants[variantIndex])!.howMany;
      variantIndex += 1;
    }
    return variants[variantIndex];
  }
  markSuccess(variant: T) {
    this.variantsMap.get(variant)!.howMany -= 1;
  }
  markFailure(variant: T, penalty: number) {
    this.variantsMap.get(variant)!.howMany += penalty;
  }
  maxScore() {
    //throw new Error('max score not implemented');
    return 0;
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

export let clamp = (n: number, min: number, max: number): number => {
  return Math.min(Math.max(n, min), max);
};
export let dist = (a: Point, b: Point) => {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
};

export let sum = (arr: number[]) => {
  return arr.reduce((partialSum, b) => partialSum + b, 0);
}

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

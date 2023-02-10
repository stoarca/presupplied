export interface Point {
  x: number,
  y: number,
}

export const genRandPoint = (paddingFromWindowEdge: number) => {
  const p = paddingFromWindowEdge;
  return {
    x: p + Math.random() * (window.innerWidth - 2 * p),
    y: p + Math.random() * (window.innerHeight - 2 * p),
  };
};

export const dist = (a: Point, b: Point) => {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
};


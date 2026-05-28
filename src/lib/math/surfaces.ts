export interface SurfaceDef {
  name: string;
  startX: number;
  startY: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  compute: (x: number, y: number) => { loss: number; gx: number; gy: number };
}

export const surfaces: Record<string, SurfaceDef> = {
  bowl: {
    name: "Convex Bowl",
    startX: -4,
    startY: 4,
    scaleX: 10,
    scaleY: 10,
    scaleZ: 0.1,
    compute: (x, y) => {
      const loss = x * x + 0.5 * y * y;
      const gx = 2 * x;
      const gy = y;
      return { loss, gx, gy };
    }
  },
  saddle: {
    name: "Saddle Point",
    startX: -4,
    startY: 0.1, // slightly off-center to allow escape
    scaleX: 10,
    scaleY: 10,
    scaleZ: 0.1,
    compute: (x, y) => {
      const loss = x * x - y * y;
      const gx = 2 * x;
      const gy = -2 * y;
      return { loss, gx, gy };
    }
  },
  rosenbrock: {
    name: "Rosenbrock Valley",
    startX: -2,
    startY: 2,
    scaleX: 6,
    scaleY: 6,
    scaleZ: 0.005, // very steep
    compute: (x, y) => {
      const a = 1;
      const b = 100;
      const loss = Math.pow(a - x, 2) + b * Math.pow(y - x * x, 2);
      const gx = -2 * (a - x) - 4 * b * x * (y - x * x);
      const gy = 2 * b * (y - x * x);
      return { loss, gx, gy };
    }
  },
  ravine: {
    name: "Ravine",
    startX: -4,
    startY: 4,
    scaleX: 10,
    scaleY: 10,
    scaleZ: 0.1,
    compute: (x, y) => {
      // Much steeper in X than Y
      const loss = 10 * x * x + 0.1 * y * y;
      const gx = 20 * x;
      const gy = 0.2 * y;
      return { loss, gx, gy };
    }
  }
};

export const getSurface = (type: string) => surfaces[type] || surfaces["bowl"];

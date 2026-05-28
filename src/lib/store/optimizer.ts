import { create } from "zustand";
import { getSurface } from "../math/surfaces";

export type SurfaceType = "bowl" | "saddle" | "rosenbrock" | "ravine";
export type OptimizerType = "SGD" | "Momentum" | "RMSprop" | "Adam";

export interface StatePoint {
  step: number;
  x: number;
  y: number;
  vx: number; // velocity (m for Adam)
  vy: number;
  sx: number; // squared gradients (v for Adam, RMSprop)
  sy: number;
  loss: number;
  gx: number;
  gy: number;
}

interface OptimizerState {
  surfaceType: SurfaceType;
  lr: number;
  momentum: number; // beta1
  beta2: number;
  epsilon: number;
  optimizerType: OptimizerType;
  isPlaying: boolean;
  history: StatePoint[];
  currentStepIndex: number;
  
  // Actions
  setSurfaceType: (type: SurfaceType) => void;
  setHyperparams: (lr: number, momentum: number, beta2: number, opt: OptimizerType) => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
  scrub: (index: number) => void;
  tick: () => void;
}

const getInitialState = (surfaceType: SurfaceType): StatePoint => {
  const surface = getSurface(surfaceType);
  const x = surface.startX;
  const y = surface.startY;
  const { loss, gx, gy } = surface.compute(x, y);
  return { step: 0, x, y, vx: 0, vy: 0, sx: 0, sy: 0, loss, gx, gy };
};

export const useOptimizerStore = create<OptimizerState>((set) => ({
  surfaceType: "bowl",
  lr: 0.05,
  momentum: 0.9,
  beta2: 0.999,
  epsilon: 1e-8,
  optimizerType: "Momentum",
  isPlaying: false,
  history: [getInitialState("bowl")],
  currentStepIndex: 0,

  setSurfaceType: (type) => set((state) => {
    if (state.surfaceType === type) return state;
    return {
      surfaceType: type,
      history: [getInitialState(type)],
      currentStepIndex: 0,
      isPlaying: false
    };
  }),

  setHyperparams: (lr, momentum, beta2, opt) => set({ lr, momentum, beta2, optimizerType: opt }),

  play: () => set({ isPlaying: true }),
  
  pause: () => set({ isPlaying: false }),
  
  reset: () => set((state) => ({
    history: [getInitialState(state.surfaceType)],
    currentStepIndex: 0,
    isPlaying: false
  })),
  
  scrub: (index) => set((state) => {
    const clamped = Math.max(0, Math.min(index, state.history.length - 1));
    return { currentStepIndex: clamped, isPlaying: false };
  }),

  tick: () => set((state) => {
    if (!state.isPlaying) return state;
    
    // If we scrubbed back and are playing again, truncate history to current step
    const currentHistory = state.history.slice(0, state.currentStepIndex + 1);
    const last = currentHistory[currentHistory.length - 1];
    
    if (last.step > 1000) {
      return { isPlaying: false, history: currentHistory }; // limit max steps
    }

    let { x, y, vx, vy, sx, sy } = last;
    const { lr, momentum, beta2, epsilon, optimizerType, surfaceType } = state;
    
    // Gradient update
    if (optimizerType === "Momentum") {
      vx = momentum * vx - lr * last.gx;
      vy = momentum * vy - lr * last.gy;
      x += vx;
      y += vy;
    } else if (optimizerType === "RMSprop") {
      sx = beta2 * sx + (1 - beta2) * last.gx * last.gx;
      sy = beta2 * sy + (1 - beta2) * last.gy * last.gy;
      x -= (lr / (Math.sqrt(sx) + epsilon)) * last.gx;
      y -= (lr / (Math.sqrt(sy) + epsilon)) * last.gy;
    } else if (optimizerType === "Adam") {
      // m = beta1 * m + (1 - beta1) * g
      vx = momentum * vx + (1 - momentum) * last.gx;
      vy = momentum * vy + (1 - momentum) * last.gy;
      // v = beta2 * v + (1 - beta2) * g^2
      sx = beta2 * sx + (1 - beta2) * last.gx * last.gx;
      sy = beta2 * sy + (1 - beta2) * last.gy * last.gy;
      
      // Bias correction
      const m_hat_x = vx / (1 - Math.pow(momentum, last.step + 1));
      const m_hat_y = vy / (1 - Math.pow(momentum, last.step + 1));
      const v_hat_x = sx / (1 - Math.pow(beta2, last.step + 1));
      const v_hat_y = sy / (1 - Math.pow(beta2, last.step + 1));
      
      x -= (lr / (Math.sqrt(v_hat_x) + epsilon)) * m_hat_x;
      y -= (lr / (Math.sqrt(v_hat_y) + epsilon)) * m_hat_y;
    } else {
      // SGD
      x -= lr * last.gx;
      y -= lr * last.gy;
      vx = 0;
      vy = 0;
    }
    
    const surface = getSurface(surfaceType);
    
    // Divergence check
    if (isNaN(x) || isNaN(y) || Math.abs(x) > 20 || Math.abs(y) > 20) {
       return { isPlaying: false, history: currentHistory };
    }

    const { loss, gx, gy } = surface.compute(x, y);
    const nextPoint: StatePoint = { step: last.step + 1, x, y, vx, vy, sx, sy, loss, gx, gy };
    
    return {
      history: [...currentHistory, nextPoint],
      currentStepIndex: currentHistory.length,
    };
  })
}));

import type { PlanetData } from '../data/planets';

// ─── Planet selection ─────────────────────────────────────────────────────────
type SelectListener = (planet: PlanetData | null) => void;
const selectListeners = new Set<SelectListener>();
let current: PlanetData | null = null;

// ─── Orbit speed ──────────────────────────────────────────────────────────────
// Earth's simulated orbital speed (rad/s) → one Earth year = 2π / 0.029 ≈ 216 s
// speedMultiplier scales all planet orbit speeds proportionally.
const EARTH_ORBIT_SPEED_RAD = 0.029;
export const EARTH_YEAR_SECONDS = (2 * Math.PI) / EARTH_ORBIT_SPEED_RAD; // ≈ 216 s

type SpeedListener = (multiplier: number) => void;
const speedListeners = new Set<SpeedListener>();
let speedMultiplier = 1;

export const planetStore = {
    // Selection
    select: (planet: PlanetData | null) => {
        current = planet;
        selectListeners.forEach(l => l(planet));
    },
    subscribe: (listener: SelectListener) => {
        selectListeners.add(listener);
        return () => { selectListeners.delete(listener); };
    },
    getCurrent: () => current,

    // Speed
    setSpeed: (multiplier: number) => {
        speedMultiplier = multiplier;
        speedListeners.forEach(l => l(multiplier));
    },
    getSpeed: () => speedMultiplier,
    subscribeSpeed: (listener: SpeedListener) => {
        speedListeners.add(listener);
        return () => { speedListeners.delete(listener); };
    },
};

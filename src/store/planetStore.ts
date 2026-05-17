import type { PlanetData } from '../data/planets';

// ─── Planet selection ─────────────────────────────────────────────────────────
type SelectListener = (planet: PlanetData | null) => void;
const selectListeners = new Set<SelectListener>();
let current: PlanetData | null = null;

// ─── Sun selection ────────────────────────────────────────────────────────────
type SunListener = (selected: boolean) => void;
const sunListeners = new Set<SunListener>();
let sunSelected = false;

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
        // deselect sun when a planet is selected
        if (planet && sunSelected) {
            sunSelected = false;
            sunListeners.forEach(l => l(false));
        }
    },
    subscribe: (listener: SelectListener) => {
        selectListeners.add(listener);
        return () => { selectListeners.delete(listener); };
    },
    getCurrent: () => current,

    // Sun
    selectSun: () => {
        sunSelected = true;
        sunListeners.forEach(l => l(true));
        // deselect planet when sun is selected
        if (current) {
            current = null;
            selectListeners.forEach(l => l(null));
        }
    },
    deselectSun: () => {
        sunSelected = false;
        sunListeners.forEach(l => l(false));
    },
    isSunSelected: () => sunSelected,
    subscribeSun: (listener: SunListener) => {
        sunListeners.add(listener);
        return () => { sunListeners.delete(listener); };
    },

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

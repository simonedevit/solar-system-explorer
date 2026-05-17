import React, { useState } from 'react';
import { planetStore, EARTH_YEAR_SECONDS } from '../store/planetStore';

// Slider value = Earth years that pass per real minute
// At multiplier 1 (default): 60 / EARTH_YEAR_SECONDS ≈ 0.28 yrs/min
const DEFAULT_YEARS_PER_MIN = 60 / EARTH_YEAR_SECONDS; // ≈ 0.28
const SLIDER_MIN  = 0;
const SLIDER_MAX  = 5;   // 5 Earth years per real minute
const SLIDER_STEP = 0.01;

function yearsPerMinToMultiplier(ypm: number): number {
    return ypm / DEFAULT_YEARS_PER_MIN;
}

function multiplierToYearsPerMin(m: number): number {
    return m * DEFAULT_YEARS_PER_MIN;
}

function formatYPM(ypm: number): string {
    if (ypm === 0) return 'Paused';
    if (ypm < 0.1)  return `${(ypm * 12).toFixed(1)} mo / min`;
    if (ypm < 10)   return `${ypm.toFixed(2)} yrs / min`;
    return `${ypm.toFixed(1)} yrs / min`;
}

const SpeedControl: React.FC = () => {
    const [ypm, setYpm] = useState(DEFAULT_YEARS_PER_MIN);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setYpm(val);
        planetStore.setSpeed(yearsPerMinToMultiplier(val));
    };

    // Progress % for the custom track fill
    const pct = (ypm / SLIDER_MAX) * 100;

    return (
        <div className="speed-control">
            <div className="speed-header">
                <span className="speed-label">Simulation Speed</span>
                <span className="speed-value">{formatYPM(ypm)}</span>
            </div>
            <div
                className="speed-track-wrap"
                style={{ '--thumb-pct': `${pct}%` } as React.CSSProperties}
            >
                <div
                    className="speed-track-fill"
                    style={{ width: `${pct}%` }}
                />
                <input
                    type="range"
                    className="speed-slider"
                    min={SLIDER_MIN}
                    max={SLIDER_MAX}
                    step={SLIDER_STEP}
                    value={ypm}
                    onChange={handleChange}
                />
            </div>
            <div className="speed-ticks">
                <span>Pause</span>
                <span>1 yr/min</span>
                <span>5 yrs/min</span>
            </div>
        </div>
    );
};

export default SpeedControl;

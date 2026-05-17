import React, { useEffect, useState } from 'react';
import { planetStore } from '../store/planetStore';
import type { PlanetData } from '../data/planets';

const PlanetInfo: React.FC = () => {
    const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);

    useEffect(() => {
        return planetStore.subscribe(setSelectedPlanet);
    }, []);

    return (
        <div className={`planet-info${selectedPlanet ? ' visible' : ''}`}>
            {selectedPlanet && (
                <>
                    <div className="planet-info__header">
                        <div>
                            <div className="planet-info__name">{selectedPlanet.name}</div>
                            <div className="planet-info__distance">
                                ☀&nbsp;&nbsp;{selectedPlanet.distance} from the Sun
                            </div>
                        </div>
                        <button
                            className="planet-info__close"
                            onClick={() => planetStore.select(null)}
                            aria-label="Close"
                        >
                            ×
                        </button>
                    </div>
                    <div className="planet-info__stats">
                        <div className="planet-info__stat">
                            <span className="planet-info__stat-label">Diameter</span>
                            <span className="planet-info__stat-value">{selectedPlanet.diameter}</span>
                        </div>
                        <div className="planet-info__stat">
                            <span className="planet-info__stat-label">Day length</span>
                            <span className="planet-info__stat-value">{selectedPlanet.dayLength}</span>
                        </div>
                        <div className="planet-info__stat">
                            <span className="planet-info__stat-label">Year length</span>
                            <span className="planet-info__stat-value">{selectedPlanet.yearLength}</span>
                        </div>
                    </div>
                    <div className="planet-info__fact">💡 {selectedPlanet.fact}</div>
                </>
            )}
        </div>
    );
};

export default PlanetInfo;

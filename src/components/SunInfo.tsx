import React, { useEffect, useState } from 'react';
import { planetStore } from '../store/planetStore';

const STATS = [
    { label: 'Diameter',           value: '1,392,700 km' },
    { label: 'Dist. from Earth',   value: '149.6M km'    },
    { label: 'Surface temp.',      value: '5,778 K'      },
];

const SunInfo: React.FC = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => planetStore.subscribeSun(setVisible), []);

    return (
        <div className={`planet-info${visible ? ' visible' : ''}`}>
            {visible && (
                <>
                    <div className="planet-info__header">
                        <div>
                            <div className="planet-info__name">☀ Sun</div>
                            <div className="planet-info__distance">Center of our solar system</div>
                        </div>
                        <button
                            className="planet-info__close"
                            onClick={() => planetStore.deselectSun()}
                            aria-label="Close"
                        >
                            ×
                        </button>
                    </div>
                    <div className="planet-info__stats" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                        {STATS.map(s => (
                            <div key={s.label} className="planet-info__stat">
                                <span className="planet-info__stat-label">{s.label}</span>
                                <span className="planet-info__stat-value">{s.value}</span>
                            </div>
                        ))}
                    </div>
                    <div className="planet-info__fact">
                        💡 The Sun contains 99.86% of all the mass in the solar system.
                        Light from the Sun takes about 8 minutes 20 seconds to reach Earth.
                    </div>
                </>
            )}
        </div>
    );
};

export default SunInfo;

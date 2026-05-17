import React, { useMemo } from 'react';
import { Color3 } from '@babylonjs/core/Maths/math.color';

// 4 nebula colour clusters — different hue, orbit band, density
const CLUSTERS = [
    { r: 0.30, g: 0.15, b: 0.60, count: 120, rMin: 28, rMax: 50,  yMin: -8,  yMax:  8 },
    { r: 0.05, g: 0.25, b: 0.70, count: 100, rMin: 35, rMax: 65,  yMin: -10, yMax: 10 },
    { r: 0.60, g: 0.10, b: 0.20, count:  90, rMin: 40, rMax: 70,  yMin: -6,  yMax:  6 },
    { r: 0.10, g: 0.40, b: 0.30, count:  80, rMin: 55, rMax: 80,  yMin: -12, yMax: 12 },
];

const SpaceDust: React.FC = () => {
    // JUSTIFIED: Math.random() positions must be fixed at mount — useMemo with []
    // ensures they don't change on re-renders.
    const clusters = useMemo(() =>
        CLUSTERS.map((cfg, ci) => {
            const spheres = Array.from({ length: cfg.count }, (_, i) => {
                const angle  = Math.random() * Math.PI * 2;
                const radius = cfg.rMin + Math.random() * (cfg.rMax - cfg.rMin);
                return {
                    name:       `dust_${ci}_${i}`,
                    x:          radius * Math.cos(angle),
                    y:          cfg.yMin + Math.random() * (cfg.yMax - cfg.yMin),
                    z:          radius * Math.sin(angle),
                    size:       0.15 + Math.random() * 0.45,
                    scalingY:   0.4  + Math.random() * 0.8,
                    visibility: 0.04 + Math.random() * 0.12,
                };
            });
            return {
                matName: `dust-mat-${ci}`,
                color:   new Color3(cfg.r, cfg.g, cfg.b),
                ids:     spheres.map(s => s.name),
                spheres,
            };
        })
    , []);

    // Each cluster: spheres FIRST, then the shared material with assignTo.
    // Ordering is required — MaterialHost reads scene.getMeshById() immediately.
    return (
        <>
            {clusters.map(cluster => (
                <React.Fragment key={cluster.matName}>
                    {cluster.spheres.map(s => (
                        <sphere
                            key={s.name}
                            name={s.name}
                            options={{ diameter: s.size, segments: 2 }}
                            positionX={s.x}
                            positionY={s.y}
                            positionZ={s.z}
                            scalingY={s.scalingY}
                            visibility={s.visibility}
                            isPickable={false}
                        />
                    ))}
                    {/* One material per colour cluster, wired to its spheres via assignTo */}
                    <standardMaterial
                        name={cluster.matName}
                        assignTo={cluster.ids}
                        emissiveColor={cluster.color}
                        disableLighting={true}
                    />
                </React.Fragment>
            ))}
        </>
    );
};

export default SpaceDust;

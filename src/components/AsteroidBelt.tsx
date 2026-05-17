import React, { useMemo } from 'react';
import { Color3 } from '@babylonjs/core/Maths/math.color';

const COUNT = 280;

const AsteroidBelt: React.FC = () => {
    // JUSTIFIED: Math.random() must run once at mount (not on every re-render).
    // useMemo with [] guarantees stable, deterministic asteroid positions.
    const asteroids = useMemo(() =>
        Array.from({ length: COUNT }, (_, i) => {
            const angle  = Math.random() * Math.PI * 2;
            const radius = 13.5 + Math.random() * 3.0;
            return {
                name: `asteroid_${i}`,
                x:    radius * Math.cos(angle),
                y:    (Math.random() - 0.5) * 0.6,
                z:    radius * Math.sin(angle),
                size: 0.03 + Math.random() * 0.1,
            };
        })
    , []);

    // All asteroid IDs for assignTo — computed once alongside asteroid data
    const ids = useMemo(() => asteroids.map(a => a.name), [asteroids]);

    // Spheres MUST come before <standardMaterial assignTo={ids}> in JSX order:
    // MaterialHost.createInstance calls scene.getMeshById() for each id immediately,
    // so the meshes must already exist in the scene when the material is processed.
    return (
        <>
            {asteroids.map(a => (
                <sphere
                    key={a.name}
                    name={a.name}
                    options={{ diameter: a.size, segments: 2 }}
                    positionX={a.x}
                    positionY={a.y}
                    positionZ={a.z}
                    isPickable={false}
                />
            ))}

            {/* Single shared material — assignTo wires it to every asteroid sphere */}
            <standardMaterial
                name="asteroid-mat"
                assignTo={ids}
                diffuseColor={new Color3(0.38, 0.34, 0.30)}
                emissiveColor={new Color3(0.06, 0.055, 0.05)}
                specularColor={new Color3(0.05, 0.05, 0.05)}
            />
        </>
    );
};

export default AsteroidBelt;

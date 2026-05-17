import React, { useEffect, useRef, useState, useMemo } from 'react';
import type { Mesh, TransformNode } from '@babylonjs/core';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { FresnelParameters } from '@babylonjs/core/Materials/fresnelParameters';
// JUSTIFIED: FresnelParameters is a plain value-object (no scene registration).
// No Reactylon JSX element exists for it — passed as a <standardMaterial> prop.
import { useScene } from 'reactylon';
import { planetStore } from '../store/planetStore';
import type { PlanetData } from '../data/planets';

type Props = { data: PlanetData };

const Planet: React.FC<Props> = ({ data }) => {
    const scene    = useScene();
    const pivotRef = useRef<TransformNode>(null);
    const meshRef  = useRef<Mesh>(null);
    const [selected, setSelected] = useState(false);

    // JUSTIFIED: FresnelParameters has no Reactylon JSX element and is a plain value-object.
    // useMemo keeps the reference stable so Reactylon's prop-diff doesn't update the material
    // on every re-render (e.g. when `selected` changes).
    const fresnel = useMemo(() => {
        const fp = new FresnelParameters();
        fp.leftColor  = new Color3(...data.fresnel);
        fp.rightColor = Color3.Black();
        fp.power = data.fresnelPower;
        fp.bias  = 0.04;
        return fp;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // JUSTIFIED: Frame-based orbit / self-rotation animation.
    // Reactylon has no declarative animation API for per-frame callbacks.
    // registerBeforeRender is the only mechanism available.
    useEffect(() => {
        let angle = Math.random() * Math.PI * 2;
        const tick = () => {
            const dt   = scene.getEngine().getDeltaTime() / 1000;
            const mult = planetStore.getSpeed();
            angle += data.orbitSpeed * dt * mult;
            if (pivotRef.current) pivotRef.current.rotation.y = angle;
            if (meshRef.current)  meshRef.current.rotation.y  += data.rotationSpeed * dt * mult;
        };
        scene.registerBeforeRender(tick);
        return () => { scene.unregisterBeforeRender(tick); };
    }, []);

    // Selection state — drives conditional JSX for selection rings
    useEffect(() => planetStore.subscribe(p => setSelected(p?.id === data.id)), []);

    const selColor = new Color3(
        Math.min(data.fresnel[0] + 0.2, 1),
        Math.min(data.fresnel[1] + 0.2, 1),
        1,
    );

    return (
        <>
            {/* Orbit ring */}
            <torus
                name={`${data.id}-orb`}
                options={{ diameter: data.orbitRadius * 2, thickness: 0.055, tessellation: 160 }}
                isPickable={false}
            >
                <standardMaterial
                    name={`${data.id}-om`}
                    emissiveColor={new Color3(0.55, 0.62, 0.88)}
                    alpha={0.28}
                />
            </torus>

            <transformNode ref={pivotRef} name={`${data.id}-piv`}>
                <sphere
                    ref={meshRef}
                    name={data.id}
                    options={{ diameter: data.radius * 2, segments: 48 }}
                    positionX={data.orbitRadius}
                    rotationX={data.axialTilt}
                    onPick={() => planetStore.select(data)}
                >
                    {/* Planet material — fully Reactylon:
                        <texture> child assigns via TextureHost.addChild(material, texture) → material[kind] = texture
                        emissiveFresnelParameters passed as a stable prop from useMemo */}
                    <standardMaterial
                        name={`${data.id}-mat`}
                        specularColor={new Color3(0.12, 0.12, 0.15)}
                        specularPower={32}
                        emissiveColor={new Color3(...data.emissive)}
                        emissiveFresnelParameters={fresnel}
                    >
                        <texture
                            name={`${data.id}-tex`}
                            url={`/textures/${data.id}.jpg`}
                            invertY={false}
                            uScale={-1}
                            uOffset={1}
                            kind="diffuseTexture"
                        />
                    </standardMaterial>

                    {/* Saturn's rings */}
                    {data.hasRings && (
                        <torus
                            name={`${data.id}-rings`}
                            options={{ diameter: data.radius * 10, thickness: data.radius * 2.2, tessellation: 128 }}
                            isPickable={false}
                        >
                            <standardMaterial
                                name={`${data.id}-rm`}
                                diffuseColor={new Color3(0.68, 0.60, 0.40)}
                                emissiveColor={new Color3(0.14, 0.12, 0.06)}
                                specularColor={Color3.Black()}
                                alpha={0.65}
                            />
                        </torus>
                    )}
                </sphere>

                {/* Selection rings */}
                {selected && (
                    <>
                        <torus
                            name={`${data.id}-s1`}
                            options={{ diameter: data.radius * 7.5, thickness: 0.030, tessellation: 128 }}
                            positionX={data.orbitRadius}
                            isPickable={false}
                        >
                            <standardMaterial name={`${data.id}-s1m`} emissiveColor={selColor} alpha={0.95} />
                        </torus>
                        <torus
                            name={`${data.id}-s2`}
                            options={{ diameter: data.radius * 5.2, thickness: 0.016, tessellation: 128 }}
                            positionX={data.orbitRadius}
                            isPickable={false}
                        >
                            <standardMaterial name={`${data.id}-s2m`} emissiveColor={Color3.White()} alpha={0.40} />
                        </torus>
                    </>
                )}
            </transformNode>
        </>
    );
};

export default Planet;

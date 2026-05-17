import React, { useEffect, useRef } from 'react';
import type { Mesh } from '@babylonjs/core';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { ParticleSystem } from '@babylonjs/core/Particles/particleSystem';
import { SphereParticleEmitter } from '@babylonjs/core/Particles/EmitterTypes/sphereParticleEmitter';
// JUSTIFIED: ParticleSystem's `capacity` constructor param is not parsed by the Reactylon
// generator, so <particleSystem capacity={800}> calls new ParticleSystem(name, undefined, scene)
// (zero capacity) → WebGPU buffer RangeError. Imperative creation is mandatory.
// Vector3/Color4 are value-objects passed as props or used inside the justified useEffect.
import { useScene } from 'reactylon';
import { generateParticleTex } from '../utils/generatePlanetTexture';
// JUSTIFIED: generateParticleTex creates a DynamicTexture via canvas 2D drawing
// (programmatic pixel data). No Reactylon JSX element exists for procedurally-drawn textures.

const Sun: React.FC = () => {
    const scene   = useScene();
    const bodyRef = useRef<Mesh>(null);

    // JUSTIFIED: ParticleSystem — see import comment above.
    // generateParticleTex — DynamicTexture with canvas 2D drawing, no JSX alternative.
    useEffect(() => {
        const mesh = bodyRef.current;
        if (!mesh) return;
        const ptex = generateParticleTex(scene);
        const ps   = new ParticleSystem('sunPS', 800, scene);
        ps.particleTexture     = ptex;
        ps.particleEmitterType = new SphereParticleEmitter(1.95, 0.05);
        ps.emitter             = mesh;
        ps.color1    = new Color4(1.0, 0.95, 0.55, 1.0);
        ps.color2    = new Color4(1.0, 0.72, 0.20, 0.8);
        ps.colorDead = new Color4(1.0, 0.35, 0.0,  0.0);
        ps.minSize = 0.02;       ps.maxSize      = 0.12;
        ps.minLifeTime = 1.0;    ps.maxLifeTime  = 3.5;
        ps.emitRate = 300;
        ps.blendMode       = ParticleSystem.BLENDMODE_ONEONE;
        ps.minEmitPower    = 0.08;   ps.maxEmitPower  = 0.55;
        ps.updateSpeed     = 0.015;
        ps.gravity         = Vector3.Zero();
        ps.minAngularSpeed = -0.8;   ps.maxAngularSpeed = 0.8;
        ps.start();
        return () => { ps.dispose(); ptex.dispose(); };
    }, []);

    return (
        // Sun sphere + material fully declared as Reactylon components.
        // Two <texture> children: TextureHost.addChild assigns each to material[kind].
        <sphere ref={bodyRef} name="sun" options={{ diameter: 3.8, segments: 32 }} isPickable={false}>
            <standardMaterial
                name="sun-mat"
                emissiveColor={new Color3(1, 1, 1)}
                disableLighting={true}
            >
                <texture
                    name="sun-diffuse"
                    url="/textures/sun.jpg"
                    invertY={false}
                    uScale={-1}
                    uOffset={1}
                    kind="diffuseTexture"
                />
                <texture
                    name="sun-emissive"
                    url="/textures/sun.jpg"
                    invertY={false}
                    uScale={-1}
                    uOffset={1}
                    kind="emissiveTexture"
                />
            </standardMaterial>
        </sphere>
    );
};

export default Sun;

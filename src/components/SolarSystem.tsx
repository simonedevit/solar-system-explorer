import React, { useEffect, useRef } from 'react';
import type { ArcRotateCamera } from '@babylonjs/core';
import { Vector3, Matrix } from '@babylonjs/core/Maths/math.vector';
import { Animation } from '@babylonjs/core/Animations/animation';
import '@babylonjs/core/Animations/animatable'; // side effect: adds scene.beginDirectAnimation
import '@babylonjs/core/Culling/ray';           // side effect: needed for onPick ActionManager
import '@babylonjs/core/Layers/effectLayerSceneComponent'; // side effect for <glowLayer>
import { useScene, useCanvas, useEngine } from 'reactylon';
import { PLANETS } from '../data/planets';
import type { PlanetData } from '../data/planets';
import { planetStore } from '../store/planetStore';
import StarField from './StarField';
import Sun from './Sun';
import Planet from './Planet';

const DEFAULT_RADIUS = 48;
const DEFAULT_BETA   = Math.PI / 3.5;

const SolarSystem: React.FC = () => {
    const scene  = useScene();
    const canvas = useCanvas();
    const engine = useEngine();
    const camRef = useRef<ArcRotateCamera | null>(null);
    const selRef = useRef<PlanetData | null>(null);

    // Render at the screen's physical pixel density for crisp output on Retina / high-DPI
    // mobile screens. Cap at 2× so a 3× iPhone doesn't render 9× the pixels (too slow).
    useEffect(() => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        engine.setHardwareScalingLevel(1 / dpr);
        engine.resize(); // recompute canvas dimensions after changing the scaling level
    }, []);


    // Planet selection → zoom camera using Babylon's Animation system
    useEffect(() => {
        return planetStore.subscribe(planet => {
            selRef.current = planet;
            const cam = camRef.current;
            if (!cam) return;

            if (planet) {
                // Allow getting very close
                cam.lowerRadiusLimit = null as any;

                const targetRadius = planet.radius * 7.8;

                // Animate radius: smooth zoom in (0.9 s, cubic ease-out)
                Animation.CreateAndStartAnimation(
                    'camZoom', cam, 'radius',
                    60, 54,
                    cam.radius, targetRadius,
                    Animation.ANIMATIONLOOPMODE_CONSTANT
                );
            } else {
                cam.lowerRadiusLimit = 8;

                // Animate radius: zoom back out
                Animation.CreateAndStartAnimation(
                    'camZoom', cam, 'radius',
                    60, 60,
                    cam.radius, DEFAULT_RADIUS,
                    Animation.ANIMATIONLOOPMODE_CONSTANT
                );
            }
        });
    }, []);

    // Every frame: smoothly move camera target toward selected planet (or back to sun)
    useEffect(() => {
        const tick = () => {
            const cam = camRef.current;
            if (!cam) return;
            const pl = selRef.current;
            if (pl) {
                const m = scene.getMeshByName(pl.id);
                if (m) cam.target = Vector3.Lerp(cam.target, m.getAbsolutePosition(), 0.07);
            } else {
                cam.target = Vector3.Lerp(cam.target, Vector3.Zero(), 0.06);
            }
        };
        scene.registerBeforeRender(tick);
        return () => { scene.unregisterBeforeRender(tick); };
    }, []);

    // Picking is handled declaratively via onPick on each <sphere> in Planet.tsx

    // Floating planet labels — direct DOM, updated every frame via registerBeforeRender
    useEffect(() => {
        const wrap = document.createElement('div');
        wrap.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:6;';
        document.body.appendChild(wrap);

        const els: Record<string, HTMLElement> = {};
        PLANETS.forEach(p => {
            const el = document.createElement('div');
            el.textContent = p.name;
            el.style.cssText = [
                'position:absolute',
                'transform:translateX(-50%)',
                'color:rgba(255,255,255,0.90)',
                'font-size:11px',
                'font-weight:600',
                'letter-spacing:0.8px',
                'text-transform:uppercase',
                'font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif',
                'background:rgba(0,0,0,0.42)',
                'border:1px solid rgba(255,255,255,0.14)',
                'border-radius:5px',
                'padding:3px 8px',
                'white-space:nowrap',
                'pointer-events:auto',
                'cursor:pointer',
                'transition:opacity 0.3s',
            ].join(';');
            el.addEventListener('click', () => planetStore.select(p));
            wrap.appendChild(el);
            els[p.id] = el;
        });

        const tick = () => {
            const cam = camRef.current;
            if (!cam) return;
            const engine = scene.getEngine();
            const scale = engine.getHardwareScalingLevel(); // converts render-buffer px → CSS px
            const vp = cam.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight());
            const tf = scene.getTransformMatrix();
            const sel = selRef.current;

            PLANETS.forEach(p => {
                const mesh = scene.getMeshByName(p.id);
                const el   = els[p.id];
                if (!mesh || !el) return;

                const sp = Vector3.Project(mesh.getAbsolutePosition(), Matrix.Identity(), tf, vp);
                const visible = sp.z > 0 && sp.z < 1;
                // Hide label of selected planet (it fills the screen)
                const isSelected = sel?.id === p.id;
                el.style.opacity = visible && !isSelected ? '1' : '0';
                if (visible) {
                    el.style.left = `${sp.x * scale}px`;
                    el.style.top  = `${sp.y * scale - p.radius * 60 - 18}px`;
                }
            });
        };

        scene.registerBeforeRender(tick);
        return () => {
            scene.unregisterBeforeRender(tick);
            document.body.removeChild(wrap);
        };
    }, []);

    return (
        <>
            <arcRotateCamera
                name="cam"
                alpha={-Math.PI / 2}
                beta={DEFAULT_BETA}
                radius={DEFAULT_RADIUS}
                target={Vector3.Zero()}
                onCreate={cam => {
                    camRef.current = cam;
                    cam.attachControl(canvas as HTMLCanvasElement, true);
                    cam.lowerBetaLimit     = 0.08;
                    cam.upperBetaLimit     = Math.PI / 2.1;
                    cam.lowerRadiusLimit   = 8;
                    cam.upperRadiusLimit   = 100;
                    cam.wheelPrecision     = 3;
                    cam.pinchPrecision     = 3;
                    cam.panningSensibility = 0;
                    cam.inertia            = 0.85;
                }}
            />

            <pointLight name="sunLight" position={Vector3.Zero()} intensity={3.0} />
            <hemisphericLight name="amb" direction={new Vector3(0, 1, 0)} intensity={0.04} />

            {/* GlowLayer as Reactylon JSX — replaces the imperative useEffect */}
            <glowLayer name="glow" intensity={0.55} onCreate={gl => { gl.blurKernelSize = 32; }} />

            <StarField />
            <Sun />
            {PLANETS.map(p => <Planet key={p.id} data={p} />)}
        </>
    );
};

export default SolarSystem;

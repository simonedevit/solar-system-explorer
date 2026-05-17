import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import '@babylonjs/core/Engines/Extensions/engine.dynamicTexture';
import '@babylonjs/core/Engines/WebGPU/Extensions/engine.dynamicTexture';
import type { Scene } from '@babylonjs/core';

const W = 512;
const H = 256;

type Ctx = CanvasRenderingContext2D;

// Cheap LCG seeded random – deterministic per planet
function seeded(seed: number) {
    let s = seed | 0;
    return () => {
        s = Math.imul(s, 1664525) + 1013904223;
        return ((s >>> 0) / 0xffffffff);
    };
}

// ─── Mercury ─────────────────────────────────────────────────────────────────
function mercury(ctx: Ctx) {
    ctx.fillStyle = '#555048';
    ctx.fillRect(0, 0, W, H);
    const r = seeded(42);
    // Highland patches
    for (let i = 0; i < 60; i++) {
        const x = r() * W, y = r() * H, rad = r() * 28 + 4;
        ctx.fillStyle = r() > 0.55
            ? `rgba(155,145,130,${r() * 0.38 + 0.12})`
            : `rgba(28,20,14,${r() * 0.32 + 0.08})`;
        ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.fill();
    }
    // Crater rims
    for (let i = 0; i < 40; i++) {
        const x = r() * W, y = r() * H, rad = r() * 14 + 2;
        ctx.strokeStyle = `rgba(180,165,145,${r() * 0.28 + 0.08})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = `rgba(18,12,8,${r() * 0.45})`;
        ctx.beginPath(); ctx.arc(x, y, rad * 0.65, 0, Math.PI * 2); ctx.fill();
    }
}

// ─── Venus ───────────────────────────────────────────────────────────────────
function venus(ctx: Ctx) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#bf8a0a'); g.addColorStop(0.35, '#e8b430');
    g.addColorStop(0.65, '#d09820'); g.addColorStop(1, '#a87010');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const r = seeded(73);
    // Cloud streaks
    for (let row = 0; row < H; row += 9) {
        const alpha = r() * 0.22 + 0.04;
        ctx.strokeStyle = r() > 0.5 ? `rgba(255,230,120,${alpha})` : `rgba(200,150,30,${alpha})`;
        ctx.lineWidth = r() * 7 + 2;
        ctx.beginPath(); ctx.moveTo(0, row);
        for (let x = 0; x < W; x += 24)
            ctx.lineTo(x, row + Math.sin(x / 38 + r() * 4) * 10);
        ctx.stroke();
    }
    // Bright cloud patches
    for (let i = 0; i < 18; i++) {
        ctx.fillStyle = `rgba(255,245,160,${r() * 0.18 + 0.04})`;
        ctx.beginPath();
        ctx.ellipse(r() * W, r() * H, r() * 50 + 12, r() * 14 + 4, r() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ─── Earth ───────────────────────────────────────────────────────────────────
function earth(ctx: Ctx) {
    // Ocean
    const og = ctx.createLinearGradient(0, 0, 0, H);
    og.addColorStop(0, '#183e80'); og.addColorStop(0.5, '#1e5298'); og.addColorStop(1, '#142c60');
    ctx.fillStyle = og; ctx.fillRect(0, 0, W, H);

    // ── Landmasses ──
    ctx.fillStyle = '#2e7d24';
    // North America
    ctx.beginPath();
    ctx.moveTo(78, 46); ctx.lineTo(168, 42); ctx.lineTo(184, 88);
    ctx.lineTo(168, 132); ctx.lineTo(138, 158); ctx.lineTo(118, 144);
    ctx.lineTo(82, 122); ctx.lineTo(68, 88); ctx.closePath(); ctx.fill();

    // South America
    ctx.beginPath();
    ctx.moveTo(148, 158); ctx.lineTo(184, 154); ctx.lineTo(195, 200);
    ctx.lineTo(174, 236); ctx.lineTo(148, 232); ctx.lineTo(132, 196); ctx.closePath(); ctx.fill();

    // Greenland
    ctx.fillStyle = '#a8c8a8';
    ctx.beginPath(); ctx.ellipse(192, 34, 18, 14, 0.3, 0, Math.PI * 2); ctx.fill();

    // Europe
    ctx.fillStyle = '#3a8a2a';
    ctx.beginPath();
    ctx.moveTo(238, 55); ctx.lineTo(278, 52); ctx.lineTo(288, 78); ctx.lineTo(272, 94);
    ctx.lineTo(248, 90); ctx.lineTo(232, 74); ctx.closePath(); ctx.fill();

    // Scandinavia
    ctx.beginPath(); ctx.ellipse(258, 42, 12, 18, -0.3, 0, Math.PI * 2); ctx.fill();

    // Africa
    ctx.fillStyle = '#4a8e22';
    ctx.beginPath();
    ctx.moveTo(242, 98); ctx.lineTo(286, 92); ctx.lineTo(298, 138); ctx.lineTo(292, 192);
    ctx.lineTo(272, 212); ctx.lineTo(248, 196); ctx.lineTo(236, 148); ctx.lineTo(238, 108); ctx.closePath(); ctx.fill();
    // Sahara tint
    ctx.fillStyle = 'rgba(180,150,80,0.45)';
    ctx.beginPath(); ctx.ellipse(262, 110, 32, 16, 0, 0, Math.PI * 2); ctx.fill();

    // Asia (main)
    ctx.fillStyle = '#2e7020';
    ctx.beginPath();
    ctx.moveTo(295, 52); ctx.lineTo(422, 48); ctx.lineTo(462, 72); ctx.lineTo(448, 114);
    ctx.lineTo(402, 124); ctx.lineTo(358, 132); ctx.lineTo(318, 118); ctx.lineTo(292, 98); ctx.closePath(); ctx.fill();

    // India
    ctx.beginPath(); ctx.ellipse(348, 148, 18, 30, 0.1, 0, Math.PI * 2); ctx.fill();

    // SE Asia
    ctx.beginPath(); ctx.ellipse(418, 142, 24, 20, 0.3, 0, Math.PI * 2); ctx.fill();

    // Australia
    ctx.fillStyle = '#8b7555';
    ctx.beginPath(); ctx.ellipse(420, 188, 40, 24, 0.1, 0, Math.PI * 2); ctx.fill();

    // Ice caps
    ctx.fillStyle = 'rgba(218,234,255,0.94)';
    ctx.fillRect(0, 0, W, 20); ctx.fillRect(0, H - 20, W, 20);
    const r = seeded(99);
    for (let x = 0; x < W; x += 6) {
        const dy = Math.sin(x * 0.12) * 7 + r() * 4;
        ctx.fillRect(x, 17 + dy, 6, 6); ctx.fillRect(x, H - 23 - dy, 6, 6);
    }

    // Clouds
    ctx.fillStyle = 'rgba(255,255,255,0.68)';
    for (let i = 0; i < 30; i++) {
        ctx.beginPath();
        ctx.ellipse(r() * W, r() * H, r() * 55 + 18, r() * 12 + 4, r() * 0.6, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ─── Mars ─────────────────────────────────────────────────────────────────────
function mars(ctx: Ctx) {
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#8c3908'); bg.addColorStop(0.45, '#b84a12');
    bg.addColorStop(0.75, '#a03c0a'); bg.addColorStop(1, '#7a2a06');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    const r = seeded(55);
    // Terrain variation
    for (let i = 0; i < 35; i++) {
        ctx.fillStyle = `rgba(158,72,18,${r() * 0.45 + 0.1})`;
        ctx.beginPath();
        ctx.ellipse(r() * W, r() * H, r() * 48 + 10, r() * 24 + 5, r() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
    }
    // Valles Marineris canyon
    ctx.fillStyle = 'rgba(48,12,4,0.65)';
    ctx.beginPath(); ctx.fillRect(155, 112, 218, 20);
    ctx.beginPath(); ctx.fillRect(148, 104, 45, 38); ctx.fill();
    ctx.beginPath(); ctx.fillRect(360, 108, 36, 32); ctx.fill();
    // Olympus Mons (shield volcano)
    ctx.fillStyle = 'rgba(165,78,22,0.55)';
    ctx.beginPath(); ctx.arc(95, 95, 30, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(80,25,8,0.4)';
    ctx.beginPath(); ctx.arc(95, 95, 10, 0, Math.PI * 2); ctx.fill();
    // Polar caps
    ctx.fillStyle = 'rgba(228,240,255,0.9)';
    ctx.beginPath(); ctx.ellipse(W / 2, 11, 88, 13, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(W / 2, H - 11, 72, 11, 0, 0, Math.PI * 2); ctx.fill();
    // Dust
    for (let i = 0; i < 14; i++) {
        ctx.fillStyle = `rgba(212,138,72,${r() * 0.2 + 0.04})`;
        ctx.beginPath();
        ctx.ellipse(r() * W, r() * H, r() * 65 + 18, r() * 28 + 8, r() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ─── Jupiter ─────────────────────────────────────────────────────────────────
function jupiter(ctx: Ctx) {
    const bands = [
        [0,  20,  '#c8a060'], [20, 12,  '#ecd498'], [32, 20,  '#b87a40'],
        [52, 22,  '#d4ae68'], [74, 10,  '#9a5028'], [84, 18,  '#e0c888'],
        [102, 14, '#c07838'], [116, 24, '#d8b870'], [140, 12, '#a06030'],
        [152, 16, '#ecd898'], [168, 20, '#b87a40'], [188, 20, '#d4a860'],
        [208, 14, '#985020'], [222, 14, '#dec880'], [236, 20, '#c8a060'],
    ];
    bands.forEach(([y, h, col]) => { ctx.fillStyle = col as string; ctx.fillRect(0, y as number, W, h as number); });
    const r = seeded(77);
    // Turbulence at band edges
    bands.forEach(([y, h]) => {
        ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, (y as number) + (h as number));
        for (let x = 0; x < W; x += 10)
            ctx.lineTo(x, (y as number) + (h as number) + Math.sin(x * 0.12 + r() * 6) * 3);
        ctx.stroke();
    });
    // Great Red Spot
    ctx.fillStyle = '#cc4a1c';
    ctx.beginPath(); ctx.ellipse(345, 166, 42, 24, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#a03010'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(345, 166, 42, 24, 0, 0, Math.PI * 2); ctx.stroke();
    for (let i = 1; i <= 3; i++) {
        ctx.strokeStyle = `rgba(170,50,12,${0.5 - i * 0.12})`; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.ellipse(345, 166, 42 - i * 10, 24 - i * 6, 0, 0, Math.PI * 2); ctx.stroke();
    }
}

// ─── Saturn ───────────────────────────────────────────────────────────────────
function saturn(ctx: Ctx) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#b09050'); g.addColorStop(0.3, '#d8b868');
    g.addColorStop(0.7, '#c8a855'); g.addColorStop(1, '#a88040');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const r = seeded(88);
    for (let y = 0; y < H; y += 18) {
        ctx.fillStyle = `rgba(${r() > 0.5 ? '200,155,72' : '145,105,38'},${r() * 0.14 + 0.04})`;
        ctx.fillRect(0, y, W, 9 + r() * 9);
    }
    const pg = ctx.createLinearGradient(0, 0, 0, H);
    pg.addColorStop(0, 'rgba(80,48,8,0.28)'); pg.addColorStop(0.18, 'rgba(0,0,0,0)');
    pg.addColorStop(0.82, 'rgba(0,0,0,0)');   pg.addColorStop(1, 'rgba(80,48,8,0.28)');
    ctx.fillStyle = pg; ctx.fillRect(0, 0, W, H);
}

// ─── Uranus ───────────────────────────────────────────────────────────────────
function uranus(ctx: Ctx) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#48c2c8'); g.addColorStop(0.5, '#5ad4d8'); g.addColorStop(1, '#38b2be');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const r = seeded(33);
    for (let y = 0; y < H; y += 22) {
        ctx.fillStyle = `rgba(255,255,255,${r() * 0.05})`;
        ctx.fillRect(0, y, W, 11);
    }
    ctx.fillStyle = 'rgba(190,245,248,0.18)';
    ctx.beginPath(); ctx.ellipse(W / 2, 22, W / 3, 22, 0, 0, Math.PI * 2); ctx.fill();
}

// ─── Neptune ──────────────────────────────────────────────────────────────────
function neptune(ctx: Ctx) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#1a2890'); g.addColorStop(0.4, '#2038a8');
    g.addColorStop(0.7, '#182aa8'); g.addColorStop(1, '#101878');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const r = seeded(66);
    // Cloud wisps
    for (let i = 0; i < 18; i++) {
        ctx.fillStyle = `rgba(160,178,255,${r() * 0.3 + 0.05})`;
        ctx.beginPath();
        ctx.ellipse(r() * W, r() * H, r() * 55 + 14, r() * 8 + 3, r() * 0.6, 0, Math.PI * 2);
        ctx.fill();
    }
    // Great Dark Spot
    ctx.fillStyle = 'rgba(4,8,60,0.62)';
    ctx.beginPath(); ctx.ellipse(285, 132, 48, 28, 0.2, 0, Math.PI * 2); ctx.fill();
    // Bright companion cloud
    ctx.fillStyle = 'rgba(200,215,255,0.48)';
    ctx.beginPath(); ctx.ellipse(314, 116, 28, 9, 0.2, 0, Math.PI * 2); ctx.fill();
}

// ─── Public API ───────────────────────────────────────────────────────────────
const drawFns: Record<string, (ctx: Ctx) => void> = {
    mercury, venus, earth, mars, jupiter, saturn, uranus, neptune,
};

export function generatePlanetTexture(id: string, scene: Scene): DynamicTexture {
    const tex = new DynamicTexture(`${id}-tex`, { width: W, height: H }, scene, true);
    const ctx = tex.getContext() as CanvasRenderingContext2D;
    (drawFns[id] ?? mercury)(ctx);
    tex.update(false);
    return tex;
}

export function generateParticleTex(scene: Scene): DynamicTexture {
    const tex = new DynamicTexture('ptex', { width: 64, height: 64 }, scene, false);
    const ctx = tex.getContext() as CanvasRenderingContext2D;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.25, 'rgba(255,210,80,0.9)');
    g.addColorStop(0.6, 'rgba(255,100,20,0.5)');
    g.addColorStop(1, 'rgba(255,60,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(32, 32, 32, 0, Math.PI * 2); ctx.fill();
    tex.update(false);
    return tex;
}

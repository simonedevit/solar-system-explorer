export type PlanetTextureParams = {
    color0: [number, number, number];
    color1: [number, number, number];
    color2: [number, number, number];
    bandStrength: number;
    cloudiness: number;
    iceCap: number;
    scale: number;
    seed: number;
};

export const PLANET_TEXTURES: Record<string, PlanetTextureParams> = {
    mercury: {
        color0: [0.18, 0.17, 0.15],
        color1: [0.42, 0.40, 0.36],
        color2: [0.60, 0.57, 0.52],
        bandStrength: 0, cloudiness: 0, iceCap: 0, scale: 2.8, seed: 1.1,
    },
    venus: {
        color0: [0.65, 0.52, 0.20],
        color1: [0.82, 0.72, 0.38],
        color2: [0.96, 0.90, 0.62],
        bandStrength: 0.25, cloudiness: 0.95, iceCap: 0, scale: 1.8, seed: 2.3,
    },
    earth: {
        color0: [0.04, 0.12, 0.52],
        color1: [0.12, 0.32, 0.14],
        color2: [0.52, 0.44, 0.28],
        bandStrength: 0, cloudiness: 0.48, iceCap: 0.32, scale: 2.2, seed: 3.7,
    },
    mars: {
        color0: [0.30, 0.09, 0.04],
        color1: [0.68, 0.24, 0.07],
        color2: [0.80, 0.56, 0.28],
        bandStrength: 0, cloudiness: 0.04, iceCap: 0.22, scale: 2.5, seed: 4.2,
    },
    jupiter: {
        color0: [0.45, 0.27, 0.12],
        color1: [0.76, 0.52, 0.30],
        color2: [0.94, 0.88, 0.76],
        bandStrength: 0.88, cloudiness: 0, iceCap: 0, scale: 1.4, seed: 5.9,
    },
    saturn: {
        color0: [0.55, 0.46, 0.22],
        color1: [0.78, 0.70, 0.42],
        color2: [0.95, 0.90, 0.68],
        bandStrength: 0.52, cloudiness: 0, iceCap: 0, scale: 1.2, seed: 6.1,
    },
    uranus: {
        color0: [0.28, 0.68, 0.75],
        color1: [0.42, 0.84, 0.86],
        color2: [0.64, 0.94, 0.94],
        bandStrength: 0.12, cloudiness: 0.1, iceCap: 0, scale: 0.9, seed: 7.4,
    },
    neptune: {
        color0: [0.06, 0.10, 0.58],
        color1: [0.12, 0.22, 0.82],
        color2: [0.28, 0.42, 0.95],
        bandStrength: 0.32, cloudiness: 0.18, iceCap: 0, scale: 1.1, seed: 8.8,
    },
};

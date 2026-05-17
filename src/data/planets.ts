export type PlanetData = {
    id: string;
    name: string;
    radius: number;
    orbitRadius: number;
    orbitSpeed: number;
    rotationSpeed: number;
    axialTilt: number;
    hasRings: boolean;
    // Material colours
    diffuse:  [number, number, number];
    emissive: [number, number, number]; // small atmospheric self-glow (GlowLayer amplifies this)
    fresnel:  [number, number, number]; // edge atmosphere colour for FresnelParameters
    fresnelPower: number;
    // Info card
    diameter:  string;
    distance:  string;
    dayLength: string;
    yearLength: string;
    fact:      string;
};

export const PLANETS: PlanetData[] = [
    {
        id: 'mercury', name: 'Mercury',
        radius: 0.20, orbitRadius: 5,   orbitSpeed: 0.047, rotationSpeed: 0.003, axialTilt: 0.03,
        hasRings: false,
        diffuse:  [0.55, 0.52, 0.47], emissive: [0.02, 0.02, 0.02], fresnel: [0.30, 0.28, 0.24], fresnelPower: 5.0,
        diameter: '4,879 km', distance: '57.9M km', dayLength: '1,408 hrs', yearLength: '88 days',
        fact: 'A year on Mercury is shorter than its day.',
    },
    {
        id: 'venus', name: 'Venus',
        radius: 0.30, orbitRadius: 7.5, orbitSpeed: 0.035, rotationSpeed: 0.001, axialTilt: 3.10,
        hasRings: false,
        diffuse:  [0.90, 0.76, 0.36], emissive: [0.08, 0.05, 0.01], fresnel: [1.0, 0.70, 0.15], fresnelPower: 2.2,
        diameter: '12,104 km', distance: '108.2M km', dayLength: '5,832 hrs', yearLength: '225 days',
        fact: 'Venus rotates backwards and has a hotter surface than Mercury.',
    },
    {
        id: 'earth', name: 'Earth',
        radius: 0.32, orbitRadius: 10,  orbitSpeed: 0.029, rotationSpeed: 0.010, axialTilt: 0.41,
        hasRings: false,
        diffuse:  [0.08, 0.30, 0.78], emissive: [0.01, 0.03, 0.08], fresnel: [0.18, 0.48, 1.0], fresnelPower: 2.5,
        diameter: '12,742 km', distance: '149.6M km', dayLength: '24 hrs', yearLength: '365 days',
        fact: 'Earth is the only known planet that harbors life.',
    },
    {
        id: 'mars', name: 'Mars',
        radius: 0.24, orbitRadius: 13,  orbitSpeed: 0.024, rotationSpeed: 0.010, axialTilt: 0.44,
        hasRings: false,
        diffuse:  [0.78, 0.22, 0.06], emissive: [0.06, 0.015, 0.002], fresnel: [0.85, 0.38, 0.12], fresnelPower: 3.5,
        diameter: '6,779 km', distance: '227.9M km', dayLength: '24.6 hrs', yearLength: '687 days',
        fact: 'Mars has the tallest volcano in the solar system.',
    },
    {
        id: 'jupiter', name: 'Jupiter',
        radius: 0.70, orbitRadius: 20,  orbitSpeed: 0.013, rotationSpeed: 0.025, axialTilt: 0.05,
        hasRings: false,
        diffuse:  [0.82, 0.62, 0.36], emissive: [0.05, 0.03, 0.01], fresnel: [0.92, 0.72, 0.38], fresnelPower: 2.2,
        diameter: '139,820 km', distance: '778.5M km', dayLength: '9.9 hrs', yearLength: '11.9 yrs',
        fact: "Jupiter's Great Red Spot is a storm larger than Earth.",
    },
    {
        id: 'saturn', name: 'Saturn',
        radius: 0.58, orbitRadius: 28,  orbitSpeed: 0.009, rotationSpeed: 0.023, axialTilt: 0.47,
        hasRings: true,
        diffuse:  [0.90, 0.82, 0.52], emissive: [0.06, 0.045, 0.015], fresnel: [1.0, 0.86, 0.48], fresnelPower: 2.2,
        diameter: '116,460 km', distance: '1.43B km', dayLength: '10.7 hrs', yearLength: '29.5 yrs',
        fact: 'Saturn is so light it could float on water.',
    },
    {
        id: 'uranus', name: 'Uranus',
        radius: 0.42, orbitRadius: 36,  orbitSpeed: 0.006, rotationSpeed: 0.014, axialTilt: 1.71,
        hasRings: false,
        diffuse:  [0.40, 0.84, 0.88], emissive: [0.025, 0.065, 0.07], fresnel: [0.35, 0.88, 1.0], fresnelPower: 2.0,
        diameter: '50,724 km', distance: '2.87B km', dayLength: '17.2 hrs', yearLength: '84 yrs',
        fact: 'Uranus rotates on its side with a 98° axial tilt.',
    },
    {
        id: 'neptune', name: 'Neptune',
        radius: 0.40, orbitRadius: 44,  orbitSpeed: 0.005, rotationSpeed: 0.015, axialTilt: 0.49,
        hasRings: false,
        diffuse:  [0.15, 0.25, 0.92], emissive: [0.01, 0.015, 0.065], fresnel: [0.22, 0.42, 1.0], fresnelPower: 2.0,
        diameter: '49,244 km', distance: '4.5B km', dayLength: '16.1 hrs', yearLength: '165 yrs',
        fact: 'Neptune has the strongest winds in the solar system.',
    },
];

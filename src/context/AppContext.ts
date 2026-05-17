import { createContext, useContext } from 'react';
import type { PlanetData } from '../data/planets';

type AppContextType = {
    selectedPlanet: PlanetData | null;
    setSelectedPlanet: (planet: PlanetData | null) => void;
};

export const AppContext = createContext<AppContextType>({
    selectedPlanet: null,
    setSelectedPlanet: () => {},
});

export const useAppContext = () => useContext(AppContext);

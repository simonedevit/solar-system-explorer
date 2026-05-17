import React, { useEffect, useState } from 'react';
import { Engine } from 'reactylon/web';
import { Scene } from 'reactylon';
import { Color4 } from '@babylonjs/core/Maths/math.color';
import { planetStore } from './store/planetStore';
import SolarSystem from './components/SolarSystem';
import PlanetInfo from './components/PlanetInfo';
import SunInfo from './components/SunInfo';
import SpeedControl from './components/SpeedControl';

const App: React.FC = () => {
    const [hintVisible, setHintVisible] = useState(true);

    useEffect(() => {
        return planetStore.subscribe(planet => {
            if (planet) setHintVisible(false);
        });
    }, []);

    return (
        <>
            <div className="app-header">
                <div className="app-title">Solar System</div>
                <div className="app-subtitle">Drag to rotate · Pinch to zoom</div>
            </div>
            <Engine>
                <Scene onSceneReady={scene => {
                    scene.clearColor = new Color4(0, 0, 0.012, 1);
                }}>
                    <SolarSystem />
                </Scene>
            </Engine>
            <div className={`tap-hint${hintVisible ? '' : ' hidden'}`}>
                Tap a planet to explore
            </div>
            <SpeedControl />
            <SunInfo />
            <PlanetInfo />
        </>
    );
};

export default App;

import React, { useEffect, useMemo } from 'react';
import { useScene } from 'reactylon';
import { ShaderMaterial } from '@babylonjs/core/Materials/shaderMaterial';
// JUSTIFIED: ShaderMaterial requires inline GLSL source as a constructor argument.
// No Reactylon JSX element exists for custom shader materials.
// The skybox sphere itself uses Reactylon <sphere> JSX.
import { STAR_VERT, STAR_FRAG } from '../shaders/shaders';

const StarField: React.FC = () => {
    const scene = useScene();

    // JUSTIFIED: ShaderMaterial — see import comment above.
    // useMemo keeps the reference stable so Babylon doesn't recreate it on re-renders.
    const mat = useMemo(() => {
        const m = new ShaderMaterial(
            'starMat', scene,
            { vertexSource: STAR_VERT, fragmentSource: STAR_FRAG },
            { attributes: ['position'], uniforms: ['worldViewProjection'] },
        );
        m.backFaceCulling  = false;
        m.disableDepthWrite = true;
        return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => () => { try { mat.dispose(); } catch {} }, []);

    return (
        // Reactylon <sphere> — infiniteDistance and ShaderMaterial applied via onCreate
        // since there is no <shaderMaterial> JSX element and infiniteDistance is post-creation.
        <sphere
            name="skybox"
            options={{ diameter: 500, segments: 6 }}
            isPickable={false}
            onCreate={sphere => {
                sphere.material         = mat;
                sphere.infiniteDistance = true;
            }}
        />
    );
};

export default StarField;

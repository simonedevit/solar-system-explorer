// ─── Star-field skybox (ShaderMaterial on inverted sphere) ───────────────────

export const STAR_VERT = `
precision highp float;
attribute vec3 position;
uniform mat4 worldViewProjection;
varying vec3 vDir;
void main() {
    gl_Position = worldViewProjection * vec4(position, 1.0);
    vDir = normalize(position);
}`;

export const STAR_FRAG = `
precision highp float;
varying vec3 vDir;

float H(vec3 p) { p=fract(p*vec3(443.897,441.423,437.195)); p+=dot(p.zxy,p.yxz+19.19); return fract(p.x*p.y*p.z); }
vec3 H3(vec3 p) { return fract(vec3(sin(dot(p,vec3(127.1,311.7,74.7))),sin(dot(p,vec3(269.5,183.3,246.1))),sin(dot(p,vec3(113.5,271.9,124.6))))*43758.5453); }
float N(vec3 p) {
    vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
    return mix(mix(mix(H(i),H(i+vec3(1,0,0)),f.x),mix(H(i+vec3(0,1,0)),H(i+vec3(1,1,0)),f.x),f.y),
               mix(mix(H(i+vec3(0,0,1)),H(i+vec3(1,0,1)),f.x),mix(H(i+vec3(0,1,1)),H(i+vec3(1,1,1)),f.x),f.y),f.z);
}
float fbm(vec3 p) { float v=0.0,a=0.5; for(int i=0;i<4;i++){v+=a*N(p);p=p*2.1+vec3(31.4,17.3,13.2);a*=0.5;} return v; }

float starLayer(vec3 d, float sc, float den) {
    vec3 p=d*sc, cell=floor(p), lc=fract(p); float best=0.0;
    for(int x=-1;x<=1;x++) for(int y=-1;y<=1;y++) for(int z=-1;z<=1;z++) {
        vec3 off=vec3(float(x),float(y),float(z));
        float b=H(cell+off);
        if(b>1.0-den){
            vec3 j=H3(cell+off)*0.82+0.09;
            float rel=(b-(1.0-den))/den;
            best=max(best, smoothstep(0.07+rel*0.07, 0.0, length(lc-off-j))*rel);
        }
    }
    return best;
}

void main() {
    vec3 d = normalize(vDir);
    float s = max(starLayer(d,34.0,0.036), max(starLayer(d,82.0,0.052), starLayer(d,150.0,0.072)));

    float temp = H(floor(d*34.0)+vec3(11.3,5.7,3.1));
    vec3 sc = temp<0.20 ? vec3(0.62,0.76,1.00) : temp<0.60 ? vec3(1.0,1.0,1.0) : temp<0.85 ? vec3(1.0,0.91,0.70) : vec3(1.0,0.77,0.52);

    float n1=fbm(d*2.2), n2=fbm(d*4.8+n1*0.6+1.7);
    vec3 neb = vec3(0.018,0.004,0.046)*n1*n2*1.8
             + vec3(0.004,0.009,0.044)*fbm(d*3.1+2.3)*0.5
             + vec3(0.036,0.005,0.015)*fbm(d*2.6+5.1)*0.4;

    gl_FragColor = vec4(vec3(0.003,0.003,0.009) + max(neb,vec3(0.0)) + sc*s*1.4, 1.0);
}`;

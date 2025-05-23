uniform vec3 color;
uniform vec3 flashColor;
uniform float flash;
uniform float alpha;
varying vec2 vUv;
uniform sampler2D uTexture;
uniform sampler2D uTextureDamage;

void main() {
    if(flash > 0.0) {
        vec4 texture = texture2D(uTextureDamage, vUv)  * vec4(color, 1.0);
        texture.rgb = mix(texture.rgb, flashColor, flash);
        texture.a *= alpha;
        gl_FragColor = texture;
    } else {
        vec4 texture = texture2D(uTexture, vUv)  * vec4(color, 1.0);
        texture.rgb = mix(texture.rgb, flashColor, flash);
        texture.a *= alpha;
        gl_FragColor = texture;
    }
}
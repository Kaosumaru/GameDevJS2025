uniform float hp;
uniform float maxHp;
uniform float shield;
uniform vec2 iResolution;

varying vec2 vUv;

float udRoundBox( vec2 p, vec2 b, float r )
{
    return length(max(abs(p)-b+r,0.0))-r;
}

void main() 
{
    vec2 uv = vUv/iResolution.xy;

    vec3 red = vec3(1,0,0);
    vec3 black = vec3(0,0,0);
    vec3 green = vec3(0,1,0);
    vec3 blue = vec3(0,0,1);
    
    float x = uv.x * (maxHp + shield - 0.1);
    float index = floor(x);
    x = fract(x);
    
    vec3 col = red;
    
    if (index < hp)
    {
        if (x < 0.9)
        {
            col = green;
        }
        else
        {
            col = black;
        }
    } else if (index >= maxHp) {
        if (x < 0.9)
        {
            col = blue;
        }
        else
        {
            col = black;
        }
    }
    if(maxHp == 1.0) {
        col = green;
    }

    gl_FragColor = vec4(col, 1.0);
}
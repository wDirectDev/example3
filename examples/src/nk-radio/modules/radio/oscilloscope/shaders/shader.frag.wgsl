
@group(0) @binding(0) var <uniform> bindShaderFlag : u32;
@group(1) @binding(0) var bindSampler : sampler;
@group(1) @binding(1) var bindTexture : texture_2d<f32>;

@fragment
fn main( @location(0) inFragUV : vec2<f32>, @location(1) inColor : vec4<f32> ) -> @location(0) vec4<f32> 
{
    var color: vec4<f32> = inColor;
    if ( bindShaderFlag == u32( 10 ) ) {
        color = textureSample( bindTexture, bindSampler, inFragUV );
    }
    return color;
}

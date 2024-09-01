
struct fragmentEntry {
    @builtin(position) outPosition: vec4<f32>,
    @location(0) outFragUV : vec2<f32>,
    @location(1) outColor : vec4<f32>,
}

@vertex
fn main( @location(0) inPosition: vec2<f32>, @location(1) inFragUV : vec2<f32>, @location(2) inColor : vec4<f32> ) -> fragmentEntry {
    var vertex: fragmentEntry;
    vertex.outPosition = vec4<f32>(inPosition, 0.0, 1.0);
    vertex.outFragUV = inFragUV;
    vertex.outColor = inColor;
    return vertex;
}

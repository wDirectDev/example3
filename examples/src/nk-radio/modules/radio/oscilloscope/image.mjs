import { wDObject } from './object.mjs';

export class wDImage extends wDObject
{
    constructor( instance, url ) 
    {
        super( instance, 0, 0, 0, 0 );
	    this.setURL( url );
    }

    destroy() {
        this.setColorsBuffer( null );
        this.setFragUVBuffer( null );
        this.setVertexBuffer( null );
	    this.setTextureImage( null );
	    this.setUniformShaderLocation( null );
    }
    async init() {
	    let instance = this.getInstance();
        this.setColorsBuffer( null );
        this.setFragUVBuffer( null );
        this.setVertexBuffer( null );
        this.setTextureImage( null );
        this.setTextureBindGroup( null );
        this.setShaderBindGroup( null );
        this.setUniformShaderLocationFlag( instance.device, 10 );
        this.setTextureImage( 
            await this.loadTextureImage( instance.device, this.getURL() )
        );
        this.setDuty( false );
    }
    set( x, y, _width = -1, _height = -1)
    {
        if ( this.getX() != x ) {
            this.setX( x );
            this.setDuty( true );
        }
        if ( this.getY() != y ) {
            this.setY( y );
            this.setDuty( true );
        }
        if ( _width != -1 ) {
            if ( this.getWidth() != _width ) {
                this.setWidth( _width );
                this.setDuty( true );
            }
        }
        if ( _height != -1 ) { 
            if ( this.getHeight() != _height ) {
                this.setHeight( _height );
                this.setDuty( true );
            }
        }
    }
    getURL() { 
        return this.locationURL;
    }
    setURL( url ) {
        this.locationURL = url;
    }
    setTextureBindGroup( group )
    {
        this.textureBindGroup = group;
    }
    getTextureBindGroup() 
    {
        return this.textureBindGroup;
    }    
    setShaderBindGroup( group )
    {
        this.shaderBindGroup = group;
    }
    getShaderBindGroup() 
    {
        return this.shaderBindGroup;
    }  
    webGPUTextureFromImageBitmapOrCanvas(gpuDevice, source, generateMipmaps = true) 
    {
        const textureDescriptor = {
          size: { width: source.width, height: source.height, depthOrArrayLayers: 1 },
          format: 'rgba8unorm',
          usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
        };
      
        if (generateMipmaps) {
          textureDescriptor.mipLevelCount = 3; // Math.floor(Math.log2(Math.max(source.width, source.height))) + 1;
          textureDescriptor.usage |= GPUTextureUsage.RENDER_ATTACHMENT;
        }
      
        const texture = gpuDevice.createTexture(textureDescriptor);
      
        gpuDevice.queue.copyExternalImageToTexture({ source }, { texture }, textureDescriptor.size);
      
        if (generateMipmaps) {
          this.webGPUGenerateMipmap(gpuDevice, texture, textureDescriptor);
        }

        return texture;
    }
    webGPUGenerateMipmap(gpuDevice, texture, textureDescriptor) 
    {
        // Create a simple shader that renders a fullscreen textured quad.
        const mipmapShaderModule = gpuDevice.createShaderModule({
          code: `
            var<private> pos : array<vec2<f32>, 4> = array<vec2<f32>, 4>(
              vec2<f32>(-1.0, 1.0), vec2<f32>(1.0, 1.0),
              vec2<f32>(-1.0, -1.0), vec2<f32>(1.0, -1.0));
      
            struct vertexOutput {
              @builtin(position) position : vec4<f32>,
              @location(0) texCoord : vec2<f32>
            };
      
            @vertex
            fn vertexMain(@builtin(vertex_index) vertexIndex : u32) -> vertexOutput {
              var output : vertexOutput;
              output.texCoord = pos[vertexIndex] * vec2<f32>(0.5, -0.5) + vec2<f32>(0.5);
              output.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);
              return output;
            }
      
            @group(0) @binding(0) var bindSampler : sampler;
            @group(0) @binding(1) var bindTexture : texture_2d<f32>;
      
            @fragment
            fn fragmentMain(@location(0) texCoord : vec2<f32>) -> @location(0) vec4<f32> {
              return textureSample(bindTexture, bindSampler, texCoord);
            }
          `
        });
      
        const pipeline = gpuDevice.createRenderPipeline({
          vertex: {
            module: mipmapShaderModule,
            entryPoint: 'vertexMain',
          },
          fragment: {
            module: mipmapShaderModule,
            entryPoint: 'fragmentMain',
            targets: [{
              format: textureDescriptor.format // Make sure to use the same format as the texture
            }],
          },
          primitive: {
            topology: 'triangle-strip',
            stripIndexFormat: 'uint32',
          },
          layout: 'auto',
        });
      
        const sampler = gpuDevice.createSampler({ magFilter: 'nearest', minFilter: 'nearest' });
      
        let srcView = texture.createView({
            baseMipLevel: 0,
            mipLevelCount: 3
        });
      
        // Loop through each mip level and renders the previous level's contents into it.
        const commandEncoder = gpuDevice.createCommandEncoder({});
        for (let i = 1; i < textureDescriptor.mipLevelCount; ++i) 
        {
            const dstView = texture.createView({
                baseMipLevel: i,  // Make sure we're getting the right mip level...
                mipLevelCount: 1 // And only selecting one mip level
            });
            const passEncoder = commandEncoder.beginRenderPass({
                colorAttachments: [{
                    view: dstView, // Render pass uses the next mip level as it's render attachment.
                    loadValue: [ 0.0, 0.0, 0.0, 0.5 ],
                    loadOp: 'clear',
                    storeOp: 'store'
                }],
            });
            const bindGroup = gpuDevice.createBindGroup({
                layout: pipeline.getBindGroupLayout(0),
                entries: [{
                    binding: 0,
                    resource: sampler,
                },{
                    binding: 1,
                    resource: srcView,
                }],
            });
      
            passEncoder.setPipeline(pipeline);
            passEncoder.setBindGroup(0, bindGroup);
            passEncoder.draw(4);
            passEncoder.end();
      
            srcView = dstView;
        }
        gpuDevice.queue.submit([commandEncoder.finish()]);
    }

    async loadTextureImageFromTexture()
    {

    }
    
    async loadTextureImage( device, url ) 
    {
        let response = await fetch(
//            new URL( "webgpu/dist/" + url, window.location.href ).toString()
            new URL( url, window.location.href ).toString()
        );
	
        let source = await createImageBitmap( await response.blob() );
//        return this.webGPUTextureFromImageBitmapOrCanvas( device, source, true );

        let texture = device.createTexture({
            size: [source.width, source.height, 1],
            format: 'rgba8unorm',
            usage:
                GPUTextureUsage.TEXTURE_BINDING |
                GPUTextureUsage.COPY_DST |
                GPUTextureUsage.RENDER_ATTACHMENT,
        });
        
        device.queue.copyExternalImageToTexture(
            { source: source },
            { texture: texture },
            [ source.width, source.height]
        );

	    return texture;
    }

    setTextureImage( textureImage ) 
    {
        this.textureImage = textureImage;
    }

    getTextureImage() 
    {
        return this.textureImage;
    }

    setVertexBuffer( vertex )
    {
        if ( this.vertexBuffer != null )
            this.vertexBuffer.destroy();
        this.vertexBuffer = vertex;
    }

    getVertexBuffer() 
    {
        return this.vertexBuffer;
    }

    setFragUVBuffer( fragUV )
    {
        if ( this.fragUVBuffer != null )
            this.fragUVBuffer.destroy();
        this.fragUVBuffer = fragUV;
    }

    getFragUVBuffer()
    {
        return this.fragUVBuffer;
    }

    setColorsBuffer( colors )
    {
        if ( this.colorsBuffer != null )
            this.colorsBuffer.destroy();
        this.colorsBuffer = colors;
    }

    getColorsBuffer() 
    {
        return this.colorsBuffer;
    }

    getVertex()
    {
        let objectWidth = this.getWidth();
        let objectHeight = this.getHeight();
        let offsetX = this.getX();
        let offsetY = this.getY();
        return new Float32Array( [
            this.instance.calcX( objectWidth + offsetX ), this.instance.calcY( objectHeight + offsetY ),
            this.instance.calcX( objectWidth + offsetX ), this.instance.calcY( offsetY ),
	    this.instance.calcX( offsetX ), this.instance.calcY( offsetY ),
            this.instance.calcX( objectWidth + offsetX ), this.instance.calcY( objectHeight + offsetY ),
	    this.instance.calcX( offsetX ), this.instance.calcY( offsetY ),
            this.instance.calcX( offsetX ), this.instance.calcY( objectHeight + offsetY )
        ] );
    }

    getFragUV()
    {
        return new Float32Array([
            1.0, 1.0,
            1.0, 0.0,
            0.0, 0.0,
            1.0, 1.0,
            0.0, 0.0,
            0.0, 1.0
        ]);
    }

    getColors( color = [ 0.0, 1.0, 1.0, 1.0 ] )
    {
	    let transparentColor = [ 0.0, 0.0, 0.0, 0.0 ];
        let colorsBuffer = new Float32Array( 24 );
        let objectIndex = 0;
        for ( let i = 0; i < 4; i++ ) colorsBuffer[objectIndex++] = color[i];
        for ( let i = 0; i < 4; i++ ) colorsBuffer[objectIndex++] = color[i];
        for ( let i = 0; i < 4; i++ ) colorsBuffer[objectIndex++] = transparentColor[i];
        for ( let i = 0; i < 4; i++ ) colorsBuffer[objectIndex++] = color[i];
        for ( let i = 0; i < 4; i++ ) colorsBuffer[objectIndex++] = transparentColor[i];
        for ( let i = 0; i < 4; i++ ) colorsBuffer[objectIndex++] = color[i];	
        return colorsBuffer;
    }

    async draw( instance, color = [ 1.0, 1.0, 1.0, 1.0 ] ) 
    {
        let flag = this.isDuty();

        if ( flag == true ) {
            this.setColorsBuffer( null );
            this.setFragUVBuffer( null );
            this.setVertexBuffer( null );
        }

        let textureImage = this.getTextureImage();
        if ( textureImage == null ) {
            textureImage = await this.loadTextureImage( instance.device, this.getURL() );
            this.setTextureImage( textureImage );
        }

	    let vertexBuffer = this.getVertexBuffer();
        if ( vertexBuffer == null ) {
		    vertexBuffer = this.instance.createBuffer(this.getVertex(), GPUBufferUsage.VERTEX, this.instance.device );
            this.setVertexBuffer( vertexBuffer );
        }
        
        let fragUVBuffer = this.getFragUVBuffer();
        if ( fragUVBuffer == null ) {
		    fragUVBuffer = this.instance.createBuffer( this.getFragUV(), GPUBufferUsage.VERTEX, this.instance.device );
            this.setFragUVBuffer( fragUVBuffer );
        }

        let colorsBuffer = this.getColorsBuffer();
        if ( colorsBuffer == null ) {
		    colorsBuffer = this.instance.createBuffer( this.getColors( color ), GPUBufferUsage.VERTEX, this.instance.device );
            this.setColorsBuffer( colorsBuffer );
        }

        let shaderBindGroup = this.getShaderBindGroup();
        if ( shaderBindGroup == null ) {
                shaderBindGroup = instance.device.createBindGroup( {
                layout: instance.pipeline.getBindGroupLayout( 0 ),
                entries: [ {
                    binding: 0,
                    resource: {
                        buffer: this.uniformShaderLocation
                    }
                } ]
            } );
            this.setShaderBindGroup( shaderBindGroup ); 
        }

        let textureBindGroup = this.getTextureBindGroup();
        if ( textureBindGroup == null ) {
                textureBindGroup = instance.device.createBindGroup( {
                layout: instance.pipeline.getBindGroupLayout(1),
                entries: [ {
                    binding: 0,
                    resource: instance.sampler,
                }, {
                    binding: 1,
                    resource: this.textureImage.createView({
                        baseMipLevel: 0,
                        mipLevelCount: 1
                    }),
                } ]
            } );
            this.setTextureBindGroup( textureBindGroup );
        }

        instance.passEncoder.setBindGroup( 0, shaderBindGroup );
        instance.passEncoder.setBindGroup( 1, textureBindGroup );

        instance.passEncoder.setVertexBuffer( 0, vertexBuffer );
        instance.passEncoder.setVertexBuffer( 1, fragUVBuffer );
        instance.passEncoder.setVertexBuffer( 2, colorsBuffer );

        instance.passEncoder.draw( 6, 1, 0, 0 );
        
        this.resetDuty();
    }
};

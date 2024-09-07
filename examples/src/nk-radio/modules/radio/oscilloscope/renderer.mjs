import { wDCircle } from './circle.mjs';
import { wDLine } from './line.mjs';
import { wDNativeLine } from './line-native.mjs';
import { wDPoint } from './point.mjs';
import { wDBox } from './box.mjs';
import { wDSpline } from './spline.mjs';
import { wDLabel } from './label.mjs';
import { wDImage } from './image.mjs';
import { wDGoniometer } from './goniometer.mjs';

// import vertexShaderWgslCode from 'shaders/shader.vert.wgsl'
// import fragmentShaderWgslCode from 'shaders/shader.frag.wgsl'
// import computeShaderWgslCode from 'shaders/blur.compute.wgsl'

export class wDApplication
{
    constructor(CONFIG) 
    {
	    this.setConfig(CONFIG);
        this.setShaderBindGroup( null );
        this.setTextureBindGroup( null );
    }
    setConfig(CONFIG)
    {
	    this.CONFIG = CONFIG;        
    }
    getConfig()
    {
        return this.CONFIG;
    }
    getBorderWidth()
    {
        return this.borderwidth;
    }
    setBorderWidth( _w )
    {
        this.borderwidth = _w;
    }
    setCanvas( canvas )
    {
        this.setChartCanvas( canvas );
    }
    setChartCanvas( canvas ) 
    {
        this.canvas = canvas;
    }
    getCanvas()
    {
        return this.getChartCanvas();
    }
    getChartCanvas() 
    {
        return this.canvas;
    }
    getDrawWidth()
    {
        return this.drawwidth;
    }
    setDrawWidth( _w )
    {
        this.drawwidth = _w;
    }
    getDrawHeight()
    {
        return this.drawheight;
    }
    setDrawHeight( _h )
    {
        this.drawheight = _h;
    }
    getCanvasWidth( _wbw = true ) 
    {
        if ( _wbw == true ) return this.canvas.width;
        let _bw = this.getBorderWidth() * 2.0;
        let _w  = this.canvas.width - _bw;
        return _w;
    }
    getCanvasHeight( _wbw = true ) 
    {
        if ( _wbw == true ) return this.canvas.height;
        let _bw = this.getBorderWidth() * 2.0;
        let _h = this.canvas.height - _bw;
        return _h;
    }
    calcXtoS( cx ) 
    {
        return this.calcRX( cx );
    }
    calcYtoS( cy ) 
    {
        return this.calcRY( cy );
    }

    getScaledPixelOffsetX( _cx )
    {
        return ( _cx * this.getScaledSizeOfPixelX() - 1.0 );
    }
    
    getScaledPixelOffsetY( _cy )
    {
        return ( 1.0 - _cy * this.getScaledSizeOfPixelY() );
    }

    getScaledOffsetX( _cx )
    {
        return ( _cx - 1.0 );
    }
    
    getScaledOffsetY( _cy )
    {
        return ( 1.0 - _cy );
    }

    getScaledX( cx )
    {
        return ( cx * this.getScaledSizeOfPixelX() );
    }

    getScaledY( cy )
    {
        return ( cy * this.getScaledSizeOfPixelY() );
    }

    getScaledSizeOfPixelX()
    {
        return 2.0 / this.getCanvasWidth();
    }

    getScaledSizeOfPixelY()
    {
        return 2.0 / this.getCanvasHeight();
    }

    ///////////////////////////////////////////////////////////////////////////////////////////
    // translation from webgpu to screen coordinates (0 : 1366)
    calcRX( cx ) 
    {
        let cw = Math.fround( this.getCanvasWidth() / 2.0 );
        let point = 1.0 / cw;
        return Math.round( ( cx + 1.0 ) / point );
    }
    ///////////////////////////////////////////////////////////////////////////////////////////
    // translation from webgpu to screen coordinates (0 : 1366)
    calcRY( cy ) 
    {
        let ch = Math.fround( this.getCanvasHeight() / 2.0 );
        let point = 1.0 / ch;
        return this.getCanvasHeight() - Math.round( ( cy + 1.0 ) / point );
    }
    calcStoX( cx ) 
    {
        return this.calcX( cx );
    }
    calcStoY( cy ) 
    {
        return this.calcY( cy );
    }

    
    ///////////////////////////////////////////////////////////////////////////////////////////
    // translation screen to webgpu coordinates -1 : +1
    calcX( cx ) 
    {
        let cw = this.getCanvasWidth();
        // cx = cx + this.getBorderWidth();
        let translate = 2.0 * cx / cw - 1.0;
        return translate;
    }
    ///////////////////////////////////////////////////////////////////////////////////////////
    // translation screen to webgpu coordinates -1 : +1
    calcY( cy ) 
    {
        let ch = this.getCanvasHeight();
        // cy = cy + this.getBorderWidth();
        let translate = 1.0 - 2.0 * cy / ch;
        return translate;
    }
    createAppUniformShaderLocationFlag( device, shaderFlag = 0 )
    {
        if ( device == null ) {
            this.setAppUniformShaderLocation( null );
        } else {
            this.setAppUniformShaderLocation( 
                this.setAppUniformShaderFlag( device, shaderFlag ) 
            );
        }
    } 
    setAppUniformShaderLocation( _uniform )
    {
        if ( this.uniformShaderLocation != null ) 
            this.uniformShaderLocation.destroy();
                this.uniformShaderLocation = _uniform;
    }
    getAppUniformShaderLocation()
    {
    	return this.uniformShaderLocation;
    }
    setAppUniformShaderFlag( device, shaderValue )
    {
        let source = new Uint32Array(1);
        source[0] = shaderValue;
        const uniformBuffer = device.createBuffer( {
            label: 'Uniform flag buffer',
            size: source.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
        } );
        device.queue.writeBuffer(uniformBuffer, 0, source);
	    return uniformBuffer;
    }
    attachBuffer(source, destination) 
    {
        const arrayBuffer = destination.getMappedRange();
        ( source instanceof Uint16Array )
                ? (new Uint16Array(arrayBuffer)).set(source)
                : (source instanceof Uint32Array) 
			? (new Uint32Array(arrayBuffer)).set(source)
			: (new Float32Array(arrayBuffer)).set(source)
        destination.unmap();
        return destination;
    }
    createBuffer(source, usage, device) 
    {
        const destination = device.createBuffer( {
            mappedAtCreation: true,
            size: source.byteLength,
            usage: usage
        } );
	    return this.attachBuffer(source, destination) 
    }
    createOnlyBuffer(size, usage, device) 
    {
        return device.createBuffer( {
            mappedAtCreation: true,
            size: size,
            usage: usage
        } );
    }
    check()
    {
        try {
            if ( navigator.gpu != null && navigator.gpu != undefined ) {
		return true;
            } else {
		return false;
            }
        } catch ( e ) {
            throw( e );
        }
    }
    async init()
    {	
        try {

            this.adapter = await navigator.gpu.requestAdapter();
            this.device = await this.adapter.requestDevice();

            if ( !this.context )
                this.context = this.canvas.getContext('webgpu');

            this.presentationFormat = navigator.gpu.getPreferredCanvasFormat();

            this.context.configure({
                device: this.device,
                format: 'bgra8unorm',
                size: [ this.getCanvasWidth(), this.getCanvasHeight(), 1 ],
                alphaMode:  "premultiplied",
//                compositingAlphaMode: "premultiplied",
                usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC
            });

            this.pipeline = this.device.createRenderPipeline( {
                layout: 'auto',
                vertex: {
                        module: this.device.createShaderModule({
                            code: `

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

`
                        }),
                        entryPoint: 'main',
                        buffers: [
                        {
                            attributes: [{
                                shaderLocation: 0, // [[location(0)]]
                                offset: 0,
                                format: 'float32x2'
                            }],
                            arrayStride: 4 * 2, // sizeof(float) * 3
                            stepMode: 'vertex'
                        }, 
                        {
                            attributes: [{
                                shaderLocation: 1, // [[location(0)]]
                                offset: 0,
                                format: 'float32x2'
                            }],
                            arrayStride: 4 * 2, // sizeof(float) * 3
                            stepMode: 'vertex'
                        }, 
                        {
                            attributes: [{
                                shaderLocation: 2, // [[location(0)]]
                                offset: 0,
                                format: 'float32x4'
                            }],
                            arrayStride: 4 * 4, // sizeof(float) * 3
                            stepMode: 'vertex'
                        } ]
                },
                fragment: {
                    module: this.device.createShaderModule({
                        code: `

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

`
                    }),
                    entryPoint: 'main',
                    targets: [{
                        format: 'bgra8unorm'
                    }]
                },
                primitive: {
                    topology: 'triangle-list',
    /////////////////////////////////////////////////////////////////////////
    // Backface culling since the cube is solid piece of geometry.
    // Faces pointing away from the camera will be occluded by faces
    // pointing toward the camera.
    /////////////////////////////////////////////////////////////////////////
    //                cullMode: 'back',
    /////////////////////////////////////////////////////////////////////////
    // Enable depth testing so that the fragment closest to the camera
    // is rendered in front.
    /////////////////////////////////////////////////////////////////////////
    //              depthStencil: {
    //                  depthWriteEnabled: true,
    //                  depthCompare: 'less',
    //                  format: 'depth24plus',
    //              },
                } 
            });

            this.createAppUniformShaderLocationFlag( this.device, 0 );

            this.sampler = this.device.createSampler({
                magFilter: 'nearest',  // nearest | linear
                minFilter: 'nearest'   // nearest | linear
            });

            this.texture = this.device.createTexture({
                size: [ 1, 1, 1 ],
                format: 'rgba8unorm',
                usage:
                    GPUTextureUsage.TEXTURE_BINDING |
                    GPUTextureUsage.COPY_DST |
                    GPUTextureUsage.RENDER_ATTACHMENT,
            });

            this.renderPassDesc = {
                colorAttachments: [ {
                    clearValue: [ 0.0, 0.0, 0.0, 0.00 ],
                    loadOp: 'clear',
                    storeOp: 'store'
                }]          
            };

            this.setBorderWidth( 0.0 );
        }
        catch (e)
        {
            console.error(e);
        }
    }

    start = async() => {
        await this.init();
        await this.resources();
        return requestAnimationFrame( this.render );    
    }

    async resources()
    {
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        //        this.spline = new GSpline( 0, 0, this.getCanvasWidth(), this.getCanvasHeight() );
        ////////////////////////////////////////////////////////////////////////////////////////////////////////

        // this.box = new wDBox( this );
        // await this.box.init();

        this.setDrawWidth( this.getCanvasWidth( false ) );
        this.setDrawHeight( this.getCanvasHeight( false ) );

        this.image = new wDImage( this, "assets/Di-3d.png" );
        await this.image.init();

        this.spline = new wDSpline( this, 0, 0, this.getCanvasWidth(), this.getCanvasHeight() );
        await this.spline.init();

        this.point = new wDPoint( this );
        await this.point.init();

        this.goniometer = new wDGoniometer( this );
        await this.goniometer.init();

        //this.label = new wDLabel( this, 'lighter', 10, 'Segoe UI Light', 0, 0, 128, 128 );
        //await this.label.init();

        this.edgeline = new wDNativeLine( this );
        await this.edgeline.init();

        this.circle = new wDCircle( this );
        await this.circle.init();

        this.color = 0.0;
        this.colorStep = 0.01;
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
    render = async() => {

        const CONFIG = this.getConfig();

        let texture = this.context.getCurrentTexture();
        this.renderPassDesc.colorAttachments[0].view = texture.createView();

        this.commandEncoder = this.device.createCommandEncoder();
        this.passEncoder = this.commandEncoder.beginRenderPass( this.renderPassDesc );

        this.passEncoder.setViewport(
            0,
            0,
            this.getCanvasWidth(),
            this.getCanvasHeight(),
            0,
            1
        );

        this.passEncoder.setScissorRect(
            this.getBorderWidth(),
            this.getBorderWidth(),
            this.getCanvasWidth( false ),
            this.getCanvasHeight( false )
        );

        let shaderBindGroup = this.getShaderBindGroup();
	    if ( shaderBindGroup == null ) {
            shaderBindGroup = this.device.createBindGroup( {
                layout: this.pipeline.getBindGroupLayout(0),
                entries: [ {
                    binding: 0,
                    resource: {
                        buffer: this.uniformShaderLocation,
                    }
                } ]
            } );
            this.setShaderBindGroup( shaderBindGroup );
        }

        let textureBindGroup = this.getTextureBindGroup();
	    if ( textureBindGroup == null ) {
            textureBindGroup = this.device.createBindGroup( {
                layout: this.pipeline.getBindGroupLayout( 1 ),
                entries: [
                    {
                        binding: 0,
                        resource: this.sampler,
                    },
                    {
                        binding: 1,
                        resource: this.texture.createView( {
                            baseMipLevel: 0,
                            mipLevelCount: 1
                        } )
                    }
                ]
            } );
            this.getTextureBindGroup( textureBindGroup );
        }

        this.passEncoder.setPipeline( this.pipeline );

        this.passEncoder.setBindGroup( 0, shaderBindGroup );
        this.passEncoder.setBindGroup( 1, textureBindGroup );

        this.color += this.colorStep;

        if ( this.color >= 1.0 ) {
            this.colorStep = -0.01;
            this.color = 1.0;
        } else if ( this.color < 0 ) {
            this.colorStep = +0.01;
            this.color = 0;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Draw image
        ////////////////////////////////////////////////////////////////////////////////

        let sBW = this.getBorderWidth();

        let sW = this.getCanvasWidth( false );
        let sH = this.getCanvasHeight( false );

        let thickness = 2;
        let pluginId = 0;
/*
        this.edgeline.clear();
        this.edgeline.append( 20, 20, 100, 100, 10, { from: [ 1.0, 1.0, 1.0, 1.0 ], to: [ 0.0, 0.0, 1.0, 1.0 ] } );
        this.edgeline.append( 20, 100, 100, 20, 10, { from: [ 1.0, 1.0, 1.0, 1.0 ], to: [ 0.0, 0.0, 1.0, 1.0 ] } );

        this.edgeline.append( 120, 120, 40, 40, 10, { from: [ 1.0, 1.0, 1.0, 1.0 ], to: [ 0.0, 0.0, 1.0, 1.0 ] } );
        this.edgeline.append( 120, 40, 40, 120, 10, { from: [ 1.0, 1.0, 1.0, 1.0 ], to: [ 0.0, 0.0, 1.0, 1.0 ] } );

        this.edgeline.draw( this );
*/

//        this.point.append(30,30,10,[ 1.0, 1.0, 1.0, 1.0 ]);
//        this.point.draw( this );

//        this.circle.set( 100, 100, 30, thickness);
//        this.circle.draw( this );

        ////////////////////////////////////////////////////////////////////////////////
        // Load config from file...
        // let object = window.getDrawParams.call();
        ////////////////////////////////////////////////////////////////////////////////
        this.spline.set( sBW, sBW, sW, sH, thickness, 4 );

        let iW = 100 * this.color * 4;
        let iH = 100 * this.color * 4;

        let iX = sBW + ( sW - iW ) / 2.0;
        let iY = sBW + ( sH - iH ) / 2.0;

/*      
        /////////////////////////////////////////////////////////////////////////////////////////////////
        // Any other plugin ( 1;2;4;8;16;32;64;128;256 )
        /////////////////////////////////////////////////////////////////////////////////////////////////
        if ( CONFIG.application.go1 == "go1-on" ) {
            pluginId = pluginId | 2;
        }
*/    

        if ( CONFIG.application.goniometer == "goniometer-on" ) {
            pluginId = pluginId | 1;
        }
    
        if ( CONFIG.queue.instance != undefined || CONFIG.queue.instance != null ) {
            let bufferSize = ( ( CONFIG.application.sampleRate < 44100 ) ? 44100 : CONFIG.application.sampleRate ) / 25;

            let _b = [2];
            _b[0] = new Float64Array(bufferSize);
            _b[1] = new Float64Array(bufferSize);

            let rc = CONFIG.queue.instance.pull( _b, bufferSize );
            if ( rc == true )
            {
                CONFIG.application.renderBuffer = new Float64Array(bufferSize * 2);
                for ( let i = 0; i < bufferSize; i++ ) {
                    CONFIG.application.renderBuffer[i * 2 + 0] = _b[0][i];
                    CONFIG.application.renderBuffer[i * 2 + 1] = _b[1][i];
                }
            }
            //console.debug( "draw: queue.pull [ " + ( ( r == true ) ? "true" : "false" ) + " ]" );
        }
 
        /////////////////////////////////////////////////////////////////////////////////////////////////
        // Цвета... #5661FA #FA5769
        /////////////////////////////////////////////////////////////////////////////////////////////////
        let _colors = [
            { from: [ 1.0, 1.0, 0.0, 1.0 ], to: [ 1.0, 1.0, 0.0, 1.0 ] },
            { from: [ 0.0, 1.0, 1.0, 1.0 ], to: [ 0.0, 1.0, 1.0, 1.0 ] },
        ];

        /////////////////////////////////////////////////////////////////////////////////////////////////
        // Если воспроизведение аудио происходит
        /////////////////////////////////////////////////////////////////////////////////////////////////
        if ( CONFIG.player.isPlaying )
        {
            // console.log("isPlaybackInProgress: "+CONFIG.application.isPlaybackInProgress"]);
            /////////////////////////////////////////////////////////////////////////////////////////////
            // Тип воспроизведения audio или osc
            /////////////////////////////////////////////////////////////////////////////////////////////
            if ( CONFIG.application.inputType == "audio" || CONFIG.application.inputType == "osc" ) 
            {
                let _nameoffile = CONFIG.application.nameOfFile;
                if ( window.isExist( _nameoffile ) > 0 ) {
                    if ( CONFIG.player.isPlaying() > 0 ) {      
                        /////////////////////////////////////////////////////////////////////////////////
                        // number of channels
                        /////////////////////////////////////////////////////////////////////////////////
                        let _channels = window.getchannelscount( _nameoffile );
                        CONFIG.application.channels = _channels;
                        /////////////////////////////////////////////////////////////////////////////////
                        // sampleRate of the file
                        /////////////////////////////////////////////////////////////////////////////////
                        let _sampleRate = window.getsampleRate( _nameoffile );
                        CONFIG.application.sampleRate = _sampleRate;
                        /////////////////////////////////////////////////////////////////////////////////
                        // frames of the file
                        let _countofframes = CONFIG.sampleRate / 25;
                        /////////////////////////////////////////////////////////////////////////////
                        // speed test... single allocation
                        let _memptr = window.malloc( _countofframes * _channels * SIZE_OF_DOUBLE );
                        if ( _memptr > 0 ) {

                            let _framescount = window.getdatabuffer( _nameoffile, _memptr, CONFIG.application.frameOffset, _countofframes );                              
                            if ( _framescount > 0 ) {                                
                                CONFIG.application.renderBuffer = window.copy( _memptr, _countofframes * _channels * SIZE_OF_DOUBLE );
                                CONFIG.application.frameOffset = _framescount;
                            } else {
                                window.stopplayback();
                            }

                            window.free( _memptr );
                        }
                    }
                }
            }

            ////////////////////////////////////////////////////////////////////////////////////
            // Удерживать картинку графика
            ////////////////////////////////////////////////////////////////////////////////////
            if ( CONFIG.application.holdChart == "holdchart-on" ) {
                ////////////////////////////////////////////////////////////////////////////////
                // Удерживать картинку определенного блока памяти
                ////////////////////////////////////////////////////////////////////////////////
                if ( CONFIG.application.holdBuffer == undefined ) {
                    CONFIG.application.holdBuffer = new Float64Array( CONFIG.application.renderBuffer );
                }
            }
            ////////////////////////////////////////////////////////////////////////////////////
            // Не удерживать картинку графика
            ////////////////////////////////////////////////////////////////////////////////////                                
            else {
                CONFIG.application.holdBuffer = undefined;
            }
            ////////////////////////////////////////////////////////////////////////////////////
            // Если плагин гониометра включен
            ////////////////////////////////////////////////////////////////////////////////////
            if ( pluginId & 1 == 1 ) {
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // Рисование системы координат с графиком...
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                await this.spline.drawData( this, null, CONFIG.application.channels, CONFIG.application.renderType, 1, 1, CONFIG.application.kdX, CONFIG.application.kdY, CONFIG.application.zoomX, CONFIG.application.zoomY, thickness, _colors );
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // Установление начальных параметров...
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////                
                this.goniometer.set( sBW + sW / 2.0, sBW + sH / 2.0, sH / 2.0 - 2.0 * sBW, thickness );
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // Если стерео ( 2 канала ), рисование системы координат гониометра и графика задержанного блока памяти...
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                if ( CONFIG.application.renderType == "stereo" && CONFIG.application.channels == 2 && CONFIG.application.holdChart == "holdchart-on" && CONFIG.application.holdBuffer != null && CONFIG.application.holdBuffer != undefined ) {
                    await this.goniometer.draw( this, CONFIG.application.holdBuffer, CONFIG.application.kdX, CONFIG.application.kdY, CONFIG.application.zoomX, CONFIG.application.zoomY, [ 1.0, 1.0, 0.0, 1.0 ] ) 
                } 
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // Если стерео ( 2 канала ), рисование системы координат гониометра и текущего блока памяти...
                ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                else if ( CONFIG.application.renderType == "stereo" && CONFIG.application.channels == 2 && CONFIG.application.renderBuffer != null && CONFIG.application.renderBuffer != undefined ){
                    await this.goniometer.draw( this, CONFIG.application.renderBuffer, CONFIG.application.kdX, CONFIG.application.kdY,CONFIG.application.zoomX, CONFIG.application.zoomY, [ 1.0, 1.0, 0.0, 1.0 ] ) 
                }
            } 

            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // Если плагинов больше нет - рисование по умолчанию...
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            if ( pluginId == 0 ) {
                if ( CONFIG.application.holdChart == "holdchart-on" && CONFIG.application.holdBuffer != null && CONFIG.application.holdBuffer != undefined) {
                    await this.spline.drawData( this, CONFIG.application.holdBuffer , CONFIG.application.channels , CONFIG.application.renderType , CONFIG.application.sampleRate , CONFIG.application.volumeRate , CONFIG.application.kdX , CONFIG.application.kdY , CONFIG.application.zoomX , CONFIG.application.zoomY , thickness, _colors );
                } else if ( CONFIG.application.renderBuffer != null && CONFIG.application.renderBuffer != undefined ){

                    await this.spline.drawData( this, CONFIG.application.renderBuffer , CONFIG.application.channels , CONFIG.application.renderType , CONFIG.application.sampleRate , CONFIG.application.volumeRate , CONFIG.application.kdX , CONFIG.application.kdY , CONFIG.application.zoomX , CONFIG.application.zoomY , thickness, _colors );
                } else {
                    await this.spline.drawData( this, null, null, "stereo", CONFIG.application.sampleRate , CONFIG.application.volumeRate , CONFIG.application.kdX , CONFIG.application.kdY , CONFIG.application.zoomX , CONFIG.application.zoomY , thickness, _colors );        
                }
            } 
        }
        ////////////////////////////////////////////////////////////////////////////////////
        // Если воспроизведение аудио не происходит
        ////////////////////////////////////////////////////////////////////////////////////
        else {
            if ( pluginId == 0 ) {
                if ( CONFIG.application.holdChart == "holdchart-on" && CONFIG.application.holdBuffer != null && CONFIG.application.holdBuffer != undefined) {
                    await this.spline.drawData( this, CONFIG.application.holdBuffer , CONFIG.application.channels , CONFIG.application.renderType , CONFIG.application.sampleRate , CONFIG.application.volumeRate , CONFIG.application.kdX , CONFIG.application.kdY , CONFIG.application.zoomX , CONFIG.application.zoomY , thickness, _colors );
                } else {
                    await this.spline.drawData( this, null, null, "stereo", CONFIG.application.sampleRate , CONFIG.application.volumeRate , CONFIG.application.kdX , CONFIG.application.kdY , CONFIG.application.zoomX , CONFIG.application.zoomY , thickness, _colors );        
                }
            } else if ( pluginId & 1 == 1 ) {
                await this.spline.drawData( this, null, CONFIG.application.channels , CONFIG.application.renderType , 1, 1, CONFIG.application.kdX , CONFIG.application.kdY , CONFIG.application.zoomX , CONFIG.application.zoomY , thickness, _colors );
                this.goniometer.set( sBW + sW / 2.0, sBW + sH / 2.0, sH / 2.0 - 2.0 * sBW, thickness );
                if ( CONFIG.application.renderType == "stereo" && CONFIG.application.channels == 2 && CONFIG.application.holdChart == "holdchart-on" && CONFIG.application.holdBuffer != null && CONFIG.application.holdBuffer != undefined ) {
                    await this.goniometer.draw( this, CONFIG.application.holdBuffer , CONFIG.application.kdX , CONFIG.application.kdY , CONFIG.application.zoomX , CONFIG.application.zoomY , [ 1.0, 1.0, 0.0, 1.0 ] ) 
                } 
            }
        }

        this.passEncoder.end();
        this.device.queue.submit( [ this.commandEncoder.finish() ] );

        requestAnimationFrame( this.render );
    }
};


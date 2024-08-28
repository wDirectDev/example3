import { wDObject } from './object.mjs';

//////////////////////////////
//        
// (0;0) 2---------1 (1;0)
//       |         |
// (0;1) 3---------0 (1;1)
//
//////////////////////////////

export class wDNativeLine extends wDObject
{
    constructor( instance ) 
    {
        super( instance, 0, 0, 0, 0 );
	    this.setX2(0);
	    this.setY2(0);
	    this.setLines( [] );
    }
    destroy()
    {
        this.setColorsBuffer( null );
        this.setVertexBuffer( null );
        this.setFragUVBuffer( null );
	    this.setUniformShaderLocation( null ); 
	    this.setShaderBindGroup( null );
    }  
    async init() 
    {
	    let instance = this.getInstance();
        this.setVertexBuffer( null );
        this.setFragUVBuffer( null );
        this.setColorsBuffer( null );
	    this.setShaderBindGroup( null );
	    this.setUniformShaderLocation( 
		    this.setUniformShaderFlag( instance.device, 0 ) 
	    );
        this.resetDuty();
    }
    getLinesCount()
    {
	    return this.lines.length;
    }
    getLines() 
    {
    	return this.lines;
    }
    setLines( lines ) 
    {
    	this.lines = lines;
        this.setDuty();
    }
    clearLines() 
    {
	    this.setLines( [] );
        this.setDuty();
    }
    appendLine( line ) 
    {
        this.lines.push( line );
	    this.setDuty();
    }
    getX1() 
    {
        return this.getX();
    }
    setX1(x) 
    {
        this.setX(x);
    }
    getY1() 
    {
	return this.getY();
    }
    setY1( y ) 
    {
        this.setY(y);
    }
    getX2() 
    {
        return this.x2;
    }
    setX2( x ) 
    {
        this.x2 = x;
    }
    getY2() 
    {
        return this.y2;
    }
    setY2( y ) 
    {
        this.y2 = y;
    }
    setShaderBindGroup( shaderBind ) 
    {
        this.shaderBindGroup = shaderBind;
    }
    getShaderBindGroup() 
    {
        return this.shaderBindGroup;
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
        let instance = this.getInstance();

        let lines = this.getLines();
        let count = this.getLinesCount();

        let vb = new Float32Array( 12 * count );
        let ii = 0;

    	for ( let i = 0; i < count; i++ )        
    	{
            let vX1 = lines[ i ].x1;
            let vY1 = lines[ i ].y1;
            let vX2 = lines[ i ].x2;
            let vY2 = lines[ i ].y2;

            let vW = lines[ i ].thickness;
	
            let vY = vY2 - vY1;
            let vX = vX2 - vX1;

            let Xf = 0.0;
            let Yf = 0.0;

            if ( vX > 0 && vY >= 0 ) { 
                //////////////////////////////////
                // To right; right down;
                //////////////////////////////////
                if ( vY == 0 ) {
                    Yf = vW;
                    Xf = 0.0;
                } else {
                    let alpha = Math.atan2( Math.abs(vY), Math.abs(vX) );

                    Yf = -Math.sin( Math.PI - alpha ) * vW;
                    Xf = Math.cos( Math.PI - alpha ) * vW;

//                    Yf = ( Math.sin( Math.PI - alpha ) * vW < vW ) ? -vW : -( Math.cos( Math.PI - alpha ) * vW );
//                    Xf = ( Math.cos( Math.PI - alpha ) * vW < vW ) ? vW : ( Math.cos( Math.PI - alpha ) * vW );
                }
            } else if ( vX >= 0 && vY < 0 ) { 
		        //////////////////////////////////
		        // To up; right up;
		        //////////////////////////////////
                if ( vX == 0 ) {              
                    Yf = 0.0;  
                    Xf = vW;   
                } else {
                    let alpha = Math.atan2( Math.abs(vY), Math.abs(vX) );

                    Yf = Math.sin( Math.PI - alpha ) * vW;
                    Xf = Math.cos( Math.PI - alpha ) * vW;

//                    Yf = ( Math.sin( Math.PI - alpha ) * vW < vW ) ? vW : ( Math.cos( Math.PI - alpha ) * vW );
//                    Xf = ( Math.cos( Math.PI - alpha ) * vW < vW ) ? vW : ( Math.cos( Math.PI - alpha ) * vW );
                }
           } else if ( vX < 0 && vY <= 0 ) {
                //////////////////////////////////
                // To left; left up;
                //////////////////////////////////
                if ( vY == 0 ) {
                    Yf = vW;
                    Xf = 0.0;
                } else {
                    let alpha = Math.atan2( Math.abs(vY), Math.abs(vX) );

                    Yf = -Math.sin( Math.PI - alpha ) * vW;
                    Xf = Math.cos( Math.PI - alpha ) * vW;

//                    Yf = ( Math.sin( Math.PI - alpha ) * vW < vW ) ? -vW : -( Math.cos( Math.PI - alpha ) * vW );
//                    Xf = ( Math.cos( Math.PI - alpha ) * vW < vW ) ? vW : ( Math.cos( Math.PI - alpha ) * vW );
                }
           } else if ( vX <= 0 && vY > 0 ) {
		//////////////////////////////////
		// To down; left down;
		//////////////////////////////////
                if ( vX == 0 ) {
                    Xf = vW;
                    Yf = 0.0;
                } else {
                    let alpha = Math.atan2( Math.abs(vY), Math.abs(vX) );
                    Yf = Math.sin( Math.PI - alpha ) * vW;
                    Xf = Math.cos( Math.PI - alpha ) * vW;

//                    Yf = ( Math.sin( Math.PI - alpha ) * vW < vW ) ? vW : ( Math.cos( Math.PI - alpha ) * vW );
//                    Xf = ( Math.cos( Math.PI - alpha ) * vW < vW ) ? vW : ( Math.cos( Math.PI - alpha ) * vW );
                }
            }

            let Xh = Xf / 2.0;
            let Yh = Yf / 2.0;

//////////////////////////////
//        
// (0;0) 2---------1 (1;0)
//       |         |
// (0;1) 3---------0 (1;1)
//
//////////////////////////////

            vb[ii++] = instance.calcX( vX2 - Xh );
            vb[ii++] = instance.calcY( vY2 + Yh ); // 1 1

            vb[ii++] = instance.calcX( vX2 + Xh );
            vb[ii++] = instance.calcY( vY2 - Yh ); // 1 0

            vb[ii++] = instance.calcX( vX1 + Xh );
            vb[ii++] = instance.calcY( vY1 - Yh ); // 0 0

            for ( let k = 0; k < 2; k++ ) vb[ii++] = vb[ 0 * 2 + k + i * 12 ];
            for ( let k = 0; k < 2; k++ ) vb[ii++] = vb[ 2 * 2 + k + i * 12 ];

            vb[ii++] = instance.calcX( vX1 - Xh );
            vb[ii++] = instance.calcY( vY1 + Yh ); // 0 1
        }

	    return vb;
    }

    getFragUV()
    {   
        let lines = this.getLines();
        let count = this.getLinesCount();

        let fb = new Float32Array( 12 * count );
        let ii = 0;

        for (let j = 0; j < count; j++ )        
        {	
            fb[ii++] = 1.0;
            fb[ii++] = 1.0;
            fb[ii++] = 1.0;
            fb[ii++] = 0.0;
            fb[ii++] = 0.0;
            fb[ii++] = 0.0;
            for ( let k = 0; k < 2; k++ ) fb[ii++] = fb[ 0 * 2 + k + j * 12 ];
            for ( let k = 0; k < 2; k++ ) fb[ii++] = fb[ 2 * 2 + k + j * 12 ];
            fb[ii++] = 0.0;
            fb[ii++] = 1.0;
        }

        return fb;
    }

    getColors()
    {
        let lines = this.getLines();
        let count = this.getLinesCount();

        let cb = new Float32Array( 24 * count );
	    let ii = 0;
	
        for (let i = 0; i < count; i++ )        
        {
            let colors = lines[i].colors;
            for ( let k = 0; k < 4; k++ ) cb[ii++] = colors.to[k];
            for ( let k = 0; k < 4; k++ ) cb[ii++] = colors.to[k];
            for ( let k = 0; k < 4; k++ ) cb[ii++] = colors.from[k];
            for ( let k = 0; k < 4; k++ ) cb[ii++] = cb[ 0 * 4 + k + i * 24];
            for ( let k = 0; k < 4; k++ ) cb[ii++] = cb[ 2 * 4 + k + i * 24 ];
            for ( let k = 0; k < 4; k++ ) cb[ii++] = colors.from[k];
        }

        return cb;
    }

    count()
    {
        return this.getLinesCount();
    }
    clear()
    {
	    this.clearLines();
    }
    append( x1, y1, x2, y2, _t = 1, _colors = { from: [ 1.0, 1.0, 1.0, 1.0 ], to: [ 1.0, 1.0, 1.0, 1.0 ] } )
    {
	    this.appendLine( { 'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2, 'thickness': _t, 'colors' : _colors } );
    }
    async draw( instance ) 
    {
        let flag = this.isDuty();
        if ( flag == true ) 
        {
            this.setColorsBuffer( null );
            this.setFragUVBuffer( null );
            this.setVertexBuffer( null );
        }
	    let vertexBuffer = this.getVertexBuffer();
        if ( vertexBuffer == null ) {
		    vertexBuffer = instance.createBuffer( this.getVertex(), GPUBufferUsage.VERTEX, instance.device );
            this.setVertexBuffer( vertexBuffer );
        }
        let fragUVBuffer = this.getFragUVBuffer();
        if ( fragUVBuffer == null ) {
		    fragUVBuffer = instance.createBuffer( this.getFragUV(), GPUBufferUsage.VERTEX, instance.device );
            this.setFragUVBuffer( fragUVBuffer );
        }
        let colorsBuffer = this.getColorsBuffer();
        if ( colorsBuffer == null ) {
		    colorsBuffer = instance.createBuffer( this.getColors(), GPUBufferUsage.VERTEX, instance.device );
            this.setColorsBuffer( colorsBuffer );
        }	    
        let shaderBindGroup = this.getShaderBindGroup();
	    if ( shaderBindGroup == null ) {
		    shaderBindGroup = instance.device.createBindGroup( {
			    layout: instance.pipeline.getBindGroupLayout(0),
			    entries: [ {
				    binding: 0,
				    resource: {
					    buffer: this.uniformShaderLocation
    				}
	    		} ]
		    } );
		    this.setShaderBindGroup( shaderBindGroup );
        }

	    let lines = this.getLinesCount();
        
        instance.passEncoder.setBindGroup( 0, shaderBindGroup );
        instance.passEncoder.setVertexBuffer( 0, vertexBuffer );
        instance.passEncoder.setVertexBuffer( 1, fragUVBuffer );
        instance.passEncoder.setVertexBuffer( 2, colorsBuffer );
        instance.passEncoder.draw( 6 * lines, 1, 0, 0 );
        this.resetDuty();
    }
};
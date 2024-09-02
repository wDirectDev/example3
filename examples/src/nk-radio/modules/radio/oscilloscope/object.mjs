export class wDObject
{
    constructor( instance, x, y, _width, _height, _t = -1 ) 
    {
    	this.setInstance( instance );
        this.setX( x );
        this.setY( y );
        this.setWidth( _width );
        this.setHeight( _height );
        this.setThickness( _t );
        this.setDuty( true );
    }
    setInstance( _instance )
    {
        this.instance = _instance;
    }
    getInstance()
    {
        return this.instance;
    }
    resetDuty()
    {
        this.recreate = false;
    }
    setDuty( _duty = true )
    {
        this.recreate = _duty;
    }
    isDuty() 
    {
        return this.getDuty();
    }
    getDuty()
    {
        return this.recreate;
    }
    getThickness() 
    {
        return this.thickness;
    }
    setThickness( _t ) 
    {
        this.thickness = _t;
    }    
    getX() 
    {
        return this.x;
    }
    setX(_x) 
    {
        this.x = _x;
    }
    getY() 
    {
        return this.y;
    }
    setY(_y) 
    {
	    this.y = _y;
    }
    getWidth() 
    {
        return this.width;
    }
    setWidth(_w) 
    {
	    this.width = _w;
    }
    getHeight() 
    {
        return this.height;
    }
    setHeight(_h) 
    {
	    this.height = _h;
    }
    setUniformShaderLocationFlag( device, shaderFlag = 0  )
    {
        if ( device == null ) {
            this.setUniformShaderLocation( null );
        } else {
            this.setUniformShaderLocation( 
                this.setUniformShaderFlag( device, shaderFlag ) 
            );
        }
    }
    setUniformShaderLocation( _uniform )
    {
	    if ( this.uniformShaderLocation != null ) 
		    this.uniformShaderLocation.destroy();
	    this.uniformShaderLocation = _uniform;
    }
    getUniformShaderLocation()
    {
    	return this.uniformShaderLocation;
    }
    setUniformShaderFlag( device, _shaderValue )
    {
        let source = new Uint32Array( 1 );
        source[0] = _shaderValue;
        const uniformBuffer = device.createBuffer( {
            label: 'uniform flag buffer',
            size: source.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        } );
        device.queue.writeBuffer( uniformBuffer, 0, source );
    	return uniformBuffer;
    }
};

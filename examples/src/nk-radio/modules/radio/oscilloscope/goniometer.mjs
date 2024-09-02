import { wDObject } from './object.mjs';
import { wDPoint } from './point.mjs';
import { wDLine } from './line.mjs';
import { wDNativeLine } from './line-native.mjs';

export class wDGoniometer extends wDObject
{
    constructor( instance ) 
    {	
        super( instance, 0, 0, 0, 0 );
    }

    destroy()
    {
        this.line.destroy();
    }

    async init() 
    {
	    let instance = this.getInstance();

        this.line = new wDNativeLine( instance );
        await this.line.init();
    }

    setRadius( radius )
    {
        if ( this.radius != radius ) {
            this.radius = radius;
            this.setDuty();
        }
    }

    getRadius()
    {
    	return this.radius;
    }

    set( x, y, _radius = -1, _thickness = -1 )
    {
        if ( this.getX() != x ) {
            this.setX( x );
            this.setDuty();
        }
        if ( this.getY() != y ) {
            this.setY( y );
            this.setDuty();
        }
        if ( _radius != -1 ) {
            if ( this.getRadius() != _radius ) {
                this.setRadius( _radius );
                this.setDuty();
            }
        }
        if ( _thickness != -1 ) { 
            if ( this.getThickness() != _thickness ) {
                this.setThickness( _thickness );
                this.setDuty();
            }
        }      
    }

    async draw( instance, _object, kdX, kdY, zoomX, zoomY, color = [ 1.0, 1.0, 1.0, 1.0 ] ) 
    {
        if ( _object == null || _object == undefined ) return;

        let kX = zoomX / 100.0;
        let kY = zoomY / 100.0;

        //////////////////////////////////////////////////////////////////
        // let flag = this.isDuty();
        // if ( flag == true ) 
        // {
        // this.vertex.clear();
        //////////////////////////////////////////////////////////////////

        this.line.clear();

        let _radius = this.getRadius();
        let _t = this.getThickness();	

        let cX = _radius * kX / kdX;
        let cY = _radius * kY / kdY;
        let x0 = this.getX();
        let y0 = this.getY();
        let i_len = ( _object.length % 2 == 0 ) ? _object.length : _object.length - 1;
        let i_index = 0;
        let x1 = _object[ i_index * 2 + 0 ] * _radius;
        let y1 = _object[ i_index * 2 + 1 ] * _radius;
        for ( ; i_index < ( i_len / 2 ); i_index++ ) 
        {
            let x2 = _object[ i_index * 2 + 0 ] * _radius;
            let y2 = _object[ i_index * 2 + 1 ] * _radius;
            this.line.append( x0 + x1, y0 + y1, x0 + x2, y0 + y2, _t, { from: color, to: color } );
            x1 = x2;
            y1 = y2;
        }

        let _count = this.line.getLinesCount();

        if( _count != 0 ) await this.line.draw( instance );

        ///////////////////////////////////////////////////////////////////////
        // let count = this.vertex.getPointsArrayCount();
        // if ( count != 0 ) await this.vertex.draw( instance );
        ///////////////////////////////////////////////////////////////////////

        this.resetDuty();
    }
};
import { wDObject } from './object.mjs';
import { wDPoint } from './point.mjs';

export class wDCircle extends wDObject
{
    constructor( instance ) 
    {	
        super( instance, 0, 0, 0, 0 );
    }

    destroy()
    {
	    this.vertex.destroy();
    }

    async init() 
    {
	    let instance = this.getInstance();
	    this.vertex = new wDPoint( instance );
	    await this.vertex.init();
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

    async draw( instance, color = [ 1.0, 1.0, 1.0, 1.0 ] ) 
    {
        let flag = this.isDuty();
        if ( flag == true ) 
        {
            this.vertex.clear();

            let instance = this.getInstance();
            
            let r = this.getRadius();
            let _t = this.getThickness();	

            let x0 = this.getX();
            let y0 = this.getY();

            if ( r == 1 ) {
                    this.vertex.append( x0 + 1, y0 - 0, _t, color ); //     X
                    this.vertex.append( x0 + 0, y0 - 1, _t, color ); //    XXX
                    this.vertex.append( x0 - 1, y0 + 0, _t, color ); //     X
                    this.vertex.append( x0 - 0, y0 + 1, _t, color ); //
            } else if ( r == 2 ) {
                    this.vertex.append( x0 + 2, y0 - 1, _t, color );
                    this.vertex.append( x0 + 2, y0 + 0, _t, color );
                    this.vertex.append( x0 + 2, y0 + 1, _t, color );

                    this.vertex.append( x0 - 1, y0 - 2, _t, color );
                    this.vertex.append( x0 + 0, y0 - 2, _t, color );
                    this.vertex.append( x0 + 1, y0 - 2, _t, color );

                    this.vertex.append( x0 - 2, y0 - 1, _t, color );
                    this.vertex.append( x0 - 2, y0 + 0, _t, color );
                    this.vertex.append( x0 - 2, y0 + 1, _t, color );

                    this.vertex.append( x0 - 1, y0 + 2, _t, color );
                    this.vertex.append( x0 + 0, y0 + 2, _t, color );
                    this.vertex.append( x0 + 1, y0 + 2, _t, color );
            } else if ( r == 3 ) {
                    this.vertex.append( x0 + 3, y0 - 1, _t, color );
                    this.vertex.append( x0 + 3, y0 + 0, _t, color );
                    this.vertex.append( x0 + 3, y0 + 1, _t, color );

                    this.vertex.append( x0 + 2, y0 + 2, _t, color );

                    this.vertex.append( x0 - 1, y0 - 3, _t, color );
                    this.vertex.append( x0 + 0, y0 - 3, _t, color );
                    this.vertex.append( x0 + 1, y0 - 3, _t, color );

                    this.vertex.append( x0 + 2, y0 - 2, _t, color );

                    this.vertex.append( x0 - 3, y0 - 1, _t, color );
                    this.vertex.append( x0 - 3, y0 + 0, _t, color );
                    this.vertex.append( x0 - 3, y0 + 1, _t, color );

                    this.vertex.append( x0 - 2, y0 - 2, _t, color );

                    this.vertex.append( x0 - 1, y0 + 3, _t, color );
                    this.vertex.append( x0 + 0, y0 + 3, _t, color );
                    this.vertex.append( x0 + 1, y0 + 3, _t, color );

                    this.vertex.append( x0 - 2, y0 + 2, _t, color );
            } else if ( r == 4 ) {
                    this.vertex.append( x0 + 4, y0 - 1, _t, color );
                    this.vertex.append( x0 + 4, y0 + 0, _t, color );
                    this.vertex.append( x0 + 4, y0 + 1, _t, color );

                    this.vertex.append( x0 + 3, y0 + 2, _t, color );
                    this.vertex.append( x0 + 2, y0 + 3, _t, color );

                    this.vertex.append( x0 - 1, y0 - 4, _t, color );
                    this.vertex.append( x0 + 0, y0 - 4, _t, color );
                    this.vertex.append( x0 + 1, y0 - 4, _t, color );

                    this.vertex.append( x0 + 3, y0 - 2, _t, color );
                    this.vertex.append( x0 + 2, y0 - 3, _t, color );

                    this.vertex.append( x0 - 4, y0 - 1, _t, color );
                    this.vertex.append( x0 - 4, y0 + 0, _t, color );
                    this.vertex.append( x0 - 4, y0 + 1, _t, color );

                    this.vertex.append( x0 - 3, y0 - 2, _t, color );
                    this.vertex.append( x0 - 2, y0 - 3, _t, color );

                    this.vertex.append( x0 - 1, y0 + 4, _t, color );
                    this.vertex.append( x0 + 0, y0 + 4, _t, color );
                    this.vertex.append( x0 + 1, y0 + 4, _t, color );

                    this.vertex.append( x0 - 3, y0 + 2, _t, color );
                    this.vertex.append( x0 - 2, y0 + 3, _t, color );
            } else if ( r == 5 ) {
                    this.vertex.append( x0 + 5, y0 - 1, _t, color );
                    this.vertex.append( x0 + 5, y0 + 0, _t, color );
                    this.vertex.append( x0 + 5, y0 + 1, _t, color );

                    this.vertex.append( x0 + 4, y0 + 2, _t, color );
                    this.vertex.append( x0 + 4, y0 + 3, _t, color );
                    this.vertex.append( x0 + 3, y0 + 4, _t, color );
                    this.vertex.append( x0 + 2, y0 + 4, _t, color );

                    this.vertex.append( x0 - 1, y0 - 5, _t, color );
                    this.vertex.append( x0 + 0, y0 - 5, _t, color );
                    this.vertex.append( x0 + 1, y0 - 5, _t, color );

                    this.vertex.append( x0 + 4, y0 - 2, _t, color );
                    this.vertex.append( x0 + 4, y0 - 3, _t, color );
                    this.vertex.append( x0 + 3, y0 - 4, _t, color );
                    this.vertex.append( x0 + 2, y0 - 4, _t, color );

                    this.vertex.append( x0 - 5, y0 - 1, _t, color );
                    this.vertex.append( x0 - 5, y0 + 0, _t, color );
                    this.vertex.append( x0 - 5, y0 + 1, _t, color );

                    this.vertex.append( x0 - 4, y0 - 2, _t, color );
                    this.vertex.append( x0 - 4, y0 - 3, _t, color );
                    this.vertex.append( x0 - 3, y0 - 4, _t, color );
                    this.vertex.append( x0 - 2, y0 - 4, _t, color );

                    this.vertex.append( x0 - 1, y0 + 5, _t, color );
                    this.vertex.append( x0 + 0, y0 + 5, _t, color );
                    this.vertex.append( x0 + 1, y0 + 5, _t, color );

                    this.vertex.append( x0 - 4, y0 + 2, _t, color );
                    this.vertex.append( x0 - 4, y0 + 3, _t, color );
                    this.vertex.append( x0 - 3, y0 + 4, _t, color );
                    this.vertex.append( x0 - 2, y0 + 4, _t, color );
            } 
            else 
            {
        		let ang = 0;
                while ( ang < ( Math.PI / 2.0 ) ) 
                {
                    let x1 = Math.fround( r * Math.sin( ang ) );
                    let y1 = Math.fround( r * Math.cos( ang ) );
                    this.vertex.append( x0 + x1, y0 + y1, _t, color );
                    this.vertex.append( x0 - y1, y0 + x1, _t, color );
                    this.vertex.append( x0 - x1, y0 - y1, _t, color );
                    this.vertex.append( x0 + y1, y0 - x1, _t, color );
		            ang = ang + Math.asin( 1.0 / ( 2.0 * r ) );
		        } 
            }
        }

        let _count = this.vertex.count();
        if ( _count != 0 ) await this.vertex.draw( instance );

        this.resetDuty();
    }
};
import { wDObject } from './object.mjs';
import { wDLabel } from './label.mjs';
import { wDBox } from './box.mjs';
import { wDLine } from './line.mjs';
import { wDNativeLine } from './line-native.mjs';

export class wDSpline extends wDObject
{
    constructor( instance, x, y, _width, _height, _weight = 1 ) 
    {
        super( instance, x, y, _width, _height, _weight );
        this.setBorderThickness( 1 );
    }  

    destroy()
    {        
        this.clearLabels();
        this.border.destroy();
        this.axis.destroy();
        this.discretlines.destroy();
        this.resetDuty();
    }

    getBorderThickness() 
    {
        return this.borderthickness;
    }

    setBorderThickness( _t ) 
    {
        this.borderthickness = _t;
    }

    async init() 
    {
        let instance = this.getInstance();
        
        this.border = new wDBox( instance );
        await this.border.init();

        this.axis = new wDNativeLine( instance );
        await this.axis.init();

        this.discretlines = new wDNativeLine( instance );
        await this.discretlines.init();

        this.fontsize = instance.getCanvasHeight() / 38.0;

        this.labels = [];

        this.defaultcolor = 0.1;
        this.itcolor = 0.01;

        this.setDuty();
    }

    set( x, y, _width = -1, _height = -1, _thickness = -1, _borderthickness = -1 )
    {
        if ( this.getX() != x ) {
            this.setX( x );
            this.setDuty();
        }
        if ( this.getY() != y ) {
            this.setY( y );
            this.setDuty();
        }
        if ( _width != -1 ) {
            if ( this.getWidth() != _width ) {
                this.setWidth( _width );
                this.setDuty();
            }
        }
        if ( _height != -1 ) { 
            if ( this.getHeight() != _height ) {
                this.setHeight( _height );
                this.setDuty();
            }
        }
        if ( _thickness != -1 ) { 
            if ( this.getThickness() != _thickness ) {
                this.setThickness( _thickness );
                this.setDuty();
            }
        }
        if ( _borderthickness != -1 ) { 
            if ( this.getBorderThickness() != _borderthickness ) {
                this.setBorderThickness( _borderthickness );
                this.setDuty();
            }
        }
    }   

    getLabelsCount() {
        return this.labels.length;
    }

    getLabelAt( index ) {
        return this.labels[ index ];
    }

    appendToLabels( label ) {
        this.labels.push( label );
    }

    clearLabels()
    {
        let l = this.labels.length;
        if ( l > 0 ) {
            for ( let i = l - 1; i >= 0; i-- ) {
                this.labels[i].destroy();
            }
        }
        this.labels = [];
    }    

    async borderDraw( instance, x, y, _width, _height, _t = 1, _colors = [ { from: [ 1.0, 1.0, 1.0, 1.0 ], to: [ 1.0, 1.0, 1.0, 1.0 ] } ] ) 
    {
        this.border.set( x, y, _width, _height, this.getBorderThickness() );

        this.defaultcolor += this.itcolor;

        if ( this.defaultcolor >= 1.0 ) {
            this.itcolor = -0.01;
            this.defaultcolor = 1.0;
        } else if ( this.defaultcolor < 0 ) { 
            this.itcolor = +0.01; 
            this.defaultcolor = 0;
        }

        this.border.setDuty();

        await this.border.draw( instance, [   
            { from: [ this.defaultcolor, 1.0 - this.defaultcolor, 0.0, 1.0 ], to: [ 1.0 - this.defaultcolor, this.defaultcolor, 0.0, 1.0 ] },
            { from: [ 1.0 - this.defaultcolor, this.defaultcolor, 0.0, 1.0 ], to: [ this.defaultcolor, 1.0 - this.defaultcolor, 0.0, 1.0 ] },
            { from: [ this.defaultcolor, 1.0 - this.defaultcolor, 0.0, 1.0 ], to: [ 1.0 - this.defaultcolor, this.defaultcolor, 0.0, 1.0 ] },
            { from: [ 1.0 - this.defaultcolor, this.defaultcolor, 0.0, 1.0  ], to: [ this.defaultcolor, 1.0 - this.defaultcolor, 0.0, 1.0] } 
        ] );
    }

    async axisDraw( instance, _rateofsamples, _volumescale, x, y, _width, _height, kdX, kdY, zoomX, zoomY, _t = 1, _colors = [ { from: [ 1.0, 1.0, 1.0, 1.0 ], to: [ 1.0, 1.0, 1.0, 1.0 ] } ] ) 
    {
        if ( _rateofsamples == 1 ) {
            zoomX = 100;
            zoomY = 100;
            //kdX = 100;
            //kdY = 100;
        }

        let kX = zoomX / 100.0;
        let kY = zoomY / 100.0;

        let cX = _width * kX / kdX;
        let cY = _height * kY / kdY;

        ////////////////////////////////////////////////////////////////////////
        // _samplerate: 44100 - 1s           
        ////////////////////////////////////////////////////////////////////////
        // let sX = 2.0 * _samplerate / kdX;
        ////////////////////////////////////////////////////////////////////////

        let tX = 1.0 / kdX;
        let sX = tX * _rateofsamples;
        let vY = 2.0 * _volumescale / kdY;

        let toFixedPlace = 0;
        if ( _rateofsamples == 1 ) toFixedPlace = 3;

        let color = { from : [ 0.3, 0.3, 0.3, 1.0 ],
            to : [ 0.3, 0.3, 0.3, 1.0 ] };

        let flag = this.isDuty();

        if ( flag == true ) 
        {
            this.axis.clear();
            this.clearLabels();

            let textColor = "rgba(255, 255, 255, 1.0)";
            let backgroundColor = "rgba(0, 0, 0, 1.0)";

            //let offX = 10.0;
            //let offY = 10.0;

            if ( _colors.length == 1 ) _colors.push( _colors[0] );

            let stepX = ( cX > this.fontsize * 8.0 ) ? 1 : ( this.fontsize * 8.0 / cX ) + 1;
            let stepY = ( cY > this.fontsize * 2.0 ) ? 1 : ( this.fontsize * 2.0 / cY ) + 1;

            let gDiff = 0;

            ////////////////////////////////////////////////////////////////////
            // x: axis
            ////////////////////////////////////////////////////////////////////
            this.axis.append( 
                x, 
                y + _height / 2.0,
                x + _width - _t,
                y + _height / 2.0,
                _t,
                _colors[0] 
            );

            ////////////////////////////////////////////////////////////////////
            // y: axis
            ////////////////////////////////////////////////////////////////////
            this.axis.append( 
                x + _width / 2.0, 
                y,
                x + _width / 2.0,
                y + _height - _t,
                _t, 
                _colors[0] 
            );

            //////////////////////////////////////////////////////////////////////////////////////////////////////
            // 111111111111111
            if ( _rateofsamples == 1 )
            {
                /////////////////////////////////////////////////////////
                // Left edge
                this.axis.append( 
                    x + _width / 2.0 - _height / 2.0, 
                    y,
                    x + _width / 2.0 - _height / 2.0, 
                    y + _height - _t,
                    _t, color 
                ); 
                /////////////////////////////////////////////////////////
                // Right edge
                this.axis.append( 
                    x + _width / 2.0 + _height / 2.0, 
                    y,
                    x + _width / 2.0 + _height / 2.0, 
                    y + _height - _t,
                    _t, color 
                ); 
            }
            else
            {
                ////////////////////////////////////////////////////////////////////
                // x: delimeters
                ////////////////////////////////////////////////////////////////////
                for ( let i = stepX; i < kdX / 2.0; i = i + stepX ) 
                {
                    if ( ( x + _width / 2.0 + i * cX ) >= _width ) 
                        continue;

                    if ( ( x + _width / 2.0 - i * cX ) <= x ) 
                        continue;

                    let color = { from : [ 0.3, 0.3, 0.3, 1.0 ],
                        to : [ 0.3, 0.3, 0.3, 1.0 ] };
        
                    this.axis.append( 
                        x + _width / 2.0 - i * cX, 
                        y,
                        x + _width / 2.0 - i * cX, 
                        y + _height - _t,
                        _t, color ); 
        
                    this.axis.append( 
                        x + _width / 2.0 - i * cX, 
                        y + _height / 2.0 - _t - 3,
                        x + _width / 2.0 - i * cX, 
                        y + _height / 2.0 + 3,
                        _t, _colors[0] );   
        
                    let Llabel = new wDLabel( instance, 'lighter', this.fontsize, 'Segoe UI', 0, 0, 128, 128 );
                    await Llabel.init();
            
                    Llabel.set( this.fontsize, x + _width / 2.0 - i * cX, y + _height / 2.0 );
                    Llabel.draw( instance, textColor, backgroundColor, ( -i * sX ).toFixed(toFixedPlace) + "(" + ( i * tX ).toFixed(3) + ")", true, true );
        
                    let _w = Llabel.getWidth();
                    let _h = Llabel.getHeight();
                    let _y = Llabel.getY();
                    let _x = Llabel.getX();

                    Llabel.setY( _y + 6 );
                    Llabel.setX( _x );
        
                    this.appendToLabels( Llabel );  

                    this.axis.append( 
                        x + _width / 2.0 + i * cX, 
                        y,
                        x + _width / 2.0 + i * cX, 
                        y + _height - _t,
                        _t, color ); 

                    this.axis.append( 
                        x + _width / 2.0 + i * cX, 
                        y + _height / 2.0 - _t - 3,
                        x + _width / 2.0 + i * cX, 
                        y + _height / 2.0 + 3,
                        _t, _colors[0] );    

                    let Rlabel = new wDLabel( instance, 'lighter', this.fontsize, 'Segoe UI', 0, 0, 128, 128 );
                    await Rlabel.init();

                    Rlabel.set( this.fontsize, x + _width / 2.0 + i * cX, y + _height / 2.0 );
                    Rlabel.draw( instance, textColor, backgroundColor, ( i * sX ).toFixed(toFixedPlace) + "(" + ( i * tX ).toFixed(3) + ")", true, true );
                    
                    _w = Rlabel.getWidth();
                    _h = Rlabel.getHeight();
                    _y = Rlabel.getY();
                    _x = Rlabel.getX();

                    Rlabel.setY( _y - _h - 6 );
                    Rlabel.setX( _x - _w - 4 );

                    this.appendToLabels( Rlabel );       
                }
            } 

            ////////////////////////////////////////////////////////////////////
            // y: delimeters
            ////////////////////////////////////////////////////////////////////
            for ( let i = stepY; i < kdY / 2.0; i = i + stepY ) 
            {
                if ( ( y + _height / 2.0 + i * cY ) >= _height ) 
                    continue;

                if ( ( y + _height / 2.0 - i * cY ) <= y ) 
                    continue;

                let color = { from : [ 0.3, 0.3, 0.3, 1.0 ],
                    to : [ 0.3, 0.3, 0.3, 1.0 ] };

                this.axis.append( 
                    x, 
                    y + _height / 2.0 + i * cY,
                    x + _width - _t, 
                    y + _height / 2.0 + i * cY,
                    _t, color
                ); 

                this.axis.append( 
                    x + _width / 2.0 - _t - 3, 
                    y + _height / 2.0 + i * cY,
                    x + _width / 2.0 + 3, 
                    y + _height / 2.0 + i * cY,
                    _t, _colors[0] 
                ); 
                
                gDiff = stepY * cY + gDiff;

                let fL = false;
                let fR = false;

                if ( _rateofsamples == 1 ) 
                {
                    this.axis.append( 
                        x + _width / 2.0 - i * cY, 
                        y,
                        x + _width / 2.0 - i * cY, 
                        y + _height - _t,
                        _t, 
                        color
                    ); 

                    this.axis.append( 
                        x + _width / 2.0 + i * cY, 
                        y,
                        x + _width / 2.0 + i * cY, 
                        y + _height - _t,
                        _t, 
                        color
                    ); 

                    this.axis.append( 
                        x + _width / 2.0 + i * cY, 
                        y + _height / 2.0 - _t - 3,
                        x + _width / 2.0 + i * cY, 
                        y + _height / 2.0 + 3,
                        _t, 
                        _colors[0]
                    ); 

                    let Rlabel = new wDLabel( instance, 'lighter', this.fontsize, 'Segoe UI', 0, 0, 128, 128 );
                    await Rlabel.init();

                    Rlabel.set( this.fontsize, x + _width / 2.0 + i * cY, y + _height / 2.0 );
                    Rlabel.draw( instance, textColor, backgroundColor, ( i * vY ).toFixed(toFixedPlace), true, true );
                            
                    let _w = Rlabel.getWidth();
                    let _h = Rlabel.getHeight();
                    let _y = Rlabel.getY();
                    let _x = Rlabel.getX();

                    Rlabel.setY( _y - _h - 6 );
                    Rlabel.setX( _x - _w - 4 ); 

                    if ( gDiff > ( _w + 6 ) ) {
                        fR = true;
                        this.appendToLabels( Rlabel );
                    }

                    this.axis.append( 
                        x + _width / 2.0 - i * cY, 
                        y + _height / 2.0 - _t - 3,
                        x + _width / 2.0 - i * cY, 
                        y + _height / 2.0 + 3,
                        _t, 
                        _colors[0]
                    ); 

                    let Llabel = new wDLabel( instance, 'lighter', this.fontsize, 'Segoe UI', 0, 0, 128, 128 );
                    await Llabel.init();
                    
                    Llabel.set( this.fontsize, x + _width / 2.0 - i * cY, y + _height / 2.0 );
                    Llabel.draw( instance, textColor, backgroundColor, ( -i * vY ).toFixed(toFixedPlace), true, true );
                
                    _w = Llabel.getWidth();
                    _h = Llabel.getHeight();
                    _y = Llabel.getY();
                    _x = Llabel.getX();
    
                    Llabel.setY( _y + 6 );
                    Llabel.setX( _x );
                
                    if ( gDiff > ( _w + 6 ) ) 
                    {
                        fL = true;
                        this.appendToLabels( Llabel );
                    }
                }

                let Rlabel = new wDLabel( instance, 'lighter', this.fontsize, 'Segoe UI', 0, 0, 128, 128 );
                await Rlabel.init();

                Rlabel.set( this.fontsize, x + _width / 2.0, y + _height / 2.0 + i * cY );
                Rlabel.draw( instance, textColor, backgroundColor, ( -i * vY ).toFixed( 3 ), true, true );

                let _h = Rlabel.getHeight();
                let _w = Rlabel.getWidth();
                let _x = Rlabel.getX();
                let _y = Rlabel.getY();

                Rlabel.setX( _x + 6 );
                Rlabel.setY( _y - _h - 2);

                this.appendToLabels( Rlabel );

                this.axis.append( 
                    x, 
                    y + _height / 2.0 - i * cY,
                    x + _width - _t, 
                    y + _height / 2.0 - i * cY,
                    _t, color ); 

                this.axis.append( 
                    x + _width / 2.0 - _t - 3, 
                    y + _height / 2.0 - i * cY,
                    x + _width / 2.0 + 3, 
                    y + _height / 2.0 - i * cY,
                    _t, _colors[0] 
                ); 

                let Llabel = new wDLabel( instance, 'lighter', this.fontsize, 'Segoe UI', 0, 0, 128, 128 );
                await Llabel.init();

                Llabel.set( this.fontsize, x + _width / 2.0, y + _height / 2.0 - i * cY );
                Llabel.draw( instance, textColor, backgroundColor, ( i * vY ).toFixed( 3 ), true, true );

                _h = Llabel.getHeight();
                _w = Llabel.getWidth();
                _x = Llabel.getX();
                _y = Llabel.getY();

                Llabel.setX( _x - _w - 6 - 2 );
                Llabel.setY( _y );

                this.appendToLabels( Llabel );

                if ( ( fR == true ) && ( fL == true ) ) gDiff = 0;
            }
        }

        await this.axis.draw( instance );

        let count = this.getLabelsCount();
        for ( let i = 0; i < count; i++ ) {
            await this.getLabelAt( i ).render( instance );
        }

    }

    async drawScalePoint( _vdp, _sc_bx, _sc_by, _t, _dcolor )
    {
        let instance = this.getInstance();
        if ( _vdp == true ) {
            this.discretlines.appendscaled( 
                _sc_bx - instance.getScaledSizeOfPixelX(), 
                _sc_by - instance.getScaledSizeOfPixelY(),
                _sc_bx + instance.getScaledSizeOfPixelX(), 
                _sc_by - instance.getScaledSizeOfPixelY(),
                _t, 
                _dcolor
            );
            this.discretlines.appendscaled( 
                _sc_bx - instance.getScaledSizeOfPixelX(), 
                _sc_by + instance.getScaledSizeOfPixelY(),
                _sc_bx + instance.getScaledSizeOfPixelX(), 
                _sc_by + instance.getScaledSizeOfPixelY(),
                _t, 
                _dcolor
            );
            this.discretlines.appendscaled( 
                _sc_bx - instance.getScaledSizeOfPixelX(), 
                _sc_by - instance.getScaledSizeOfPixelY(),
                _sc_bx - instance.getScaledSizeOfPixelX(), 
                _sc_by + instance.getScaledSizeOfPixelY(),
                _t, 
                _dcolor
            );
            this.discretlines.appendscaled( 
                _sc_bx + instance.getScaledSizeOfPixelX(), 
                _sc_by - instance.getScaledSizeOfPixelY(),
                _sc_bx + instance.getScaledSizeOfPixelX(), 
                _sc_by + instance.getScaledSizeOfPixelY(),
                _t, 
                _dcolor
            );                                        
        }
    }

    async arrayDraw( instance, _object, _channels, _nchannel, _rateofsamples, _volumescale, x, y, width, height, kdX, kdY, zoomX, zoomY, _t, _colors ) 
    {
        let _new_object = _object;

/*
        for( let ii = 0; ii < 60; ii++ ) {
            for ( let j = 0; j < _object.length; j = j + _channels) {
                if ( _object.length - j <= 2 ) break;
                for ( let nchannel = 0; nchannel < _channels; nchannel++ ) {
                    _new_object[ j + nchannel ] = 0.5 * ( _new_object[ j + nchannel + _channels ] + _new_object[ j + nchannel ] );
                }
            }
        }
*/

        let _width = width - instance.getBorderWidth() * 2.0;
        let _height = height - instance.getBorderWidth() * 2.0;

        let _x = x + instance.getBorderWidth();
        let _y = y + instance.getBorderWidth();

        let _framescount = _new_object.length / _channels;

        let kX = zoomX / 100.0;
        let kY = zoomY / 100.0;

        let _vdp = false;

        let _rs_bx = undefined;
        let _rs_by = undefined;
        let _ls_bx = undefined;
        let _ls_by = undefined;
        let _i_last_bi = undefined;

        ///////////////////////////////////////////////////////////////////
        // Step in samples on x axis
        ///////////////////////////////////////////////////////////////////
        let _ix_step = Math.trunc( _framescount / kdX );

        let _ix_excess = _ix_step % _channels;
        _ix_step = _ix_step - _ix_excess;

        let _ix_center = _framescount / 2.0;

        ///////////////////////////////////////////////////////////////////
        // Step in pixels with scale on x and y axis
        ///////////////////////////////////////////////////////////////////
        let _cX = kX * _width / kdX;
        let _centX = instance.getScaledX( _x + _width / 2.0 );

        for ( let i = 0; i < kdX / 2; i++ )
        {
            /////////////////////////////////////////////////
            // x and y: one step to right side in radians
            let _rs_ex = _ix_center + i * _ix_step;
            let _rs_ey = _new_object[ _channels * _rs_ex + _nchannel ] * _height / height;

            /////////////////////////////////////////////////
            // x and y: one step to left side in radians
            let _ls_ex = _ix_center - i * _ix_step;
            let _ls_ey = _new_object[ _channels * _ls_ex + _nchannel ] * _height / height;

            if ( i == 0 ) {
                _rs_bx = _rs_ex;
                _rs_by = _rs_ey;
                _ls_bx = _ls_ex;
                _ls_by = _ls_ey;
                _i_last_bi = i;
                continue;
            }

            let _sc_rs_bx = _centX + instance.getScaledX ( _i_last_bi * _cX );
            let _sc_rs_by = instance.getScaledOffsetY( _rs_by * kY ); 

            let _sc_rs_ex = _centX + instance.getScaledX ( i * _cX );
            let _sc_rs_ey = instance.getScaledOffsetY( _rs_ey * kY ); 

            this.discretlines.appendscaled( 
                _sc_rs_bx, 
                _sc_rs_by,
                _sc_rs_ex, 
                _sc_rs_ey,
                _t, 
                _colors[ _nchannel ] 
            );

            if ( i % 8 == 0 ) {
                await this.drawScalePoint( _vdp, _sc_rs_bx, _sc_rs_by, _t, _colors[ _nchannel ]  );
                await this.drawScalePoint( _vdp, _sc_rs_ex, _sc_rs_ey, _t, _colors[ _nchannel ]  );
            }
        
            let _sc_ls_bx = _centX - instance.getScaledX( _i_last_bi * _cX );
            let _sc_ls_by = instance.getScaledOffsetY( _ls_by * kY );

            let _sc_ls_ex = _centX - instance.getScaledX( i * _cX );
            let _sc_ls_ey = instance.getScaledOffsetY( _ls_ey * kY ); 

            this.discretlines.appendscaled( 
                _sc_ls_bx, 
                _sc_ls_by,
                _sc_ls_ex, 
                _sc_ls_ey,
                _t, _colors[ _nchannel ] 
            );                             

            if ( i % 8 == 0 ) {
                await this.drawScalePoint( _vdp, _sc_ls_bx, _sc_ls_by, _t, _colors[ _nchannel ]  );
                await this.drawScalePoint( _vdp, _sc_ls_ex, _sc_ls_ey, _t, _colors[ _nchannel ]  );
            }
            
            _rs_bx = _rs_ex;
            _rs_by = _rs_ey;
            _ls_bx = _ls_ex;
            _ls_by = _ls_ey;

            _i_last_bi = i;
        }
    }

    async functionDraw( instance, _object, _rateofsamples, _volumescale, x, y, width, height, kdX, kdY, zoomX, zoomY, _t, colors ) 
    {
        ////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////
        // _samplerate: 44100 - 1s           
        ////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////
        // let sX = 2.0 * _samplerate / kdX;
        // let sX = tX * _samplerate;
        ////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////

        let _width = width - instance.getBorderWidth() * 2.0;
        let _height = height - instance.getBorderWidth() * 2.0;

        let _x = x + instance.getBorderWidth();
        let _y = y + instance.getBorderWidth();

        let flag = this.isDuty();

        if ( flag == true )
        {
            let kX = zoomX / 100.0;
            let kY = zoomY / 100.0;

            // let offX = 10.0;
            // let offY = 10.0;

            ////////////////////////////////////////////////////////////////////////
            // let cX = _width * kX / kdX;  this.cX
            // let cY = _height * kY / kdY; this.cY
            ////////////////////////////////////////////////////////////////////////

            // let tX = 2.0 / this.kdX;

            // let sX = 2.0 * _samplerate / this.kdX;
            // let vY = 2.0 * _volumerate / this.kdY;

            let _vdp = ( _object.dpoints == undefined ) ? false : _object.dpoints;
            let _dpc = ( _object.dcolor == undefined ) ? [ 1.0, 1.0, 1.0, 1.0 ] : _object.dcolor;
            let _lgc = ( _object.coords.color == undefined ) ? [ 1.0, 1.0, 1.0, 1.0 ] : _object.coords.color;

            let dcolors = [ { from: _dpc, to: _dpc } ];
            let lcolors = [ { from: _lgc, to: _lgc } ];

            let _func = _object.func;

            let _x_min = _object.coords.x.min;
            let _x_max = _object.coords.x.max;

            ///////////////////////////////////////////////////////////////////
            // Количество отсчетов
            ///////////////////////////////////////////////////////////////////
            // let _xdp = _object.coords.x.dprepeats;
            // let _y_min_ = _object.coords.y.min;
            // let _y_max_ = _object.coords.y.max;
            ///////////////////////////////////////////////////////////////////

            let _rs_bx = undefined;
            let _rs_by = undefined;
            let _ls_bx = undefined;
            let _ls_by = undefined;
            let _i_last_bi = undefined;

            ///////////////////////////////////////////////////////////////////
            // Step in radians on x axis
            ///////////////////////////////////////////////////////////////////
            let _ix_step = ( _x_max - _x_min ) / kdX;
            let _ix_center = ( _x_max - _x_min ) / 2.0;

            ///////////////////////////////////////////////////////////////////
            // Step in pixels with scale on x and y axis
            ///////////////////////////////////////////////////////////////////
            let _cX = kX * _width / kdX;
            let _centX = _x + _width / 2.0;

            for ( let i = 0; i < kdX / 2.0; i++ )
            {
                /////////////////////////////////////////////////
                // x and y: one step to right side in radians
                let _rs_ex = (+1) * _ix_step * i + _ix_center;
                let _rs_ey = _func( _rs_ex ) * _height / height;

                /////////////////////////////////////////////////
                // x and y: one step to left side in radians
                let _ls_ex = (-1) * _ix_step * i + _ix_center;
                let _ls_ey = _func( _ls_ex ) * _height / height;

                if ( i == 0 ) 
                {
                    _rs_bx = _rs_ex;
                    _rs_by = _rs_ey;
                    _ls_bx = _ls_ex;
                    _ls_by = _ls_ey;

                    _i_last_bi = i;
                    continue;
                }

                let _sc_rs_bx = _centX + instance.calcXtoS ( instance.calcStoX ( _i_last_bi * _cX ) );
                let _sc_rs_by = instance.calcYtoS ( _rs_by * kY ); 

                let _sc_rs_ex = _centX + instance.calcXtoS ( instance.calcStoX ( i * _cX ) );
                let _sc_rs_ey = instance.calcYtoS ( _rs_ey * kY );

                ///////////////////////////////////////////////////////////////////
                // console.log( "i: " + i + "; " + _x + ": " + _y );
                ///////////////////////////////////////////////////////////////////
                        
                // if ( _rs_sc_bx == _rs_sc_ex || _rs_sc_by == _rs_sc_ey ) console.log( "possible skipping" );
                // if ( _rs_sc_ex > ( x + _width - offX ) ) continue;

                this.discretlines.append( 
                    _sc_rs_bx, 
                    _sc_rs_by,
                    _sc_rs_ex, 
                    _sc_rs_ey,
                    _t, 
                    lcolors[0] 
                );

                await this.drawScalePoint( _vdp, _sc_rs_bx, _sc_rs_by, _t, lcolors );
                await this.drawScalePoint( _vdp, _sc_rs_ex, _sc_rs_ey, _t, lcolors );
        
                let _sc_ls_bx = _centX - instance.calcXtoS ( instance.calcStoX ( _i_last_bi * _cX ) );
                let _sc_ls_by = instance.calcYtoS ( _ls_by * kY );

                let _sc_ls_ex = _centX - instance.calcXtoS ( instance.calcStoX ( i * _cX ) );
                let _sc_ls_ey = instance.calcYtoS ( _ls_ey * kY ); 

                // if ( _ls_sc_bx == _ls_sc_ex || _ls_sc_by == _ls_sc_ey ) console.log( "possible skipping" );
                // if ( _ls_sc_ex < ( x + offX ) ) continue;

                this.discretlines.append( 
                    _sc_ls_bx, 
                    _sc_ls_by,
                    _sc_ls_ex, 
                    _sc_ls_ey,
                    _t, lcolors[0] 
                );                             

                await this.drawScalePoint( _vdp, _sc_ls_bx, _sc_ls_by, _t, lcolors );
                await this.drawScalePoint( _vdp, _sc_ls_ex, _sc_ls_ey, _t, lcolors );

                _rs_bx = _rs_ex;
                _rs_by = _rs_ey;
                _ls_bx = _ls_ex;
                _ls_by = _ls_ey;

                _i_last_bi = i;
            }
        }
    }

    async drawData( instance, _object, _channels, _render, _rateofsamples, _volumescale, kdX, kdY, zoomX, zoomY, _t = 1, _colors = [ { from: [ 1.0, 1.0, 1.0, 1.0 ], to: [ 1.0, 1.0, 1.0, 1.0 ] } ] ) 
    {
        let kX = zoomX / 100.0;
        let kY = zoomY / 100.0;

        let _width = this.getWidth();
        let _height = this.getHeight();

        let cX = _width * kX / kdX;
        let cY = _height * kY / kdY;

        ////////////////////////////////////////////////////////////////////////
        // _samplerate: 44100 - 1s           
        ////////////////////////////////////////////////////////////////////////
        // let sX = 2.0 * _samplerate / kdX;
        ////////////////////////////////////////////////////////////////////////

        let sX = _rateofsamples * 2.0 / kdX;
        let vY = 2.0 * _volumescale / kdY;

        if ( this.zoomX == undefined || this.zoomX != zoomX ) {
            this.zoomX = zoomX;
            this.setDuty();
        }

        if ( this.zoomY == undefined || this.zoomY != zoomY ) {
            this.zoomY = zoomY;
            this.setDuty();
        }

        if ( this.kdX == undefined || this.kdX != kdX ) {
            this.kdX = kdX;
            this.setDuty();
        }

        if ( this.kdY == undefined || this.kdY != kdY ) {
            this.kdY = kdY;
            this.setDuty();
        }

        if ( this.vY == undefined || this.vY != vY ) {
            this.vY = vY;
            this.setDuty();
        }

        if ( this.sX == undefined || this.sX != sX ) {
            this.sX = sX;
            this.setDuty();
        } 

        if ( this.cX == undefined || this.cX != cX ) {
            this.cX = cX;
            this.setDuty();
        }

        if ( this.cY == undefined || this.cY != cY ) {
            this.cY = cY;
            this.setDuty();
        } 

        let x = this.getX();
        let y = this.getY();

        await this.borderDraw( instance, x, y, _width, _height, 1, _colors );
        await this.axisDraw( instance, _rateofsamples, _volumescale, x, y, _width, _height, kdX, kdY, zoomX, zoomY, 1, [ { from: [ 1.0, 1.0, 1.0, 1.0 ], to: [ 1.0, 1.0, 1.0, 1.0 ] } ] );

        if ( _object != null && _object != undefined ) {
            if ( _object.length > 0 ) {
                this.discretlines.clear();
                if ( _channels >= 2 ) {
                    if ( _render == "left" ) {
                        await this.arrayDraw( instance, _object, _channels, 0, _rateofsamples, _volumescale, x, y, _width, _height, kdX, kdY, zoomX, zoomY, _t, _colors );
                    }
                    if ( _render == "right" ) {
                        await this.arrayDraw( instance, _object, _channels, 1, _rateofsamples, _volumescale, x, y, _width, _height, kdX, kdY, zoomX, zoomY, _t, _colors );
                    }
                    if ( _render == "stereo" ) {
                        for ( let i = 0; i < _channels; i++ ) {
                            await this.arrayDraw( instance, _object, _channels, i, _rateofsamples, _volumescale, x, y, _width, _height, kdX, kdY, zoomX, zoomY, _t, _colors );
                        }
                    }
                } else {
                    await this.arrayDraw( instance, _object, _channels, 0, _rateofsamples, _volumescale, x, y, _width, _height, kdX, kdY, zoomX, zoomY, _t, _colors );
                }
                await this.discretlines.draw( instance );
            }
        }

        this.resetDuty();

    }

    async drawConfig( instance, object, _rateofsamples, _volumescale, kdX, kdY, zoomX, zoomY, _t = 1, _colors = [ { from: [ 1.0, 1.0, 1.0, 1.0 ], to: [ 1.0, 1.0, 1.0, 1.0 ] } ] ) 
    {
        let kX = zoomX / 100.0;
        let kY = zoomY / 100.0;

        let _width = this.getWidth();
        let _height = this.getHeight();

        let cX = _width * kX / kdX;
        let cY = _height * kY / kdY;

        ////////////////////////////////////////////////////////////////////////
        // _samplerate: 44100 - 1s           
        ////////////////////////////////////////////////////////////////////////
        // let sX = 2.0 * _samplerate / kdX;
        ////////////////////////////////////////////////////////////////////////

        let sX = _rateofsamples * 2.0 / kdX;
        let vY = 2.0 * _volumescale / kdY;

        if ( this.zoomX == undefined || this.zoomX != zoomX ) {
            this.zoomX = zoomX;
            this.setDuty();
        }

        if ( this.zoomY == undefined || this.zoomY != zoomY ) {
            this.zoomY = zoomY;
            this.setDuty();
        }

        if ( this.kdX == undefined || this.kdX != kdX ) {
            this.kdX = kdX;
            this.setDuty();
        }

        if ( this.kdY == undefined || this.kdY != kdY ) {
            this.kdY = kdY;
            this.setDuty();
        }

        if ( this.vY == undefined || this.vY != vY ) {
            this.vY = vY;
            this.setDuty();
        }

        if ( this.sX == undefined || this.sX != sX ) {
            this.sX = sX;
            this.setDuty();
        } 

        if ( this.cX == undefined || this.cX != cX ) {
            this.cX = cX;
            this.setDuty();
        }

        if ( this.cY == undefined || this.cY != cY ) {
            this.cY = cY;
            this.setDuty();
        } 

        let x = this.getX();
        let y = this.getY();

        await this.borderDraw( instance, x, y, _width, _height, 1, _colors );
        await this.axisDraw( instance, _rateofsamples, _volumescale, x, y, _width, _height, kdX, kdY, zoomX, zoomY, 1, _colors );

        if ( object.draw != undefined ) 
        {
            if ( object.draw.length != undefined ) 
            {
                if ( object.draw.length > 0 ) 
                {
                    let flag = this.isDuty();
                    if ( flag == true ) 
                    {
                        this.discretlines.clear();
                        for ( let i = 0; i < object.draw.length; i++ ) {
                            await this.functionDraw( instance, object.draw[i], _rateofsamples, _volumescale, x, y, _width, _height, kdX, kdY, zoomX, zoomY, _t, _colors );
                        }
                    }
                    await this.discretlines.draw( instance );
                }
            }
        }

        this.resetDuty();
    }
};
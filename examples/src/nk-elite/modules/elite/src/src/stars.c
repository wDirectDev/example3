/*
 * Elite - The New Kind.
 *
 * Reverse engineered from the BBC disk version of Elite.
 * Additional material by C.J.Pinder.
 *
 * The original Elite code is (C) I.Bell & D.Braben 1984.
 * This version re-engineered in C by C.J.Pinder 1999-2001.
 *
 * email: <christian@newkind.co.uk>
 *
 *
 */

#include "etnk.h"

#include <stdlib.h>
#include <math.h>

#include "elite.h" 
#include "ssdl.h"
#include "vector.h"
#include "stars.h"
#include "random.h"

int warp_stars;

struct star
{
	double x;
	double y;
	double z;
};

struct star stars[20];


void create_new_stars (void)
{
	int i;
	int nstars;
	
	nstars = witchspace ? 3 : 12;

	for (i = 0; i < nstars; i++)
	{
		stars[i].x = (rand255() - 128) | 8;
		stars[i].y = (rand255() - 128) | 4;
		stars[i].z = rand255() | 0x90;
	}

	warp_stars = 0;
}


void front_starfield (void)
{
	int i;
	double Q;
	double delta;
	double alpha = 0;
	double beta = 0;
	double xx,yy,zz;
	int sx;
	int sy;
	int nstars;
	
	nstars = witchspace ? 3 : 12;

	delta = warp_stars ? 50 : flight_speed;	
	alpha = (double)flight_roll;
	beta = (double)flight_climb;

	alpha /= 256.0;
	delta /= 2.0;
	
	for (i = 0; i < nstars; i++)
	{
		/* Plot the stars in their current locations... */

		sy = stars[i].y;
		sx = stars[i].x;
		zz = stars[i].z;

		sx += wnd_width / 2;
		sy += ( wnd_height / 2 ) - 132;

		if ((!warp_stars) &&
			(sx >= GFX_VIEW_TX) && (sx <= GFX_VIEW_BX) &&
			(sy >= GFX_VIEW_TY) && (sy <= GFX_VIEW_BY))
		{
			gfx_plot_pixel (sx, sy, GFX_COL_WHITE);

			if (zz < 0xC0)
				gfx_plot_pixel (sx+1, sy, GFX_COL_WHITE);

			if (zz < 0x90)
			{
				gfx_plot_pixel (sx, sy+1, GFX_COL_WHITE);
				gfx_plot_pixel (sx+1, sy+1, GFX_COL_WHITE);
			}
		}


		/* Move the stars to their new locations...*/

		Q = delta / stars[i].z;

		stars[i].z -= delta;
		yy = stars[i].y + (stars[i].y * Q);
		xx = stars[i].x + (stars[i].x * Q);
		zz = stars[i].z;

		yy = yy + (xx * alpha);
		xx = xx - (yy * alpha);

/*
		tx = yy * beta;
		xx = xx + (tx * tx * 2);
*/
		yy = yy + beta;

		stars[i].y = yy;
		stars[i].x = xx;

		
		if (warp_stars)
			gfx_draw_line (sx, sy, (xx + ( wnd_width / 2 )), (yy + ( wnd_height / 2 ) - 132));
		
		sx = xx;
		sy = yy;

		if ((sx > 120) || (sx < -120) ||
			(sy > 120) || (sy < -120) || (zz < 16))
		{
			stars[i].x = (rand255() - 128) | 8;
			stars[i].y = (rand255() - 128) | 4;
			stars[i].z = rand255() | 0x90;
			continue;
		}

	}

	warp_stars = 0;
}



void rear_starfield (void)
{
	int i;
	double Q;
	double delta;
	double alpha = 0;
	double beta = 0;
	double xx,yy,zz;
	int sx,sy;
	int ex,ey;
	int nstars;
	
	nstars = witchspace ? 3 : 12;

	delta = warp_stars ? 50 : flight_speed;	
	alpha = -flight_roll;
	beta = -flight_climb;

	alpha /= 256.0;
	delta /= 2.0;
	
	for (i = 0; i < nstars; i++)
	{
		/* Plot the stars in their current locations... */

		sy = stars[i].y;
		sx = stars[i].x;
		zz = stars[i].z;

		sx += ( wnd_width / 2 );
		sy += ( wnd_height / 2 ) - 132;

		if ((!warp_stars) &&
			(sx >= GFX_VIEW_TX) && (sx <= GFX_VIEW_BX) &&
			(sy >= GFX_VIEW_TY) && (sy <= GFX_VIEW_BY))
		{
			gfx_plot_pixel (sx, sy, GFX_COL_WHITE);

			if (zz < 0xC0)
				gfx_plot_pixel (sx+1, sy, GFX_COL_WHITE);

			if (zz < 0x90)
			{
				gfx_plot_pixel (sx, sy+1, GFX_COL_WHITE);
				gfx_plot_pixel (sx+1, sy+1, GFX_COL_WHITE);
			}
		}


		/* Move the stars to their new locations...*/

		Q = delta / stars[i].z;

		stars[i].z += delta;
		yy = stars[i].y - (stars[i].y * Q);
		xx = stars[i].x - (stars[i].x * Q);
		zz = stars[i].z;

		yy = yy + (xx * alpha);
		xx = xx - (yy * alpha);

/*
		tx = yy * beta;
		xx = xx + (tx * tx * 2);
*/
		yy = yy + beta;
		
		if (warp_stars)
		{
			ey = yy;
			ex = xx;
			ex = (ex + ( wnd_width / 2 ) - 132);
			ey = (ey + ( wnd_height / 2 ) - 132);

			if ((sx >= GFX_VIEW_TX) && (sx <= GFX_VIEW_BX) &&
			   (sy >= GFX_VIEW_TY) && (sy <= GFX_VIEW_BY) &&
			   (ex >= GFX_VIEW_TX) && (ex <= GFX_VIEW_BX) &&
			   (ey >= GFX_VIEW_TY) && (ey <= GFX_VIEW_BY))
				gfx_draw_line (sx, sy, (xx + ( wnd_width / 2 )) * GFX_SCALE, (yy + ( wnd_height / 2 ) - 132));
		}
		
		stars[i].y = yy;
		stars[i].x = xx;

		if ((zz >= 300) || (fabs(yy) >= 110))
		{
			stars[i].z = (rand255() & 127) + 51;
			
			if (rand255() & 1)
			{
				stars[i].x = rand255() - 128;
				stars[i].y = (rand255() & 1) ? -115 : 115;
			}
			else
			{
				stars[i].x = (rand255() & 1) ? -126 : 126;
				stars[i].y = rand255() - 128; 
			}
		}

	}

	warp_stars = 0;
}


void side_starfield (void)
{
	int i;
	double delta;
	double alpha;
	double beta;
	double xx,yy,zz;
	int sx;
	int sy;
	double delt8;
	int nstars;
	
	nstars = witchspace ? 3 : 12;
	
	delta = warp_stars ? 50 : flight_speed;	
	alpha = flight_roll;
	beta = flight_climb;

	if (current_screen == SCR_LEFT_VIEW)
	{
		delta = -delta;
		alpha = -alpha;
		beta = -beta;
	} 
	
	for (i = 0; i < nstars; i++)
	{
		sy = stars[i].y;
		sx = stars[i].x;
		zz = stars[i].z;

		sx += ( wnd_width / 2 );
		sy += ( wnd_height / 2 ) - 132;

		if ((!warp_stars) &&
			(sx >= GFX_VIEW_TX) && (sx <= GFX_VIEW_BX) &&
			(sy >= GFX_VIEW_TY) && (sy <= GFX_VIEW_BY))
		{
			gfx_plot_pixel (sx, sy, GFX_COL_WHITE);

			if (zz < 0xC0)
				gfx_plot_pixel (sx+1, sy, GFX_COL_WHITE);

			if (zz < 0x90)
			{
				gfx_plot_pixel (sx, sy+1, GFX_COL_WHITE);
				gfx_plot_pixel (sx+1, sy+1, GFX_COL_WHITE);
			}
		}

		yy = stars[i].y;
		xx = stars[i].x;
		zz = stars[i].z;
		
		delt8 = delta / (zz / 32);
		xx = xx + delt8;

		xx += (yy * (beta / (wnd_width / 2)));		
		yy -= (xx * (beta / (wnd_height / 2)));

		xx += ((yy / (wnd_width / 2)) * (alpha / (wnd_width / 2))) * (-xx);
		yy += ((yy / (wnd_height / 2)) * (alpha / (wnd_height / 2))) * (yy);

		yy += alpha; 

		stars[i].y = yy;
		stars[i].x = xx;

		if (warp_stars)
			gfx_draw_line (sx, sy, (xx + wnd_width / 2), (yy + ( wnd_height / 2 ) - 132) );

		
		if (fabs(stars[i].x) >= 116)
		{
			stars[i].y = rand255() - wnd_height / 4;
			stars[i].x = (current_screen == SCR_LEFT_VIEW) ? 115 : -115;
			stars[i].z = rand255() | 8;
		}
		else if (fabs(stars[i].y) >= 116)
		{
			stars[i].x = rand255() - wnd_width / 4;
			stars[i].y = (alpha > 0) ? -110 : 110;
			stars[i].z = rand255() | 8;
		} 
		
	}

	warp_stars = 0;
}


/*
 * When we change view, flip the stars over so they look like other stars.
 */

void flip_stars (void)
{
	int i;
	int nstars;
	int sx;
	int sy;
	
	nstars = witchspace ? 3 : 12;
	for (i = 0; i < nstars; i++)
	{
		sy = stars[i].y;
		sx = stars[i].x;
		stars[i].x = sy;
		stars[i].y = sx;
	}
}


void update_starfield (void)
{
	switch (current_screen)
	{
		case SCR_FRONT_VIEW:
		case SCR_INTRO_ONE:
		case SCR_INTRO_TWO:
		case SCR_ESCAPE_POD:
			front_starfield();
			break;
		
		case SCR_REAR_VIEW:
		case SCR_GAME_OVER:
			rear_starfield();
			break;
		
		case SCR_LEFT_VIEW:
		case SCR_RIGHT_VIEW:
			side_starfield();
			break;
	}
}

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


/**
 *
 * Elite - The New Kind.
 *
 * The code in this file has not been derived from the original Elite code.
 * Written by C.J.Pinder 1999/2000.
 *
 **/


#ifndef ETNK_SDL_H
#define ETNK_SDL_H

#define GFX_SCALE             (1)
#define GFX_X_OFFSET	      (0)
#define GFX_Y_OFFSET		  (0)

#define GFX_FONT_SIZE         (10)

#define GFX_BORDER_SIZE       (1)

#define GFX_HEADER_SIZE       (34)
#define GFX_FOOTER_SIZE       (43)

#define GFX_WINDOW_WIDTH      (wnd_width)
#define GFX_WINDOW_HEIGHT     (wnd_height)

#define SCANNER_WIDTH         (scanner_width)
#define SCANNER_HEIGHT        (scanner_height)

#define GFX_FULLHEADER_SIZE   (GFX_HEADER_SIZE + 2 * GFX_BORDER_SIZE)
#define GFX_FULLFOOTER_SIZE   (GFX_FOOTER_SIZE + 2 * GFX_BORDER_SIZE)

#define GFX_SCANNER_L_COORD   (0)
#define GFX_SCANNER_R_COORD   (GFX_WINDOW_WIDTH - 1)
#define GFX_SCANNER_T_COORD   ((GFX_WINDOW_HEIGHT - 1) - SCANNER_HEIGHT + 1)
#define GFX_SCANNER_B_COORD   (GFX_WINDOW_HEIGHT - 1)

#define GFX_WINDOW_L_COORD    (0)
#define GFX_WINDOW_R_COORD    (GFX_WINDOW_WIDTH - 1)
#define GFX_WINDOW_T_COORD    (0)
#define GFX_WINDOW_B_COORD    ((GFX_WINDOW_HEIGHT - 1) - SCANNER_HEIGHT) // next free

#define GFX_WINDOW_WHCOORD    (GFX_WINDOW_HEIGHT - 1)
#define GFX_WINDOW_WWCOORD    (GFX_WINDOW_WIDTH - 1)

#define GFX_VIEW_L_COORD      (GFX_WINDOW_L_COORD + GFX_BORDER_SIZE)
#define GFX_VIEW_R_COORD      (GFX_WINDOW_R_COORD - GFX_BORDER_SIZE)
#define GFX_VIEW_T_COORD      (GFX_WINDOW_T_COORD + GFX_FULLHEADER_SIZE) // nex
#define GFX_VIEW_B_COORD      (GFX_WINDOW_B_COORD - GFX_FULLFOOTER_SIZE) // 

#define GFX_VIEW_WSIZE		  (GFX_WINDOW_WIDTH - 2 * GFX_BORDER_SIZE )
#define GFX_VIEW_HSIZE		  (GFX_WINDOW_HEIGHT - SCANNER_HEIGHT - GFX_FULLFOOTER_SIZE - GFX_FULLHEADER_SIZE )

#define GFX_XWINDOW_CENTER	  (GFX_WINDOW_WIDTH / 2)
#define GFX_YWINDOW_CENTER	  (GFX_BORDER_SIZE + GFX_HEADER_SIZE + ((GFX_WINDOW_HEIGHT - SCANNER_HEIGHT - GFX_FULLHEADER_SIZE) / 2))

#define GFX_X_CENTER		  (GFX_BORDER_SIZE + GFX_VIEW_WSIZE / 2 - 1)
#define GFX_Y_CENTER		  (GFX_FULLHEADER_SIZE + GFX_VIEW_HSIZE / 2 - 1)

#define GFX_FOOTER_LSIZE      (GFX_BORDER_SIZE + 16)

#define GFX_FOOTER_L1         ((GFX_WINDOW_HEIGHT - SCANNER_HEIGHT - GFX_BORDER_SIZE - GFX_FOOTER_SIZE) + 10)
#define GFX_FOOTER_L2         ((GFX_WINDOW_HEIGHT - SCANNER_HEIGHT - GFX_BORDER_SIZE - GFX_FOOTER_SIZE) + 22)

#define GFX_VIEW_TX           1
#define GFX_VIEW_TY           1
#define GFX_VIEW_BX		(wnd_width - 3)
#define GFX_VIEW_BY		(wnd_height - 131)

#define GFX_COL_BLACK		0
#define GFX_COL_DARK_RED	28
#define GFX_COL_WHITE		255
#define GFX_COL_GOLD		39
#define GFX_COL_RED		49
#define GFX_COL_CYAN		11

#define GFX_COL_GREY_1		248
#define GFX_COL_GREY_2		235
#define GFX_COL_GREY_3		234
#define GFX_COL_GREY_4		237

#define GFX_COL_BLUE_1		45
#define GFX_COL_BLUE_2		46
#define GFX_COL_BLUE_3		133
#define GFX_COL_BLUE_4		4

#define GFX_COL_RED_3		1
#define GFX_COL_RED_4		71

#define GFX_COL_WHITE_2		242

#define GFX_COL_YELLOW_1	37
#define GFX_COL_YELLOW_2	39
#define GFX_COL_YELLOW_3	89
#define GFX_COL_YELLOW_4	160
#define GFX_COL_YELLOW_5	251

#define GFX_ORANGE_1		76
#define GFX_ORANGE_2		77
#define GFX_ORANGE_3		122

#define GFX_COL_GREEN_1		2
#define GFX_COL_GREEN_2		17
#define GFX_COL_GREEN_3		86

#define GFX_COL_PINK_1		183

#define IMG_THE_SCANNER		0
#define IMG_GREEN_DOT		1
#define IMG_RED_DOT		2
#define IMG_BIG_S		3
#define IMG_ELITE_TXT		4
#define IMG_BIG_E		5
#define IMG_DICE		6
#define IMG_MISSILE_GREEN	7
#define IMG_MISSILE_YELLOW	8
#define IMG_MISSILE_RED		9
#define IMG_BLAKE		10
#define IMG_NUM_OF		11

#define PIXEL_FORMAT SDL_PIXELFORMAT_ARGB8888

extern int scanner_width;
extern int scanner_height;
extern int wnd_width;
extern int wnd_height;
extern int wnd_fullscreen;
extern double wnd_scale;

extern SDL_Texture	*sdl_tex_clone;
extern SDL_Texture	*sdl_tex;
extern SDL_Window	*sdl_win;
extern SDL_Renderer	*sdl_ren;

SDL_RWops *datafile_open ( const char *fn );

extern int  sdl_last_key_pressed;

extern int  start_sdl ( void );
extern void handle_sdl_events ( void );
int decode_keysym ( SDL_Keycode sym );

extern int  gfx_graphics_startup (void);
//extern void gfx_graphics_shutdown (void);
extern void gfx_update_screen (void);
extern void gfx_acquire_screen (void);
extern void gfx_release_screen (void);
extern void gfx_plot_pixel (int x, int y, int col);
extern void gfx_fast_plot_pixel (int x, int y, int col);
extern void gfx_draw_filled_circle (int cx, int cy, int radius, Uint32 circle_colour);
extern void gfx_draw_circle (int cx, int cy, int radius, Uint32 circle_colour);
extern void gfx_draw_line (int x1, int y1, int x2, int y2);
extern void gfx_draw_colour_line_logical (int x1, int y1, int x2, int y2, unsigned int line_colour, int logical_mode );
extern void gfx_draw_colour_line (int x1, int y1, int x2, int y2, int line_colour);
extern void gfx_draw_triangle (int x1, int y1, int x2, int y2, int x3, int y3, int col);

extern void gfx_draw_roundedsimplerect (int tx, int ty, int bx, int by, int col);
extern void gfx_draw_roundedfilledrect (int tx, int ty, int bx, int by, int col);
extern void gfx_draw_filledrect (int tx, int ty, int bx, int by, int col);
extern void gfx_draw_simplerect (int tx, int ty, int bx, int by, int col);

extern void gfx_display_text (int x, int y, char *txt);
extern void gfx_display_colour_text (int x, int y, char *txt, int col);
extern void gfx_display_centre_text (int y, char *str, int psize, int col);
extern void gfx_clear_display (void);
extern void gfx_clear_text_area (void);
extern void gfx_clear_area (int tx, int ty, int bx, int by);
extern void gfx_display_pretty_text (int tx, int ty, int bx, int by, char *txt);
extern void gfx_draw_scanner (void);
extern void gfx_clear_scanner(void);
extern void gfx_set_clip_region (int tx, int ty, int bx, int by);
extern void gfx_polygon (int num_points, int *poly_list, int face_colour);
extern void gfx_draw_sprite (int sprite_no, int x, int y);
extern void gfx_start_render (void);
extern void gfx_render_polygon (int num_points, int *point_list, int face_colour, int zavg);
extern void gfx_render_line (int x1, int y1, int x2, int y2, int dist, int col);
extern void gfx_finish_render (void);
extern int  gfx_request_file (char *title, char *path, char *ext);
extern void gfx_texture_clone(void);
extern void gfx_swap_textures(void);

#endif

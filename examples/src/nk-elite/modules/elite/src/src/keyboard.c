/*
 * Elite - The New Kind.
 *
 * Allegro version of the keyboard routines.
 *
 * The code in this file has not been derived from the original Elite code.
 * Written by C.J.Pinder 1999-2001.
 * email: <christian@newkind.co.uk>
 *
 */

/*
 * keyboard.c
 *
 * Code to handle keyboard input.
 */

#include "etnk.h"

#include <stdlib.h>
#include <string.h>

// usleep
#include <unistd.h>

#include "keyboard.h"
#include "ssdl.h"
 
int kbd_F1_pressed;
int kbd_F2_pressed;
int kbd_F3_pressed;
int kbd_F4_pressed;
int kbd_F5_pressed;
int kbd_F6_pressed;
int kbd_F7_pressed;
int kbd_F8_pressed;
int kbd_F9_pressed;
int kbd_F10_pressed;
int kbd_F11_pressed;
int kbd_F12_pressed;
int kbd_y_pressed;
int kbd_n_pressed;
int kbd_zoom_pressed;
int kbd_fire_pressed;
int kbd_ecm_pressed;
int kbd_energy_bomb_pressed;
int kbd_hyperspace_pressed;
int kbd_ctrl_pressed;
int kbd_jump_pressed;
int kbd_escape_pressed;
int kbd_dock_pressed;
int kbd_d_pressed;
int kbd_origin_pressed;
int kbd_find_pressed;
int kbd_fire_missile_pressed;
int kbd_target_missile_pressed;
int kbd_unarm_missile_pressed;
int kbd_pause_pressed;
int kbd_resume_pressed;
int kbd_inc_speed_pressed;
int kbd_i_pressed;
int kbd_dec_speed_pressed;
int kbd_up_pressed;
int kbd_down_pressed;
int kbd_left_pressed;
int kbd_right_pressed;
int kbd_enter_pressed;
int kbd_backspace_pressed;
int kbd_space_pressed;

char old_key[KEY_MAX];



// Allegro stuff, wait for key ...
// It's kinda hard to translate Allegro to SDL, as Allegro seems to be a kinda strange stuff, and SDL is event based more
int readkey ( void )
{
	for (;;) {
		handle_sdl_events();
		if (sdl_last_key_pressed) {
			int ret = sdl_last_key_pressed;
			sdl_last_key_pressed = 0;
			return ret;
		}
		usleep(1);	// FIXME: how to wait???
	}
}


static int keypressed ( void )
{
	return sdl_last_key_pressed;
}


static int poll_keyboard ( void )
{
	handle_sdl_events();
	return 0;	// success
}

int keyboard_handle(void *userdata, SDL_Event *event) {
		switch (event->type) {
			case SDL_QUIT:
				exit(0);	// FIXME: do it nicer ....
			case SDL_KEYUP:
			case SDL_KEYDOWN:
				 printf("KEY: scan=%s[#%d] sym=%s[#%d] event=%s repeated=%d\n",
					SDL_GetScancodeName(event->key.keysym.scancode),
					event->key.keysym.scancode,
					SDL_GetKeyName(event->key.keysym.sym),
					event->key.keysym.sym,
					event->key.state == SDL_PRESSED ? "DOWN": "UP",
					event->key.repeat
				);
				if (!event->key.repeat) {
					int game_code = decode_keysym(event->key.keysym.sym);
					//printf("KEY_MAP=%d\n", game_code);
					if (game_code >= 0) {
						if (event->key.state == SDL_PRESSED) {
							key[game_code] = 1;
							sdl_last_key_pressed = game_code;
						} else {
							key[game_code] = 0;
						}
					} 
				}
				break;
		}

	return 0;
}

int kbd_keyboard_startup (void)
{
	SDL_AddEventWatch(keyboard_handle, NULL);
	return 0;
}

int kbd_keyboard_shutdown (void)
{
	SDL_DelEventWatch(keyboard_handle, NULL);
	return 0;
}

int kbd_check_keys()
{
	int i;

	for (i = 0; i < KEY_MAX; i++) {
	  if (!key[i]) continue;
	  key[i] = 1;
	  if (key[i] && old_key[i]) key[i] |= 2;
	}

	memcpy(old_key, key, KEY_MAX);

	kbd_F1_pressed = key[KEY_F1];
	kbd_F2_pressed = key[KEY_F2];
	kbd_F3_pressed = key[KEY_F3];
	kbd_F4_pressed = key[KEY_F4];
	kbd_F5_pressed = key[KEY_F5];
	kbd_F6_pressed = key[KEY_F6];
	kbd_F7_pressed = key[KEY_F7];
	kbd_F8_pressed = key[KEY_F8];
	kbd_F9_pressed = key[KEY_F9];
	kbd_F10_pressed = key[KEY_F10];
	kbd_F11_pressed = key[KEY_F11];
	kbd_F12_pressed = key[KEY_F12];

	kbd_y_pressed = key[KEY_y];
	kbd_n_pressed = key[KEY_n];
	kbd_zoom_pressed = key[KEY_z];

	kbd_fire_pressed = key[KEY_a];
	kbd_ecm_pressed = key[KEY_e];
	kbd_energy_bomb_pressed = key[KEY_TAB];
	kbd_hyperspace_pressed = key[KEY_h];
	kbd_ctrl_pressed = (key[KEY_LCTRL]) || (key[KEY_RCTRL]);
	kbd_jump_pressed = key[KEY_j];
	kbd_escape_pressed = key[KEY_ESCAPE];

	kbd_dock_pressed = key[KEY_c];
	kbd_d_pressed = key[KEY_d];
	kbd_origin_pressed = key[KEY_o];
	kbd_find_pressed = key[KEY_f];

	kbd_i_pressed = key[KEY_i];

	kbd_fire_missile_pressed = key[KEY_m];
	kbd_target_missile_pressed = key[KEY_t];
	kbd_unarm_missile_pressed = key[KEY_u];
	
	kbd_pause_pressed = key[KEY_p];
	kbd_resume_pressed = key[KEY_r];
	
	kbd_inc_speed_pressed = key[KEY_SPACE];
	kbd_dec_speed_pressed = key[KEY_SLASH];
	
	kbd_up_pressed = key[KEY_s] || key[KEY_UP];
	kbd_down_pressed = key[KEY_x] || key[KEY_DOWN];
	kbd_left_pressed = key[KEY_COMMA] || key[KEY_LEFT];
	kbd_right_pressed = key[KEY_STOP] || key[KEY_RIGHT];
	
	kbd_enter_pressed = key[KEY_RETURN];
	kbd_backspace_pressed = key[KEY_BACKSPACE];
	kbd_space_pressed = key[KEY_SPACE];

	int lastkey = 0;
	if (sdl_last_key_pressed) {
		lastkey = sdl_last_key_pressed;
		sdl_last_key_pressed = 0;
	}

	return lastkey;
}

void kbd_poll_keyboard (void)
{
	poll_keyboard();

	kbd_check_keys();

    ///////////////////////////////////
	// last key
	while (keypressed())
		readkey();
}


int kbd_read_key (void)
{
	int keynum;
	int keycode;
	int keyasc;

	kbd_enter_pressed = 0;
	kbd_backspace_pressed = 0;
	
	keynum = readkey();
	keycode = keynum >> 8;
	keyasc = keynum & 255;

	if (keycode == KEY_RETURN)
	{
		kbd_enter_pressed = 1;
		return 0;
	} 

	if (keycode == KEY_BACKSPACE)
	{
		kbd_backspace_pressed = 1;
		return 0;
	} 

	return keyasc;
}


void kbd_clear_key_buffer (void)
{
	while (keypressed())
		readkey();
}

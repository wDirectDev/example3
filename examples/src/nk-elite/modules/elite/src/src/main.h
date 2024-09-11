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

#ifndef ETNK_MAIN_H
#define ETNK_MAIN_H



#define						TRUE	 1
#define						FALSE	 0
#define						SBAD	-1
#define						VBAD	-2

void info_message (char *message);
void save_commander_screen (void);
void load_commander_screen (void);
void update_screen (void);

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
EMSCRIPTEN_KEEPALIVE
int SetGameParameter( char* _variable, char* _state );
#endif

extern int venableconsole;
extern int venablescreenname;

#endif

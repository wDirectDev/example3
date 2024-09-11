#
# Makefile for Elite - The New Kind.
#

CC	=	gcc
RM	=	@del
WRES	=	@windres
ECHO	=	@echo

LIBS	=	-lSDL2 -lSDL2_mixer -lkernel32 -lgdi32 -lcomdlg32 -luser32 -lole32 -lddraw -ldxguid -lwinmm -ldsound -ldinput
CFLAGS	=	-s -mwindows -O2 -funroll-loops -Wall -DSDL_MAIN_HANDLED -I../external/SDL2/include -I../external/SDL2/include/SDL2
LDFLAGS =	-L../external/SDL2/lib 

SRCS		= datafilebank.c SDL2_gfxPrimitives.c SDL2_rotozoom.c SDL2_framerate.c SDL2_imageFilter.c ssdl.c main.c docked.c elite.c intro.c planet.c shipdata.c shipface.c sound.c space.c swat.c threed.c vector.c random.c trade.c options.c stars.c missions.c pilot.c file.c keyboard.c
OBJS		= $(SRCS:.c=.o)

.c.o: 
	$(CC) $(CFLAGS) -c $<

newkind.exe: $(OBJS)
	$(CC) $(LDFLAGS) $(OBJS) $(LIBS) -o newkind.exe

clean:
	$(ECHO) nk-elite project: clean completed...
	$(RM) $(OBJS) newkind.exe



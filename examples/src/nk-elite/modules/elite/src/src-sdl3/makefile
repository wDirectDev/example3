#
# Makefile for Elite - The New Kind.
#

CC	=	gcc
RM	=	@del
WRES	=	windres

LIBS	=	-lSDL3 -lkernel32 -lgdi32 -lcomdlg32 -luser32 -lole32 -lddraw -ldxguid -lwinmm -ldsound -ldinput
CFLAGS	=	-s -mwindows -O2 -funroll-loops -Wall -I../external/SDL3/include -I../external/SDL3/include/SDL3 
LDFLAGS =	-L../external/SDL3/lib 

SRCS		= datafilebank.c SDL2_gfxPrimitives.c SDL2_rotozoom.c ssdl.c main.c docked.c elite.c intro.c planet.c shipdata.c shipface.c sound.c space.c swat.c threed.c vector.c random.c trade.c options.c stars.c missions.c pilot.c file.c keyboard.c
OBJS		= $(SRCS:.c=.o)

.c.o: 
	$(CC) $(CFLAGS) -c $<

newkind.exe: $(OBJS)
	$(CC) $(LDFLAGS) $(OBJS) $(LIBS) -o newkind.exe

clean:
	$(RM) $(OBJS) newkind.exe



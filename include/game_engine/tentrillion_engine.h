#ifndef FEEDTHENOIK_TENTRILLIONGAMEENGINE_H
#define FEEDTHENOIK_TENTRILLIONGAMEENGINE_H

#include "SDL_events.h"
#include "SDL_render.h"
#include "SDL_surface.h"
#include "SDL_video.h"
#include <SDL3/SDL_render.h>

#define TENTRILLION_VERSION 0.1

typedef struct tentrillion_base {

	int window_width;
	int window_height;
	const char *window_title;

	// SDL
	SDL_Window *sdl_window;
	SDL_Surface *sdl_surface;
	SDL_Event sdl_event;
	SDL_Renderer *sdl_renderer;

} tentrillion_base;

void tentrillion_initialize_window(tentrillion_base *engine);
void tentrillion_window_loop(tentrillion_base *engine);
void tentrillion_quit(tentrillion_base *engine);
void tentrillion_stdout_information(tentrillion_base *engine);

#endif /* FEEDTHENOIK_TENTRILLIONGAMEENGINE_H */

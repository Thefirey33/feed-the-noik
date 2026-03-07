#include "tentrillion_engine.h"
#include "SDL.h"
#include "SDL_events.h"
#include "SDL_image.h"
#include "SDL_render.h"
#include "SDL_surface.h"
#include "SDL_timer.h"
#include "SDL_video.h"
#include <SDL3/SDL_pixels.h>
#include <SDL3/SDL_render.h>
#include <SDL3/SDL_video.h>
#include <stdio.h>
#include <stdlib.h>

void tentrillion_stdout_information(tentrillion_base *base) {
	SDL_RendererInfo info;
	if (SDL_GetRendererInfo(base->sdl_renderer, &info) == 0) {
		printf("== tentrillion game engine ==\nversion %f\n",
			   TENTRILLION_VERSION);
		printf("backend: %s \n", info.name);
		printf("flags: %u \n", info.flags);
		printf("max texture: %dx%d \n", info.max_texture_width,
			   info.max_texture_height);
	}
}

void tentrillion_initialize_window(tentrillion_base *base) {
	if (SDL_Init(SDL_INIT_EVERYTHING) != 0) {
		fprintf(stderr, "failed to initialize SDL context.");
	}
	base->sdl_window = SDL_CreateWindow(
		"Feed The Noik!", SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED,
		base->window_width, base->window_height, SDL_WINDOW_SHOWN);

	if (base->sdl_window == NULL) {
		fprintf(stderr, "Couldn't create SDL context.");
		exit(1);
	}

	base->sdl_surface = SDL_GetWindowSurface(base->sdl_window);
	base->sdl_renderer = SDL_GetRenderer(base->sdl_window);

	tentrillion_stdout_information(base);
}

void tentrillion_window_loop(tentrillion_base *base) {
	int if_quit = 0;

	while (!if_quit) {
		while (SDL_PollEvent(&base->sdl_event)) {
			if (base->sdl_event.type == SDL_QUIT)
				if_quit = 1;
		}

		SDL_FillRect(base->sdl_surface, NULL,
					 SDL_MapRGB(base->sdl_surface->format, 0xff, 0xff, 0xff));

		SDL_UpdateWindowSurface(base->sdl_window);
		SDL_Delay(10);
	}
}

void tentrillion_quit(tentrillion_base *base) {
	SDL_DestroyWindow(base->sdl_window);
	SDL_Quit();
}
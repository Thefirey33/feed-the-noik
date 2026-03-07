#include "tentrillion_engine.hpp"
#include "SDL.h"
#include "SDL_events.h"
#include "SDL_render.h"
#include "SDL_video.h"
#include <cstdio>
#include <cstdlib>

tentrillion_engine *tentrillion_engine::instance;

tentrillion_engine::tentrillion_engine(int window_width, int window_height) {
	this->window_width = window_width;
	this->window_height = window_height;
	tentrillion_engine::instance = this;
}

void tentrillion_engine::initialize_window() {
	if (SDL_Init(SDL_INIT_EVERYTHING) != 0) {
		fprintf(stderr, "failed to create sdl instance...");
		exit(1);
	}

	this->sdl_window = SDL_CreateWindow(
		"Feed The Noik!", SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED, 800,
		600, SDL_WINDOW_SHOWN | SDL_WINDOW_VULKAN);

	this->sdl_surface = SDL_GetWindowSurface(this->sdl_window);
	this->sdl_renderer = SDL_GetRenderer(this->sdl_window);
}

void tentrillion_engine::rendering_loop() {
	bool is_quitting = false;

	while (!is_quitting) {
		while (SDL_PollEvent(&this->sdl_event)) {
			if (this->sdl_event.type == SDL_QUIT) {
				is_quitting = true;
			}
		}

		SDL_UpdateWindowSurface(this->sdl_window);
	}
}

void tentrillion_engine::quit() { SDL_Quit(); }
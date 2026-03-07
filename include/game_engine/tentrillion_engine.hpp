
#ifndef FEEDTHENOIK_TENTRILLION_ENGINE_H
#define FEEDTHENOIK_TENTRILLION_ENGINE_H

#include "SDL_events.h"
#include "SDL_render.h"
#include "SDL_surface.h"
#include "SDL_video.h"
class tentrillion_engine {
  private:
	int window_width;
	int window_height;

	SDL_Renderer *sdl_renderer;
	SDL_Window *sdl_window;
	SDL_Surface *sdl_surface;
	SDL_Event sdl_event;

  public:
	static tentrillion_engine *instance;
	tentrillion_engine(int window_width, int window_height);

	void initialize_window();
	void rendering_loop();
	void quit();
};

#endif /* FEEDTHENOIK_TENTRILLION_ENGINE_H */

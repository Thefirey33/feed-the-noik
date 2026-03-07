#include "SDL_video.h"
#include "tentrillion_engine.h"
#include "tentrillion_texture.h"

#include <SDL.h>

int main(int argc, char **argv) {
	tentrillion_base tentrillion = {800, 600, "Feed the Noik!"};
	tentrillion_base *tentrillion_ptr = &tentrillion;
	tentrillion_texture_information tentrillion_texturing;

	tentrillion_initialize_window(tentrillion_ptr);
	init_tentrillion_textures(tentrillion_ptr, &tentrillion_texturing);
	tentrillion_window_loop(tentrillion_ptr);
	tentrillion_quit(tentrillion_ptr);

	return 0;
}

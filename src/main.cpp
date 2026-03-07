
#include "tentrillion_engine.hpp"
#include <SDL.h>
#include <memory>

int main(int argc, char **argv) {
	std::unique_ptr<tentrillion_engine> tentrillion =
		std::make_unique<tentrillion_engine>(800, 600);

	tentrillion->initialize_window();
	tentrillion->rendering_loop();
	tentrillion->quit();

	return 0;
}

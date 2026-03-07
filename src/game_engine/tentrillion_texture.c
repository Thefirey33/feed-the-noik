#include "tentrillion_texture.h"
#include "tentrillion_engine.h"
#include <SDL_image.h>
#include <SDL_render.h>
#include <SDL_surface.h>
#include <dirent.h>
#include <stdio.h>

void init_tentrillion_textures(
	tentrillion_base *base,
	tentrillion_texture_information *tentrillion_texture_information) {
#ifdef __linux__

	DIR *directory_entries = opendir("assets");

	tentrillion_texture_information->texture =
		malloc(sizeof(SDL_Surface) * 100);

	if (directory_entries != NULL) {
		struct dirent *directory_entry;
		while ((directory_entry = readdir(directory_entries)) != NULL) {
			char *dirAssets = "assets/";

			strcat(dirAssets, directory_entry->d_name);

			tentrillion_texture_information->texture[0] =
				IMG_LoadTexture(base->sdl_renderer, dirAssets);
			break;
		}
		closedir(directory_entries);
	} else {
		fprintf(stderr, "couldn't start tentrillion texturing.");
		exit(1);
	}

#else

#endif
}
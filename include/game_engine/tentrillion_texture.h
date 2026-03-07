#ifndef FEEDTHENOIK_TENTRILLIONTEXTURE_H
#define FEEDTHENOIK_TENTRILLIONTEXTURE_H

#include "tentrillion_engine.h"
#ifdef __linux__
#include <dirent.h>
#endif

typedef struct tentrillion_texture_information {
	SDL_Texture **texture;
} tentrillion_texture_information;

void init_tentrillion_textures(
	tentrillion_base *base,
	tentrillion_texture_information *tentrillion_texture_information);

#endif /* FEEDTHENOIK_TENTRILLIONTEXTURE_H */

#ifndef FEEDTHENOIK_TENTRILLIONTEXTURES_H
#define FEEDTHENOIK_TENTRILLIONTEXTURES_H

#include "SDL_render.h"
#include "tentrillion_engine.hpp"
#include <functional>
#include <map>
#include <string>
class tentrillion_textures {

  private:
	std::map<std::string, SDL_Texture *, std::less<>> textureData;

  public:
	tentrillion_textures() {}

	void load_all_textures();
};

#endif
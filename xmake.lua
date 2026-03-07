add_rules("mode.debug", "mode.release")
add_requires("libsdl2", "sdl2_image")

target("feed-the-noik")
    set_kind("binary")
    set_languages("cxx20")
    add_includedirs("include/", "include/game_engine")
    add_files("src/*.cpp", "src/game_engine/*.cpp")
    add_packages("libsdl2", "sdl2_image")

    after_build(function () 
        os.cp("$(curdir)/assets", "$(builddir)/$(plat)/$(arch)/$(mode)/", { async = true })
    end)

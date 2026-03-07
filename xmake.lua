add_rules("mode.debug", "mode.release")
add_requires("libsdl2")

target("feed-the-noik")
    set_kind("binary")
    set_languages("c23")
    add_includedirs("include/", "include/game_engine")
    add_files("src/*.c", "src/game_engine/*.c")
    add_packages("libsdl2")

    after_build(function () 
        os.cp("$(curdir)/assets", "$(builddir)/$(plat)/$(arch)/$(mode)/", { async = true })
    end)
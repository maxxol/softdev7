# softdev7
software development groep 7 

simulator graphics lib: 
- clone https://github.com/raysan5/raylib
- run \raylib\projects\VS2022\raylib.sln in visual studio (error by runnen maakt niet uit)
- open stoplichtSimulator.sln
- Project->properties(onderaan):
    - config properties -> General -> c++ language standard: "default(ISO C++ 14 Standard)"
    - linker -> General -> Additional Library Directories: [volledig pad]"\raylib\projects\VS2022\build\raylib\bin\x64\Debug\raylib.lib"
    - linker -> input -> Additional dependencies -> edit:  [volledig pad]"\raylib\projects\VS2022\build\raylib\bin\x64\Debug\raylib.lib
                                                            $(CoreLibraryDependencies)
                                                            opengl32.lib
                                                            gdi32.lib
                                                            winmm.lib
                                                            kernel32.lib"

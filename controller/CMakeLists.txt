# set(CMAKE_TOOLCHAIN_FILE "C:/Users/wd_vi/Documents/2.3 - minor ASE/stoplichtenSimulator/vcpkg/scripts/buildsystems/vcpkg.cmake" CACHE STRING "")
# include(../../vcpkg/scripts/buildsystems/vcpkg.cmake)
cmake_minimum_required(VERSION 3.10)
project(VehicleTrafficController)
enable_language(C)
enable_testing()

set(SOURCE_DIR "${CMAKE_CURRENT_SOURCE_DIR}")
set(CMAKE_C_STANDARD 11)

add_subdirectory("src")



add_executable(VehicleTrafficController ./controller.c ./traffic_logic.c)

target_link_libraries(VehicleTrafficController PRIVATE czmq)


set(CMAKE_PREFIX_PATH "C:/Users/wd_vi/Documents/2.3 - minor ASE/stoplichtenSimulator/vcpkg_installed/x64-windows")

find_package(czmq CONFIG REQUIRED)

target_link_libraries(VehicleTrafficController PUBLIC czmq)

target_include_directories(VehicleTrafficController PUBLIC
                           "${PROJECT_BINARY_DIR}"
                          )
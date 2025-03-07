// stoplichtSimulator.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include <iostream>
#include <raylib.h>
#include <list>
#include<string>


class RoadUser {

};
class Pedestrian : public RoadUser {
    int posX;
    int posY;
    int pedSpeed;
    Pedestrian(int X, int Y) { //constructor
        posX = X;
        posY = Y;
        pedSpeed = 1;
    }
};

class Cyclist : public RoadUser {
    int posX;
    int posY;
    int cycSpeed;
    Cyclist(int X, int Y) { //constructor
        posX = X;
        posY = Y;
        cycSpeed = 2;
    }
};

class Car : public RoadUser {
public:
    int posX;
    int posY;
    int carSpeed;
    Car(int X, int Y) { //constructor
        posX = X;
        posY = Y;
        carSpeed = 4;
    }
    void drive(char dir) {
        switch (dir) {
        case 'n':
            posY -= carSpeed;
            break;
        case 'e':
            posX += carSpeed;
            break;
        case 's':
            posY += carSpeed;
            break;
        case 'w':
            posX -= carSpeed;
            break;
        case 'x': //stop moving
            break;
        default:
            std::cout << "Invalid\n";
            break;
        }
    }
};

class Simulator {
public:

};

class Lane {
public:
    std::string laneID;
    std::list<RoadUser*> laneUsers;
};

class Light {
public:
    std::string color;
    std::string lane;
};

Car car(0, 0);

int main() {

    char direction = 'n';  //default
    const int screenWidth = 1920;
    const int screenHeight = 1080;
    Car car(screenWidth / 2, screenHeight / 2);
    InitWindow(screenWidth, screenHeight, "raylib [core] example - basic window");
    Texture2D image = LoadTexture("../Images/Kruispunt.png");
    Image kruispunt = LoadImage("Images/Kruispunt.png");
    
   // Texture2D background = LoadTexture("kruispunt.png");
    SetTargetFPS(30);               // hz
    while (!WindowShouldClose()) {
        // Raylib input handling (no need for _kbhit() or _getch())
        if (IsKeyDown(KEY_W)) direction = 'n';
        if (IsKeyDown(KEY_A)) direction = 'w';
        if (IsKeyDown(KEY_S)) direction = 's';
        if (IsKeyDown(KEY_D)) direction = 'e';
        if (IsKeyDown(KEY_X)) direction = 'x';

        car.drive(direction);  //move car
        std::cout << "X,Y: " << car.posX << " " << car.posY << std::endl;


        BeginTextureMode(image);
        //--------------------------------------------------------------------------------------

        // Main game loop

            // Update
            //----------------------------------------------------------------------------------
            // TODO: Update your variables here
            //----------------------------------------------------------------------------------

            // Draw
            //----------------------------------------------------------------------------------
        BeginDrawing();

        ClearBackground(RAYWHITE);
        DrawTexture(image, 0, 0, WHITE);
        Vector2 ballPosition = { car.posX,car.posY };
        DrawCircleV(ballPosition, 30, MAROON);


        EndDrawing();
        //----------------------------------------------------------------------------------
    }

    // De-Initialization
    //--------------------------------------------------------------------------------------
    CloseWindow();        // Close window and OpenGL context
    //--------------------------------------------------------------------------------------
    //test comment
    return 0;
}
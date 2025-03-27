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
    SetWindowState(FLAG_WINDOW_RESIZABLE);    
    RenderTexture2D tex = LoadRenderTexture(screenWidth, screenHeight);
    Image  imag = LoadImage("../Images/Kruispunt.png");
    // ImageFlipHorizontal(&imag);
    ImageResize(&imag, screenWidth, screenHeight);
    Texture2D  kruispunt = LoadTextureFromImage(imag);
    UnloadImage(imag);
   
   // Texture2D background = LoadTexture("kruispunt.png");
    SetTargetFPS(30);               // hz
    while (!WindowShouldClose()) {
        //  Raylib input handling (no need for _kbhit() or _getch())
        if (IsKeyDown(KEY_W)) direction = 'n';
        if (IsKeyDown(KEY_A)) direction = 'w';
        if (IsKeyDown(KEY_S)) direction = 's';
        if (IsKeyDown(KEY_D)) direction = 'e';
        if (IsKeyDown(KEY_X)) direction = 'x';

        car.drive(direction);  //move car
        std::cout << "X,Y: " << car.posX << " " << car.posY << std::endl;


        BeginTextureMode(tex);
        ClearBackground(RAYWHITE);
       // DrawRectangle(screenWidth / 2 - 128, screenHeight / 2 - 128, 256, 256, BLACK);
        //DrawRectangle(screenWidth / 2 - 112, screenHeight / 2 - 112, 224, 224, RAYWHITE);
        //DrawText("raylib", screenWidth / 2 - 44, screenHeight / 2 + 48, 50, BLACK);
        //DrawTexture(imag, 0, 0, WHITE);
        DrawTexture(kruispunt, screenWidth / 2 - kruispunt.width / 2, screenHeight / 2 - kruispunt.height / 2 - 40, WHITE);
        DrawRectangleLines(screenWidth / 2 - kruispunt.width / 2, screenHeight / 2 - kruispunt.height / 2 - 40, kruispunt.width, kruispunt.height, DARKGRAY);
       
        Vector2 ballPosition = { car.posX,car.posY };
        DrawCircleV(ballPosition, 30, MAROON);
       
        // We need to end the texture mode separately
        EndTextureMode();
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
        //DrawTexture(kruispunt, screenWidth/2 - kruispunt.width/2, screenHeight/2 - kruispunt.height/2 - 40, WHITE);
        //DrawRectangleLines(screenWidth / 2 - kruispunt.width / 2, screenHeight / 2 - kruispunt.height / 2 - 40, kruispunt.width, kruispunt.height, DARKGRAY);
        DrawTexturePro(
            tex.texture,
            Rectangle{ 0, 0, static_cast<float>(tex.texture.width), static_cast<float>(-tex.texture.height) },
            Rectangle{ 0, 0, static_cast<float>(GetScreenWidth()), static_cast<float>(GetScreenHeight()) },
            Vector2{ 0, 0 },
            0,
            WHITE);
        EndDrawing();

        //----------------------------------------------------------------------------------
    }
    // Unload the texture handle again to make a clean exit.
    UnloadRenderTexture(tex);
    UnloadTexture(kruispunt);

    // De-Initialization
    //--------------------------------------------------------------------------------------
    CloseWindow();        // Close window and OpenGL context
    //--------------------------------------------------------------------------------------
    //test comment
    return 0;
}
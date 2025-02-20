// stoplichtSimulator.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include <iostream>
#include <conio.h>  //keypress detector
#include <raylib.h>

class Car {
public:
    int posX;
    int posY;
    Car(int X, int Y) { //constructor
        posX = X;
        posY = Y;
    }
    void drive(char dir) {
        switch (dir) {
        case 'n':
            posY++;
            break;
        case 'e':
            posX++;
            break;
        case 's':
            posY--;
            break;
        case 'w':
            posX--;
            break;
        case 'x': //stop moving
            break;
        default:
            std::cout << "Invalid\n";
            break;
        }
    }
};

class Light {
public:
    std::string color;
    std::string lane;
};

Car car(0, 0);

int main() {
    Car car(0, 0);
    char direction = 'n';  //default
    const int screenWidth = 800;
    const int screenHeight = 450;

    InitWindow(screenWidth, screenHeight, "raylib [core] example - basic window");

    SetTargetFPS(60);               // Set our game to run at 60 frames-per-second
    while (!WindowShouldClose())    // Detect window close button or ESC key
    {
        if (_kbhit()) {  //kbhit = keyboardhit
            char key = _getch();  //which key
            if (key == 'w') direction = 'n';  
            if (key == 'a') direction = 'w';  
            if (key == 's') direction = 's';  
            if (key == 'd') direction = 'e';  
            if (key == 'x') direction = 'x';
        }

        car.drive(direction);  //move car
        std::cout << "X,Y: " << car.posX << " " << car.posY << std::endl;
        
    
    
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

        DrawText("Congrats! You created your first window!", 190, 200, 20, LIGHTGRAY);

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

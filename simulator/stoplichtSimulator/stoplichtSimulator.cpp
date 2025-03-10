// stoplichtSimulator.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include <iostream>
#include <raylib.h>
#include <vector>
#include<string>

struct CheckPointNode {
    int x, y; bool occupied;
    CheckPointNode(int x_, int y_, bool occupied_)
        : x(x_), y(y_), occupied(occupied_) {}
};

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

class Lane {
public:
    std::string laneID;
    std::vector<RoadUser*> laneUsers;

    std::vector<CheckPointNode> checkPointNodes;
    
    Lane(std::string laneID_, std::vector<CheckPointNode> checkPointNodes_) {
        laneID = laneID_;
        checkPointNodes = checkPointNodes_;
    }
};

class TrafficLight {
public:
    char color;
    std::string trafficLightID;
};



CheckPointNode node1 = CheckPointNode(1920-300, 1080/2, false);
CheckPointNode node2 = CheckPointNode(300, 1080/2, false);

std::vector<CheckPointNode> testLaneCheckpoints = {node1,node2};
Lane testLane("test lane", testLaneCheckpoints);
Car car(0, 0);


int main() {

    char direction = 'n';  //default
    const int screenWidth = 1920;
    const int screenHeight = 1080;
    Car car(screenWidth / 2, screenHeight / 2);
    InitWindow(screenWidth, screenHeight, "raylib [core] example - basic window");

    SetTargetFPS(60);               // hz
    while (!WindowShouldClose()) {
        // Raylib input handling (no need for _kbhit() or _getch())
        if (IsKeyDown(KEY_W)) direction = 'n';
        if (IsKeyDown(KEY_A)) direction = 'w';
        if (IsKeyDown(KEY_S)) direction = 's';
        if (IsKeyDown(KEY_D)) direction = 'e';
        if (IsKeyDown(KEY_X)) direction = 'x';

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
        Vector2 ballPosition = { car.posX,car.posY };
        Vector2 ballPosition2 = { testLane.checkPointNodes[0].x,testLane.checkPointNodes[0].y};
        Vector2 ballPosition3 = { testLane.checkPointNodes[1].x,testLane.checkPointNodes[1].y };

        DrawCircleV(ballPosition, 30, MAROON);
        DrawCircleV(ballPosition2, 30, MAROON);
        DrawCircleV(ballPosition3, 30, MAROON);

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
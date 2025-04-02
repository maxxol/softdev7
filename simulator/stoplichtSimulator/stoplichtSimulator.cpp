// stoplichtSimulator.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include <iostream>
#include <raylib.h>
#include <vector>
#include <string>
#include <thread>
struct CheckPointNode { //lanes are composed of these nodes. you can view the lane as lines connecting these dots(nodes).
    int x, y; bool occupied; 
    CheckPointNode(int x_, int y_, bool occupied_)
        : x(x_), y(y_), occupied(occupied_) {}
};

class RoadUser { //parent class for all road using entities, allows for bike lanes, car lanes and sidewalks to use the same function. see implementation of addRoadUserToLane in the lanes class.
public:
    int moveToNextCheckNode(int& posX, int& posY, int roadUserSpeed, std::vector<CheckPointNode> checkPointNodes, int& iterator) { //automatically drives to next node in lane
        int xDiff = checkPointNodes[iterator+1].x - posX;
        int yDiff = checkPointNodes[iterator+1].y - posY;

        // Compute the distance
        double distance = sqrt(xDiff * xDiff + yDiff * yDiff);

        // Prevent division by zero & check if already at the target
        if (distance < 1) {
            posX = checkPointNodes[iterator+1].x;
            posY = checkPointNodes[iterator+1].y;
            return iterator+1;
        }

        // Normalize and scale by speed
        double moveX = (xDiff / distance) * roadUserSpeed;
        double moveY = (yDiff / distance) * roadUserSpeed;

        // Apply movement
        posX += round(moveX);
        posY += round(moveY);

        // Ensure we don't overshoot the target
        if (abs(checkPointNodes[iterator+1].x - posX) < roadUserSpeed && abs(checkPointNodes[iterator+1].y - posY) < roadUserSpeed) {
            posX = checkPointNodes[iterator+1].x;
            posY = checkPointNodes[iterator+1].y;
            return iterator + 1;
            }
        else{ return iterator; }
        
        
    }
    //    int xDiff;
    //    int yDiff;
    //    try {
    //        xDiff = checkPointNodes[iterator+1].x - posX;
    //        yDiff = checkPointNodes[iterator+1].y - posY;
    //    }
    //    catch (const std::out_of_range& e) {
    //        return -1;
    //    }

    //        //std::cout << checkPointNodes[iterator + 1].x << " " << checkPointNodes[iterator + 1].y << std::endl;
    //        //std::cout << "diffs: " << xDiff << yDiff << std::endl;

    //        int totalDiff = abs(xDiff) + abs(yDiff);


    //        double directionDiffRatio = 0;
    //        directionDiffRatio = (totalDiff == 0) ? 0.5 : double(abs(xDiff)) / double(totalDiff);

    //        posX += (xDiff > 0) ? int(directionDiffRatio * roadUserSpeed)
    //            : (xDiff < 0) ? -int(directionDiffRatio * roadUserSpeed)
    //            : 0;

    //        posY += (yDiff > 0) ? int((1.0 - directionDiffRatio) * roadUserSpeed)
    //            : (yDiff < 0) ? -int((1.0 - directionDiffRatio) * roadUserSpeed)
    //            : 0;


    //        if (abs(xDiff) < roadUserSpeed && abs(yDiff) < roadUserSpeed) { //less than 1 frame away from arriving (this helps in edge cases where a fast vehicle could skip over the node and forever vibrates around it)
    //            std::cout << "ARRIVED: " << iterator + 1 << std::endl;
    //            return iterator+1;
    //    }
    //        return iterator;
    //}
};
class Pedestrian : public RoadUser { // walky boi
    int posX;
    int posY;
    int pedSpeed;
    Pedestrian(int X, int Y) { //constructor
        posX = X;
        posY = Y;
        pedSpeed = 1;
    }
};

class Cyclist : public RoadUser { //bikey boi
    int posX;
    int posY;
    int cycSpeed;
    Cyclist(int X, int Y) { //constructor
        posX = X;
        posY = Y;
        cycSpeed = 2;
    }
};

class Car : public RoadUser { //drivey boi
public:
    int posX;
    int posY;
    int carSpeed;
    Car(int X, int Y) { //constructor
        posX = X;
        posY = Y;
        carSpeed = 2;
    }
    void driveManual(char dir) {//controlled using wasdx
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

class Lane { //a lane of the road that contains road users. a lane is composed of nodes.
public:
    std::string laneID; //the id for this lane
    std::vector<RoadUser*> laneUsers; //everyone currently using this lane
    std::vector<CheckPointNode> checkPointNodes; //the nodes that make up the path of the lane
    
    Lane(std::string laneID_, std::vector<CheckPointNode> checkPointNodes_) { //constructor
        laneID = laneID_;
        checkPointNodes = checkPointNodes_;
    }

    void addRoadUserToLane(RoadUser* roadUser) { //adds a new road user in the laneUsers vector
        laneUsers.push_back(roadUser);
    }
};

class TrafficLight {// traffic light unfinished
public:
    char color;
    std::string trafficLightID;
};


//---------------------------------testing setup-------------------------- 
CheckPointNode node1 = CheckPointNode(1920-400, 1080-650, false);
CheckPointNode node2 = CheckPointNode(1920 - 990, 1080 - 660, false);
CheckPointNode node3 = CheckPointNode(1920 - 1200, 1080 - 650, false);
CheckPointNode node4 = CheckPointNode(1920 - 1300, 1080 - 200, false);


std::vector<CheckPointNode> testLaneCheckpoints = {node1,node2,node3,node4};
Lane testLane("test lane", testLaneCheckpoints);
//------------------------------------------------------------------


int main() {

    char direction = 'n';  //default
    const int screenWidth = 1920;
    const int screenHeight = 1080;
    Car car1(testLane.checkPointNodes[0].x, testLane.checkPointNodes[0].y);
    Car car2(testLane.checkPointNodes[1].x, testLane.checkPointNodes[1].y);

    InitWindow(screenWidth, screenHeight, "raylib [core] example - basic window");

    SetWindowState(FLAG_WINDOW_RESIZABLE);    
    RenderTexture2D tex = LoadRenderTexture(screenWidth, screenHeight);

    Image  imag = LoadImage("../Images/Kruispunt.png");
    // ImageFlipHorizontal(&imag);
    ImageResize(&imag, screenWidth, screenHeight);
    Texture2D  kruispunt = LoadTextureFromImage(imag);
    UnloadImage(imag);

    int testcariterator1 = 0;
    int testcariterator2 = 1;

   
   // Texture2D background = LoadTexture("kruispunt.png");
    SetTargetFPS(120);               // hz

    while (!WindowShouldClose()) {
        //  Raylib input handling (no need for _kbhit() or _getch())
        if (IsKeyDown(KEY_W)) direction = 'n';
        if (IsKeyDown(KEY_A)) direction = 'w';
        if (IsKeyDown(KEY_S)) direction = 's';
        if (IsKeyDown(KEY_D)) direction = 'e';
        if (IsKeyDown(KEY_X)) direction = 'x';


        if(testcariterator1 < testLane.checkPointNodes.size()-1){
            testcariterator1 = car1.moveToNextCheckNode(car1.posX, car1.posY, car1.carSpeed, testLane.checkPointNodes, testcariterator1);
        }
        if (testcariterator2 < testLane.checkPointNodes.size() - 1) {
            testcariterator2 = car2.moveToNextCheckNode(car2.posX, car2.posY, car2.carSpeed, testLane.checkPointNodes, testcariterator2);
        }
        //car.driveManual(direction);  //move car
        //std::cout << "X,Y: " << car.posX << " " << car.posY << std::endl;


        BeginTextureMode(tex);
        ClearBackground(RAYWHITE);
       // DrawRectangle(screenWidth / 2 - 128, screenHeight / 2 - 128, 256, 256, BLACK);
        //DrawRectangle(screenWidth / 2 - 112, screenHeight / 2 - 112, 224, 224, RAYWHITE);
        //DrawText("raylib", screenWidth / 2 - 44, screenHeight / 2 + 48, 50, BLACK);

        //DrawTexture(imag, 0, 0, WHITE);
        DrawTexture(kruispunt, screenWidth / 2 - kruispunt.width / 2, screenHeight / 2 - kruispunt.height / 2 - 40, WHITE);
        DrawRectangleLines(screenWidth / 2 - kruispunt.width / 2, screenHeight / 2 - kruispunt.height / 2 - 40, kruispunt.width, kruispunt.height, DARKGRAY);
       
        Vector2 ballPosition = { car1.posX,car1.posY };
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

        Vector2 ballPosition1= { car1.posX,car1.posY };  //create circle data
        Vector2 ballPosition2 = { car2.posX,car2.posY };  //create circle data

        Vector2 testnode1 = { testLane.checkPointNodes[0].x,testLane.checkPointNodes[0].y};
        Vector2 testnode2 = { testLane.checkPointNodes[1].x,testLane.checkPointNodes[1].y };
        Vector2 testnode3 = { testLane.checkPointNodes[2].x,testLane.checkPointNodes[2].y };
        Vector2 testnode4 = { testLane.checkPointNodes[3].x,testLane.checkPointNodes[3].y };


        DrawCircleV(ballPosition1, 30, MAROON); //draw the circles
        DrawCircleV(ballPosition2, 30, MAROON); //draw the circles

        DrawCircleV(testnode1, 10, GREEN);
        DrawCircleV(testnode2, 10, GREEN);
        DrawCircleV(testnode3, 10, GREEN);
        DrawCircleV(testnode4, 10, GREEN);



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
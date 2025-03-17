// stoplichtSimulator.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include <iostream>
#include <raylib.h>
#include <vector>
#include<string>

struct CheckPointNode { //lanes are composed of these nodes. you can view the lane as lines connecting these dots(nodes).
    int x, y; bool occupied; 
    CheckPointNode(int x_, int y_, bool occupied_)
        : x(x_), y(y_), occupied(occupied_) {}
};

class RoadUser { //parent class for all road using entities, allows for bike lanes, car lanes and sidewalks to use the same function. see implementation of addRoadUserToLane in the lanes class.
public:
     void moveToNextCheckNode(CheckPointNode node1, CheckPointNode node2,int& posX,int& posY, int roadUserSpeed) { //automatically drives to next node in lane
        int xDiff = node2.x - posX;
        int yDiff = node2.y - posY;
        //std::cout << "diffs: " << xDiff << yDiff << std::endl;

        int totalDiff = xDiff + yDiff;

        double directionDiffRatio = 0;
        try {
            directionDiffRatio = double(xDiff) / double(totalDiff); //decides the angle of movement for diagonal paths
        }
        catch(int err){ 
            double directionDiffRatio = 0;
            std::cout << "error: " << err << std::endl;
        }


        //doing the actual movement
        posX += (xDiff > 0) ? int(directionDiffRatio * roadUserSpeed) //go right
            : (xDiff < 0) ? -int(directionDiffRatio * roadUserSpeed) //go left
            : 0;

        posY += (yDiff > 0) ? int((1 - directionDiffRatio) * roadUserSpeed)//go down(+y means down in screen dimensions)
            : (yDiff < 0) ? -int((1 - directionDiffRatio) * roadUserSpeed)//go up
            : 0;
  
        if (abs(xDiff) < roadUserSpeed && abs(yDiff) < roadUserSpeed) { //less than 1 frame away from arriving (this helps in edge cases where a fast vehicle could skip over the node and forever vibrates around it)
            std::cout << "ARRIVED\n";
        }
        char dir;
        


    }
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
        carSpeed = 4;
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
CheckPointNode node2 = CheckPointNode(1920-300, 1080-300, false);
CheckPointNode node1 = CheckPointNode(200, 1080-900, false);

std::vector<CheckPointNode> testLaneCheckpoints = {node1,node2};
Lane testLane("test lane", testLaneCheckpoints);
//------------------------------------------------------------------


int main() {

    char direction = 'n';  //default
    const int screenWidth = 1920;
    const int screenHeight = 1080;
    Car car(testLane.checkPointNodes[0].x, testLane.checkPointNodes[0].y);
    InitWindow(screenWidth, screenHeight, "raylib [core] example - basic window");

    SetTargetFPS(60);               // hz
    while (!WindowShouldClose()) {
        // Raylib input handling (no need for _kbhit() or _getch())
        if (IsKeyDown(KEY_W)) direction = 'n';
        if (IsKeyDown(KEY_A)) direction = 'w';
        if (IsKeyDown(KEY_S)) direction = 's';
        if (IsKeyDown(KEY_D)) direction = 'e';
        if (IsKeyDown(KEY_X)) direction = 'x';

        car.moveToNextCheckNode(testLane.checkPointNodes[0], testLane.checkPointNodes[1],car.posX, car.posY, car.carSpeed);
        //car.driveManual(direction);  //move car
        //std::cout << "X,Y: " << car.posX << " " << car.posY << std::endl;



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
        Vector2 ballPosition = { car.posX,car.posY };  //create circle data
        Vector2 testnode1 = { testLane.checkPointNodes[0].x,testLane.checkPointNodes[0].y};
        Vector2 testnode2 = { testLane.checkPointNodes[1].x,testLane.checkPointNodes[1].y };

        DrawCircleV(ballPosition, 30, MAROON); //draw the circles
        DrawCircleV(testnode1, 10, GREEN);
        DrawCircleV(testnode2, 10, GREEN);

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
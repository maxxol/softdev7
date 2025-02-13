// stoplichtSimulator.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include <iostream>
#include <conio.h>  // Windows-only for non-blocking input

class Car {
public:
    int posX;
    int posY;
    Car(int X, int Y) { // Constructor with parameters
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
    char direction = 'n';  // Default direction

    while (true) {
        if (_kbhit()) {  // Check if a key was pressed
            char key = _getch();  // Read the key
            if (key == 'w') direction = 'n';  
            if (key == 'a') direction = 'w';  
            if (key == 's') direction = 's';  
            if (key == 'd') direction = 'e';  
        }

        car.drive(direction);  // Move in the current direction
        std::cout << "X,Y: " << car.posX << " " << car.posY << std::endl;
        
    }

    return 0;
}

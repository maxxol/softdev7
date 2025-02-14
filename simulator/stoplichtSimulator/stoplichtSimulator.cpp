// stoplichtSimulator.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include <iostream>
#include <conio.h>  //keypress detector

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

    while (true) {
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
        
    }

    return 0;
}

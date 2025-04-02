using System;
using System.Collections.Generic;
using Raylib_cs;
using System.Numerics;
using System.Drawing;

struct CheckPointNode // Lanes are composed of these nodes
{
    public int X, Y;
    public bool Occupied;
    public CheckPointNode(int x, int y, bool occupied)
    {
        X = x;
        Y = y;
        Occupied = occupied;
    }
}

class RoadUser
{
    public int MoveToNextCheckNode(ref int posX, ref int posY, int roadUserSpeed, List<CheckPointNode> checkPointNodes, ref int iterator)
    {
        int xDiff = checkPointNodes[iterator + 1].X - posX;
        int yDiff = checkPointNodes[iterator + 1].Y - posY;

        double distance = Math.Sqrt(xDiff * xDiff + yDiff * yDiff);
        if (distance < 1)
        {
            posX = checkPointNodes[iterator + 1].X;
            posY = checkPointNodes[iterator + 1].Y;
            return ++iterator;
        }

        double moveX = (xDiff / distance) * roadUserSpeed;
        double moveY = (yDiff / distance) * roadUserSpeed;

        posX += (int)Math.Round(moveX);
        posY += (int)Math.Round(moveY);

        if (Math.Abs(checkPointNodes[iterator + 1].X - posX) < roadUserSpeed && Math.Abs(checkPointNodes[iterator + 1].Y - posY) < roadUserSpeed)
        {
            posX = checkPointNodes[iterator + 1].X;
            posY = checkPointNodes[iterator + 1].Y;
            return ++iterator;
        }
        return iterator;
    }
}

class Car : RoadUser
{
    public int PosX, PosY, CarSpeed;
    public Car(int x, int y)
    {
        PosX = x;
        PosY = y;
        CarSpeed = 2;
    }
    public void DriveManual(char dir)
    {
        switch (dir)
        {
            case 'n': PosY -= CarSpeed; break;
            case 'e': PosX += CarSpeed; break;
            case 's': PosY += CarSpeed; break;
            case 'w': PosX -= CarSpeed; break;
            case 'x': break;
            default: Console.WriteLine("Invalid"); break;
        }
    }
}

class Lane
{
    public string LaneID;
    public List<RoadUser> LaneUsers = new();
    public List<CheckPointNode> CheckPointNodes;
    public Lane(string laneID, List<CheckPointNode> checkPointNodes)
    {
        LaneID = laneID;
        CheckPointNodes = checkPointNodes;
    }
    public void AddRoadUserToLane(RoadUser roadUser)
    {
        LaneUsers.Add(roadUser);
    }
}

class Program
{
    static void Main()
    {
        int screenWidth = 1920, screenHeight = 1080;
        Raylib.InitWindow(screenWidth, screenHeight, "Raylib C# Example");
        Raylib.SetWindowState(ConfigFlags.ResizableWindow);

        Texture2D kruispunt = Raylib.LoadTexture("../../../../../Images/Kruispunt.png");

        List<CheckPointNode> testLaneCheckpoints = new()
        {
            new CheckPointNode(1920 - 400, 1080 - 650, false),
            new CheckPointNode(1920 - 990, 1080 - 660, false),
            new CheckPointNode(1920 - 1200, 1080 - 650, false),
            new CheckPointNode(1920 - 1300, 1080 - 200, false)
        };

        Lane testLane = new("test lane", testLaneCheckpoints);

        Car car1 = new(testLane.CheckPointNodes[0].X, testLane.CheckPointNodes[0].Y);
        Car car2 = new(testLane.CheckPointNodes[1].X, testLane.CheckPointNodes[1].Y);

        int testCarIterator1 = 0, testCarIterator2 = 1;

        Raylib.SetTargetFPS(120);

        while (!Raylib.WindowShouldClose())
        {
            if (testCarIterator1 < testLane.CheckPointNodes.Count - 1)
                testCarIterator1 = car1.MoveToNextCheckNode(ref car1.PosX, ref car1.PosY, car1.CarSpeed, testLane.CheckPointNodes, ref testCarIterator1);

            if (testCarIterator2 < testLane.CheckPointNodes.Count - 1)
                testCarIterator2 = car2.MoveToNextCheckNode(ref car2.PosX, ref car2.PosY, car2.CarSpeed, testLane.CheckPointNodes, ref testCarIterator2);

            Raylib.BeginDrawing();
            Raylib.ClearBackground(Raylib_cs.Color.White);
            Raylib.DrawTexture(kruispunt, screenWidth / 2 - kruispunt.Width / 2, screenHeight / 2 - kruispunt.Height / 2 - 40, Raylib_cs.Color.White);

            Raylib.DrawCircleV(new Vector2(car1.PosX, car1.PosY), 30, Raylib_cs.Color.Maroon);
            Raylib.DrawCircleV(new Vector2(car2.PosX, car2.PosY), 30, Raylib_cs.Color.Maroon);

            foreach (var node in testLane.CheckPointNodes)
            {
                Raylib.DrawCircleV(new Vector2(node.X, node.Y), 10, Raylib_cs.Color.Green);
            }

            Raylib.EndDrawing();
        }

        Raylib.UnloadTexture(kruispunt);
        Raylib.CloseWindow();
    }
}

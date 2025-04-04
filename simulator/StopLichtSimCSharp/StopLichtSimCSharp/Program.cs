using System;
using System.Collections.Generic;
using Raylib_cs;
using System.Numerics;
using System.IO;
using System.Drawing.Drawing2D;
//using System.Drawing;


namespace StopLichtSimCSharp
{
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

    class Program
    {
        static void Main()
        {
            int screenWidth = 1920, screenHeight = 1080;
            Raylib.SetConfigFlags(ConfigFlags.ResizableWindow| ConfigFlags.VSyncHint);
            Raylib.InitWindow(800, 800, "Raylib C# Example");
            //Raylib.SetWindowState(ConfigFlags.ResizableWindow);
            //
            Raylib.SetWindowState(ConfigFlags.MaximizedWindow);
            Raylib.SetWindowMinSize(screenWidth, screenHeight/2);
           // Raylib.image imblank = GenImageColor(1024, 1024, Color.blank);
            //Texture2D kruispunt = Raylib.LoadTexture("../../../../../Images/cross_section.png");
            Image crossroads = Raylib.LoadImage("../../../../../Images/cross_section.png");
            Raylib.ImageResize(ref crossroads, screenWidth, (int)(screenHeight/1.852));
            Texture2D crossingroads = Raylib.LoadTextureFromImage(crossroads);
            Raylib.UnloadImage(crossroads);

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

            CheckPointNode[] autoCreatedCheckpointArray = TXTFileNodeLoader.LoadNodesFromTXT();




            Raylib.SetTargetFPS(60);
            while (!Raylib.WindowShouldClose())
            {
                MouseClickNodeCreator.AddCoordinateToNodeFileByClicking(false);//should only be true when you want to modify NodeData.txt


                if (testCarIterator1 < testLane.CheckPointNodes.Count - 1)
                    testCarIterator1 = car1.MoveToNextCheckNode(ref car1.PosX, ref car1.PosY, car1.CarSpeed, testLane.CheckPointNodes, ref testCarIterator1);

                if (testCarIterator2 < testLane.CheckPointNodes.Count - 1)
                    testCarIterator2 = car2.MoveToNextCheckNode(ref car2.PosX, ref car2.PosY, car2.CarSpeed, testLane.CheckPointNodes, ref testCarIterator2);

                Raylib.BeginDrawing();
                    Raylib.ClearBackground(Raylib_cs.Color.Black);
                    Raylib.DrawTexture(crossingroads, screenWidth / 2 - crossingroads.Width / 2, screenHeight / 2 - crossingroads.Height / 2 - 40, Raylib_cs.Color.White);

                    Raylib.DrawCircleV(new Vector2(car1.PosX, car1.PosY), 30, Raylib_cs.Color.Maroon);
                    Raylib.DrawCircleV(new Vector2(car2.PosX, car2.PosY), 30, Raylib_cs.Color.Maroon);


                autoCreatedCheckpointArray = TXTFileNodeLoader.LoadNodesFromTXT(); //updates live for debugging
                foreach (var node in testLane.CheckPointNodes)
                    {
                        Raylib.DrawCircleV(new Vector2(node.X, node.Y), 10, Raylib_cs.Color.Green);
                    }
                    foreach (var node in autoCreatedCheckpointArray)
                    {
                        Raylib.DrawCircleV(new Vector2(node.X, node.Y), 10, Raylib_cs.Color.Green);
                    }
                Raylib.EndDrawing();
            }

            Raylib.UnloadTexture(crossingroads);
            Raylib.CloseWindow();
        }
    }
}

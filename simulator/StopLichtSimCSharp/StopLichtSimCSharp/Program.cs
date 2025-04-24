
﻿using System;
using System.Collections.Generic;
using Raylib_cs;
using System.Numerics;
using System.IO;
using System.Drawing.Drawing2D;
using System.Runtime.InteropServices;
using System.Security.Cryptography.X509Certificates;


namespace StopLichtSimCSharp
{
    struct CheckPointNode // Lanes are composed of these nodes
    {
        public string NodeID;
        public int X, Y;
        public bool Occupied;
        public Color TrafficLightColor;
        public CheckPointNode(int x, int y, bool occupied,string nodeid)
        {
            NodeID = nodeid;
            X = x;
            Y = y;
            Occupied = occupied;
            TrafficLightColor = Color.Green;
        }
    }

    class Program
    {
       
        static void Main()
        {
           
            bool nodeDevMode = true;
            int screenWidth = 1920, screenHeight = 1080;
            Raylib.SetConfigFlags(ConfigFlags.ResizableWindow| ConfigFlags.VSyncHint);
            Raylib.InitWindow(800, 800, "Raylib C# Example");
            Raylib.SetWindowState(ConfigFlags.MaximizedWindow);
            Raylib.SetWindowMinSize(screenWidth, screenHeight/2);
           // Raylib.image imblank = GenImageColor(1024, 1024, Color.blank);
            //Texture2D kruispunt = Raylib.LoadTexture("../../../../../Images/cross_section.png");
            Image crossroads = Raylib.LoadImage("../../../../../Images/cross_section.png");
            Raylib.ImageResize(ref crossroads, screenWidth, (int)(screenHeight/1.852));
            Texture2D crossingroads = Raylib.LoadTextureFromImage(crossroads);
            Raylib.UnloadImage(crossroads);

            Rectangle center = new(400, 280, 40, 40);
            Camera2D camera = new();
            camera.Offset = new Vector2(0,0);
            camera.Rotation = 0.0f;
            camera.Zoom = 1.0f;

            Spawner spawner = new Spawner();


            //CheckPointNode[] testLaneCheckpoints = 
            //{
            //    new CheckPointNode(1920 - 400, 1080 - 650, false,"test1"),
            //    new CheckPointNode(1920 - 990, 1080 - 660, false,"test2"),
            //    new CheckPointNode(1920 - 1200, 1080 - 650, false,"test3"),
            //    new CheckPointNode(1920 - 1300, 1080 - 200, false,"test4")
            //};

            //Lane testLane = new("test lane", testLaneCheckpoints);

            //Car car1 = new(testLane.CheckPointNodes[0].X, testLane.CheckPointNodes[0].Y);
            //Car car2 = new(testLane.CheckPointNodes[1].X, testLane.CheckPointNodes[1].Y);

            //int testCarIterator1 = 0, testCarIterator2 = 1;

            CheckPointNode[][] loadedNodesArrayArray = TXTFileNodeLoader.LoadNodesFromTXT();
            Lane[] Lanes = LaneCreator.CreateLanesFrom2dArray(loadedNodesArrayArray);
            RoadUser[] allRoadUsersArray = new RoadUser[0];
            Raylib.SetTargetFPS(20);
            // int scrollSpeed = 4;
            var colour = Raylib_cs.Color.Red;
            ZeroMqHandler.StartSensorPub();
            //ZeroMqHandler.StartStoplichtSub();
            while (!Raylib.WindowShouldClose())
            {
                
                // Publish a message
                ZeroMqHandler.PublishSensorData("SensorData 1");
                //ZeroMqHandler.ListenStoplichtSub();
                //Console.WriteLine(allRoadUsersArray.Length+" before");
                allRoadUsersArray = spawner.spawnRoaduser(Lanes, allRoadUsersArray);
                //Console.WriteLine(allRoadUsersArray.Length+ " after");

                MouseClickNodeCreator.AddCoordinateToNodeFileByClicking(nodeDevMode);
                TrafficLights.TrafficLightStatusChange(nodeDevMode);
                TrafficLights aaaah = new TrafficLights();
                aaaah.TrafficLightStatusChangeSingular();
                Color TrafficLightColor =  TrafficLights.TrafficLightColor;
                if (!nodeDevMode)
                {
                    camera.Zoom += ((float)Raylib.GetMouseWheelMove() * 0.05f);

                    // Raylib.GetMousePosition((float)Raylib.);
                    if (camera.Zoom > 3.0f)
                    {
                        camera.Zoom = 3.0f;
                    }
                    else if (camera.Zoom < 0.1f)
                    {
                        camera.Zoom = 0.1f;
                    }
                    if (Raylib.IsMouseButtonDown(MouseButton.Left))
                    {
                        camera.Target = new Vector2(Raylib.GetMousePosition().X, Raylib.GetMousePosition().Y);
                    }
                }
                //if (testCarIterator1 < testLane.CheckPointNodes.Length - 1)
                //    testCarIterator1 = car1.MoveToNextCheckNode(ref car1.PosX, ref car1.PosY, car1.CarSpeed, testLane.CheckPointNodes, ref testCarIterator1);

                //if (testCarIterator2 < testLane.CheckPointNodes.Length - 1)
                //    testCarIterator2 = car2.MoveToNextCheckNode(ref car2.PosX, ref car2.PosY, car2.CarSpeed, testLane.CheckPointNodes, ref testCarIterator2);

                Raylib.BeginDrawing();
                    Raylib.ClearBackground(Raylib_cs.Color.Black);
                    Raylib.BeginMode2D(camera);
                    Raylib.DrawTexture(crossingroads, screenWidth / 2 - crossingroads.Width / 2, screenHeight / 2 - crossingroads.Height / 2 - 40, Raylib_cs.Color.White);

                    //Raylib.DrawCircleV(new Vector2(car1.PosX, car1.PosY), 30, Raylib_cs.Color.Maroon);
                    //Raylib.DrawCircleV(new Vector2(car2.PosX, car2.PosY), 30, Raylib_cs.Color.Maroon);
                    List<RoadUser> allRoadUsersArrayCopyList= new List<RoadUser>();
                    allRoadUsersArrayCopyList = allRoadUsersArray.ToList();
                    bool shouldBeRemoved;
                    foreach(RoadUser roaduser in allRoadUsersArray)
                    {
                        shouldBeRemoved = false;
                        Raylib.DrawCircleV(new Vector2(roaduser.PosX, roaduser.PosY), 7, Raylib_cs.Color.Maroon);
                        shouldBeRemoved = roaduser.MoveToNextCheckNode(ref roaduser.PosX, ref roaduser.PosY, roaduser.Speed, Lanes[roaduser.LaneID].CheckPointNodes, roaduser.NodeTravelIterator, roaduser);
                        if (shouldBeRemoved) {
                            Console.WriteLine("removing");
                            allRoadUsersArrayCopyList.Remove(roaduser); }
                    }

                    allRoadUsersArray = allRoadUsersArrayCopyList.ToArray();

                    if (nodeDevMode)
                    {
                        loadedNodesArrayArray = TXTFileNodeLoader.LoadNodesFromTXT();
                        Lanes = LaneCreator.CreateLanesFrom2dArray(loadedNodesArrayArray);
                    }
                    //foreach (Lane lane in Lanes)
                    //{
                    //    foreach (var node in lane.CheckPointNodes)
                    //    {
                    //        if (node.Occupied)
                    //        {
                    //            Raylib.DrawCircleV(new Vector2(node.X, node.Y), 3, Raylib_cs.Color.Yellow);
                    //        }
                    //        else
                    //        {
                    //            Raylib.DrawCircleV(new Vector2(node.X, node.Y), 3, Raylib_cs.Color.Green);
                    //        }
                    //    }
                    //}


                    //if(Enviro)
                    //Raylib_cs.Color.Red
                    Lanes[0].addTrafficlight(10);
                    Lanes[1].addTrafficlight(10);
                    Lanes[2].addTrafficlight(10);
                    TrafficLights traffic = new TrafficLights();
                    traffic.TrafficLightSpawn();
                    Color[] controllermsg = { Color.Green, Color.Orange, Color.Red };

                    for (int i = 0; i < 3; i++)
                    {                    
                        Lanes[i].TrafficNode.TrafficLightColor = controllermsg[i];
                        Raylib.DrawCircleV(new Vector2(Lanes[i].TrafficNode.X, Lanes[i].TrafficNode.Y), 3, TrafficLightColor);
                    }

                    //CheckPointNode trafficlight = Lanes[0].CheckPointNodes[10];                
                    //Raylib.DrawCircleV(new Vector2(Lanes[0].TrafficNode.X, Lanes[0].TrafficNode.Y), 3, Raylib_cs.Color.Red);

                    //trafficlight = Lanes[1].CheckPointNodes[10];
                    //Raylib.DrawCircleV(new Vector2(trafficlight.X, trafficlight.Y), 3, Raylib_cs.Color.Red);

                    //trafficlight = Lanes[2].CheckPointNodes[10];
                    //Raylib.DrawCircleV(new Vector2(trafficlight.X, trafficlight.Y), 3, Raylib_cs.Color.Red);
                    //foreach (var node in testLane.CheckPointNodes)
                    //    {
                    //        Raylib.DrawCircleV(new Vector2(node.X ,node.Y), 10, Raylib_cs.Color.Green);
                    //    }



                Raylib.EndDrawing();
            }

            Raylib.UnloadTexture(crossingroads);
            Raylib.CloseWindow();
        }
    }
}

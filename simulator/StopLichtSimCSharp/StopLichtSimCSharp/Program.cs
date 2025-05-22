
﻿using System;
using System.Collections.Generic;
using Raylib_cs;
using System.Numerics;
using System.IO;
using System.Drawing.Drawing2D;
using System.Runtime.InteropServices;
using System.Security.Cryptography.X509Certificates;
using System.Xml.Linq;


namespace StopLichtSimCSharp
{
    

    class Program
    {       
        static void Main()
        {
           
            bool nodeDevMode = false;
            int screenWidth = 1920, screenHeight = 1080;
            Raylib.SetConfigFlags(ConfigFlags.ResizableWindow| ConfigFlags.VSyncHint);
            Raylib.InitWindow(800, 800, "Raylib C# Example");
            Raylib.SetWindowState(ConfigFlags.MaximizedWindow);
            Raylib.SetWindowMinSize(screenWidth, screenHeight/2);
            //Raylib.image imblank = GenImageColor(1024, 1024, Color.blank);
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
            RoadSensors.fillDictionary();
            //RoadSensors.printDictionary();

            CheckPointNode[][] loadedNodesArrayArray = TXTFileNodeLoader.LoadNodesFromTXT();
            Lane[] Lanes = LaneCreator.CreateLanesFrom2dArray(loadedNodesArrayArray);
            RoadUser[] allRoadUsersArray = new RoadUser[0];
            Raylib.SetTargetFPS(40);
            // int scrollSpeed = 4;
            ZeroMqHandler.StartStoplichtSub();
            // var colour = Raylib_cs.Color.Red;
            ZeroMqHandler.StartSensorPub();
            TrafficLights traffic = new TrafficLights();
            var trafficlights = traffic.TrafficLightLoad();
            Task.Run(() => ZeroMqHandler.ListenLoop());

            int testit = 0;
            while (!Raylib.WindowShouldClose())
            {
                testit++;
                //RoadSensors.checkRoadSensors(Lanes);
                string rijbaan_sensor_json = RoadSensors.buildJson(Lanes);
                // Publish a message
                if (testit % 10 == 0)
                {
                    ZeroMqHandler.PublishSensorData(rijbaan_sensor_json);
                    ZeroMqHandler.PublishTimeData(testit);

                }
                //Console.WriteLine(allRoadUsersArray.Length+" before");
                allRoadUsersArray = spawner.spawnRoaduser(Lanes, allRoadUsersArray);
                //Console.WriteLine(allRoadUsersArray.Length+ " after");

                MouseClickNodeCreator.AddCoordinateToNodeFileByClicking(nodeDevMode);
                
                TrafficLights trafficlight = new TrafficLights();
                trafficlight.CompareIdsAndLoadColors();
       
                Dictionary<string,string> nodeIdToTrafficLightColor = TrafficLights.trythis;
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

                Raylib.BeginDrawing();
                #region
                Raylib.ClearBackground(Raylib_cs.Color.Black);
                Raylib.BeginMode2D(camera);
                Raylib.DrawTexture(crossingroads, screenWidth / 2 - crossingroads.Width / 2, screenHeight / 2 - crossingroads.Height / 2 - 40, Raylib_cs.Color.White);
                
                foreach (var lane in Lanes)
                {                   
                    foreach (var node in lane.CheckPointNodes)
                    {
                        try
                        {
                            if (nodeIdToTrafficLightColor[Convert.ToString(node.NodeID)] != null)
                            {
                                node.TrafficLightColor = Convert.ToString(nodeIdToTrafficLightColor.FirstOrDefault(x => x.Key == Convert.ToString(node.NodeID)).Value);
                               // Lanes[Convert.ToInt32(lane.LaneID)].addTrafficlight(Convert.ToInt32(nodeIdToTrafficLightColor.FirstOrDefault(x => x.Key == Convert.ToString(node.NodeID)).Key));
                                Color color = TrafficLights.TrafficLightStatusIndividual(node.TrafficLightColor); 
                                Raylib.DrawCircleV(new Vector2(node.X, node.Y), 3, color);
                            }
                        }
                        catch 
                        { 
                        }                       
                    }
                }

                List<RoadUser> allRoadUsersArrayCopyList= new List<RoadUser>();
                allRoadUsersArrayCopyList = allRoadUsersArray.ToList();
                bool shouldBeRemoved;
                foreach(RoadUser roaduser in allRoadUsersArray)
                {
                    shouldBeRemoved = false;
                    if (roaduser is Car)
                    {
                        Raylib.DrawCircleV(new Vector2(roaduser.PosX, roaduser.PosY), 7, Raylib_cs.Color.Maroon);
                    }
                    else if(roaduser is Bike){
                        Raylib.DrawCircleV(new Vector2(roaduser.PosX, roaduser.PosY), 4, Raylib_cs.Color.Red);

                    }
                    else if (roaduser is Pedestrian)
                    {
                        Raylib.DrawCircleV(new Vector2(roaduser.PosX, roaduser.PosY), 3, Raylib_cs.Color.Red);

                    }
                    else if (roaduser is Boat)
                    {
                        Raylib.DrawCircleV(new Vector2(roaduser.PosX, roaduser.PosY), 10, Raylib_cs.Color.Red);

                    }
                    shouldBeRemoved = roaduser.MoveToNextCheckNode(ref roaduser.PosX, ref roaduser.PosY, roaduser.Speed, Lanes[roaduser.LaneID].CheckPointNodes, nodeIdToTrafficLightColor, roaduser.NodeTravelIterator, roaduser);
                    if (shouldBeRemoved) {
                        //Console.WriteLine("removing");
                        allRoadUsersArrayCopyList.Remove(roaduser); 
                    }
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

                if (nodeDevMode) //change to true if you want the nodes rendered
                {
                    foreach (Lane lane in Lanes)
                    {
                        foreach (var node in lane.CheckPointNodes)
                        {
                            if (new[] { 9, 6, 36, 33, 67,70,158,161,231,234,277,280,312,315,348,351,369,372,406,409,439,442,466,469,485,488,555,558 }.Contains(node.NodeID))
                            {
                                Raylib.DrawCircleV(new Vector2(node.X, node.Y), 3, Raylib_cs.Color.DarkPurple);
                            }
                            
                            else if (node.Occupied)
                            {
                                Raylib.DrawCircleV(new Vector2(node.X, node.Y), 3, Raylib_cs.Color.Yellow);
                            }
                            else if (!node.Occupied)
                            {
                                Raylib.DrawCircleV(new Vector2(node.X, node.Y), 3, Raylib_cs.Color.Green);
                            }
                            
                            else
                            {
                                //Raylib.DrawCircleV(new Vector2(node.X, node.Y), 3, Raylib_cs.Color.Green);
                            }
                            //Console.WriteLine(node.Occupied);
                        }
                    }
                }

                #endregion
                Raylib.EndDrawing();
                
            }

            Raylib.UnloadTexture(crossingroads);
            Raylib.CloseWindow();
        }
    }
}

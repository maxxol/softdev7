﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace StopLichtSimCSharp
{
    class Spawner
    {
        int numberOfCarLanes = 13; //update manually when nodes have been set.
        int numberOfBikeLanes = 12;
        int numberOfPedLanes = 11;
        int numberOfBoatLanes = 2;
        public static Dictionary<string, string> herebelanes = new Dictionary<string, string>();
        public static Dictionary<string, string> trythisagain = new Dictionary<string, string>();
       
        string[] lanesbeloaded = File.ReadAllLines("../../../../../TXTData/Lanenumber.txt");
        int[] forbiddenSpawnLanes = [3, 5, 6,13,15,17,19,24,26];
        public RoadUser[] spawnRoaduser(Lane[] Lanes, RoadUser[] allRoadUsersArray)
        {
            List<RoadUser> allRoadUsersList = allRoadUsersArray.ToList();
            var rand = new Random();
            int chosenLaneNumber = rand.Next(Lanes.Length);
            //chosenLaneNumber = 26;
            if (forbiddenSpawnLanes.Contains(chosenLaneNumber)) { return allRoadUsersList.ToArray(); }
            //if (chosenLaneNumber <= numberOfCarLanes+numberOfBikeLanes) { return allRoadUsersList.ToArray(); }
            //chosenLaneNumber = 4;
            Lane chosenLane = Lanes[chosenLaneNumber]; //choose random lane to spawn a car
            if (rand.Next(21) == 0) {
                if (chosenLaneNumber <= numberOfCarLanes) { spawnCar(chosenLane, chosenLaneNumber, allRoadUsersList);} //car
               
         
                else if (chosenLaneNumber <= numberOfBikeLanes + numberOfCarLanes) { spawnBike(chosenLane, chosenLaneNumber, allRoadUsersList); } //bike
                else if (chosenLaneNumber <= numberOfPedLanes + numberOfCarLanes + numberOfBikeLanes) { spawnPed(chosenLane, chosenLaneNumber, allRoadUsersList); } //ped
                else if (chosenLaneNumber <= numberOfBoatLanes + numberOfCarLanes + numberOfBikeLanes + numberOfPedLanes) { spawnBoat(chosenLane, chosenLaneNumber, allRoadUsersList); } //boat
                else { }//number outside of array count (should be impossible)
            }
            if(rand.Next(31) == 0)
            {   
                if (chosenLaneNumber <= numberOfCarLanes) { spawnBus(chosenLane, chosenLaneNumber, allRoadUsersList); }
                else { }                
            }
            if (rand.Next(35) == 0)
            {
                if (chosenLaneNumber <= numberOfCarLanes) { spawnPriorityVehicle(chosenLane, chosenLaneNumber, allRoadUsersList); }
                else { }
            }
            return allRoadUsersList.ToArray();
        }
        public void spawnCar(Lane chosenLane, int chosenLaneNumber, List<RoadUser> allRoadUsersList)
        {
            //Console.WriteLine("spawned car");
            allRoadUsersList.Add(new Car(chosenLane.CheckPointNodes[0].X, chosenLane.CheckPointNodes[0].Y, chosenLaneNumber));
        }
        public void spawnBike(Lane chosenLane, int chosenLaneNumber, List<RoadUser> allRoadUsersList)
        {
            //Console.WriteLine("spawned bike");

            allRoadUsersList.Add(new Bike(chosenLane.CheckPointNodes[0].X, chosenLane.CheckPointNodes[0].Y, chosenLaneNumber));
        }
        public void spawnPed(Lane chosenLane, int chosenLaneNumber, List<RoadUser> allRoadUsersList)
        {
            //Console.WriteLine("spawned ped");

            allRoadUsersList.Add(new Pedestrian(chosenLane.CheckPointNodes[0].X, chosenLane.CheckPointNodes[0].Y, chosenLaneNumber));
        }
        public void spawnBoat(Lane chosenLane, int chosenLaneNumber, List<RoadUser> allRoadUsersList)
        {
            //Console.WriteLine("spawned boat");

            allRoadUsersList.Add(new Boat(chosenLane.CheckPointNodes[0].X, chosenLane.CheckPointNodes[0].Y, chosenLaneNumber));
        }
        public void spawnBus(Lane chosenLane, int chosenLaneNumber, List<RoadUser> allRoadUsersList)
        {
            allRoadUsersList.Add(new Bus(chosenLane.CheckPointNodes[0].X, chosenLane.CheckPointNodes[0].Y, chosenLaneNumber));       
        }
        public void spawnPriorityVehicle(Lane chosenLane, int chosenLaneNumber, List<RoadUser> allRoadUsersList)
        {
            allRoadUsersList.Add(new VoorrangsVoertuigen(chosenLane.CheckPointNodes[0].X, chosenLane.CheckPointNodes[0].Y, chosenLaneNumber));
        }

        public Dictionary<string, string> LanesLoad(Lane[] Lanes)
        {
            //lane 1 node 10, lane 2 node 37, lane 3 node 72
            foreach (string node in lanesbeloaded)
            {
                string[] part = node.Split(':');
                herebelanes.Add(part[0], part[1]);
            }
            return herebelanes;
        }
        public static void buildJson(Lane[] lanes, List<RoadUser> allRoadUsersList, int testit)
        {
            if (allRoadUsersList.Count > 0)
            {
                //return "";
                Dictionary<string, string> temporarystorageforlanes = new Dictionary<string, string>();
                var result = new Dictionary<string, List<VoorangVoertuigTopic>>();
                result.Add("queue", new List<VoorangVoertuigTopic>());
                //int i = 0;
                foreach (var roadUser in allRoadUsersList)
                {
                    if (roadUser.VehiclePriority > 0)
                    {
                        VoorangVoertuigTopic voertuig = new VoorangVoertuigTopic();
                    //    var aaah = roadUser.LaneID.ToString();
                        //trythisagain = allRoadUsersList.Where(entry => herebelanes[entry.LaneID] != entry.).ToDictionary(entry => entry.Key, entry => roadUser.LaneID[entry.Value]);
                        // trythisagain = 
                        // try
                        //{
                        //temporarystorageforlanes.Add(i.ToString(),roadUser.LaneID.ToString());
                        trythisagain = herebelanes.Where(entry => roadUser.LaneID.ToString() != herebelanes[entry.Key]).ToDictionary(entry => entry.Value, entry => roadUser.LaneID.ToString());
                        //trythisagain = herebelanes.Where(entry => roadUser.LaneID.ToString() != herebelanes[entry.Key]).ToDictionary(entry => entry.Value, entry => roadUser.LaneID.ToString());
                        voertuig.baan = Convert.ToString(trythisagain.FirstOrDefault(x => x.Value == Convert.ToString(roadUser.LaneID)).Key); // roadUser.LaneID.ToString();
                             // Convert.ToString(trythisagain.FirstOrDefault(x => x.Key == Convert.ToString(roadUser.LaneID)).Value);
                        voertuig.simulatie_tijd_ms = testit.ToString();
                        voertuig.prioriteit = roadUser.VehiclePriority;
                         result["queue"].Add(voertuig);
                        //}//Console.WriteLine(josh);
                        //catch (Exception e)
                        //{
                        //}
                                       
                    }
                  //  i++;
                }
                if (result.Count > 0)
                {
                    string json = JsonConvert.SerializeObject(result, Formatting.Indented);
                    Console.WriteLine(json);
                    ZeroMqHandler.PublishPriorityVehicle(json);
                }
            }
            //foreach (Lane lane in lanes)
            //{
            //    foreach (CheckPointNode node in lane.CheckPointNodes)
            //    {
            //        if (allRoadUsersList.)
            //        {
            //            //string[] parts = sensorID.Split('.');
            //            //if (parts.Length == 3)
            //            //{
            //            //    string groupID = $"{parts[0]}.{parts[1]}"; // e.g., "1.1"
            //            //    string position = parts[2]; // "voor" or "achter"
                     
            //            //}
            //        }
            //    }
            //}
            
           // return json;
            //Console.WriteLine(json);
        }
    }
}

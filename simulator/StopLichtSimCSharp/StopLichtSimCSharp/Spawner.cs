using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StopLichtSimCSharp
{
    class Spawner
    {
        int numberOfCarLanes = 3; //update manually when nodes have been set.
        int numberOfBikeLanes = 0;
        int numberOfPedLanes = 0;
        int numberOfBoatLanes = 0;




        public RoadUser[] spawnRoaduser(Lane[] Lanes, RoadUser[] allRoadUsersArray)
        {
            List<RoadUser> allRoadUsersList = allRoadUsersArray.ToList();
            var rand = new Random();
            int chosenLaneNumber = rand.Next(Lanes.Length);
            Lane chosenLane = Lanes[chosenLaneNumber]; //choose random lane to spawn a car
            if (rand.Next(10) == 0) { 
            if (chosenLaneNumber <= numberOfCarLanes) { spawnCar(chosenLane, chosenLaneNumber, allRoadUsersList); } //car
            else if (chosenLaneNumber <= numberOfBikeLanes + numberOfCarLanes) { spawnBike(chosenLane, chosenLaneNumber, allRoadUsersList); } //bike
            else if (chosenLaneNumber <= numberOfPedLanes + numberOfCarLanes + numberOfBikeLanes) { spawnPed(chosenLane, chosenLaneNumber, allRoadUsersList); } //ped
            else if (chosenLaneNumber <= numberOfBoatLanes + numberOfCarLanes + numberOfBikeLanes + numberOfPedLanes) { spawnBoat(chosenLane, chosenLaneNumber, allRoadUsersList); } //boat
            else { }//number outside of array count (should be impossible)
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
    }
}

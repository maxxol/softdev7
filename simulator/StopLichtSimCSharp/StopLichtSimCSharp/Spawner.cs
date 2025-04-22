using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StopLichtSimCSharp
{
    class Spawner
    {
        int numberOfCarLanes = 0; //update when nodes have been set.
        int numberOfBikeLanes = 0;
        int numberOfPedLanes = 0;
        int numberOfBoatLanes = 2;



        List<RoadUser> allRoadUsersArray;


        public void spawnRoaduser(Lane[] Lanes)
        {
            var rand = new Random();
            int chosenLaneNumber = rand.Next(allRoadUsersArray.Count);
            Lane chosenLane = Lanes[chosenLaneNumber]; //choose random lane to spawn a car
            if (chosenLaneNumber <= numberOfCarLanes+1) { spawnCar(chosenLane); } //car
            else if (chosenLaneNumber <= numberOfBikeLanes + numberOfCarLanes) { spawnBike(chosenLane); } //bike
            else if (chosenLaneNumber <= numberOfPedLanes + numberOfCarLanes + numberOfBikeLanes) { spawnPed(chosenLane); } //ped
            else if (chosenLaneNumber <= numberOfBoatLanes + numberOfCarLanes + numberOfBikeLanes + numberOfPedLanes) { } //boat
            else { }//number outside of array count (should be impossible)

        }
        public void spawnCar(Lane chosenLane)
        {
            allRoadUsersArray.Add(new Car(chosenLane.CheckPointNodes[0].x, chosenLane.CheckPointNodes[0].y));
        }
        public void spawnBike(Lane chosenLane)
        {
            allRoadUsersArray.Add(new Bike(chosenLane.CheckPointNodes[0].x, chosenLane.CheckPointNodes[0].y));
        }
        public void spawnPed(Lane chosenLane)
        {
            allRoadUsersArray.Add(new Pedestrian(chosenLane.CheckPointNodes[0].x, chosenLane.CheckPointNodes[0].y));
        }
        public void spawnBoat(Lane chosenLane)
        {
            allRoadUsersArray.Add(new Boat(chosenLane.CheckPointNodes[0].x, chosenLane.CheckPointNodes[0].y));
        }
    }
}

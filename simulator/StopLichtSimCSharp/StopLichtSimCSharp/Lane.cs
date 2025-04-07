using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StopLichtSimCSharp
{   
    class Lane
    {
        public string LaneID;
        public List<RoadUser> LaneUsers = new();
        public CheckPointNode[] CheckPointNodes;
        public Lane(string laneID, CheckPointNode[] checkPointNodes)
        {
            LaneID = laneID;
            CheckPointNodes = checkPointNodes;
        }
        public void AddRoadUserToLane(RoadUser roadUser)
        {
            LaneUsers.Add(roadUser);
        }
    }
}

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
        public CheckPointNode TrafficNode;
        //node met ID 10 is stoplicht. 
        public Lane(string laneID, CheckPointNode[] checkPointNodes)
        {
            LaneID = laneID;
            CheckPointNodes = checkPointNodes;
        }
        public void AddRoadUserToLane(RoadUser roadUser)
        {
            LaneUsers.Add(roadUser);
        }
        public void addTrafficlight(int nodeId)
        {
            //TrafficNode = CheckPointNodes[nodeId];
            TrafficNode = CheckPointNodes.Where(X => Convert.ToInt32(X.NodeID) == nodeId).First();
        }        
    }
}

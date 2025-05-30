using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StopLichtSimCSharp
{
    class CheckPointNode
    {
        public int NodeID;
        public int X, Y;
        public bool Occupied;
        public string TrafficLightColor;

        public CheckPointNode(int x, int y, bool occupied, int nodeid)
        {
            NodeID = nodeid;
            X = x;
            Y = y;
            Occupied = occupied;
            TrafficLightColor = "groen";
        }
    }
}

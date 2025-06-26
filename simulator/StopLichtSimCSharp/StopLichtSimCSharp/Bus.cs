using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StopLichtSimCSharp
{
    internal class Bus : RoadUser
    {
        public Bus(int x, int y, int laneid) 
        {
            PosX = x;
            PosY = y;
            LaneID = laneid;
            Speed = 6;
            NodeTravelIterator = 0;
            VehiclePriority = 2;
        }    
    }
}

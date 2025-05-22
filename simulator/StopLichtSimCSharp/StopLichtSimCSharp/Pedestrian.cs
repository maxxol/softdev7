using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StopLichtSimCSharp
{
    class Pedestrian : RoadUser
    {   
        public Pedestrian(int x, int y, int laneid)
        {
            PosX = x;
            PosY = y;
            LaneID = laneid;
            Speed = 1;
            NodeTravelIterator = 0;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StopLichtSimCSharp
{
    class Boat : RoadUser
    {   
        public Boat(int x, int y, int laneid)
        {
            PosX = x;
            PosY = y;
            LaneID = laneid;
            Speed = 2;
            NodeTravelIterator = 0;
        }
    }
}

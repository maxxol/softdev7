using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StopLichtSimCSharp
{
    class Bike : RoadUser
    {  
        public Bike(int x, int y, int laneid)
        {
            PosX = x;
            PosY = y;
            LaneID = laneid;
            Speed = 3;
            NodeTravelIterator = 0;
        }
    }
}

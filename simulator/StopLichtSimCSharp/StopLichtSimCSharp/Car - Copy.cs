using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StopLichtSimCSharp
{
    class Boat : RoadUser
    {
        public int PosX, PosY, BoatSpeed;
        public Boat(int x, int y)
        {
            PosX = x;
            PosY = y;
            BoatSpeed = 2;
        }
    }
}

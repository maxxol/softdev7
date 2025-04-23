using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StopLichtSimCSharp
{
    class Bike : RoadUser
    {
        public int PosX, PosY, BikeSpeed;
        public Bike(int x, int y)
        {
            PosX = x;
            PosY = y;
            BikeSpeed = 2;
        }
    }
}

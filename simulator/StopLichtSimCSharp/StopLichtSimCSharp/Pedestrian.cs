using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StopLichtSimCSharp
{
    class Pedestrian : RoadUser
    {
        public int PosX, PosY, PedSpeed;
        public Pedestrian(int x, int y)
        {
            PosX = x;
            PosY = y;
            PedSpeed = 2;
        }
    }
}

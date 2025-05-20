using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StopLichtSimCSharp
{
    class Car : RoadUser
    { 
        public Car(int x, int y, int laneid)
        {
            PosX = x;
            PosY = y;
            LaneID = laneid;
            Speed = 20;
            NodeTravelIterator = 0;

        }
        //public void DriveManual(char dir)
        //{
        //    switch (dir)
        //    {
        //        case 'n': PosY -= CarSpeed; break;
        //        case 'e': PosX += CarSpeed; break;
        //        case 's': PosY += CarSpeed; break;
        //        case 'w': PosX -= CarSpeed; break;
        //        case 'x': break;
        //        default: Console.WriteLine("Invalid"); break;
        //    }
        //}
    }
}

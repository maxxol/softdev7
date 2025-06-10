using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;

namespace StopLichtSimCSharp
{
    internal class VoorrangsVoertuigen: RoadUser
    {

        public VoorrangsVoertuigen(int x, int y, int laneid) 
        {
            PosX = x;
            PosY = y;
            LaneID = laneid;
            Speed = 6;
            NodeTravelIterator = 0;
            VehiclePriority = 1;
        }
    }

    class VoorangVoertuigTopic
    {
        public string? baan { get; set; }
        public string? simulatie_tijd_ms { get; set; }
        public int prioriteit { get; set; }
    };
}

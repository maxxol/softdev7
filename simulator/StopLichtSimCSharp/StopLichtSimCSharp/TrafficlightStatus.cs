using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace StopLichtSimCSharp
{
    internal class TrafficLightStatus
    {
        // public string[] array = { "rood", "oranje", "groen" };
        public static Dictionary<string, string> trafficlights = new Dictionary<string, string>();
        string color = "10.1:rood";
        public string Traffic()
        {

            
            string[] part = color.Split(':');
            trafficlights.Add(part[0], part[1]);


            // Raylib.Color
            return color;
        }
    }
}

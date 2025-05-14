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
        public static Dictionary<string, string> trafficlights = new Dictionary<string, string>();        
        public string Traffic()
        {
            Console.WriteLine("write the colorname");
            string color = "";
            for (int i = 0; i < 3; i++)
            {
                if (i == 0)
                {
                    color = "10.1:rood";
                }
                else if (i == 1)
                {
                    color = "12.1:geel";                    
                }
                else
                {
                    color = "11.1:groen";
                }
                string[] part = color.Split(':');
                trafficlights.TryAdd(part[0], part[1]); 
            }
            return color;
        }
    }
}

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
            for (int i = 0; i < 14; i++)
            {
                if (i == 0)
                {
                    color = "10.1:rood";
                }
                else if (i == 1)
                {
                    color = "11.1:groen";                    
                }
                else if (i == 2)
                {
                    color = "12.1:geel";
                }
                else if (i == 3)
                {
                    color = "1.1:groen";
                }
                else if (i == 4)
                {
                    color = "2.1:geel";
                }
                else if (i == 5)
                {
                    color = "2.2:rood";
                }
                else if (i == 6)
                {
                    color = "3.1:rood";
                }
                else if (i == 7)
                {
                    color = "4.1:geel";
                }
                else if (i == 8)
                {
                    color = "5.1:geel";
                }
                else if (i == 9)
                {
                    color = "6.1:groen";
                }
                else if (i == 10)
                {
                    color = "7.1:geel";
                }
                else if (i == 11)
                {
                    color = "8.1:groen";
                }
                else if (i == 12)
                {
                    color = "8.2:geel";
                }
                else if (i == 13)
                {
                    color = "9.1:rood";
                }
                string[] part = color.Split(':');
                trafficlights.TryAdd(part[0], part[1]); 
            }
            return color;
        }
    }
}

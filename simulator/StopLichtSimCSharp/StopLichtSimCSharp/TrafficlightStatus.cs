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
        public Dictionary<string, string> trafficlights = new Dictionary<string, string>();        
        public void Traffic()
        {
            //Console.WriteLine("write the colorname");
           // string message = "";

            Random randy = new Random();
            int randycolor = randy.Next(0,3);
            string[] color = { "rood", "groen", "geel" };
           // ZeroMqHandler.topic, ZeroMqHandler.message
            
             string controllermessage = $"'1.1': {color[randycolor]}, '2.1': {color[randycolor]}, '10.1': {color[randycolor]}, '11.1':{color[randycolor]}, '12.1': {color[randycolor]}, '3.1': {color[randycolor]}, '4.1': {color[randycolor]}, '5.1': {color[randycolor]}, '2.2': {color[randycolor]}, '6.1': {color[randycolor]}, '7.1': {color[randycolor]}, '8.1': {color[randycolor]}, '8.2': {color[randycolor]}, '9.1': {color[randycolor]}";
            // for (int i = 0; i < 14; i++)
            //{
            //if (i == 0)
            //{
            //    color = "10.1:rood";
            //}
            //else if (i == 1)
            //{
            //    color = "11.1:groen";                    
            //}
            //else if (i == 2)
            //{
            //    color = "12.1:geel";
            //}
            //else if (i == 3)
            //{
            //    color = "1.1:groen";
            //}
            //else if (i == 4)
            //{
            //    color = "2.1:geel";
            //}
            //else if (i == 5)
            //{
            //    color = "2.2:rood";
            //}
            //else if (i == 6)
            //{
            //    color = "3.1:rood";
            //}
            //else if (i == 7)
            //{
            //    color = "4.1:geel";
            //}
            //else if (i == 8)
            //{
            //    color = "5.1:geel";
            //}
            //else if (i == 9)
            //{
            //    color = "6.1:groen";
            //}
            //else if (i == 10)
            //{
            //    color = "7.1:geel";
            //}
            //else if (i == 11)
            //{
            //    color = "8.1:groen";
            //}
            //else if (i == 12)
            //{
            //    color = "8.2:geel";
            //}
            //else if (i == 13)
            //{
            //    color = "9.1:rood";
            //}
            string[] otherpart = ZeroMqHandler.receivedMessage.Replace("'", "").Replace("{", "").Replace("}", "").Replace("\\", "").Replace("\"","").Replace(" ", "").Split(',');
            foreach (string stoplicht in otherpart)
            {
                try
                {
                    string[] part = stoplicht.Split(':');
                    trafficlights.TryAdd(part[0], part[1]);
                }
                catch { }
            }
            
                
           // }
            //return controllermessage;
        }
    }
}

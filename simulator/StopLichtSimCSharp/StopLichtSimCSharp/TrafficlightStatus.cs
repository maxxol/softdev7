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

            //Random randy = new Random();
           // int randycolor = randy.Next(0, 3);
            string[] color = { "rood", "groen", "geel" };
            

           // string controllermessage = $"'1.1': {color[randycolor]}, '2.1': {color[randycolor]}, '10.1': {color[randycolor]}, '11.1':{color[randycolor]}, '12.1': {color[randycolor]}, '3.1': {color[randycolor]}, '4.1': {color[randycolor]}, '5.1': {color[randycolor]}, '2.2': {color[randycolor]}, '6.1': {color[randycolor]}, '7.1': {color[randycolor]}, '8.1': {color[randycolor]}, '8.2': {color[randycolor]}, '9.1': {color[randycolor]}";

            string[] otherpart = ZeroMqHandler.receivedMessage.Replace("'", "").Replace("{", "").Replace("}", "").Replace("\\", "").Replace("\"", "").Replace(" ", "").Split(',');
            foreach (string stoplicht in otherpart)
            {
                try
                {
                    string[] part = stoplicht.Split(':');
                    trafficlights.TryAdd(part[0], part[1]);
                }
                catch { }
            }
        }
    }
}

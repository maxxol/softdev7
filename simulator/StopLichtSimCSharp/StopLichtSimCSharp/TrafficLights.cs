using Raylib_cs;
using System;
using System.Collections.Generic;
using System.Data.OleDb;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StopLichtSimCSharp
{
    internal class TrafficLights
    {
        public static Color TrafficLightColor;
        public Dictionary<int, string> trafficlightnodes = new Dictionary<int, string>();
        public static int TrafficLightID;
        string[] trafficlightcoords = File.ReadAllLines("../../../../../NodeData/TrafficLightIDs.txt");
       
        public void TrafficLightSpawn()
        {
            //lane 1 node 10, lane 2 node 37, lane 3 node 72
            foreach (string node in trafficlightcoords)
            {
                string[] part = node.Split(':');
                trafficlightnodes.Add(Convert.ToInt32(part[0]), part[1]);
            }
        }

        public static void TrafficLightStatusChange(bool turnOnNodeCreationByClicking)
        {                       
            if (Raylib.IsMouseButtonPressed(MouseButton.Middle))
            {
                TrafficLightColor = Color.Yellow;
            }
            if (Raylib.IsMouseButtonPressed(MouseButton.Left))
            {
                TrafficLightColor = Color.Red;
            }
            if (Raylib.IsMouseButtonPressed(MouseButton.Right))
            {
                TrafficLightColor = Color.Green;
            }
        }

        public void TrafficLightStatusChangeSingular()
        {
            TrafficLightStatus something = new TrafficLightStatus();
            something.Traffic();
            var lighttochange = trafficlightnodes.Where(entry => TrafficLightStatus.trafficlights[entry.Value] == entry.Value);        
        }
    }
}

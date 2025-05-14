using Raylib_cs;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data.OleDb;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StopLichtSimCSharp
{
    internal class TrafficLights
    {
        public static Color TrafficLightColor;
        public static Dictionary<string, string> trafficlightnodes = new Dictionary<string, string>();
       // public static int TrafficLightID;

        public static Dictionary<string, string> trythis =  new Dictionary<string, string>();

        string[] trafficlightcoords = File.ReadAllLines("../../../../../NodeData/TrafficLightIDs.txt");
       
        public Dictionary<string, string> TrafficLightSpawn()
        {
            //lane 1 node 10, lane 2 node 37, lane 3 node 72
            foreach (string node in trafficlightcoords)
            {
                string[] part = node.Split(':');
                trafficlightnodes.Add(part[0], part[1]);
            }
            return trafficlightnodes;
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

        public static Color TrafficLightStatusIndividual(string givencolor)
        {
            if (givencolor == "rood")
            {
                TrafficLightColor = Color.Red;               
            }
            if (givencolor == "geel")
            {
                TrafficLightColor = Color.Yellow;
            }
            if (givencolor == "groen")
            {
                TrafficLightColor = Color.Green;
            }
            return TrafficLightColor;
        }
        //Entry van TrafficLightStatus = key 10.1, value rood
        //Entry van TrafficlightNodes =  key 10, value 10.1
        public void TrafficLightStatusChangeSingular(/*Dictionary<int,string> trafficlights*/)
        {
            //trafficlightnodes = trafficlights;
            TrafficLightStatus something = new TrafficLightStatus();
            something.Traffic();
            trythis = trafficlightnodes.Where(entry => TrafficLightStatus.trafficlights[entry.Value] != entry.Value).ToDictionary(entry => entry.Key, entry => TrafficLightStatus.trafficlights[entry.Value]);
            
            
          //  int nodeid = Convert.ToInt32(lighttochange.Keys.First());
            //string colour = lighttochange.Values.First();
            //trafficLightID = nodeid;
            //TrafficLightStatusIndividual(colour);
            //foreach (var light in lighttochange)
            //{

            //}
            //var 
            //if (trafficlightnodes[value].Equals(TrafficLightStatus.trafficlights[value]))
            //{
            //    Console.Write(value);
            //}

            // TrafficLightID = Convert.ToInt32(lighttochange.Value);
            //output: 10            
        }
    }
}

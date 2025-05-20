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
       
        public Dictionary<string, string> TrafficLightLoad()
        {
            //lane 1 node 10, lane 2 node 37, lane 3 node 72
            foreach (string node in trafficlightcoords)
            {
                string[] part = node.Split(':');
                trafficlightnodes.Add(part[0], part[1]);
            }
            return trafficlightnodes;
        }

        public static Color TrafficLightStatusIndividual(string givencolor)
        {
            if (givencolor == "rood")
            {
                TrafficLightColor = Color.Red;               
            }
            if (givencolor == "oranje")
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
        public void CompareIdsAndLoadColors()
        {
            //trafficlightnodes = trafficlights;
            TrafficLightStatus something = new TrafficLightStatus();
            something.Traffic();
            try
            {
                trythis = trafficlightnodes.Where(entry => something.trafficlights[entry.Value] != entry.Value).ToDictionary(entry => entry.Key, entry => something.trafficlights[entry.Value]);
            }
            catch 
            {
            }
        }
    }
}

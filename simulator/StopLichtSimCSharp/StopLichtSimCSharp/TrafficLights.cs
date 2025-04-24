using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StopLichtSimCSharp
{
    internal class TrafficLights
    {
        public Dictionary<string, string> trafficlightnodes = new Dictionary<string, string>();

        string[] trafficlightcoords = File.ReadAllLines("../../../../../NodeData/TrafficLightIDs.txt");
       
        public void StoplichtSpawn(Lane checkpoint, int lanenumber)
        {
            //lane 1 node 10, lane 2 node 37, lane 3 node 72
            //foreach (string node in trafficlightcoords)
            //{ 
            //    trafficlightnodes.Add(node, );
            // //   string parts = node.Split('.');
            //  //  trafficlightnodes.Add(node,);
            //}
        }
    }
}

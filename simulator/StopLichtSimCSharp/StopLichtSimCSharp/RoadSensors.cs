using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.XPath;

namespace StopLichtSimCSharp
{
    class RoadSensors
    {
        static Dictionary<int, string> nodeIDToSensorIDDictionary = new Dictionary<int, string>();


        public static void fillDictionary()
        {
            string[] coords = File.ReadAllLines("../../../../../TXTData/NodeIDToSensorID.txt");


            foreach (string line in coords)
            {
                string[] parts = line.Split(':');//, StringSplitOptions.RemoveEmptyEntries);

                //Console.WriteLine(line);
                nodeIDToSensorIDDictionary.Add(Convert.ToInt32(parts[0]), parts[1]);
            }
        
        }
        public static void printDictionary()
        {
            foreach (var kvp in nodeIDToSensorIDDictionary)
            {
                Console.WriteLine(kvp.Key + "corresponds to "+ kvp.Value);
            }
        }
        public static void checkRoadSensors(Lane[] lanes)
        {
            foreach (Lane lane in lanes)
            {
                foreach (CheckPointNode node in lane.CheckPointNodes) 
                {
                    try
                    {
                        if (nodeIDToSensorIDDictionary[node.NodeID] != null)
                        {
                            if (node.Occupied)
                            {
                                Console.WriteLine(nodeIDToSensorIDDictionary[node.NodeID] + " has activated");
                            }
                        }
                    }
                    catch
                    {

                    }
                }
            }
        }

    }
}

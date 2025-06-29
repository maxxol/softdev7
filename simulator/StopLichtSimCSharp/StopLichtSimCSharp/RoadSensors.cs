﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.XPath;
using Newtonsoft.Json;

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
                    //Console.WriteLine("test");
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

        
        public static string buildJson(Lane[] lanes)
        {
            var result = new Dictionary<string, Dictionary<string, bool>>();

            //start mocked sensors
            string[] staticSensorGroups = new string[]
            {
                "37.1", "37.2", "38.2", "38.1", "31.1", "31.2", "32.1",
                "22.1", "23.1", "33.1", "33.2", "34.1", "34.2", "24.1",
                "25.1", "35.1", "36.1", "35.2"
            };

            foreach (var groupID in staticSensorGroups)
            {
                if (!result.ContainsKey(groupID))
                {
                    result[groupID] = new Dictionary<string, bool>
                    {
                        { "voor", false },
                        { "achter", false }
                    };
                }
            }
            //end mocked sensors

            foreach (Lane lane in lanes)
            {
                foreach (CheckPointNode node in lane.CheckPointNodes)
                {
                    if (nodeIDToSensorIDDictionary.TryGetValue(node.NodeID, out string sensorID))
                    {
                        string[] parts = sensorID.Split('.');
                        if (parts.Length == 3)
                        {
                            string groupID = $"{parts[0]}.{parts[1]}"; // e.g., "1.1"
                            string position = parts[2]; // "voor" or "achter"

                            if (!result.ContainsKey(groupID))
                            {
                                result[groupID] = new Dictionary<string, bool>
                                {
                                    { "voor", false },
                                    { "achter", false }
                                };
                            }
                            result[groupID][position] = node.Occupied;                           
                        }
                    }
                }
            }
            string json = JsonConvert.SerializeObject(result, Formatting.Indented);
            Console.WriteLine(json);
            return json;
            //Console.WriteLine(json);
        }
    }
}

﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StopLichtSimCSharp
{
    internal class SensorenSpeciaal
    {
        //public int[][] brugNodes;
        public static Dictionary<int, string> brugNodes = new Dictionary<int, string>();

        public static void fillDictionary()
        {
            string[] coords = File.ReadAllLines("../../../../../TXTData/SensorenSpeciaal.txt");

            foreach (string line in coords)
            {
                string[] parts = line.Split(':');//, StringSplitOptions.RemoveEmptyEntries);

                //Console.WriteLine(line);                             
                brugNodes.Add(Convert.ToInt32(parts[0]), parts[1]);                
            }        
        }

        public static void bridgeSensors(Lane[] lanes)
        {
            var result = new Dictionary<string, Dictionary<string, bool>>();
            foreach (Lane lane in lanes)
            {
                foreach (CheckPointNode node in lane.CheckPointNodes)
                {
                    try
                    {
                        if (brugNodes.TryGetValue(node.NodeID, out string sensorID))
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
                                        { "brug_wegdek", false },
                                        { "brug_water", false },
                                        { "brug_file", false }
                                    };
                                }
                                result[groupID][position] = node.Occupied;
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

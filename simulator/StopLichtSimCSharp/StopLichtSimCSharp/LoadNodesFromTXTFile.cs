using Raylib_cs;
using System.Numerics;

namespace StopLichtSimCSharp
{
    class TXTFileNodeLoader
    {
        public static CheckPointNode[][] LoadNodesFromTXT()
        {

            //"../../../../../TXTData/NodeData.txt"
            //StreamReader sr = new StreamReader("Names.txt");
            string[] coords = File.ReadAllLines("../../../../../TXTData/NodeData.txt");


            List<CheckPointNode[]> loadedNodesListList = new List<CheckPointNode[]>();

            List<CheckPointNode> autoCreatedCheckpointList = new List<CheckPointNode>();
            foreach (string line in coords)
            {

                //Removes arrows arround coordinate values.
                string cleanLine = line;
                var unneccessaryCharacters = new string[] { "<", ">"};
                foreach (var c in unneccessaryCharacters)
                {
                    //Console.WriteLine(c+" is < or >");
                   // Console.WriteLine(line);
                    cleanLine = cleanLine.Replace(c, " ");
                    //Console.WriteLine(cleanLine);

                }

                //Console.WriteLine("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"+cleanLine);
                //Seperates values after each dot to seperate x cooridnates, y coordinates and node ID's.
                string[] parts = cleanLine.Split('.');//, StringSplitOptions.RemoveEmptyEntries);

                //Console.WriteLine(line);
                //Ignore LANE END when adding checkpointnodes to list.
                if (cleanLine != "LANE END")
                {
                    //Console.WriteLine("trying: "+cleanLine);
                    autoCreatedCheckpointList.Add(new CheckPointNode(Convert.ToInt32(parts[0]), (Convert.ToInt32(parts[1])), false, Convert.ToInt32(parts[2])));
                    //loadedNodesListList.Add(autoCreatedCheckpointList.ToArray());
                    //Console.WriteLine("added point");
                }

                else
                {
                    //Console.WriteLine("lane ended");
                    loadedNodesListList.Add(autoCreatedCheckpointList.ToArray());
                    autoCreatedCheckpointList.Clear();
                }
            }
            return loadedNodesListList.ToArray();
        }
    }
}

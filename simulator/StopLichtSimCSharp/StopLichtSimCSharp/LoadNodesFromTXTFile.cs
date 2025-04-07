using Raylib_cs;
using System.Numerics;

namespace StopLichtSimCSharp
{
    class TXTFileNodeLoader
    {
        public static CheckPointNode[][] LoadNodesFromTXT()
        {

            //"../../../../../NodeData/NodeData.txt"
            //StreamReader sr = new StreamReader("Names.txt");
            string[] coords = File.ReadAllLines("../../../../../NodeData/NodeData.txt");


            List<CheckPointNode[]> loadedNodesListList = new List<CheckPointNode[]>();

            List<CheckPointNode> autoCreatedCheckpointList = new List<CheckPointNode>();

            foreach (string line in coords)
            {
                string cleanLine = line.Trim('<', '>');
                Console.WriteLine(cleanLine);
                string[] parts = cleanLine.Split('.');//, StringSplitOptions.RemoveEmptyEntries);

                //Console.WriteLine(line);
                if (cleanLine != "LANE END")
                {
                    autoCreatedCheckpointList.Add(new CheckPointNode(Convert.ToInt32(parts[0]), (Convert.ToInt32(parts[1])), false));
                    Console.WriteLine("added point");
                }

                else
                {
                    Console.WriteLine("lane ended");
                    loadedNodesListList.Add(autoCreatedCheckpointList.ToArray());
                    autoCreatedCheckpointList.Clear();
                }
            }
            return loadedNodesListList.ToArray();
        }
    }
}

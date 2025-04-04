using Raylib_cs;
using System.Numerics;

namespace StopLichtSimCSharp
{
    class TXTFileNodeLoader
    {
        public static CheckPointNode[] LoadNodesFromTXT()
        {

            //"../../../../../NodeData/NodeData.txt"
            //StreamReader sr = new StreamReader("Names.txt");
            string[] coords = File.ReadAllLines("../../../../../NodeData/NodeData.txt");
            List<CheckPointNode> autoCreatedCheckpointArray = new List<CheckPointNode>();

            foreach (string line in coords)
            {
                string cleanLine = line.Trim('<', '>');
                Console.WriteLine(cleanLine);
                string[] parts = cleanLine.Split('.');//, StringSplitOptions.RemoveEmptyEntries);

                //Console.WriteLine(line);
                if (cleanLine != "LANE END")
                {
                    autoCreatedCheckpointArray.Add(new CheckPointNode(Convert.ToInt32(parts[0]), (Convert.ToInt32(parts[1])), false));
                }
                else 
                {
                    break;
                    
                }
            }
            return autoCreatedCheckpointArray.ToArray();
        }
    }
}

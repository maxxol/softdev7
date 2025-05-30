using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StopLichtSimCSharp
{
    internal class BruggenSensors
    {
        public int[][] brugNodes;
        public static void bridgeSensors(Lane[] lanes)
        {
            foreach (Lane lane in lanes)
            {
                foreach (CheckPointNode node in lane.CheckPointNodes)
                {
                    try
                    {

                    }
                    catch 
                    {
                    
                    }
                }
            }
        }
    }
}

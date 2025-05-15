using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StopLichtSimCSharp
{
    class RoadUser
    {
        public int PosX, PosY, Speed, NodeTravelIterator, LaneID;
        public bool MoveToNextCheckNode(ref int posX, ref int posY, int roadUserSpeed, CheckPointNode[] checkPointNodes, Dictionary<string, string> nodeId, int iterator, RoadUser roaduser)
        {
            checkPointNodes[iterator].Occupied = true;

            //Console.WriteLine("iterator used: " + iterator); //+ " " + checkPointNodes.Length);
            try
            {
                int testValue = checkPointNodes[iterator + 1].X;
            }
            catch 
            {
                //Console.WriteLine("car has reached final point");
                checkPointNodes[iterator].Occupied = false;
                return true; 
            }

            if (checkPointNodes[iterator + 1].Occupied == true || (checkPointNodes[iterator + 1].TrafficLightColor == "rood")) { return false; }// if next node is occupied

            int xDiff = checkPointNodes[iterator + 1].X - posX;
            int yDiff = checkPointNodes[iterator + 1].Y - posY;

            double distance = Math.Sqrt(xDiff * xDiff + yDiff * yDiff);
            

            double moveX = (xDiff / distance) * roadUserSpeed;
            double moveY = (yDiff / distance) * roadUserSpeed;

            posX += (int)Math.Round(moveX);
            posY += (int)Math.Round(moveY);

            if (Math.Abs(checkPointNodes[iterator + 1].X - posX) < roadUserSpeed && Math.Abs(checkPointNodes[iterator + 1].Y - posY) < roadUserSpeed)
            {
                posX = checkPointNodes[iterator + 1].X;
                posY = checkPointNodes[iterator + 1].Y;
                checkPointNodes[iterator].Occupied = false; 
                roaduser.NodeTravelIterator += 1;
                
                return false;
            }
            return false;
        }
    }
}

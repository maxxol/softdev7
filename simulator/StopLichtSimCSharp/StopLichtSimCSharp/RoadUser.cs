using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StopLichtSimCSharp
{
    class RoadUser
    {
        Random random = new Random();
        int[] mergePointNodeIDs = [548, 478,356];

        public int PosX, PosY, Speed, NodeTravelIterator, LaneID;
        public bool MoveToNextCheckNode(ref int posX, ref int posY, int roadUserSpeed, CheckPointNode[] checkPointNodes, Dictionary<string, string> nodeId, int iterator, RoadUser roaduser)
        {
            checkPointNodes[iterator].Occupied = true;



            //-------------------------------------------------------------------lane diverging---------------------------------------------------------
            if (checkPointNodes[iterator].NodeID == 206 && random.Next(20) == 0)
            {
                checkPointNodes[iterator].Occupied = false;
                roaduser.LaneID = 5;
                roaduser.NodeTravelIterator = 0;
                return false;
            }
            if (checkPointNodes[iterator].NodeID == 263 && random.Next(20) == 0)
            {
                checkPointNodes[iterator].Occupied = false;
                roaduser.LaneID = 6;
                roaduser.NodeTravelIterator = 0;
                return false;
            }
            if (checkPointNodes[iterator].NodeID == 218 && random.Next(20) == 0)
            {
                checkPointNodes[iterator].Occupied = false;
                roaduser.LaneID = 3;
                roaduser.NodeTravelIterator = 0;
                return false;
            }
            //-------------------------------------------------------------------end diverge-------------------------------------------------------------
            //Console.WriteLine("iterator used: " + iterator); //+ " " + checkPointNodes.Length);
            try
            {
                int testValue = checkPointNodes[iterator + 1].X;
            }
            catch
            {
                //Console.WriteLine("car has reached final point");

                checkPointNodes[iterator].Occupied = false;
                //Console.WriteLine(checkPointNodes[iterator].NodeID);
                //-------------------------------------------------------------------lane merging---------------------------------------------------------

                if (mergePointNodeIDs.Contains(checkPointNodes[iterator].NodeID))//if this lane needs to merge into another lane
                { 
                    if (checkPointNodes[iterator].NodeID == 548)
                    {
                        roaduser.LaneID = 2;
                        roaduser.NodeTravelIterator = 70;
                        return false;
                    }

                    if (checkPointNodes[iterator].NodeID == 478)
                    {
                        roaduser.LaneID = 2;
                        roaduser.NodeTravelIterator = 20;
                        return false;
                    }
                    if (checkPointNodes[iterator].NodeID == 356)
                    {
                        roaduser.LaneID = 2;
                        roaduser.NodeTravelIterator = 20;
                        return false;
                    }
                    //-------------------------------------------------------------------end merging-------------------------------------------------------------

                    return true; 
                } 




                else {return true;}

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

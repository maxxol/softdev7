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

        public int PosX, PosY, Speed, NodeTravelIterator, LaneID, VehiclePriority;
        
        public bool MoveToNextCheckNode(ref int posX, ref int posY, int roadUserSpeed, CheckPointNode[] checkPointNodes, Dictionary<string, string> nodeId, int iterator, RoadUser roaduser)
        {
            checkPointNodes[iterator].Occupied = true;



            //-------------------------------------------------------------------lane diverging---------------------------------------------------------
            if (checkPointNodes[iterator].NodeID == 206 && random.Next(20) == 0) //autoweg van brug naar kruispunt boven
            {
                checkPointNodes[iterator].Occupied = false;
                roaduser.LaneID = 5;
                roaduser.NodeTravelIterator = 0;
                return false;
            }
            if (checkPointNodes[iterator].NodeID == 263 && random.Next(20) == 0) //autoweg van brug naar kruispunt rechtdoor-onder
            {
                checkPointNodes[iterator].Occupied = false;
                roaduser.LaneID = 6;
                roaduser.NodeTravelIterator = 0;
                return false;
            }
            if (checkPointNodes[iterator].NodeID == 218 && random.Next(20) == 0) //autoweg van brug naar kruispunt onder
            {
                checkPointNodes[iterator].Occupied = false;
                roaduser.LaneID = 3;
                roaduser.NodeTravelIterator = 0;
                return false;
            }

            if (checkPointNodes[iterator].NodeID == 1010 && random.Next(30) == 0) //voetpad van linksmiddenonder naar boven
            {
                checkPointNodes[iterator].Occupied = false;
                roaduser.LaneID = 36;
                roaduser.NodeTravelIterator = 0;
                return false;
            }
            if (checkPointNodes[iterator].NodeID == 1010 && random.Next(30) == 0) //voetpad van linksmiddenonder naar brug
            {
                checkPointNodes[iterator].Occupied = false;
                roaduser.LaneID = 37;
                roaduser.NodeTravelIterator = 0;
                return false;
            }
            if (checkPointNodes[iterator].NodeID == 888 && random.Next(30) == 0) //voetpad van linksmiddenonder naar brug
            {
                checkPointNodes[iterator].Occupied = false;
                roaduser.LaneID = 28;
                roaduser.NodeTravelIterator = 0;
                return false;
            }
            if (checkPointNodes[iterator].NodeID == 888 && random.Next(30) == 0) //voetpad van linksmiddenonder naar brug
            {
                checkPointNodes[iterator].Occupied = false;
                roaduser.LaneID = 38;
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

                    if (checkPointNodes[iterator].NodeID == 685)
                    {
                        roaduser.LaneID = 27;
                        roaduser.NodeTravelIterator = 10;
                        return false;
                    }
                    if (checkPointNodes[iterator].NodeID == 931)
                    {
                        roaduser.LaneID = 30;
                        roaduser.NodeTravelIterator = 34;
                        return false;
                    }
                    if (checkPointNodes[iterator].NodeID == 16081)
                    {
                        roaduser.LaneID = 33;
                        roaduser.NodeTravelIterator = 10;
                        return false;
                    }

                    //-------------------------------------------------------------------end merging-------------------------------------------------------------

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

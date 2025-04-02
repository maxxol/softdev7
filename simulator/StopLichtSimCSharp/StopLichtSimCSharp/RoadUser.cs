using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StopLichtSimCSharp
{
    class RoadUser
    {
        public int MoveToNextCheckNode(ref int posX, ref int posY, int roadUserSpeed, List<CheckPointNode> checkPointNodes, ref int iterator)
        {
            int xDiff = checkPointNodes[iterator + 1].X - posX;
            int yDiff = checkPointNodes[iterator + 1].Y - posY;

            double distance = Math.Sqrt(xDiff * xDiff + yDiff * yDiff);
            if (distance < 1)
            {
                posX = checkPointNodes[iterator + 1].X;
                posY = checkPointNodes[iterator + 1].Y;
                return ++iterator;
            }

            double moveX = (xDiff / distance) * roadUserSpeed;
            double moveY = (yDiff / distance) * roadUserSpeed;

            posX += (int)Math.Round(moveX);
            posY += (int)Math.Round(moveY);

            if (Math.Abs(checkPointNodes[iterator + 1].X - posX) < roadUserSpeed && Math.Abs(checkPointNodes[iterator + 1].Y - posY) < roadUserSpeed)
            {
                posX = checkPointNodes[iterator + 1].X;
                posY = checkPointNodes[iterator + 1].Y;
                return ++iterator;
            }
            return iterator;
        }
    }
}

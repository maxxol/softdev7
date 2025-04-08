using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StopLichtSimCSharp
{
    class RoadUser
    {
        public int MoveToNextCheckNode(ref int posX, ref int posY, int roadUserSpeed, CheckPointNode[] checkPointNodes, ref int iterator)
        {
            int xDiff = checkPointNodes[iterator + 1].x - posX;
            int yDiff = checkPointNodes[iterator + 1].y - posY;

            double distance = Math.Sqrt(xDiff * xDiff + yDiff * yDiff);
            if (distance < 1)
            {
                posX = checkPointNodes[iterator + 1].x;
                posY = checkPointNodes[iterator + 1].y;
                return ++iterator;
            }

            double moveX = (xDiff / distance) * roadUserSpeed;
            double moveY = (yDiff / distance) * roadUserSpeed;

            posX += (int)Math.Round(moveX);
            posY += (int)Math.Round(moveY);

            if (Math.Abs(checkPointNodes[iterator + 1].x - posX) < roadUserSpeed && Math.Abs(checkPointNodes[iterator + 1].y - posY) < roadUserSpeed)
            {
                posX = checkPointNodes[iterator + 1].x;
                posY = checkPointNodes[iterator + 1].y;
                return ++iterator;
            }
            return iterator;
        }
    }
}

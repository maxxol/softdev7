using Raylib_cs;
using System.Numerics;
using System.Reflection.Emit;

namespace StopLichtSimCSharp
{
    class LaneCreator
    {
        public static Lane[] CreateLanesFrom2dArray(CheckPointNode[][] loadedNodesArrayArray)
        {
            List<Lane> lanes = new List<Lane>();
            int laneIdIncrementor = 1;
            foreach (CheckPointNode[] autoCreatedCheckpointArray in loadedNodesArrayArray)
            {
                Lane lane = new Lane(laneIdIncrementor.ToString(),autoCreatedCheckpointArray);
                lanes.Add(lane);
            }
            return lanes.ToArray();
        }
    }
}

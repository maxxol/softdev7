using Raylib_cs;
using System.Numerics;

namespace StopLichtSimCSharp
{
    class MouseClickNodeCreator
    {
        static int nodeIDIncrementor = 148; //latest nodeid in the node file + 1

        public static void AddCoordinateToNodeFileByClicking(bool turnOnNodeCreationByClicking)
        {
            if (turnOnNodeCreationByClicking)
            {
                Vector2 mousePos = Raylib.GetMousePosition();

                MouseButton leftClickButton = MouseButton.Left;
                MouseButton rightClickButton = MouseButton.Right;
               
                    if (Raylib.IsMouseButtonPressed(leftClickButton))
                    {
                        Console.WriteLine(mousePos);

                      //  File.AppendAllText("../../../../../NodeData/TXTData.txt", mousePos.ToString() + ": " + nodeIDIncrementor.ToString()+ "\n");
                     //   nodeIDIncrementor++;

                    }
                    if (Raylib.IsMouseButtonPressed(rightClickButton))
                    {
                      //  File.AppendAllText("../../../../../NodeData/TXTData.txt", "LANE END" + "\n");
                       
                    }                 
                    //Console.WriteLine(mousePos);
                
            }
        }
    }
}

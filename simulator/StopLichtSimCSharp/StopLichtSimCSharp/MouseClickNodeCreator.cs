using Raylib_cs;
using System.Numerics;

namespace StopLichtSimCSharp
{
    class MouseClickNodeCreator
    {
        public static void AddCoordinateToNodeFileByClicking()
        {
            Vector2 mousePos = Raylib.GetMousePosition();
            
            MouseButton leftClickButton = MouseButton.Left;
            MouseButton rightClickButton = MouseButton.Right;

            if (Raylib.IsMouseButtonPressed(leftClickButton))
            {
                Console.WriteLine(mousePos);

                File.AppendAllText("../../../../../NodeData/NodeData.txt", mousePos.ToString() + "\n");

            }
            if (Raylib.IsMouseButtonPressed(rightClickButton)) {
                File.AppendAllText("../../../../../NodeData/NodeData.txt", "LANE END" + "\n");

            }
            //Console.WriteLine(mousePos);
        }
    }
}

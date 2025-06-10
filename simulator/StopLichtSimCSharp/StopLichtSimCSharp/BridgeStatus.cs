using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StopLichtSimCSharp
{
    internal class BridgeStatus
    {
        public static bool currentstatus = false;
        public BridgeStatus() { }

        
        public static void ChangeBridgeStatus()
        {
            if (currentstatus == false) 
            {
                currentstatus = true;
            }
            else if (currentstatus == true) 
            {
                currentstatus = false;
            }
            //ZeroMqHandler.receivedMessage();
        }
    }
}

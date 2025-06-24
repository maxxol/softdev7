using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
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

        public static string buildJson()
        {
            var result = new Dictionary<string, Dictionary<string, bool>>();
            string status = "";
            if (currentstatus == false)
            {
                status = "dicht";
            }
            else if (currentstatus == true)
            {
                status = "open";
                //var result = new Dictionary<string, Dictionary<string, bool>>();
            }
            else
            {
                status = "onbekend";
            }

            string tosend = $"{{\n \"81.1\":{{\r\n    \"state\": \"{status}\"\r\n  }}\n}}";



            //string json = JsonConvert.SerializeObject(tosend, Formatting.Indented);
           // Console.WriteLine(tosend);
            return tosend;
        }
    }
}

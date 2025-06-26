using System;
using System.Threading;
using NetMQ;
using NetMQ.Sockets;
using System.Text.Json; // Make sure you have this using directive

namespace StopLichtSimCSharp
{
    class ZeroMqHandler
    {

        static string pubAdress = "tcp://10.121.17.214:5556"; //don't push your home wifi ip please thank you
        static string subAdress = "tcp://10.121.17.63:5555"; //don't push your home wifi ip please thank you


        private static PublisherSocket _sensorPublisher;

        public static void StartSensorPub()
        {
            if (_sensorPublisher != null) return;

                _sensorPublisher = new PublisherSocket();
                _sensorPublisher.Bind(pubAdress);
                Console.WriteLine("Publisher started.");
        }

        public static void PublishSensorData(string roadmessage, string bridgemessage, string specialmessage)
        {
            if (_sensorPublisher == null)
            {
                throw new InvalidOperationException("Publisher not started. Call Start() first.");
            }

            _sensorPublisher.SendMoreFrame("sensoren_rijbaan").SendFrame(roadmessage);
            _sensorPublisher.SendMoreFrame("sensoren_bruggen").SendFrame(bridgemessage);
            _sensorPublisher.SendMoreFrame("sensoren_speciaal").SendFrame(specialmessage);

            //Console.WriteLine($"Published: {message}");
        }

        public static void PublishPriorityVehicle(string priorityvehicle)
        {
            if (_sensorPublisher == null)
            { 
                throw new InvalidOperationException("Publisher not started.Call Start() first.");            
            }

            _sensorPublisher.SendMoreFrame("voorrangsvoertuig").SendFrame(priorityvehicle);
        }

        public static void PublishTimeData(int frame)
        {
            if (_sensorPublisher == null)
            {
                throw new InvalidOperationException("Publisher not started. Call Start() first.");
            }

            //long currentTimeMs = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            var payload = new
            {
                simulatie_tijd_ms = frame * 100
            };

            string jsonMessage = JsonSerializer.Serialize(payload);

            _sensorPublisher.SendMoreFrame("tijd").SendFrame(jsonMessage);
                //Console.WriteLine(jsonMessage);
            //Console.WriteLine($"Published: {jsonMessage}");
        }


        public static void StopSensorPub()
        {
            if (_sensorPublisher != null)
            {
                _sensorPublisher.Dispose();
                _sensorPublisher = null;
                Console.WriteLine("Publisher stopped.");
            }
        }

        
        private static SubscriberSocket _stoplichtSubscriber;

        public static void StartStoplichtSub()
        {
            if (_stoplichtSubscriber != null) return;

                _stoplichtSubscriber = new SubscriberSocket();
                _stoplichtSubscriber.Connect(subAdress);
                _stoplichtSubscriber.Subscribe("");

            Console.WriteLine("Stoplichten subscriber started.");
        }


        public static void StopStoplichtSub()
        {
            if (_stoplichtSubscriber != null)
            {
                _stoplichtSubscriber.Dispose();
                _stoplichtSubscriber = null;
                Console.WriteLine("Stoplichten subscriber stopped.");
            }
        }

        public static string topic = "";
        public static string receivedMessage = "";
        public static void ListenLoop()
        {
            var poller = new NetMQPoller { _stoplichtSubscriber };

            _stoplichtSubscriber.ReceiveReady += (s, a) =>
            {
                try
                {
                    topic = a.Socket.ReceiveFrameString();
                    receivedMessage = a.Socket.ReceiveFrameString();
                    //Console.WriteLine($"Received: {topic} - {receivedMessage}");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error receiving message: {ex.Message}");
                }
            };

            Console.WriteLine("Starting subscriber poller...");
            poller.Run();
        }

    }

}

    


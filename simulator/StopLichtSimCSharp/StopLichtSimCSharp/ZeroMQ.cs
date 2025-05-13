using System;
using System.Threading;
using NetMQ;
using NetMQ.Sockets;

namespace StopLichtSimCSharp
{
    class ZeroMqHandler
    {

        static string communicationIPAddress = "tcp://localhost:5555"; //don't push your home wifi ip please thank you


        private static PublisherSocket _sensorPublisher;

        public static void StartSensorPub()
        {
            if (_sensorPublisher != null) return;

            _sensorPublisher = new PublisherSocket();
            _sensorPublisher.Bind(communicationIPAddress);
            Console.WriteLine("Publisher started.");
        }

        public static void PublishSensorData(string message)
        {
            if (_sensorPublisher == null)
            {
                throw new InvalidOperationException("Publisher not started. Call Start() first.");
            }

            _sensorPublisher.SendMoreFrame("sensor").SendFrame(message);
            //Console.WriteLine($"Published: {message}");
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
            _stoplichtSubscriber.Connect(communicationIPAddress);
            _stoplichtSubscriber.Subscribe("sensor");

            Console.WriteLine("Stoplichten subscriber started.");
        }

        public static void ListenStoplichtSub()
        {
            if (_stoplichtSubscriber == null)
            {
                throw new InvalidOperationException("Subscriber not started. Call Start() first.");
            }
                
            string topic = _stoplichtSubscriber.ReceiveFrameString();
            string message = _stoplichtSubscriber.ReceiveFrameString();

            Console.WriteLine($"Received: {topic} - {message}");
                
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
    }

}

    


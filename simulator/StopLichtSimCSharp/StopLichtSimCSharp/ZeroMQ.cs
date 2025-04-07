using System;
using System.Security.Policy;
using NetMQ;
using NetMQ.Sockets;




namespace StopLichtSimCSharp
{
    class ZeroMqHandler
    {
        var publisher = new PublisherSocket();
        public static void PublishSensorData()
        {
            Console.WriteLine("Starting the publisher...");

            using (Publisher)
            {
                publisher.Bind("tcp://localhost:5556"); // Publisher binds to a port

                // Send a single message with a topic and a message
                string message = "SensorData 1"; // Example message
                publisher.SendMoreFrame("sensor")  // Topic
                           .SendFrame(message);    // Message

                Console.WriteLine($"Published: {message}");
            }
        }




        public static void SubscribeToSensorData()
        {
            Console.WriteLine("Starting the subscriber...");

            using (var subscriber = new SubscriberSocket())
            {
                subscriber.Connect("tcp://localhost:5556");  // Connect to the publisher's address
                subscriber.Subscribe("sensor");  // Subscribe to the "sensor" topic

                // Try to receive a message with a timeout (e.g., 1000ms = 1 second)
                string topic;
                string message;

                if (subscriber.TryReceiveFrameString(TimeSpan.FromMilliseconds(1000), out topic))
                {
                    message = subscriber.ReceiveFrameString();
                    Console.WriteLine($"Received: {topic} - {message}");
                }
                else
                {
                    Console.WriteLine("No message received within timeout.");
                }
            }
        }
    }
}

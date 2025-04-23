# This is a sample Python script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.
import sys
import zmq



context = zmq.Context()

#  Socket to talk to server
print("Connecting to hello world server…")
# if len(sys.argv) < 2:
#         print('usage: subscriber <connect_to> [topic topic ...]')
#         sys.exit(1)

topics = sys.argv[2:]
socket = context.socket(zmq.SUB)
socket.connect("tcp://10.121.17.89:5556")
socketlist = ["sensoren_bruggen", "sensoren_rijbaan", "sensoren_speciaal", "stoplichten", "tijd", "voorrangsvoertuig"]
for topic in socketlist:
    socket.subscribe(topic)
#socket.subscribe("sensoren_bruggen")
if not topics:
    print("Receiving messages on all topics")
    socket.setsockopt(zmq.SUBSCRIBE, b'')
else:
    print(f"Receiving messages on topics: {topics} ...")
    for t  in topics:
        socket.setsockopt(zmq.SUBSCRIBE, t.encode('utf-8'))
    #t.match("81","dicht")
#  Do 10 requests, waiting each time for a response
try:
    while True:
        print("Sending request %s …")
        #  Get the reply.
        topic,msg = socket.recv_multipart()
        print(
            '   Topic: {}, msg:{}'.format(
                topic.decode('utf-8'), msg.decode('utf-8')
            )
        )
except KeyboardInterrupt:
    pass
print ("Klaar")
    #print("Received reply %s [ ]" % (message))
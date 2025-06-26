import argparse
import json
from datetime import datetime

import zmq

from handle_validation import validate_topic
from handle_validation_errors import (
    print_topic_errors,
    print_topic_sensoren_id_errors,
    print_topic_sensoren_bruggen_errors,
    print_topic_voorrangsvoertuig_errors
)

SCHEMA_FILE_PATHS = {
    "tijd": "./schemas/tijd.json",
    "sensoren_rijbaan": "./schemas/sensoren_rijbaan.json",
    "sensoren_speciaal": "./schemas/sensoren_speciaal.json",
    "voorrangsvoertuig": "./schemas/voorrangsvoertuig.json",
    "sensoren_bruggen": "./schemas/sensoren_bruggen.json",
    "stoplichten": "./schemas/stoplichten.json"
}


def get_argument_parser():
    """
    Setup and get parsed args from ArgumentParser
    :returns vars with parsed args, ArgumentParser
    """
    new_parser = argparse.ArgumentParser()
    new_parser.add_argument(
        "--do-local-mode",
        help="Enable local mode (default: test mode)",
        action="store_true"
    )
    new_parser.add_argument(
        "--sim-host-id",
        help="Host id of the simulator, required when using '--do-local-mode'=false, required to be different to '--con-host-id'",
        required=False
    )
    new_parser.add_argument(
        "--con-host-id",
        help="Host id of the controller, required when using '--do-local-mode'=false, required to be different to '--sim-host-id'",
        required=False
    )
    new_parser.add_argument(
        "--sim-port-number",
        help="Port number of the simulator, required to be different to '--con-port-number', when '--do-local-mode'=true",
        required=False,
        default="5556",
        type=int
    )
    new_parser.add_argument(
        "--con-port-number",
        help="Port number of the simulator, required to be different to '--sim-port-number', when '--do-local-mode'=true",
        required=False,
        default="5555",
        type=int
    )
    return vars(new_parser.parse_args()), new_parser


def setup_socket(tcp_ip_address:str, topic_set:set, context=zmq.Context()):
    """
    Setup ZeroMQ sockets listening to address: tcp_ip_address on all topics in topic_set,
        supports using an existing context.
    :returns the setup socket
    """
    socket = context.socket(zmq.SUB)
    socket.connect(tcp_ip_address)
    print(f"Listening for messages on ip: {tcp_ip_address}")
    for topic in topic_set:
        socket.subscribe(topic)
    if not topic_set:
        print("Receiving messages on all topics")
        socket.setsockopt(zmq.SUBSCRIBE, b'')
    else:
        print(f"Receiving messages on topics: {topic_set} ...")
        for t in topic_set:
            socket.setsockopt(zmq.SUBSCRIBE, t.encode('utf-8'))
    return socket


def main():
    """
    Parse arguments, prepare sockets and start receiving multipart messages from both the controller and simulator.
    """
    (args, parser) = get_argument_parser()
    do_local_mode = bool(args["do_local_mode"])
    sim_host_id = args["sim_host_id"]
    con_host_id = args["con_host_id"]
    sim_port_number = args["sim_port_number"]
    con_port_number = args["con_port_number"]

    if do_local_mode:
        if sim_port_number == con_port_number:
            parser.print_help()
            raise Exception("While '--do-local-mode'=true, the --sim-port-number cannot be the same as the --con-port-number")

    sim_ip = f"tcp://127.0.0.1:{sim_port_number}" if do_local_mode else f"tcp://10.121.17.{sim_host_id}:5556"
    con_ip = f"tcp://127.0.0.1:{con_port_number}" if do_local_mode else f"tcp://10.121.17.{con_host_id}:5555"

    sim_socket = setup_socket(sim_ip, {"tijd", "sensoren_rijbaan", "sensoren_speciaal", "sensoren_bruggen", "voorrangsvoertuig"})
    con_socket = setup_socket(con_ip, {"stoplichten"})
    poller = zmq.Poller()
    poller.register(sim_socket, zmq.POLLIN)
    poller.register(con_socket, zmq.POLLIN)

    log_file = open(f"logs/log_{datetime.now().strftime('%Y%m%d-%H%M%S')}.txt", "x")

    try:
        while True:
            socks = dict(poller.poll())
            sim_topic_encoded, sim_msg_encoded = sim_socket.recv_multipart()
            print("Here")
            if sim_socket in socks:
                sim_topic_encoded, sim_msg_encoded = sim_socket.recv_multipart()
                sim_topic = sim_topic_encoded.decode("utf-8")
                sim_msg_object = sim_msg_encoded.decode("utf-8")
                match sim_topic:
                    case "tijd":
                        print_function = print_topic_errors
                    case "sensoren_speciaal":
                        print_function = print_topic_errors
                    case "sensoren_rijbaan":
                        print_function = print_topic_sensoren_id_errors
                    case "sensoren_bruggen":
                        print_function = print_topic_sensoren_bruggen_errors
                    case "voorrangsvoertuig":
                        print_function = print_topic_voorrangsvoertuig_errors
                    case _:
                        print_function = print_topic_errors

                log_file.write(f"received topic '{sim_topic}', from the simulator at: {datetime.now().strftime('%Y-%m-%d - %H:%M:%S.%f')[:-3]}\n")
                log_file.flush()
                try:
                    validate_topic(
                        SCHEMA_FILE_PATHS[sim_topic],
                        json.loads(sim_msg_object),
                        print_function,
                        sim_topic
                    )
                except:
                    print(f"Incorrect json formatting on topic '{sim_topic}'")
            if con_socket in socks:
                con_topic_encoded, con_msg_encoded = con_socket.recv_multipart()
                con_topic = con_topic_encoded.decode("utf-8")
                con_msg_object = con_msg_encoded.decode("utf-8")

                print_function = print_topic_sensoren_id_errors
                try:
                    validate_topic(
                        SCHEMA_FILE_PATHS[con_topic],
                        json.loads(con_msg_object),
                        print_function,
                        con_topic
                    )
                except:
                    print(f"Incorrect json formatting on topic '{con_topic}'")
                log_file.write(
                    f"received topic '{con_topic}', from the controller at: {datetime.now().strftime('%Y-%m-%d - %H:%M:%S.%f')[:-3]}\n"
                )
                log_file.flush()
    except KeyboardInterrupt:
        pass
    print("Klaar")
    log_file.close()


if __name__ == '__main__':
    main()
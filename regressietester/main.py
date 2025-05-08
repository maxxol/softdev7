import argparse
import json
import zmq

from handle_validation import validate_topic
from handle_validation_errors import (
    print_topic_errors,
    print_topic_sensoren_id_errors,
    print_topic_sensor_bruggen_errors,
    print_topic_voorrangsvoertuig_errors
)

SCHEMA_FILE_PATHS = {
    "tijd": "./schemas/tijd.json",
    "sensoren_rijbaan": "./schemas/sensoren_rijbaan.json",
    "sensoren_speciaal": "./schemas/sensoren_speciaal.json",
    "voorrangsvoertuig": "./schemas/voorrangsvoertuig.json",
    "sensor_bruggen": "./schemas/sensor_bruggen.json",
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
    else:
        if sim_host_id == con_host_id:
            parser.print_help()
            raise Exception("While '--do-local-mode'=false, the --sim-host-id cannot be the same as the --con-host-id")

    sim_ip = f"tcp://127.0.0.1:{sim_port_number}" if do_local_mode else f"tcp://10.121.17.{sim_host_id}:5556"
    con_ip = f"tcp://127.0.0.1:{con_port_number}" if do_local_mode else f"tcp://10.121.17.{con_host_id}:5556"

    sim_socket = setup_socket(sim_ip, {"tijd", "sensoren_rijbaan", "sensoren_speciaal", "sensoren_bruggen", "voorrangsvoertuig"})
    con_socket = setup_socket(con_ip, {"stoplichten"})

    try:
        while True:
            sim_topic_encoded, sim_msg_encoded = sim_socket.recv_multipart()
            sim_topic = sim_topic_encoded.decode("utf-8")
            sim_msg_object = sim_msg_encoded.decode("utf-8")

            match sim_topic:
                case "tijd" | "sensoren_speciaal":
                    print_function = print_topic_errors
                case "sensoren_rijbaan":
                    print_function = print_topic_sensoren_id_errors
                case "sensoren_bruggen":
                    print_function = print_topic_sensor_bruggen_errors
                case "voorrangsvoertuig":
                    print_function = print_topic_voorrangsvoertuig_errors
                case _:
                    print_function = print_topic_errors

            con_topic_encoded, con_msg_encoded = con_socket.recv_multipart()
            con_topic = con_topic_encoded.decode("utf-8")
            con_msg_object = con_msg_encoded.decode("utf-8")

            validate_topic(
                SCHEMA_FILE_PATHS[sim_topic],
                json.loads(sim_msg_object),
                print_function,
                sim_topic
            )
            if con_topic:
                print_function = print_topic_sensoren_id_errors
                validate_topic(
                    SCHEMA_FILE_PATHS[con_topic],
                    json.loads(con_msg_object),
                    print_function,
                    con_topic
                )
    except KeyboardInterrupt:
        pass
    print("Klaar")


if __name__ == '__main__':
    main()

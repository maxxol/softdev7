/**
 * Entry file for the controller component in the traffic simulator.
 * @version 1.0.0
 * @author Willem Daniel Visser
 */
require('dotenv').config();
const validate_env_data = require("./src/validate_env_data");
const { getSockPub } = require("./src/sockets_setup");
const handleTrafficLightUpdate2 = require("./src/handle_traffic_light_update");
const subscription = require('./src/subscription');
const SensorDataContainer = require("./src/sensor_data_container")


const validSensorsSchema = require("./config/topic_schemas/valid_sensors.json")
const sensorRijbaanSchema = require("./config/topic_schemas/sensor_rijbaan.json")
const sensorSpeciaalSchema = require("./config/topic_schemas/sensor_speciaal.json")
const priorityVehicleSchema = require("./config/topic_schemas/voorrangsvoertuig.json");
const sensorBridgeSchema = require("./config/topic_schemas/sensor_bruggen.json")
const timeSchema = require("./config/topic_schemas/tijd.json")
let trafficLightStatus = require("./config/misc/trafficlight_status_initial.json");
const roadwaySensorStatus = require("./config/misc/roadway_sensor_status_initial.json");


validate_env_data.checkPorts()

async function main() {
    const socketPub = await getSockPub(process.env.PUB_PORT);
    const roadwayDataContainer = new SensorDataContainer(sensorRijbaanSchema);
    const specialDataContainer = new SensorDataContainer(sensorSpeciaalSchema);
    const priorityVehicleDataContainer = new SensorDataContainer(priorityVehicleSchema, validSensorsSchema);
    const bridgeDataContainer = new SensorDataContainer(sensorBridgeSchema);
    const timeContainer = new SensorDataContainer(timeSchema);
    
    roadwayDataContainer.updateStatus(roadwaySensorStatus);
    specialDataContainer.updateStatus({
        "brug_wegdek": false,
        "brug_water": false,
        "brug_file": false 
    });
    priorityVehicleDataContainer.updateStatus({
        queue: [],
    });
    bridgeDataContainer.updateStatus({
        "81": { state: "closed" },
    });
    timeContainer.updateStatus({
        simulatie_tijd_ms: 0
    })
    
    socketPub.send(["", "Controller connected"]);
    const containers = [roadwayDataContainer, specialDataContainer, priorityVehicleDataContainer, bridgeDataContainer, timeContainer]
    Promise.all([
        handleTrafficLightUpdate2.updateTrafficLights(containers, trafficLightStatus, socketPub),
        subscription.handleSubscription(roadwayDataContainer, specialDataContainer, priorityVehicleDataContainer, bridgeDataContainer, timeContainer)
    ])
}


main()
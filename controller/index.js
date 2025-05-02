/**
 * Entry file for the controller component in the traffic simulator.
 * @version 1.0.0
 * @author Willem Daniel Visser
 */
require('dotenv').config();
const validate_env_data = require("./src/validate_env_data");
const { getSockPub, getSockSub } = require("./src/sockets_setup");
// const { updateTrafficLightStatus } = require("./src/handling_sensor_information");
const { handleTrafficLightUpdate } = require("./src/handle_traffic_light_update");
const subscription = require('./src/subscription');
const SensorDataContainer = require("./src/sensor_data_container")
const { totalCrossingIdSet } = require('./src/utils');


const validSensorsSchema = require("./config/topic_schemas/valid_sensors.json")
const sensorRijbaanSchema = require("./config/topic_schemas/sensor_rijbaan.json")
const sensorSpeciaalSchema = require("./config/topic_schemas/sensor_speciaal.json")
const priorityVehicleSchema = require("./config/topic_schemas/voorrangsvoertuig.json");
const sensorBridgeSchema = require("./config/topic_schemas/sensor_bruggen.json")
let trafficLightStatus = require("./config/misc/trafficlight_status_initial.json");


validate_env_data.checkPorts()

async function main() {

    const socketPub = await getSockPub(process.env.PUB_PORT)
    const passBoats = { isReady: false}; // isReady is set to true when a boat is detected on the sensor and the timer has expired
    let Ncyclus = 1;
    let doLetPriorityVehicleTrough = false;
    
    const roadwayDataContainer = new SensorDataContainer(sensorRijbaanSchema);
    const specialDataContainer = new SensorDataContainer(sensorSpeciaalSchema);
    const priorityVehicleDataContainer = new SensorDataContainer(priorityVehicleSchema, validSensorsSchema);
    const bridgeDataContainer = new SensorDataContainer(sensorBridgeSchema);
    
    roadwayDataContainer.updateStatus({});
    specialDataContainer.updateStatus({
        "brug_wegdek": false,
        "brug_water": false,
        "brug_file": false 
    });
    priorityVehicleDataContainer.updateStatus({
        queue: [],
    });
    bridgeDataContainer.updateStatus({
        "81.1": { state: "closed" },
    });
    
    const simulatorStatus = {
        roadway: roadwayDataContainer.status,
        special: specialDataContainer.status,
        priority_vehicle: priorityVehicleDataContainer.status,
        bridge: bridgeDataContainer.status,
    }
    socketPub.send(["", "Controller connected"]);

    setInterval(() => {

        // updateTrafficLightStatus(
        //     trafficLightStatus,
        //     roadwayDataContainer.status,
        //     specialDataContainer.status,
        //     priorityVehicleDataContainer.status,
        //     bridgeDataContainer.status,
        //     Ncyclus,
        //     passBoats
        // );
        Ncyclus = handleTrafficLightUpdate(simulatorStatus, trafficLightStatus, Ncyclus, passBoats)
        socketPub.send(["stoplichten", JSON.stringify(trafficLightStatus)]);
        // Ncyclus++;
    }, process.env.DEFAULT_CYCLE_MS || 9000);
    subscription.handleSubscription(passBoats, roadwayDataContainer, specialDataContainer, priorityVehicleDataContainer, bridgeDataContainer)

}
main()






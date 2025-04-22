/**
 * Entry file for the controller component in the traffic simulator.
 * @version 1.0.0
 * @author Willem Daniel Visser
 */
require('dotenv').config();
const validate_env_data = require("./src/validate_env_data");
const { getSockPub, getSockSub } = require("./src/sockets_setup");
const { handleTrafficLightModification } = require("./src/handling_sensor_information");
const subscription = require('./src/subscription');
const SensorDataContainer = require("./src/sensor_data_container")

const validSensorsSchema = require("./config/topic_schemas/valid_sensors.json")
const sensorRijbaanSchema = require("./config/topic_schemas/sensor_rijbaan.json")
const sensorSpeciaalSchema = require("./config/topic_schemas/sensor_speciaal.json")
const priorityVehicleSchema = require("./config/topic_schemas/voorrangsvoertuig.json");
const sensorBridgeSchema = require("./config/topic_schemas/sensor_bruggen.json")


validate_env_data.checkPorts()

let trafficLightCycleInterval;
let trafficLightStatus = {
    "1.1": "rood",
    "2.1": "rood",
    "2.2": "rood",
    "3.1": "rood",
    "3.6": "rood",
    "4.1": "rood",
    "5.1": "rood",
    "6.1": "rood",
    "7.1": "rood",
    "8.1": "rood",
    "8.2": "rood",
    "9.1": "rood",
    "10.1": "rood",
    "11.1": "rood",
    "12.1": "rood",
    "21.1": "rood",
    "22.1": "rood",
    "24.1": "rood",
    "25.1": "rood",
    "26.1": "rood",
    "27.1": "rood",
    "28.1": "rood",
    "31.1": "rood",
    "31.2": "rood",
    "32.1": "rood",
    "32.2": "rood",
    "33.1": "rood",
    "33.2": "rood",
    "34.1": "rood",
    "34.2": "rood",
    "35.1": "rood",
    "35.2": "rood",
    "36.1": "rood",
    "37.1": "rood",
    "37.2": "rood",
    "38.1": "rood",
    "38.2": "rood",
    "41.1": "rood",
    "42.1": "rood",
    "51.1": "rood",
    "52.1": "rood",
    "53.1": "rood",
    "54.1": "rood",
    "71.1": "rood",
    "72.1": "rood"
};
exports.trafficLightStatus = trafficLightStatus;

async function main() {
    const sockPub = await getSockPub(process.env.PUB_PORT)
    sockPub.send(["", "Controller connected"]);
    const passBoats = { isReady: false}; // isReady is set to true when a boat is detected on the sensor and the timer has expired
    let Ncyclus = 1, doLetPriorityVehicleTrough = false;

    const roadwayDataContainer = new SensorDataContainer(sensorRijbaanSchema);
    const specialDataContainer = new SensorDataContainer(sensorSpeciaalSchema);
    const priorityVehicleDataContainer = new SensorDataContainer(priorityVehicleSchema, validSensorsSchema);
    const bridgeDataContainer = new SensorDataContainer(sensorBridgeSchema);

    [roadwayDataContainer, specialDataContainer, priorityVehicleDataContainer, bridgeDataContainer].forEach(container => container.updateStatus({}));

    trafficLightCycleInterval = setInterval(() => {
        trafficLightStatus = handleTrafficLightModification(
            { ...trafficLightStatus },
            roadwayDataContainer.status,
            Ncyclus,
            passBoats,
            specialDataContainer.status?.brug_file,
            priorityVehicleDataContainer.status,
            bridgeDataContainer.status
        );
        sockPub.send(["stoplichten", JSON.stringify(trafficLightStatus)]);
        Ncyclus++;
    }, process.env.DEFAULT_CYCLE_MS || 9000);

    const sockSub = getSockSub(process.env.SUB_PORT);
    sockSub.subscribe("");
    // TO FIX: promise never resolves
    await subscription.handleSubscription(sockSub, sockPub, passBoats, doLetPriorityVehicleTrough, roadwayDataContainer, specialDataContainer, priorityVehicleDataContainer, bridgeDataContainer)
        // .then(({ passBoats: updatedPassBoats, doLetPriorityVehicleTrough: updatedPriority }) => {
            // passBoats = updatedPassBoats;
            // doLetPriorityVehicleTrough = updatedPriority;
        // });


}
main()






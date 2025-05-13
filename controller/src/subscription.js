/**
 * This file is intended to hande subscription to all the simulators messages.
 * @author Willem Daniel Visser
 * @version 1.0.0
 */
const {getSockSub} = require("./sockets_setup");
const {
    onSensorsRoadWay,
} = require("./utils");
const SensorDataContainer = require("./sensor_data_container");



/**
 * 
 * @param {boolean} passBoats 
 * @param {boolean} doLetPriorityVehicleTrough 
 * @param {SensorDataContainer} roadwayDataContainer 
 * @param {SensorDataContainer} specialDataContainer 
 * @param {SensorDataContainer} priorityVehicleDataContainer 
 * @returns 
 */
async function handleSubscription(passBoats, roadwayDataContainer, specialDataContainer, priorityVehicleDataContainer, bridgeDataContainer) {
    const sockSub = getSockSub(process.env.SUB_PORT);
    // sockSub.subscribe("tijd");
    // sockSub.subscribe("sensoren_rijbaan");
    // sockSub.subscribe("sensoren_speciaal");
    // sockSub.subscribe("sensoren_bruggen");
    // sockSub.subscribe("voorrangsvoertuig");
    sockSub.subscribe("");
    let simulatorTimePassed = 0;
    let firstMessageRecieved = false;
    let boadTimer = null;
    for await (const [topic, data] of sockSub) {
        if (!firstMessageRecieved) {
            console.log("verbinding geaccepteerd");
        }
        firstMessageRecieved = true;
        const topicString = topic.toString();

        const dataObj = JSON.parse(data);
        // console.log(`recieved topic: ${topicString}`);

        switch (topicString) {
            case "sensoren_rijbaan":
                ({ boadTimer } = onSensorsRoadWay(dataObj, boadTimer, passBoats));
                roadwayDataContainer.updateStatus(dataObj);
                
                break;
            case "sensoren_speciaal":
                specialDataContainer.updateStatus(dataObj);
                break;
            case "sensoren_bruggen":
                bridgeDataContainer.updateStatus(dataObj);
                // maybe find a way to run this immediately
                break;
            case "voorrangsvoertuig":
                priorityVehicleDataContainer.updateStatus(dataObj);
                break;
            case "tijd":
                simulatorTimePassed = dataObj["simulatie_tijd_ms"];
                break;
            default:
                console.log(`remaining topic: ${topicString}`);
                console.log(`incomming data: ${data}`);
        }
    }
}

const subscription = {
    
    handleSubscription
}


module.exports = subscription
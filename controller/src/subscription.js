/**
 * This file is intended to hande subscription to all the simulators messages.
 * @author Willem Daniel Visser
 * @version 1.0.0
 */
const { getSockSub } = require("./sockets_setup");
const SensorDataContainer = require("./sensor_data_container");



/**
 * 
 * @param {boolean} doLetPriorityVehicleTrough 
 * @param {SensorDataContainer} roadwayDataContainer 
 * @param {SensorDataContainer} specialDataContainer 
 * @param {SensorDataContainer} priorityVehicleDataContainer 
 * @param {SensorDataContainer} timeContainer
 * @returns 
 */
async function handleSubscription(roadwayDataContainer, specialDataContainer, priorityVehicleDataContainer, bridgeDataContainer, timeContainer) {
    const sockSub = getSockSub(process.env.SUB_PORT);
    sockSub.subscribe("tijd");
    sockSub.subscribe("sensoren_rijbaan");
    sockSub.subscribe("sensoren_speciaal");
    sockSub.subscribe("sensoren_bruggen");
    sockSub.subscribe("voorrangsvoertuig");
    let firstMessageRecieved = false;
    for await (const [topic, data] of sockSub) {
        if (!firstMessageRecieved) {
            console.log("verbinding geaccepteerd");
        }
        firstMessageRecieved = true;
        const topicString = topic.toString();

        try {
            const dataObj = JSON.parse(data);
            switch (topicString) {
                case "sensoren_rijbaan":
                    roadwayDataContainer.updateStatus(dataObj);
                    break;
                case "sensoren_speciaal":
                    specialDataContainer.updateStatus(dataObj);
                    break;
                case "sensoren_bruggen":
                    bridgeDataContainer.updateStatus(dataObj);
                    break;
                case "voorrangsvoertuig":
                    priorityVehicleDataContainer.updateStatus(dataObj);
                    break;
                case "tijd":
                    timeContainer.updateStatus(dataObj)
                    break;
                default:
                    console.log(`recieved unknown topic: ${topicString}`);
                    console.log(`incomming related data: ${dataObj}`);
                    break;
            }
        } catch (error) {
            if (error instanceof SyntaxError) {
                console.log(`json-error: ${data}`);
                console.log(`On topic: ${topicString}`);
            } else {
                console.log(`error: ${error}`);
                console.log(`On topic: ${topicString}`);
            }
            continue;
        }

       
    }
}

const subscription = {
    handleSubscription
}


module.exports = subscription
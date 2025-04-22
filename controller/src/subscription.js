/**
 * This file is intended to hande subscription to all the simulators messages.
 * @author Willem Daniel Visser
 * @version 1.0.0
 */
const { Subscriber, Publisher } = require("zeromq");
const {getSockSub} = require("./sockets_setup");
const {
    shouldLetPriorityVehicleTrough,
    onSensorsRoadWay,
    bridgeIdSet, boatIdSet
} = require("./utils");
const { getTrafficLightStatusOnSensorBridgeUpdate } = require("./handling_sensor_information");
const SensorDataContainer = require("./sensor_data_container");
const { trafficLightStatus } = require("..");


/**
 * Logs message informing about the contents of a topic data package and the topic itself.
 * @param {string} topic topic from where information was sent
 * @param {object} publishedData data object that was sent
 */
function messagePublishedData(topic, publishedData) {
    console.log(
      "received a message related to:",
      topic,
      "containing message:",
      publishedData,
    )
}


// /**
//  * Subscribes to all topics that get published by the simulator.
//  * @param {CallableFunction} launchPublisher 
//  * @deprecated
//  */
// async function subscribeToAllSimulator(roadwayDataContainer, specialDataContainer, priorityVehicleDataContainer) {
//     let simulatorTimePassed = 0
//     let firstMessageRecieved = false

//     const sockSub = getSockSub(process.env.SUB_PORT)
//     // sockSub.subscribe("sensoren_rijbaan")
//     // sockSub.subscribe("sensoren_speciaal")
//     // sockSub.subscribe("tijd")
//     // sockSub.subscribe("voorrangsvoertuig")
//     sockSub.subscribe("")

//     for await (const [topic, data] of sockSub) {
//         if (!firstMessageRecieved) {
//             console.log("verbinding geaccepteerd");
//         }
//         firstMessageRecieved = true
//         const topicString = topic.toString()
//         console.log("testt");
        
//         try {
//             const dataObj = JSON.parse(data)
//             console.log(`recieved topic: ${topicString}`);
            
//             switch (topicString) {
//                 case "sensoren_rijbaan":
//                     roadwayDataContainer.updateStatus(dataObj)
//                     break;
//                 case "sensoren_speciaal":
//                     specialDataContainer.updateStatus(dataObj)
//                     break;
//                 case "voorrangsvoertuig":
//                     priorityVehicleDataContainer.updateStatus(dataObj)
//                     break;
//                 case "tijd":
//                     simulatorTimePassed = dataObj["simulatie_tijd_ms"]
//                     break;
//                 default:
//                     console.log(`topic: ${topicString}`);
//                     console.log(`ingekomen data: ${data}`);
//             }
//         } catch (e) {
//             if(e instanceof SyntaxError) {
//                 if(e.message.includes("in JSON at position")) {
//                     console.error(`Expected incomming data to be a JSON string, topic='${topic}', error message:`)
//                     console.error(e.message);
//                 } else {
//                     console.error(`Expected incomming data to have a different format, topic='${topic}', error message:`)
//                     console.error(e.message);
//                 }
//             } else {
//                 console.error("Something unexpected occurred:");
//                 console.error(e.message);
//             }
//         }
//         // launchPublisher(roadwayDataContainer, specialDataContainer, priorityVehicleDataContainer, simulatorTimePassed)
//     }
// }

/**
 * 
 * @param {Subscriber} sockSub 
 * @param {Publisher} sockPub 
 * @param {boolean} passBoats 
 * @param {boolean} doLetPriorityVehicleTrough 
 * @param {SensorDataContainer} roadwayDataContainer 
 * @param {SensorDataContainer} specialDataContainer 
 * @param {SensorDataContainer} priorityVehicleDataContainer 
 * @returns 
 */
async function handleSubscription(sockSub, sockPub, passBoats, doLetPriorityVehicleTrough, roadwayDataContainer, specialDataContainer, priorityVehicleDataContainer, bridgeDataContainer) {
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
                ({ passBoats, boadTimer } = onSensorsRoadWay(dataObj, boadTimer, passBoats));
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
                doLetPriorityVehicleTrough = shouldLetPriorityVehicleTrough(doLetPriorityVehicleTrough, dataObj);
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
    return { passBoats, doLetPriorityVehicleTrough };
}

const subscription = {
    
    handleSubscription
}


module.exports = subscription
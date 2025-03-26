/**
 * Entry file for the controller component in the traffic simulator.
 * @version 0.1
 * @author Willem Daniel Visser
 */

const {getSockPub, getSockSub} = require("./src/common_sockets")
const {handleTrafficLightModification} = require("./src/handling")
const intersectionData = require("./src/load_intersection_data");
let trafficLightStatus = {}
let sensorsRoadwayStatus = {}
let sensorsSpecialStatus = {}
let simulatorTimePassed = 0

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

/**
 * Updates the traffic light status and sends the new status on the given sockPub, with topic 'stoplichten'
 * @param {Promise<Subscriber>} sockPub ZeroMQ socket publisher
 */
async function trafficLightCycle(sockPub) {
    trafficLightStatus = handleTrafficLightModification(trafficLightStatus, sensorsRoadwayStatus, sensorsSpecialStatus, intersectionData)
    sockPub.send(["stoplichten", JSON.stringify(trafficLightStatus)]);
}

/**
 * Starts pub and sub sockets to be able to communicate with the simulator and inform the regression tester. 
 * * Publishes to: 'stoplichten'.
 * * Subscribes to: 'sensoren_rijbaan', 'sensoren_speciaal' and 'tijd'.
 */
async function startSockets() {
    let trafficLightCycleInterval
    const sockPub = await getSockPub(3001)
    const sockSub = await getSockSub(3000)

    sockSub.subscribe("sensoren_rijbaan")
    sockSub.subscribe("sensoren_speciaal")
    sockSub.subscribe("tijd")
    sockSub.subscribe("voorrangsvoertuig")

    for await (const [topic, data] of sockSub) {
        const topicString = topic.toString()
        try {
            const dataObj = JSON.parse(data)
            messagePublishedData(topicString, dataObj)
            switch (topicString) {
                case "sensoren_rijbaan":
                    sensorsRoadwayStatus = dataObj
                    break;
                case "sensoren_speciaal":
                    sensorsSpecialStatus = dataObj
                    break;
                case "tijd":
                    simulatorTimePassed = dataObj["simulatie_tijd_ms"]
                    break;
            }
        } catch (e) {
            console.error("Expected incomming data to be a JSON string")
        }
        if(trafficLightCycleInterval == undefined) {
            trafficLightCycleInterval = setInterval(trafficLightCycle, 9000, sockPub)// Cycle every 9 seconds trough the regular traffic light program
        }
    }
}
startSockets()
/**
 * This file is intended to hande subscription to all the simulators messages.
 */
const {getSockSub} = require("./common_sockets")
const sensorsRoadwayStatus = require("./socket_data/sensors_roadway_status")


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
 * 
 * @param {CallableFunction} launchPublisher 
 */
async function subscribeToAllSimulator(launchPublisher) {
    let sensorsRoadwayStatusIncomming = {}
    let sensorsSpecialStatus = {}
    let simulatorTimePassed = 0
    const sockSub = await getSockSub(process.env.SUB_PORT)
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
                    
                    sensorsRoadwayStatusIncomming = dataObj
                    sensorsRoadwayStatus.set(sensorsRoadwayStatusIncomming)
                    break;
                case "sensoren_speciaal":
                    sensorsSpecialStatus = dataObj
                    break;
                case "tijd":
                    simulatorTimePassed = dataObj["simulatie_tijd_ms"]
                    break;
            }
        } catch (e) {
            if(e instanceof SyntaxError) {
                if(e.message.includes("in JSON at position")) {
                    console.error(`Expected incomming data to be a JSON string, topic='${topic}', error message:`)
                    // console.error(e.message);
                } else {
                    console.error(`Expected incomming data to have a different format, topic='${topic}', error message:`)
                    console.error(e.message);
                }
            } else {
                console.error("Something unexpected occurred:");
                console.error(e.message);
            }
        }
        launchPublisher(sensorsRoadwayStatusIncomming, sensorsSpecialStatus, simulatorTimePassed)
        
    }
}


const subscription = {
    subscribeToAllSimulator
}


module.exports = subscription
/**
 * This file is intended to hande subscription to all the simulators messages.
 * @author Willem Daniel Visser
 * @version 1.0.0
 */
const {getSockSub} = require("./sockets_setup");




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
 * Subscribes to all topics that get published by the simulator.
 * @param {CallableFunction} launchPublisher 
 */
async function subscribeToAllSimulator(launchPublisher) {
    let simulatorTimePassed = 0
    const roadwayDataContainer = new SensorDataContainer(sensorRijbaanSchema)
    const specialDataContainer = new SensorDataContainer(sensorSpeciaalSchema)
    const priorityVehicleDataContainer = new SensorDataContainer(priorityVehicleSchema, validSensorsSchema)

    const sockSub = await getSockSub(process.env.SUB_PORT)
    sockSub.subscribe("sensoren_rijbaan")
    sockSub.subscribe("sensoren_speciaal")
    sockSub.subscribe("tijd")
    sockSub.subscribe("voorrangsvoertuig")

    for await (const [topic, data] of sockSub) {
        const topicString = topic.toString()
        try {
            const dataObj = JSON.parse(data)
            // messagePublishedData(topicString, dataObj)
            switch (topicString) {
                case "sensoren_rijbaan":
                    roadwayDataContainer.updateStatus(dataObj)
                    break;
                case "sensoren_speciaal":
                    specialDataContainer.updateStatus(dataObj)
                    break;
                case "voorrangsvoertuig":
                    priorityVehicleDataContainer.updateStatus(dataObj)
                    break;
                case "tijd":
                    simulatorTimePassed = dataObj["simulatie_tijd_ms"]
                    break;
            }
        } catch (e) {
            if(e instanceof SyntaxError) {
                if(e.message.includes("in JSON at position")) {
                    console.error(`Expected incomming data to be a JSON string, topic='${topic}', error message:`)
                    console.error(e.message);
                } else {
                    console.error(`Expected incomming data to have a different format, topic='${topic}', error message:`)
                    console.error(e.message);
                }
            } else {
                console.error("Something unexpected occurred:");
                console.error(e.message);
            }
        }
        launchPublisher(roadwayDataContainer, specialDataContainer, priorityVehicleDataContainer, simulatorTimePassed)
    }
}


const subscription = {
    subscribeToAllSimulator
}


module.exports = subscription
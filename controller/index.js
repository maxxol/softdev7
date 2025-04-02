/**
 * Entry file for the controller component in the traffic simulator.
 * @version 0.1
 * @author Willem Daniel Visser
 */

require('dotenv').config();
const validate_env_data = require("./src/validate_env_data")
const {getSockPub} = require("./src/common_sockets")
const {handleTrafficLightModification} = require("./src/handling")
const intersectionData = require("./src/load_intersection_data");
const subscription = require('./src/subscription');
let trafficLightStatus = {}
let sensorsRoadwayStatus = {}
let sensorsSpecialStatus = {}

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
    const sockPub = await getSockPub(process.env.PUB_PORT)
    trafficLightCycleInterval = setInterval(trafficLightCycle, process.env.DEFAULT_CYCLE_MS, sockPub)
    subscription.subscribeToAllSimulator(
        () => {
            if(trafficLightCycleInterval == undefined) {
                trafficLightCycleInterval = setInterval(trafficLightCycle, process.env.DEFAULT_CYCLE_MS, sockPub)// Cycle every 9 seconds trough the regular traffic light program
            }
        }
    )
}
validate_env_data.checkPorts()
startSockets()
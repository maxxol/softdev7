/**
 * this file is responsible for updating the traffic lights based on the simulator data
 * @author Willem Daniël Visser
 */

const { updateBridge } = require("./bridge")
const { updateCrossing } = require("./crossing")
const SimulatorDataContainer = require("./sensor_data_container")
const { PASS_BOAT_STATES, crossingPedNOTIslandIdSet, TRAFFIC_LIGHT_COLORS } = require("./utils")


/**
 * update the traffic lights continuously based on the simulator data
 * @param {Array<SimulatorDataContainer>} containers containers with simulator data
* @param {object} trafficLightStatus
*/
async function updateTrafficLights(containers, trafficLightStatus, socketPub) {
    const passBoats = { isReady: PASS_BOAT_STATES.DEFAULT}
    let simulatorStatus
    let idQueue = []
    let greenSet = new Set()
    let stage = TRAFFIC_LIGHT_COLORS.RED
    let oldTime = 0
    while (true) {
        simulatorStatus = {
            roadway: containers[0].status,
            special: containers[1].status,
            priority_vehicle: containers[2].status,
            bridge: containers[3].status,
            time: containers[4].status
        }
        if(simulatorStatus) {
            ({ stage, greenSet, idQueue } = updateCrossing(simulatorStatus, trafficLightStatus, greenSet, stage, idQueue))
            updateBridge(simulatorStatus, trafficLightStatus, passBoats)
        }
        socketPub.send(["stoplichten", JSON.stringify(trafficLightStatus)])
        const sleepForMS = getAmountToSleepFor()
        await sleep(sleepForMS)
        const { simulatie_tijd_ms } = simulatorStatus.time
        oldTime = simulatie_tijd_ms ?? 0
    }


    /**
     * get the amount of time to sleep for based on the current stage of the traffic light
     * @returns {number} amount of time to sleep for
     */
    function getAmountToSleepFor() {
        let sleepForMS
        // pedestrians can walk these long scretces, give them additional time
        if (greenSet.has(crossingPedNOTIslandIdSet[0]) || greenSet.has(crossingPedNOTIslandIdSet[0])) {
            sleepForMS = 3600
        } else {
            sleepForMS = 3200
        }
        if (stage == TRAFFIC_LIGHT_COLORS.ORANGE) {}
        const { simulatie_tijd_ms } = simulatorStatus.time
        let timePenalty = 0
        if (simulatie_tijd_ms > sleepForMS)
            timePenalty = (simulatie_tijd_ms-oldTime)-sleepForMS
        if (timePenalty > 2500 && timePenalty < 5000) { // most likely lost connection
            sleepForMS = sleepForMS+timePenalty
        }
        return sleepForMS
    }
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
}


module.exports = {
    updateTrafficLights, updateBridge
}
/**
 * this file is responsible for updating the traffic lights based on the simulator data
 * @author Willem Daniël Visser
 */

const { updateBridge } = require("./bridge")
const { updateCrossing } = require("./crossing")
const SimulatorDataContainer = require("./sensor_data_container")
const { PASS_BOAT_STATES, ID_SETS, TRAFFIC_LIGHT_COLORS } = require("./utils")


/**
 * update the traffic lights continuously based on the simulator data
 * @param {Array<SimulatorDataContainer>} containers containers with simulator data
* @param {object} trafficLightStatus
*/
async function updateTrafficLights(containers, trafficLightStatus, socketPub) {
    const bridgeState = { state: PASS_BOAT_STATES.DEFAULT}
    let simulatorStatus
    let idQueue = []
    let greenSet = new Set()
    let stage = TRAFFIC_LIGHT_COLORS.RED
    let oldTime = 0
    let lastUpdate = {
        brug_wegdekTrue: null,
        brug_wegdekFalse: null,
        brug_waterFalse: null,
        brug_FileTrue: null
    }
    while (true) {
        simulatorStatus = {
            roadway: containers[0].status,
            special: containers[1].status,
            priority_vehicle: containers[2].status,
            bridge: containers[3].status,
            time: containers[4].status
        }
        setLastUpdate()
        if(simulatorStatus) {
            ({ stage, greenSet, idQueue } = updateCrossing(simulatorStatus, trafficLightStatus, greenSet, stage, idQueue, lastUpdate))
            updateBridge(simulatorStatus, trafficLightStatus, bridgeState, lastUpdate)
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
        if (greenSet.has(ID_SETS.crossing.pedNOTIsland[0]) || greenSet.has(ID_SETS.crossing.pedNOTIsland[0])) {
            sleepForMS = 3700
        } else {
            sleepForMS = 3300
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

    function setLastUpdate() {
        const { simulatie_tijd_ms } = simulatorStatus.time

        if(simulatorStatus.special.brug_wegdek) {
            if(lastUpdate.brug_wegdekTrue == null)
                lastUpdate.brug_wegdekTrue = simulatie_tijd_ms
            lastUpdate.brug_wegdekFalse = null
        } else {
            if(lastUpdate.brug_wegdekFalse == null) 
                lastUpdate.brug_wegdekFalse = simulatie_tijd_ms
            lastUpdate.brug_wegdekTrue = null
        }
        if(!simulatorStatus.special.brug_water) {
            if(lastUpdate.brug_waterFalse == null)
                lastUpdate.brug_waterFalse = simulatie_tijd_ms
        } else {
            lastUpdate.brug_waterFalse = null
        }
        if(simulatorStatus.special.brug_file) {
            if(lastUpdate.brug_FileTrue == null)
                lastUpdate.brug_FileTrue = simulatie_tijd_ms
        } else {
            lastUpdate.brug_FileTrue = null
        }
    }
}


module.exports = {
    updateTrafficLights, updateBridge
}
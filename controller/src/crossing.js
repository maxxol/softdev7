/**
 * @author Willem Daniël Visser
 * @description this file is responsible for updating the traffic lights on the crossing, based on the simulator data
 */

const { greenSetsEntries, green_sets, crossingIdSet, TRAFFIC_LIGHT_COLORS, crossingPedIslandIdSet, crossingPedNOTIslandIdSet, trafficGoingTobridgeIdSet } = require("./utils")

/**
 * 
 * @param {{
 *  roadway:{}, special:{brug_wegdek:boolean, brug_water:boolean, brug_file:boolean}, priority_vehicle:{queue:Array<{baan:string, simulatie_tijd_ms:number, prioriteit:number}>}, bridge:{"81":{"state":"dicht"|"open"}}, time:{simulatie_tijd_ms:number}
 * }} simulatorStatus 
 * @param {object} trafficLightStatus 
 * @param {Array<string>} greenSet 
 * @param {TRAFFIC_LIGHT_COLORS} stage 
 * @param {Array<string>} idQueue 
 * @returns {stage:TRAFFIC_LIGHT_COLORS, greenSet:Array<string>, idQueue:Array<string>}
 */
function updateCrossing(simulatorStatus, trafficLightStatus, greenSet, stage, idQueue) {
    if (stage == TRAFFIC_LIGHT_COLORS.RED) {
        onStageRed()
    } else if (stage == TRAFFIC_LIGHT_COLORS.GREEN) {
        onStageGreen()
        stage = TRAFFIC_LIGHT_COLORS.ORANGE
    } else {
        onStageOrange()
        stage = TRAFFIC_LIGHT_COLORS.RED
    }
    return {stage, greenSet, idQueue};


    /**
     * update the traffic lights based on stage "red"
     */
    function onStageRed() {
        const { queue } = simulatorStatus.priority_vehicle
        const isProrityVehicle = queue.length > 0
        // can we select a greenSet for the crossing, based on the idQueue
        let doSelectGreenSet = false
        // can we progress to the next stage, thus not freeze on stage red
        // this is the case when a priority vehicle with priority 1 is waiting to cross the crossing, we don't want to overwrite with a greenSet
        let doProgressStage = true

        if (isProrityVehicle) {
            for (const priorityVehicle of queue) {
                const isHeadingToBridge = ["41.1", "42.1"].includes(priorityVehicle.baan)
                // if the priority vehicle is heading to the bridge, we can select a greenSet for the crossing, based on the idQueue
                doSelectGreenSet = isHeadingToBridge
                if (priorityVehicle.prioriteit == 1) {
                    doProgressStage = isHeadingToBridge
                    const isBridgeClosed = simulatorStatus.bridge["81.1"].state === "dicht";
                    updateToPriorityVehicleOne(isHeadingToBridge, isBridgeClosed, priorityVehicle.baan)
                    // if we don't break here, a priority vehicle with priority 2 will potentially overwrite with doProgressStage = true
                    break;
                } else if (priorityVehicle.prioriteit == 2) {
                    doProgressStage = true
                    greenSet = selectGreenSet(priorityVehicle.baan)
                }
            }
        } else {
            doSelectGreenSet = true
        }
        if (doSelectGreenSet) {
            // "intellegent" greenSet selection, based on sensor-ids in idQueue
            const id = idQueue.shift()
            greenSet = selectGreenSet(id)
            idQueue = getUpdateIdQueue(idQueue)
        }
        // when priority vehicle 1 needs to drive over the crossing, we don't need to update the stage and use greenSet
        if (doProgressStage) { 
            updateLightsToGreenSet()
            stage = TRAFFIC_LIGHT_COLORS.GREEN
        }



        /**
         * select the green set based on the id
         * @param {string} id the green set should contain
         * @returns {Set<string>} greenSet
         */
        function selectGreenSet(id) {
            const entry = findGreenSetOnId(id)
            return new Set(entry ?? green_sets[1])
        }
        

        /**
         * filter the idQueue to remove the ids that are already in the greenSet, if needed, refill with ids that got their sensors triggered
         * @param {Array} idQueue that contains the ids that are yet to be put to green
         * @returns {Array} updated idQueue
         */
        function getUpdateIdQueue(idQueue) {
            let updatedIdQueue = idQueue.filter(id => !greenSet.has(id))

            if (updatedIdQueue.length == 0) {
                crossingIdSet.forEach(id => {
                   // if (simulatorStatus.roadway[id].voor == true) {
                        updatedIdQueue.push(id)
                   // }
                }})
            }
            return updatedIdQueue
        }


        /**
         * update the traffic lights to green based on the greenSet
         */
        function updateLightsToGreenSet() {
            greenSet.forEach(id=>{
                // if there is a file in front of the bridge, keep all traffic lights going to the bridge red
                if (simulatorStatus.special.brug_file && trafficGoingTobridgeIdSet.has(id))
                    trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.RED
                else 
                    trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.GREEN
            })
        }


        /**
         * update the traffic lights to accomondate to the priority vehicle with priority 1
         * @param {boolean} isHeadingToBridge if the priority vehicle is heading to the bridge
         * @param {boolean} isBridgeClosed if the bridge is closed
         */
        function updateToPriorityVehicleOne(isHeadingToBridge, isBridgeClosed, lane) {
            if (isHeadingToBridge) {
                if (isBridgeClosed) {
                    if (trafficLightStatus["61.1"] == TRAFFIC_LIGHT_COLORS.RED && lane == "41.1") {
                        trafficLightStatus["61.1"] = TRAFFIC_LIGHT_COLORS.GREEN
                    } else if (trafficLightStatus["62.1"] == TRAFFIC_LIGHT_COLORS.RED && lane == "42.1") {
                        trafficLightStatus["62.1"] = TRAFFIC_LIGHT_COLORS.GREEN
                    } else {
                        trafficLightStatus[lane] = TRAFFIC_LIGHT_COLORS.GREEN
                    }
                }
            } else {
                crossingIdSet.forEach(id => trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.RED)
                trafficLightStatus[lane] = TRAFFIC_LIGHT_COLORS.GREEN
            }
        }
    }

    function onStageOrange() {
        crossingIdSet.forEach(id => {
            trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.RED
        })
    }

    function onStageGreen() {
        greenSet.forEach(id => {
            // if there is a file in front of the bridge, keep all traffic lights going to the bridge red
            if (!(simulatorStatus.special.brug_file && trafficGoingTobridgeIdSet.has(id)))
                trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.ORANGE
            else
                trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.RED
        })
        // this gives pedestrians an opportunity to cross to the island(in the middle of the road)...
        crossingPedNOTIslandIdSet.forEach(id=> {
            if (trafficLightStatus[id] == TRAFFIC_LIGHT_COLORS.ORANGE)
                trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.GREEN
        })
        // ...but they will not be able to cross the entire road, so we leave, leaving the island available for the next time the pedestrian light turns green
        crossingPedIslandIdSet.forEach(id => {
            if (trafficLightStatus[id] == TRAFFIC_LIGHT_COLORS.ORANGE)
                trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.RED
        })
    }
}

function findGreenSetOnId(id) {
  const entry = greenSetsEntries.find(([_, set]) => set.includes(id))
  return entry?.[1] ?? green_sets[1]
}

module.exports = {
    updateCrossing
}
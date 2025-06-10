/**
 * @author Willem Daniël Visser
 * @description this file is responsible for updating the traffic lights on the crossing, based on the simulator data
 */

const { GREEN_SETS_ENTRIES, GREEN_SETS, ID_SETS, TRAFFIC_LIGHT_COLORS } = require("./utils")

const SENSOR_TRIGGER_PERSISTENCE_TIME = 10000
/**
 * 
 * @param {{
 *  roadway:{}, special:{brug_wegdek:boolean, brug_water:boolean, brug_file:boolean}, priority_vehicle:{queue:Array<{baan:string, simulatie_tijd_ms:number, prioriteit:number}>}, bridge:{"81":{"state":"dicht"|"open"}}, time:{simulatie_tijd_ms:number}
 * }} simulatorStatus 
 * @param {object} trafficLightStatus 
 * @param {Array<string>} greenSet 
 * @param {TRAFFIC_LIGHT_COLORS} stage 
 * @param {Array<string>} idQueue 
 * @param {{brug_wegdekTrue: number}} lastUpdate
 * @returns {stage:TRAFFIC_LIGHT_COLORS, greenSet:Array<string>, idQueue:Array<string>}
 */
function updateCrossing(simulatorStatus, trafficLightStatus, greenSet, stage, idQueue, lastUpdate) {
    const { simulatie_tijd_ms } = simulatorStatus.time
    
    let isTriggeredBrugSurfaceSensor
    if(lastUpdate.brug_wegdekTrue == null) 
        isTriggeredBrugSurfaceSensor = false
    else
        isTriggeredBrugSurfaceSensor = simulatie_tijd_ms - lastUpdate.brug_wegdekTrue >= SENSOR_TRIGGER_PERSISTENCE_TIME*3
    let isTriggeredBrugFileSensor
    if(lastUpdate.brug_FileTrue == null)
        isTriggeredBrugFileSensor = false
    else
        isTriggeredBrugFileSensor = simulatie_tijd_ms - lastUpdate.brug_FileTrue >= SENSOR_TRIGGER_PERSISTENCE_TIME
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
        ID_SETS.crossing.total.forEach(id => trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.RED)
        const { queue } = simulatorStatus.priority_vehicle
        const isProrityVehicle = queue.length > 0
        // can we select a greenSet for the crossing, based on the idQueue
        let doSelectGreenSet = true
        // can we progress to the next stage, thus not freeze on stage red
        // this is the case when a priority vehicle with priority 1 is waiting to cross the crossing, we don't want to overwrite with a greenSet
        let doProgressStage = true

        if (isProrityVehicle) {
            for (const priorityVehicle of queue) {
                const isHeadingToBridge = ["41.1", "42.1"].includes(priorityVehicle.baan)
                // if it is false, we cannot set it back to true. So priority vehicles later in the queue cannot overwrite
                if(doSelectGreenSet) {
                    // if the priority vehicle is heading to the bridge, we can select a greenSet for the crossing, based on the idQueue
                    doSelectGreenSet = isHeadingToBridge
                }
                // is the particular vehicle with prio 1, from the last 12 seconds
                if (priorityVehicle.prioriteit == 1 && simulatie_tijd_ms - priorityVehicle.simulatie_tijd_ms <= 12000) {
                    // if it is false, we cannot set it back to true. So priority vehicles later in the queue cannot overwrite
                    if(doProgressStage) {
                        // if the priority vehicle is heading to the bridge, we can progress to the green-stage
                        doProgressStage = isHeadingToBridge
                    }
                    updateToPriorityVehicleOne(isHeadingToBridge, priorityVehicle.baan)
                } else if (priorityVehicle.prioriteit == 2) {
                    greenSet = selectGreenSet(priorityVehicle.baan)
                }
            }
        }
        if (doSelectGreenSet) {
            let id = 1
            // the brug surface has been triggered for an extended period. Since the traffic heading east will always flow through, 
            // that means the traffic going west is likely stuck. The fix is assembling a custom greenSet with the relevant IDs. This might clear the road heading west to the crossing.
            if(isTriggeredBrugSurfaceSensor) {
                greenSet = new Set(["1.1", "2.1", "2.2", "3.1"])
            } else {
                // "intellegent" greenSet selection, based on sensor-ids in idQueue
                id = idQueue.shift()
                greenSet = selectGreenSet(id)
            }
        }
        // when priority vehicle 1 needs to drive over the crossing, we don't need to update the stage nor use greenSet
        if (doProgressStage) { 
            updateLightsToGreenSet()
            stage = TRAFFIC_LIGHT_COLORS.GREEN
        }
        // always update the id-queue
        idQueue = getUpdateIdQueue(idQueue)



        /**
         * select the green set based on the id
         * @param {string} id the green set should contain
         * @returns {Set<string>} greenSet
         */
        function selectGreenSet(id) {
            const entry = findGreenSetOnId(id)
            const newGreenSet = entry.filter(id=>!(isTriggeredBrugFileSensor && ID_SETS.crossing.carsHeadingToBridge.includes(id)))
            return new Set(newGreenSet ?? GREEN_SETS[1])
        }
        

        /**
         * filter the idQueue to remove the ids that are already in the greenSet, if needed, refill with ids that got their sensors triggered
         * @param {Array} idQueue that contains the ids that are yet to be put to green
         * @returns {Array} updated idQueue
         */
        function getUpdateIdQueue(idQueue) {
            let updatedIdQueue = idQueue.filter(id => !greenSet.has(id))
            // let updatedIdQueue = idQueue

            if (updatedIdQueue.length == 0) {
                
                ID_SETS.crossing.total.forEach(id => {
                    if (simulatorStatus.roadway[id].voor == true) {
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
                if (isTriggeredBrugFileSensor && ID_SETS.crossing.carsHeadingToBridge.includes(id))
                    trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.RED
                else {
                    trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.GREEN
                    //  idQueue.filter()
                }
            })
        }


        /**
         * update the traffic lights to accomondate to the priority vehicle with priority 1
         * @param {boolean} isHeadingToBridge if the priority vehicle is heading to the bridge
         */
        function updateToPriorityVehicleOne(isHeadingToBridge, lane) {
            if (!isHeadingToBridge) {
                idQueue = idQueue.filter(id=>id != lane)
                trafficLightStatus[lane] = TRAFFIC_LIGHT_COLORS.GREEN
            }
        }
    }

    /**
     * set trafficlights on the entire crossing to red
     */
    function onStageOrange() {
        ID_SETS.crossing.total.forEach(id => {
            trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.RED
        })
    }

    /**
     * set every trafficlight in greenset to orange, with exeptions
     */
    function onStageGreen() {
        greenSet.forEach(id => {
            // if there is a file in front of the bridge, keep all traffic lights going to the bridge red
            if (isTriggeredBrugFileSensor && ID_SETS.crossing.carsHeadingToBridge.includes(id))
                trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.RED
            else
                trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.ORANGE
        })
        // this gives pedestrians an opportunity to cross to the island(in the middle of the road)...
        ID_SETS.crossing.pedNOTIsland.forEach(id=> {
            if (trafficLightStatus[id] == TRAFFIC_LIGHT_COLORS.ORANGE)
                trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.GREEN
        })
        // ...but they will not be able to cross the entire road, so we leave, leaving the island available for the next time the pedestrian light turns green
        ID_SETS.crossing.pedIsland.forEach(id => {
            if (trafficLightStatus[id] == TRAFFIC_LIGHT_COLORS.ORANGE)
                trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.RED
        })
    }
}

function findGreenSetOnId(id) {
  const entry = GREEN_SETS_ENTRIES.find(([_, set]) => set.includes(id))
  return entry?.[1] ?? GREEN_SETS[1]
}

module.exports = {
    updateCrossing
}
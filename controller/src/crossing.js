const { greenSetsEntries, green_sets, crossingIdSet, TRAFFIC_LIGHT_COLORS, crossingPedIslandIdSet, crossingPedNOTIslandIdSet, trafficGoingTobridgeIdSet } = require("./utils")

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
    function onStageRed() {
        const { queue } = simulatorStatus.priority_vehicle
        let isPriorityOne = false
        if (queue?.length > 0) {
            isPriorityOne = updateTrafficLightsOnPriorityVehicle(queue)
        } else {
            // "intellegent" greenSet selection
            const id = idQueue.shift()
            greenSet = selectGreenSet(id)
            idQueue = getUpdateIdQueue(idQueue)
        }
        // when priority vehicle 1 is detected, we don't need to update the stage and use greenSet
        if (!isPriorityOne) { 
            updateLightsToGreenSet()
            stage = TRAFFIC_LIGHT_COLORS.GREEN
        }


        /**
         * update the traffic lights on "prioriteit" 1 and update the set of traffic lights on "prioriteit" 2
         * @param {Array} queue of priority vehicles
         * @returns {boolean} whether the priority vehicle is has "prioriteit" 1
         */
        function updateTrafficLightsOnPriorityVehicle(queue) {
            for (const priorityVehicle of queue) {
                switch (priorityVehicle.prioriteit) {
                case 1:
                    const isBridgeClosed = simulatorStatus.bridge["81"].state === "dicht";
                    updateTrafficLightsOnPriorityVehicleOne(isBridgeClosed, priorityVehicle.baan, trafficLightStatus);
                    return true;
                case 2:
                    greenSet = selectGreenSet(priorityVehicle.baan);
                    break;
                }
            }
            return false;

            
            /**
             * update the traffic lights depending on the lane the priority vehicle is on and whether the bridge is closed
             * @param {boolean} isBridgeClosed whether the bridge is closed or not
             * @param {string} lane the priority vehicle is heading to
             */
            function updateTrafficLightsOnPriorityVehicleOne(isBridgeClosed, lane) {
                const isHeadingToBridge = ["41.1", "42.1"].includes(lane)

                if (isHeadingToBridge) {
                    if (isBridgeClosed) {
                        if(trafficLightStatus["61.1"] == TRAFFIC_LIGHT_COLORS.RED && lane == "41.1") {
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
         * @returns {Array} idQueue
         */
        function getUpdateIdQueue(idQueue) {
            let updatedIdQueue = idQueue.filter(id => !greenSet.has(id))

            if (updatedIdQueue.length == 0) {
                crossingIdSet.forEach(id => {
                    if (simulatorStatus.roadway[id].voor == true) {
                        updatedIdQueue.push(id)
                    }
                })
            }
            return updatedIdQueue
        }


        function updateLightsToGreenSet() {
            greenSet.forEach(id=>{
                // if there is a file in front of the bridge, keep all traffic lights going to the bridge red
                if (!(simulatorStatus.special.brug_file && trafficGoingTobridgeIdSet.has(id)))
                    trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.GREEN
                else 
                    trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.RED
            })
        }
    }
    function onStageOrange() {
        greenSet.forEach(id => {
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
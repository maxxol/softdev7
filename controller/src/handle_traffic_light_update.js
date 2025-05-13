
const green_sets = require("../config/green_sets.json")
const { findSensorIdPriorityVehicle, bridgeIdSet, boatIdSet, trafficGoingTobridgeIdSet, crossingIdSet, crossingCarIdSet, crossingCyclerIdSet, crossingPedIslandIdSet,crossingPedNOTIslandIdSet } = require('./utils');


/**
 * 
 * @param {{
*  roadway: object,special: object,priority_vehicle: object,bridge: object
* }} simulatorStatus 
* @param {object} trafficLightStatus 
* @param {number} Ncyclus 
* @param {{ isReady: boolean }} passBoats 
*/
function handleTrafficLightUpdate(simulatorStatus, trafficLightStatus, Ncyclus=0, passBoats) {
    Ncyclus = updateCrossingLights(simulatorStatus, trafficLightStatus, Ncyclus)
    updateBridgeLights(simulatorStatus, trafficLightStatus, passBoats)
    return Ncyclus
}


/**
 * 
 * @param {{
 *  roadway: object,special: object,priority_vehicle: object,bridge: object
 * }} simulatorStatus 
 * @param {object} trafficLightStatus 
 * @param {number} Ncyclus 
 */
function updateCrossingLights(simulatorStatus, trafficLightStatus, Ncyclus) {
    priorityVehicleResult = handlePriorityVehicle(simulatorStatus, trafficLightStatus)
    if (priorityVehicleResult?.priorityLevel == 1) 
        return Ncyclus; // skip to next cycle to prevent the trafficlights from updating below
    if (priorityVehicleResult?.priorityLevel == 2) 
        Ncyclus = priorityVehicleResult?.newNcyclus // make vehicle with priority level 2 determine the next cycle number
    
    if(Ncyclus == 0) 
        return Ncyclus; // 0 means we're still waiting for the first cycle, everything should be the last trafficlight state
    const Nstage = ((Ncyclus - 1) % 15) + 1; // 5 is the number of green sets, 3 rounds per green set
    const Ngreenset = Math.ceil(Nstage / 3); // Ncyclus 1 & 2 = green set 1, Ncyclus 3 & 4 = green set 2, etc.
    const greenLightSet = green_sets[`${Ngreenset}`];
    if (Nstage % 3 != 0) { // 'oranje'- stage
        [...crossingCyclerIdSet, ...crossingPedIslandIdSet, ...crossingCarIdSet].forEach(id => { // keep island lights green
            if(trafficLightStatus[id] == "groen") {
                trafficLightStatus[id] = "oranje";
            }
        })
    } else { // 'groen'- stage
        crossingIdSet.forEach(id => {
            if(trafficLightStatus[id] == "oranje") {
                trafficLightStatus[id] = "rood";
            }
        })
        crossingPedNOTIslandIdSet.forEach(id => {
            trafficLightStatus[id] = "rood";
        })
        greenLightSet.forEach(id => {
            trafficLightStatus[id] = "groen"
        });
    }
    // if(N)
    // if (Nstage % 3 != 0) { // 'oranje'- stage
    //     [...crossingCyclerIdSet, ...crossingPedIslandIdSet, ...crossingCarIdSet].forEach(id => { // keep island lights green
    //         if(trafficLightStatus[id] == "groen") {
    //             trafficLightStatus[id] = "oranje";
    //         }
    //     })
    // } else { // 'groen'- stage
    //     crossingIdSet.forEach(id => {
    //         if(trafficLightStatus[id] == "oranje") {
    //             trafficLightStatus[id] = "rood";
    //         }
    //     })
    //     crossingPedNOTIslandIdSet.forEach(id => {
    //         trafficLightStatus[id] = "rood";
    //     })
    //     greenLightSet.forEach(id => {
    //         trafficLightStatus[id] = "groen"
    //     });
    // }
    return ++Ncyclus
}


/**
 * 
 * @param {{
 *  roadway: object,special: object,priority_vehicle: object,bridge: object
* }} simulatorStatus 
* @param {object} trafficLightStatus 
 */
function handlePriorityVehicle(simulatorStatus, trafficLightStatus) {
    const sensorIdPriorityVehicleLevel1 = findSensorIdPriorityVehicle(simulatorStatus.priority_vehicle, 1)
    const sensorIdPriorityVehicleLevel2 = findSensorIdPriorityVehicle(simulatorStatus.priority_vehicle, 2)
    if(sensorIdPriorityVehicleLevel1 != undefined) {
        setAllCrossingLightsToRed(trafficLightStatus);
        trafficLightStatus[sensorIdPriorityVehicleLevel1] = "groen"
        return {
            priorityLevel: 1,
        }
    } else if(sensorIdPriorityVehicleLevel2 != undefined) { // set the lights to red and the green set to green
        const greenSetId = Object.entries(green_sets).find(([_, set]) => set.includes(sensorIdPriorityVehicleLevel2))[0]
        if(greenSetId) {
            return {
                priorityLevel: 2,
                newNcyclus: greenSetId * 3 // because there are 3 rounds per green set
            }
        }
    }
}


/**
 * 
 * @param {{
*  roadway: object,special: object,priority_vehicle: object,bridge: object
* }} simulatorStatus 
* @param {object} trafficLightStatus 
* @param {{ isReady: boolean }} passBoats 
 */
function updateBridgeLights(simulatorStatus, trafficLightStatus, passBoats) {
    const sensorIdPriorityVehicleLevel1 = findSensorIdPriorityVehicle(simulatorStatus.priority_vehicle, 1)
    if (typeof simulatorStatus.bridge?.["81"]?.state != "string")         simulatorStatus.bridge = { "81": { state: "closed" } }; // default value for bridgeState
    if (simulatorStatus.roadway == undefined || simulatorStatus.roadway == null) {
        simulatorStatus.roadway = {[boatIdSet[0]]: {voor: false}, [boatIdSet[1]]: {voor: false}};
    } else if (typeof simulatorStatus.roadway?.[boatIdSet[0]]?.voor != "boolean") {
        simulatorStatus.roadway[boatIdSet[0]] = {voor: false};
    }
    if (typeof simulatorStatus.roadway?.[boatIdSet[1]]?.voor != "boolean")  simulatorStatus.roadway[boatIdSet[1]] = {voor: false};
    if (typeof passBoats?.isReady != "boolean")                             passBoats = { isReady: false }; // default value for passBoats

    let isBridgeOpen = (simulatorStatus.bridge["81"].state == "open");
    const isSensorTriggeredNorth = simulatorStatus.roadway[boatIdSet[0]].voor;
    const isSensorTriggeredSouth = simulatorStatus.roadway[boatIdSet[1]].voor;
    
    if (
        // if passBoats is not ready, do not bother setting related traffic lights)
        passBoats.isReady 
        && 
        // if a priority vehicle heads to the bridge, do not initiate the bridge opening
        !trafficGoingTobridgeIdSet.includes(sensorIdPriorityVehicleLevel1)
        ) {
        bridgeIdSet.forEach(trafficLight => {
            trafficLightStatus[trafficLight] = "rood";
        });
        if (!isBridgeOpen) { // if the bridge is closed, make sure all the boat traffic lights are red
            trafficLightStatus[boatIdSet[0]] = "rood";
            trafficLightStatus[boatIdSet[1]] = "rood";

            if(!simulatorStatus.special.brug_wegdek) { // UPDATE this to account for flikkering
                trafficLightStatus["81.1"] = "groen"; // tell bridge to open
                trafficLightStatus["61.1"] = "rood"; // tell barriers to close
                trafficLightStatus["62.1"] = "rood";
                trafficLightStatus["63.1"] = "rood";
                trafficLightStatus["64.1"] = "rood";
            }
        } else {
            if (isSensorTriggeredNorth) { // if the bridge is open and a boat is on the sensor-north, set the boat traffic lights in the north to green and south to red
                trafficLightStatus[boatIdSet[0]] = "groen";
                trafficLightStatus[boatIdSet[1]] = "rood";
            } else if (isSensorTriggeredSouth) { // if the bridge is open and a boat is only on the sensor south, set the boat traffic lights in the north to red and south to green
                trafficLightStatus[boatIdSet[0]] = "rood";
                trafficLightStatus[boatIdSet[1]] = "groen";
            } else if (!isSensorTriggeredNorth && !isSensorTriggeredSouth) { // if the bridge is open and no boat is on the sensor, set the boat traffic lights in the north and south to red
                trafficLightStatus[boatIdSet[0]] = "rood";
                trafficLightStatus[boatIdSet[1]] = "rood";
                passBoats.isReady = false; // reset the passBoats status                
                if(!simulatorStatus.special.brug_water) {
                    trafficLightStatus["81.1"] = "rood"; // tell bridge to close
                }
            }
            
        }
    } else {
        if (!isBridgeOpen) {
            trafficLightStatus["61.1"] = "groen"; // tell barriers to open
            trafficLightStatus["62.1"] = "groen";
            trafficLightStatus["63.1"] = "groen";
            trafficLightStatus["64.1"] = "groen";
            bridgeIdSet.forEach(trafficLight => {
                trafficLightStatus[trafficLight] = "groen";
            });
        }
        
    }

}



function setAllCrossingLightsToRed(trafficLightStatus) {
    crossingIdSet.forEach(trafficLight => {
        trafficLightStatus[trafficLight] = "rood";
    });
}


module.exports = {
    handleTrafficLightUpdate,
    updateCrossingLights,
    updateBridgeLights
};
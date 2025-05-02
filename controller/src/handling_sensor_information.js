/**
 * This script contains multiple functions handling the incomming simulator-information, possibly updating the trafficlight status.
 * @deprecated
 * @author Willem Daniel Visser
 * @version 1.0.0
 */

const green_sets = require("../config/green_sets.json")
const { findSensorIdPriorityVehicle, bridgeIdSet, boatIdSet, trafficGoingTobridgeIdSet, crossingIdSet, crossingCarIdSet, crossingCyclerIdSet, crossingPedIslandIdSet,crossingPedNOTIslandIdSet } = require('./utils');


function updateTrafficLightStatus(trafficLightStatus, roadwayStatus, specialStatus, priorityVehicleStatus, bridgeStatus, Ncyclus, passBoats) {
    const sensorIdPriorityVehicleLevel1 = findSensorIdPriorityVehicle(priorityVehicleStatus, 1)
    const sensorIdPriorityVehicleLevel2 = findSensorIdPriorityVehicle(priorityVehicleStatus, 2)

    updateTrafficLightStatusBridge(trafficLightStatus, roadwayStatus, specialStatus, priorityVehicleStatus, bridgeStatus, passBoats)
    


    // check if there is a priority vehicle with priority level 2, if so, set all the lights to red, except the one for the priority vehicle
    if(sensorIdPriorityVehicleLevel1 != undefined) {
        setAllLightsToRed(trafficLightStatus);
        trafficLightStatus[sensorIdPriorityVehicleLevel1] = "groen"
    // check if there is a priority vehicle with priority level 2, if so, set the lights to red and the green set to green
    } else if(sensorIdPriorityVehicleLevel2 != undefined) {
        const greenSet = Object.entries(green_sets).find(([_, set]) => set.includes(sensorIdPriorityVehicleLevel2))
        if(greenSet.length > 0) {
            const greenSetId = greenSet[0]
            updateTrafficLightStatusCrossing(trafficLightStatus, roadwayStatus, greenSetId * 3);
        }
    } else {
        updateTrafficLightStatusCrossing(trafficLightStatus, roadwayStatus, Ncyclus);
        if(specialStatus.brug_file && bridgeStatus["81.1"]?.state == "open") { // overwrite the traffic light status to red for lights directing to the bridge, if there is a file for the bridge
            trafficGoingTobridgeIdSet.forEach(trafficLight=>{
                trafficLightStatus[trafficLight] = "rood"
            })
        }
    }
}

/**
 * * Updates the traffic light status specific to the crossing based on the current cycle number and sensor data.
 * @param {object} trafficLightStatus crossing specific traffic light status
 * @param {object} sensorRoadwayStatus status of the roadway sensors 
 * @param {number} Ncyclus the current cycle number
 * @returns the updated traffic light status specific to the crossing
 */
function updateTrafficLightStatusCrossing(trafficLightStatus, roadwayStatus, Ncyclus) {
    if(Ncyclus == 0) 
        return trafficLightStatus;
    const Nstage = ((Ncyclus - 1) % 15) + 1; // 5 is the number of green sets, 3 rounds per green set
    const Ngreenset = Math.ceil(Nstage / 3); // Ncyclus 1 & 2 = green set 1, Ncyclus 3 & 4 = green set 2, etc.
    const greenLightSet = green_sets[`${Ngreenset}`];
    if (Nstage % 3 != 0) {
        [...crossingCyclerIdSet, ...crossingPedIslandIdSet, ...crossingCarIdSet].forEach(id => { // keep island lights green
            if(trafficLightStatus[id] == "groen") {
                trafficLightStatus[id] = "oranje";
            }
        })
    } else {
        crossingIdSet.forEach(id => {
            if(trafficLightStatus[id] == "oranje") {
                trafficLightStatus[id] = "rood";
            }
        })
        greenLightSet.forEach(id => {
            trafficLightStatus[id] = "groen"
        });
    }
    // setAllLightsToRed(trafficLightStatus);
}


function updateTrafficLightStatusBridge(trafficLightStatus, roadwayStatus, specialStatus, priorityVehicleStatus, bridgeStatus, passBoats) {
    const sensorIdPriorityVehicleLevel1 = findSensorIdPriorityVehicle(priorityVehicleStatus, 1)
    if (typeof bridgeStatus?.["81.1"]?.state != "string") {
        bridgeStatus = { "81.1": { state: "closed" } }; // default value for bridgeState
    }
    if (roadwayStatus == undefined || roadwayStatus == null) {
        roadwayStatus = {[boatIdSet[0]]: {voor: false}, [boatIdSet[1]]: {voor: false}};
    } else if (typeof roadwayStatus?.[boatIdSet[0]]?.voor != "boolean") {
        roadwayStatus[boatIdSet[0]] = {voor: false};
    }
    if(typeof roadwayStatus?.[boatIdSet[1]]?.voor != "boolean") {
        roadwayStatus[boatIdSet[1]] = {voor: false};
    }
    if (typeof passBoats?.isReady != "boolean") {
        passBoats = { isReady: false }; // default value for passBoats
    }
    let isBridgeOpen = (bridgeStatus["81.1"].state == "open");
    const isSensorTriggeredNorth = roadwayStatus[boatIdSet[0]].voor;
    const isSensorTriggeredSouth = roadwayStatus[boatIdSet[1]].voor;
    
    
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
        if (!isBridgeOpen) { // if the bridge is closed, set the boat traffic lights to red
            trafficLightStatus[boatIdSet[0]] = "rood";
            trafficLightStatus[boatIdSet[1]] = "rood";

            if(!specialStatus.brug_wegdek) {
                // trafficLightStatus["61.1"] = "rood"; // set slagboom to "rood"
                // trafficLightStatus["62.1"] = "rood";
                // trafficLightStatus["63.1"] = "rood";
                // trafficLightStatus["64.1"] = "rood";
                // trafficLightStatus["81.1"] = "groen"; // tell bridge to open
            }
        } else if (isBridgeOpen) {
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
                if(!specialStatus.brug_water) {
                    trafficLightStatus["81.1"] = "rood"; // tell bridge to close

                }
            }
            
        } 
    } else {
        if (!isBridgeOpen && !specialStatus.brug_water) {
            bridgeIdSet.forEach(trafficLight => {
                trafficLightStatus[trafficLight] = "groen";
            });
        }
        
        trafficLightStatus[boatIdSet[0]] = "rood";
        trafficLightStatus[boatIdSet[1]] = "rood";
        
    }
}


function setAllLightsToRed(trafficLightStatus) {
    crossingIdSet.forEach(trafficLight => {
        trafficLightStatus[trafficLight] = "rood";
    });
}


module.exports = {updateTrafficLightStatus, updateTrafficLightStatusBridge, getTrafficLightStatusCrossing: updateTrafficLightStatusCrossing}


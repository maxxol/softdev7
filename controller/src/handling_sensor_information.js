/**
 * This script contains multiple functions handling the incomming simulator-information, possibly updating the trafficlight status.
 * @author Willem Daniel Visser
 * @version 1.0.0
 */

const green_sets = require("../config/green_sets.json")
const { findSensorIdPriorityVehicle, bridgeIdSet, boatIdSet, trafficGoingTobridgeIdSet, crossingIdSet } = require('./utils');


function handleTrafficLightModification(trafficLightStatus, sensorRoadwayStatus, Ncyclus, passBoats, isBrugFile, priorityVehicleStatus, bridgeStatus) {
    const sensorIdPriorityVehicleLevel1 = findSensorIdPriorityVehicle(priorityVehicleStatus, 1)
    const sensorIdPriorityVehicleLevel2 = findSensorIdPriorityVehicle(priorityVehicleStatus, 2)

    let trafficLightStatusBridge = {
        ...Object.fromEntries(bridgeIdSet.map(id => [id, trafficLightStatus[id]])),
        ...Object.fromEntries(
            Object.values(boatIdSet).map(value => [value, trafficLightStatus[value]])
          )
    };
    trafficLightStatusBridge = getTrafficLightStatusOnSensorBridgeUpdate(trafficLightStatusBridge, bridgeStatus, sensorRoadwayStatus, passBoats, priorityVehicleStatus);
    trafficLightStatus = { ...trafficLightStatus, ...trafficLightStatusBridge };


    // check if there is a priority vehicle with priority level 2, if so, set all the lights to red, except the one for the priority vehicle
    if(sensorIdPriorityVehicleLevel1 != undefined) {
        setAllLightsToRed(trafficLightStatus);
        trafficLightStatus[sensorIdPriorityVehicleLevel1] = "groen"
    // check if there is a priority vehicle with priority level 2, if so, set the lights to red and the green set to green
    } else if(sensorIdPriorityVehicleLevel2 != undefined) {
        const greenSet = Object.entries(green_sets).find(([_, set]) => set.includes(sensorIdPriorityVehicleLevel2))
        if(greenSet) {
            const greenSetId = greenSet[0]
            trafficLightStatus = {...getTrafficLightStatusCrossing(trafficLightStatus, sensorRoadwayStatus, greenSetId)};
        }
    } else {
        trafficLightStatus = {...getTrafficLightStatusCrossing(trafficLightStatus, sensorRoadwayStatus, Ncyclus)};
        if(isBrugFile && bridgeStatus["81.1"].state == "open") { // overwrite the traffic light status to red for lights directing to the bridge, if there is a file for the bridge
            trafficGoingTobridgeIdSet.forEach(trafficLight=>{
                trafficLightStatus[trafficLight] = "rood"
            })
        }
    }

    return trafficLightStatus
}

/**
 * * Updates the traffic light status specific to the crossing based on the current cycle number and sensor data.
 * @param {object} trafficLightStatusCrossing crossing specific traffic light status
 * @param {object} sensorRoadwayStatus status of the roadway sensors 
 * @param {number} Ncyclus the current cycle number
 * @returns newTrafficLightStatus the updated traffic light status specific to the crossing
 */
function getTrafficLightStatusCrossing(trafficLightStatusCrossing, sensorRoadwayStatus, Ncyclus) {
    newTrafficLightStatus = Object.assign({}, trafficLightStatusCrossing);
    if(Ncyclus == 0) 
        return newTrafficLightStatus;
    const NgreenSet = ((Ncyclus - 1) % 5) + 1; // 5 is the number of green sets
    const greenSetLights = green_sets[`${NgreenSet}`];
    setAllLightsToRed(newTrafficLightStatus);
    greenSetLights.forEach(light => {
        newTrafficLightStatus[light] = "groen"
    });
    return newTrafficLightStatus;
}


function getTrafficLightStatusOnSensorBridgeUpdate(trafficLightStatusBridge, bridgeState, statusSensorBridge, passBoats, priorityVehicleStatus) {
    const sensorIdPriorityVehicleLevel1 = findSensorIdPriorityVehicle(priorityVehicleStatus, 1)
    const newTrafficLightStatus = Object.assign({}, trafficLightStatusBridge);
    if (typeof bridgeState?.["81.1"]?.state != "string") {
        bridgeState = { "81.1": { state: "closed" } }; // default value for bridgeState
    }
    if (statusSensorBridge == undefined || statusSensorBridge == null) {
        statusSensorBridge = {[boatIdSet.north]: {voor: false}, [boatIdSet.south]: {voor: false}};
    } else if (statusSensorBridge?.[boatIdSet.north]?.voor != "boolean") {
        statusSensorBridge[boatIdSet.north] = {voor: false};
    }
    if(statusSensorBridge?.[boatIdSet.south]?.voor != "boolean") {
        statusSensorBridge[boatIdSet.south] = {voor: false};
    }
    if (typeof passBoats?.isReady != "boolean") {
        passBoats = { isReady: false }; // default value for passBoats
    }
    let isBridgeOpen = (bridgeState["81.1"].state == "open");
    const isSensorTriggeredNorth = statusSensorBridge[boatIdSet.north].voor;
    const isSensorTriggeredSouth = statusSensorBridge[boatIdSet.south].voor;
    
    
    if (
        passBoats.isReady && // if passBoats is not ready, do not bother setting related traffic lights)
            !trafficGoingTobridgeIdSet.includes(sensorIdPriorityVehicleLevel1)
            // if a priority vehicle heads to the bridge, do not initiate the bridge opening
        ) { 
        bridgeIdSet.forEach(trafficLight => {
            newTrafficLightStatus[trafficLight] = "rood";
        });
        if (!isBridgeOpen) { // if the bridge is closed, set the boat traffic lights to red
            newTrafficLightStatus[boatIdSet.north] = "rood";
            newTrafficLightStatus[boatIdSet.south] = "rood";
        }
        if (isBridgeOpen && isSensorTriggeredNorth) { // if the bridge is open and a boat is on the sensor-north, set the boat traffic lights in the north to green and south to red
            newTrafficLightStatus[boatIdSet.north] = "groen";
            newTrafficLightStatus[boatIdSet.south] = "rood";
        } else if (isBridgeOpen && isSensorTriggeredSouth) { // if the bridge is open and a boat is only on the sensor south, set the boat traffic lights in the north to red and south to green
            newTrafficLightStatus[boatIdSet.north] = "rood";
            newTrafficLightStatus[boatIdSet.south] = "groen";
        }
        if (isBridgeOpen && !isSensorTriggeredNorth && !isSensorTriggeredSouth) { // if the bridge is open and no boat is on the sensor, set the boat traffic lights in the north and south to red
            newTrafficLightStatus[boatIdSet.north] = "rood";
            newTrafficLightStatus[boatIdSet.south] = "rood";
            passBoats.isReady = false; // reset the passBoats status
        }
    } else {
        if (!isBridgeOpen) {
            bridgeIdSet.forEach(trafficLight => {
                newTrafficLightStatus[trafficLight] = "groen";
            });
        }
        
        newTrafficLightStatus[boatIdSet.north] = "rood";
        newTrafficLightStatus[boatIdSet.south] = "rood";
        
    }
    return newTrafficLightStatus;
}


function setAllLightsToRed(trafficLightStatus) {
    crossingIdSet.forEach(trafficLight => {
        trafficLightStatus[trafficLight] = "rood";
    });
}


module.exports = {handleTrafficLightModification, getTrafficLightStatusOnSensorBridgeUpdate, getTrafficLightStatusCrossing}


/**
 * this file is responsible for updating the traffic lights on the bridge and the water, based on the simulator data
 * @author Willem Daniël Visser
 */
const { PASS_BOAT_STATES, bridgeIdSet, barrierIdSet, boatIdSet, trafficGoingTobridgeIdSet, TRAFFIC_LIGHT_COLORS  } = require("./utils")

const TimeForSingleBoatPass = 30000 // amount of time it takes for a single boat to pass the bridge to the other side
const TimeToWaitForBoatToTurn = 15000 // amount of time it takes for any boat in the queue to wait until it gets to pass 
const TimeToWaitForNewBoats = 5000 // amount of time boats get to reach the sensor, before the bridge really closes
/**
 * update the bridge and waterway based on the simulator data
 * @param {{
 *  roadway:{}, special:{brug_wegdek:boolean, brug_water:boolean, brug_file:boolean}, priority_vehicle:{queue:Array<{baan:string, simulatie_tijd_ms:number, prioriteit:number}>}, bridge:{"81":{"state":"dicht"|"open"}}, time:{simulatie_tijd_ms:number}
 * }} simulatorStatus 
 * @param {object} trafficLightStatus 
 * @param {{ state: PASS_BOAT_STATES }} bridgeState 
 */
function updateBridge(simulatorStatus, trafficLightStatus, bridgeState) {
    console.log(simulatorStatus)
    const { queue } = simulatorStatus.priority_vehicle
    const prioVehOne = queue.find(prioVeh => prioVeh.prioriteit==1)
    const idPrioVehicleOne = prioVehOne?.baan ?? ""
    const isBridgeOpen = (simulatorStatus.bridge["81.1"]?.state == "open")
    const isBridgeClosed = (simulatorStatus.bridge["81.1"]?.state == "dicht")
    const isSensorTriggeredNorth = Boolean(simulatorStatus.roadway[boatIdSet[0]].voor || simulatorStatus.roadway[boatIdSet[0]].achter)
    const isSensorTriggeredSouth = Boolean(simulatorStatus.roadway[boatIdSet[1]].voor || simulatorStatus.roadway[boatIdSet[1]].achter)
    // conditions to let a boat pass
    const shouldLetBoatsTurn = (isSensorTriggeredNorth || isSensorTriggeredSouth) && // boat on sensor
            // !simulatorStatus.special.brug_file && // no bridge traffic jam
            !trafficGoingTobridgeIdSet.has(idPrioVehicleOne) && // no priority vehicle heading to the bridge
            !["41.1", "42.1"].includes(idPrioVehicleOne)// no priority vehicle heading to the bridge
    const isAwaitingForState = [
        PASS_BOAT_STATES.AWAITING_CLEAR_BRIDGE,
        PASS_BOAT_STATES.AWAITING_OPEN_BRIDGE,
        PASS_BOAT_STATES.AWAITING_PASS_BOAT_NORTH,
        PASS_BOAT_STATES.AWAITING_PASS_BOAT_SOUTH,
        PASS_BOAT_STATES.AWAITING_STOP_BOAT,
        PASS_BOAT_STATES.AWAITING_CLOSE_BRIDGE,
        PASS_BOAT_STATES.AWAITING_BRIDGE_TRAFFIC_GREEN,
    ].includes(bridgeState.state)

    if (isBridgeClosed) {
        boatIdSet.forEach(id=>trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.RED);

        if(shouldLetBoatsTurn) {

            if(bridgeState.state == PASS_BOAT_STATES.DEFAULT || bridgeState.state == PASS_BOAT_STATES.BRIDGE_TRAFFIC_GREEN) {
                bridgeState.state = PASS_BOAT_STATES.AWAITING_CLEAR_BRIDGE
                setTimeout(()=>bridgeState.state=PASS_BOAT_STATES.CLEAR_BRIDGE, TimeToWaitForBoatToTurn)
            } else if (bridgeState.state == PASS_BOAT_STATES.CLEAR_BRIDGE) {
                bridgeIdSet.forEach(id=>trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.RED)
                bridgeState.state = PASS_BOAT_STATES.AWAITING_OPEN_BRIDGE
                setTimeout(()=>bridgeState.state=PASS_BOAT_STATES.OPEN_BRIDGE, 5000)
            } else if (bridgeState.state == PASS_BOAT_STATES.OPEN_BRIDGE) {
                bridgeIdSet.forEach(id=>trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.RED)
                barrierIdSet.forEach(id=>trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.RED)
                trafficLightStatus["81.1"] = TRAFFIC_LIGHT_COLORS.GREEN // tell bridge to open
            } else {
                if(!isAwaitingForState) {
                    bridgeState.state = PASS_BOAT_STATES.DEFAULT
                }
            }
        } else {

            if(!isAwaitingForState) {
                // bridge is not opening, nor open
                if(trafficLightStatus["81.1"] != TRAFFIC_LIGHT_COLORS.GREEN) {
                    [...bridgeIdSet, ...barrierIdSet].forEach(id=>trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.GREEN)
                // bridge is opening and not open
                } else { 
                    trafficLightStatus["81.1"] = TRAFFIC_LIGHT_COLORS.RED; // cancel opening
                    [...bridgeIdSet, ...barrierIdSet].forEach(id=>trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.RED)
                }
                bridgeState.state = PASS_BOAT_STATES.DEFAULT
            } else {
                if(bridgeState.state = PASS_BOAT_STATES.AWAITING_CLEAR_BRIDGE) {
                    bridgeState.state = PASS_BOAT_STATES.DEFAULT // cancel progression
                }
            }
        }
    } else if (isBridgeOpen) {
        boatIdSet.forEach(id=>trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.RED)
        if(shouldLetBoatsTurn) {
            if(!isAwaitingForState) {
                if((bridgeState.state <= PASS_BOAT_STATES.OPEN_BRIDGE || [PASS_BOAT_STATES.PASS_BOAT_NORTH, PASS_BOAT_STATES.STOP_BOAT, PASS_BOAT_STATES.BRIDGE_TRAFFIC_GREEN].includes(bridgeState.state) ) && isSensorTriggeredNorth) {
                    letBoatNorthPass()
                    bridgeState.state = PASS_BOAT_STATES.PASS_BOAT_NORTH
                } else if ((bridgeState.state <= PASS_BOAT_STATES.OPEN_BRIDGE || [PASS_BOAT_STATES.PASS_BOAT_SOUTH, PASS_BOAT_STATES.STOP_BOAT, PASS_BOAT_STATES.BRIDGE_TRAFFIC_GREEN].includes(bridgeState.state)) && isSensorTriggeredSouth) {
                    letBoatSouthPass()
                    bridgeState.state = PASS_BOAT_STATES.PASS_BOAT_SOUTH
                } else if (bridgeState.state == PASS_BOAT_STATES.PASS_BOAT_SOUTH && isSensorTriggeredNorth) {
                    bridgeState.state = PASS_BOAT_STATES.AWAITING_PASS_BOAT_NORTH
                    setTimeout(()=>bridgeState.state=PASS_BOAT_STATES.PASS_BOAT_NORTH, TimeForSingleBoatPass)
                } else if (bridgeState.state == PASS_BOAT_STATES.PASS_BOAT_NORTH && isSensorTriggeredSouth) {
                    bridgeState.state = PASS_BOAT_STATES.AWAITING_PASS_BOAT_SOUTH
                    setTimeout(()=>bridgeState.state=PASS_BOAT_STATES.PASS_BOAT_SOUTH, TimeForSingleBoatPass)
                } else if (bridgeState.state == PASS_BOAT_STATES.CLOSE_BRIDGE) {
                    bridgeState.state = PASS_BOAT_STATES.OPEN_BRIDGE
                }
            }
        } else {

            if(!isAwaitingForState) {
                if([PASS_BOAT_STATES.PASS_BOAT_NORTH, PASS_BOAT_STATES.PASS_BOAT_SOUTH].includes(bridgeState.state)) {
                    bridgeState.state = PASS_BOAT_STATES.AWAITING_STOP_BOAT
                    setTimeout(()=>bridgeState.state=PASS_BOAT_STATES.STOP_BOAT, TimeForSingleBoatPass)
                } else if (bridgeState.state == PASS_BOAT_STATES.STOP_BOAT) {
                    boatIdSet.forEach(id=>trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.RED)
                    bridgeState.state = PASS_BOAT_STATES.AWAITING_CLOSE_BRIDGE
                    setTimeout(()=>bridgeState.state=PASS_BOAT_STATES.CLOSE_BRIDGE, TimeToWaitForNewBoats)
                } else if (bridgeState.state == PASS_BOAT_STATES.CLOSE_BRIDGE) {
                    trafficLightStatus["81.1"] = TRAFFIC_LIGHT_COLORS.RED
                    bridgeState.state = PASS_BOAT_STATES.BRIDGE_TRAFFIC_GREEN
                    // bridgeState.state = PASS_BOAT_STATES.AWAITING_BRIDGE_TRAFFIC_GREEN
                    // setTimeout(()=>bridgeState.state=PASS_BOAT_STATES.BRIDGE_TRAFFIC_GREEN, TimeToWaitForNewBoats)
                } else { // if (bridgeState.state >= PASS_BOAT_STATES.OPEN_BRIDGE) {
                    bridgeState.state = PASS_BOAT_STATES.CLOSE_BRIDGE
                }
            }
        }

        
        [...bridgeIdSet, ...barrierIdSet].forEach(id=>trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.RED)

    } else { // opening, closing or unknown
        const isBridgeClosing = Boolean(trafficLightStatus["81.1"] == TRAFFIC_LIGHT_COLORS.RED);
        [...bridgeIdSet, ...barrierIdSet].forEach(id=>trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.RED)
        boatIdSet.forEach(id=>trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.RED)

        if(shouldLetBoatsTurn) {
            if(isBridgeClosing) {
                trafficLightStatus["81.1"] = TRAFFIC_LIGHT_COLORS.GREEN
            }
        } else {
            if(!isBridgeClosing) {
                trafficLightStatus["81.1"] = TRAFFIC_LIGHT_COLORS.RED
            }
        }
    }

    function letBoatSouthPass() {
        trafficLightStatus[boatIdSet[0]] = "rood"
        trafficLightStatus[boatIdSet[1]] = "groen"
    }

    function letBoatNorthPass() {
        trafficLightStatus[boatIdSet[0]] = "groen"
        trafficLightStatus[boatIdSet[1]] = "rood"
    }
}


module.exports = {
    updateBridge
}
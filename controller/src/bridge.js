/**
 * this file is responsible for updating the traffic lights on the bridge and the water, based on the simulator data
 * @author Willem Daniël Visser
 */
const { PASS_BOAT_STATES, ID_SETS, TRAFFIC_LIGHT_COLORS  } = require("./utils")

const TimeForSingleBoatPass = 5000 // amount of time it takes for a single boat to pass from the "brug_water" sensor to the other side (may vary between simulators)
const TimeToWaitForBoatToTurn = 18000 // amount of time it takes for any boat in the queue to wait until it gets to pass 
const SENSOR_TRIGGER_PERSISTENCE_TIME = 10000
const SENSOR_TRIGGER_WATER_PERSISTENCE_TIME = 5000
/**
 * update the bridge and waterway based on the simulator data
 * @param {{
 *  roadway:{}, special:{brug_wegdek:boolean, brug_water:boolean, brug_file:boolean}, priority_vehicle:{queue:Array<{baan:string, simulatie_tijd_ms:number, prioriteit:number}>}, bridge:{"81":{"state":"dicht"|"open"}}, time:{simulatie_tijd_ms:number}
 * }} simulatorStatus 
 * @param {object} trafficLightStatus 
 * @param {{ state: PASS_BOAT_STATES }} bridgeState 
 * @param {{brug_wegdekTrue: number, brug_wegdekFalse, brug_waterFalse}} lastUpdate
 */
function updateBridge(simulatorStatus, trafficLightStatus, bridgeState, lastUpdate) {
    
    const { queue } = simulatorStatus.priority_vehicle
    const { simulatie_tijd_ms } = simulatorStatus.time
    const prioVehOne = queue.find(prioVeh => prioVeh.prioriteit==1)
    const idPrioVehicleOne = prioVehOne?.baan ?? ""
    const isBridgeOpen = (simulatorStatus.bridge["81.1"]?.state == "open")
    const isBridgeClosed = (simulatorStatus.bridge["81.1"]?.state == "dicht")
    const isSensorTriggeredNorth = Boolean(simulatorStatus.roadway[ID_SETS.boat[0]].voor || simulatorStatus.roadway[ID_SETS.boat[0]].achter)
    const isSensorTriggeredSouth = Boolean(simulatorStatus.roadway[ID_SETS.boat[1]].voor || simulatorStatus.roadway[ID_SETS.boat[1]].achter)
    let isTriggeredBrugSurfaceSensor
    if(lastUpdate.brug_wegdekTrue == null) 
        isTriggeredBrugSurfaceSensor = false
    else
        isTriggeredBrugSurfaceSensor = (simulatie_tijd_ms - lastUpdate.brug_wegdekTrue) >= SENSOR_TRIGGER_PERSISTENCE_TIME
    // if the water sensor is triggered; isTriggeredBrugWaterSensor=true
    // if the water sensor is not triggered for less than, or equal to 10_000ms; isTriggeredBrugWaterSensor=true
    // if the water sensor is not triggered for more than 10_000ms; isTriggeredBrugWaterSensor=false
    let isTriggeredBrugWaterSensor
    if(lastUpdate.brug_waterFalse == null) // not, not triggered
        isTriggeredBrugWaterSensor = true
    else // not triggred
        isTriggeredBrugWaterSensor = (simulatie_tijd_ms - lastUpdate.brug_waterFalse) < SENSOR_TRIGGER_WATER_PERSISTENCE_TIME
    let isTriggeredBrugFileSensor
    if(lastUpdate.brug_FileTrue == null)
        isTriggeredBrugFileSensor = false
    else
        isTriggeredBrugFileSensor = simulatie_tijd_ms - lastUpdate.brug_FileTrue >= SENSOR_TRIGGER_PERSISTENCE_TIME
    // conditions to let a boat pass
    const shouldLetBoatsTurn = (isSensorTriggeredNorth || isSensorTriggeredSouth) && // boat on sensor
            !isTriggeredBrugFileSensor && // no bridge traffic jam
            !ID_SETS.crossing.carsHeadingToBridge.includes(idPrioVehicleOne) && // no priority vehicle heading to the bridge
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
        ID_SETS.boat.forEach(id=>trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.RED);

        if(shouldLetBoatsTurn) {

            if(bridgeState.state == PASS_BOAT_STATES.DEFAULT || bridgeState.state == PASS_BOAT_STATES.BRIDGE_TRAFFIC_GREEN) {
                bridgeState.state = PASS_BOAT_STATES.AWAITING_CLEAR_BRIDGE
                setTimeout(()=>bridgeState.state=PASS_BOAT_STATES.CLEAR_BRIDGE, TimeToWaitForBoatToTurn)
            } else if (bridgeState.state == PASS_BOAT_STATES.CLEAR_BRIDGE) {
                ID_SETS.bridge.forEach(id=>trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.RED)
                bridgeState.state = PASS_BOAT_STATES.AWAITING_OPEN_BRIDGE
                setTimeout(()=>bridgeState.state=PASS_BOAT_STATES.OPEN_BRIDGE, 5000)
            } else if (bridgeState.state == PASS_BOAT_STATES.OPEN_BRIDGE) {
                // open bridge when the surface is empty for <SENSOR_TRIGGER_PERSISTENCE_TIME>
                if(!isTriggeredBrugSurfaceSensor) {
                    trafficLightStatus["81.1"] = TRAFFIC_LIGHT_COLORS.GREEN // tell bridge to open
                    ID_SETS.bridge.forEach(id=>trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.RED)
                }
            } else {
                if(!isAwaitingForState) {
                    bridgeState.state = PASS_BOAT_STATES.DEFAULT
                }
            }
        } else {

            if(!isAwaitingForState) {
                // bridge is not opening, nor open
                if(trafficLightStatus["81.1"] != TRAFFIC_LIGHT_COLORS.GREEN) {
                    ID_SETS.bridge.forEach(id=>trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.GREEN)
                // bridge is opening and not open
                } else { 
                    trafficLightStatus["81.1"] = TRAFFIC_LIGHT_COLORS.RED; // cancel opening
                    ID_SETS.bridge.forEach(id=>trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.RED) // ensure red
                }
                bridgeState.state = PASS_BOAT_STATES.DEFAULT
            } else {
                if(bridgeState.state == PASS_BOAT_STATES.AWAITING_CLEAR_BRIDGE) {
                    bridgeState.state = PASS_BOAT_STATES.DEFAULT // cancel progression
                }
            }
        }
    } else if (isBridgeOpen) {
        if(shouldLetBoatsTurn) {
            // is awaiting for a state and no boat ferries under the bridge
            if(!isAwaitingForState && !isTriggeredBrugWaterSensor) {
                // is in any stage after open bridge, or in the stage where boats from north can ferry, or the boats were about to get told to stop. And is sensor north is triggered
                if((bridgeState.state <= PASS_BOAT_STATES.OPEN_BRIDGE || [PASS_BOAT_STATES.PASS_BOAT_NORTH, PASS_BOAT_STATES.STOP_BOAT, PASS_BOAT_STATES.BRIDGE_TRAFFIC_GREEN].includes(bridgeState.state) ) && isSensorTriggeredNorth) {
                    letBoatNorthPass()
                    bridgeState.state = PASS_BOAT_STATES.PASS_BOAT_NORTH
                    // is in any stage after open bridge, or in the stage where boats from south can ferry, or the boats were about to get told to stop. And is sensor south is triggered
                } else if ((bridgeState.state <= PASS_BOAT_STATES.OPEN_BRIDGE || [PASS_BOAT_STATES.PASS_BOAT_SOUTH, PASS_BOAT_STATES.STOP_BOAT, PASS_BOAT_STATES.BRIDGE_TRAFFIC_GREEN].includes(bridgeState.state)) && isSensorTriggeredSouth) {
                    letBoatSouthPass()
                    bridgeState.state = PASS_BOAT_STATES.PASS_BOAT_SOUTH
                } else if (bridgeState.state == PASS_BOAT_STATES.PASS_BOAT_SOUTH && isSensorTriggeredNorth && !isTriggeredBrugWaterSensor) {
                    bridgeState.state = PASS_BOAT_STATES.AWAITING_PASS_BOAT_NORTH
                    setTimeout(()=>bridgeState.state=PASS_BOAT_STATES.PASS_BOAT_NORTH, TimeForSingleBoatPass)
                } else if (bridgeState.state == PASS_BOAT_STATES.PASS_BOAT_NORTH && isSensorTriggeredSouth && !isTriggeredBrugWaterSensor) {
                    bridgeState.state = PASS_BOAT_STATES.PASS_BOAT_SOUTH
                    // setTimeout(()=>bridgeState.state=PASS_BOAT_STATES.PASS_BOAT_SOUTH, TimeForSingleBoatPass)
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
                    ID_SETS.boat.forEach(id=>trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.RED)
                    // bridgeState.state = PASS_BOAT_STATES.AWAITING_CLOSE_BRIDGE
                    // setTimeout(()=>bridgeState.state=PASS_BOAT_STATES.CLOSE_BRIDGE, 8000)
                    bridgeState.state = PASS_BOAT_STATES.CLOSE_BRIDGE
                } else if (bridgeState.state == PASS_BOAT_STATES.CLOSE_BRIDGE && !isTriggeredBrugWaterSensor) {
                    trafficLightStatus["81.1"] = TRAFFIC_LIGHT_COLORS.RED // close the bridge
                    bridgeState.state = PASS_BOAT_STATES.BRIDGE_TRAFFIC_GREEN
                    // bridgeState.state = PASS_BOAT_STATES.AWAITING_BRIDGE_TRAFFIC_GREEN
                    // setTimeout(()=>bridgeState.state=PASS_BOAT_STATES.BRIDGE_TRAFFIC_GREEN, TimeToWaitForNewBoats)
                } else { // if (bridgeState.state >= PASS_BOAT_STATES.OPEN_BRIDGE) {
                    bridgeState.state = PASS_BOAT_STATES.CLOSE_BRIDGE
                }
            }
        }

        
        ID_SETS.bridge.forEach(id=>trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.RED)

    } else { // opening, closing or unknown
        const isBridgeClosing = Boolean(trafficLightStatus["81.1"] == TRAFFIC_LIGHT_COLORS.RED);
        ID_SETS.bridge.forEach(id=>trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.RED)
        ID_SETS.boat.forEach(id=>trafficLightStatus[id] = TRAFFIC_LIGHT_COLORS.RED)

        if(shouldLetBoatsTurn) {
            if(isBridgeClosing && isTriggeredBrugWaterSensor) {
                trafficLightStatus["81.1"] = TRAFFIC_LIGHT_COLORS.GREEN
            }
        } else {
            if(!isBridgeClosing) {
                trafficLightStatus["81.1"] = TRAFFIC_LIGHT_COLORS.RED
            }
        }
    }

    function letBoatSouthPass() {
        trafficLightStatus[ID_SETS.boat[0]] = "rood"
        trafficLightStatus[ID_SETS.boat[1]] = "groen"
    }

    function letBoatNorthPass() {
        trafficLightStatus[ID_SETS.boat[0]] = "groen"
        trafficLightStatus[ID_SETS.boat[1]] = "rood"
    }
}


module.exports = {
    updateBridge
}
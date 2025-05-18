/**
 * this file is responsible for updating the traffic lights on the bridge and the water, based on the simulator data
 * @author Willem Daniël Visser
 */
const { PASS_BOAT_STATES, bridgeIdSet, barrierIdSet, boatIdSet, trafficGoingTobridgeIdSet  } = require("./utils")

const TimeForBoatPass = 29000
/**
 * update the bridge and waterway based on the simulator data
 * @param {{
*  roadway:{}, special:{}, priority_vehicle:{}, bridge:{}
* }} simulatorStatus 
* @param {object} trafficLightStatus 
* @param {{ state: PASS_BOAT_STATES }} bridgeState 
 */
function updateBridge(simulatorStatus, trafficLightStatus, bridgeState) {
    const { queue } = simulatorStatus.priority_vehicle
    const prioVehOne = queue.find(prioVeh => prioVeh.prioriteit==1)
    const idPrioVehicleOne = prioVehOne?.baan ?? ""
    let isBridgeOpen = (simulatorStatus.bridge["81"].state == "open")
    const changePassBoats = (passBoatState) => bridgeState.state = passBoatState
    const isSensorTriggeredNorth = Boolean(simulatorStatus.roadway[boatIdSet[0]].voor || simulatorStatus.roadway[boatIdSet[0]].achter)
    const isSensorTriggeredSouth = Boolean(simulatorStatus.roadway[boatIdSet[1]].voor || simulatorStatus.roadway[boatIdSet[1]].achter)
    if (!isBridgeOpen) {
        handleAwaitingClearBridge()

        switch (bridgeState.state) {
            case PASS_BOAT_STATES.DEFAULT:
            case PASS_BOAT_STATES.CLOSE_BRIDGE:
                openBarriers()
                break;
            case PASS_BOAT_STATES.BRIDGE_TRAFFIC_GREEN:
                toggleBarriers("groen")
                allowBridgeTraffic()
                break;
            case PASS_BOAT_STATES.CLEAR_BRIDGE:
                clearBridge()
                break;
            case PASS_BOAT_STATES.OPEN_BRIDGE:
                openBridge()
                break;
        }
    } else {
        if (trafficGoingTobridgeIdSet.has(idPrioVehicleOne)) { // disturb the boat cycle
            bridgeState.state = PASS_BOAT_STATES.STOP_BOAT
        } else {
            handleTriggeredBoatSensors()
        }

        if (bridgeState.state == PASS_BOAT_STATES.STOP_BOAT) {
            onStopBoat()
        }

        switch (bridgeState.state) {
            case PASS_BOAT_STATES.PASS_BOAT_NORTH:
                letBoatNorthPass()
                break;
            case PASS_BOAT_STATES.PASS_BOAT_SOUTH:
                letBoatSouthPass()
                break;
            case PASS_BOAT_STATES.CLOSE_BRIDGE:
                console.log("<bridge> is closing")
                trafficLightStatus["81.1"] = "rood" // tell bridge to close
                break;
        }

    }

    function openBarriers() {
        toggleBarriers("groen")
        bridgeState.state = PASS_BOAT_STATES.AWAITING_BRIDGE_TRAFFIC_GREEN
        setTimeout(changePassBoats, 4000, PASS_BOAT_STATES.BRIDGE_TRAFFIC_GREEN)
    }

    function allowBridgeTraffic() {
        bridgeIdSet.forEach(trafficLight => {
            trafficLightStatus[trafficLight] = "groen"
        })
    }

    function openBridge() {
        console.log("<bridge> is opening")
        toggleBarriers("rood")
        trafficLightStatus["81.1"] = "groen" // tell bridge to open
    }

    function clearBridge() {
        bridgeIdSet.forEach(trafficLight => {
            trafficLightStatus[trafficLight] = "rood"
        })
        bridgeState.state = PASS_BOAT_STATES.AWAITING_OPEN_BRIDGE
        setTimeout(changePassBoats, 4000, PASS_BOAT_STATES.OPEN_BRIDGE)
    }

    function onStopBoat() {
        if (isSensorTriggeredNorth) {
            bridgeState.state = PASS_BOAT_STATES.PASS_BOAT_NORTH
        } else if (isSensorTriggeredSouth) {
            bridgeState.state = PASS_BOAT_STATES.PASS_BOAT_NORTH
        } else {
            trafficLightStatus[boatIdSet[0]] = "rood"
            trafficLightStatus[boatIdSet[1]] = "rood"
            bridgeState.state = PASS_BOAT_STATES.AWAITING_CLOSE_BRIDGE
            setTimeout(changePassBoats, TimeForBoatPass, PASS_BOAT_STATES.CLOSE_BRIDGE)
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

    function handleTriggeredBoatSensors() {
        if (isSensorTriggeredNorth) {
            switch (bridgeState.state) {
                case PASS_BOAT_STATES.OPEN_BRIDGE:
                    bridgeState.state = PASS_BOAT_STATES.PASS_BOAT_NORTH
                    break;
                case PASS_BOAT_STATES.PASS_BOAT_SOUTH:// from south to north
                    bridgeState.state = PASS_BOAT_STATES.AWAITING_PASS_BOAT_NORTH
                    // take 25 seconds before swapping lights
                    setTimeout(changePassBoats, TimeForBoatPass, PASS_BOAT_STATES.PASS_BOAT_NORTH)
                    break;
            }
        } else if (isSensorTriggeredSouth) {
            switch (bridgeState.state) {
                case PASS_BOAT_STATES.OPEN_BRIDGE:
                    bridgeState.state = PASS_BOAT_STATES.PASS_BOAT_SOUTH
                    break;
                case PASS_BOAT_STATES.PASS_BOAT_NORTH:// from south to north
                    bridgeState.state = PASS_BOAT_STATES.AWAITING_PASS_BOAT_SOUTH
                    // take 25 seconds before swapping lights
                    setTimeout(changePassBoats, TimeForBoatPass, PASS_BOAT_STATES.PASS_BOAT_SOUTH)
                    break;
            }
        } else if ((!isSensorTriggeredNorth && !isSensorTriggeredSouth) && bridgeState.state != PASS_BOAT_STATES.CLOSE_BRIDGE) {
            bridgeState.state = PASS_BOAT_STATES.AWAITING_STOP_BOAT
            // wait 3 sec. in case another boat comes in from behind
            setTimeout(changePassBoats, 3000, PASS_BOAT_STATES.STOP_BOAT)
        }
    }

    function toggleBarriers(color) {
        barrierIdSet.forEach(id=>trafficLightStatus[id] = color)
    }
    function handleAwaitingClearBridge() {
        if (
            (isSensorTriggeredNorth || isSensorTriggeredSouth) &&
            ![
                PASS_BOAT_STATES.AWAITING_CLEAR_BRIDGE, PASS_BOAT_STATES.CLEAR_BRIDGE,
                PASS_BOAT_STATES.AWAITING_OPEN_BRIDGE, PASS_BOAT_STATES.OPEN_BRIDGE
            ].includes(bridgeState.state) &&
            !brug_file &&
            !trafficGoingTobridgeIdSet.has(idPrioVehicleOne)
        ) {
            bridgeState.state = PASS_BOAT_STATES.AWAITING_CLEAR_BRIDGE
            // 40 seconds to allow boats to accumulate
            setTimeout(changePassBoats, 10000, PASS_BOAT_STATES.CLEAR_BRIDGE)
        }
    }
}


module.exports = {
    updateBridge
}
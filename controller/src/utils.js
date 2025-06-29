const GREEN_SETS = require("../config/green_sets.json")

const ID_SETS = {
    bridge: ["41.1", "42.1", "51.1", "52.1", "53.1", "54.1"],
    boat: ["71.1", "72.1"],
    bridgeBoat: [],
    crossing: {
        car: [],
        carsHeadingToBridge: ["12.1", "8.1", "8.2", "4.1"],
        peds: [],
        pedIsland: ["31.2", "32.1", "33.2", "34.1", "35.2", "36.1", "37.2", "38.1"],
        pedNOTIsland: ["31.1", "32.2", "33.1", "34.2", "35.1", "36.2", "37.1", "38.2"],
        cycler: ["21.1", "22.1", "23.1", "24.1", "25.1", "26.1", "27.1", "28.1"],
        total: []
    },
    total: []
}
ID_SETS.bridgeBoat = [...ID_SETS.bridge, ...ID_SETS.boat]
ID_SETS.crossing.car = ["1.1", "2.1", "2.2", "3.1", "5.1", "6.1", "7.1", "9.1", "10.1", "11.1", ...ID_SETS.crossing.carsHeadingToBridge]
ID_SETS.crossing.peds = [...ID_SETS.crossing.pedIsland, ...ID_SETS.crossing.pedNOTIsland]
ID_SETS.crossing.total = [...ID_SETS.crossing.car, ...ID_SETS.crossing.cycler, ...ID_SETS.crossing.peds]
ID_SETS.total = [...ID_SETS.bridgeBoat, ...ID_SETS.crossing.total]

const GREEN_SETS_ENTRIES = Object.entries(GREEN_SETS)
const TRAFFIC_LIGHT_COLORS = Object.freeze({
    GREEN: "groen",
    ORANGE: "oranje",
    RED: "rood"
})

const PASS_BOAT_STATES = Object.freeze({ // trafficlights(TL)
                                 // in this stage we...
    DEFAULT:                  0, // no boats to be processed
    AWAITING_CLEAR_BRIDGE:    1, // wait before we can clear the bridge
    CLEAR_BRIDGE:             2, // clear the bridge(bridge TL on red)
    AWAITING_OPEN_BRIDGE:     3, // wait before we can open the bridge
    OPEN_BRIDGE:              4, // tell the bridge to open
    AWAITING_PASS_BOAT_NORTH: 5, // wait before we can put north to green
    PASS_BOAT_NORTH:          6, // put TL boat from north to green
    AWAITING_PASS_BOAT_SOUTH: 7, // wait before we can put south to green
    PASS_BOAT_SOUTH:          8, // put TL boat from south to green
    AWAITING_STOP_BOAT:       9, // wait before we can put boat TL to red
    STOP_BOAT:                10,// put boats TL to red
    AWAITING_CLOSE_BRIDGE:    11,// wait before we can tell the bridge close
    CLOSE_BRIDGE:             12,// bridge can be told to close
    AWAITING_BRIDGE_TRAFFIC_GREEN: 13,// wait before we can allow bridge traffic to pass
    BRIDGE_TRAFFIC_GREEN: 14,// allow bridge traffic to pass(bridge TL on green)

})


function shouldLetPriorityVehicleTrough(doLetPriorityVehicleTrough, priorityVehicleStatus) {
    if (priorityVehicleStatus?.queue == undefined || !(priorityVehicleStatus.queue instanceof Array)) {
        console.warn("could not find queue in topic 'voorrangsvoertuig'");
    } else {
        doLetPriorityVehicleTrough = (priorityVehicleStatus.queue.some((voorrangsvoertuig) => voorrangsvoertuig.prioriteit == 1));
    }
    return doLetPriorityVehicleTrough;
}


function onSensorsRoadWay(sensorRoadwayStatus, boadTimer, passBoats) {
    if ( 
        (sensorRoadwayStatus?.["71.1"]?.voor == undefined)
        || (sensorRoadwayStatus?.["72.1"]?.voor == undefined)
        || (passBoats?.isReady == undefined)
        || (typeof sensorRoadwayStatus["71.1"].voor != "boolean")
        || (typeof sensorRoadwayStatus["72.1"].voor != "boolean")
    ) {
        console.error("topic 'sensoren_rijbaan' send an invalid object");
    } else {
        let isBoatOnSensor = (sensorRoadwayStatus["71.1"].voor || sensorRoadwayStatus["72.1"].voor);
        if (isBoatOnSensor && !boadTimer) { // a boat has started waiting, set timer
        const accumulateTimeBoats = 10 * 1000;
        boadTimer = setTimeout(() => {
            console.log("passBoats is ready"); // does evealute in 10 seconds
            
            passBoats.isReady = PASS_BOAT_STATES.AWAITING_OPEN_BRIDGE;
        }, accumulateTimeBoats);
        }
    }
    return { boadTimer };
}


function findSensorIdPriorityVehicle(priorityVehicleStatus, priorityLevel=2) {
    let sensorIdPriorityVehicle;
    if (priorityVehicleStatus?.queue != undefined || (priorityVehicleStatus.queue instanceof Array)) {
        if (priorityVehicleStatus.queue.length != 0) {
            let roadwaySet = (priorityVehicleStatus.queue.filter((voorrangsvoertuig) => voorrangsvoertuig.prioriteit == priorityLevel)).map(({ baan }) => baan);
            if (roadwaySet) {
                sensorIdPriorityVehicle = roadwaySet[0];
            }
        }
        return sensorIdPriorityVehicle;
    }
}

module.exports = {
    shouldLetPriorityVehicleTrough,
    onSensorsRoadWay,
    findSensorIdPriorityVehicle,
    ID_SETS,
    PASS_BOAT_STATES,
    TRAFFIC_LIGHT_COLORS,
    GREEN_SETS,
    GREEN_SETS_ENTRIES
}

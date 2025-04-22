const bridgeIdSet = ["41.1", "42.1", "51.1", "52.1", "53.1", "54.1"]
const boatIdSet = {"north": "71.1", "south": "72.1"}
const trafficGoingTobridgeIdSet = ["12.1", "8.1", "8.2", "4.1"]
const crossingIdSet = ["1.1", "2.1", "2.2", "3.1", "3.6", "5.1", "6.1", "7.1", "9.1", "10.1", "11.1", "21.1", "22.1", "24.1", "25.1", "26.1", "27.1", "28.1", "31.1", "31.2", "32.1", "32.2", "33.1", "33.2", "34.1", "34.2", "35.1", "35.2", "36.1", "37.1", "37.2", "38.1", "38.2", ...trafficGoingTobridgeIdSet]


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
        boadTimer = setTimeout(() => {
            console.log("passBoats is ready"); // does evealute in 10 seconds
            
            passBoats.isReady = true
        }, 10 * 1000); //3*60*1000
        }
    }
    return { boadTimer, passBoats };
}


function findSensorIdPriorityVehicle(priorityVehicleStatus, priorityLevel=2) {
    let sensorIdPriorityVehicle;
    if(priorityVehicleStatus?.queue != undefined || (priorityVehicleStatus.queue instanceof Array)) {
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
    bridgeIdSet,
    boatIdSet,
    trafficGoingTobridgeIdSet,
    crossingIdSet
}

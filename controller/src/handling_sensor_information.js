/**
 * This script contains multiple functions handling the incomming simulator-information, possibly updating the trafficlight status.
 * @author Willem Daniel Visser
 * @version 1.0.0
 */

/**
 * Set traffic light status, based on the full; current situation of the simulator
 * @param {object} trafficLightStatus status of current traffic light situation, in object-format 'stoplichten'-topic
 * @param {object} sensorsRoadwayStatus status of current sensor situation on the road, in object-format 'sensoren_rijbaan'-topic
 * @param {object} sensorsSpecialStatus status of current sensor situation in and around the bridge, in object-format 'sensoren_speciaal'-topic
 * @param {object} priorityVehicleStatus status of queue with priority vehicles
 * @param {object} bridgeStatus status of the bridge
 * @param {object} intersectionData data that is used to detairmen which trafficlights can be green simultaneously, equal to 'intersection_data.json'
 * @returns new traffic light status
 */
function handleTrafficLightModification(trafficLightStatus, sensorRoadwayStatus, sensorsSpecialStatus, priorityVehicleStatus, bridgeStatus, intersectionData) {
    
    return trafficLightStatus;
}
module.exports = {handleTrafficLightModification}
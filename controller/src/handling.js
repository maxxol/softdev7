/**
 * Set traffic light status, based on current situation
 * @param {object} trafficLightStatus status of current traffic light situation, in object-format 'stoplichten'-topic
 * @param {object} sensorsRoadwayStatus status of current sensor situation on the road, in object-format 'sensoren_rijbaan'-topic
 * @param {object} sensorsSpecialStatus status of current sensor situation in and around the bridge, in object-format 'sensoren_speciaal'-topic
 * @param {object} intersectionData data that is used to detairmen which trafficlights can be green simultaneously, equal to 'intersection_data.json'
 * @returns new traffic light status
 */
function handleTrafficLightModification(trafficLightStatus,sensorsRoadwayStatus, sensorsSpecialStatus, intersectionData) {
    return trafficLightStatus;
}
module.exports = {handleTrafficLightModification}
const { updateCrossingLights, updateBridgeLights } = require("../src/handle_traffic_light_update");
const trafficlightStatusInitial = require("../config/misc/trafficlight_status_initial.json");
const greenSets = require("../config/green_sets.json");
const { crossingPedNOTIslandIdSet } = require("../src/utils");

describe('updateCrossingLights', () => {
    test.each([
        {
            name: "nothing to 1, oranje- stage 0",
            start: {
                ...trafficlightStatusInitial,
            },
            expectedEnd: {
                ...trafficlightStatusInitial,
            },
            simulatorStatus: {
                roadway: {},
                special: {},
                priority_vehicle: {},
                bridge: {}
            },
            Ncyclus: 1
        },
        {
            name: "1 to 2, oranje- stage 0",
            start: {
                ...trafficlightStatusInitial,
            },
            expectedEnd: {
                ...trafficlightStatusInitial,
            },
            simulatorStatus: {
                roadway: {},
                special: {},
                priority_vehicle: {},
                bridge: {}
            },
            Ncyclus: 2
        },
        {
            name: "2 to 3, groen- stage 1",
            start: {
                ...trafficlightStatusInitial,
            },
            expectedEnd: {
                ...trafficlightStatusInitial, 
                ...mapIds(greenSets["1"], "groen")
            },
            simulatorStatus: {
                roadway: {},
                special: {},
                priority_vehicle: {},
                bridge: {}
            },
            Ncyclus: 3
        },
        {
            name: "3 to 4, oranje- stage 1",
            start: {
                ...trafficlightStatusInitial,
                ...mapIds(greenSets["1"], "groen")
            },
            expectedEnd: {
                ...trafficlightStatusInitial, 
                ...mapIds(greenSets["1"], "oranje")
            },
            simulatorStatus: {
                roadway: {},
                special: {},
                priority_vehicle: {},
                bridge: {}
            },
            Ncyclus: 4
        },
        {
            name: "4 to 5, oranje- stage 1",
            start: {
                ...trafficlightStatusInitial,
                ...mapIds(greenSets["1"], "groen") // not an expected start-state, but it a feature that can be used in later versions to skip the waiting for the orange light to go red.
            },
            expectedEnd: {
                ...trafficlightStatusInitial, 
                ...mapIds(greenSets["1"], "oranje")
            },
            simulatorStatus: {
                roadway: {},
                special: {},
                priority_vehicle: {},
                bridge: {}
            },
            Ncyclus: 5
        },
        {
            name: "5 to 6, groen- stage 2",
            start: {
                ...trafficlightStatusInitial,
                ...mapIds(greenSets["1"], "oranje")
            },
            expectedEnd: {
                ...trafficlightStatusInitial, 
                ...greenSets["1"].map(id => [id, "rood"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
                ...mapIds(greenSets["2"], "groen"),
            },
            simulatorStatus: {
                roadway: {},
                special: {},
                priority_vehicle: {},
                bridge: {}
            },
            Ncyclus: 6
        },
        {
            name: "6 to 7, oranje- stage 2",
            start: {
                ...trafficlightStatusInitial,
                ...mapIds(greenSets["2"], "groen")
            },
            expectedEnd: {
                ...trafficlightStatusInitial, 
                ...mapIds(greenSets["2"], "oranje")
            },
            simulatorStatus: {
                roadway: {},
                special: {},
                priority_vehicle: {},
                bridge: {}
            },
            Ncyclus: 7
        },
        {
            name: "7 to 8, oranje- stage 2",
            start: {
                ...trafficlightStatusInitial,
                ...mapIds(greenSets["2"], "groen") // not an expected start-state, but it a feature that can be used in later versions to skip the waiting for the orange light to go red.
            },
            expectedEnd: {
                ...trafficlightStatusInitial, 
                ...mapIds(greenSets["2"], "oranje")
            },
            simulatorStatus: {
                roadway: {},
                special: {},
                priority_vehicle: {},
                bridge: {}
            },
            Ncyclus: 8
        },
        {
            name: "8 to 9, groen- stage 3",
            start: {
                ...trafficlightStatusInitial,
                ...mapIds(greenSets["2"], "oranje")
            },
            expectedEnd: {
                ...trafficlightStatusInitial, 
                ...greenSets["2"].map(id => [id, "rood"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
                ...mapIds(greenSets["3"], "groen"),
            },
            simulatorStatus: {
                roadway: {},
                special: {},
                priority_vehicle: {},
                bridge: {}
            },
            Ncyclus: 9
        },
        {
            name: "15 to 16, oranje- stage 5",
            start: {
                ...trafficlightStatusInitial,
                ...mapIds(greenSets["5"], "groen"),
                ...mapIds(crossingPedNOTIslandIdSet, "groen"),
            },
            expectedEnd: {
                ...trafficlightStatusInitial, 
                ...mapIds(greenSets["5"], "oranje"),
                ...mapIds(crossingPedNOTIslandIdSet, "groen"),
            },
            simulatorStatus: {
                roadway: {},
                special: {},
                priority_vehicle: {},
                bridge: {}
            },
            Ncyclus: 16
        },
        {
            name: "16 to 17, oranje- stage 5",
            start: {
                ...trafficlightStatusInitial,
                ...mapIds(greenSets["5"], "groen"),
                ...mapIds(crossingPedNOTIslandIdSet, "groen"),
            },
            expectedEnd: {
                ...trafficlightStatusInitial, 
                ...mapIds(greenSets["5"], "oranje"),
                ...mapIds(crossingPedNOTIslandIdSet, "groen"),
            },
            simulatorStatus: {
                roadway: {},
                special: {},
                priority_vehicle: {},
                bridge: {}
            },
            Ncyclus: 17
        },
        {
            name: "17 to 18, groen- stage 5",
            start: {
                ...trafficlightStatusInitial,
                ...mapIds(greenSets["5"], "oranje")
            },
            expectedEnd: {
                ...trafficlightStatusInitial, 
                ...mapIds(greenSets["5"], "rood"),
                ...mapIds(greenSets["1"], "groen"),
            },
            simulatorStatus: {
                roadway: {},
                special: {},
                priority_vehicle: {},
                bridge: {}
            },
            Ncyclus: 18
        },
        {
            name: "all to red, because priority vehicle with level 1 is coming",
            start: {
                ...trafficlightStatusInitial,
            },
            expectedEnd: {
                ...trafficlightStatusInitial,
                ...{"11.1": "groen"}
            },
            simulatorStatus: {
                roadway: {},
                special: {},
                priority_vehicle: {
                    queue: [
                        {
                            baan: "11.1",
                            simulatie_tijd_ms: 3925764893,
                            prioriteit: 1
                        }
                    ]
                },
                bridge: {}
            },
            Ncyclus: 2
        },
        {
            name: "all to red; priority vehicle lvl 1, chooses first in list",
            start: {
                ...trafficlightStatusInitial,
            },
            expectedEnd: {
                ...trafficlightStatusInitial,
                ...{"11.1": "groen"}
            },
            simulatorStatus: {
                roadway: {},
                special: {},
                priority_vehicle: {
                    queue: [
                        {
                            baan: "11.1",
                            simulatie_tijd_ms: 3925764893,
                            prioriteit: 1
                        },
                        {
                            baan: "8.1",
                            simulatie_tijd_ms: 3925764893,
                            prioriteit: 1
                        }
                    ]
                },
                bridge: {}
            },
            Ncyclus: 2
        },
        // {
        //     name: "nothing to 1",
        //     start: ,
        //     expectedEnd: ,
        //     simulatorStatus: ,
        //     Ncyclus: 
        // },
    ])(
        "$name",
        ({start, expectedEnd, simulatorStatus, Ncyclus}) => {            
            updateCrossingLights(
                simulatorStatus, start, Ncyclus
            );

            expect(start).toEqual(expectedEnd);
        }
    );
});

describe("changes Ncylcus on updateCrossingLights", () => {
    test.each([
        {
            name: "1 to 2, because nothing (relevant) happend",
            simulatorStatus: {
                roadway: {},
                special: {},
                priority_vehicle: {},
                bridge: {}
            },
            Ncyclus: 1,
            newNcyclus: 2,
        },
        {
            name: "2 to 3, because nothing (relevant) happend",
            simulatorStatus: {
                roadway: {},
                special: {},
                priority_vehicle: {},
                bridge: {}
            },
            Ncyclus: 2,
            newNcyclus: 3,
        },
        {
            name: "1 to 3, because a priority vehicle level 2 is comming",
            simulatorStatus: {
                roadway: {},
                special: {},
                priority_vehicle: {
                    queue: [
                        {
                            baan: "11.1", // is from set "4" 4 rounds × 3 inner rounds + 1 for passing to the next round = 13
                            simulatie_tijd_ms: 3925764893,
                            prioriteit: 2
                        }
                    ]
                },
                bridge: {}
            },
            Ncyclus: 2,
            newNcyclus: 13,
        },
    ])(
    "$name",
    ({simulatorStatus, Ncyclus, newNcyclus}) => {
        expect(updateCrossingLights(simulatorStatus, {...trafficlightStatusInitial}, Ncyclus)).toBe(newNcyclus);
    });
});


describe("changes to bridge on updateCrossingLights", () => {
    test.each([
        {
            name: "if pass boats is not ready, set default - I",
            start: {
                ...trafficlightStatusInitial,
            },
            expectedEnd: {
                ...trafficlightStatusInitial,
                ...mapIds([
                    "41.1", "42.1",
                    "51.1", "52.1", "53.1", "54.1",
                    "61.1", "62.1", "63.1", "64.1"
                ], "groen")
            },
            simulatorStatus: {
                roadway: {},
                special: {},
                priority_vehicle: {},
                bridge: {}
            },
            passBoats: {
                isReady: false
            }
        },
        {
            name: "if pass boats is ready, set non-slagbomen rood - II",
            start: {
                ...trafficlightStatusInitial,
                ...mapIds([
                    "41.1", "42.1", // car-lane
                    "51.1", "52.1", "53.1", "54.1", // ped-lane
                    "61.1", "62.1", "63.1", "64.1" //  slagbomen
                ], "groen")
            },
            expectedEnd: {
                ...trafficlightStatusInitial,
                ...mapIds([
                    "61.1", "62.1", "63.1", "64.1", "81.1"
                ], "groen")
            },
            simulatorStatus: {
                roadway: {},
                special: { brug_wegdek: true },
                priority_vehicle: {},
                bridge: {}
            },
            passBoats: { isReady: true }
        },
        {
            name: "if brug wegdek is empty, set slagbomen rood - III",
            start: {
                ...trafficlightStatusInitial,
                ...mapIds([
                    "61.1", "62.1", "63.1", "64.1", "81.1"
                ], "groen")
            },
            expectedEnd: {
                ...trafficlightStatusInitial,
                ...mapIds([
                    "81.1"
                ], "groen")
            },
            simulatorStatus: {
                roadway: {},
                special: { brug_wegdek: false },
                priority_vehicle: {},
                bridge: {}
            },
            passBoats: { isReady: true }
        },
        {
            name: "if bridge is open and no boats on sensors, set boat lights rood - IV",
            start: {
                ...trafficlightStatusInitial,
                ...mapIds([
                    "81.1", "71.1", "72.1"
                ], "groen")
            },
            expectedEnd: {
                ...trafficlightStatusInitial,
                ...mapIds([
                    "81.1"
                ], "groen")
            },
            simulatorStatus: {
                roadway: {},
                special: { brug_wegdek: false },
                priority_vehicle: {},
                bridge: {}
            },
            passBoats: { isReady: true }
        },
        {
            name: "if no boat is on the water, set close bridge - V", // brug_water
            start: {
                ...trafficlightStatusInitial,
                ...mapIds([
                    "81.1"
                ], "groen")
            },
            expectedEnd: {
                ...trafficlightStatusInitial,
                ...mapIds([
                    "81.1"
                ], "rood")
            },
            simulatorStatus: {
                roadway: {},
                special: { brug_wegdek: false, brug_water: false },
                priority_vehicle: {},
                bridge: {}
            },
            passBoats: { isReady: true }
        },
    ])(
        "$name",
        ({start, expectedEnd, simulatorStatus, passBoats}) => {     
            updateBridgeLights(
                simulatorStatus, start, passBoats)

            expect(start).toEqual(expectedEnd);
        }
    );
});

/**
 * 
 * @param {Array[string]} idList 
 * @param {string} newStatus 
 * @returns 
 */
function mapIds(idList, newStatus="rood") {
    return idList.map(id => [id, newStatus]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {});
}

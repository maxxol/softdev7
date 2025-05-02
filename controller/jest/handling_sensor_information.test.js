/**
 * @deprecated uses the old way traffic light information was handled. Remains in here for use when testing and fixing the new way(see src/handle_traffic_light_update.js)
 */

const green_sets = require('../config/green_sets.json');
const { getTrafficLightStatusCrossing, updateTrafficLightStatusBridge } = require('../src/handling_sensor_information');
const { crossingIdSet } = require('../src/utils');

describe('getTrafficLightStatusCrossing', () => {
    test.each([
        {
            name: "cycle from nothing to 1, no sensor influence",
            bridgeStatus: { 
                ...crossingIdSet.map(id => [id, { voor: false, achter: false}]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {})
            },
            Ncyclus: 1,
            start: {
                ...crossingIdSet.map(id => [id, "rood"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {})
            },
            expected: {
                ...crossingIdSet.map(id => [id, "rood"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
                ...green_sets["1"].map(id => [id, "groen"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
            }
        },
        {
            name: "cycle from 1 to 2, no sensor influence",
            bridgeStatus: { 
                ...crossingIdSet.map(id => [id, { voor: false, achter: false}]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {})
            },
            Ncyclus: 2,
            start: {
                ...crossingIdSet.map(id => [id, "rood"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
                ...green_sets["1"].map(id => [id, "groen"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
            },
            expected: {
                ...crossingIdSet.map(id => [id, "rood"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
                ...green_sets["1"].map(id => [id, "oranje"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
            }
        },
        {
            name: "cycle from 2 to 3, no sensor influence",
            bridgeStatus: { 
                ...crossingIdSet.map(id => [id, { voor: false, achter: false}]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {})
            },
            Ncyclus: 3,
            start: {
                ...crossingIdSet.map(id => [id, "rood"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
                ...green_sets["1"].map(id => [id, "oranje"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
            },
            expected: {
                ...crossingIdSet.map(id => [id, "rood"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
                ...green_sets["2"].map(id => [id, "groen"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
            }
        },
        {
            name: "cycle from 3 to 4, no sensor influence",
            bridgeStatus: { 
                ...crossingIdSet.map(id => [id, { voor: false, achter: false}]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {})
            },
            Ncyclus: 4,
            start: {
                ...crossingIdSet.map(id => [id, "rood"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
                ...green_sets["2"].map(id => [id, "groen"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
            },
            expected: {
                ...crossingIdSet.map(id => [id, "rood"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
                ...green_sets["2"].map(id => [id, "oranje"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
            }
        },
        {
            name: "cycle from 4 to 5, no sensor influence",
            bridgeStatus: { 
                ...crossingIdSet.map(id => [id, { voor: false, achter: false}]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {})
            },
            Ncyclus: 5,
            start: {
                ...crossingIdSet.map(id => [id, "rood"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
                ...green_sets["2"].map(id => [id, "oranje"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
            },
            expected: {
                ...crossingIdSet.map(id => [id, "rood"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
                ...green_sets["3"].map(id => [id, "groen"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
            }
        },
        {
            name: "cycle from 5 to 6, no sensor influence",
            bridgeStatus: { 
                ...crossingIdSet.map(id => [id, { voor: false, achter: false}]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {})
            },
            Ncyclus: 6,
            start: {
                ...crossingIdSet.map(id => [id, "rood"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
                ...green_sets["3"].map(id => [id, "groen"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
            },
            expected: {
                ...crossingIdSet.map(id => [id, "rood"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
                ...green_sets["3"].map(id => [id, "oranje"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
            }
        },
        {
            name: "cycle from 6 to 7, no sensor influence",
            bridgeStatus: { 
                ...crossingIdSet.map(id => [id, { voor: false, achter: false}]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {})
            },
            Ncyclus: 7,
            start: {
                ...crossingIdSet.map(id => [id, "rood"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
                ...green_sets["3"].map(id => [id, "oranje"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
            },
            expected: {
                ...crossingIdSet.map(id => [id, "rood"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
                ...green_sets["4"].map(id => [id, "groen"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
            }
        },
        {
            name: "cycle from 7 to 8, no sensor influence",
            bridgeStatus: { 
                ...crossingIdSet.map(id => [id, { voor: false, achter: false}]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {})
            },
            Ncyclus: 8,
            start: {
                ...crossingIdSet.map(id => [id, "rood"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
                ...green_sets["4"].map(id => [id, "groen"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
            },
            expected: {
                ...crossingIdSet.map(id => [id, "rood"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
                ...green_sets["4"].map(id => [id, "oranje"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
            }
        },
        {
            name: "cycle from 8 to 9, no sensor influence",
            bridgeStatus: { 
                ...crossingIdSet.map(id => [id, { voor: false, achter: false}]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {})
            },
            Ncyclus: 9,
            start: {
                ...crossingIdSet.map(id => [id, "rood"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
                ...green_sets["4"].map(id => [id, "oranje"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
            },
            expected: {
                ...crossingIdSet.map(id => [id, "rood"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
                ...green_sets["5"].map(id => [id, "groen"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
            }
        },
        {
            name: "cycle from 9 to 10, no sensor influence",
            bridgeStatus: { 
                ...crossingIdSet.map(id => [id, { voor: false, achter: false}]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {})
            },
            Ncyclus: 10,
            start: {
                ...crossingIdSet.map(id => [id, "rood"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
                ...green_sets["5"].map(id => [id, "groen"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
            },
            expected: {
                ...crossingIdSet.map(id => [id, "rood"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
                ...green_sets["5"].map(id => [id, "oranje"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
            }
        },
        {
            name: "cycle from 10 to 1, no sensor influence",
            bridgeStatus: { 
                ...crossingIdSet.map(id => [id, { voor: false, achter: false}]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {})
            },
            Ncyclus: 1,
            start: {
                ...crossingIdSet.map(id => [id, "rood"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
                ...green_sets["5"].map(id => [id, "oranje"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
            },
            expected: {
                ...crossingIdSet.map(id => [id, "rood"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
                ...green_sets["1"].map(id => [id, "groen"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
            }
        },
        // {
        //     name: "cycle from 10 to 1, no sensor influence",
        //     bridgeStatus: { 
        //         ...crossingIdSet.map(id => [id, { voor: false, achter: false}]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {})
        //     },
        //     Ncyclus: 1,
        //     start: {
        //         ...crossingIdSet.map(id => [id, "rood"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
        //         ...green_sets["5"].map(id => [id, "groen"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {})
        //     },
        //     expected: {
        //         ...crossingIdSet.map(id => [id, "rood"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {}),
        //         ...green_sets["1"].map(id => [id, "groen"]).reduce((acc, [id, status]) => ({ ...acc, [id]: status }), {})
        //     }
        // },
    ])(
        "... when $name",
        ({start, expected, bridgeStatus, Ncyclus}) => {

            // const expectedTrafficLightStatusCrossing = {
            //     ...expected
            // };
            
            getTrafficLightStatusCrossing(
                start, bridgeStatus, Ncyclus
            );

            expect(start).toEqual(expected);
        }
    )
});



describe("handle bridge and/or water way traffic lights", () => {
     const baseStatus = {
        "51.1": "rood", "52.1": "rood", 
        "53.1": "rood", "54.1": "rood", 
        "41.1": "rood", "42.1": "rood"
    };

    test.each([
        {
            name: "keep going with default if any param is invalid - I",
            bridgeStatus: {  },
            boatSensors: { "71.1": {voor: false}, "72.1": {voor: false} },
            passBoats: { isReady: false },
            priorityVehicleStatus: { queue: [] },
            start: { 
                "41.1": "rood", "42.1": "rood",
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "61.1": "rood", "62.1": "rood",
                "63.1": "rood", "64.1": "rood",
                "72.1": "rood", "71.1": "rood" 
            },
            expected: { 
                "41.1": "groen", "42.1": "groen",
                "51.1": "groen", "52.1": "groen", 
                "53.1": "groen", "54.1": "groen", 
                "61.1": "groen", "62.1": "groen",
                "63.1": "groen", "64.1": "groen",
                "72.1": "rood", "71.1": "rood" 
            }
        },
        {
            name: "keep starting status if any param is invalid - II",
            bridgeStatus: { "81.1": {  } },
            boatSensors: { "71.1": {voor: false}, "72.1": {voor: false} },
            passBoats: { isReady: false },
            priorityVehicleStatus: { queue: [] },
            start: { 
                "41.1": "rood", "42.1": "rood",
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "61.1": "rood", "62.1": "rood",
                "63.1": "rood", "64.1": "rood",
                "72.1": "rood", "71.1": "rood" 
            },
            expected: { 
                "41.1": "groen", "42.1": "groen",
                "51.1": "groen", "52.1": "groen", 
                "53.1": "groen", "54.1": "groen", 
                "61.1": "groen", "62.1": "groen",
                "63.1": "groen", "64.1": "groen",
                "72.1": "rood", "71.1": "rood" 
            }
        },
        {
            name: "return starting status if any param is invalid - III",
            bridgeStatus: { "81.1": { state: "dicht" } },
            boatSensors: { "71.1": {voor: "string"}, "72.1": {voor: false} },
            passBoats: { isReady: false },
            priorityVehicleStatus: { queue: [] },
            start: { 
                "41.1": "rood", "42.1": "rood",
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "61.1": "rood", "62.1": "rood",
                "63.1": "rood", "64.1": "rood",
                "72.1": "rood", "71.1": "rood" 
            },
            expected: { 
                "41.1": "groen", "42.1": "groen",
                "51.1": "groen", "52.1": "groen", 
                "53.1": "groen", "54.1": "groen", 
                "61.1": "groen", "62.1": "groen",
                "63.1": "groen", "64.1": "groen",
                "72.1": "rood", "71.1": "rood" 
            }
        },
        {
            name: " return starting status if any param is invalid - IV",
            bridgeStatus: { "81.1": { state: "dicht" } },
            boatSensors: { "71.1": {   }, "72.1": {voor: false} },
            passBoats: { isReady: false },
            priorityVehicleStatus: { queue: [] },
            start: { 
                "41.1": "rood", "42.1": "rood",
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "61.1": "rood", "62.1": "rood",
                "63.1": "rood", "64.1": "rood",
                "72.1": "rood", "71.1": "rood" 
            },
            expected: { 
                "41.1": "groen", "42.1": "groen",
                "51.1": "groen", "52.1": "groen", 
                "53.1": "groen", "54.1": "groen", 
                "61.1": "groen", "62.1": "groen",
                "63.1": "groen", "64.1": "groen",
                "72.1": "rood", "71.1": "rood" 
            }
        },
        {
            name: "keep starting status if any param is invalid - V",
            bridgeStatus: { "81.1": { state: "dicht" } },
            boatSensors: {   },
            passBoats: { isReady: false },
            priorityVehicleStatus: { queue: [] },
            start: { 
                "41.1": "rood", "42.1": "rood",
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "61.1": "rood", "62.1": "rood",
                "63.1": "rood", "64.1": "rood",
                "72.1": "rood", "71.1": "rood" 
            },
            expected: { 
                "41.1": "groen", "42.1": "groen",
                "51.1": "groen", "52.1": "groen", 
                "53.1": "groen", "54.1": "groen", 
                "61.1": "groen", "62.1": "groen",
                "63.1": "groen", "64.1": "groen",
                "72.1": "rood", "71.1": "rood" 
            }
        },
        {
            name: "keep starting status if any param is invalid - VI",
            bridgeStatus: { "81.1": { state: "dicht" } },
            boatSensors: { "71.1": {voor: false}, "72.1": {voor: false} },
            passBoats: {   },
            priorityVehicleStatus: { queue: [] },
            start: { 
                "41.1": "rood", "42.1": "rood",
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "61.1": "rood", "62.1": "rood",
                "63.1": "rood", "64.1": "rood",
                "72.1": "rood", "71.1": "rood" 
            },
            expected: { 
                "41.1": "groen", "42.1": "groen",
                "51.1": "groen", "52.1": "groen", 
                "53.1": "groen", "54.1": "groen", 
                "61.1": "groen", "62.1": "groen",
                "63.1": "groen", "64.1": "groen",
                "72.1": "rood", "71.1": "rood" 
            }
        },
        { // assuming bridge closes when boat traffic lights are red
            name: "... on no boats on sensors, bridge closed, passBoats not ready",
            bridgeStatus: { "81.1": { state: "dicht" } },
            boatSensors: { "71.1": {voor: false}, "72.1": {voor: false} },
            passBoats: { isReady: false },
            priorityVehicleStatus: { queue: [] },
            start: { 
                "41.1": "rood", "42.1": "rood",
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "61.1": "rood", "62.1": "rood",
                "63.1": "rood", "64.1": "rood",
                "72.1": "rood", "71.1": "rood" 
            },
            expected: { 
                "41.1": "groen", "42.1": "groen",
                "51.1": "groen", "52.1": "groen", 
                "53.1": "groen", "54.1": "groen", 
                "61.1": "groen", "62.1": "groen",
                "63.1": "groen", "64.1": "groen",
                "72.1": "rood", "71.1": "rood" 
            }
        },
        {
            name: "boats on sensors, bridge closed, passBoats not ready - I",
            bridgeStatus: { "81.1": { state: "dicht" } },
            boatSensors: { "71.1": {voor: true}, "72.1": {voor: false} },
            passBoats: { isReady: false },
            priorityVehicleStatus: { queue: [] },
            start: { // assuming passBoats is not ready, bridge lights will be green 
                "41.1": "groen", "42.1": "groen",
                "51.1": "groen", "52.1": "groen", 
                "53.1": "groen", "54.1": "groen", 
                "61.1": "groen", "62.1": "groen",
                "63.1": "groen", "64.1": "groen",
                "72.1": "rood", "71.1": "rood" 
            },
            expected: {  
                "41.1": "groen", "42.1": "groen",
                "51.1": "groen", "52.1": "groen", 
                "53.1": "groen", "54.1": "groen", 
                "61.1": "groen", "62.1": "groen",
                "63.1": "groen", "64.1": "groen",
                "72.1": "rood", "71.1": "rood" 
            }
        },
        {
            name: "boats on sensors, bridge closed, passBoats not ready - II",
            bridgeStatus: { "81.1": { state: "dicht" } },
            boatSensors: { "71.1": {voor: false}, "72.1": {voor: true} },
            passBoats: { isReady: false },
            priorityVehicleStatus: { queue: [] },
            start: { // assuming passBoats is not ready, bridge lights will be green
                "41.1": "groen", "42.1": "groen",
                "51.1": "groen", "52.1": "groen", 
                "53.1": "groen", "54.1": "groen", 
                "61.1": "groen", "62.1": "groen",
                "63.1": "groen", "64.1": "groen",
                "72.1": "rood", "71.1": "rood" 
            },
            expected: {  
                "41.1": "groen", "42.1": "groen",
                "51.1": "groen", "52.1": "groen", 
                "53.1": "groen", "54.1": "groen", 
                "61.1": "groen", "62.1": "groen",
                "63.1": "groen", "64.1": "groen",
                "72.1": "rood", "71.1": "rood" 
            }
        },
        {
            name: "boats on sensors, bridge closed, passBoats not ready - III",
            bridgeStatus: { "81.1": { state: "dicht" } },
            boatSensors: { "71.1": {voor: true}, "72.1": {voor: true} },
            passBoats: { isReady: false },
            priorityVehicleStatus: { queue: [] },
            start: { // assuming passBoats is not ready, bridge lights will be green
                "41.1": "groen", "42.1": "groen",
                "51.1": "groen", "52.1": "groen", 
                "53.1": "groen", "54.1": "groen", 
                "61.1": "groen", "62.1": "groen",
                "63.1": "groen", "64.1": "groen",
                "72.1": "rood", "71.1": "rood" 
            },
            expected: {  
                "41.1": "groen", "42.1": "groen",
                "51.1": "groen", "52.1": "groen", 
                "53.1": "groen", "54.1": "groen", 
                "61.1": "groen", "62.1": "groen",
                "63.1": "groen", "64.1": "groen",
                "72.1": "rood", "71.1": "rood" 
            }
        },
        { // assuming passBoats is only ready when boats are on sensors
            name: "boats on sensors, bridge closed, passBoats ready - I",
            bridgeStatus: { "81.1": { state: "dicht" } },
            boatSensors: { "71.1": {voor: true}, "72.1": {voor: false} },
            passBoats: { isReady: true },
            priorityVehicleStatus: { queue: [] },
            start: { // assuming passBoats is just got ready, bridge lights will be green
                "41.1": "groen", "42.1": "groen",
                "51.1": "groen", "52.1": "groen", 
                "53.1": "groen", "54.1": "groen", 
                "61.1": "groen", "62.1": "groen",
                "63.1": "groen", "64.1": "groen",
                "72.1": "rood", "71.1": "rood" 
            },
            expected: { 
                "41.1": "rood", "42.1": "rood",
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "61.1": "rood", "62.1": "rood",
                "63.1": "rood", "64.1": "rood",
                "72.1": "rood", "71.1": "rood" 
            }
        },
        { // assuming passBoats is only ready when boats are on sensors
            name: "boats on sensors, bridge closed, passBoats ready - II",
            bridgeStatus: { "81.1": { state: "dicht" } },
            boatSensors: { "71.1": {voor: false}, "72.1": {voor: true} },
            passBoats: { isReady: true },
            priorityVehicleStatus: { queue: [] },
            start: { // assuming passBoats is just got ready, bridge lights will be green
                "41.1": "groen", "42.1": "groen",
                "51.1": "groen", "52.1": "groen", 
                "53.1": "groen", "54.1": "groen", 
                "61.1": "groen", "62.1": "groen",
                "63.1": "groen", "64.1": "groen",
                "72.1": "rood", "71.1": "rood" 
            },
            expected: { 
                "41.1": "rood", "42.1": "rood",
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "61.1": "rood", "62.1": "rood",
                "63.1": "rood", "64.1": "rood",
                "72.1": "rood", "71.1": "rood" 
            }
        },
        { // assuming passBoats is only ready when boats are on sensors
            name: "boats on sensors, bridge closed, passBoats ready - III",
            bridgeStatus: { "81.1": { state: "dicht" } },
            boatSensors: { "71.1": {voor: true}, "72.1": {voor: true} },
            passBoats: { isReady: true },
            priorityVehicleStatus: { queue: [] },
            start: { // assuming passBoats is just got ready, bridge lights will be green
                "41.1": "groen", "42.1": "groen",
                "51.1": "groen", "52.1": "groen", 
                "53.1": "groen", "54.1": "groen", 
                "61.1": "groen", "62.1": "groen",
                "63.1": "groen", "64.1": "groen",
                "72.1": "rood", "71.1": "rood" 
            },
            expected: { 
                "41.1": "rood", "42.1": "rood",
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "61.1": "rood", "62.1": "rood",
                "63.1": "rood", "64.1": "rood",
                "72.1": "rood", "71.1": "rood" 
            }
        },
        { // assuming bridge goes open when bridge traffic lights are red
            name: "boats on sensors, bridge open, passBoats ready - I",
            bridgeStatus: { "81.1": { state: "open" } },
            boatSensors: { "71.1": {voor: true}, "72.1": {voor: false} },
            passBoats: { isReady: true },
            priorityVehicleStatus: { queue: [] },
            start: { // assuming bridge just opened up, that all lights are red
                "41.1": "rood", "42.1": "rood",
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "61.1": "rood", "62.1": "rood",
                "63.1": "rood", "64.1": "rood",
                "72.1": "rood", "71.1": "rood" 
            },
            expected: { 
                "41.1": "rood", "42.1": "rood",
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "61.1": "rood", "62.1": "rood",
                "63.1": "rood", "64.1": "rood",
                "71.1": "groen", "72.1": "rood"
            }
        },
        { // assuming bridge goes open when bridge traffic lights are red
            name: "boats on sensors, bridge open, passBoats ready - II",
            bridgeStatus: { "81.1": { state: "open" } },
            boatSensors: { "71.1": {voor: false}, "72.1": {voor: true} },
            passBoats: { isReady: true },
            priorityVehicleStatus: { queue: [] },
            start: { // assuming bridge just opened up, that all lights are red
                "41.1": "rood", "42.1": "rood",
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "61.1": "rood", "62.1": "rood",
                "63.1": "rood", "64.1": "rood",
                "72.1": "rood", "71.1": "rood" 
            },
            expected: { 
                "41.1": "rood", "42.1": "rood",
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "61.1": "rood", "62.1": "rood",
                "63.1": "rood", "64.1": "rood",
                "71.1": "rood", "72.1": "groen"
            }
        },
        { // assuming bridge goes open when bridge traffic lights are red
            name: "boats on sensors, bridge open, passBoats ready - III",
            bridgeStatus: { "81.1": { state: "open" } },
            boatSensors: { "71.1": {voor: true}, "72.1": {voor: true} },
            passBoats: { isReady: true },
            priorityVehicleStatus: { queue: [] },
            start: { // assuming bridge just opened up, that all lights are red
                "41.1": "rood", "42.1": "rood",
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "61.1": "rood", "62.1": "rood",
                "63.1": "rood", "64.1": "rood",
                "72.1": "rood", "71.1": "rood" 
            },
            expected: { 
                "41.1": "rood", "42.1": "rood",
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "61.1": "rood", "62.1": "rood",
                "63.1": "rood", "64.1": "rood",
                "71.1": "groen", "72.1": "rood" // north has priority over south
            }
        },
        {
            name: "boats on sensors, bridge open, passBoats ready - IV",
            bridgeStatus: { "81.1": { state: "open" } },
            boatSensors: { "71.1": {voor: false}, "72.1": {voor: true} }, // assuming sensor 71.1 is empty, since the traffic light has been green before
            passBoats: { isReady: true },
            priorityVehicleStatus: { queue: [] },
            start: { // 
                "41.1": "rood", "42.1": "rood",
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "61.1": "rood", "62.1": "rood",
                "63.1": "rood", "64.1": "rood",
                "71.1": "groen", "72.1": "rood"
            },
            expected: { 
                "41.1": "rood", "42.1": "rood",
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "61.1": "rood", "62.1": "rood",
                "63.1": "rood", "64.1": "rood",
                "71.1": "rood", "72.1": "groen" 
            }
        },
        {
            name: "no boats on sensors anymore, bridge open, passBoats ready - V",
            bridgeStatus: { "81.1": { state: "open" } },
            boatSensors: { "71.1": {voor: false}, "72.1": {voor: false} },
            passBoats: { isReady: true },
            priorityVehicleStatus: { queue: [] },
            start: {
                "41.1": "rood", "42.1": "rood",
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "61.1": "rood", "62.1": "rood",
                "63.1": "rood", "64.1": "rood",
                "71.1": "rood", "72.1": "groen"
            },
            expected: { 
                "41.1": "rood", "42.1": "rood",
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "61.1": "rood", "62.1": "rood",
                "63.1": "rood", "64.1": "rood",
                "72.1": "rood", "71.1": "rood" 
            },
            expectedPassBoatsIsReady: false // passBoats should be set to false, since no boats are on the sensors anymore
        },
        {
            name: "no boats on sensors, bridge is still open, passBoats not ready",
            bridgeStatus: { "81.1": { state: "open" } },
            boatSensors: { "71.1": {voor: false}, "72.1": {voor: false} },
            passBoats: { isReady: false },
            priorityVehicleStatus: { queue: [] },
            start: {
                "41.1": "rood", "42.1": "rood",
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "61.1": "rood", "62.1": "rood",
                "63.1": "rood", "64.1": "rood",
                "72.1": "rood", "71.1": "rood" 
            },
            expected: { // do nothing, since the bridge is still open and no boats are on the sensors
                "41.1": "rood", "42.1": "rood",
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "61.1": "rood", "62.1": "rood",
                "63.1": "rood", "64.1": "rood",
                "72.1": "rood", "71.1": "rood" 
            }
        }, // >> Continues to the state of test case 1
        {
            name: "priority vehicle is going to the bridge, passBoats is ready",
            bridgeStatus: { "81.1": { state: "closed" } },
            boatSensors: { "71.1": {voor: true}, "72.1": {voor: false} },
            passBoats: { isReady: true },
            priorityVehicleStatus: { queue: [{ baan: "4.1", simulatie_tijd_ms: 1231456352542, prioriteit: 1 }] },
            start: {
                "41.1": "groen", "42.1": "groen",
                "51.1": "groen", "52.1": "groen", 
                "53.1": "groen", "54.1": "groen", 
                "61.1": "groen", "62.1": "groen",
                "63.1": "groen", "64.1": "groen",
                "72.1": "rood", "71.1": "rood" 
            },
            expected: { // do nothing (yet), since a priority vehicle is incoming
                "41.1": "groen", "42.1": "groen",
                "51.1": "groen", "52.1": "groen", 
                "53.1": "groen", "54.1": "groen", 
                "61.1": "groen", "62.1": "groen",
                "63.1": "groen", "64.1": "groen",
                "72.1": "rood", "71.1": "rood" 
            }
        },
        {
            name: "priority vehicle is not to the bridge, passBoats is ready",
            bridgeStatus: { "81.1": { state: "closed" } },
            boatSensors: { "71.1": {voor: true}, "72.1": {voor: false} },
            passBoats: { isReady: true },
            priorityVehicleStatus: { queue: [{ baan: "1.1", simulatie_tijd_ms: 1231456352542, prioriteit: 1 }] },
            start: {
                "41.1": "groen", "42.1": "groen",
                "51.1": "groen", "52.1": "groen", 
                "53.1": "groen", "54.1": "groen", 
                "61.1": "groen", "62.1": "groen",
                "63.1": "groen", "64.1": "groen",
                "72.1": "rood", "71.1": "rood" 
            },
            expected: { // do nothing (yet), since a priority vehicle is incoming
                "41.1": "rood", "42.1": "rood",
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "61.1": "rood", "62.1": "rood",
                "63.1": "rood", "64.1": "rood",
                "72.1": "rood", "71.1": "rood" 
            }
        }
    ])(
        "should $name",
        ({ bridgeStatus, boatSensors, passBoats, start, expected, expectedPassBoatsIsReady, priorityVehicleStatus }) => {
            const startTrafficLightStatusBridge = {
                ...baseStatus,
                ...start
            };
            const expectedTrafficLightStatusBridge = {
                ...baseStatus,
                ...expected
            };
            console.log(passBoats);
            
            updateTrafficLightStatusBridge(
                startTrafficLightStatusBridge,
                bridgeStatus,
                boatSensors,
                passBoats,
                priorityVehicleStatus
            );

            expect(startTrafficLightStatusBridge).toEqual(expectedTrafficLightStatusBridge);

            if (expectedPassBoatsIsReady !== undefined) {
                // Check if passBoats.isReady is set correctly
                expect(passBoats.isReady).toBe(expectedPassBoatsIsReady);
            }
        }
    );

})
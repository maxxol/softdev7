const green_sets = require('../config/green_sets.json');
const { getTrafficLightStatusCrossing, getTrafficLightStatusOnSensorBridgeUpdate } = require('../src/handling_sensor_information');
const {crossingIdSet} = require('../src/utils');

describe('getTrafficLightStatusCrossing', () => {
    test.each([
        // {
        //     name: "",
        //     sensorRoadwayStatus: { 
        //         "12.1":     { voor: false, achter: false},  "8.1":  { voor: false, achter: false}, "8.2":   {voor: false, achter: false}, "4.1":   {voor: false, achter: false}, 
        //         "1.1":      { voor: false, achter: false},  "2.1":  { voor: false, achter: false}, "2.2":   {voor: false, achter: false}, "3.1":   {voor: false, achter: false}, 
        //         "3.6":      { voor: false, achter: false},  "5.1":  { voor: false, achter: false}, "6.1":   {voor: false, achter: false}, "7.1":   {voor: false, achter: false}, 
        //         "9.1":      { voor: false, achter: false},  "10.1": { voor: false, achter: false}, "11.1":  {voor: false, achter: false}, "21.1":  {voor: false, achter: false}, 
        //         "22.1":     { voor: false, achter: false},  "24.1": { voor: false, achter: false}, "25.1":  {voor: false, achter: false}, "26.1":  {voor: false, achter: false}, 
        //         "27.1":     { voor: false, achter: false},  "28.1": { voor: false, achter: false}, "31.1":  {voor: false, achter: false}, "31.2":  {voor: false, achter: false}, 
        //         "32.1":     { voor: false, achter: false},  "32.2": { voor: false, achter: false}, "33.1":  {voor: false, achter: false}, "33.2":  {voor: false, achter: false}, 
        //         "34.1":     { voor: false, achter: false},  "34.2": { voor: false, achter: false}, "35.1":  {voor: false, achter: false}, "35.2":  {voor: false, achter: false}, 
        //         "36.1":     { voor: false, achter: false},  "37.1": { voor: false, achter: false}, "37.2":  {voor: false, achter: false} 
        //     },
        //     Ncyclus: 0,
        //     start: {
        //         "1.1": "rood", "2.1": "rood", "2.2": "rood",
        //         "3.1": "rood", "3.6": "rood", "4.1": "rood",
        //         "5.1": "rood", "6.1": "rood", "7.1": "rood",
        //         "8.1": "rood", "8.2": "rood", "9.1": "rood",
        //         "10.1": "rood", "11.1": "rood", "12.1": "rood",
        //         "21.1": "rood", "22.1": "rood", "24.1": "rood",
        //         "25.1": "rood", "26.1": "rood", "27.1": "rood",
        //         "28.1": "rood", "31.1": "rood", "31.2": "rood",
        //         "32.1": "rood", "32.2": "rood", "33.1": "rood",
        //         "33.2": "rood", "34.1": "rood", "34.2": "rood",
        //         "35.1": "rood", "35.2": "rood", "36.1": "rood",
        //         "37.1": "rood", "37.2": "rood"
        //     },
        //     expected: {
        //         "1.1": "rood", "2.1": "rood", "2.2": "rood",
        //         "3.1": "rood", "3.6": "rood", "4.1": "rood",
        //         "5.1": "rood", "6.1": "rood", "7.1": "rood",
        //         "8.1": "rood", "8.2": "rood", "9.1": "rood",
        //         "10.1": "rood", "11.1": "rood", "12.1": "rood",
        //         "21.1": "rood", "22.1": "rood", "24.1": "rood",
        //         "25.1": "rood", "26.1": "rood", "27.1": "rood",
        //         "28.1": "rood", "31.1": "rood", "31.2": "rood",
        //         "32.1": "rood", "32.2": "rood", "33.1": "rood",
        //         "33.2": "rood", "34.1": "rood", "34.2": "rood",
        //         "35.1": "rood", "35.2": "rood", "36.1": "rood",
        //         "37.1": "rood", "37.2": "rood"
        //     }
        // },
        {
            name: "cycle from nothing to 1, no sensor influence",
            sensorRoadwayStatus: { 
                ...crossingIdSet.map(light => [light, { voor: false, achter: false}]).reduce((acc, [light, status]) => ({ ...acc, [light]: status }), {})
            },
            Ncyclus: 1,
            start: {
                ...crossingIdSet.map(light => [light, "rood"]).reduce((acc, [light, status]) => ({ ...acc, [light]: status }), {})
            },
            expected: {
                ...crossingIdSet.map(light => [light, "rood"]).reduce((acc, [light, status]) => ({ ...acc, [light]: status }), {}),
                ...green_sets["1"].map(light => [light, "groen"]).reduce((acc, [light, status]) => ({ ...acc, [light]: status }), {})
            }
        },
        {
            name: "cycle from 1 to 2, no sensor influence",
            sensorRoadwayStatus: { 
                ...crossingIdSet.map(light => [light, { voor: false, achter: false}]).reduce((acc, [light, status]) => ({ ...acc, [light]: status }), {})
            },
            Ncyclus: 2,
            start: {
                ...crossingIdSet.map(light => [light, "rood"]).reduce((acc, [light, status]) => ({ ...acc, [light]: status }), {}),
                ...green_sets["1"].map(light => [light, "groen"]).reduce((acc, [light, status]) => ({ ...acc, [light]: status }), {}),
            },
            expected: {
                ...crossingIdSet.map(light => [light, "rood"]).reduce((acc, [light, status]) => ({ ...acc, [light]: status }), {}),
                ...green_sets["2"].map(light => [light, "groen"]).reduce((acc, [light, status]) => ({ ...acc, [light]: status }), {}),
            }
        },
        {
            name: "cycle from 2 to 3, no sensor influence",
            sensorRoadwayStatus: { 
                ...crossingIdSet.map(light => [light, { voor: false, achter: false}]).reduce((acc, [light, status]) => ({ ...acc, [light]: status }), {})
            },
            Ncyclus: 3,
            start: {
                ...crossingIdSet.map(light => [light, "rood"]).reduce((acc, [light, status]) => ({ ...acc, [light]: status }), {}),
                ...green_sets["2"].map(light => [light, "groen"]).reduce((acc, [light, status]) => ({ ...acc, [light]: status }), {})
            },
            expected: {
                ...crossingIdSet.map(light => [light, "rood"]).reduce((acc, [light, status]) => ({ ...acc, [light]: status }), {}),
                ...green_sets["3"].map(light => [light, "groen"]).reduce((acc, [light, status]) => ({ ...acc, [light]: status }), {})
            }
        },
        {
            name: "cycle from 3 to 4, no sensor influence",
            sensorRoadwayStatus: { 
                ...crossingIdSet.map(light => [light, { voor: false, achter: false}]).reduce((acc, [light, status]) => ({ ...acc, [light]: status }), {})
            },
            Ncyclus: 4,
            start: {
                ...crossingIdSet.map(light => [light, "rood"]).reduce((acc, [light, status]) => ({ ...acc, [light]: status }), {}),
                ...green_sets["3"].map(light => [light, "groen"]).reduce((acc, [light, status]) => ({ ...acc, [light]: status }), {})
            },
            expected: {
                ...crossingIdSet.map(light => [light, "rood"]).reduce((acc, [light, status]) => ({ ...acc, [light]: status }), {}),
                ...green_sets["4"].map(light => [light, "groen"]).reduce((acc, [light, status]) => ({ ...acc, [light]: status }), {})
            }
        },
        {
            name: "cycle from 4 to 5, no sensor influence",
            sensorRoadwayStatus: { 
                ...crossingIdSet.map(light => [light, { voor: false, achter: false}]).reduce((acc, [light, status]) => ({ ...acc, [light]: status }), {})
            },
            Ncyclus: 5,
            start: {
                ...crossingIdSet.map(light => [light, "rood"]).reduce((acc, [light, status]) => ({ ...acc, [light]: status }), {}),
                ...green_sets["4"].map(light => [light, "groen"]).reduce((acc, [light, status]) => ({ ...acc, [light]: status }), {})
            },
            expected: {
                ...crossingIdSet.map(light => [light, "rood"]).reduce((acc, [light, status]) => ({ ...acc, [light]: status }), {}),
                ...green_sets["5"].map(light => [light, "groen"]).reduce((acc, [light, status]) => ({ ...acc, [light]: status }), {})
            }
        },
        {
            name: "cycle from 5 to 1, no sensor influence",
            sensorRoadwayStatus: { 
                ...crossingIdSet.map(light => [light, { voor: false, achter: false}]).reduce((acc, [light, status]) => ({ ...acc, [light]: status }), {})
            },
            Ncyclus: 1,
            start: {
                ...crossingIdSet.map(light => [light, "rood"]).reduce((acc, [light, status]) => ({ ...acc, [light]: status }), {}),
                ...green_sets["5"].map(light => [light, "groen"]).reduce((acc, [light, status]) => ({ ...acc, [light]: status }), {})
            },
            expected: {
                ...crossingIdSet.map(light => [light, "rood"]).reduce((acc, [light, status]) => ({ ...acc, [light]: status }), {}),
                ...green_sets["1"].map(light => [light, "groen"]).reduce((acc, [light, status]) => ({ ...acc, [light]: status }), {})
            }
        },
    ])(
        "should $name",
        ({start, expected, sensorRoadwayStatus, Ncyclus}) => {

            // const expectedTrafficLightStatusCrossing = {
            //     ...expected
            // };
            
            const result = getTrafficLightStatusCrossing(
                start, sensorRoadwayStatus, Ncyclus
            );

            expect(result).toEqual(expected);
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
            name: "should return starting status if any param is invalid - I",
            dataObj: {  },
            sensors: { "71.1": {voor: false}, "72.1": {voor: false} },
            passBoats: { isReady: false },
            priorityVehicleStatus: undefined,
            start: { 
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "41.1": "rood", "42.1": "rood",
                "72.1": "rood", "71.1": "rood" 
            },
            expected: { 
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "41.1": "rood", "42.1": "rood",
                "72.1": "rood", "71.1": "rood" 
            }
        },
        {
            name: "should return starting status if any param is invalid - II",
            dataObj: { "81.1": {  } },
            sensors: { "71.1": {voor: false}, "72.1": {voor: false} },
            passBoats: { isReady: false },
            priorityVehicleStatus: undefined,
            start: { 
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "41.1": "rood", "42.1": "rood",
                "72.1": "rood", "71.1": "rood" 
            },
            expected: { 
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "41.1": "rood", "42.1": "rood",
                "72.1": "rood", "71.1": "rood" 
            }
        },
        {
            name: "should return starting status if any param is invalid - III",
            dataObj: { "81.1": { state: "dicht" } },
            sensors: { "71.1": {voor: "string"}, "72.1": {voor: false} },
            passBoats: { isReady: false },
            priorityVehicleStatus: undefined,
            start: { 
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "41.1": "rood", "42.1": "rood",
                "72.1": "rood", "71.1": "rood" 
            },
            expected: { 
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "41.1": "rood", "42.1": "rood",
                "72.1": "rood", "71.1": "rood" 
            }
        },
        {
            name: "should return starting status if any param is invalid - IV",
            dataObj: { "81.1": { state: "dicht" } },
            sensors: { "71.1": {   }, "72.1": {voor: false} },
            passBoats: { isReady: false },
            priorityVehicleStatus: undefined,
            start: { 
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "41.1": "rood", "42.1": "rood",
                "72.1": "rood", "71.1": "rood" 
            },
            expected: { 
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "41.1": "rood", "42.1": "rood",
                "72.1": "rood", "71.1": "rood" 
            }
        },
        {
            name: "should return starting status if any param is invalid - V",
            dataObj: { "81.1": { state: "dicht" } },
            sensors: {   },
            passBoats: { isReady: false },
            priorityVehicleStatus: undefined,
            start: { 
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "41.1": "rood", "42.1": "rood",
                "72.1": "rood", "71.1": "rood" 
            },
            expected: { 
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "41.1": "rood", "42.1": "rood",
                "72.1": "rood", "71.1": "rood" 
            }
        },
        {
            name: "should return starting status if any param is invalid - VI",
            dataObj: { "81.1": { state: "dicht" } },
            sensors: { "71.1": {voor: false}, "72.1": {voor: false} },
            passBoats: {   },
            priorityVehicleStatus: undefined,
            start: { 
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "41.1": "rood", "42.1": "rood",
                "72.1": "rood", "71.1": "rood" 
            },
            expected: { 
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "41.1": "rood", "42.1": "rood",
                "72.1": "rood", "71.1": "rood" 
            }
        },
        { // assuming bridge closes when boat traffic lights are red
            name: "no boats on sensors, bridge closed, passBoats not ready",
            dataObj: { "81.1": { state: "dicht" } },
            sensors: { "71.1": {voor: false}, "72.1": {voor: false} },
            passBoats: { isReady: false },
            priorityVehicleStatus: undefined,
            start: { 
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "41.1": "rood", "42.1": "rood",
                "72.1": "rood", "71.1": "rood" 
            },
            expected: { 
                "51.1": "groen", "52.1": "groen", 
                "53.1": "groen", "54.1": "groen", 
                "41.1": "groen", "42.1": "groen",
                "71.1": "rood", "72.1": "rood"
            }
        },
        {
            name: "boats on sensors, bridge closed, passBoats not ready - I",
            dataObj: { "81.1": { state: "dicht" } },
            sensors: { "71.1": {voor: true}, "72.1": {voor: false} },
            passBoats: { isReady: false },
            priorityVehicleStatus: undefined,
            start: { // assuming passBoats is not ready, bridge lights will be green
                "51.1": "groen", "52.1": "groen", 
                "53.1": "groen", "54.1": "groen", 
                "41.1": "groen", "42.1": "groen",
                "72.1": "rood", "71.1": "rood" 
            },
            expected: { 
                "51.1": "groen", "52.1": "groen", 
                "53.1": "groen", "54.1": "groen", 
                "41.1": "groen", "42.1": "groen",
                "71.1": "rood", "72.1": "rood"
            }
        },
        {
            name: "boats on sensors, bridge closed, passBoats not ready - II",
            dataObj: { "81.1": { state: "dicht" } },
            sensors: { "71.1": {voor: false}, "72.1": {voor: true} },
            passBoats: { isReady: false },
            priorityVehicleStatus: undefined,
            start: { // assuming passBoats is not ready, bridge lights will be green
                "51.1": "groen", "52.1": "groen", 
                "53.1": "groen", "54.1": "groen", 
                "41.1": "groen", "42.1": "groen",
                "72.1": "rood", "71.1": "rood" 
            },
            expected: { 
                "51.1": "groen", "52.1": "groen", 
                "53.1": "groen", "54.1": "groen", 
                "41.1": "groen", "42.1": "groen",
                "71.1": "rood", "72.1": "rood"
            }
        },
        {
            name: "boats on sensors, bridge closed, passBoats not ready - III",
            dataObj: { "81.1": { state: "dicht" } },
            sensors: { "71.1": {voor: true}, "72.1": {voor: true} },
            passBoats: { isReady: false },
            priorityVehicleStatus: undefined,
            start: { // assuming passBoats is not ready, bridge lights will be green
                "51.1": "groen", "52.1": "groen", 
                "53.1": "groen", "54.1": "groen", 
                "41.1": "groen", "42.1": "groen",
                "72.1": "rood", "71.1": "rood" 
            },
            expected: { 
                "51.1": "groen", "52.1": "groen", 
                "53.1": "groen", "54.1": "groen", 
                "41.1": "groen", "42.1": "groen",
                "71.1": "rood", "72.1": "rood"
            }
        },
        { // assuming passBoats is only ready when boats are on sensors
            name: "boats on sensors, bridge closed, passBoats ready - I",
            dataObj: { "81.1": { state: "dicht" } },
            sensors: { "71.1": {voor: true}, "72.1": {voor: false} },
            passBoats: { isReady: true },
            priorityVehicleStatus: undefined,
            start: { // assuming passBoats is just got ready, bridge lights will be green
                "51.1": "groen", "52.1": "groen", 
                "53.1": "groen", "54.1": "groen", 
                "41.1": "groen", "42.1": "groen",
                "72.1": "rood", "71.1": "rood" 
            },
            expected: { 
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "41.1": "rood", "42.1": "rood",
                "71.1": "rood", "72.1": "rood"
            }
        },
        { // assuming passBoats is only ready when boats are on sensors
            name: "boats on sensors, bridge closed, passBoats ready - II",
            dataObj: { "81.1": { state: "dicht" } },
            sensors: { "71.1": {voor: false}, "72.1": {voor: true} },
            passBoats: { isReady: true },
            priorityVehicleStatus: undefined,
            start: { // assuming passBoats is just got ready, bridge lights will be green
                "51.1": "groen", "52.1": "groen", 
                "53.1": "groen", "54.1": "groen", 
                "41.1": "groen", "42.1": "groen",
                "72.1": "rood", "71.1": "rood" 
            },
            expected: { 
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "41.1": "rood", "42.1": "rood",
                "71.1": "rood", "72.1": "rood"
            }
        },
        { // assuming passBoats is only ready when boats are on sensors
            name: "boats on sensors, bridge closed, passBoats ready - III",
            dataObj: { "81.1": { state: "dicht" } },
            sensors: { "71.1": {voor: true}, "72.1": {voor: true} },
            passBoats: { isReady: true },
            priorityVehicleStatus: undefined,
            start: { // assuming passBoats is just got ready, bridge lights will be green
                "51.1": "groen", "52.1": "groen", 
                "53.1": "groen", "54.1": "groen", 
                "41.1": "groen", "42.1": "groen",
                "72.1": "rood", "71.1": "rood" 
            },
            expected: { 
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "41.1": "rood", "42.1": "rood",
                "71.1": "rood", "72.1": "rood"
            }
        },
        { // assuming bridge goes open when bridge traffic lights are red
            name: "boats on sensors, bridge open, passBoats ready - I",
            dataObj: { "81.1": { state: "open" } },
            sensors: { "71.1": {voor: true}, "72.1": {voor: false} },
            passBoats: { isReady: true },
            priorityVehicleStatus: undefined,
            start: { // assuming bridge just opened up, that all lights are red
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "41.1": "rood", "42.1": "rood",
                "71.1": "rood", "72.1": "rood"
            },
            expected: { 
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "41.1": "rood", "42.1": "rood",
                "71.1": "groen", "72.1": "rood"
            }
        },
        { // assuming bridge goes open when bridge traffic lights are red
            name: "boats on sensors, bridge open, passBoats ready - II",
            dataObj: { "81.1": { state: "open" } },
            sensors: { "71.1": {voor: false}, "72.1": {voor: true} },
            passBoats: { isReady: true },
            priorityVehicleStatus: undefined,
            start: { // assuming bridge just opened up, that all lights are red
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "41.1": "rood", "42.1": "rood",
                "71.1": "rood", "72.1": "rood"
            },
            expected: { 
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "41.1": "rood", "42.1": "rood",
                "71.1": "rood", "72.1": "groen"
            }
        },
        { // assuming bridge goes open when bridge traffic lights are red
            name: "boats on sensors, bridge open, passBoats ready - III",
            dataObj: { "81.1": { state: "open" } },
            sensors: { "71.1": {voor: true}, "72.1": {voor: true} },
            passBoats: { isReady: true },
            priorityVehicleStatus: undefined,
            start: { // assuming bridge just opened up, that all lights are red
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "41.1": "rood", "42.1": "rood",
                "71.1": "rood", "72.1": "rood"
            },
            expected: { 
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "41.1": "rood", "42.1": "rood",
                "71.1": "groen", "72.1": "rood" // north has priority over south
            }
        },
        {
            name: "boats on sensors, bridge open, passBoats ready - IV",
            dataObj: { "81.1": { state: "open" } },
            sensors: { "71.1": {voor: false}, "72.1": {voor: true} }, // assuming sensor 71.1 is empty, since the traffic light has been green before
            passBoats: { isReady: true },
            priorityVehicleStatus: undefined,
            start: { // 
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "41.1": "rood", "42.1": "rood",
                "71.1": "groen", "72.1": "rood"
            },
            expected: { 
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "41.1": "rood", "42.1": "rood",
                "71.1": "rood", "72.1": "groen" 
            }
        },
        {
            name: "no boats on sensors anymore, bridge open, passBoats ready - V",
            dataObj: { "81.1": { state: "open" } },
            sensors: { "71.1": {voor: false}, "72.1": {voor: false} },
            passBoats: { isReady: true },
            priorityVehicleStatus: undefined,
            start: {
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "41.1": "rood", "42.1": "rood",
                "71.1": "rood", "72.1": "groen"
            },
            expected: { 
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "41.1": "rood", "42.1": "rood",
                "71.1": "rood", "72.1": "rood" 
            },
            expectedPassBoatsIsReady: false // passBoats should be set to false, since no boats are on the sensors anymore
        },
        {
            name: "no boats on sensors, bridge is still open, passBoats not ready",
            dataObj: { "81.1": { state: "open" } },
            sensors: { "71.1": {voor: false}, "72.1": {voor: false} },
            passBoats: { isReady: false },
            priorityVehicleStatus: undefined,
            start: {
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "41.1": "rood", "42.1": "rood",
                "71.1": "rood", "72.1": "rood"
            },
            expected: { // do nothing, since the bridge is still open and no boats are on the sensors
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "41.1": "rood", "42.1": "rood",
                "71.1": "rood", "72.1": "rood" 
            }
        }, // >> Continues to the state of test case 1
        {
            name: "priority vehicle is going to the bridge, passBoats is ready",
            dataObj: { "81.1": { state: "closed" } },
            sensors: { "71.1": {voor: true}, "72.1": {voor: false} },
            passBoats: { isReady: true },
            priorityVehicleStatus: { queue: [{ baan: "4.1", simulatie_tijd_ms: 1231456352542, prioriteit: 1 }] },
            start: {
                "51.1": "groen", "52.1": "groen", 
                "53.1": "groen", "54.1": "groen", 
                "41.1": "groen", "42.1": "groen",
                "72.1": "rood", "71.1": "rood" 
            },
            expected: { // do nothing (yet), since a priority vehicle is incoming
                "51.1": "groen", "52.1": "groen", 
                "53.1": "groen", "54.1": "groen", 
                "41.1": "groen", "42.1": "groen",
                "72.1": "rood", "71.1": "rood" 
            }
        },
        {
            name: "priority vehicle is not to the bridge, passBoats is ready",
            dataObj: { "81.1": { state: "closed" } },
            sensors: { "71.1": {voor: true}, "72.1": {voor: false} },
            passBoats: { isReady: true },
            priorityVehicleStatus: { queue: [{ baan: "1.1", simulatie_tijd_ms: 1231456352542, prioriteit: 1 }] },
            start: {
                "51.1": "groen", "52.1": "groen", 
                "53.1": "groen", "54.1": "groen", 
                "41.1": "groen", "42.1": "groen",
                "72.1": "rood", "71.1": "rood" 
            },
            expected: { // do nothing (yet), since a priority vehicle is incoming
                "51.1": "rood", "52.1": "rood", 
                "53.1": "rood", "54.1": "rood", 
                "41.1": "rood", "42.1": "rood",
                "71.1": "rood", "72.1": "rood" 
            }
        }
    ])(
        "should $name",
        ({ dataObj, sensors, passBoats, start, expected, expectedPassBoatsIsReady, priorityVehicleStatus }) => {
            const startTrafficLightStatusBridge = {
                ...baseStatus,
                ...start
            };
            const expectedTrafficLightStatusBridge = {
                ...baseStatus,
                ...expected
            };
            console.log(priorityVehicleStatus);
            
            const result = getTrafficLightStatusOnSensorBridgeUpdate(
                startTrafficLightStatusBridge,
                dataObj,
                sensors,
                passBoats,
                priorityVehicleStatus
            );

            expect(result).toEqual(expectedTrafficLightStatusBridge);

            if (expectedPassBoatsIsReady !== undefined) {
                // Check if passBoats.isReady is set correctly
                expect(passBoats.isReady).toBe(expectedPassBoatsIsReady);
            }
        }
    );

})
// /**
//  * This script contains schema's that the incomming simulator data should conform to. 
//  */
// const fs = require("fs")
// const Ajv = require("ajv")
// const jsonFile = fs.readFileSync('../config/topic_schemas/sensor_rijbaan.json', 'utf8')
// const roadwaySensorSchema = JSON.parse(jsonFile.toString());
// const ajv = new Ajv()

// // const roadwaySensorSchema = {
// //     "type": "object",
// //     "patternProperties": {
// //         "^\\d+\\.\\d+$": {
// //             "$ref": "#/definitions/stoplicht"
// //         }
// //     },
// //     "required": ["1.1", "22.1", "33.1"],
// //     "definitions": {
// //         "stoplicht": {
// //             "type": "object",
// //             "properties": {
// //                 "voor": {
// //                     "type": "boolean"
// //                 },
// //                 "achter": {
// //                     "type": "boolean"
// //                 }
// //             },
// //             "required": ["voor", "achter"]
// //         }
// //     },
// //     "additionalProperties": false
// // }
// const validate = ajv.compile(roadwaySensorSchema)
// const valid = validate({
//     "1.1": {
//         "voor": false,
//         "achter": false
//     },
//     "22.1": {
//         "voor": true,
//         "achter": false
//     },
// })
// console.log(valid);
// if(!valid) {
//     console.error(validate.errors);
    
// }


// // module.exports = {
// //     roadway,
// //     special,
// //     priorityVehicle
// // }
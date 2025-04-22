/**
 *  This script holds the sensor data container.
 * @author Willem Daniel Visser
 * @version 1.0.0
 */
const Ajv = require("ajv")

/**
 * This class is a sensor data container, which validates and keeps track of the sensor-status send by the simulator.
 */
class SensorDataContainer {
    constructor(schema, refSchema) {
        const ajv = new Ajv({ $data: true })
        if (refSchema) {
            this.validate = ajv.addSchema(refSchema).compile(schema)
            
        } else {
            this.validate = ajv.compile(schema)
            // console.log(this.validate);
        }
    }
    #status

    /**
     * Checks if 'newStatus' has the valid object format(if feature doValidateIncommingData is enabled) and then updates private field 'status'.
     * @param {object} newStatus sensor status send from simulator
     */
    updateStatus(newStatus) {
        if(process.env.doValidateIncommingData == "true") {
            const valid = this.validate(newStatus)
            if(!valid) {
                console.warn("Recieved data from simulator was not in the correct JSON-format:")
                console.warn(this.validate.errors)
            }

        }
        this.#status = newStatus
    }

    /**
     * Get private field 'status'
     */
    get status() {
        return this.#status
    }
}

module.exports = SensorDataContainer
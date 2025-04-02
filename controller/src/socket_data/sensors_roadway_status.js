const yup = require('yup');

async function set(sensorRoadwayStatusData) {
    switch (true) {
        case sensorRoadwayStatusData === undefined:
            throw new TypeError("Incomming sensor roadway statusdata was undefined, will not proceed")
    }
    
    const schema = yup.object().shape({
        "1.1": yup.object().shape({
            voor: yup.boolean().required(),
            achter: yup.boolean().required(),
        }).required(),
        "22.1": yup.object().shape({
            voor: yup.boolean().required(),
            achter: yup.boolean().required(),
        }).required(),
    }).strict(true);
    
    async function validateData(data) {
        try {
            await schema.validate(data);
        } catch (error) {
            console.error("Incoming sensor roadway status data was invalid, will not proceed");
            throw new TypeError(error.errors);
        }
    }
    
    validateData(sensorRoadwayStatusData);
}
const sensorsRoadwayStatus = {
    set
}
module.exports = sensorsRoadwayStatus
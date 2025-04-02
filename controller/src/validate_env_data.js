function checkPorts() {
    switch (true) {
        case process.env.PUB_PORT === undefined:
            throw new Error("Need a port to publish to, please define environment variable 'PUB_PORT'");
        case isNaN(process.env.PUB_PORT):
            throw new Error("The port to publish to, needs to be a number, please check environment variable 'PUB_PORT'");
        case process.env.PUB_PORT < 0 || process.env.PUB_PORT > 65535:
            throw new Error("The port to publish to, needs to be a valid number between 0 and 65535, please check environment variable 'PUB_PORT'");
        case process.env.SUB_PORT === undefined:
            throw new Error("Need a port to subscribe to, please define environment variable 'SUB_PORT'");
        case isNaN(process.env.SUB_PORT):
            throw new Error("The port to subscribe to, needs to be a number, please check environment variable 'SUB_PORT'");
        case process.env.SUB_PORT < 0 || process.env.SUB_PORT > 65535:
            throw new Error("The port to subscribe to, needs to be a valid number between 0 and 65535, please check environment variable 'SUB_PORT'");
    }
}
const validate_env_data = {
    checkPorts
}
module.exports = validate_env_data;
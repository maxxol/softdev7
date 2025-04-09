/**
 * This script is to make sure multiple scripts use sockets with the same ZeroMQ-configuration.
 * @author Willem Daniel Visser
 * @version 1.0.0
 */
const zmq = require("zeromq")

/**
 * Get basic zmq publisher
 * @param {number} port port to publish to
 * @returns promise that the server will be ready
 */
async function getSockPub(port=3000) {
    const sock = new zmq.Publisher()
    await sock.bind(`tcp://${process.env.PUB_IP}:${port}`)
    console.log(`Publishing to full adres: ${process.env.PUB_IP}:${port}`);
    return sock
}

/**
 * Get basic zmq subscriber
 * @param {number} port port to listen to
 * @returns promise that it will be listening
 */
async function getSockSub(port=3001) {
    const sock = new zmq.Subscriber()
    sock.connect(`tcp://${process.env.SUB_IP}:${port}`)
    console.log(`Subscribing to full adres: ${process.env.SUB_IP}:${port}`);
    return sock
}

module.exports = {getSockPub, getSockSub}
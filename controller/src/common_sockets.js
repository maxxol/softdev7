/**
 * This script is to make sure mutiple pubisher-functions will use the same socket and so do mutiple subscribe-functions.
 * 
 * Use example:
 *    async function sendLuck() {
 *      (await get_sock_pub()).send(["myTopic", "Good luck!"])
 *    }
 *    async function getLuck(sock_sub) {
 *      for await (const [topic, msg] of sock_sub) {console.log(`You got mail: ${sock_sub}`)}
 *    } 
 *    async function iWantLuckToo(sock_sub) {
 *      for await (const [topic, msg] of sock_sub) {console.log(`You got mail: ${sock_sub}`)}
 *    }
 *    await get_sock_sub().then((sock_sub) => {
 *      getLuck().then(()=>console.log('luck is comming our way'))
 *      iWantLuckToo().then(()=>console.log('luck is comming this way too!'))
 *    })
 */
const zmq = require("zeromq")

/**
 * Get basic zmq publisher
 * @param {number} port port to publish to
 * @returns promise that the server will be ready
 */
async function getSockPub(port=3000) {
    const sock = new zmq.Publisher()
    await sock.bind(`tcp://127.0.0.1:${port}`)
    return sock 
}

/**
 * 
 * @param {number} port port to listen to
 * @returns promise that it will be listening
 */
async function getSockSub(port=3000) {
    const sock = new zmq.Subscriber()
    sock.connect(`tcp://127.0.0.1:${port}`)
    return sock
}

module.exports = {getSockPub, getSockSub}
/**
 * Entry file for the sending of test data to the controller, mocking the simulator in the traffic simulator.
 * @version 0.1
 * @author Willem Daniel Visser
 */
const {getSockPub, getSockSub} = require("../src/common_sockets");

const startTime = new Date().getTime()

console.debug(`The start time is: ${startTime}`)

/**
 * Logs message informing about the contents of a topic data package and the topic itself.
 * @param {string} topic topic from where information was sent
 * @param {object} publishedData data object that was sent
 */
function messagePublishedData(topic, publishedData) {
    console.log(
      "received a message related to:",
      topic.toString(),
      "containing message:",
      publishedData,
    )
}

/**
 * Starts test sockets that mock the simulator. Sending every 5 seconds some data.
 * * Publishes to: 'sensoren_rijbaan', 'sensoren_speciaal' and 'tijd'.
 * * Subscribes to: 'stoplichten'.
 */
async function startSimulatorTestSockets() {
    const sockPub = await getSockPub(3000)
    const sockSub = await getSockSub(3001)

    sockSub.subscribe("stoplichten")

    setInterval(async () => {
        console.debug("Publishing message as simulator...");
        
        await sockPub.send(["sensoren_rijbaan", JSON.stringify({
            "1.1": {
              "voor": false,
              "achter": false
            },
            "22.1": {
              "voor": true,
              "achter": false
            }
          })]);
        await sockPub.send(["sensoren_speciaal", JSON.stringify({
            "brug_wegdek": true,
            "brug_water": false,
            "brug_file": true
          })]);
        await sockPub.send(["tijd", JSON.stringify({
            "simulatie_tijd_ms": (new Date().getTime() - startTime)
          })]);
		await sockPub.send(["voorrangsvoertuig", JSON.stringify({
			"queue": [
				{
					"baan": "8.2",
					"simulatie_tijd_ms": 1231456352542,
					"prioriteit": 1
				},
				{
					"baan": "3.1",
					"simulatie_tijd_ms": 1231456650000,
					"prioriteit": 2
				}
			]
		})]);
    }, 5000);

    (async () => {
        for await (const [topic, data] of sockSub) {
          	let topicString = topic.toString()
			try {
				let dataObj = JSON.parse(data)
				messagePublishedData(topicString, dataObj)
			} catch (e) {
				console.error("Expected incomming data to be a JSON string")
			}
        }
    })();
}

startSimulatorTestSockets()
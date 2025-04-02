const {getSockSub, getSockPub} = require("../src/common_sockets")
const sockSub = await getSockSub(process.env.SUB_PORT)
const sockPub = await getSockPub(process.env.PUB_PORT)

sockPub.send(["test", "{\"1.1\": \"rood\"}"])

sockSub.subscribe("")
for await (const [topic, data] of sockSub) {
    console.log(`
        Recieved anything from the simulator:
        \n\twith topic: ${topic}
        \n\twith data: ${data}
        `);
    
}
const {getSockSub, getSockPub} = require("../src/common_sockets")
const sockSub = await getSockSub(process.env.SUB_PORT)
const sockPub = await getSockPub(process.env.PUB_PORT)

sockSub.subscribe("test")
for await (const [topic, data] of sockSub) {
    try {
        JSON.parse(data); 
        console.log(`The revieved data is as follows: ${data}`);
        sockPub.send(["test", "{\"1\": \"Dit is een antwoord\"}"]);
    } catch (error) {
        console.log(`The recieved data from topic ${topic}, was not in JSON format, error:${error}`);
    }
}
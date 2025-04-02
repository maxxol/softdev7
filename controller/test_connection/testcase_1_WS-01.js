const {getSockSub} = require("../src/common_sockets")
const sockSub = await getSockSub(process.env.SUB_PORT)

sockSub.subscribe("test")
for await (const [topic, data] of sockSub) {
    console.log(`verbinding geaccepteerd`);
}
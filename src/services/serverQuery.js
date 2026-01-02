const { GameDig } = require('gamedig');

async function getServerStatus() {
    return await GameDig.query({
        type: process.env.SERVER_TYPE,
        host: process.env.SERVER_IP,
        port: process.env.SERVER_PORT
    });
}

module.exports = { getServerStatus };
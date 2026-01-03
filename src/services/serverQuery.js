const { GameDig } = require('gamedig');

async function getServerStatus(ip, port, type) {
    return await GameDig.query({
        type: type,
        host: ip,
        port: port
    });
}

module.exports = { getServerStatus };
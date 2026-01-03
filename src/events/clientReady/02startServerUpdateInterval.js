const serverStatusUpdateInterval = require('../../services/serverStatusInterval');

module.exports = (client) => {
    serverStatusUpdateInterval(client);
};
const db = require('../utils/db');
const { getServerStatus } = require('./serverQuery');
const createEmbed = require('../utils/createEmbed');

async function updateEmbeds(client) {
    const trackedServers = db.prepare('SELECT * FROM tracked_servers').all();

    for (const server of trackedServers) {
        try {
            let serverStatus = null
            try {
                serverStatus = await getServerStatus(server.ip, server.port, server.server_type);
            } catch (error) {}
            let message = null;
            try {
                const channel = await client.channels.fetch(server.channel_id)
                message = await channel.messages.fetch(server.message_id);
            } catch (error) {}
            if (!message) {
                const deleteStmt = db.prepare('DELETE FROM tracked_servers WHERE message_id = ?');
                deleteStmt.run(server.message_id);
                console.log(`Deleted tracking for missing message ID: ${server.message_id}`);
                continue;
            }
            const embed = await createEmbed(serverStatus, server.ip, server.port, server.server_type);
            if (embed) {
                await message.edit({ embeds: [embed] });
            }
        } catch (error) {
            console.error(`Error updating embed for server ${server.embed_id}:`, error);
        }
    }
}

module.exports = (client) => {
    updateEmbeds(client); 
    setInterval(() => updateEmbeds(client), process.env.SERVER_STATUS_UPDATE_INTERVAL * 60 * 1000);
};
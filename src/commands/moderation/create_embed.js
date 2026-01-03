const {  PermissionsBitField, MessageFlags } = require('discord.js');
const { getServerStatus } = require('../../services/serverQuery');
const createEmbed = require('../../utils/createEmbed');
const db = require('../../utils/db');

module.exports =  {
    name: 'create_embed',
    description: 'Creates an embed message for the server status.',
    deleted: false,
    permissionsRequired: [PermissionsBitField.Flags.Administrator],
    botPermissions: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.ManageMessages],

    callback: async (client, interaction) => {
        const supportedServers = process.env.SUPPORTED_SERVERS ? process.env.SUPPORTED_SERVERS.split(',') : [];
        if (!supportedServers.includes(process.env.SERVER_TYPE)) {
            interaction.reply({content: `Server type ${process.env.SERVER_TYPE} is not supported yet.` , flags: [MessageFlags.Ephemeral]});
            return;
        }

        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const { SERVER_IP: ip, SERVER_PORT: port, SERVER_TYPE: type } = process.env;

        let serverStatus = null;
        try {
            serverStatus = await getServerStatus(ip, port, type);
        } catch (error) {
            console.error("Error fetching server status:", error);
            interaction.editReply({content: 'Failed to reach server.'});
            return;
        }
        const embed = await createEmbed(serverStatus, ip, port, type);
        if (embed === null) {
            interaction.editReply({content: 'Failed to create server status embed.'});
        } else {
            const message = await interaction.channel.send({ embeds: [embed] });
            const insert = db.prepare(`
                INSERT INTO tracked_servers (message_id, channel_id, author_id, server_type, ip, port)
                VALUES (?, ?, ?, ?, ?, ?)
            `);
            insert.run(
                message.id,
                interaction.channel.id,
                interaction.user.id,
                type,
                ip,
                port
            );
            interaction.editReply({content: 'Server status embed created successfully.'});
        }
    }
}
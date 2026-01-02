const {  PermissionsBitField, MessageFlags } = require('discord.js');
const { getServerStatus } = require('../../services/serverQuery');
const createEmbed = require('../../utils/createEmbed');

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

        let serverStatus = null;
        try {
            serverStatus = await getServerStatus();
        } catch (error) {
            console.error("Error fetching server status:", error);
            interaction.editReply({content: 'Failed to reach server.'});
            return;
        }

        if (!createEmbed(serverStatus, interaction)) {
            interaction.editReply({content: 'Failed to create server status embed.'});
        } else {
            interaction.editReply({content: 'Server status embed created successfully.'});
        }
    }
}
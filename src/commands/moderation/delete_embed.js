const {  PermissionsBitField, MessageFlags, ApplicationCommandOptionType } = require('discord.js');
const db = require('../../utils/db');

module.exports =  {
    name: 'delete_embed',
    description: 'Deletes a server status embed message and stops tracking the server.',
    deleted: false,
    permissionsRequired: [PermissionsBitField.Flags.Administrator],
    botPermissions: [PermissionsBitField.Flags.ManageMessages],
    options: [
        {
            name: 'message_id',
            description: 'The ID of the embed message to delete.',
            required: true,
            type: ApplicationCommandOptionType.String
        }
    ],

    callback: async (client, interaction) => {
        const messageId = interaction.options.getString('message_id');

        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const trackedServer = db.prepare('SELECT * FROM tracked_servers WHERE message_id = ?').get(messageId);

        if (!trackedServer) {
            interaction.editReply({content: 'No tracked server found with the provided message ID.', flags: [MessageFlags.Ephemeral]});
            return;
        }
        try {
            const channel = await client.channels.fetch(trackedServer.channel_id);
            const message = await channel.messages.fetch(messageId);

            if (message) {
                await message.delete();
            }
        } catch (error) {
            console.error(`Error deleting message with ID ${messageId}:`, error);
        }

        db.prepare('DELETE FROM tracked_servers WHERE message_id = ?').run(messageId);
        interaction.editReply({content: 'Server status embed deleted and tracking stopped.', flags: [MessageFlags.Ephemeral]});
    }
};
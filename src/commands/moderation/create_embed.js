const {  PermissionsBitField, MessageFlags } = require('discord.js');

module.exports = {
    name: 'create_embed',
    description: 'Creates an embed message for the server status.',
    deleted: false,
    permissionsRequired: [PermissionsBitField.Flags.Administrator],
    botPermissions: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.ManageMessages],

    callback: (client, interaction) => {
        interaction.reply({ content: 'Embed created!', flags: [MessageFlags.Ephemeral]});
    }
}
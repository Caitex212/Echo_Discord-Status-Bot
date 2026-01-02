const getLocalCommands = require("../../utils/getLocalCommands");

module.exports = async (client, interaction) => {
    if (!interaction.isCommand()) return;

    const localCommands = getLocalCommands();

    try {
        const command = localCommands.find(cmd => cmd.name === interaction.commandName);
        if (!command) {
            console.warn(`No command found for interaction: ${interaction.commandName}`);
            return;
        }

        if (command.permissionsRequired?.length) {
            for (const permission of command.permissionsRequired) {
                if (!interaction.member.permissions.has(permission)) {
                    interaction.reply({ content: "You do not have permission to use this command.", flags: [MessageFlags.Ephemeral]});
                    return;
                }
            }
        }

        if (command.botPermissions?.length) {
            for (const permission of command.botPermissions) {
                if (!interaction.guild.members.me.permissions.has(permission)) {
                    interaction.reply({ content: "I do not have the required permissions to execute this command.", flags: [MessageFlags.Ephemeral]});
                    return;
                }
            }
        }

        await command.callback(client, interaction);
    } catch (error) {
        console.error("Error handling command interaction:", error);
    }
}
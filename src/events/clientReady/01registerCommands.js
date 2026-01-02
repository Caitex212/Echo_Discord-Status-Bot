const areCommandsDifferent = require("../../utils/areCommandsDifferent");
const getApplicationCommands = require("../../utils/getApplicationCommands");
const getLocalCommands = require("../../utils/getLocalCommands")

module.exports = async (client) => {
    try {
        const localCommands = getLocalCommands();
        const applicationCommands = await getApplicationCommands(client, process.env.GUILD_ID);

        for (const localCommand of localCommands) {
            const { name, description, options } = localCommand;

            const existingCommand = await applicationCommands.cache.find(cmd => cmd.name === name);

            if (existingCommand) {
                if (localCommand.deleted) {
                    await applicationCommands.delete(existingCommand.id);
                    console.log(`Deleted command: ${name}`);
                    continue;
                }

                if (areCommandsDifferent(existingCommand, localCommand)) {
                    await applicationCommands.edit(existingCommand.id, {
                        description,
                        options
                    });
                    console.log(`Updated command: ${name}`);
                }
            } else {
                if (localCommand.deleted) {
                    console.log(`Skipping deleted command: ${name}`);
                    continue;
                }
                
                await applicationCommands.create({
                    name,
                    description,
                    options
                });
                console.log(`Created command: ${name}`);
            }
        }

    } catch (error) {
        console.error("Error registering commands:", error);
    }
}
const GAME_LIST = require("../../utils/GAME_LIST");

module.exports = async (client, interaction) => {
    if (!interaction.isAutocomplete()) return;
    if (interaction.commandName !== 'create_embed') return;

    const focused = interaction.options.getFocused().toLowerCase();

    const results = GAME_LIST
        .filter(g => g.search.includes(focused))
        .slice(0, 25);

    await interaction.respond(
        results.map(g => ({
        name: g.name,
        value: g.value
        }))
    );
}
const {SlashCommandBuilder} = require("discord.js");

const emojis = ['😘']

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Start a fruit guessing game.'),
    execute: async (interaction) => {
        const message = await interaction.reply({content: "Click the emoji to get role", fetchReply: true});

        console.log(interaction)
        const filter = (reaction, user) => {
            console.log(`reaction: ${JSON.stringify(reaction)}`);
            return reaction.emoji.name === '👍' && !user.bot;
        };

        message.awaitReactions({filter, max:4, time: 10_000, errors: ['time']})
            .then(collected => console.log("Success collected: ", collected))
            .catch(collected => console.log(collected));

        message.react('👍');
    },
};

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kioto')
        .setDescription('Команда посвящена Илюхе Киото'),
    async execute(interaction) {
        await interaction.reply({content: "Ненавижу тёлок, я бы предпочёл хуи \n\n Я бы проституткой стал, но точно не как вы", ephemeral: true});
    },
};
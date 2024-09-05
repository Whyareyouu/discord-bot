const {SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require('discord.js');
const {Events} = require("../../dbModels.js");
const {sequelize} = require("../../dbInit.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce-event')
        .setDescription('Provides information about the user.'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setImage('https://media1.tenor.com/m/Bh1zvwlUKWgAAAAC/anime-tyan.gif')
            .setDescription('**С помощью этой консоли вы можете легко объявить новый ивент для всех участников сервера! Просто введите необходимые данные и опубликуйте анонс — система автоматически создаст запись, отправит уведомления и позволит игрокам зарегистрироваться.**')


        const announce_event = new ButtonBuilder()
            .setCustomId('announce_event')
            .setLabel('Анонсировать событие')
            .setStyle(ButtonStyle.Secondary);

        const announceEventActionRow = new ActionRowBuilder()
            .addComponents(announce_event);

        await interaction.reply({embeds: [embed], components: [announceEventActionRow]});


    },
};